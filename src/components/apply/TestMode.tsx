import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { dbService } from "../../FirebaseModules";
import { doc, getDoc, updateDoc, collection, orderBy, onSnapshot, query } from "firebase/firestore";

import Error from "../../Error";
import Notice from "./Notice";
import GetTestInfo from "../hooks/GetTestInfo";

import styles from "./TestMode.module.css";



export default function TestMode() {
    const { testCode } = useParams();
    const { applicantCode } = useParams();



    // 시험 정보
    const testInfo: any = GetTestInfo(testCode);



    // 다크/라이트 모드 설정
    const [darkMode, setDarkMode] = useState<boolean>(false);



    // 글자 크기 설정
    const [fontSizeIndex, setFontSizeIndex] = useState<number>(2);
    const fontSizeValue: [string, string][] = [
        ["아주 작게", "0.75rem"],
        ["작게", "0.9rem"],
        ["조금 작게", "1.05rem"],
        ["보통", "1.2rem"],
        ["조금 크게", "1.5rem"],
        ["크게", "2.0rem"],
        ["아주 크게", "2.5rem"],
    ]



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

            if (isApplyingTest) {
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
                            backgroundColor: "rgb(60, 60, 60)",
                            fontSize: fontSizeValue[fontSizeIndex][1]
                        }

                        :

                        { fontSize: fontSizeValue[fontSizeIndex][1] }
                ) : { fontSize: fontSizeValue[fontSizeIndex][1] }}

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



    // 시험 시작 전 남은 시간
    var daysBefore = Math.floor((startTime - currentTime) / 86400000)
    var hoursBefore = Math.floor(((startTime - currentTime) - daysBefore * 14400000) / 3600000);
    var minutesBefore = Math.floor(((startTime - currentTime) - hoursBefore * 3600000) / 60000);
    var secondsBefore = Math.floor(((startTime - currentTime) - hoursBefore * 3600000 - minutesBefore * 60000) / 1000);



    // 시험 응시 중 남은 시간
    var hoursCurrent = Math.floor((finishTime - currentTime) / 3600000);
    var minutesCurrent = Math.floor(((finishTime - currentTime) - hoursCurrent * 3600000) / 60000);
    var secondsCurrent = Math.floor(((finishTime - currentTime) - hoursCurrent * 3600000 - minutesCurrent * 60000) / 1000);



    // 체크 표시한 문제
    const [checkedQuestions, setCheckedQuestions] = useState<number[]>([]);



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

                                        <div className={styles.testTotalQuestions}>
                                            <img className={styles.testTotalIcons} src={process.env.PUBLIC_URL + "/icons/question.png"} />

                                            총 {questionList.length}문제
                                        </div>

                                        <div className={styles.testTotalPoints}>
                                            <img className={styles.testTotalIcons} src={process.env.PUBLIC_URL + "/icons/points.png"} />

                                            만점 {questionList.map((row: any) => row.points).reduce(function add(sum: number, cur: number) {
                                                return sum + cur
                                            })}점
                                        </div>

                                        <div className={styles.timer}>
                                            <img className={styles.timerIcon} src={process.env.PUBLIC_URL + "/icons/clock.png"} />

                                            <div className={styles.timerValue}>
                                                {hoursCurrent !== 0 && <span>{hoursCurrent}:</span>}
                                                {String(minutesCurrent).padStart(2, "0")}
                                                :
                                                {String(secondsCurrent).padStart(2, "0")}
                                            </div>
                                        </div>
                                    </div>



                                    <div
                                        className={styles.testModeContainerCenter}
                                        style={darkMode ? { borderTop: "1px solid rgb(80, 80, 80)", borderBottom: "1px solid rgb(80, 80, 80)" } : {}}
                                    >
                                        <div className={styles.navigation} style={darkMode ? { borderRight: "1px solid rgb(80, 80, 80)" } : {}}>
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

                                                        {
                                                            (
                                                                current.type === "객관식"

                                                                && Object.values(answerSheet[index]).filter((elem: any) => elem === true).length > 0

                                                                && answerSheet[index] !== null

                                                                && answerSheet[index] !== undefined
                                                            )

                                                            &&

                                                            <img className={styles.navigationNumberSolved} src={process.env.PUBLIC_URL + "/icons/check.png"} style={darkMode ? { backgroundColor: "rgb(50, 50, 50)" } : {}} />
                                                        }

                                                        {
                                                            (
                                                                (current.type === "참/거짓" || current.type === "주관식" || current.type === "서술형")

                                                                && answerSheet[index] !== null

                                                                && answerSheet[index] !== undefined

                                                                && answerSheet[index] !== ""
                                                            )

                                                            &&

                                                            <img className={styles.navigationNumberSolved} src={process.env.PUBLIC_URL + "/icons/check.png"} style={darkMode ? { backgroundColor: "rgb(50, 50, 50)" } : {}} />
                                                        }

                                                        {
                                                            checkedQuestions.includes(index)

                                                            &&

                                                            <img className={styles.navigationNumberChecked} src={process.env.PUBLIC_URL + "/icons/flag.png"} style={darkMode ? { backgroundColor: "rgb(50, 50, 50)" } : {}} /> 
                                                        }
                                                    </div>
                                                ))
                                            }
                                        </div>

                                        <div className={styles.questionAnswer}>
                                            <div className={styles.questionAnswerHeader}>
                                                <div className={styles.questionNumber}>
                                                    Q.{questionNumber + 1}
                                                </div>

                                                <div className={styles.questionType}>
                                                    {questionList[questionNumber].type}

                                                </div>

                                                <div className={styles.questionPoints}>
                                                    {questionList[questionNumber].points}점
                                                </div>

                                                <div />

                                                <div 
                                                    className={styles.checkQuestionButton}
                                                    onClick={() => {
                                                        if (checkedQuestions.includes(questionNumber)) {
                                                            let temp = checkedQuestions;
                                                            temp = temp.filter((elem: any) => elem !== questionNumber);
                                                            setCheckedQuestions(temp);
                                                        }

                                                        else {
                                                            let temp = checkedQuestions;
                                                            temp.push(questionNumber);
                                                            setCheckedQuestions(temp);
                                                        }
                                                    }}
                                                >
                                                    {checkedQuestions.includes(questionNumber) ? "문항 체크 해제" : "문항 체크"}
                                                </div>

                                                <div>
                                                    <input
                                                        type="button"
                                                        value="이전"
                                                        className={questionNumber !== 0 ? styles.prevButtonAble : styles.prevButtonDisabled}
                                                        style={darkMode ? (questionNumber !== 0 ? {} : { backgroundColor: "rgb(80, 80, 80)" }) : {}}
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
                                                        className={questionNumber !== questionList.length - 1 ? styles.nextButtonAble : styles.nextButtonDisabled}
                                                        style={darkMode ? (questionNumber !== questionList.length - 1 ? {} : { backgroundColor: "rgb(80, 80, 80)" }) : {}}
                                                        onClick={() => {
                                                            if (questionNumber !== questionList.length - 1) {
                                                                setQuestionNumber(questionNumber + 1);
                                                            }

                                                            submitAnswerSheet(event);
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className={styles.questionAnswerContent}>
                                                <div
                                                    className={styles.questionContent}
                                                    style={darkMode ? { color: "rgb(255, 255, 255)", fontSize: fontSizeValue[fontSizeIndex][1] } : { fontSize: fontSizeValue[fontSizeIndex][1] }}
                                                >
                                                    {questionList[questionNumber].question}
                                                </div>

                                                <div className={styles.answerContent}>
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
                                                                            backgroundColor: "rgb(60, 60, 60)",
                                                                            fontSize: fontSizeValue[fontSizeIndex][1]
                                                                        }

                                                                        :

                                                                        { fontSize: fontSizeValue[fontSizeIndex][1] }
                                                                ) : { fontSize: fontSizeValue[fontSizeIndex][1] }}

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
                                                                            backgroundColor: "rgb(60, 60, 60)",
                                                                            fontSize: fontSizeValue[fontSizeIndex][1]
                                                                        }

                                                                        :

                                                                        { fontSize: fontSizeValue[fontSizeIndex][1] }
                                                                ) : { fontSize: fontSizeValue[fontSizeIndex][1] }}

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
                                                            style={
                                                                darkMode

                                                                    ?

                                                                    {
                                                                        backgroundColor: "rgb(60, 60, 60)",
                                                                        color: "rgb(255, 255, 255)",
                                                                        fontSize: fontSizeValue[fontSizeIndex][1]
                                                                    }

                                                                    :

                                                                    { fontSize: fontSizeValue[fontSizeIndex][1] }
                                                            }
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
                                                                style={
                                                                    darkMode

                                                                        ?

                                                                        {
                                                                            backgroundColor: "rgb(60, 60, 60)",
                                                                            height: "calc(100% - 30px)",
                                                                            color: "rgb(255, 255, 255)",
                                                                            fontSize: fontSizeValue[fontSizeIndex][1]
                                                                        }

                                                                        :

                                                                        {
                                                                            height: "calc(100% - 30px)",
                                                                            fontSize: fontSizeValue[fontSizeIndex][1]
                                                                        }}
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
                                            </div>
                                        </div>
                                    </div>



                                    <div className={styles.testModeContainerBottom}>
                                        {
                                            darkMode

                                                ?

                                                <div className={styles.lightButton} onClick={() => { setDarkMode(!darkMode); }}>
                                                    <img className={styles.darkLightIcon} src={process.env.PUBLIC_URL + "/icons/sun.png"} />

                                                    <div className={styles.darkLightButtonText}>
                                                        밝은 화면
                                                    </div>
                                                </div>

                                                :

                                                <div className={styles.darkButton} onClick={() => { setDarkMode(!darkMode); }}>
                                                    <img className={styles.darkLightIcon} src={process.env.PUBLIC_URL + "/icons/moon.png"} />

                                                    <div className={styles.darkLightButtonText}>
                                                        어두운 화면
                                                    </div>
                                                </div>
                                        }

                                        <div className={styles.fontSizeContainer}>
                                            <div
                                                className={styles.fontSizeSmall}
                                                style={darkMode ? { backgroundColor: "rgb(60, 60, 60)", color: "rgb(255, 255, 255)" } : {}}
                                                onClick={() => {
                                                    if (fontSizeIndex !== 0) {
                                                        setFontSizeIndex(fontSizeIndex - 1);
                                                    }
                                                }
                                                }>
                                                -
                                            </div>

                                            <div
                                                className={styles.fontSizeValue}
                                                style={darkMode ? { backgroundColor: "rgb(60, 60, 60)", color: "rgb(255, 255, 255)" } : {}}
                                            >
                                                {fontSizeValue[fontSizeIndex][0]}
                                            </div>

                                            <div
                                                className={styles.fontSizeLarge}
                                                style={darkMode ? { backgroundColor: "rgb(60, 60, 60)", color: "rgb(255, 255, 255)" } : {}}
                                                onClick={() => {
                                                    if (fontSizeIndex !== fontSizeValue.length - 1) {
                                                        setFontSizeIndex(fontSizeIndex + 1);
                                                    }
                                                }
                                                }>
                                                +
                                            </div>
                                        </div>

                                        <div className={styles.submittedTime}>
                                            최종 제출 시간 &nbsp;
                                            {submittedTime && new Date(submittedTime).toLocaleString("ko-KR")}
                                        </div>

                                        <input type="submit" className={styles.submitButton} value="제출하기" />

                                        <input type="button" className={styles.exitButton} value="종료하기" />
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
                                        <div>
                                            {
                                                isTestTime === "전"

                                                &&

                                                <div className={styles.noticeContainerMain}>
                                                    <div className={styles.noticeContainerHeader}>
                                                        시험 안내사항
                                                    </div>

                                                    <div className={styles.noticeContainerMainTop}>
                                                        <Notice />
                                                    </div>

                                                    <div className={styles.noticeButtonBefore}>
                                                        {daysBefore !== 0 && <span>{daysBefore}일&nbsp;</span>}
                                                        {hoursBefore !== 0 && <span>{hoursBefore}시간&nbsp;</span>}
                                                        {minutesBefore !== 0 && <span>{minutesBefore}분&nbsp;</span>}
                                                        {secondsBefore}초&nbsp;
                                                        후 시험 시작
                                                    </div>
                                                </div>
                                            }

                                            {
                                                isTestTime === "중"

                                                &&

                                                <div className={styles.noticeContainerMain}>
                                                    <div className={styles.noticeContainerHeader}>
                                                        시험 안내사항
                                                    </div>

                                                    <div className={styles.noticeContainerMainTop}>
                                                        <Notice />
                                                    </div>

                                                    <div
                                                        className={styles.noticeButtonStart}
                                                        onClick={() => { setIsApplyingTest(true); }}
                                                    >
                                                        시험 시작하기
                                                    </div>
                                                </div>
                                            }

                                            {
                                                isTestTime === "후"

                                                &&

                                                <div className={styles.noticeContainerMain}>
                                                    <div />

                                                    <div className={styles.noticeContainerFinished}>
                                                        시험이 종료되었습니다.
                                                    </div>

                                                    <div className={styles.noticeButtonAfter}>
                                                        시험 종료 후 공개되지 않은 시험
                                                    </div>
                                                </div>
                                            }
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