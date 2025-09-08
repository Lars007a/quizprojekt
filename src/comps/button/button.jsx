import { useNavigate } from "react-router-dom";
import styles from "./button.module.css";

export default function button({ text, type = null, link, onClickExtra }) {
  const nav = useNavigate();

  return (
    <button
      type={type == null || type == "" || type == undefined ? "button" : type}
      className={styles.button}
      onClick={() => {
        if (onClickExtra) onClickExtra();

        if (link == null) return;

        if (link) {
          nav(link);
        }
      }}
    >
      {text}
    </button>
  );
}
