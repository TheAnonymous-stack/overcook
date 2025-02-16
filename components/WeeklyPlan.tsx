"use client";

import { useState } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/utils/supabase/client";


const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];


const supabase = createClient();

async function getUserAllergies(userId: string) {
  const { data, error } = await supabase
    .from("overcook_users")
    .select("allergies")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching user allergies:", error);
    return null;
  }
  if (data.allergies.length === 0) {
    return "";
  }
  return data.allergies.join(",").toLowerCase(); // returns string like "dairy, gluten"
}

async function getRandomRecipe(userId: string) {
  const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;
  const allergies = await getUserAllergies(userId);

  let url;
  if (allergies == "") {
    url = `https://api.spoonacular.com/recipes/random?number=21&apiKey=${apiKey}`;
  } else {
    url = `https://api.spoonacular.com/recipes/random?number=21&exclude-tags=${encodeURIComponent(allergies)}&apiKey=${apiKey}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return [];
  }
}


function formatWeeklyPlan(recipeData: { recipes: any; }) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const formattedPlan: { [key: string]: any[] } = {};

  // Extract the recipes list from the API response
  const recipes = recipeData.recipes;

  if (!recipes || recipes.length < 21) {
    console.error("Not enough recipes returned from API");
    return {};
  }

  // Assign 3 recipes per day
  for (let i = 0; i < days.length; i++) {
    formattedPlan[days[i]] = recipes.slice(i * 3, i * 3 + 3);
  }

  return formattedPlan; // Returns structured weekly plan
}


async function saveMealPlanToSupabase(userId: string) {
  // Generate the formatted weekly plan
  const recipeData = await getRandomRecipe(userId); // Fetch random recipes
  const formattedPlan = formatWeeklyPlan(recipeData); // Format the recipes into a weekly plan

  if (Object.keys(formattedPlan).length === 0) {
    console.error("Formatted plan is empty. Skipping Supabase update.");
    return;
  }


  const { error } = await supabase
    .from("overcook_users")
    .update({ curr_plan: formattedPlan }) // Store plan in the database
    .eq("user_id", userId);

  if (error) {
    console.error("Error saving meal plan to Supabase:", error);
  } else {
    console.log("Meal plan successfully saved to Supabase!");
  }
}





export default function WeeklyPlan() {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [meals, setMeals] = useState<{ [key: string]: string[] }>({});
  const [showGroceriesSidebar, setShowGroceriesSidebar] = useState(false);
  const [showDaysSidebar, setShowDaysSidebar] = useState(true); // State to control days sidebar visibility
  const [groceryItems, setGroceryItems] = useState<string[]>([]);
  const [currentWeek, setCurrentWeek] = useState(1); // State to track the current week

  const addMeal = () => {
    setMeals((prev) => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), `Meal ${prev[selectedDay]?.length + 1 || 1}`],
    }));
  };

  const createNewWeeklyPlan = () => {
    setMeals({});
    setSelectedDay("Monday");
    alert("New weekly plan created!");
  };

  const toggleGroceriesSidebar = () => {
    setShowGroceriesSidebar((prev) => !prev);
  };

  const toggleDaysSidebar = () => {
    setShowDaysSidebar((prev) => !prev);
  };

  const handleGroceryItemChange = (item: string, isChecked: boolean) => {
    if (isChecked) {
      setGroceryItems((prev) => [...prev, item]);
    } else {
      setGroceryItems((prev) => prev.filter((i) => i !== item));
    }
  };

  const scrollToNextWeek = () => {
    setCurrentWeek((prev) => prev + 1); // Increment the week
  };

  const scrollToPreviousWeek = () => {
    if (currentWeek > 1) {
      setCurrentWeek((prev) => prev - 1); // Decrement the week
    }
  };

  return (
    <div className="flex h-screen w-screen bg-white">
      
      {/* Days Sidebar */}
      {showDaysSidebar && (
        <div className="w-1/5 bg-white p-6 shadow-lg min-h-screen">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-black">Week {currentWeek}</h2>
            <button onClick={scrollToPreviousWeek} disabled={currentWeek === 1}>
              <ChevronLeft className="text-black" />
            </button>
            <button onClick={scrollToNextWeek}>
              <ChevronRight className="text-black" />
            </button>
          </div>
          <ul>
            {days.map((day) => (
              <li
                key={day}
                className={`p-2 rounded-lg cursor-pointer text-black ${selectedDay === day ? "bg-gray-300 font-bold" : "hover:bg-gray-200"
                  }`}
                onClick={() => setSelectedDay(day)}
              >
                {day}
              </li>
            ))}
          </ul>
          <button className="mt-4 w-full px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600">
            Feeling Lucky
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              className="p-2 bg-gray-200 rounded-md hover:bg-gray-300"
              onClick={toggleDaysSidebar}
            >
              {showDaysSidebar ? <ChevronLeft /> : <ChevronRight />}
            </button>
            <h2 className="text-2xl font-semibold text-black">New Plan - {selectedDay}</h2>
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={createNewWeeklyPlan}
            >
              New Weekly Plan
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={toggleGroceriesSidebar}
            >
              Groceries
            </button>
          </div>
        </div>

        {/* Meals */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          {meals[selectedDay]?.map((meal, index) => (
            <div key={index} className="p-4 bg-white shadow-md rounded-lg border text-black">
              {meal}
            </div>
          ))}
        </div>

        {/* Add Meal Button */}
        <div className="mt-4">
          <button
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            onClick={addMeal}
          >
            <Plus className="mr-2" size={18} /> Add Meal
          </button>
        </div>
      </div>
    </div>
  );
}