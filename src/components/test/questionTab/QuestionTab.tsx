import { useState, useEffect, useRef } from "react";

import { dbService, storageService } from "../../../FirebaseModules";
import { doc, deleteDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

import AddQuestion from "./AddQuestion";
import EditQuestion from "./EditQuestion";
import GetQuestionList from "../../hooks/GetQuestionList";
import Error from "../../../Error";

import { Editor } from '@tinymce/tinymce-react';

import styles from "./QuestionTab.module.css";



export default function QuestionTab({ userCode, testCode }: { userCode: string, testCode: string | undefined }) {
    const [isMoreButtonClicked, setIsMoreButtonClicked] = useState<boolean>(false);
    const [isAddingQuestion, setIsAddingQuestion] = useState<boolean>(false);
    const [isEditingQuestion, setIsEditingQuestion] = useState<boolean>(false);
    const [index, setIndex] = useState<number>(0);



    // 화면 너비
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        window.addEventListener("resize", () => { setWidth(window.innerWidth); });

        if (width > 1200) {
            setIsMoreButtonClicked(false);
        }
    });



    // 질문 목록
    const questionList: any = GetQuestionList(testCode);



    function clickedOutside (ref: any) {
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
                                            <div className={styles.questionContainerTop}>
                                                <div className={styles.questionNumber}>
                                                    {index + 1}
                                                </div>

                                                {
                                                    width > 1200

                                                        ?

                                                        <div className={styles.optionButtons}>
                                                            <div
                                                                className={styles.optionEditButton}
                                                                onClick={() => {
                                                                    setIsEditingQuestion((prev) => !prev);
                                                                    setIndex(index);
                                                                }}>

                                                                <img className={styles.buttonImage} src={process.env.PUBLIC_URL + "/icons/edit.png"} />

                                                                수정
                                                            </div>

                                                            <div
                                                                className={styles.optionDeleteButton}
                                                                onClick={async () => {
                                                                    if (testCode && confirm("해당 문제를 삭제하시겠습니까?")) {
                                                                        await deleteDoc(doc(dbService, "tests", testCode, "questions", current.questionCode));
                                                                        await deleteObject(ref(storageService, userCode + "/" + testCode + "/" + current.questionCode))
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

                                                    <div className={styles.moreContainer}>
                                                        <div
                                                            className={styles.moreContainerEditButton}
                                                            onClick={() => {
                                                                setIsEditingQuestion((prev) => !prev);
                                                                setIndex(index);
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
                                                                    await deleteDoc(doc(dbService, "tests", testCode, "questions", current.questionCode));
                                                                    await deleteObject(ref(storageService, userCode + "/" + testCode + "/" + current.questionCode))
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
                                                            {current.type}
                                                        </div>
                                                    </div>


                                                    <div className={styles.questionInfoContainer}>
                                                        <div className={styles.questionInfoHeader}>
                                                            배점
                                                        </div>

                                                        <div className={styles.questionInfoValue}>
                                                            {current.points}점
                                                        </div>
                                                    </div>

                                                    <div className={styles.questionInfoContainer}>
                                                        <div className={styles.questionInfoHeader}>
                                                            난이도
                                                        </div>

                                                        <div className={styles.questionInfoValue}>
                                                            {current.level === 0 && <div className={styles.level0}>매우 쉬움</div>}
                                                            {current.level === 1 && <div className={styles.level1}>쉬움</div>}
                                                            {current.level === 2 && <div className={styles.level2}>보통</div>}
                                                            {current.level === 3 && <div className={styles.level3}>어려움</div>}
                                                            {current.level === 4 && <div className={styles.level4}>매우 어려움</div>}
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
                                                        value={current.question}
                                                    />
                                                </div>



                                                <div className={styles.questionInfoHeader}>
                                                    정답
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
                                    ))

                                    :

                                    <Error message="문제가 없습니다." />
                            }
                        </div>
                }
            </div>
    )
}