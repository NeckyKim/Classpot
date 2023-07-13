import { toast } from "react-toastify";

import styles from "./ChoiceContainer.module.css";
import CheckBox from "../../../style/CheckBox";



export default function ChoiceContainer({ index, choices, setChoices, answer, setAnswer }: { index: number, choices: string[], setChoices: any, answer: boolean[], setAnswer: any }) {
    return (
        <div className={styles.choiceContainer}>
            <textarea
                value={choices[index]}
                className={styles.inputBox}
                onChange={(event) => {
                    event.preventDefault();

                    let copy = [...choices];
                    copy[index] = event.target.value;
                    setChoices(copy);
                }}
                spellCheck={false}
            />

            <div className={styles.checkBoxContainer}>
                <CheckBox
                    value={answer[index]}
                    onClick={() => {
                        let copy = [...answer];
                        copy[index] = !copy[index];
                        setAnswer(copy);
                    }}
                />

                <div>
                    정답
                </div>

                <img
                    src={process.env.PUBLIC_URL + "/icons/dashboard/delete.svg"}
                    className={styles.eraseIcon}
                    onClick={() => {
                        if (choices.length > 3) {
                            let copy1 = [...choices];
                            let copy2 = [...answer];

                            copy1.splice(index, 1);
                            copy2.splice(index, 1);

                            setChoices(copy1);
                            setAnswer(copy2);
                        }

                        else {
                            toast.error("보기는 최소 3개 이상이어야 합니다.", { toastId: "" });
                        }
                    }}
                />
            </div>
        </div>
    )
}
