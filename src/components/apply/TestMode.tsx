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
                        <div className={styles.testModeContainerLeft}>
                            {questionNumber + 1}<br />
                            {questionList[questionNumber].question}
                        </div>

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

                            <input type="submit" value="제출하기" />

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