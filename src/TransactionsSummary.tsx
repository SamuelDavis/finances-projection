import HTMLNumber from "./HTMLNumber";
import state from "./state";
import { For } from "solid-js";
import { intervalKeys } from "./types";

export default function TransactionsSummary() {
  return (
    <table>
      <thead>
        <tr>
          <th colspan={2}>Total Per...</th>
        </tr>
      </thead>
      <tbody>
        <For each={intervalKeys}>
          {(label) => (
            <tr>
              <th>{label}</th>
              <td>
                <HTMLNumber value={state.getTotalFor()[label]} money />
              </td>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  );
}
