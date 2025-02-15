"use client";

import { useState } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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
    // Add logic here to load or fetch data for the next week
  };

  const scrollToPreviousWeek = () => {
    if (currentWeek > 1) {
      setCurrentWeek((prev) => prev - 1); // Decrement the week
      // Add logic here to load or fetch data for the previous week
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
                className={`p-2 rounded-lg cursor-pointer text-black ${
                  selectedDay === day ? "bg-gray-300 font-bold" : "hover:bg-gray-200"
                }`}
                onClick={() => setSelectedDay(day)}
              >
                {day}
              </li>
            ))}
          </ul>
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

      {/* Groceries Sidebar */}
      {showGroceriesSidebar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={toggleGroceriesSidebar}>
          <div
            className="fixed right-0 top-0 h-screen w-1/4 bg-white shadow-lg p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4 text-black">Groceries</h2>
            <ul>
              {meals[selectedDay]?.map((meal, index) => (
                <li key={index} className="mb-2">
                  <label className="flex items-center text-black">
                    <input
                      type="checkbox"
                      className="mr-2"
                      onChange={(e) => handleGroceryItemChange(meal, e.target.checked)}
                    />
                    {meal}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}