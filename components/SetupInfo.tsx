"use client";
import { useState } from "react";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-8 p-6 font-sans text-black">
      <h1 className="text-3xl font-bold">Let's set up your kitchen, Chef!</h1>
      
      <div className="bg-white shadow-md p-8 rounded-xl w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Allergies</h2>
        <ul className="space-y-4 text-left">
          {['Dairy', 'Wheat', 'Peanuts', 'Soy', 'Tree Nuts', 'Fish', 'Shellfish'].map((allergy) => (
            <li key={allergy} className="flex items-center space-x-3">
              <input type="checkbox" className="w-5 h-5" />
              <span>{allergy}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white shadow-md p-8 rounded-xl w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Dietary Preferences</h2>
        <ul className="space-y-4 text-left">
          {['Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Low Carb', 'High Protein'].map((diet) => (
            <li key={diet} className="flex items-center space-x-3">
              <input type="checkbox" className="w-5 h-5" />
              <span>{diet}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white shadow-md p-8 rounded-xl w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Set Your Goals</h2>
        <ul className="space-y-4 text-left">
          {['To eat healthier', 'To lose weight', 'To plan my meals', 'To diversify my palate'].map((goal) => (
            <li key={goal} className="flex items-center space-x-3">
              <input type="checkbox" className="w-5 h-5" />
              <span>{goal}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
