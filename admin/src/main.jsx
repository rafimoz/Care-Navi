import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AdminContextProvider, { AdminContext } from "./context/AdminContext.jsx";
import DoctorContextProvider, {
  DoctorContext,
} from "./context/DoctorContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AdminContextProvider>
      <DoctorContextProvider>
        <AdminContextProvider>
          <App />
        </AdminContextProvider>
      </DoctorContextProvider>
    </AdminContextProvider>
  </BrowserRouter>
);