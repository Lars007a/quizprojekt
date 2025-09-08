import styles from "./boxTitle.module.css";

export default function boxTitle({ text, bold = false }) {
  return (
    <h1 className={`${styles.boxTitle} ${bold == true && styles.bold}`}>
      {text}
    </h1>
  );
}
