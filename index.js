import { Elm } from "./src/Main.elm"

let storageKey = "store";
let flags = localStorage.getItem(storageKey);

window.onload = (args) => {
  
  let app = Elm.Main.init({flags: flags});
  app.ports.storeCache.subscribe(function(val) {

    if (val === null) {
      localStorage.removeItem(storageKey);
    } else {
      localStorage.setItem(storageKey, JSON.stringify(val));
    }

    // Report that the new session was stored successfully.
    setTimeout(function() { app.ports.onStoreChange.send(val); }, 0);
  });

  // Whenever localStorage changes in another tab, report it if necessary.
  window.addEventListener("storage", function(event) {
    if (event.storageArea === localStorage && event.key === storageKey) {
      app.ports.onStoreChange.send(event.newValue);
      console.log("--index.js port call onStoreChange --")
    }
  }, false);
}

