/**
 * @ottleszek/shared — types, constants, and validation schemas shared by mobile and backend.
 * Keep minimal: only what both apps need for contracts and enums.
 */

export const APP_NAME = "OttLeszek" as const;

export type PlanStep = {
  id: string;
  orderIndex: number;
  title: string;
  dueAt: string | null;
  completedAt: string | null;
};

export type Plan = {
  id: string;
  userId: string;
  title: string;
  steps: PlanStep[];
  createdAt: string;
  updatedAt: string;
};
