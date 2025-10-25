import state from "./state";

export default function AddTransaction() {
  function onAddTransaction(_: MouseEvent): void {
    state.addTransaction();
  }

  return <button onClick={onAddTransaction}>Add Transaction</button>;
}
