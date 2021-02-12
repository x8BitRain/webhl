const initConsole = (toggleUI: Function, showConsole: Boolean, errors: []) => {
  if (typeof console != "undefined") {
    if (typeof
      console.log != 'undefined') {
      // @ts-ignore
      console.olog = console.log;
    } else { // @ts-ignore
      console.olog = function() {}
    }
    console.log = (message: string) => {
    const consoleWindow = document.querySelector("#error-box >#item-list")
      // @ts-ignore
      console.olog(message)
      if (showConsole) {
        toggleUI(true)
      }
      errors.push(message as never)
      if (consoleWindow) {
        consoleWindow.scrollTop = consoleWindow.scrollHeight;
      }
    }

    if (typeof console.error != 'undefined') {
      // @ts-ignore
      console.err = console.log;
    } else { // @ts-ignore
      console.err = function() {}
    }
    console.error = (message: string) => {
      const consoleWindow = document.querySelector("#error-box >#item-list")
      // @ts-ignore
      console.error(message)
      if (showConsole) {
        toggleUI(true)
      }
      errors.push(message as never)
      if (consoleWindow) {
        consoleWindow.scrollTop = consoleWindow.scrollHeight;
      }
    }
    console.error = console.warn = console.info =  console.log
    console.log('λ WebHL 0.0.3 Loaded')
  }
}

export default initConsole