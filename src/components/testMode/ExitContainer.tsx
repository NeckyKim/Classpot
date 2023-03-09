import styles from "./ExitContainer.module.css";



interface questionListProps {
    answer: boolean[] | ""[]
    choice: string[] | ""[]
    createdTime: number
    level: number
    points: number
    question: string
    type: string
}

interface exitContainerProps {
    questionList: questionListProps[]
    solvedQuestions: number[]
    checkedQuestions: number[]
    answerSheet: (boolean | string | "")[]
    setQuestionNumber: React.Dispatch<React.SetStateAction<number>>
    setIsExiting: React.Dispatch<React.SetStateAction<boolean>>
    setIsApplyingTest: React.Dispatch<React.SetStateAction<boolean>>
    submitAnswerSheet: any
}



export default function ExitContainer({ questionList, solvedQuestions, checkedQuestions, answerSheet, setQuestionNumber, setIsExiting, setIsApplyingTest, submitAnswerSheet }: exitContainerProps) {
    return (
        <div className={styles.background}>
            <div className={styles.container}>
                <div className={styles.containerTop}>
                    시험 종료

                    <img
                        className={styles.closeIcon}
                        src={process.env.PUBLIC_URL + "/icons/close.png"}
                        onClick={() => {
                            setIsExiting(false);
                        }}
                    />
                </div>

                <div className={styles.containerGuide}>
                    답안지를 제출하고 시험을 종료하시겠습니까?<br />
                    시험이 종료되기 전 까지 다시 접속하면 이어서 응시할 수 있습니다.
                </div>

                <div className={styles.questionsStatusContainer}>
                    {
                        questionList.length === solvedQuestions.length

                            ?

                            <div className={styles.questionStatusPass}>
                                <img className={styles.exitContainerIcon} src={process.env.PUBLIC_URL + "/icons/pass.png"} />

                                모든 문제를 다 풀었습니다.
                            </div>

                            :

                            <div className={styles.questionStatusWarning}>
                                <img className={styles.exitContainerIcon} src={process.env.PUBLIC_URL + "/icons/alert.png"} />

                                풀지 않은 문제가 {questionList.length - solvedQuestions.length}개 있습니다.
                            </div>
                    }

                    <div className={styles.questionsStatusElements}>
                        {
                            questionList.length > 0

                            &&

                            questionList.map((current: any, index: number) => (
                                current.type === "객관식"

                                    ?

                                    (
                                        answerSheet[index] !== null

                                            && answerSheet[index] !== undefined

                                            && Object.values(answerSheet[index]).filter((elem: any) => elem === true).length > 0

                                            ?

                                            <div
                                                className={styles.solvedQuestions}
                                                onClick={() => {
                                                    setIsExiting(false);
                                                    setQuestionNumber(index);
                                                }}
                                            >
                                                <div className={styles.solvedQuestionsNumber}>
                                                    {index + 1}
                                                </div>

                                                <div className={styles.solvedQuestionsType}>
                                                    {current.type}
                                                </div>

                                                <div className={styles.solvedQuestionsText}>
                                                    푼 문제
                                                </div>
                                            </div>

                                            :

                                            <div
                                                className={styles.notSolvedQuestions}
                                                onClick={() => {
                                                    setIsExiting(false);
                                                    setQuestionNumber(index);
                                                }}
                                            >
                                                <div className={styles.notSolvedQuestionsNumber}>
                                                    {index + 1}
                                                </div>

                                                <div className={styles.notSolvedQuestionsType}>
                                                    {current.type}
                                                </div>

                                                <div className={styles.notSolvedQuestionsText}>
                                                    풀지 않은 문제
                                                </div>
                                            </div>

                                    )

                                    :

                                    (
                                        answerSheet[index] !== null

                                            && answerSheet[index] !== undefined

                                            && answerSheet[index] !== ""

                                            ?

                                            <div
                                                className={styles.solvedQuestions}
                                                onClick={() => {
                                                    setIsExiting(false);
                                                    setQuestionNumber(index);
                                                }}
                                            >
                                                <div className={styles.solvedQuestionsNumber}>
                                                    {index + 1}
                                                </div>

                                                <div className={styles.solvedQuestionsType}>
                                                    {current.type}
                                                </div>

                                                <div className={styles.solvedQuestionsText}>
                                                    푼 문제
                                                </div>
                                            </div>

                                            :

                                            <div
                                                className={styles.notSolvedQuestions}
                                                onClick={() => {
                                                    setIsExiting(false);
                                                    setQuestionNumber(index);
                                                }}
                                            >
                                                <div className={styles.notSolvedQuestionsNumber}>
                                                    {index + 1}
                                                </div>

                                                <div className={styles.notSolvedQuestionsType}>
                                                    {current.type}
                                                </div>

                                                <div className={styles.notSolvedQuestionsText}>
                                                    풀지 않은 문제
                                                </div>
                                            </div>
                                    )
                            ))
                        }
                    </div>
                </div>

                {
                    checkedQuestions?.length > 0

                    &&

                    <div className={styles.checkedQuestionContainer}>
                        <div className={styles.checkedQuestionHeader}>
                            <img className={styles.exitContainerIcon} src={process.env.PUBLIC_URL + "/icons/flag.png"} style={{ padding: "0px" }} />

                            체크된 문제가 {checkedQuestions?.length}개 있습니다.
                        </div>

                        <div className={styles.checkedQuestionElementContainer}>
                            {checkedQuestions.map((current: any, index: number) => (
                                <div
                                    className={styles.checkedQuestionElements}
                                    onClick={() => {
                                        setIsExiting(false);
                                        setQuestionNumber(index);
                                    }}
                                >
                                    {current + 1}
                                </div>
                            ))}
                        </div>
                    </div>
                }

                <div className={styles.containerBottom}>
                    <div
                        className={styles.exitButton}
                        onClick={() => {
                            submitAnswerSheet(event);
                            setIsApplyingTest(false);
                            setIsExiting(false);
                            setQuestionNumber(0);
                        }}
                    >
                        시험 종료
                    </div>
                </div>
            </div>
        </div>
    )
}