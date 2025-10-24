export const interval = { Year: 1, Month: 12, Week: 52, Day: 365 } as const;
export type Interval = typeof interval;
export type IntervalKey = keyof Interval;
export type IntervalValue = Interval[IntervalKey];

export const intervalKeys = Object.keys(interval) as IntervalKey[];
export const intervalValues = Object.values(interval) as IntervalValue[];

export type Preferences = {
  availableCash: number;
  safetyThreshold: number;
};

export type Transaction = {
  counterparty: string;
  amount: number;
  interval: IntervalValue;
  multiplier: number;
};
