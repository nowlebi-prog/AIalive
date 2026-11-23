"""
커버용 음원 분리기
- 원곡 → MR(inst) / 메인 보컬 / 백보컬
- 옵션: MR+백보컬 합본, MR을 드럼/베이스/기타 악기로 추가 분리
"""

import os
import re
import shutil
import sys
import time
import traceback
import subprocess
from pathlib import Path

import numpy as np
import soundfile as sf
import gradio as gr

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "models"
OUTPUT_ROOT = BASE_DIR / "결과"
WORK_DIR = BASE_DIR / "_work"

# 1단계: 보컬 / MR 분리 모델
VOCAL_MODELS = {
    "BS-RoFormer (추천, 고품질)": "model_bs_roformer_ep_317_sdr_12.9755.ckpt",
    "MDX-Net Inst HQ3 (빠름)": "UVR-MDX-NET-Inst_HQ_3.onnx",
}

# 2단계: 메인 보컬 / 백보컬 분리 모델 (카라오케 모델)
KARAOKE_MODELS = {
    "Mel-RoFormer Karaoke (추천)": "mel_band_roformer_karaoke_aufr33_viperx_sdr_10.1956.ckpt",
    "Mel-RoFormer Karaoke v2 (Gabox)": "mel_band_roformer_karaoke_gabox_v2.ckpt",
    "BS-RoFormer Karaoke (becruily)": "bs_roformer_karaoke_frazer_becruily.ckpt",
    "MDX-Net Karaoke 2 (빠름)": "UVR_MDXNET_KARA_2.onnx",
}

# 옵션: MR 악기 분리
DEMUCS_MODEL = "htdemucs_ft.yaml"


def setup_ffmpeg():
    """mp3/m4a 등을 읽으려면 ffmpeg가 필요. 없으면 static-ffmpeg로 자동 준비."""
    if shutil.which("ffmpeg"):
        return
    try:
        import static_ffmpeg

        static_ffmpeg.add_paths()
    except Exception as e:  # noqa: BLE001
        print(f"[경고] ffmpeg 준비 실패: {e}  (wav 파일은 그대로 사용 가능)")


def gpu_status() -> str:
    try:
        import torch

        if torch.cuda.is_available():
            return f"✅ GPU 사용 중: {torch.cuda.get_device_name(0)}"
        return "⚠️ GPU를 못 찾아서 CPU로 돌아갑니다 (느려요). install.bat를 다시 실행해 보세요."
    except Exception as e:  # noqa: BLE001
        return f"⚠️ torch 확인 실패: {e}"


def safe_name(name: str) -> str:
    name = re.sub(r'[\\/:*?"<>|]', "_", name).strip()
    return name or "song"


def find_stem(files, keyword):
    for f in files:
        if f"({keyword})" in os.path.basename(f):
            return f
    raise RuntimeError(f"'{keyword}' 결과 파일을 찾지 못했어요: {files}")


def run_model(model_file, input_path, out_dir):
    from audio_separator.separator import Separator

    Path(out_dir).mkdir(parents=True, exist_ok=True)
    separator = Separator(
        model_file_dir=str(MODEL_DIR),
        output_dir=str(out_dir),
        output_format="WAV",
    )
    separator.load_model(model_filename=model_file)
    files = separator.separate(str(input_path))
    return [str(Path(out_dir) / os.path.basename(f)) for f in files]


def mix_wavs(paths, out_path):
    """여러 wav를 더해서 하나로. 클리핑 나면 자동으로 볼륨 낮춤."""
    datas, sr = [], None
    for p in paths:
        d, r = sf.read(p, always_2d=True, dtype="float32")
        if sr is None:
            sr = r
        elif r != sr:
            raise RuntimeError("샘플레이트가 달라서 합칠 수 없어요.")
        datas.append(d)
    n = min(d.shape[0] for d in datas)
    ch = max(d.shape[1] for d in datas)
    out = np.zeros((n, ch), dtype=np.float32)
    for d in datas:
        if d.shape[1] != ch:
            d = np.repeat(d[:, :1], ch, axis=1)
        out += d[:n]
    peak = float(np.max(np.abs(out))) if out.size else 0.0
    if peak > 0.999:
        out *= 0.999 / peak
    sf.write(out_path, out, sr, subtype="PCM_24")


def separate(audio_path, vocal_model_label, karaoke_model_label, make_mr_plus_back,
             split_instruments, out_format, progress=gr.Progress()):
    if not audio_path:
        raise gr.Error("음원 파일을 먼저 올려 주세요.")

    song = safe_name(Path(audio_path).stem)
    out_dir = OUTPUT_ROOT / song
    out_dir.mkdir(parents=True, exist_ok=True)
    work = WORK_DIR / f"{song}_{int(time.time())}"
    work.mkdir(parents=True, exist_ok=True)
    MODEL_DIR.mkdir(parents=True, exist_ok=True)

    ext = out_format.lower()
    t0 = time.time()
    log = []

    try:
        # 1단계: 보컬 / MR
        progress(0.05, desc="1/3 보컬과 MR 분리 중... (첫 실행은 모델 다운로드로 오래 걸려요)")
        files1 = run_model(VOCAL_MODELS[vocal_model_label], audio_path, work / "s1")
        vocals = find_stem(files1, "Vocals")
        inst = find_stem(files1, "Instrumental")
        log.append("✔ 보컬/MR 분리 완료")

        # 2단계: 보컬 → 메인 / 백보컬
        progress(0.45, desc="2/3 메인 보컬과 백보컬 분리 중...")
        files2 = run_model(KARAOKE_MODELS[karaoke_model_label], vocals, work / "s2")
        lead = find_stem(files2, "Vocals")
        back = find_stem(files2, "Instrumental")
        log.append("✔ 메인/백보컬 분리 완료")

        # 결과 정리
        progress(0.8, desc="3/3 파일 정리 중...")
        results = {}

        def save(src_wav, name):
            dst = out_dir / f"{name}.{ext}"
            if ext == "wav":
                shutil.copyfile(src_wav, dst)
            else:
                cmd = ["ffmpeg", "-y", "-loglevel", "error", "-i", str(src_wav)]
                cmd += ["-b:a", "320k"] if ext == "mp3" else []
                cmd.append(str(dst))
                subprocess.run(cmd, check=True)
            results[name] = str(dst)
            return str(dst)

        save(inst, "1_MR")
        save(lead, "2_메인보컬")
        save(back, "3_백보컬")
        save(vocals, "4_보컬전체")

        if make_mr_plus_back:
            mixed = work / "mr_plus_back.wav"
            mix_wavs([inst, back], mixed)
            save(str(mixed), "5_MR+백보컬")
            log.append("✔ MR+백보컬 합본 생성")

        if split_instruments:
            progress(0.85, desc="추가: MR을 드럼/베이스/기타 악기로 분리 중...")
            files3 = run_model(DEMUCS_MODEL, inst, work / "s3")
            names = {"Drums": "6_드럼", "Bass": "7_베이스", "Other": "8_기타악기"}
            for key, name in names.items():
                try:
                    save(find_stem(files3, key), name)
                except RuntimeError:
                    pass
            log.append("✔ 악기 분리 완료")

        elapsed = time.time() - t0
        log.append(f"\n⏱ 걸린 시간: {elapsed:.0f}초")
        log.append(f"📁 저장 위치: {out_dir}")
        progress(1.0, desc="완료!")

        return (
            results.get("1_MR"),
            results.get("2_메인보컬"),
            results.get("3_백보컬"),
            results.get("5_MR+백보컬"),
            list(results.values()),
            "\n".join(log),
        )
    except gr.Error:
        raise
    except Exception as e:  # noqa: BLE001
        traceback.print_exc()
        raise gr.Error(f"분리 중 오류: {e}")
    finally:
        shutil.rmtree(work, ignore_errors=True)


def open_output_folder():
    OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
    if sys.platform.startswith("win"):
        os.startfile(str(OUTPUT_ROOT))  # type: ignore[attr-defined]
    elif sys.platform == "darwin":
        subprocess.Popen(["open", str(OUTPUT_ROOT)])
    else:
        subprocess.Popen(["xdg-open", str(OUTPUT_ROOT)])


def build_ui():
    with gr.Blocks(title="커버용 음원 분리기") as demo:
        gr.Markdown("# 🎤 커버용 음원 분리기\n원곡을 올리면 **MR / 메인 보컬 / 백보컬**로 나눠 드려요.")
        gr.Markdown(gpu_status())

        with gr.Row():
            with gr.Column(scale=1):
                audio_in = gr.Audio(label="원곡 파일 (mp3, wav, flac, m4a...)", type="filepath")
                with gr.Accordion("설정", open=False):
                    vocal_model = gr.Dropdown(list(VOCAL_MODELS), value=list(VOCAL_MODELS)[0],
                                              label="1단계: 보컬/MR 분리 모델")
                    karaoke_model = gr.Dropdown(list(KARAOKE_MODELS), value=list(KARAOKE_MODELS)[0],
                                                label="2단계: 메인/백보컬 분리 모델",
                                                info="백보컬이 잘 안 나뉘면 다른 모델로 바꿔 보세요")
                    out_format = gr.Radio(["wav", "flac", "mp3"], value="wav", label="저장 형식")
                mr_plus_back = gr.Checkbox(value=True, label="MR+백보컬 합본도 만들기 (커버 녹음용)")
                split_inst = gr.Checkbox(value=False, label="MR을 드럼/베이스/기타악기로도 나누기 (시간 더 걸림)")
                run_btn = gr.Button("🎵 분리 시작", variant="primary", size="lg")
                folder_btn = gr.Button("📁 결과 폴더 열기")

            with gr.Column(scale=1):
                out_mr = gr.Audio(label="MR (inst)", type="filepath")
                out_lead = gr.Audio(label="메인 보컬", type="filepath")
                out_back = gr.Audio(label="백보컬", type="filepath")
                out_mix = gr.Audio(label="MR + 백보컬", type="filepath")
                out_files = gr.File(label="전체 파일 다운로드", file_count="multiple")
                status = gr.Textbox(label="상태", lines=6)

        run_btn.click(
            separate,
            inputs=[audio_in, vocal_model, karaoke_model, mr_plus_back, split_inst, out_format],
            outputs=[out_mr, out_lead, out_back, out_mix, out_files, status],
        )
        folder_btn.click(open_output_folder)
    return demo


if __name__ == "__main__":
    setup_ffmpeg()
    OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
    build_ui().queue().launch(
        inbrowser=True,
        server_name="127.0.0.1",
        allowed_paths=[str(OUTPUT_ROOT)],
    )
