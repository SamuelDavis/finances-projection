import type { Phrase, Transaction } from "./types";

export function pluralize(value: string, count: number = 0): string {
  return count === 1 ? value : `${value}s`;
}

export function derivePhrase(transaction: Transaction): Phrase {
  return transaction.amount < 0
    ? { verb: "give", preposition: "to" }
    : { verb: "get", preposition: "from" };
}
