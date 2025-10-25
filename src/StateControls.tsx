import state from "./state";

export default function StateControls() {
  function onExport(): void {
    const json = state.toJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "financial-projection.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function onImport(event: Event & { currentTarget: HTMLInputElement }): void {
    event.currentTarget.files
      ?.item(0)
      ?.text()
      .then(state.fromJson)
      .catch(alert);
  }

  function onClear(): void {
    state.clear();
  }

  return (
    <menu>
      <li>
        <button onClick={onExport}>Export</button>
      </li>
      <li>
        <label role="button" for="#upload">
          Import
          <input
            id="upload"
            role="button"
            value="Import"
            onChange={onImport}
            type="file"
            accept="application/json"
          />
        </label>
      </li>
      <li>
        <button onClick={onClear}>Clear</button>
      </li>
    </menu>
  );
}
