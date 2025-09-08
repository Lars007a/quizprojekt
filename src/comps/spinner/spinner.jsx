import styles from "./spinner.module.css";
import { ClipLoader } from "react-spinners";

export default function spinner() {
  return (
    <div className={styles.spinner}>
      <ClipLoader size={40} loading={true} />;
    </div>
  );
}
