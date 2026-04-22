import React, { createContext, useContext, useState } from 'react';

export type PlannedMeal = {
  id: string;
  recipeId: string;
  recipeTitle: string;
  servings: number;
  timestamp: number;
};

type MealPlanContextType = {
  meals: PlannedMeal[];
  addToMealPlan: (recipeId: string, title: string, servings: number) => void;
  removeFromMealPlan: (mealId: string) => void;
  removeByRecipeId: (recipeId: string) => void;
  clearMealPlan: () => void;
};

const MealPlanContext = createContext<MealPlanContextType | undefined>(undefined);

export function MealPlanProvider({ children }: { children: React.ReactNode }) {
  const [meals, setMeals] = useState<PlannedMeal[]>([]);

  const addToMealPlan = (recipeId: string, title: string, servings: number) => {
    const newMeal: PlannedMeal = {
      id: Math.random().toString(36).substr(2, 9),
      recipeId,
      recipeTitle: title,
      servings,
      timestamp: Date.now(),
    };
    setMeals((prev) => [newMeal, ...prev]);
  };

  const removeFromMealPlan = (mealId: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== mealId));
  };

  const removeByRecipeId = (recipeId: string) => {
    setMeals((prev) => {
      // Find the first occurrence (most recent) and remove it
      const index = prev.findIndex(m => m.recipeId === recipeId);
      if (index !== -1) {
        const newMeals = [...prev];
        newMeals.splice(index, 1);
        return newMeals;
      }
      return prev;
    });
  };

  const clearMealPlan = () => setMeals([]);

  return (
    <MealPlanContext.Provider value={{ meals, addToMealPlan, removeFromMealPlan, removeByRecipeId, clearMealPlan }}>
      {children}
    </MealPlanContext.Provider>
  );
}

export function useMealPlan() {
  const context = useContext(MealPlanContext);
  if (context === undefined) {
    throw new Error('useMealPlan must be used within a MealPlanProvider');
  }
  return context;
}
