import { type Setter } from "solid-js";
import {
  AmountTruncationLimit,
  PeriodDayMap,
  type Period,
  type Phrase,
  type Transaction,
} from "./types";
import type { SetStoreFunction } from "solid-js/store";

export function pluralize(value: string, count: number = 0): string {
  return count === 1 ? value : `${value}s`;
}

export function titleCase(value: string, split: string = " "): string {
  return value
    .split(split)
    .map((value) => `${value[0].toUpperCase()}${value.slice(1)}`)
    .join(" ");
}

export function deriveAmount(transaction: Transaction, period: Period): number {
  const days = PeriodDayMap[transaction.period] * transaction.interval;
  return (transaction.amount / days) * PeriodDayMap[period];
}

export function deriveTruncation(value: number): {
  value: number;
  adorn: undefined | string;
} {
  const adorn = value > AmountTruncationLimit;
  return adorn
    ? { value: value / AmountTruncationLimit, adorn: "K" }
    : { value, adorn: undefined };
}

export function derivePhrase(transaction: Transaction): Phrase {
  return transaction.amount < 0
    ? {
        ...transaction,
        verb: "give",
        preposition: "to",
        amount: Math.abs(transaction.amount),
      }
    : { ...transaction, verb: "get", preposition: "from" };
}

export function onInput<
  T extends Record<string | number | symbol, any>,
  K extends keyof T,
  E extends { currentTarget: { value: string } },
>(
  set: Setter<T> | SetStoreFunction<T>,
  key: K,
  mut: (value: E["currentTarget"]["value"], event: E) => T[K],
): (event: E) => void {
  return (event: E): void => {
    const value = mut(event.currentTarget.value, event);
    // @ts-ignore
    // Each member of the union type 'Setter<T> | SetStoreFunction<T>' has signatures,
    // but none of those signatures are compatible with each other. [2349]
    set((prev) => ({ ...prev, [key]: value }));
  };
}
