import { h, render } from "preact";
import App from "./app";
import "./index.css";

const el = document.getElementById("app");
if (el) {
  render(<App />, el);
}
