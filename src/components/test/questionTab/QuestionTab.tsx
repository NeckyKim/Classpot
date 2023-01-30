import { useState } from "react";

import { dbService, storageService } from "../../../FirebaseModules";
import { doc, deleteDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

import AddQuestion from "./AddQuestion";
import EditQuestion from "./EditQuestion";
import GetQuestionList from "../../hooks/GetQuestionList";
import Error from "../../../Error";

import styles from "./QuestionTab.module.css";



export default function QuestionTab({ userCode, testCode }: { userCode: string, testCode: string | undefined }) {
    const [isAddingQuestion, setIsAddingQuestion] = useState<boolean>(false);
    const [isEditingQuestion, setIsEditingQuestion] = useState<boolean>(false);
    const [index, setIndex] = useState<number>(0);



    // 질문 목록
    const questionList: any = GetQuestionList(testCode);



    return (
        isAddingQuestion

            ?

            <AddQuestion userCode={userCode} setIsAddingQuestion={setIsAddingQuestion} />

            :

            <div>
                {
                    isEditingQuestion

                        ?

                        <EditQuestion setIsEditingQuestion={setIsEditingQuestion} questionInfo={questionList[index]} />

                        :

                        <div>
                            <div onClick={() => { setIsAddingQuestion((prev) => !prev); }} className={styles.addQuestionButton} >
                                문제 추가
                            </div>

                            {
                                questionList.length > 0

                                    ?

                                    questionList.map((current: any, index: number) => (
                                        <div className={styles.questionContainer}>
                                            <div className={styles.questionHeader}>
                                                <div className={styles.questionNumber}>
                                                    Q.{index + 1}
                                                </div>

                                                <div className={styles.questionType}>
                                                    {current.type}
                                                </div>

                                                <div className={styles.questionPoints}>
                                                    {current.points}점
                                                </div>

                                                <div />

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
                                                        if (testCode && confirm("해당 문제를 삭제하시겠습니까?")) {
                                                            await deleteDoc(doc(dbService, "tests", testCode, "questions", current.questionCode));
                                                            await deleteObject(ref(storageService, userCode + "/" + testCode + "/" + current.questionCode))
                                                        }
                                                    }}>
                                                    삭제
                                                </div>
                                            </div>

                                            <div 
                                                className={styles.questionText}
                                                dangerouslySetInnerHTML={ {__html: current.question} }
                                            />

                                            {
                                                current.imageFile

                                                &&

                                                <img
                                                    src={current.imageFile}
                                                    width={current.imageSize * 25 + "%"}
                                                    className={styles.questionImage}
                                                />
                                            }

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
                                    ))

                                    :

                                    <Error message="문제가 없습니다." />
                            }
                        </div>
                }
            </div>
    )
}