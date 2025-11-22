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
};

const AppStateContext = createContext<AppState>();

export function AppStateProvider(props: ParentProps) {
  const [getTransactions, setTransactions] = createSignal<Transaction[]>([
    {
      counterparty: "Work",
      amount: 1250,
      frequency: 2,
      interval: "Week",
    },
    {
      counterparty: "Insurance",
      amount: -500,
      frequency: 6,
      interval: "Month",
    },
  ]);
  const addTransaction = (value: Transaction): void => {
    setTransactions((transactions) => [...transactions, value]);
  };
  const removeTransaction = (value: Transaction): void => {
    setTransactions((transactions) =>
      transactions.filter(
        (transaction) => JSON.stringify(transaction) !== JSON.stringify(value),
      ),
    );
  };

  const value: AppState = {
    getTransactions,
    addTransaction,
    removeTransaction,
  };

  return (
    <AppStateContext.Provider value={value}>
      {props.children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx)
    throw new Error("useAppState must be used inside <AppStateProvider>");
  return ctx;
}
