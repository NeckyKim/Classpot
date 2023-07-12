import { useState } from "react";

import { dbService } from "../../../FirebaseModules";
import { doc, deleteDoc } from "firebase/firestore";

import Modal from "../../../theme/Modal";
import Buttons from "../../../theme/Buttons";
import DeleteButton from "../../../theme/DeleteButton";
import CancelButton from "../../../theme/CancelButton";

import { Editor } from "@tinymce/tinymce-react";
import { toast } from "react-toastify";

import styles from "./QuestionContainer.module.css";



export default function QuestionContainer({ userCode, testCode, questionObject, index, setIsEditingQuestion, setQuestionIndex }: { userCode: string | undefined, testCode: string | undefined, questionObject: any, index: number, setIsEditingQuestion: any, setQuestionIndex: any }) {
    const [isDeletingQuestion, setIsDeletingQuestion] = useState<boolean>(false);
    const [showQuestion, setShowQuestion] = useState<boolean>(false);



    async function deleteQuestion(userCode: string, testCode: string, questionCode: string) {
        if (userCode && testCode && questionCode) {
            try {
                await deleteDoc(doc(dbService, "users", userCode, "tests", testCode, "questions", questionCode));

                toast.success("문제를 삭제했습니다.", { toastId: "" });
            }

            catch (error) {
                console.log(error);
                toast.error("문제 삭제에 실패했습니다.", { toastId: "" });
            }
        }

        else {
            toast.error("문제 삭제에 실패했습니다.", { toastId: "" });
        }

        setIsDeletingQuestion(false);
        setShowQuestion(false);
    }



    return (
        <div className={styles.container}>
            <div className={styles.info} onClick={() => setShowQuestion(prev => !prev)}>
                <div className={styles.infoNumber}>
                    {index + 1}
                </div>

                <div className={styles.infoValue} style={{ justifySelf: "left", fontWeight: 500 }}>
                    {questionObject.name}
                </div>

                <div className={styles.infoType}>
                    <img src={process.env.PUBLIC_URL + `/icons/${questionObject.type}.svg`} />
                    {(() => {
                        switch (questionObject?.type) {
                            case "mc": return "객관식"
                            case "sa": return "주관식"
                            case "tf": return "참/거짓"
                            case "essay": return "서술형"
                        }
                    })()}
                </div>

                <div className={styles.infoValue}>
                    {questionObject.points}점
                </div>

                <div className={styles.infoValue}>
                    {questionObject.grading === 0 && "기본"}
                    {questionObject.grading === 1 && "오답 시 감점"}
                    {questionObject.grading === 2 && "응답 시 만점"}
                </div>

                <img
                    src={process.env.PUBLIC_URL + "/icons/apply/arrow_up.svg"}
                    className={showQuestion ? styles.arrowShow : styles.arrowHide}
                />
            </div>



            <div className={showQuestion ? styles.showQuestion : styles.hideQuestion}>
                <div className={styles.label}>
                    지문
                </div>

                <div className={styles.passage}>
                    <Editor
                        apiKey="8q7n1e2sd7e0wh0gt9d3vyc8p1kkznty14inel82mcodryjw"
                        disabled={true}
                        value={questionObject.question}
                        init={{
                            readonly: true,
                            menubar: false,
                            toolbar: false,
                            statusbar: false,
                            plugins: ['autoresize', 'codesample'],
                            content_style: `
                            @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

                            body {
                                font-family:'Pretendard';
                                font-weight: 500;
                                margin: 0px;
                                padding: 0px;
                            }
                        `
                        }}
                    />
                </div>



                {
                    questionObject.type !== "essay"

                    &&

                    <div className={styles.label}>
                    정답
                </div>
                }

                {
                    questionObject.type === "mc"

                    &&

                    <div className={styles.choiceContainer}>
                        {questionObject.choices.map((elem: any, index: number) => (
                            <div className={styles.choiceElements}>
                                <div className={questionObject.answer[index] ? styles.choiceNumberCorrect : styles.choiceNumberIncorrect}>
                                    {index + 1}
                                </div>

                                <div className={questionObject.answer[index] ? styles.choiceValueCorrect : styles.choiceValueIncorrect}>
                                    {elem}
                                </div>
                            </div>
                        ))}
                    </div>
                }

                {
                    questionObject.type === "sa"

                    &&

                    <div className={styles.choiceValueCorrect}>
                        {questionObject.answer}
                    </div>
                }

                {
                    questionObject.type === "tf"

                    &&

                    <div className={styles.answer}>
                        {
                            questionObject.answer

                                ?

                                <div className={styles.choiceElements}>
                                    <div className={styles.choiceNumberTrue}>
                                        <img src={process.env.PUBLIC_URL + "/icons/dashboard/correct.svg"} />
                                    </div>

                                    <div className={styles.choiceValueTrue}>
                                        참
                                    </div>
                                </div>

                                :

                                <div className={styles.choiceElements}>
                                    <div className={styles.choiceNumberFalse}>
                                        <img src={process.env.PUBLIC_URL + "/icons/dashboard/wrong.svg"} />
                                    </div>

                                    <div className={styles.choiceValueFalse}>
                                        거짓
                                    </div>
                                </div>
                        }
                    </div>
                }



                <Buttons position={"left"} gap={30} style={{ marginTop: "30px", marginBottom: "30px" }}>
                    <div
                        className={styles.button}
                        onClick={() => {
                            if (userCode && testCode && questionObject) {
                                setIsEditingQuestion(true);
                                setQuestionIndex(index);
                            }
                        }}
                    >
                        <img className={styles.buttonIcon} src={process.env.PUBLIC_URL + "/icons/dashboard/edit.svg"} />
                        수정
                    </div>

                    <div
                        className={styles.button}
                        onClick={() => setIsDeletingQuestion(true)}
                    >
                        <img className={styles.buttonIcon} src={process.env.PUBLIC_URL + "/icons/dashboard/delete.svg"} />
                        삭제
                    </div>
                </Buttons>
            </div>



            {
                isDeletingQuestion

                &&

                <Modal title="문제 삭제" onClose={() => setIsDeletingQuestion(false)}>
                    <div>
                        해당 문제를 삭제하시겠습니까?
                    </div>
                    <br /><br />

                    <Buttons>
                        <DeleteButton
                            text="삭제"
                            onClick={() => {
                                if (userCode && testCode && questionObject) {
                                    deleteQuestion(userCode, testCode, questionObject.questionCode);
                                }
                            }}
                        />

                        <CancelButton
                            text="취소"
                            onClick={() => setIsDeletingQuestion(false)}
                        />
                    </Buttons>
                </Modal>
            }
        </div>
    )
}