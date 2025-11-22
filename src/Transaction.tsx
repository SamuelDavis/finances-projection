import { HTMLNumber, type ExtendProps } from "@samueldavis/solidlib";
import { Intervals, type Transaction } from "./types";
import { For, splitProps, type ComponentProps } from "solid-js";
import { derivePhrase, pluralize } from "./utilities";

export function TransactionRow(
  props: ExtendProps<"tr", { transaction: Transaction }>,
) {
  const [local, parent] = splitProps(props, ["transaction"]);
  return (
    <tr {...parent}>
      <td>
        <input type="number" value={local.transaction.amount} readonly />
      </td>
      <td>
        <input type="text" value={local.transaction.counterparty} readonly />
      </td>
      <td>
        <input type="number" value={local.transaction.frequency} readonly />
      </td>
      <td>
        <select>
          <For each={Object.keys(Intervals)}></For>
        </select>
      </td>
    </tr>
  );
}

export function TransactionPhrase(
  props: ExtendProps<"span", { transaction: Transaction }>,
) {
  const [local, parent] = splitProps(props, ["transaction"]);
  const getPhrase = () => derivePhrase(local.transaction);
  const getHighlight = (): ComponentProps<typeof HTMLNumber>["highlight"] => {
    if (local.transaction.amount < 0) return "negative";
    if (local.transaction.amount > 0) return "positive";
    return undefined;
  };
  const getInterval = () =>
    pluralize(local.transaction.interval, local.transaction.amount);

  return (
    <span data-sentence {...parent}>
      <span>I</span>
      <span>{getPhrase().verb}</span>
      <HTMLNumber
        value={local.transaction.amount}
        money
        highlight={getHighlight()}
      />
      <span>{getPhrase().preposition}</span>
      <span>{local.transaction.counterparty}</span>
      <span>every</span>
      <HTMLNumber value={local.transaction.frequency} precision={0} />
      <span>{getInterval()}</span>
      <span>.</span>
    </span>
  );
}
