import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./style.scss";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

//react-router package install krenge, agar humei /login pe alg ui dikhana..  /register pe alg ui dikhana h

/* 
  react project ke 4 layers architecture hote h 
  UI ---> user ke interaction and navigation ke liye
  => components
  => pages
  Hook ---> for managing state and api layers
  => hooks (folder)
  State ---> data store krne ke liye
  => auth.context.jsx
  => ai.cotext.jsx
  Api ---> for communication with backend
  => services
    => auth.api.js

  Inn 4 layers ki help se hum bohot accha folder structure maintain kr rhe hote h frontend mei

*/
