import styles from "./loginForm.module.css";
import Box from "../box/box.jsx";
import BoxTitle from "../boxTitle/boxTitle.jsx";
import Button from "../button/button.jsx";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useRef, useState } from "react";
import ErrorText from "../errorText/errorText.jsx";
import { jwtDecode } from "jwt-decode";

export default function loginForm({}) {
  const [user, setUser] = useLocalStorage(
    "user",
    null
  ); /* for at kunne gemme brugeren fra api'en i localstorage. */
  const inputRef =
    useRef(null); /* for at kunne ændre input formen, når der sker fejl. */
  const [error, setError] = useState(null); /* til at holde en fejlbesked. */

  const send = (event) => {
    /* Funktion til at køre, når "videre" button bliver clicked. */
    event.preventDefault();
    setError(null); /* fjern alle eventuelle fejl. */

    const form = new FormData(event.target);

    fetch("https://quiz-tpjgk.ondigitalocean.app/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: form.get("name") }),
    })
      .then((val) => {
        console.log(val);

        if (val.status == 409) {
          throw new Error("Bruger allerede oprettet!");
        } /* Hvis brugeren er etableret. */

        if (val.status == 400) {
          throw new Error("Skal skrive noget ind i feltet!");
        } /* Hvis feltet ikke er fyldt ud. */

        if (val.status == 201 || val.status == 200) {
          /* hvis alt gik well. */
          return val.json();
        }

        //Hvis vi er kommet her til er fejlen ikke en vi kender.
        throw new Error("Der skete en fejl. Prøv igen!");
      })
      .then((val) => {
        return fetch(`https://quiz-tpjgk.ondigitalocean.app/api/signin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: val.data.name,
          }),
        });
      })
      .then((val) => {
        if (!val.ok || val.status != 200) {
          throw new Error("Der skete en fejl. Prøv igen!");
        }
        return val.json();
      })
      .then((val) => {
        if (val.status != "ok") {
          throw new Error("Der skete en fejl. Prøv igen!");
        }
        console.log(val);

        const acc = jwtDecode(val.data.token);

        setUser({ token: val.data.token, id: acc._id });
      })
      .catch((error) => {
        inputRef.current.classList.add(`${styles.errorField}`);
        setError(error.message);
      });
  };

  return (
    <Box>
      <BoxTitle text={"Dit navn?"} bold={false} />
      <form className={styles.form} onSubmit={send}>
        <input
          type="text"
          placeholder="Hvad er dit navn?"
          name="name"
          ref={inputRef}
        />
        <Button text={"Start quiz!"} type={"submit"} />
        <ErrorText error={error} />
      </form>
    </Box>
  );
}
