"use client";
import { useState } from "react";
import { redirect } from 'next/navigation'
import { createClient } from "@/utils/supabase/client";

export default function Page() {
  const [allergies, setAllergies] = useState<string[]>([]);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const supabase = createClient()

  const handleAllergiesChange = (allergy: string) => {
    setAllergies(prev => 
      prev.includes(allergy) 
        ? prev.filter(a => a !== allergy)
        : [...prev, allergy]
    );
  };

  const handleDietaryChange = (diet: string) => {
    setDietaryPreferences(prev => 
      prev.includes(diet)
        ? prev.filter(d => d !== diet)
        : [...prev, diet]
    );
  };

  const handleGoalsChange = (goal: string) => {
    setGoals(prev => 
      prev.includes(goal)
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const handleSubmit =  async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data, error } = await supabase
      .from('overcook_users')
      .update({ 
        allergies: allergies,
        dietary_preferences: dietaryPreferences,
        goals: goals
       })
      .eq('id', user.id)
      .select()

      redirect('/dashboard')
    }

        
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-8 p-6 font-sans text-black">
      <h1 className="text-3xl font-bold">Let's set up your kitchen, Chef!</h1>
      
      <div className="bg-white shadow-md p-8 rounded-xl w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Allergies</h2>
        <ul className="space-y-4 text-left">
          {['Dairy', 'Wheat', 'Peanuts', 'Soy', 'Tree Nuts', 'Fish', 'Shellfish'].map((allergy) => (
            <li key={allergy} className="flex items-center space-x-3">
              <input 
                type="checkbox" 
                className="w-5 h-5"
                checked={allergies.includes(allergy)}
                onChange={() => handleAllergiesChange(allergy)}
              />
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
              <input 
                type="checkbox" 
                className="w-5 h-5"
                checked={dietaryPreferences.includes(diet)}
                onChange={() => handleDietaryChange(diet)}
              />
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
              <input 
                type="checkbox" 
                className="w-5 h-5"
                checked={goals.includes(goal)}
                onChange={() => handleGoalsChange(goal)}
              />
              <span>{goal}</span>
            </li>
          ))}
        </ul>
      </div>
      <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700" onClick={handleSubmit}>Get Started Now!</button>
    </div>
  );
}
