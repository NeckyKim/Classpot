import { useState, useEffect } from "react";

import { dbService } from "../../../FirebaseModules";
import { doc, updateDoc } from "firebase/firestore";

import GetQuestionList from "../../hooks/GetQuestionList";
import GetApplicantList from "../../hooks/GetApplicantList";
import Error from "../../../Error";

import { Editor } from '@tinymce/tinymce-react';

import styles from "./AnswerSheetTab.module.css";



export default function AnswerSheetTab({ testCode }: { testCode: string | undefined }) {
    // 응시자 목록
    const applicantList: any = GetApplicantList(testCode);

    // 질문 목록
    var questionList: any = GetQuestionList(testCode);

    const [applicantIndex, setApplicantIndex] = useState<number>(-1);



    // 화면 너비
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        if (width > 1200) {
            setApplicantListClicked(false);
        }
    }, [width])

    useEffect(() => {
        window.addEventListener("resize", () => { setWidth(window.innerWidth); });
    });

    const [applicantListClicked, setApplicantListClicked] = useState<boolean>(false);



    useEffect(() => {
        for (var i = 0; i < applicantList.length; i++) {
            var reportCard: number[] = new Array(100).fill(null);

            if (applicantList[i].answerSheet && applicantList[i].autoGrading) {
                for (var j = 0; j < questionList.length; j++) {
                    if (questionList[j].type === "객관식") {
                        if (JSON.stringify(questionList[j].answer) === JSON.stringify(applicantList[i].answerSheet[j])) {
                            reportCard[j] = questionList[j].points;
                        }

                        else {
                            reportCard[j] = 0;
                        }
                    }

                    else if (questionList[j].type === "주관식" || questionList[j].type === "참/거짓") {
                        if (questionList[j].answer === applicantList[i].answerSheet[j]) {
                            reportCard[j] = questionList[j].points;
                        }

                        else {
                            reportCard[j] = 0;
                        }
                    }

                    else if (questionList[j].type === "서술형") {
                        if (reportCard[j] !== -1) {
                            reportCard[j] = -1;
                        }
                    }
                }
            }


            if (testCode && applicantList[i].applicantCode) {
                try {
                    updateDoc(doc(dbService, "tests", testCode, "applicants", applicantList[i].applicantCode), {
                        reportCard: reportCard
                    })
                }

                catch (error) {
                    console.log(error);
                }
            }
        }
    })



    return (
        <div>
            {
                width <= 1200

                &&

                (
                    applicantListClicked

                        ?

                        <div className={styles.applicantListButtonClicked}>
                            {applicantList.map((current: any, index: number) => (
                                <div
                                    className={styles.applicantListContainer}
                                    onClick={() => {
                                        setApplicantIndex(index);
                                        setApplicantListClicked(false);
                                    }}
                                >
                                    {current.applicantName}
                                </div>
                            ))}
                        </div>

                        :

                        <div
                            className={styles.applicantListButtonNotClicked}
                            onClick={() => {
                                setApplicantListClicked(true);
                            }}
                        >
                            <div className={styles.applicantListName}>
                                {applicantIndex === -1 ? "응시자" : applicantList[applicantIndex].applicantName}
                            </div>
                        </div>
                )
            }

            {
                applicantList.length > 0

                    ?

                    <div className={styles.answerSheetContainer}>
                        <div className={styles.answerSheetContainerLeft}>
                            {
                                applicantList.map((current: any, index: number) => (
                                    <div
                                        className={applicantIndex === index ? styles.applicantContainerSelected : styles.applicantContainerNotSelected}
                                        onClick={() => {
                                            setApplicantIndex(index);
                                            setApplicantListClicked(false);
                                        }}
                                    >
                                        {current.applicantName}
                                    </div>
                                    // <div className={styles.applicantContainer}>
                                    //     <div className={styles.applicantName}>
                                    //         {current.applicantName}
                                    //     </div>

                                    //     <div className={styles.applicantContainer2}>
                                    //         <div className={styles.scores}>
                                    //             {current && current.reportCard.filter((elements: any) => elements === null).length !== 100 && current.reportCard.filter((element: any) => (element >= 0 && element !== null)).reduce(function add(sum: number, current: number) { return sum + current })}점
                                    //         </div>

                                    //         <div
                                    //             className={styles.checkAnswerSheetButton}
                                    //             onClick={() => { window.open("/test/" + testCode + "/answersheet/" + current.applicantCode) }}>
                                    //             답안지 확인
                                    //         </div>
                                    //     </div>
                                    // </div>
                                ))
                            }
                        </div>


                        <div className={styles.answerSheetContainerRight}>
                            {
                                applicantIndex === -1

                                    ?

                                    <Error message="응시자를 선택하세요." />

                                    :

                                    <div>
                                        <div className={styles.applicantInfoContainer}>
                                            <div className={styles.applicantName}>
                                                {applicantList[applicantIndex].applicantName}
                                            </div>

                                            <div className={styles.scoreContainer}>
                                                <div className={styles.applicantScore}>
                                                {applicantList[applicantIndex].reportCard.filter((elem: any) => (elem >= 0 && elem !== null)).reduce(function add(sum: number, current: number) { return sum + current })}
                                                </div>

                                                <div className={styles.dash}>
                                                    /
                                                </div>

                                                <div className={styles.totalScore}>
                                                    {questionList.length > 0 && questionList.map((row: any) => row.points).reduce((sum: number, current: number) => { return sum + current; }, 0)}
                                                </div>

                                                <div className={styles.unit}>
                                                    점
                                                </div>
                                            </div>
                                        </div>

                                        {
                                            applicantList[applicantIndex].answerSheet.filter((elem: any) => elem !== null).length > 0

                                                ?

                                                questionList.map((current: any, questionIndex: number) => (
                                                    <div className={styles.questionContainer}>
                                                        <div className={styles.questionContainer1}>
                                                            <div
                                                                style={{}}
                                                                className={
                                                                    applicantList[applicantIndex].reportCard[questionIndex] === questionList[questionIndex].points

                                                                        ?

                                                                        styles.questionNumberCorrect

                                                                        :

                                                                        (
                                                                            applicantList[applicantIndex].reportCard[questionIndex] === -1

                                                                                ?

                                                                                styles.questionNumberBefore

                                                                                :

                                                                                (
                                                                                    applicantList[applicantIndex].reportCard[questionIndex] === 0

                                                                                        ?

                                                                                        styles.questionNumberIncorrect

                                                                                        :

                                                                                        styles.questionNumberSomeCorrect
                                                                                )
                                                                        )
                                                                }
                                                            >
                                                                {questionIndex + 1}
                                                            </div>
                                                        </div>

                                                        <div className={styles.questionContainer2}>
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
                                                            font-weight: 500;
                                                            margin: 0px;
                                                            padding: 0px;
                                                        }
                                                    `
                                                                }}
                                                                value={current.question}
                                                            />
                                                        </div>

                                                        <div className={styles.questionContainer3}>
                                                            {
                                                                current.type === "객관식"

                                                                &&

                                                                <div className={styles.choiceAnswerContainer}>
                                                                    <div className={styles.choiceAnswerElements}>
                                                                        <div className={applicantList[applicantIndex].answerSheet[questionIndex][0] ? styles.choiceNumberSelected : styles.choiceNumberNotSelected}>
                                                                            1
                                                                        </div>

                                                                        <div className={applicantList[applicantIndex].answerSheet[questionIndex][0] ? styles.choiceValueSelected : styles.choiceValueNotSelected}>
                                                                            {current.choices[0]}
                                                                        </div>
                                                                    </div>

                                                                    <div className={styles.choiceAnswerElements}>
                                                                        <div className={applicantList[applicantIndex].answerSheet[questionIndex][1] ? styles.choiceNumberSelected : styles.choiceNumberNotSelected}>
                                                                            2
                                                                        </div>

                                                                        <div className={applicantList[applicantIndex].answerSheet[questionIndex][1] ? styles.choiceValueSelected : styles.choiceValueNotSelected}>
                                                                            {current.choices[1]}
                                                                        </div>
                                                                    </div>

                                                                    <div className={styles.choiceAnswerElements}>
                                                                        <div className={applicantList[applicantIndex].answerSheet[questionIndex][2] ? styles.choiceNumberSelected : styles.choiceNumberNotSelected}>
                                                                            3
                                                                        </div>

                                                                        <div className={applicantList[applicantIndex].answerSheet[questionIndex][2] ? styles.choiceValueSelected : styles.choiceValueNotSelected}>
                                                                            {current.choices[2]}
                                                                        </div>
                                                                    </div>

                                                                    {
                                                                        current.choices[3]

                                                                        &&

                                                                        <div className={styles.choiceAnswerElements}>
                                                                            <div className={applicantList[applicantIndex].answerSheet[questionIndex][3] ? styles.choiceNumberSelected : styles.choiceNumberNotSelected}>
                                                                                4
                                                                            </div>

                                                                            <div className={applicantList[applicantIndex].answerSheet[questionIndex][3] ? styles.choiceValueSelected : styles.choiceValueNotSelected}>
                                                                                {current.choices[3]}
                                                                            </div>
                                                                        </div>
                                                                    }

                                                                    {
                                                                        current.choices[4]

                                                                        &&

                                                                        <div className={styles.choiceAnswerElements}>
                                                                            <div className={applicantList[applicantIndex].answerSheet[questionIndex][4] ? styles.choiceNumberSelected : styles.choiceNumberNotSelected}>
                                                                                5
                                                                            </div>

                                                                            <div className={applicantList[applicantIndex].answerSheet[questionIndex][4] ? styles.choiceValueSelected : styles.choiceValueNotSelected}>
                                                                                {current.choices[4]}
                                                                            </div>
                                                                        </div>
                                                                    }

                                                                    {
                                                                        current.choices[5]

                                                                        &&

                                                                        <div className={styles.choiceAnswerElements}>
                                                                            <div className={applicantList[applicantIndex].answerSheet[questionIndex][5] ? styles.choiceNumberSelected : styles.choiceNumberNotSelected}>
                                                                                6
                                                                            </div>

                                                                            <div className={applicantList[applicantIndex].answerSheet[questionIndex][5] ? styles.choiceValueSelected : styles.choiceValueNotSelected}>
                                                                                {current.choices[5]}
                                                                            </div>
                                                                        </div>
                                                                    }

                                                                    {
                                                                        current.choices[6]

                                                                        &&

                                                                        <div className={styles.choiceAnswerElements}>
                                                                            <div className={applicantList[applicantIndex].answerSheet[questionIndex][6] ? styles.choiceNumberSelected : styles.choiceNumberNotSelected}>
                                                                                7
                                                                            </div>

                                                                            <div className={applicantList[applicantIndex].answerSheet[questionIndex][6] ? styles.choiceValueSelected : styles.choiceValueNotSelected}>
                                                                                {current.choices[6]}
                                                                            </div>
                                                                        </div>
                                                                    }

                                                                    {
                                                                        current.choices[7]

                                                                        &&

                                                                        <div className={styles.choiceAnswerElements}>
                                                                            <div className={applicantList[applicantIndex].answerSheet[questionIndex][7] ? styles.choiceNumberSelected : styles.choiceNumberNotSelected}>
                                                                                8
                                                                            </div>

                                                                            <div className={applicantList[applicantIndex].answerSheet[questionIndex][7] ? styles.choiceValueSelected : styles.choiceValueNotSelected}>
                                                                                {current.choices[7]}
                                                                            </div>
                                                                        </div>
                                                                    }

                                                                    {
                                                                        current.choices[8]

                                                                        &&

                                                                        <div className={styles.choiceAnswerElements}>
                                                                            <div className={applicantList[applicantIndex].answerSheet[questionIndex][8] ? styles.choiceNumberSelected : styles.choiceNumberNotSelected}>
                                                                                9
                                                                            </div>

                                                                            <div className={applicantList[applicantIndex].answerSheet[questionIndex][8] ? styles.choiceValueSelected : styles.choiceValueNotSelected}>
                                                                                {current.choices[8]}
                                                                            </div>
                                                                        </div>
                                                                    }

                                                                    {
                                                                        current.choices[9]

                                                                        &&

                                                                        <div className={styles.choiceAnswerElements}>
                                                                            <div className={applicantList[applicantIndex].answerSheet[questionIndex][9] ? styles.choiceNumberSelected : styles.choiceNumberNotSelected}>
                                                                                10
                                                                            </div>

                                                                            <div className={applicantList[applicantIndex].answerSheet[questionIndex][9] ? styles.choiceValueSelected : styles.choiceValueNotSelected}>
                                                                                {current.choices[9]}
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                </div>
                                                            }

                                                            {
                                                                current.type === "참/거짓"

                                                                &&

                                                                <div>
                                                                    {applicantList[applicantIndex].answerSheet[questionIndex] ? "참" : "거짓"}
                                                                </div>
                                                            }

                                                            {
                                                                current.type === "주관식"

                                                                &&

                                                                <div>
                                                                    {applicantList[applicantIndex].answerSheet[questionIndex]}
                                                                </div>
                                                            }


                                                            {
                                                                current.type === "서술형"

                                                                &&

                                                                <div>
                                                                    {applicantList[applicantIndex].answerSheet[questionIndex]}
                                                                </div>
                                                            }
                                                        </div>

                                                        <div className={styles.questionContainer4}>
                                                            <div className={styles.questionContainer4Left}>
                                                                {
                                                                    applicantList[applicantIndex].reportCard[questionIndex] === questionList[questionIndex].points

                                                                        ?

                                                                        <div className={styles.resultCorrect}>
                                                                            정답
                                                                        </div>

                                                                        :

                                                                        (
                                                                            applicantList[applicantIndex].reportCard[questionIndex] === -1

                                                                                ?

                                                                                <div className={styles.resultBefore}>
                                                                                    채점 전
                                                                                </div>

                                                                                :

                                                                                (
                                                                                    applicantList[applicantIndex].reportCard[questionIndex] === 0

                                                                                        ?

                                                                                        <div className={styles.resultIncorrect}>
                                                                                            오답
                                                                                        </div>

                                                                                        :

                                                                                        <div className={styles.resultSomeCorrect}>
                                                                                            부분 정답
                                                                                        </div>
                                                                                )
                                                                        )
                                                                }
                                                            </div>

                                                            <div className={styles.questionContainer4Right}>
                                                                {
                                                                    applicantList[applicantIndex].reportCard[questionIndex] > -1

                                                                    &&

                                                                    <div
                                                                        className={
                                                                            applicantList[applicantIndex].reportCard[questionIndex] === questionList[questionIndex].points

                                                                                ?

                                                                                styles.pointsCorrect

                                                                                :

                                                                                (
                                                                                    applicantList[applicantIndex].reportCard[questionIndex] === 0

                                                                                        ?

                                                                                        styles.pointsIncorrect

                                                                                        :

                                                                                        styles.pointsSomeCorrect
                                                                                )
                                                                        }
                                                                    >
                                                                        {applicantList[applicantIndex].reportCard[questionIndex]}
                                                                        /
                                                                        {questionList[questionIndex].points}
                                                                        점
                                                                    </div>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))

                                                :

                                                <Error message="해당 응시자는 답안지를 제출하지 않았습니다." />
                                        }
                                    </div>
                            }
                        </div>
                    </div>

                    :

                    <Error message="응시자가 없습니다." />
            }
        </div>
    )
}