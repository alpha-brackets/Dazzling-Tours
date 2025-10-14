export enum TourStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

export const TOUR_STATUS_OPTIONS = [
  { value: TourStatus.ACTIVE, label: "Active" },
  { value: TourStatus.INACTIVE, label: "Inactive" },
] as const;
