import { useEffect, useRef } from "react";
import styles from "./errorText.module.css";
import { useState } from "react";

export default function errorText({ error }) {
  if (error == null || error == undefined || error == "") return;

  return <p className={`${styles.shake} ${styles.errorText}`}>{error}</p>;
}
