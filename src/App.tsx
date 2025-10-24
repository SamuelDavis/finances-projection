import StateControls from "./StateControls";
import Transactions from "./Transactions";
import TransactionsSummary from "./TransactionsSummary";
import Preferences from "./Preferences";

export default function App() {
  return (
    <main>
      <h1>Finances Projection</h1>
      <StateControls />
      <hr />
      <Transactions />
      <TransactionsSummary />
      <Preferences />
    </main>
  );
}
