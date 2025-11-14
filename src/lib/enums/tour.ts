export enum TourStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

export const TOUR_STATUS_OPTIONS = [
  { value: TourStatus.ACTIVE, label: "Active" },
  { value: TourStatus.INACTIVE, label: "Inactive" },
] as { value: TourStatus; label: string }[];

export enum TourDifficulty {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard",
}

export const TOUR_DIFFICULTY_OPTIONS = [
  { value: TourDifficulty.EASY, label: "Easy" },
  { value: TourDifficulty.MEDIUM, label: "Medium" },
  { value: TourDifficulty.HARD, label: "Hard" },
] as { value: TourDifficulty; label: string }[];
