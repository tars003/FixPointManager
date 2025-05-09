import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
// Import i18n initialization
import './i18n';
import { Suspense } from 'react';

// i18next is initialized asynchronously, so we need a Suspense component
// to handle the loading state until translations are ready
createRoot(document.getElementById("root")!).render(
  <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center">Loading...</div>}>
    <App />
  </Suspense>
);
