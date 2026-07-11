-- Run after schema.sql + rls.sql. Optional but useful for local development / demo.

insert into recipes (title, slug, summary, target_users, categories, tools, difficulty, estimated_time, estimated_cost, is_public, is_premium)
values
  (
    '3시간 만에 개인 홈페이지 만들기',
    'personal-homepage-in-3-hours',
    'AI로 기획부터 디자인, 퍼블리싱까지 빠르게 완성하는 웹사이트 제작 레시피.',
    array['1인사업자/프리랜서'],
    array['홈페이지'],
    array['ChatGPT','Claude','Vercel'],
    '가벼움', '3시간', '무료',
    true, false
  ),
  (
    '릴스 10개 기획안 한 번에 뽑기',
    'reels-10-ideas-at-once',
    '주제만 입력하면 트렌디한 릴스 콘텐츠를 자동으로 기획해요.',
    array['소상공인'],
    array['콘텐츠'],
    array['ChatGPT','Canva'],
    '보통', '1시간', '무료',
    true, false
  ),
  (
    '반복 업무 리스트 정리하기',
    'organize-repetitive-tasks',
    '긴 업무 목록을 핵심만 요약하고 깔끔하게 정리해요.',
    array['직장인/실무자'],
    array['업무정리'],
    array['ChatGPT','Notion'],
    '가벼움', '30분', '무료',
    true, false
  )
on conflict (slug) do nothing;

-- Full 6-step walkthrough for the flagship demo recipe
insert into recipe_steps (recipe_id, step_order, title, description, checklist, prompt_text, tip)
select r.id, s.step_order, s.title, s.description, s.checklist::jsonb, s.prompt_text, s.tip
from recipes r
join (
  values
    (1, '준비하기',
     '프로젝트 시작 전, 필요한 도구를 준비하고 기본 환경을 설정해요.',
     '[{"label":"작업 폴더 만들기"},{"label":"GitHub 저장소 만들기"},{"label":"기본 파일 생성"}]',
     '3시간 안에 완성 가능한 개인 홈페이지를 만들기 위한 단계별 가이드를 작성해줘. 초보자가 따라할 수 있도록 자세하게 설명해줘.',
     '작은 단계를 하나씩 완성하면, 어느새 멋진 결과물이 완성되어 있을 거예요!'),
    (2, '기획하기',
     '어떤 내용을 담을지, 페이지 구조는 어떻게 할지 AI와 함께 정리해요.',
     '[{"label":"홈페이지 목적 한 줄로 정리하기"},{"label":"필요한 섹션 나열하기"},{"label":"레퍼런스 사이트 2~3개 찾기"}]',
     '1인 프리랜서 개인 홈페이지를 만들려고 해. 자기소개, 포트폴리오, 연락처가 들어가는 한 페이지 구조를 섹션별로 제안해줘.',
     '처음부터 완벽할 필요 없어요. 핵심 섹션만 먼저 정하고 시작해도 충분해요.'),
    (3, '디자인하기',
     '컬러, 폰트, 톤앤매너를 정하고 화면 레이아웃 초안을 잡아요.',
     '[{"label":"메인 컬러 1~2개 정하기"},{"label":"폰트 스타일 정하기"},{"label":"레이아웃 와이어프레임 그리기"}]',
     '차분하고 신뢰감 있는 느낌의 1인 프리랜서 홈페이지 컬러 팔레트와 폰트 조합을 3가지 제안해줘.',
     '색은 2가지, 폰트는 1~2가지로 제한하면 훨씬 정돈되어 보여요.'),
    (4, '만들기',
     'HTML/CSS/JS로 실제 페이지를 만들어요. AI에게 코드를 요청해도 좋아요.',
     '[{"label":"index.html 기본 구조 작성"}, {"label":"섹션별 콘텐츠 채우기"}, {"label":"반응형 스타일 적용"}]',
     '위에서 정한 구조와 컬러로 반응형 개인 홈페이지 HTML/CSS 코드를 작성해줘. 모바일에서도 깔끔하게 보이도록 해줘.',
     '한 번에 완성하려 하지 말고, 섹션 하나씩 만들고 확인하면서 진행하세요.'),
    (5, '배포하기',
     '완성된 페이지를 실제 주소로 배포해서 누구나 볼 수 있게 만들어요.',
     '[{"label":"GitHub에 코드 올리기"}, {"label":"Vercel과 저장소 연결하기"}, {"label":"배포 후 링크 확인하기"}]',
     'GitHub 저장소를 Vercel과 연결해서 배포하는 방법을 순서대로 설명해줘.',
     '배포 URL은 나중에 커스텀 도메인으로 바꿀 수 있으니 지금은 기본 주소로도 충분해요.'),
    (6, '점검하기',
     '실제로 여러 화면 크기에서 확인하고 마지막으로 다듬어요.',
     '[{"label":"모바일/데스크톱 화면 확인"}, {"label":"오탈자·링크 점검"}, {"label":"지인에게 피드백 받기"}]',
     '완성된 홈페이지를 점검할 때 꼭 확인해야 할 체크리스트를 만들어줘.',
     '완벽하지 않아도 괜찮아요. 배포 후에도 언제든 다시 수정할 수 있어요.')
) as s(step_order, title, description, checklist, prompt_text, tip)
  on true
where r.slug = 'personal-homepage-in-3-hours'
on conflict (recipe_id, step_order) do nothing;

-- Lightweight single-step placeholders for the other two demo recipes
insert into recipe_steps (recipe_id, step_order, title, description, checklist, prompt_text, tip)
select r.id, 1, '준비하기', '레시피를 시작하기 전에 필요한 정보를 정리해요.',
  '[{"label":"주제/상품 정보 정리하기"}]'::jsonb,
  '아래 정보를 참고해서 결과물을 만들어줘: [여기에 정보를 입력하세요]',
  '구체적으로 입력할수록 더 좋은 결과가 나와요.'
from recipes r
where r.slug in ('reels-10-ideas-at-once', 'organize-repetitive-tasks')
on conflict (recipe_id, step_order) do nothing;

-- To make yourself an admin after your first login:
-- update profiles set role = 'admin' where email = 'you@example.com';
