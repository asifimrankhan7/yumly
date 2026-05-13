import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserContextType {
  name: string;
  onboardingComplete: boolean;
  recipesCooked: number;
  setName: (name: string) => void;
  setOnboardingComplete: (complete: boolean) => void;
  incrementRecipesCooked: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [name, setNameState] = useState<string>("");
  const [onboardingComplete, setOnboardingCompleteState] = useState<boolean>(false);
  const [recipesCooked, setRecipesCookedState] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const savedName = await AsyncStorage.getItem("user_name");
        const savedOnboarding = await AsyncStorage.getItem("onboarding_complete");
        const savedRecipesCooked = await AsyncStorage.getItem("recipes_cooked");

        if (savedName) setNameState(savedName);
        if (savedOnboarding) setOnboardingCompleteState(savedOnboarding === "true");
        if (savedRecipesCooked) setRecipesCookedState(parseInt(savedRecipesCooked, 10));
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const setName = async (newName: string) => {
    setNameState(newName);
    try {
      await AsyncStorage.setItem("user_name", newName);
    } catch (error) {
      console.error("Error saving user name:", error);
    }
  };

  const setOnboardingComplete = async (complete: boolean) => {
    setOnboardingCompleteState(complete);
    try {
      await AsyncStorage.setItem("onboarding_complete", complete.toString());
    } catch (error) {
      console.error("Error saving onboarding status:", error);
    }
  };

  const incrementRecipesCooked = async () => {
    const newVal = recipesCooked + 1;
    setRecipesCookedState(newVal);
    try {
      await AsyncStorage.setItem("recipes_cooked", newVal.toString());
    } catch (error) {
      console.error("Error saving recipes cooked count:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        name,
        onboardingComplete,
        recipesCooked,
        setName,
        setOnboardingComplete,
        incrementRecipesCooked,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
