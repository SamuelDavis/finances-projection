import StateControls from "./StateControls";
import Transactions from "./Transactions";
import Preferences from "./Preferences";
import state from "./state";
import Donate from "./Donate";

export default function App() {
  function onAddTransaction(_: MouseEvent): void {
    state.addTransaction();
  }

  return (
    <>
      <header>
        <h1>Finances Projection</h1>
      </header>
      <main>
        <article>
          <header>
            <h2>Transactions</h2>
          </header>
          <section>
            <StateControls />
            <Transactions />
            <button onClick={onAddTransaction}>Add Transaction</button>
          </section>
          <section>
            <header>
              <h2>Expectations</h2>
            </header>
            <Preferences />
          </section>
        </article>
      </main>
      <Donate />
    </>
  );
}
