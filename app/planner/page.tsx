"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

// Initialize Supabase client
const supabase = createClient();

export default function NutritionPage() {
  const [numberOfMeals, setNumberOfMeals] = useState(0); // State for number of meals
  const [weeklyGoal, setWeeklyGoal] = useState("balanced"); // State for weekly goal
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]); // State for selected cuisines

  // Static list of all possible cuisines
  const allCuisines = [
    "African",
    "Asian",
    "American",
    "British",
    "Cajun",
    "Caribbean",
    "Chinese",
    "Eastern European",
    "European",
    "French",
    "German",
    "Greek",
    "Indian",
    "Irish",
    "Italian",
    "Japanese",
    "Jewish",
    "Korean",
    "Latin American",
    "Mediterranean",
    "Mexican",
    "Middle Eastern",
    "Nordic",
    "Southern",
    "Spanish",
    "Thai",
    "Vietnamese",
  ];

  // Filter cuisines based on the search query
  const filteredCuisines = allCuisines.filter((cuisine) =>
    cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Generate meal options (0 - 10)
  const mealOptions = Array.from({ length: 11 }, (_, i) => i);

  // Handle cuisine selection
  const handleCuisineSelect = (cuisine: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine)
        ? prev.filter((item) => item !== cuisine) // Deselect if already selected
        : [...prev, cuisine] // Select if not already selected
    );
  };

// Handle confirming the plan
const confirmPlan = async () => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;
    const numberOfRecipes = 7 * numberOfMeals; // Calculate total recipes for the week

    // Convert selected cuisines to lowercase
    const lowercaseCuisines = selectedCuisines.map((cuisine) =>
      cuisine.toLowerCase()
    );

    // Build the API query based on selected options
    const queryParams = new URLSearchParams({
      apiKey: apiKey || "", // Include the API key
      number: numberOfRecipes.toString(), // Number of recipes to fetch
      "include-tags": lowercaseCuisines.join(","), // Filter by selected cuisines (lowercase)
    });

    // Fetch recipes from Spoonacular API
    const response = await fetch(
      `https://api.spoonacular.com/recipes/random?${queryParams}`
    );
    const recipesData = await response.json(); // Renamed to avoid conflict
    console.log("Fetched recipes for the week:", recipesData.recipes); // Log fetched recipes

    // Organize recipes by day in a round-robin fashion
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const currentWeekPlan: Record<string, any[]> = {}; // Use Record to allow string indexing

    // Initialize each day with an empty array
    daysOfWeek.forEach((day) => {
      currentWeekPlan[day] = [];
    });

    // Distribute recipes evenly across days
    recipesData.recipes.forEach((recipe: any, index: number) => {
      const day = daysOfWeek[index % daysOfWeek.length]; // Round-robin assignment
      currentWeekPlan[day].push(recipe);
    });

    const { data: { user } } = await supabase.auth.getUser();

    // Update user data in Supabase
    const { data: supabaseData, error } = await supabase
      .from("overcook_users")
      .update({ current_week_plan: currentWeekPlan }) // Update with the structured plan
      .eq("id", user?.id)
      .select();

    if (error) {
      console.error("Error updating Supabase:", error);
      alert("Failed to update user data. Please try again.");
      return;
    }

    console.log("Updated user data in Supabase:", supabaseData);
    alert("Plan confirmed! Check the console for details."); // Notify the user
  } catch (error) {
    console.error("Error confirming plan:", error);
    alert("Failed to confirm plan. Please try again.");
  }
};

  return (
    <div className="min-h-screen bg-white p-6 text-black">
      <h1 className="text-3xl font-bold text-center mb-8">Nutrition Planner</h1>

      {/* Meals Dropdown */}
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">Number of Meals</label>
        <select
          value={numberOfMeals}
          onChange={(e) => setNumberOfMeals(Number(e.target.value))}
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {mealOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Weekly Goal Dropdown */}
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">Weekly Goal</label>
        <select
          value={weeklyGoal}
          onChange={(e) => setWeeklyGoal(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="cutting">Cutting</option>
          <option value="bulking">Bulking</option>
          <option value="balanced">Balanced</option>
        </select>
      </div>

      {/* Cuisines and Foods Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Cuisines and Foods</h2>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search cuisines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Grid of All Possible Cuisines */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCuisines.map((cuisine, index) => (
            <div
              key={index}
              onClick={() => handleCuisineSelect(cuisine)} // Toggle selection on click
              className={`p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer ${
                selectedCuisines.includes(cuisine)
                  ? "bg-blue-100 border-2 border-blue-500" // Selected style
                  : "bg-gray-100" // Default style
              }`}
            >
              <h3 className="text-lg font-semibold mb-2">{cuisine}</h3>
              <p className="text-gray-700">Explore {cuisine} cuisine.</p>
            </div>
          ))}
        </div>
      </div>

      {/* Display Selected Cuisines */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Selected Cuisines</h3>
        <div className="flex flex-wrap gap-2">
          {selectedCuisines.map((cuisine, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              {cuisine}
            </span>
          ))}
        </div>
      </div>

      {/* Confirm Plan Button */}
      <div className="mt-8 text-center">
        <button
          onClick={confirmPlan}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
        >
          Confirm Plan
        </button>
      </div>
    </div>
  );
}