import { useEffect, useState } from "react";
import Box from "../comps/box/box";
import BoxTitle from "../comps/boxTitle/boxTitle";
import styles from "./done.module.css";
import { IoCheckmark } from "react-icons/io5";
import ErrorText from "../comps/errorText/errorText";
import { useLocalStorage } from "@uidotdev/usehooks";

export default function quizPage({}) {
  const [error, setError] = useState(null);
  const [user, setUser] = useLocalStorage("user", null);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`https://quiz-tpjgk.ondigitalocean.app/quiz/progress/${user?.id}`)
      .then((val) => {
        if (!val.ok) {
          throw new Error("Der skete en fejl!");
        }
        return val.json();
      })
      .then((val) => {
        setData(val.data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  useEffect;

  return (
    <>
      <Box>
        <BoxTitle text={"Færdig!"} />
        <div className={styles.check}>
          <IoCheckmark />
        </div>
        <p className={styles.text}>Du er færdig med quizzen!</p>
        <p className={styles.text}>
          Du har svaret på{" "}
          <strong className={styles.bold}>{data?.total}</strong> spørgsmål, og
          fået <strong className={styles.bold}>{data?.correctCount}</strong>{" "}
          rigtig!
        </p>
        {error && <ErrorText error={error} />}
      </Box>
    </>
  );
}
