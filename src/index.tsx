/* @refresh reload */
import { render } from "solid-js/web";
import "@picocss/pico/css/pico.classless.min.css";
import "./index.css";
import App from "./App.tsx";
import { AppStateProvider } from "./AppState.tsx";

render(
  () => (
    <AppStateProvider>
      <App />
    </AppStateProvider>
  ),
  document.body,
);
