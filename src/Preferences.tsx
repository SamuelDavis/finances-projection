import { intervalKeys, type IntervalKey } from "./types";
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
          <th>
            <span>Available Cash</span>
            <br />
            <small>...time to safety threshold</small>
          </th>
          <td>
            <input
              type="number"
              value={state.preferences.availableCash}
              onBlur={onAvailableCash}
            />
          </td>
          <For each={intervalKeys}>
            {(interval) => (
              <Data
                value={
                  state.preferences.availableCash -
                  state.preferences.safetyThreshold
                }
                interval={interval}
              />
            )}
          </For>
        </tr>
        <tr>
          <th>
            <span>Safety Threshold</span>
            <br />
            <small>...time to zero</small>
          </th>
          <td>
            <input
              type="number"
              value={state.preferences.safetyThreshold}
              onBlur={onSafetyThreshold}
            />
          </td>
          <For each={intervalKeys}>
            {(interval) => (
              <Data
                value={state.preferences.safetyThreshold}
                interval={interval}
              />
            )}
          </For>
        </tr>
        <tr>
          <th colspan={2}>Total Time until Available Cash reaches Zero</th>
          <For each={intervalKeys}>
            {(interval) => (
              <Data
                value={state.preferences.availableCash}
                interval={interval}
              />
            )}
          </For>
        </tr>
      </tbody>
    </table>
  );
}

function Data(props: { value: number; interval: IntervalKey }) {
  const getValue = (): number =>
    state.getTimeToZero(props.value, props.interval);
  const getHighlight = (): boolean => !Number.isFinite(getValue());
  return (
    <td>
      <HTMLNumber value={getValue()} precision={1} highlight={getHighlight()} />
    </td>
  );
}
