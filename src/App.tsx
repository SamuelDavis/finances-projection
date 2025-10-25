import StateControls from "./StateControls";
import Transactions from "./Transactions";
import Preferences from "./Preferences";
import state from "./state";
import Donate from "./Donate";
import AddTransaction from "./AddTransaction";
import { Show } from "solid-js";

export default function App() {
  return (
    <>
      <header>
        <h1>Finances Projection</h1>
      </header>
      <main>
        <article>
          <section>
            <header>
              <h2>Transactions</h2>
              <StateControls />
            </header>
            <Transactions />
            <Show when={state.transactions.length > 0}>
              <AddTransaction />
            </Show>
          </section>
          <hr />
          <section>
            <header>
              <h2>Expectations</h2>
            </header>
            <Preferences />
          </section>
        </article>
      </main>
      <footer>
        <Donate />
      </footer>
    </>
  );
}
