"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

const supabase = createClient();

export default function SavedRecipes() {
  const [recipes, setRecipes] = useState<{ id: string; name: string; image: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSavedRecipes() {
      try {
        const { data: user, error: authError } = await supabase.auth.getUser();
        if (authError || !user?.user) {
          console.error("Error fetching user:", authError);
          setLoading(false);
          return;
        }

        // Fetch saved recipe IDs from overcook_users table
        const { data: userData, error: userError } = await supabase
          .from("overcook_users")
          .select("saved_recipes")
          .eq("id", user.user.id)
          .single();

        if (userError || !userData?.saved_recipes) {
          console.error("Error fetching saved recipes:", userError);
          setLoading(false);
          return;
        }

        const savedRecipeIds = Array.isArray(userData?.saved_recipes) ? userData.saved_recipes : [];

        // Fetch full recipe details including images
        const { data: recipes, error: recipesError } = await supabase
          .from("saved_recipes")
          .select("id, name, image") // Ensure image_url exists in your database
          .in("id", userData.saved_recipes);

        if (recipesError) {
          console.error("Error fetching recipes:", recipesError);
        } else {
          setRecipes(recipes ?? []);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSavedRecipes();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 font-sans text-black">
      {/* Top Blue Bar */}
      <div className="w-full bg-blue-500 text-white py-4 text-center text-lg font-semibold fixed top-0 left-0 right-0 shadow-md">
        <Link href="/dashboard" className="hover:underline">&larr; Dashboard</Link>
      </div>

      <h1 className="text-3xl font-bold mt-16">Saved Recipes</h1>
      
      {loading ? (
        <p className="text-lg mt-4">Loading...</p>
      ) : recipes.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                src={recipe.image}
                alt={recipe.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-center">{recipe.name}</h2>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-lg mt-4">You have no saved recipes yet.</p>
      )}
    </div>
  );
}
