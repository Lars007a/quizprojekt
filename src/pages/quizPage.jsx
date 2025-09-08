import LoginForm from "../comps/loginForm/loginForm.jsx";
import QuizForm from "../comps/quizForm/quizForm.jsx";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Hint from "../comps/hint/hint.jsx";

export default function quizPage({}) {
  const [user, setUser] = useLocalStorage("user", null); //Hvilken bruger fra API'en der er gemt.
  const { id } = useParams(); //Hvilket spørgsmål der skal ind på.

  const questionLimit = 2; //Hvor mange spørgsmål der skal svares på.
  const [currentQuestion, setCurrentQuestion] = useState(1); //Hvilket spørgsmål mn er i gang med, ud af questionLimit variablen.
  const [showWhereToNext, setShowWhereToNext] = useState(false); //Om siden med hvor man skal gå hen når færdig med de 2 spørgsmål skal vises.

  return (
    <>
      {user == null || user == undefined ? (
        <LoginForm /> /* hvis login siden, hvis brugeren ikke er logget ind */
      ) : showWhereToNext ? (
        <Hint
          text={
            "Hint til hvor du skal finde den næste! Gå hen til Bla bla bla bla, og derefter bla bla bla, og så ville du finde en QR kode ved bla bla bla."
          }
        /> /* bruger fixed tekst, og ikke dynamisk, eftersom API'en ikke giver noget dynamisk tekst tilbage. */
      ) : (
        <QuizForm
          key={
            id
          } /* for at få den til at rerender helt fra ny, når quizID ændre sig, og dermed få slideIn animationen med. */
          quizID={id}
          questionLimit={questionLimit}
          currentQuestionObj={{
            set: setCurrentQuestion,
            get: currentQuestion,
          }} /* for at se og ændre det nuværende spørgsmål fra quizformen component. */
          setShowWhereToNext={setShowWhereToNext}
        />
      )}
    </>
  );
}
