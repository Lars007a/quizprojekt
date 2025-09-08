import Box from "../comps/box/box";
import BoxTitle from "../comps/boxTitle/boxTitle";
import styles from "./done.module.css";
import { IoCheckmark } from "react-icons/io5";

export default function quizPage({}) {
  return (
    <>
      <Box>
        <BoxTitle text={"Færdig!"} />
        <div className={styles.check}>
          <IoCheckmark />
        </div>
        <p className={styles.text}>Du er færdig med quizzen!</p>
      </Box>
    </>
  );
}
