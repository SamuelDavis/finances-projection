import { createEffect, createRoot } from "solid-js";
import { createStore, produce } from "solid-js/store";
import {
  interval,
  intervalKeys,
  type IntervalKey,
  type Preferences,
  type Transaction,
} from "./types";

const state = createRoot(() => {
  const savedTransactions =
    localStorage.getItem("transactions") ??
    `[
    {
      "counterparty": "Rent",
      "amount": -1350.50,
      "multiplier": 1,
      "interval": 12
    },
    {
      "counterparty": "Groceries",
      "amount": -85.95,
      "multiplier": 1,
      "interval": 52
    },
    {
      "counterparty": "Insurance",
      "amount": -450.72,
      "multiplier": 1,
      "interval": 12
    },
    {
      "counterparty": "Gas",
      "amount": -55.99,
      "multiplier": 1,
      "interval": 52
    },
    {
      "counterparty": "Paycheck",
      "amount": 1050.25,
      "multiplier": 2,
      "interval": 52
    }
  ]`;
  const [transactions, setTransactions] = createStore<Transaction[]>(
    JSON.parse(savedTransactions),
  );

  const savedPreferences =
    localStorage.getItem("preferences") ??
    `{
    "availableCash": 1500,
    "safetyThreshold": 500
  }`;
  const [preferences, setPreferences] = createStore<Preferences>(
    JSON.parse(savedPreferences) ?? { availableCash: 0, safetyThreshold: 0 },
  );

  createEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
    localStorage.setItem("preferences", JSON.stringify(preferences));
  });

  const updateTransaction = (
    index: number,
    change: Partial<Transaction>,
  ): void => {
    setTransactions(
      produce(
        (transactions) =>
          (transactions[index] = { ...transactions[index], ...change }),
      ),
    );
  };
  const addTransaction = (transaction?: Transaction) =>
    setTransactions((transactions) => [
      ...transactions,
      transaction ?? {
        counterparty: "",
        amount: 0,
        multiplier: 1,
        interval: interval.Month,
      },
    ]);
  const removeTransaction = (index: number) =>
    setTransactions((transactions) =>
      transactions.filter((_, i) => i !== index),
    );
  const updatePreferences = (change: Partial<Preferences>): void => {
    setPreferences((preferences) => ({ ...preferences, ...change }));
  };

  const getTotalFor = (): Record<IntervalKey, number> => {
    const total = getTotalForTransactions(...transactions);
    return intervalKeys.reduce(
      (acc, key) => ({ ...acc, [key]: total / interval[key] }),
      {} as any,
    );
  };

  const getTimeToZero = (value: number, interval: IntervalKey): number => {
    if (state.preferences.availableCash < value)
      return Number.NEGATIVE_INFINITY;

    const total = getTotalFor()[interval];
    if (total >= 0) return Number.POSITIVE_INFINITY;

    const ttl = value / Math.abs(total);
    if (ttl < 0) return Number.NEGATIVE_INFINITY;

    return ttl;
  };

  const toJson = () => JSON.stringify({ transactions, preferences }, null, 2);
  const fromJson = (json: string) => {
    const data = JSON.parse(json);
    if (typeof data !== "object") return;
    setTransactions((transactions) => data.transactions ?? transactions);
    setPreferences((preferences) => data.preferences ?? preferences);
  };
  const clear = () => {
    setTransactions([]);
    setPreferences(() => ({ availableCash: 0, safetyThreshold: 0 }));
  };

  function getTotalForTransactions(...transactions: Transaction[]): number {
    return transactions.reduce(
      (acc, { interval, multiplier, amount }) =>
        acc + (interval / multiplier) * amount,
      0,
    );
  }

  return {
    transactions,
    setTransactions,
    addTransaction,
    removeTransaction,
    updateTransaction,
    preferences,
    setPreferences,
    updatePreferences,
    getTimeToZero,
    getTotalFor,
    getTotalForTransactions,
    toJson,
    fromJson,
    clear,
  };
});

export default state;
