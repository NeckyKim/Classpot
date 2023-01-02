import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { dbService } from "../../FirebaseModules";
import { doc, getDoc, updateDoc, collection, orderBy, onSnapshot, query } from "firebase/firestore";

import styles from "./TestMode.module.css";



export default function TestMode() {
    const { testCode } = useParams();
    const { applicantCode } = useParams();



    // 질문 목록
    const [questionList, setQuestionList] = useState<any>([]);

    if (testCode) {
        useEffect(() => {
            onSnapshot(query(collection(dbService, "tests", testCode, "questions"), orderBy("createdTime")), (snapshot) => {
                setQuestionList(snapshot.docs.map((current) => ({
                    ...current.data()
                })));
            });
        }, [])
    }



    // 답안지 불러오기
    const [answerSheet, setAnswerSheet] = useState<any>([]);

    if (testCode && applicantCode) {
        useEffect(() => {
            getDoc(doc(dbService, "tests", testCode, "applicants", applicantCode)).then((doc: any) => {
                setAnswerSheet(doc.data().answerSheet);
            });
        }, [])
    }



    const [isApplyingTest, setIsApplyingTest] = useState<boolean>(false);

    const [questionNumber, setQuestionNumber] = useState<number>(0);


    console.log(answerSheet)


    function Choices({ choicesNumber }: { choicesNumber: number }) {
        return (
            <div
                onClick={() => {
                    let temp = [...answerSheet];
                    temp[questionNumber] = choicesNumber;
                    setAnswerSheet(temp);
                }}
                className={answerSheet[questionNumber] === choicesNumber ? styles.choiceSelected : styles.choiceNotSelected}
            >
                {questionList[questionNumber].choices[choicesNumber]}
            </div>
        )
    }



    async function submitAnswerSheet(event: any) {
        event.preventDefault();

        if (testCode && applicantCode) {
            try {
                await updateDoc(doc(dbService, "tests", testCode, "applicants", applicantCode), {
                    answerSheet: answerSheet
                })
            }

            catch (error) {
                alert("답안지 제출에 실패했습니다.");
            }
        }
    }



    return (
        <div>
            {
                isApplyingTest

                    ?

                    <form onSubmit={submitAnswerSheet} className={styles.testModeContainer}>
                        <div className={styles.testModeContainerTop}>
                            <input
                                type="button"
                                value="이전"
                                onClick={() => {
                                    if (questionNumber !== 0) {
                                        setQuestionNumber(questionNumber - 1);
                                    }

                                    submitAnswerSheet(event);
                                }}
                            />

                            <input
                                type="button"
                                value="다음"
                                onClick={() => {
                                    if (questionNumber !== questionList.length - 1) {
                                        setQuestionNumber(questionNumber + 1);
                                    }

                                    submitAnswerSheet(event);
                                }}
                            />
                        </div>

                        <div className={styles.testModeContainerBottom}>
                            <div className={styles.testModeContainerBottomNumbers}>
                                {
                                    questionList.map((current: any, index: number) => (
                                        <div 
                                            onClick={() => { setQuestionNumber(index); }}
                                            className={index === questionNumber ? styles.questionNumberSelected : styles.questionNumberNotSelected}
                                        >
                                            {index + 1}
                                        </div>
                                    ))
                                }
                            </div>

                            <div className={styles.testModeContainerBottomLeft}>
                                <div className={styles.testModeContainerBottomLeftTop}>
                                    {questionNumber + 1}
                                </div>

                                <div className={styles.testModeContainerBottomLeftCenter}>
                                    {questionList[questionNumber].question}
                                </div>
                            </div>

                            <div className={styles.testModeContainerBottomRight}>
                                <div>
                                {
                                    questionList[questionNumber].type === "객관식"

                                    &&

                                    <div>
                                        <Choices choicesNumber={0} />
                                        <Choices choicesNumber={1} />
                                        <Choices choicesNumber={2} />
                                        {questionList[questionNumber].choices[3] && <Choices choicesNumber={3} />}
                                        {questionList[questionNumber].choices[4] && <Choices choicesNumber={4} />}
                                        {questionList[questionNumber].choices[5] && <Choices choicesNumber={5} />}
                                        {questionList[questionNumber].choices[6] && <Choices choicesNumber={6} />}
                                        {questionList[questionNumber].choices[7] && <Choices choicesNumber={7} />}
                                        {questionList[questionNumber].choices[8] && <Choices choicesNumber={8} />}
                                        {questionList[questionNumber].choices[9] && <Choices choicesNumber={9} />}
                                    </div>
                                }

                                {
                                    questionList[questionNumber].type === "참/거짓"

                                    &&

                                    <div>
                                        <div
                                            onClick={() => {
                                                let temp = [...answerSheet];
                                                temp[questionNumber] = true;
                                                setAnswerSheet(temp);
                                            }}
                                            className={answerSheet[questionNumber] === true ? styles.choiceSelected : styles.choiceNotSelected}
                                        >
                                            참
                                        </div>

                                        <div
                                            onClick={() => {
                                                let temp = [...answerSheet];
                                                temp[questionNumber] = false;
                                                setAnswerSheet(temp);
                                            }}
                                            className={answerSheet[questionNumber] === false ? styles.choiceSelected : styles.choiceNotSelected}
                                        >
                                            거짓
                                        </div>
                                    </div>
                                }

                                {
                                    questionList[questionNumber].type === "주관식"

                                    &&

                                    <textarea
                                        value={answerSheet[questionNumber]}
                                        onChange={(event: any) => {
                                            let temp = [...answerSheet];
                                            temp[questionNumber] = String(event.target.value);
                                            setAnswerSheet(temp);
                                        }}
                                        className={styles.answerTextBox}
                                    />
                                }
                                </div>

                                <div>
                                <input type="submit" value="제출하기" />
                                </div>
                            </div>
                        </div>
                    </form>

                    :

                    <div>
                        유의사항<br />
                        <button onClick={() => { setIsApplyingTest(true); }}>시험 시작하기</button>
                    </div>
            }
        </div>
    )
}