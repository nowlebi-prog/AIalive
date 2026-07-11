import { RecipeForm } from "../RecipeForm";

export default function NewRecipePage() {
  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <h1 className="text-[20px] font-bold text-text-dark mb-6">새 레시피 작성</h1>
      <RecipeForm mode="create" />
    </div>
  );
}
