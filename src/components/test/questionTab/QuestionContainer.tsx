import { useState, useEffect, useRef } from "react";

import { dbService, storageService } from "../../../FirebaseModules";
import { doc, deleteDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

import { Editor } from '@tinymce/tinymce-react';

import styles from "./QuestionContainer.module.css";



export default function QuestionContainer({ testCode, userCode, questionObject, questionNumber, setIndex, setIsEditingQuestion }: { testCode: string | undefined, userCode: string, questionObject: any, questionNumber: number, setIndex: any, setIsEditingQuestion: any }) {
    const [isMoreButtonClicked, setIsMoreButtonClicked] = useState<boolean>(false);



    // 화면 너비
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        window.addEventListener("resize", () => { setWidth(window.innerWidth); });

        if (width > 1200) {
            setIsMoreButtonClicked(false);
        }
    });



    function clickedOutside(ref: any) {
        useEffect(() => {
            function handleClickOutside(event: any) {
                if (ref.current && !ref.current.contains(event.target)) {
                    setIsMoreButtonClicked(false);
                }
            }

            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }

    const moreButtonRef = useRef(null);
    clickedOutside(moreButtonRef);



    return (
        <div className={styles.questionContainer}>
            <div className={styles.questionContainerTop}>
                <div className={styles.questionNumber}>
                    {questionNumber + 1}
                </div>

                {
                    width > 1200

                        ?

                        <div className={styles.optionButtons}>
                            <div
                                className={styles.optionEditButton}
                                onClick={() => {
                                    setIndex(questionNumber);
                                    setIsEditingQuestion(true);
                                }}>

                                <img className={styles.buttonImage} src={process.env.PUBLIC_URL + "/icons/edit.png"} />

                                수정
                            </div>

                            <div
                                className={styles.optionDeleteButton}
                                onClick={async () => {
                                    if (testCode && confirm("해당 문제를 삭제하시겠습니까?")) {
                                        await deleteDoc(doc(dbService, "tests", testCode, "questions", questionObject.questionCode));
                                        await deleteObject(ref(storageService, userCode + "/" + testCode + "/" + questionObject.questionCode))
                                    }
                                }}>

                                <img className={styles.buttonImage} src={process.env.PUBLIC_URL + "/icons/delete.png"} />

                                삭제
                            </div>
                        </div>

                        :

                        <img
                            className={styles.moreButton}
                            src={process.env.PUBLIC_URL + "/icons/more.png"}
                            onClick={() => {
                                setIsMoreButtonClicked((prev) => !prev);
                            }}
                        />
                }

                {
                    isMoreButtonClicked

                    &&

                    <div className={styles.moreContainer} ref={moreButtonRef}>
                        <div
                            className={styles.moreContainerEditButton}
                            onClick={() => {
                                setIsEditingQuestion(true);
                                setIndex(questionNumber);
                            }}
                        >
                            <img
                                className={styles.moreOptionIcon}
                                src={process.env.PUBLIC_URL + "/icons/edit.png"}
                            />
                            수정
                        </div>

                        <div
                            className={styles.moreContainerDeleteButton}
                            onClick={async () => {
                                if (testCode && confirm("해당 문제를 삭제하시겠습니까?")) {
                                    await deleteDoc(doc(dbService, "tests", testCode, "questions", questionObject.questionCode));
                                    await deleteObject(ref(storageService, userCode + "/" + testCode + "/" + questionObject.questionCode))
                                }
                            }}
                        >
                            <img
                                className={styles.moreOptionIcon}
                                src={process.env.PUBLIC_URL + "/icons/delete.png"}
                            />
                            삭제
                        </div>
                    </div>
                }
            </div>



            <div className={styles.questionContainerBottom}>
                <div className={styles.questionInfo}>
                    <div className={styles.questionInfoContainer}>
                        <div className={styles.questionInfoHeader}>
                            유형
                        </div>

                        <div className={styles.questionInfoValue}>
                            {questionObject.type}
                        </div>
                    </div>


                    <div className={styles.questionInfoContainer}>
                        <div className={styles.questionInfoHeader}>
                            배점
                        </div>

                        <div className={styles.questionInfoValue}>
                            {questionObject.points}점
                        </div>
                    </div>

                    <div className={styles.questionInfoContainer}>
                        <div className={styles.questionInfoHeader}>
                            난이도
                        </div>

                        <div className={styles.questionInfoValue}>
                            {questionObject.level === 0 && <div className={styles.level0}>매우 쉬움</div>}
                            {questionObject.level === 1 && <div className={styles.level1}>쉬움</div>}
                            {questionObject.level === 2 && <div className={styles.level2}>보통</div>}
                            {questionObject.level === 3 && <div className={styles.level3}>어려움</div>}
                            {questionObject.level === 4 && <div className={styles.level4}>매우 어려움</div>}
                        </div>
                    </div>
                </div>



                <div className={styles.questionInfoHeader}>
                    지문
                </div>

                <div className={styles.questionPassage}>
                    <Editor
                        apiKey="8q7n1e2sd7e0wh0gt9d3vyc8p1kkznty14inel82mcodryjw"
                        disabled={true}
                        init={{
                            readonly: true,
                            menubar: false,
                            toolbar: false,
                            statusbar: false,
                            plugins: ["autoresize", 'codesample'],
                            content_style: `
                                                        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

                                                        body {
                                                            font-family:'Pretendard';
                                                            font-weight: 600;
                                                            margin: 0px;
                                                            padding: 0px;
                                                        }
                                                    `
                        }}
                        value={questionObject.question}
                    />
                </div>



                {
                    questionObject.type === "객관식"

                    &&

                    <div className={styles.choiceContainer}>
                        <div className={styles.questionInfoHeader}>
                            정답
                        </div>

                        <div className={styles.choiceElements}>
                            <div className={questionObject.answer[0] ? styles.choiceNumberCorrect : styles.choiceNumberIncorrect}>
                                1
                            </div>

                            <div className={questionObject.answer[0] ? styles.choiceValueCorrect : styles.choiceValueIncorrect}>
                                {questionObject.choices[0]}
                            </div>
                        </div>

                        <div className={styles.choiceElements}>
                            <div className={questionObject.answer[1] ? styles.choiceNumberCorrect : styles.choiceNumberIncorrect}>
                                2
                            </div>

                            <div className={questionObject.answer[1] ? styles.choiceValueCorrect : styles.choiceValueIncorrect}>
                                {questionObject.choices[1]}
                            </div>
                        </div>

                        <div className={styles.choiceElements}>
                            <div className={questionObject.answer[2] ? styles.choiceNumberCorrect : styles.choiceNumberIncorrect}>
                                3
                            </div>

                            <div className={questionObject.answer[2] ? styles.choiceValueCorrect : styles.choiceValueIncorrect}>
                                {questionObject.choices[2]}
                            </div>
                        </div>

                        {
                            questionObject.choices[3]

                            &&

                            <div className={styles.choiceElements}>
                                <div className={questionObject.answer[3] ? styles.choiceNumberCorrect : styles.choiceNumberIncorrect}>
                                    4
                                </div>

                                <div className={questionObject.answer[3] ? styles.choiceValueCorrect : styles.choiceValueIncorrect}>
                                    {questionObject.choices[3]}
                                </div>
                            </div>
                        }

                        {
                            questionObject.choices[4]

                            &&

                            <div className={styles.choiceElements}>
                                <div className={questionObject.answer[4] ? styles.choiceNumberCorrect : styles.choiceNumberIncorrect}>
                                    5
                                </div>

                                <div className={questionObject.answer[4] ? styles.choiceValueCorrect : styles.choiceValueIncorrect}>
                                    {questionObject.choices[4]}
                                </div>
                            </div>
                        }

                        {
                            questionObject.choices[5]

                            &&

                            <div className={styles.choiceElements}>
                                <div className={questionObject.answer[5] ? styles.choiceNumberCorrect : styles.choiceNumberIncorrect}>
                                    6
                                </div>

                                <div className={questionObject.answer[5] ? styles.choiceValueCorrect : styles.choiceValueIncorrect}>
                                    {questionObject.choices[5]}
                                </div>
                            </div>
                        }

                        {
                            questionObject.choices[6]

                            &&

                            <div className={styles.choiceElements}>
                                <div className={questionObject.answer[6] ? styles.choiceNumberCorrect : styles.choiceNumberIncorrect}>
                                    7
                                </div>

                                <div className={questionObject.answer[6] ? styles.choiceValueCorrect : styles.choiceValueIncorrect}>
                                    {questionObject.choices[6]}
                                </div>
                            </div>
                        }


                        {
                            questionObject.choices[7]

                            &&

                            <div className={styles.choiceElements}>
                                <div className={questionObject.answer[7] ? styles.choiceNumberCorrect : styles.choiceNumberIncorrect}>
                                    8
                                </div>

                                <div className={questionObject.answer[7] ? styles.choiceValueCorrect : styles.choiceValueIncorrect}>
                                    {questionObject.choices[7]}
                                </div>
                            </div>
                        }

                        {
                            questionObject.choices[8]

                            &&

                            <div className={styles.choiceElements}>
                                <div className={questionObject.answer[8] ? styles.choiceNumberCorrect : styles.choiceNumberIncorrect}>
                                    9
                                </div>

                                <div className={questionObject.answer[8] ? styles.choiceValueCorrect : styles.choiceValueIncorrect}>
                                    {questionObject.choices[8]}
                                </div>
                            </div>
                        }

                        {
                            questionObject.choices[9]

                            &&

                            <div className={styles.choiceElements}>
                                <div className={questionObject.answer[9] ? styles.choiceNumberCorrect : styles.choiceNumberIncorrect}>
                                    10
                                </div>

                                <div className={questionObject.answer[9] ? styles.choiceValueCorrect : styles.choiceValueIncorrect}>
                                    {questionObject.choices[9]}
                                </div>
                            </div>
                        }
                    </div>
                }

                {
                    questionObject.type === "참/거짓"

                    &&

                    <div>
                        <div className={styles.questionInfoHeader}>
                            정답
                        </div>

                        <div className={styles.correctChoice}>
                            {questionObject.answer ? "참" : "거짓"}
                        </div>
                    </div>
                }

                {
                    questionObject.type === "주관식"

                    &&

                    <div>
                        <div className={styles.questionInfoHeader}>
                            정답
                        </div>

                        <div className={styles.correctChoice}>
                            {questionObject.answer}
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}