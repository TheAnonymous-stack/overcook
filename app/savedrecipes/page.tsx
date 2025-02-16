"use client";

import SavedRecipes from "@/components/SavedRecipes";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 font-sans text-black">
      <SavedRecipes />
    </div>
  );
}
