import {
  createSignal,
  For,
  Show,
  splitProps,
  type ComponentProps,
  type JSX,
} from "solid-js";
import { useAppState } from "./AppState";
import {
  assert,
  HTMLIcon,
  HTMLNumber,
  isFunction,
  isOf,
  type ExtendProps,
  type Targeted,
  Modal,
} from "@samueldavis/solidlib";
import { createStore } from "solid-js/store";
import {
  initialTransaction,
  Periods,
  Verbs,
  type Preposition,
  type Transaction,
  type Verb,
} from "./types";
import { deriveAmount, derivePhrase, onInput, pluralize } from "./utilities";

export default function App() {
  return (
    <>
      <header>
        <h1>Transactions</h1>
      </header>
      <main>
        <PhraseTable />
      </main>
      <footer>
        <small>
          This app collects no data. All data is stored locally on your machine.
        </small>
      </footer>
    </>
  );
}

function PhraseTable(props: ExtendProps<"ul">) {
  const state = useAppState();
  return (
    <ul role="table" {...props}>
      <For each={state.getTransactions()}>
        {(transaction) => (
          <>
            <PhraseRow transaction={transaction} />
            <li class="derivation " role="row">
              <output role="cell" data-adorn-before="Worth ">
                <HTMLNumber
                  value={deriveAmount(transaction, "Year")}
                  highlight
                  money
                />
                <small data-adorn-before=" per ">Year</small>
              </output>
              <output role="cell">
                <HTMLNumber
                  value={deriveAmount(transaction, "Month")}
                  highlight
                  money
                />
                <small data-adorn-before=" per ">Month</small>
              </output>
              <output role="cell">
                <HTMLNumber
                  value={deriveAmount(transaction, "Week")}
                  highlight
                  money
                />
                <small data-adorn-before=" per ">Week</small>
              </output>
              <output role="cell" data-adorn-before="and " data-adorn-after=".">
                <HTMLNumber
                  value={deriveAmount(transaction, "Day")}
                  highlight
                  money
                />
                <small data-adorn-before=" per ">Day</small>
              </output>
            </li>
          </>
        )}
      </For>
      <span role="group">
        <ModalButton type="add" header={<>Add a Transaction</>}>
          {(onClose) => {
            function onSubmit(value: Transaction, event: Event): void {
              event.preventDefault();
              state.addTransaction(value);
              onClose();
            }

            return (
              <TransactionForm
                transaction={{ ...initialTransaction }}
                onSubmit={onSubmit}
              />
            );
          }}
        </ModalButton>
      </span>
    </ul>
  );
}

function PhraseRow(props: ExtendProps<"li", { transaction: Transaction }>) {
  const state = useAppState();
  const [local, parent] = splitProps(props, ["transaction"]);
  const getPhrase = () => derivePhrase(local.transaction);
  const getHighlight = (): ComponentProps<typeof HTMLNumber>["highlight"] => {
    if (local.transaction.amount > 0) return "positive";
    if (local.transaction.amount < 0) return "negative";
    return undefined;
  };
  return (
    <li class="phrase" role="row" {...parent}>
      <span role="cell">
        <ModalButton type="edit" header={<>Edit a Transaction</>}>
          {(onClose) => {
            function onSubmit(value: Transaction, event: Event): void {
              event.preventDefault();
              state.replaceTransaction(local.transaction, value);
              onClose();
            }

            return (
              <TransactionForm
                transaction={local.transaction}
                onSubmit={onSubmit}
              />
            );
          }}
        </ModalButton>
        <span> I </span>
        <span>{getPhrase().verb}</span>
      </span>
      <span role="cell">
        <HTMLNumber
          value={Math.abs(local.transaction.amount)}
          money
          highlight={getHighlight()}
          title={local.transaction.amount.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            currencyDisplay: "symbol",
            currencySign: "standard",
          })}
        />
      </span>
      <span role="cell">every</span>
      <span role="cell">
        {getPhrase().interval}
        <span> </span>
        {pluralize(getPhrase().period, getPhrase().interval)}
      </span>
      <span role="cell">{getPhrase().preposition}</span>
      <span role="cell" data-adorn-after=".">
        <em>{getPhrase().counterparty}</em>
      </span>
    </li>
  );
}

function ModalButton(
  props: ExtendProps<
    typeof HTMLIcon,
    {
      header: JSX.Element;
      children: (onClose: () => void) => JSX.Element;
    }
  >,
) {
  const [local, parent] = splitProps(props, ["header", "onClick", "children"]);
  const [getIsOpen, setIsOpen] = createSignal(false);

  const Button = () => <HTMLIcon onClick={onClick} {...parent} />;

  function onClick(event: Targeted<HTMLElement, MouseEvent>): void {
    setIsOpen(true);
    if (Array.isArray(local.onClick)) {
      const [callback, data] = local.onClick;
      callback(data);
    } else if (isFunction(local.onClick)) {
      local.onClick(event);
    }
  }

  function onClose() {
    setIsOpen(false);
  }

  return (
    <Show when={getIsOpen()} fallback={<Button />}>
      <Button />
      <Modal onClose={onClose}>
        <article>
          <header>
            <strong>{local.header}</strong>
            <HTMLIcon type="close" onClick={onClose} />
          </header>
          {local.children(onClose)}
        </article>
      </Modal>
    </Show>
  );
}

function TransactionForm(
  props: ExtendProps<
    "form",
    {
      transaction: Transaction;
      onSubmit: (value: Transaction, event: Targeted<HTMLFormElement>) => void;
    }
  >,
) {
  const [local, parent] = splitProps(props, ["transaction", "onSubmit"]);
  const [transaction, setTransaction] = createStore(local.transaction);
  const getPhrase = () => derivePhrase(transaction);
  const [getVerb, setVerb] = createSignal<Verb>(getPhrase().verb);
  const getPreposition = (): Preposition => {
    switch (getVerb()) {
      case "give":
        return "to";
      case "get":
        return "from";
    }
  };
  const getHighlight = (): ComponentProps<typeof HTMLNumber>["highlight"] => {
    if (transaction.amount > 0) return "positive";
    if (transaction.amount < 0) return "negative";
    return undefined;
  };

  function onVerb(value: string): number {
    assert(isOf, value, Verbs);
    setVerb(value);
    if (value === "get" && transaction.amount < 0)
      return Math.abs(transaction.amount);
    if (value === "give" && transaction.amount > 0) return -transaction.amount;
    return transaction.amount;
  }

  function onAmount(value: string): number {
    const numValue = Number(value);
    setVerb(numValue < 0 ? "give" : "get");
    if (transaction.amount < 0) return -Math.abs(numValue);
    if (transaction.amount > 0) return numValue;
    return numValue;
  }

  return (
    <form onSubmit={[local.onSubmit, transaction]} {...parent}>
      <div>
        <fieldset>
          <span>I </span>
          <select
            name="verb"
            value={getVerb()}
            onInput={onInput(setTransaction, "amount", onVerb)}
            required
          >
            <For each={Verbs}>
              {(verb) => (
                <option value={verb} selected={verb === getVerb()}>
                  {verb}
                </option>
              )}
            </For>
          </select>
          <span data-money {...{ [`data-${getHighlight()}`]: true }}>
            <input
              name="amount"
              type="number"
              value={getPhrase().amount}
              onInput={onInput(setTransaction, "amount", onAmount)}
              min={0}
              step={0.01}
              required
            />
          </span>
        </fieldset>
        <fieldset>
          <span>every </span>
          <input
            name="interval"
            type="number"
            value={getPhrase().interval}
            onInput={onInput(setTransaction, "interval", Number)}
            min={1}
            step={1}
            required
          />
          <select
            role="cell"
            name="period"
            value={getPhrase().period}
            onInput={onInput(setTransaction, "period", (value) => {
              assert(isOf, value, Periods);
              return value;
            })}
            required
          >
            <For each={Periods}>
              {(period) => (
                <option value={period} selected={period === getPhrase().period}>
                  {pluralize(period, getPhrase().interval)}
                </option>
              )}
            </For>
          </select>
        </fieldset>
        <fieldset>
          <span>{getPreposition()}</span>
          <input
            name="counterparty"
            type="text"
            placeholder="someone"
            value={transaction.counterparty}
            onInput={onInput(setTransaction, "counterparty", String)}
            onBlur={onInput(setTransaction, "counterparty", (value) =>
              value.trim(),
            )}
            required
          />
        </fieldset>
      </div>
      <nav>
        <ul>
          <li>
            <button name="delete" type="submit">
              <HTMLIcon type="delete" />
            </button>
          </li>
        </ul>
        <ul>
          <li>
            <button name="cancel" type="submit">
              <HTMLIcon type="cancel" />
            </button>
          </li>
          <li>
            <button name="save" type="submit">
              <HTMLIcon type="save" />
            </button>
          </li>
        </ul>
      </nav>
    </form>
  );
}
