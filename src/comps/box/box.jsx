import { useEffect, useRef } from "react";
import styles from "./box.module.css";

export default function box({ children }) {
  const ref = useRef(null);

  //Når component først mounter, skal animationen tilføjes.
  useEffect(() => {
    ref.current.classList.add(styles.animate);
  }, []);

  return (
    <section className={styles.boxCon}>
      <article ref={ref}>{children}</article>
    </section>
  );
}
