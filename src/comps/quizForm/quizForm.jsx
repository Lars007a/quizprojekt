import styles from "./quizForm.module.css";
import Box from "../box/box.jsx";
import BoxTitle from "../boxTitle/boxTitle.jsx";
import Button from "../button/button.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Spinner from "../spinner/spinner.jsx";
import ErrorText from "../errorText/errorText.jsx";
import { useLocalStorage } from "@uidotdev/usehooks";

export default function quizForm({
  quizID,
  questionLimit,
  currentQuestionObj,
  setShowWhereToNext,
}) {
  const [loadingError, setLoadingError] = useState(null); //Om der skete en fejl ved at hente quizdata eller ej.
  const [loading, setLoading] = useState(null); //Om siden er ved at loade.
  const [quizData, setQuizData] = useState(null); //Dataen om quizen fra api'en.

  const [quizError, setQuizError] = useState(null); //Hvis der sker en fejl i at sende svaret til api'en, osv.
  const [user, setUser] = useLocalStorage("user", null); //Til at få brugeren.

  const [btnLink, setBtnLink] = useState(null);
  const [btnText, setBtnText] = useState("Svar");

  const nav = useNavigate(); //Til at kunne sende videre.

  //Load spørgsmål fra api.
  useEffect(() => {
    setLoading(true);
    setLoadingError(false);
    setQuizError(null);

    fetch("https://quiz-tpjgk.ondigitalocean.app/api/quiz", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user.token}`,
      },
    })
      .then((val) => {
        if (!val.ok) {
          throw new Error("Skete en fejl. Prøv igen!");
        }

        return val.json();
      })
      .then((val) => {
        const index = val.data.findIndex((element) => element._id == quizID);
        if (index == -1) {
          throw new Error("Ingen quiz matcher ID'et!");
        }

        setQuizData(val.data[index]); //Gem quiz dataene i en state variabel.
      })
      .catch((error) => {
        setLoadingError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [quizID]);

  const send = (event) => {
    event.preventDefault();
    setQuizError(null);

    const form = new FormData(event.target);
    const answer = form.get("answer");

    if (!answer) {
      setQuizError("Skal vælge en mulighed!");
      return;
    }

    fetch(`https://quiz-tpjgk.ondigitalocean.app/api/quiz/${quizID}/answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        optionId: answer,
        userId: user.id,
      }),
    })
      .then((val) => {
        console.log(val);

        if (val.status == 409) {
          throw new Error("Du har allerede besvaret spørgsmålet!");
        }

        if (!val.ok) {
          throw new Error("Skete en fejl. Prøv igen!");
        }

        return val.json();
      })
      .then((val) => {
        console.log(val);

        setBtnText("Videre");

        document
          .getElementById(answer)
          .closest(`.${styles.boxy}`)
          .classList.add(val.data.isCorrect ? styles.green : styles.red);

        val.data.isCorrect != true && setQuizError("Forkert valg!");

        if (currentQuestionObj.get < questionLimit && !val.data.progress.done) {
          //Hvor mange quiz der skal udfyldes på siden.
          currentQuestionObj.set(currentQuestionObj.get + 1); //Et object der har hvilket spørgmål nummer vi nu er på, ud af dem der skal udfyldes.
          //Og som bliver tjekket hver gang man svarer korrekt, for at se om man har svaret på de to man skal.
          setBtnLink(`${`/quiz/${val.data.progress.nextQuizId}`}`);
        } else if (val.data.progress.done) {
          setBtnLink(`/done`);
        } else {
          setBtnLink(null); //Hvis der ikke er noget link, ville btn component
          //sætte state variablen der visser hvor man skal gå hen næste gang til true.
          return;
        }
      })
      .catch((error) => {
        setQuizError(error.message);
      });
  };

  return (
    <Box>
      <BoxTitle text={"Spørgsmål:"} />
      {loading ? (
        <Spinner />
      ) : loadingError ? (
        <ErrorText error={loadingError} />
      ) : (
        <>
          <BoxTitle bold={true} text={quizData?.question} />
          <form onSubmit={send} className={styles.form}>
            {/* loop over muligheder her med et map */}

            {quizData?.options?.map((element, index) => {
              return (
                <div key={element._id} className={styles.boxy}>
                  <input
                    type="radio"
                    name="answer"
                    id={element._id}
                    value={element._id}
                  />
                  <label htmlFor={element._id}>{element.text}</label>
                </div>
              );
            })}

            <Button
              text={btnText}
              type={btnText == "Videre" ? "button" : "submit"}
              link={btnLink}
              onClickExtra={() => {
                if (btnText == "Videre" && !btnLink) {
                  setShowWhereToNext(true);
                }
              }}
            />
            <ErrorText error={quizError} />
          </form>
        </>
      )}
    </Box>
  );
}
