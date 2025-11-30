import {
  createContext,
  createSignal,
  useContext,
  type ParentProps,
} from "solid-js";
import type { Transaction } from "./types";

type AppState = {
  getTransactions: () => Transaction[];
  addTransaction: (value: Transaction) => void;
  removeTransaction: (value: Transaction) => void;
  replaceTransaction: (original: Transaction, value: Transaction) => void;
  clearTransactions: () => void;
};

const AppStateContext = createContext<AppState>();

export function AppStateProvider(props: ParentProps) {
  const [getTransactions, setTransactions] = createSignal<Transaction[]>([
    {
      counterparty: "Work  aaa bbb ccc ddd eee fff ggg hhh iii jjj kkklll mmm",
      amount: 1_000_250,
      interval: 100,
      period: "Week",
    },
    {
      counterparty: "Insurance",
      amount: -500,
      interval: 6,
      period: "Month",
    },
  ]);

  const value: AppState = {
    getTransactions,
    addTransaction(value: Transaction): void {
      const jsonValue = JSON.stringify(value);
      setTransactions((txs) =>
        txs.some((tx) => JSON.stringify(tx) === jsonValue)
          ? txs
          : [...txs, value],
      );
    },
    removeTransaction(value: Transaction): void {
      const jsonValue = JSON.stringify(value);
      setTransactions((txs) =>
        txs.filter((tx) => JSON.stringify(tx) !== jsonValue),
      );
    },
    replaceTransaction(value: Transaction): void {
      const jsonValue = JSON.stringify(value);
      setTransactions((txs) =>
        txs.map((tx) => (JSON.stringify(tx) === jsonValue ? value : tx)),
      );
    },
    clearTransactions(): void {
      setTransactions([]);
    },
  };

  return (
    <AppStateContext.Provider value={value}>
      {props.children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (ctx) return ctx;
  throw new Error("useAppState must be used inside <AppStateProvider>");
}
