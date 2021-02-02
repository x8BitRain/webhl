import { h, render, Fragment } from 'preact'
// @ts-ignore
import App from './app'
import './index.css'

// @ts-ignore
const el = document.getElementById('app');
if (el) {
  render(<App />, el)
}
