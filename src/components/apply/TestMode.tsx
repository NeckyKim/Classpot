import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { dbService } from "../../FirebaseModules";
import { doc, getDoc, updateDoc, collection, orderBy, onSnapshot, query } from "firebase/firestore";

import Error from "../../Error";
import Notice from "./Notice";

import styles from "./TestMode.module.css";



export default function TestMode() {
    const { testCode } = useParams();
    const { applicantCode } = useParams();



    // 시험 정보
    const [testInfo, setTestInfo] = useState<any>();

    if (testCode) {
        useEffect(() => {
            getDoc(doc(dbService, "tests", testCode)).then((doc: any) => {
                setTestInfo(doc.data());
            });
        }, []);
    }



    // 다크/라이트 모드 설정
    const [darkMode, setDarkMode] = useState<boolean>(false);



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



    // 응시자 목록
    const [applicantsList, setApplicantsList] = useState<any>([]);

    if (testCode) {
        useEffect(() => {
            onSnapshot(query(collection(dbService, "tests", testCode, "applicants")), (snapshot) => {
                setApplicantsList(snapshot.docs.map((current) => (
                    current.id
                )));
            });
        }, [])
    }



    // 답안지 불러오기
    const [answerSheet, setAnswerSheet] = useState<any>([]);
    const [submittedTime, setSubmittedTime] = useState<number>();

    if (testCode && applicantCode) {
        useEffect(() => {
            getDoc(doc(dbService, "tests", testCode, "applicants", applicantCode)).then((doc: any) => {
                setAnswerSheet(doc.data().answerSheet);
                setSubmittedTime(doc.data().submittedTime);
            });
        }, [])
    }



    // 답안지 제출하기
    async function submitAnswerSheet(event: any) {
        event.preventDefault();

        if (testCode && applicantCode) {
            try {
                await updateDoc(doc(dbService, "tests", testCode, "applicants", applicantCode), {
                    answerSheet: answerSheet,
                    submittedTime: Date.now()
                })

                setSubmittedTime(Date.now());
            }

            catch (error) {
                alert("답안지 제출에 실패했습니다.");
                console.log(error);
            }
        }
    }



    // 시험 진행 상황
    const [isTestTime, setIsTestTime] = useState<string>("불");

    const startTime = testInfo?.startDate;
    const [currentTime, setIsCurrentTime] = useState<any>(Date.now());
    const finishTime = testInfo?.startDate + testInfo?.duration * 60000;

    useEffect(() => {
        const clock = setInterval(() => {
            setIsCurrentTime(Date.now());
        }, 1000);

        return (() => clearInterval(clock))
    }, []);

    useEffect(() => {
        if (currentTime < startTime) {
            setIsTestTime("전");
        }

        else if (currentTime >= startTime && currentTime <= finishTime) {
            setIsTestTime("중");
        }

        else if (currentTime > finishTime) {
            setIsTestTime("후");

            if(isApplyingTest) {
                submitAnswerSheet(event);
                setIsApplyingTest(false);
            }
        }
    })



    // 시험 응시 화면
    const [isApplyingTest, setIsApplyingTest] = useState<boolean>(false);
    const [questionNumber, setQuestionNumber] = useState<number>(0);

    // 객관식 선택지 컴포넌트
    function Choices({ choicesNumber }: { choicesNumber: number }) {
        return (
            <div
                className={(answerSheet[questionNumber] || {})[choicesNumber] ? styles.choiceSelected : styles.choiceNotSelected}

                style={darkMode ? (
                    !(answerSheet[questionNumber] || {})[choicesNumber]

                        ?

                        {
                            color: "rgb(255, 255, 255)",
                            backgroundColor: "rgb(60, 60, 60)"
                        }

                        :

                        {}
                ) : {}}

                onClick={() => {
                    var temp = [...answerSheet];

                    if (answerSheet[questionNumber] === null) {
                        temp[questionNumber] = { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false }

                        setAnswerSheet(temp);
                    }


                    if (temp[questionNumber][choicesNumber] === true) {
                        temp[questionNumber][choicesNumber] = false;
                    }

                    else {
                        temp[questionNumber][choicesNumber] = true;
                    }

                    setAnswerSheet(temp);

                }}
            >
                {questionList[questionNumber].choices[choicesNumber]}
            </div>
        )
    }


    var days = Math.floor((startTime - currentTime) / 144000000)
    var hours = Math.floor(((startTime - currentTime) - days * 144000000) / 6000000);
    var minutes = Math.floor(((startTime - currentTime) - hours * 6000000) / 60000);
    var seconds = Math.floor(((startTime - currentTime) - hours * 6000000 - minutes * 60000) / 1000);



    return (
        <div>
            {
                applicantsList.includes(applicantCode)

                    ?

                    <div>
                        {
                            isApplyingTest && isTestTime === "중"

                                ?

                                <form
                                    onSubmit={submitAnswerSheet}
                                    className={styles.testModeContainer}
                                    style={darkMode ? { backgroundColor: "rgb(40, 40, 40)" } : { backgroundColor: "rgb(255, 255, 255)" }}
                                >
                                    <div className={styles.testModeContainerTop}>
                                        <div className={styles.testName} style={darkMode ? { color: "rgb(255, 255, 255)" } : {}}>
                                            {testInfo.testName}
                                        </div>

                                        <div className={styles.prevNextButton}>
                                            <input
                                                type="button"
                                                value="이전"
                                                disabled={questionNumber == 0}
                                                className={styles.prevButton}
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
                                                disabled={questionNumber === questionList.length - 1}
                                                className={styles.nextButton}
                                                onClick={() => {
                                                    if (questionNumber !== questionList.length - 1) {
                                                        setQuestionNumber(questionNumber + 1);
                                                    }

                                                    submitAnswerSheet(event);
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div
                                        className={styles.testModeContainerBottom}
                                        style={darkMode ? { borderTop: "1px solid rgb(80, 80, 80)" } : {}}
                                    >
                                        <div className={styles.navigationNumberContainer}>
                                            <div>
                                                {
                                                    questionList.map((current: any, index: number) => (
                                                        <div
                                                            className={index === questionNumber ? styles.navigationNumberSelected : styles.navigationNumberNotSelected}

                                                            style={darkMode ? (
                                                                !(index === questionNumber)

                                                                    ?

                                                                    {
                                                                        color: "rgb(255, 255, 255)",
                                                                        backgroundColor: "rgb(60, 60, 60)"
                                                                    }

                                                                    :

                                                                    {}
                                                            ) : {}}

                                                            onClick={() => {
                                                                setQuestionNumber(index);
                                                                submitAnswerSheet(event);
                                                            }}
                                                        >
                                                            {index + 1}
                                                        </div>
                                                    ))
                                                }
                                            </div>

                                            <div
                                                className={styles.darkLightButton}
                                                onClick={() => {
                                                    setDarkMode(!darkMode);
                                                }}
                                            >
                                                LO
                                            </div>
                                        </div>

                                        <div
                                            className={styles.testModeContainerBottomLeft}
                                            style={darkMode ? { borderLeft: "1px solid rgb(80, 80, 80)" } : {}}
                                        >
                                            <div className={styles.testModeContainerBottomLeftTop}>
                                                <div className={styles.questionNumber}>
                                                    Q.{questionNumber + 1}
                                                </div>

                                                <div className={styles.questionPoints}>
                                                    {questionList[questionNumber].points}점
                                                </div>
                                            </div>

                                            <div className={styles.questionText} style={darkMode ? { color: "rgb(255, 255, 255)" } : {}}>
                                                {questionList[questionNumber].question}
                                            </div>
                                        </div>

                                        <div
                                            className={styles.testModeContainerBottomRight}
                                            style={darkMode ? { borderLeft: "1px solid rgb(80, 80, 80)" } : {}}
                                        >
                                            <div className={styles.testModeContainerBottomRightTop}>
                                                {
                                                    questionList[questionNumber].type === "객관식"

                                                    &&

                                                    <div>
                                                        <Choices choicesNumber={0} />
                                                        <Choices choicesNumber={1} />
                                                        <Choices choicesNumber={2} />
                                                        {questionList[questionNumber].choices[3] !== "" && <Choices choicesNumber={3} />}
                                                        {questionList[questionNumber].choices[4] !== "" && <Choices choicesNumber={4} />}
                                                        {questionList[questionNumber].choices[5] !== "" && <Choices choicesNumber={5} />}
                                                        {questionList[questionNumber].choices[6] !== "" && <Choices choicesNumber={6} />}
                                                        {questionList[questionNumber].choices[7] !== "" && <Choices choicesNumber={7} />}
                                                        {questionList[questionNumber].choices[8] !== "" && <Choices choicesNumber={8} />}
                                                        {questionList[questionNumber].choices[9] !== "" && <Choices choicesNumber={9} />}
                                                    </div>
                                                }

                                                {
                                                    questionList[questionNumber].type === "참/거짓"

                                                    &&

                                                    <div>
                                                        <div
                                                            className={answerSheet[questionNumber] === true ? styles.choiceSelected : styles.choiceNotSelected}

                                                            style={darkMode ? (
                                                                !(answerSheet[questionNumber])

                                                                    ?

                                                                    {
                                                                        color: "rgb(255, 255, 255)",
                                                                        backgroundColor: "rgb(60, 60, 60)"
                                                                    }

                                                                    :

                                                                    {}
                                                            ) : {}}

                                                            onClick={() => {
                                                                let temp = [...answerSheet];
                                                                temp[questionNumber] = true;
                                                                setAnswerSheet(temp);
                                                            }}
                                                        >
                                                            참
                                                        </div>

                                                        <div
                                                            className={answerSheet[questionNumber] === false ? styles.choiceSelected : styles.choiceNotSelected}

                                                            style={darkMode ? (
                                                                (answerSheet[questionNumber])

                                                                    ?

                                                                    {
                                                                        color: "rgb(255, 255, 255)",
                                                                        backgroundColor: "rgb(60, 60, 60)"
                                                                    }

                                                                    :

                                                                    {}
                                                            ) : {}}

                                                            onClick={() => {
                                                                let temp = [...answerSheet];
                                                                temp[questionNumber] = false;
                                                                setAnswerSheet(temp);
                                                            }}
                                                        >
                                                            거짓
                                                        </div>
                                                    </div>
                                                }

                                                {
                                                    questionList[questionNumber].type === "주관식"

                                                    &&

                                                    <textarea
                                                        className={styles.answerTextBox}
                                                        style={darkMode ? { backgroundColor: "rgb(60, 60, 60)", color: "rgb(255, 255, 255)" } : {}}
                                                        value={answerSheet[questionNumber]}
                                                        spellCheck={false}
                                                        onChange={(event: any) => {
                                                            let temp = [...answerSheet];
                                                            temp[questionNumber] = String(event.target.value);
                                                            setAnswerSheet(temp);
                                                        }}
                                                    />
                                                }

                                                {
                                                    questionList[questionNumber].type === "서술형"

                                                    &&

                                                    <div style={{ height: "calc(100% - 30px)" }}>
                                                        <textarea
                                                            className={styles.answerTextBox}
                                                            style={darkMode ? { backgroundColor: "rgb(60, 60, 60)", height: "calc(100% - 30px)", color: "rgb(255, 255, 255)" } : { height: "calc(100% - 30px)" }}
                                                            value={answerSheet[questionNumber]}
                                                            spellCheck={false}
                                                            onChange={(event: any) => {
                                                                let temp = [...answerSheet];
                                                                temp[questionNumber] = String(event.target.value);
                                                                setAnswerSheet(temp);
                                                            }}
                                                        />

                                                        <div className={styles.answerTextLength} style={darkMode ? { color: "rgb(120, 120, 120)" } : {}}>
                                                            총 {answerSheet[questionNumber] ? answerSheet[questionNumber].length : 0}자
                                                        </div>
                                                    </div>
                                                }
                                            </div>

                                            <div className={styles.testModeContainerBottomRightBottom}>
                                                <div className={styles.submittedTime}>
                                                    최종 제출 시간 &nbsp;
                                                    {submittedTime && new Date(submittedTime).toLocaleString("ko-KR")}
                                                </div>

                                                <input type="submit" className={styles.submitButton} value="제출하기" />

                                                <input type="button" className={styles.exitButton} value="종료하기" />
                                            </div>
                                        </div>
                                    </div>
                                </form>

                                :

                                <div className={styles.noticeContainer}>
                                    <div className={styles.noticeContainerTop}>
                                        <div className={styles.testName}>
                                            {testInfo.testName}
                                        </div>
                                    </div>

                                    <div className={styles.noticeContainerBottom}>
                                        <div className={styles.noticeContainerMain}>
                                            <div className={styles.noticeContainerMainTop}>
                                            </div>

                                            <div>
                                                {
                                                    isTestTime === "전"

                                                    &&

                                                    <div className={styles.noticeButtonBefore}>
                                                        {days}일 {hours}시간 {minutes}분 {seconds}초&nbsp;
                                                        후 시험 시작
                                                    </div>
                                                }

                                                {
                                                    isTestTime === "중"

                                                    &&

                                                    <div
                                                        className={styles.noticeButtonStart}
                                                        onClick={() => { setIsApplyingTest(true); }}
                                                    >
                                                        시험 시작하기
                                                    </div>
                                                }

                                                {
                                                    isTestTime === "후"

                                                    &&

                                                    <div className={styles.noticeButtonAfter}>
                                                        시험 종료
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        }
                    </div>

                    :

                    <Error message="유효하지 않은 응시자 입니다." />
            }
        </div>
    )
}