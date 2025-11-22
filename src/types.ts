export const Intervals = {
  Day: 1,
  Week: 7,
  Month: 30,
  Year: 365,
} as const;

export const IntervalLabels = Object.keys(
  Intervals,
) as (keyof typeof Intervals)[];

export const Verbs = ["give", "get"] as const;
export const Prepositions = ["to", "from"] as const;

type Interval = keyof typeof Intervals;

export type Transaction = {
  counterparty: string;
  amount: number;
  frequency: number;
  interval: Interval;
};

export type Phrase = {
  [K in 0 | 1]: {
    verb: (typeof Verbs)[K];
    preposition: (typeof Prepositions)[K];
  };
}[0 | 1];
