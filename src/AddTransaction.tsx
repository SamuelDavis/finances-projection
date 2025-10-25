import state from "./state";
import {
  Show,
  For,
  createSignal,
  onMount,
  onCleanup,
  type Setter,
  createEffect,
} from "solid-js";
import { interval, type IntervalValue } from "./types";
import { Portal } from "solid-js/web";

export default function AddTransaction() {
  const [getOpen, setOpen] = createSignal(false);
  let ref: undefined | HTMLButtonElement;

  createEffect(() => {
    if (!getOpen()) ref?.focus();
  });

  function onModal(open: boolean, event: MouseEvent): void {
    event.preventDefault();
    setOpen(open);
  }

  return (
    <>
      <button onClick={[onModal, true]} ref={ref}>
        Add Transaction
      </button>
      <Show when={getOpen()}>
        <Portal mount={document.body}>
          <Modal setOpen={setOpen} />
        </Portal>
      </Show>
    </>
  );
}

function Modal(props: { setOpen: Setter<boolean> }) {
  let modal: undefined | HTMLDialogElement;
  let focus: undefined | HTMLInputElement;
  const onKeyDown = (e: KeyboardEvent) =>
    e.key === "Escape" && props.setOpen(false);
  onMount(() => {
    window.addEventListener("keydown", onKeyDown);
    focus?.focus();
  });
  onCleanup(() => window.removeEventListener("keydown", onKeyDown));

  function onClick(event: MouseEvent) {
    if (event.target === modal) props.setOpen(false);
  }

  function onClose(event: Event): void {
    event.preventDefault();
    props.setOpen(false);
  }

  function onSubmit(event: Event & { currentTarget: HTMLFormElement }) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    state.addTransaction({
      counterparty: data.get("counterparty")?.toString() ?? "",
      amount: Number(data.get("amount") ?? 0),
      multiplier: Math.max(0, Number(data.get("multiplier") ?? 1)),
      interval: Number(data.get("interval") ?? interval.Month) as IntervalValue,
    });
    props.setOpen(false);
  }

  return (
    <dialog open onClick={onClick} ref={modal}>
      <article>
        <header>
          <p>
            <strong>Add Transaction</strong>
          </p>
          <a role="button" aria-label="Close" rel="prev" onClick={onClose}></a>
        </header>
        <form onSubmit={onSubmit}>
          <label>
            <span>Counterparty</span>
            <input type="text" name="counterparty" ref={focus} />
          </label>
          <label>
            <span>Amount</span>
            <input type="number" name="amount" />
          </label>
          <label>
            <span>Period</span>
            <input type="number" value={1} min={0} step={1} />
          </label>
          <label>
            <span>Interval</span>
            <select name="interval" value={interval.Month}>
              <For each={Object.entries(interval)}>
                {([label, value]) => <option value={value}>{label}</option>}
              </For>
            </select>
          </label>
          <input type="submit" />
        </form>
      </article>
    </dialog>
  );
}
