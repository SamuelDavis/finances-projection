import { Index, For, createEffect } from "solid-js";
import { createStore, produce } from "solid-js/store";

const interval = { Year: 1, Month: 12, Week: 52, Day: 365 } as const;
type Interval = (typeof interval)[keyof typeof interval];

type Preferences = {
  availableCash: number;
  safetyThreshold: number;
};

type Transaction = {
  counterparty: string;
  amount: number;
  interval: Interval;
  multiplier: number;
};

export default function App() {
  const savedTransactions = localStorage.getItem("transactions") ?? "[]";
  const savedPreferences = localStorage.getItem("preferences") ?? "null";
  const [transactions, setTransactions] = createStore<Transaction[]>(
    JSON.parse(savedTransactions),
  );
  const [preferences, setPreferences] = createStore<Preferences>(
    JSON.parse(savedPreferences) ?? { availableCash: 0, safetyThreshold: 0 },
  );
  createEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
    localStorage.setItem("preferences", JSON.stringify(preferences));
  });

  const getTotal = (...transactions: Transaction[]): number =>
    transactions.reduce((acc, transaction) => {
      const total =
        (transaction.interval / transaction.multiplier) * transaction.amount;
      return acc + total;
    }, 0);
  const getTotalFor = (interval: Interval): number =>
    getTotal(...transactions) / interval;
  const resolve = (value: number, interval: Interval): string => {
    const total = getTotalFor(interval);

    if (preferences.availableCash < value)
      return Number.NEGATIVE_INFINITY.toLocaleString();
    if (total > 0) return Number.POSITIVE_INFINITY.toLocaleString();

    const ttl = value / Math.abs(total);

    if (ttl < 0) return Number.NEGATIVE_INFINITY.toLocaleString();

    return ttl.toLocaleString("en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
  };

  function onAddTransaction(_: MouseEvent): void {
    setTransactions(
      produce((transactions) =>
        transactions.push({
          counterparty: "",
          amount: 0,
          interval: interval.Month,
          multiplier: 1,
        }),
      ),
    );
  }

  function onRemoveTransaction(index: number): void {
    setTransactions((transactions) =>
      transactions.filter((_, i) => i !== index),
    );
  }

  function updateTransaction(
    index: number,
    transaction: Partial<Transaction>,
  ): void {
    setTransactions(
      produce(
        (transactions) =>
          (transactions[index] = { ...transactions[index], ...transaction }),
      ),
    );
  }
  function updatePreferences(change: Partial<Preferences>): void {
    setPreferences((preferences) => {
      preferences = { ...preferences, ...change };
      preferences.availableCash = Math.max(0, preferences.availableCash);
      preferences.safetyThreshold = Math.max(0, preferences.safetyThreshold);
      return preferences;
    });
  }

  function onCounterparty(
    index: number,
    event: Event & { currentTarget: HTMLInputElement },
  ): void {
    updateTransaction(index, { counterparty: event.currentTarget.value });
  }
  function onAmount(
    index: number,
    event: Event & { currentTarget: HTMLInputElement },
  ): void {
    updateTransaction(index, { amount: event.currentTarget.valueAsNumber });
  }
  function onMultiplier(
    index: number,
    event: Event & { currentTarget: HTMLInputElement },
  ): void {
    updateTransaction(index, { multiplier: event.currentTarget.valueAsNumber });
  }
  function onInterval(
    index: number,
    event: Event & { currentTarget: HTMLSelectElement },
  ): void {
    const interval = Number(event.currentTarget.value) as Interval;
    updateTransaction(index, { interval });
  }

  function onAvailableCash(
    event: Event & { currentTarget: HTMLInputElement },
  ): void {
    updatePreferences({ availableCash: event.currentTarget.valueAsNumber });
  }
  function onSafetyThreshold(
    event: Event & { currentTarget: HTMLInputElement },
  ): void {
    updatePreferences({ safetyThreshold: event.currentTarget.valueAsNumber });
  }

  return (
    <main>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Counterparty</th>
            <th>Amount</th>
            <th>Multiplier</th>
            <th>Interval</th>
            <For each={Object.keys(interval)}>
              {(interval) => <th>{interval}</th>}
            </For>
          </tr>
        </thead>
        <tbody>
          <Index each={transactions}>
            {(getTransaction, index) => (
              <tr>
                <td>
                  <button onClick={[onRemoveTransaction, index]}>Remove</button>
                </td>
                <td>
                  <input
                    type="text"
                    value={getTransaction().counterparty}
                    onBlur={[onCounterparty, index]}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={getTransaction().amount}
                    onBlur={[onAmount, index]}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={getTransaction().multiplier}
                    onBlur={[onMultiplier, index]}
                  />
                </td>
                <td>
                  <select onChange={[onInterval, index]}>
                    <For each={Object.entries(interval)}>
                      {([label, interval]) => (
                        <option
                          value={interval}
                          selected={interval === getTransaction().interval}
                        >
                          {label}
                        </option>
                      )}
                    </For>
                  </select>
                </td>
                <For each={Object.values(interval)}>
                  {(interval) => (
                    <td>
                      <Money value={getTotal(getTransaction()) / interval} />
                    </td>
                  )}
                </For>
              </tr>
            )}
          </Index>
        </tbody>
        <tfoot>
          <tr>
            <td colspan={999}>
              <button onClick={onAddTransaction}>Add Transaction</button>
            </td>
          </tr>
        </tfoot>
      </table>

      <table>
        <thead>
          <tr>
            <th colspan={2}>Total Per...</th>
          </tr>
        </thead>
        <tbody>
          <For each={Object.entries(interval)}>
            {([label, interval]) => (
              <tr>
                <th>{label}</th>
                <td>
                  <Money value={getTotalFor(interval)} />
                </td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th colspan={2}></th>
            <For each={Object.keys(interval)}>
              {(interval) => <th>{interval}s</th>}
            </For>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Available Cash</th>
            <td>
              <input
                type="number"
                value={preferences.availableCash}
                onBlur={onAvailableCash}
              />
            </td>
            <For each={Object.values(interval)}>
              {(interval) => (
                <td>
                  {resolve(
                    preferences.availableCash - preferences.safetyThreshold,
                    interval,
                  )}
                </td>
              )}
            </For>
          </tr>
          <tr>
            <th>Safety Threshold</th>
            <td>
              <input
                type="number"
                value={preferences.safetyThreshold}
                onBlur={onSafetyThreshold}
              />
            </td>
            <For each={Object.values(interval)}>
              {(interval) => (
                <td>{resolve(preferences.safetyThreshold, interval)}</td>
              )}
            </For>
          </tr>
          <tr>
            <th colspan={2}>Total Time</th>
            <For each={Object.values(interval)}>
              {(interval) => (
                <td>{resolve(preferences.availableCash, interval)}</td>
              )}
            </For>
          </tr>
        </tbody>
      </table>
    </main>
  );
}

function Money(props: { value: number }) {
  return (
    <div
      classList={{
        money: true,
        positive: props.value >= 0,
        negative: props.value < 0,
      }}
    >
      <span>
        {props.value.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    </div>
  );
}
