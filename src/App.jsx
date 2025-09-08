import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { useRoutes } from "react-router-dom";
import QuizPage from "./pages/quizPage.jsx";
import DonePage from "./pages/done.jsx";

function App() {
  const routes = useRoutes([
    {
      element: <QuizPage />,
      path: "/quiz/:id",
    },
    {
      element: <DonePage />,
      path: "/done",
    },
  ]);

  return (
    <>
      <div className="container">{routes}</div>
    </>
  );
}

export default App;
