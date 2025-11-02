import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router";

import "./index.css";

import Layout from "./layout/Layout";

import GeneratePage from "./pages/generate/GeneratePage";
import PracticePage from "./pages/practice/PracticePage";

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <GeneratePage /> },
      { path: "generate", element: <GeneratePage /> },
      { path: "practice", element: <PracticePage /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
