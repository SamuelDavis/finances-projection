import { createMemo, For, splitProps, type JSX, createEffect } from "solid-js";
import { useAppState } from "./AppState";
import {
  assert,
  HTMLNumber,
  isIn,
  isOf,
  type ExtendProps,
  type Targeted,
} from "@samueldavis/solidlib";
import { Intervals, Verbs, type Phrase, type Transaction } from "./types";
import { createStore, produce } from "solid-js/store";
import { TransactionPhrase, TransactionRow } from "./Transaction";

function pluralize(value: string, count: number = 0): string {
  return count === 1 ? value : `${value}s`;
}

function transactionToPhrase(transaction: Transaction): Phrase {
  const { amount, counterparty, frequency, interval } = transaction;
  const phrase: Omit<Phrase, "verb" | "preposition"> = {
    object: Math.abs(amount),
    subject: counterparty,
    frequency,
    interval,
  };
  return amount < 0
    ? { ...phrase, verb: "give", preposition: "to" }
    : { ...phrase, verb: "get", preposition: "from" };
}

function EditableTransactionPhrase(
  props: ExtendProps<"span", { transaction: Transaction }>,
) {
  const [local, parent] = splitProps(props, ["transaction"]);
  const [transaction, setTransaction] = createStore(local.transaction);
  const getPhrase = createMemo(() => transactionToPhrase(transaction));
  const getStyle = (size: number): string | JSX.CSSProperties => ({
    "--size": size,
  });
  function onVerb(event: Targeted<HTMLSelectElement>): void {
    const value = event.currentTarget.value;
    assert(isOf, value, Verbs);
    const multiplier = value === "give" ? -1 : 1;
    setTransaction(
      produce((tx) => (tx.amount = Math.abs(tx.amount) * multiplier)),
    );
  }

  function onAmount(event: Targeted<HTMLInputElement>): void {
    const multiplier = getPhrase().verb === "give" ? -1 : 1;
    setTransaction(
      produce(
        (tx) => (tx.amount = event.currentTarget.valueAsNumber * multiplier),
      ),
    );
  }

  function onSubject(event: Targeted<HTMLInputElement>): void {
    setTransaction(
      produce((tx) => (tx.counterparty = event.currentTarget.value)),
    );
  }

  function onFrequency(event: Targeted<HTMLInputElement>): void {
    setTransaction(
      produce((tx) => (tx.frequency = event.currentTarget.valueAsNumber)),
    );
  }

  function onInterval(event: Targeted<HTMLSelectElement>): void {
    const value = event.currentTarget.value;
    assert(isIn, value, Intervals);
    setTransaction(produce((tx) => (tx.interval = value)));
  }

  createEffect(() => {
    console.debug(transaction.amount);
  });

  return (
    <span data-sentence={true} {...parent}>
      <span>I</span>
      <select
        disabled={getPhrase().object === 0}
        style={getStyle(getPhrase().verb.length)}
        required
        onInput={onVerb}
      >
        <For each={Verbs}>
          {(value) => (
            <option value={value} selected={value === getPhrase().verb}>
              {value}
            </option>
          )}
        </For>
      </select>
      <input
        style={getStyle(getPhrase().object.toString().length)}
        type="number"
        placeholder="0"
        value={getPhrase().object}
        min={0}
        step={0.01}
        required
        onInput={onAmount}
      />
      <output>{getPhrase().preposition}</output>
      <input
        style={getStyle(getPhrase().subject.length)}
        type="text"
        value={getPhrase().subject}
        required
        onInput={onSubject}
      />
      <span>every</span>
      <input
        style={getStyle(getPhrase().frequency.toString().length)}
        type="number"
        placeholder="0"
        value={getPhrase().frequency}
        min={0}
        step={1}
        required
        onInput={onFrequency}
      />
      <select
        style={getStyle(getPhrase().interval.length)}
        required
        onInput={onInterval}
      >
        <For each={Object.keys(Intervals)}>
          {(value) => (
            <option value={value} selected={value === getPhrase().interval}>
              {pluralize(value, getPhrase().frequency)}
            </option>
          )}
        </For>
      </select>
      <span>.</span>
    </span>
  );
}

function ReadonlyTransactionPhrase(
  props: ExtendProps<"span", { transaction: Transaction }>,
) {
  const [local, parent] = splitProps(props, ["transaction"]);
  const getPhrase = createMemo(() => transactionToPhrase(local.transaction));
  const getHighlight = () => {
    console.debug(local.transaction.amount);
    if (local.transaction.amount < 0) return "negative";
    if (local.transaction.amount > 0) return "positive";
    return true;
  };
  return (
    <span data-sentence={true} {...parent}>
      <span>I</span>
      <output>{getPhrase().verb}</output>
      <HTMLNumber value={getPhrase().object} highlight={getHighlight()} money />
      <output>{getPhrase().preposition}</output>
      <em>
        <output>{getPhrase().subject}</output>
      </em>
      <span>every</span>
      <output>{getPhrase().frequency}</output>
      <output>{pluralize(getPhrase().interval, getPhrase().frequency)}</output>
      <span>.</span>
    </span>
  );
}

export default function App() {
  const state = useAppState();

  return (
    <main>
      <table>
        <tbody>
          <For each={state.getTransactions()}>
            {(transaction) => <TransactionRow transaction={transaction} />}
          </For>
        </tbody>
      </table>
      <ul>
        <For each={state.getTransactions()}>
          {(transaction) => (
            <li>
              <TransactionPhrase transaction={transaction} />
            </li>
          )}
        </For>
      </ul>
    </main>
  );
}
