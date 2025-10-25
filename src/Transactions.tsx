import {
  interval,
  intervalKeys,
  type IntervalValue,
  type Transaction,
} from "./types";
import { For, Index } from "solid-js";
import state from "./state";
import HTMLNumber from "./HTMLNumber";
import { decode } from "html-entities";
import AddTransaction from "./AddTransaction";

export default function Transactions() {
  return (
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Counterparty</th>
          <th>Amount</th>
          <th>Period</th>
          <th>Interval</th>
          <For each={intervalKeys}>{(interval) => <th>{interval}</th>}</For>
        </tr>
      </thead>
      <tbody>
        <Index
          each={state.transactions}
          fallback={
            <tr>
              <th colspan={9999}>
                <AddTransaction />
              </th>
            </tr>
          }
        >
          {(getTransaction, index) => (
            <Row transaction={getTransaction()} index={index} />
          )}
        </Index>
      </tbody>
      <tfoot>
        <tr>
          <th colspan={5}>Total per...</th>
          <For each={intervalKeys}>
            {(label) => (
              <td>
                <HTMLNumber
                  value={state.getTotalFor()[label]}
                  money
                  highlight
                  fill={false}
                />
              </td>
            )}
          </For>
        </tr>
      </tfoot>
    </table>
  );
}

function Row(props: { index: number; transaction: Transaction }) {
  function onRemoveTransaction(): void {
    state.removeTransaction(props.index);
  }
  function onCounterparty(
    event: Event & { currentTarget: HTMLInputElement },
  ): void {
    state.updateTransaction(props.index, {
      counterparty: event.currentTarget.value,
    });
  }
  function onAmount(event: Event & { currentTarget: HTMLInputElement }): void {
    state.updateTransaction(props.index, {
      amount: event.currentTarget.valueAsNumber,
    });
  }
  function onMultiplier(
    event: Event & { currentTarget: HTMLInputElement },
  ): void {
    state.updateTransaction(props.index, {
      multiplier: Math.max(0, event.currentTarget.valueAsNumber),
    });
  }
  function onInterval(
    event: Event & { currentTarget: HTMLSelectElement },
  ): void {
    const interval = event.currentTarget.value as unknown as IntervalValue;
    state.updateTransaction(props.index, { interval });
  }

  return (
    <tr>
      <td>
        <button title="remove" onClick={onRemoveTransaction}>
          {decode("&times;")}
        </button>
      </td>
      <td>
        <input
          type="text"
          value={props.transaction.counterparty}
          onBlur={onCounterparty}
        />
      </td>
      <td>
        <input
          type="number"
          value={props.transaction.amount}
          onBlur={onAmount}
        />
      </td>
      <td>
        <input
          type="number"
          min={0}
          step={1}
          value={props.transaction.multiplier}
          onBlur={onMultiplier}
        />
      </td>
      <td>
        <select onChange={onInterval}>
          <For each={Object.entries(interval)}>
            {([label, value]) => (
              <option
                value={value}
                selected={value === props.transaction.interval}
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
            <HTMLNumber
              value={
                state.getTotalForTransactions(props.transaction) / interval
              }
              money
              highlight
            />
          </td>
        )}
      </For>
    </tr>
  );
}
