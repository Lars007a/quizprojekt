import styles from "./hint.module.css";
import Box from "../box/box.jsx";
import BoxTitle from "../boxTitle/boxTitle.jsx";
import { IoCheckmark } from "react-icons/io5";

export default function hint({ text }) {
  return (
    <>
      <Box>
        <BoxTitle text={"Du skal nu videre!"} bold={true} />
        <div className={styles.check}>
          <IoCheckmark />
        </div>
        <p className={styles.text}>{text}</p>
      </Box>
    </>
  );
}
