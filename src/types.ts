export const Periods = ["Day", "Week", "Month", "Year"] as const;
export type Period = (typeof Periods)[number];
export const Verbs = ["give", "get"] as const;
export type Verb = (typeof Verbs)[number];
export const Prepositions = ["to", "from"] as const;
export type Preposition = (typeof Prepositions)[number];

export const PeriodDayMap: Record<Period, number> = {
  Day: 1,
  Week: 7,
  Month: 30,
  Year: 365,
} as const;

export type Transaction = {
  counterparty: string;
  amount: number;
  interval: number;
  period: Period;
};

export type Phrase = {
  [K in 0 | 1]: Transaction & {
    verb: (typeof Verbs)[K];
    preposition: (typeof Prepositions)[K];
  };
}[0 | 1];

export const initialTransaction: Transaction = {
  counterparty: "",
  amount: 0,
  interval: 1,
  period: "Month",
};

export const AmountTruncationLimit = 10_000;
