import styles from "./Choices.module.css";



type ChoicesProps = {
    index: number;
    answer: string[];
    setAnswer: any;
    choices: string[];
    setChoices: any;
}

export default function Choices({ index, answer, setAnswer, choices, setChoices }: ChoicesProps) {
    function onChangeChoices(event: any) {
        setChoices((prev: any) => {
            return { ...prev, [event.target.name]: event.target.value }
        });
    }

    
    function onClickAnswer(event: any) {
        setAnswer((prev: any) => {
            return { ...prev, [event.target.name]: !answer[event.target.name] }
        });
    }

    return (
        <div className={styles.choiceContainer}>
            <input
                type="text"
                name={String(index)}
                value={choices[index]}
                onChange={onChangeChoices}
                className={styles.choiceBox}
                required
            />

            <input
                type="button"
                name={String(index)}
                value="정답"
                onClick={onClickAnswer}
                className={answer[index] ? styles.answerSelected : styles.answerNotSelected}
            />
        </div>
    )
}
