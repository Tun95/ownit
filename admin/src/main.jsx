import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
import { ContextProvider } from "./context/Context.jsx";

createRoot(document.getElementById("root")).render(
  <Router>
    <ContextProvider>
      <HelmetProvider>
        <StrictMode>
          <App />
        </StrictMode>
      </HelmetProvider>
    </ContextProvider>
  </Router>
);
