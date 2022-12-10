import { useState, useEffect } from "react";
import { useParams } from "react-router";

import { dbService } from "../../../FirebaseModules";
import { doc, deleteDoc, collection, orderBy, onSnapshot, query } from "firebase/firestore";

import AddQuestion from "./AddQuestion";
import EditQuestion from "./EditQuestion";

import styles from "./QuestionTab.module.css";



export default function QuestionTab({ testInfo, testCode }: { testInfo: any, testCode: any }) {
    const [isAddingQuestion, setIsAddingQuestion] = useState<boolean>(false);
    const [isEditingQuestion, setIsEditingQuestion] = useState<boolean>(false);
    const [index, setIndex] = useState<number>(0);



    // 질문 목록 조회
    const [questionList, setQuestionList] = useState<any>([]);

    if (testCode) {
        useEffect(() => {
            onSnapshot(query(collection(dbService, "tests", testCode, "questions"), orderBy("createdTime")), (snapshot) => {
                setQuestionList(snapshot.docs.map((current) => ({
                    questionCode: current.id,
                    ...current.data()
                })));
            });
        }, [])
    }



    return (
        <div>


            {
                isAddingQuestion

                    ?

                    <AddQuestion setIsAddingQuestion={setIsAddingQuestion} />

                    :

                    <div>
                        {
                            isEditingQuestion

                                ?

                                <EditQuestion setIsEditingQuestion={setIsEditingQuestion} questionInfo={questionList[index]} />

                                :

                                <div>
                                    <button onClick={() => { setIsAddingQuestion((prev) => !prev); }} className={styles.addQuestionButton} >
                                        문제 추가
                                    </button>

                                    {
                                        questionList.map((current: any, index: number) => (
                                            <div className={styles.questionWrapper}>
                                                <div className={styles.questionContainer}>
                                                    <div className={styles.questionContainerLeft}>
                                                        Q.{index + 1}
                                                    </div>

                                                    <div className={styles.questionContainerRight}>
                                                        <div className={styles.questionInfo}>
                                                            <div className={styles.questionText}>
                                                                {current.question}
                                                            </div>

                                                            <div className={styles.questionPoints}>
                                                                {current.points}점
                                                            </div>
                                                        </div>

                                                        {
                                                            current.type === "객관식"

                                                            &&

                                                            <div>
                                                                <div className={current.answer[0] ? styles.correctChoice : styles.wrongChoice}>{current.choices[0]}</div>
                                                                <div className={current.answer[1] ? styles.correctChoice : styles.wrongChoice}>{current.choices[1]}</div>
                                                                <div className={current.answer[2] ? styles.correctChoice : styles.wrongChoice}>{current.choices[2]}</div>
                                                                {current.choices[3] && <div className={current.answer[3] ? styles.correctChoice : styles.wrongChoice}>{current.choices[3]}</div>}
                                                                {current.choices[4] && <div className={current.answer[4] ? styles.correctChoice : styles.wrongChoice}>{current.choices[4]}</div>}
                                                                {current.choices[5] && <div className={current.answer[5] ? styles.correctChoice : styles.wrongChoice}>{current.choices[5]}</div>}
                                                                {current.choices[6] && <div className={current.answer[6] ? styles.correctChoice : styles.wrongChoice}>{current.choices[6]}</div>}
                                                                {current.choices[7] && <div className={current.answer[7] ? styles.correctChoice : styles.wrongChoice}>{current.choices[7]}</div>}
                                                                {current.choices[8] && <div className={current.answer[8] ? styles.correctChoice : styles.wrongChoice}>{current.choices[8]}</div>}
                                                                {current.choices[9] && <div className={current.answer[9] ? styles.correctChoice : styles.wrongChoice}>{current.choices[9]}</div>}
                                                            </div>
                                                        }

                                                        {
                                                            current.type === "참/거짓"

                                                            &&

                                                            <div className={styles.correctChoice}>
                                                                {current.answer ? "참" : "거짓"}
                                                            </div>
                                                        }

                                                        {
                                                            current.type === "주관식"

                                                            &&

                                                            <div className={styles.correctChoice}>
                                                                {current.answer}
                                                            </div>
                                                        }
                                                    </div>
                                                </div>

                                                <div className={styles.buttonContainer}>
                                                    <div
                                                        className={styles.editButton}
                                                        onClick={() => {
                                                            setIsEditingQuestion((prev) => !prev);
                                                            setIndex(index);
                                                        }}>
                                                        수정
                                                    </div>

                                                    <div
                                                        className={styles.deleteButton}
                                                        onClick={async () => {
                                                            const ok = confirm("해당 문제를 삭제하시겠습니까?");

                                                            if (testCode && ok) {
                                                                await deleteDoc(doc(dbService, "tests", testCode, "questions", current.questionCode));
                                                            }
                                                        }}>
                                                        삭제
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                        }
                    </div>
            }
        </div>
    )
}