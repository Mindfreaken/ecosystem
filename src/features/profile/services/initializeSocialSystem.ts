import { api } from "../../../../convex/_generated/api";
import { useMutation } from "convex/react";

export function useInitializeSocialSystem() {
  const initPunishmentTypes = useMutation(api.punishments.initializePunishmentTypes);
  
  // Initialize the social score system
  const initializeSocialSystem = async () => {
    try {
      // Initialize punishment types
      await initPunishmentTypes();
      console.log("Social scoring system initialized successfully");
    } catch (error) {
      console.error("Failed to initialize social scoring system:", error);
    }
  };
  
  return { initializeSocialSystem };
} 