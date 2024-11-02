import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
import { ContextProvider } from "./context/Context.jsx";
//import { GoogleOAuthProvider } from "@react-oauth/google";

//const clientId = import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID;

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
