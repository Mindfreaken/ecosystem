import { api } from "../../../../convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";

// Maximum possible social score
export const MAX_SOCIAL_SCORE = 10000;

// Utility function to get a social score and ensure it exists
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ensureSocialScore = async (_userId: string) => {
  // This function would typically use the Convex client to call the API
  // For now, we'll return the MAX_SOCIAL_SCORE as a placeholder
  return MAX_SOCIAL_SCORE;
};

// Custom hook for getting punishment types
export const usePunishmentTypes = () => {
  return useQuery(api.punishments.getPunishmentTypes);
};

// Custom hook for getting punishment thresholds
export const usePunishmentThresholds = () => {
  return useQuery(api.punishments.getPunishmentThresholds);
};

// Custom hook for getting a user's punishments
export const useUserPunishments = (userId: Id<"users"> | null) => {
  return useQuery(
    api.punishments.getUserPunishments, 
    userId ? { userId } : "skip"
  );
};

// Custom hook for getting a user's social score
export const useSocialScore = (userId: Id<"users"> | null) => {
  return useQuery(api.profile.getSocialScore, userId ? { userId } : "skip");
};

// Custom hook for applying a punishment
export const useApplyPunishment = () => {
  return useMutation(api.punishments.applyPunishment);
};

// Custom hook for removing a punishment
export const useRemovePunishment = () => {
  return useMutation(api.punishments.removePunishment);
};

// Custom hook for updating a punishment type value
export const useUpdatePunishmentTypeValue = () => {
  return useMutation(api.punishments.updatePunishmentTypeValue);
};

// Custom hook for adding a new punishment type
export const useAddPunishmentType = () => {
  return useMutation(api.punishments.addPunishmentType);
};

// Format social score for display
export const formatSocialScoreDisplay = (score: number): string => {
  if (score === MAX_SOCIAL_SCORE) {
    return "MAX";
  }
  return score.toLocaleString();
};

// Calculate percentage of max score
export const calculateScorePercentage = (score: number): number => {
  return (score / MAX_SOCIAL_SCORE) * 100;
};

// Get color based on score percentage
export const getSocialScoreColor = (scorePercentage: number): string => {
  if (scorePercentage >= 95) return "#4CAF50"; // Green for excellent
  if (scorePercentage >= 80) return "#8BC34A"; // Light green for very good
  if (scorePercentage >= 60) return "#CDDC39"; // Lime for good
  if (scorePercentage >= 40) return "#FFEB3B"; // Yellow for okay
  if (scorePercentage >= 20) return "#FFC107"; // Amber for concerning
  return "#F44336"; // Red for poor
}; 