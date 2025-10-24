import { intervalKeys } from "./types";
import { For } from "solid-js";
import state from "./state";
import HTMLNumber from "./HTMLNumber";

export default function Preferences() {
  function onAvailableCash(
    event: Event & { currentTarget: HTMLInputElement },
  ): void {
    state.updatePreferences({
      availableCash: event.currentTarget.valueAsNumber,
    });
  }
  function onSafetyThreshold(
    event: Event & { currentTarget: HTMLInputElement },
  ): void {
    state.updatePreferences({
      safetyThreshold: event.currentTarget.valueAsNumber,
    });
  }

  return (
    <table>
      <thead>
        <tr>
          <th colspan={2}></th>
          <For each={intervalKeys}>{(interval) => <th>{interval}s</th>}</For>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Available Cash</th>
          <td>
            <input
              type="number"
              value={state.preferences.availableCash}
              onBlur={onAvailableCash}
            />
          </td>
          <For each={intervalKeys}>
            {(interval) => (
              <td>
                <HTMLNumber
                  value={state.getTimeToZero(
                    state.preferences.availableCash -
                      state.preferences.safetyThreshold,
                    interval,
                  )}
                  precision={1}
                />
              </td>
            )}
          </For>
        </tr>
        <tr>
          <th>Safety Threshold</th>
          <td>
            <input
              type="number"
              value={state.preferences.safetyThreshold}
              onBlur={onSafetyThreshold}
            />
          </td>
          <For each={intervalKeys}>
            {(interval) => (
              <td>
                <HTMLNumber
                  value={state.getTimeToZero(
                    state.preferences.safetyThreshold,
                    interval,
                  )}
                  precision={1}
                />
              </td>
            )}
          </For>
        </tr>
        <tr>
          <th colspan={2}>Total Time</th>
          <For each={intervalKeys}>
            {(interval) => (
              <td>
                <HTMLNumber
                  value={state.getTimeToZero(
                    state.preferences.availableCash,
                    interval,
                  )}
                  precision={1}
                />
              </td>
            )}
          </For>
        </tr>
      </tbody>
    </table>
  );
}
