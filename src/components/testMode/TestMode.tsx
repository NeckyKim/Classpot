import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { dbService } from "../../FirebaseModules";
import { doc, getDoc, setDoc, updateDoc, collection, onSnapshot, query, orderBy } from "firebase/firestore";

import Error from "../../Error";
import GetTestInfo from "../hooks/GetTestInfo";
import GetApplicantInfo from "../hooks/GetApplicantInfo";
import GetQuestionList from "../hooks/GetQuestionList";
import GetApplicantList from "../hooks/GetApplicantList";
import GetNotificationList from "../hooks/GetNotificationList";
import TimeCalculator from "../hooks/TimeCalculator";
import PreTestMode from "./PreTestMode";

import { ToastContainer, cssTransition } from "react-toastify";
import { toast } from "react-toastify";
import { Editor } from '@tinymce/tinymce-react';

import styles from "./TestMode.module.css";



export default function TestMode() {
    const { testCode } = useParams();
    const { applicantCode } = useParams();



    // 시험 정보
    var testInfo: any = GetTestInfo(testCode);

    // 응시자 정보
    var applicantInfo: any = GetApplicantInfo(testCode, applicantCode);

    // 응시자 목록
    var applicantList: any = GetApplicantList(testCode);

    // 질문 목록
    var questionList: any = GetQuestionList(testCode);

    // 체크 표시한 문제
    const [checkedQuestions, setCheckedQuestions] = useState<number[]>([]);

    // 네비게이션 마우스 올리기 여부
    const [isMouseOnNavigation, setIsMouseOnNavigation] = useState<boolean>(false);

    // 시험 종료 여부
    const [isExitingTest, setIsExitingTest] = useState<boolean>(false);

    // 설정
    const [isSetting, setIsSetting] = useState<boolean>(false);



    // 다크 모드
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const darkBackgroundColor = "rgb(40, 50, 70)";
    const darkButtonColor = "rgb(60, 70, 90)";
    const darkBorderColor = "1px solid rgb(70, 80, 100)";

    // 화면 구성
    const [split, setSplit] = useState<boolean>(true);



    const [tempDate, setTempDate] = useState<number>(Date.now() + 30000);


    // 시험 환경 점검 안내 팝업
    const [sampleAlert, setSampleAlert] = useState<boolean>(false);

    if (testCode === "sample") {
        useEffect(() => {
            setSampleAlert(true);
        }, [])

        testInfo = {
            applyCode: "SAMPLE",
            createdTime: 1000000000,
            duration: 5,
            feedback: true,
            startDate: tempDate,
            showInfo: true,
            testName: "시험 환경 점검",
            userCode: "AGrRbUSDWXW1HEVRLgM5M1LDLB42",
            userName: "테스트콘",
        }

        applicantList = [
            {
                applicantCode: "sample",
                answerSheet: new Array(100).fill(null),
                applicantName: "체험 응시자",
                autoGrading: true,
                createdTime: Date.now(),
                magicCode: "SAMPLE",
                reportCard: new Array(100).fill(null),
                submittedTime: Date.now()
            }
        ]

        questionList = GetQuestionList("v11SzyBZgaLVIChPtqwV");
    }

    if (applicantCode === "sample") {
        applicantInfo = {
            answerSheet: new Array(100).fill(null),
            applicantName: "응시자",
            autoGrading: true,
            createdTime: Date.now(),
            magicCode: "SAMPLE",
            reportCard: new Array(100).fill(null),
            submittedTime: Date.now()
        }
    }



    // 시험 진행 상황
    var isTestTime = TimeCalculator(testInfo.startDate, testInfo.duration);



    // 화면 너비
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        window.addEventListener("resize", () => { setWidth(window.innerWidth); });
    });

    useEffect(() => {
        if (width < 1200) {
            setSplit(false);
        }
    }, [width])



    // 답안지 불러오기
    const [answerSheet, setAnswerSheet] = useState<any>([]);
    const [submittedTime, setSubmittedTime] = useState<number>();

    if (testCode === "sample") {
        useEffect(() => {
            setAnswerSheet(new Array(100).fill(null));
        }, [])
    }

    else {
        if (testCode && applicantCode) {
            useEffect(() => {
                getDoc(doc(dbService, "tests", testCode, "applicants", applicantCode)).then((doc: any) => {
                    setAnswerSheet(doc.data().answerSheet);
                    setSubmittedTime(doc.data().submittedTime);
                });
            }, [])
        }
    }



    // 답안 변경 여부
    const [modified, setModified] = useState<boolean>(false);

    // 답안지 제출하기
    async function submitAnswerSheet(event: any) {
        event.preventDefault();

        if (testCode === "sample" && modified) {
            try {
                sessionStorage.setItem("sampleTestAnswerSheet", JSON.stringify(answerSheet));

                toast.success("답안지가 제출되었습니다.");

                setModified(false);
                setSubmittedTime(Date.now());
            }

            catch (error) {
                toast.error("답안지 제출에 실패했습니다.");
                console.log(error);
            }
        }

        else {
            if (testCode && applicantCode && modified) {
                try {
                    await updateDoc(doc(dbService, "tests", testCode, "applicants", applicantCode), {
                        answerSheet: answerSheet,
                        submittedTime: Date.now()
                    })

                    toast.success("답안지가 제출되었습니다.");

                    setModified(false);
                    setSubmittedTime(Date.now());
                }

                catch (error) {
                    toast.error("답안지 제출에 실패했습니다.");
                    console.log(error);
                }
            }
        }
    }



    // 시험 응시 화면
    const [isApplyingTest, setIsApplyingTest] = useState<boolean>(false);
    const [questionNumber, setQuestionNumber] = useState<number>(0);


    if (isApplyingTest === true && isTestTime[0] === "후") {
        submitAnswerSheet(event);
        setIsApplyingTest(false);
    }



    // 객관식 문제 설정
    useEffect(() => {
        var temp = [...answerSheet];

        if (questionList.length > 0 && questionList[questionNumber].type === "객관식" && answerSheet[questionNumber] === null) {
            temp[questionNumber] = { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false }

            setAnswerSheet(temp);
        }
    }, [questionList, questionNumber])



    // 객관식 선택지 컴포넌트
    function Choices({ choicesNumber }: { choicesNumber: number }) {
        return (
            <div
                className={styles.choiceElements}

                onClick={() => {
                    var temp = [...answerSheet];

                    if (temp[questionNumber][choicesNumber] === true) {
                        temp[questionNumber][choicesNumber] = false;
                    }

                    else {
                        temp[questionNumber][choicesNumber] = true;
                    }

                    setAnswerSheet(temp);
                    setModified(true);
                }}
            >
                <div
                    className={(answerSheet[questionNumber] || {})[choicesNumber] ? styles.choiceNumberSelected : styles.choiceNumberNotSelected}
                    style={
                        isDarkMode && !((answerSheet[questionNumber] || {})[choicesNumber])

                            ?

                            {
                                color: "rgb(255, 255, 255)",
                                backgroundColor: darkButtonColor
                            } : {}
                    }
                >
                    {choicesNumber + 1}
                </div>

                <div className={(answerSheet[questionNumber] || {})[choicesNumber] ? styles.choiceValueSelected : styles.choiceValueNotSelected}>
                    {questionList[questionNumber].choices[choicesNumber]}
                </div>
            </div>
        )
    }



    const Fade = cssTransition({
        enter: "fadeIn",
        exit: "fadeOut"
    });



    // 푼 문제
    const [solved, setSolved] = useState<number[]>([]);

    useEffect(() => {
        questionList.filter((elem: any, index: number) => {
            if (elem.type === "객관식") {
                if (answerSheet[index] !== null && answerSheet[index] !== undefined && Object.values(answerSheet[index]).filter((elem: any) => elem === true).length > 0) {
                    if (!solved.includes(index)) {
                        var temp = [...solved];
                        temp.push(index);
                        setSolved(temp);
                    }
                }

                else {
                    if (solved.includes(index)) {
                        setSolved([...solved].filter((elem: number) => elem !== index));
                    }
                }
            }

            else {
                if (answerSheet[index] !== "" && answerSheet[index] !== null && answerSheet[index] !== undefined) {
                    if (!solved.includes(index)) {
                        var temp = [...solved];
                        temp.push(index);
                        setSolved(temp);
                    }
                }

                else {
                    if (solved.includes(index)) {
                        setSolved([...solved].filter((elem: number) => elem !== index));
                    }
                }
            }
        })
    }, [answerSheet])



    // 공지사항
    const [isNotification, setIsNotification] = useState<boolean>(false);
    const [latestNotification, setLatestNotification] = useState<number>(0);
    var notificationList: any = GetNotificationList(testCode);



    // 채팅 불러오기
    const [isMessage, setIsMessage] = useState<boolean>(false);
    const [messageList, setMessageList] = useState<any>([]);

    useEffect(() => {
        if (testCode && applicantCode) {
            onSnapshot(query(collection(dbService, "tests", testCode, "applicants", applicantCode, "messages"), orderBy("createdTime")), (snapshot) => {
                setMessageList(snapshot.docs.map((current) => ({
                    ...current.data()
                })));
            });
        }
    }, [isMessage])



    // 채팅 보내기
    const [message, setMessage] = useState<string>("");

    async function sendMessage(event: any) {
        event.preventDefault();

        if (testCode && applicantCode) {
            try {
                await setDoc(doc(collection(dbService, "tests", testCode, "applicants", applicantCode, "messages")), {
                    message: message,
                    createdTime: Date.now(),
                    createdBy: "applicant"
                })

                setMessage("");
            }

            catch (error) {
                console.log(error);
            }
        }
    }



    return (
        <div>
            <ToastContainer
                transition={Fade}
                position={width < 600 ? "bottom-center" : "bottom-right"}
                autoClose={1000}
                hideProgressBar
                newestOnTop={true}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={false}
                pauseOnHover={false}
                theme="colored"
                limit={1}
                style={
                    width < 600

                        ?

                        { right: "0", bottom: "70px" }

                        :

                        { right: "30px", bottom: "85px" }
                }
            />



            {
                sampleAlert

                &&

                <div className={styles.background}>
                    <div className={styles.sampleAlertContainer}>
                        <div className={styles.sampleAlertContainerHeader}>
                            시험 환경 점검
                        </div>

                        <ul className={styles.sampleAlertGuide}>
                            <li>실제 시험 화면과 동일한 화면입니다.</li>
                            <li>본 시험과는 전혀 연관이 없습니다.</li>
                            <li>시험 환경을 충분히 점검하신 후 본 시험을 시작해주세요.</li>
                        </ul>

                        <div
                            className={styles.confirmButton}
                            onClick={() => {
                                setSampleAlert(false);
                            }}
                        >
                            확인
                        </div>
                    </div>
                </div>
            }



            {
                applicantList.map((row: any) => row.applicantCode).includes(applicantCode)

                    ?


                    isApplyingTest && isTestTime[0] === "중"

                        ?

                        <form onSubmit={submitAnswerSheet} className={styles.testModeContainer}>
                            <div
                                className={styles.testModeContainerTop}
                                style={
                                    isDarkMode

                                        ?

                                        {
                                            color: "rgb(255, 255, 255)",
                                            backgroundColor: darkBackgroundColor,
                                            borderBottom: darkBorderColor
                                        } : {}
                                }
                            >
                                <img className={styles.testconLogo} src={process.env.PUBLIC_URL + "/logos/icon_gray.png"} />

                                <div className={styles.testModeCotainerTopInfo}>
                                    <div className={styles.testName}>
                                        {testInfo.testName}
                                    </div>

                                    <div
                                        className={styles.applicantName}
                                        style={
                                            isDarkMode

                                                ?

                                                {
                                                    borderLeft: darkBorderColor
                                                } : {}
                                        }
                                    >
                                        {applicantInfo.applicantName}
                                    </div>
                                </div>

                                <div className={styles.timer}>
                                    <img className={styles.timerIcon} src={process.env.PUBLIC_URL + "/icons/clock.png"} />

                                    <div className={styles.timerHeader}>
                                        남은 시간
                                    </div>

                                    <div className={styles.timerValue}>
                                        {isTestTime[2][0] !== 0 && <span>{isTestTime[2][0]}:</span>}
                                        {String(isTestTime[2][1]).padStart(2, "0")}
                                        :
                                        {String(isTestTime[2][2]).padStart(2, "0")}
                                    </div>
                                </div>
                            </div>



                            <div
                                className={styles.navigation}
                                onMouseEnter={() => { setIsMouseOnNavigation(true); }}
                                onMouseLeave={() => { setIsMouseOnNavigation(false); }}
                                style={
                                    isDarkMode

                                        ?

                                        {
                                            color: "rgb(255, 255, 255)",
                                            backgroundColor: darkBackgroundColor,
                                            borderRight: darkBorderColor
                                        } : {}
                                }
                            >
                                {
                                    questionList.length > 0

                                    &&

                                    questionList.map((current: any, index: number) => (
                                        <div
                                            className={styles.navigationNumber}
                                            onClick={() => {
                                                setQuestionNumber(index);
                                                submitAnswerSheet(event);
                                            }}
                                        >
                                            <div
                                                className={index === questionNumber ? styles.navigationNumberSelected : styles.navigationNumberNotSelected}
                                                style={
                                                    isDarkMode && index !== questionNumber

                                                        ?

                                                        {
                                                            color: "rgb(255, 255, 255)",
                                                            backgroundColor: darkButtonColor
                                                        } : {}
                                                }
                                            >
                                                {index + 1}

                                                {
                                                    (
                                                        current.type === "객관식"

                                                        && answerSheet[index] !== null

                                                        && answerSheet[index] !== undefined

                                                        && Object.values(answerSheet[index]).filter((elem: any) => elem === true).length > 0
                                                    )

                                                    &&

                                                    <img
                                                        className={styles.navigationNumberSolved}
                                                        src={process.env.PUBLIC_URL + "/icons/check.png"}
                                                        style={
                                                            isDarkMode

                                                                ?

                                                                {
                                                                    backgroundColor: darkButtonColor,
                                                                } : {}
                                                        }
                                                    />
                                                }

                                                {
                                                    (
                                                        (current.type === "참/거짓" || current.type === "주관식" || current.type === "서술형")

                                                        && answerSheet[index] !== null

                                                        && answerSheet[index] !== undefined

                                                        && answerSheet[index] !== ""
                                                    )

                                                    &&

                                                    <img
                                                        className={styles.navigationNumberSolved}
                                                        src={process.env.PUBLIC_URL + "/icons/check.png"}
                                                        style={
                                                            isDarkMode

                                                                ?

                                                                {
                                                                    backgroundColor: darkButtonColor,
                                                                } : {}
                                                        }
                                                    />
                                                }

                                                {
                                                    checkedQuestions.includes(index)

                                                    &&

                                                    <img
                                                        className={styles.navigationNumberChecked}
                                                        src={process.env.PUBLIC_URL + "/icons/flag.png"}
                                                        style={
                                                            isDarkMode

                                                                ?

                                                                {
                                                                    backgroundColor: darkButtonColor,
                                                                } : {}
                                                        }
                                                    />
                                                }
                                            </div>

                                            {/* {
                                                isMouseOnNavigation

                                                &&

                                                <div className={styles.navigationInfo}>
                                                    <div className={styles.navigationInfoType}>
                                                        {current.type}
                                                    </div>

                                                    <div className={styles.navigationInfoPoints}>
                                                        {current.points}점
                                                    </div>
                                                </div>
                                            } */}
                                        </div>
                                    ))
                                }
                            </div>



                            {
                                questionList.length > 0

                                &&

                                <div
                                    className={styles.questionAnswerHeader}
                                    style={
                                        isDarkMode

                                            ?

                                            {
                                                color: "rgb(255, 255, 255)",
                                                backgroundColor: darkBackgroundColor,
                                                borderBottom: darkBorderColor
                                            } : {}
                                    }
                                >
                                    <div className={styles.questionNumber}>
                                        {questionNumber + 1}
                                    </div>

                                    <div className={styles.questionType}>
                                        {
                                            questionList[questionNumber].type === "객관식"

                                            &&

                                            <img className={styles.questionTypeIcon} src={process.env.PUBLIC_URL + "/icons/multiple_choice.png"} />
                                        }

                                        {
                                            questionList[questionNumber].type === "참/거짓"

                                            &&

                                            <img className={styles.questionTypeIcon} src={process.env.PUBLIC_URL + "/icons/true_false.png"} />
                                        }

                                        {
                                            questionList[questionNumber].type === "주관식"

                                            &&

                                            <img className={styles.questionTypeIcon} src={process.env.PUBLIC_URL + "/icons/short_answer.png"} />
                                        }

                                        {
                                            questionList[questionNumber].type === "서술형"

                                            &&

                                            <img className={styles.questionTypeIcon} src={process.env.PUBLIC_URL + "/icons/essay.png"} />
                                        }
                                        {questionList[questionNumber].type}
                                    </div>

                                    <div className={styles.questionPoints}>
                                        {questionList[questionNumber].points}점
                                    </div>

                                    <div
                                        className={checkedQuestions.includes(questionNumber) ? styles.checkQuestionButtonChecked : styles.checkQuestionButtonNotChecked}
                                        onClick={() => {
                                            if (checkedQuestions.includes(questionNumber)) {
                                                let temp = [...checkedQuestions];
                                                temp = temp.filter((elem: any) => elem !== questionNumber);
                                                setCheckedQuestions(temp);
                                            }

                                            else {
                                                let temp = [...checkedQuestions];
                                                temp.push(questionNumber);
                                                temp.sort();
                                                setCheckedQuestions(temp);
                                            }
                                        }}
                                        style={
                                            isDarkMode && !checkedQuestions.includes(questionNumber)

                                                ?

                                                {
                                                    color: "rgb(255, 255, 255)",
                                                    backgroundColor: darkButtonColor
                                                } : {}
                                        }
                                    >
                                        { }
                                        <img
                                            className={checkedQuestions.includes(questionNumber) ? styles.checkQuestionButtonIconChecked : styles.checkQuestionButtonIconNotChecked}
                                            src={checkedQuestions.includes(questionNumber) ? process.env.PUBLIC_URL + "/icons/flag_white.png" : process.env.PUBLIC_URL + "/icons/flag_black.png"}
                                        />
                                        {checkedQuestions.includes(questionNumber) ? "문제 체크 해제" : "문제 체크"}
                                    </div>

                                    <div
                                        className={questionNumber !== 0 ? styles.prevNextButtonOn : styles.prevNextButtonOff}
                                        style={
                                            isDarkMode && questionNumber === 0

                                                ?

                                                {
                                                    color: "rgb(255, 255, 255)",
                                                    backgroundColor: darkButtonColor,
                                                    borderRadius: "5px 0px 0px 5px"
                                                }

                                                :

                                                {
                                                    borderRadius: "5px 0px 0px 5px"
                                                }
                                        }
                                        onClick={() => {
                                            if (questionNumber !== 0) {
                                                setQuestionNumber(questionNumber - 1);
                                            }

                                            submitAnswerSheet(event);
                                        }}
                                    >
                                        {width < 600 ? <img className={styles.prevNextButtonImage} src={process.env.PUBLIC_URL + "/icons/arrow_left.png"} /> : "이전"}
                                    </div>

                                    <div
                                        className={questionNumber !== questionList.length - 1 ? styles.prevNextButtonOn : styles.prevNextButtonOff}
                                        style={
                                            isDarkMode && questionNumber === questionList.length - 1

                                                ?

                                                {
                                                    color: "rgb(255, 255, 255)",
                                                    backgroundColor: darkButtonColor,
                                                    borderRadius: "0px 5px 5px 0px",
                                                    marginLeft: "1px"
                                                }

                                                :

                                                {
                                                    borderRadius: "0px 5px 5px 0px",
                                                    marginLeft: "1px"
                                                }
                                        }
                                        onClick={() => {
                                            if (questionNumber !== questionList.length - 1) {
                                                setQuestionNumber(questionNumber + 1);
                                            }

                                            submitAnswerSheet(event);
                                        }}
                                    >
                                        {width < 600 ? <img className={styles.prevNextButtonImage} src={process.env.PUBLIC_URL + "/icons/arrow_right.png"} /> : "다음"}
                                    </div>
                                </div>
                            }



                            {
                                questionList.length > 0

                                &&

                                <div
                                    className={split ? styles.questionAnswerContentRL : styles.questionAnswerContentUD}
                                    style={
                                        isDarkMode

                                            ?

                                            {
                                                color: "rgb(255, 255, 255)",
                                                backgroundColor: darkBackgroundColor
                                            } : {}
                                    }
                                >
                                    <div
                                        className={split ? styles.questionContentRL : styles.questionContentUD}
                                        style={
                                            isDarkMode && split

                                                ?

                                                {
                                                    color: "rgb(255, 255, 255)",
                                                    borderRight: darkBorderColor
                                                } : {}
                                        }
                                    >
                                        {
                                            isDarkMode

                                                ?

                                                <div>
                                                    <Editor
                                                        apiKey="8q7n1e2sd7e0wh0gt9d3vyc8p1kkznty14inel82mcodryjw"
                                                        disabled={true}
                                                        init={{
                                                            readonly: true,
                                                            menubar: false,
                                                            toolbar: false,
                                                            statusbar: false,
                                                            plugins: ["autoresize", "codesample"],
                                                            skin: "borderless",
                                                            content_style:
                                                                `
                                                        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

                                                        body {
                                                            font-family: 'Pretendard';
                                                            font-weight: 600;
                                                            margin: 0px;
                                                            padding: 0px;
                                                            color: white;
                                                        }
                                                    `
                                                        }}
                                                        value={questionList[questionNumber].question}
                                                    />
                                                </div>

                                                :

                                                <>
                                                    <Editor
                                                        apiKey="8q7n1e2sd7e0wh0gt9d3vyc8p1kkznty14inel82mcodryjw"
                                                        disabled={true}
                                                        init={{
                                                            readonly: true,
                                                            menubar: false,
                                                            toolbar: false,
                                                            statusbar: false,
                                                            plugins: ["autoresize", "codesample"],
                                                            skin: "borderless",
                                                            content_style:
                                                                `
                                                    @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

                                                    body {
                                                        font-family: 'Pretendard';
                                                        font-weight: 600;
                                                        margin: 0px;
                                                        padding: 0px;
                                                        color: black;
                                                    }
                                                `
                                                        }}
                                                        value={questionList[questionNumber].question}
                                                    />
                                                </>
                                        }
                                    </div>

                                    <div
                                        className={split ? styles.answerContentRL : styles.answerContentUD}
                                        style={
                                            !split

                                                ?

                                                {
                                                    paddingTop: "0px"
                                                } : {}
                                        }
                                    >
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
                                                    className={styles.choiceElements}
                                                    onClick={() => {
                                                        let temp = [...answerSheet];
                                                        temp[questionNumber] = true;
                                                        setModified(true);
                                                        setAnswerSheet(temp);
                                                    }}
                                                >
                                                    <div
                                                        className={answerSheet[questionNumber] === true ? styles.choiceNumberSelected : styles.choiceNumberNotSelected}
                                                        style={
                                                            isDarkMode && answerSheet[questionNumber] !== true

                                                                ?

                                                                {
                                                                    color: "rgb(255, 255, 255)",
                                                                    backgroundColor: darkButtonColor
                                                                } : {}
                                                        }
                                                    >
                                                        ○
                                                    </div>

                                                    <div className={answerSheet[questionNumber] === true ? styles.choiceValueSelected : styles.choiceValueNotSelected}>
                                                        참
                                                    </div>
                                                </div>

                                                <div
                                                    className={styles.choiceElements}
                                                    onClick={() => {
                                                        let temp = [...answerSheet];
                                                        temp[questionNumber] = false;
                                                        setModified(true);
                                                        setAnswerSheet(temp);
                                                    }}
                                                >
                                                    <div
                                                        className={answerSheet[questionNumber] === false ? styles.choiceNumberSelected : styles.choiceNumberNotSelected}
                                                        style={
                                                            isDarkMode && answerSheet[questionNumber] !== false

                                                                ?

                                                                {
                                                                    color: "rgb(255, 255, 255)",
                                                                    backgroundColor: darkButtonColor
                                                                } : {}
                                                        }
                                                    >
                                                        X
                                                    </div>

                                                    <div className={answerSheet[questionNumber] === false ? styles.choiceValueSelected : styles.choiceValueNotSelected}>
                                                        거짓
                                                    </div>
                                                </div>
                                            </div>
                                        }

                                        {
                                            questionList[questionNumber].type === "주관식"

                                            &&

                                            <textarea
                                                className={styles.answerTextBox}
                                                value={answerSheet[questionNumber]}
                                                spellCheck={false}
                                                placeholder="이곳에 정답을 입력하세요."
                                                onChange={(event: any) => {
                                                    let temp = [...answerSheet];
                                                    temp[questionNumber] = String(event.target.value);
                                                    setModified(true);
                                                    setAnswerSheet(temp);
                                                }}
                                                style={
                                                    isDarkMode

                                                        ?

                                                        {
                                                            color: "rgb(255, 255, 255)",
                                                            backgroundColor: darkBackgroundColor,
                                                            border: darkBorderColor
                                                        } : {}
                                                }
                                            />
                                        }

                                        {
                                            questionList[questionNumber].type === "서술형"

                                            &&

                                            <div style={{ height: "calc(100% - 30px)" }}>
                                                <textarea
                                                    className={styles.answerTextBox}
                                                    value={answerSheet[questionNumber]}
                                                    spellCheck={false}
                                                    placeholder="이곳에 정답을 입력하세요."
                                                    onChange={(event: any) => {
                                                        let temp = [...answerSheet];
                                                        temp[questionNumber] = String(event.target.value);
                                                        setModified(true);
                                                        setAnswerSheet(temp);
                                                    }}
                                                    style={
                                                        isDarkMode

                                                            ?

                                                            {
                                                                color: "rgb(255, 255, 255)",
                                                                backgroundColor: darkBackgroundColor,
                                                                border: darkBorderColor
                                                            } : {}
                                                    }
                                                />

                                                <div className={styles.answerTextLength}>
                                                    총 {answerSheet[questionNumber] ? answerSheet[questionNumber].length : 0}자
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            }



                            <div
                                className={styles.testModeContainerBottom}
                                style={
                                    isDarkMode

                                        ?

                                        {
                                            color: "rgb(255, 255, 255)",
                                            backgroundColor: darkBackgroundColor,
                                            borderTop: darkBorderColor
                                        } : {}
                                }
                            >
                                {/* 설정 버튼 */}
                                <div
                                    className={styles.settingsButton}
                                    onClick={() => { setIsSetting(true); }}
                                    style={
                                        isDarkMode

                                            ?

                                            {
                                                color: "rgb(255, 255, 255)",
                                                backgroundColor: darkButtonColor
                                            } : {}
                                    }
                                >
                                    <img
                                        className={styles.testModeContainerBottomIcon}
                                        src={process.env.PUBLIC_URL + "/icons/settings.png"}
                                        style={
                                            isDarkMode

                                                ?

                                                {
                                                    filter: "invert()"
                                                } : {}
                                        }
                                    />
                                </div>

                                {/* 공지사항 버튼 */}
                                <div
                                    className={
                                        ((notificationList?.length === 0) || (sessionStorage.getItem("notifications") === String(notificationList[notificationList.length - 1]?.createdTime)))

                                            ?

                                            styles.notificationButtonNormal

                                            :

                                            styles.notificationButtonPulse
                                    }
                                    onClick={() => {
                                        setIsNotification(true);
                                        sessionStorage.setItem("notifications", notificationList[notificationList.length - 1]?.createdTime);
                                    }}
                                    style={
                                        sessionStorage.getItem("notifications") !== String(notificationList[notificationList.length - 1]?.createdTime)

                                            ?

                                            {
                                                backgroundColor: "rgb(250, 50, 50)"
                                            }

                                            :

                                            (
                                                isDarkMode

                                                    ?

                                                    {
                                                        color: "rgb(255, 255, 255)",
                                                        backgroundColor: darkButtonColor
                                                    } : {}
                                            )
                                    }
                                >
                                    <img
                                        className={styles.testModeContainerBottomIcon}
                                        src={process.env.PUBLIC_URL + "/icons/notice.png"}
                                        style={
                                            isDarkMode || sessionStorage.getItem("notifications") !== String(notificationList[notificationList.length - 1]?.createdTime)

                                                ?

                                                {
                                                    filter: "invert()"
                                                } : {}
                                        }
                                    />
                                </div>

                                {/* 채팅 버튼 */}
                                <div
                                    className={
                                        ((messageList?.length === 0) || (sessionStorage.getItem("messages") === String(messageList[messageList.length - 1]?.createdTime)))

                                            ?

                                            styles.notificationButtonNormal

                                            :

                                            styles.notificationButtonPulse
                                    }
                                    onClick={() => { 
                                        setIsMessage(true);
                                        sessionStorage.setItem("messages", messageList[messageList.length - 1]?.createdTime);
                                    }}
                                    style={
                                        sessionStorage.getItem("messages") !== String(messageList[messageList.length - 1]?.createdTime)

                                            ?

                                            {
                                                backgroundColor: "rgb(250, 50, 50)"
                                            }

                                            :

                                            (
                                                isDarkMode

                                                    ?

                                                    {
                                                        color: "rgb(255, 255, 255)",
                                                        backgroundColor: darkButtonColor
                                                    } : {}
                                            )
                                    }
                                >
                                    <img
                                        className={styles.testModeContainerBottomIcon}
                                        src={process.env.PUBLIC_URL + "/icons/chat.png"}
                                        style={
                                            isDarkMode || sessionStorage.getItem("messages") !== String(messageList[messageList.length - 1]?.createdTime)

                                                ?

                                                {
                                                    filter: "invert()"
                                                } : {}
                                        }
                                    />
                                </div>

                                <div className={styles.submittedTime}>
                                    최종 제출 시간
                                    {width < 1200 ? <br /> : " "}
                                    {submittedTime && new Date(submittedTime).toLocaleString("ko-KR")}
                                </div>

                                <input
                                    type="submit"
                                    className={styles.submitButton}
                                    value="제출하기"
                                    style={
                                        isDarkMode

                                            ?

                                            {
                                                color: "rgb(255, 255, 255)",
                                                backgroundColor: darkButtonColor
                                            } : {}
                                    }
                                />

                                <input
                                    type="button"
                                    className={styles.exitButton}
                                    value="종료하기"
                                    style={
                                        isDarkMode

                                            ?

                                            {
                                                color: "rgb(255, 255, 255)",
                                                backgroundColor: darkButtonColor
                                            } : {}
                                    }
                                    onClick={() => {
                                        setIsExitingTest(true);
                                    }}
                                />
                            </div>


                            {
                                // 설정 창

                                isSetting

                                &&

                                <div className={styles.background}>
                                    <div className={styles.backgroundContainer}>
                                        <div className={styles.backgroundContainerHeaderWithCloseButton}>
                                            설정

                                            <img
                                                className={styles.closeIcon}
                                                src={process.env.PUBLIC_URL + "/icons/close.png"}
                                                onClick={() => { setIsSetting(false); }}
                                            />
                                        </div>

                                        <div>
                                            <div className={styles.settingsElementsHeader}>
                                                화면 밝기
                                            </div>

                                            <div
                                                className={!isDarkMode ? styles.settingsElementsButtonClicked : styles.settingsElementsButtonNotClicked}
                                                onClick={() => { setIsDarkMode(false); }}
                                            >
                                                <img
                                                    className={styles.settingsIcon}
                                                    src={process.env.PUBLIC_URL + "/icons/bright.png"}
                                                    style={!isDarkMode ? { filter: "invert()" } : {}}
                                                />

                                                밝게
                                            </div>

                                            <div
                                                className={isDarkMode ? styles.settingsElementsButtonClicked : styles.settingsElementsButtonNotClicked}
                                                onClick={() => { setIsDarkMode(true); }}
                                            >
                                                <img
                                                    className={styles.settingsIcon}
                                                    src={process.env.PUBLIC_URL + "/icons/dark.png"}
                                                    style={isDarkMode ? { filter: "invert()" } : {}}
                                                />

                                                어둡게
                                            </div>
                                        </div>

                                        {
                                            width > 1200

                                            &&

                                            <div>
                                                <div className={styles.settingsElementsHeader}>
                                                    화면 구성
                                                </div>

                                                <div
                                                    className={split ? styles.settingsElementsButtonClicked : styles.settingsElementsButtonNotClicked}
                                                    onClick={() => { setSplit(true); }}
                                                >
                                                    <img
                                                        className={styles.settingsIcon}
                                                        src={process.env.PUBLIC_URL + "/icons/RL.png"}
                                                        style={split ? { filter: "invert()" } : {}}
                                                    />

                                                    좌우로 분할
                                                </div>

                                                <div
                                                    className={!split ? styles.settingsElementsButtonClicked : styles.settingsElementsButtonNotClicked}
                                                    onClick={() => { setSplit(false); }}
                                                >
                                                    <img
                                                        className={styles.settingsIcon}
                                                        src={process.env.PUBLIC_URL + "/icons/UD.png"}
                                                        style={!split ? { filter: "invert()" } : {}}
                                                    />

                                                    위아래로 분할
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            }

                            {
                                // 공지사항 창

                                isNotification

                                &&

                                <div className={styles.background}>
                                    <div className={styles.backgroundContainer}>
                                        <div className={styles.backgroundContainerHeaderWithCloseButton}>
                                            공지사항

                                            <img
                                                className={styles.closeIcon}
                                                src={process.env.PUBLIC_URL + "/icons/close.png"}
                                                onClick={() => { setIsNotification(false); }}
                                            />
                                        </div>

                                        <div className={styles.notificationElementsContainer}>
                                            {
                                                notificationList.length > 0

                                                    ?

                                                    <div>
                                                        {
                                                            notificationList.map((current: any) => (
                                                                <div className={styles.notificationElements}>
                                                                    <div className={styles.notificationElementsText}>
                                                                        {current.notification}
                                                                    </div>

                                                                    <div className={styles.notificationElementsDate}>
                                                                        {new Date(current.createdTime).toLocaleString("ko-KR")}
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>

                                                    :

                                                    "공지사항이 없습니다."
                                            }
                                        </div>
                                    </div>
                                </div>
                            }

                            {
                                // 채팅 창

                                isMessage

                                &&

                                <div className={styles.background}>
                                    <div className={styles.messageContainer}>
                                        <div className={styles.backgroundContainerHeaderWithCloseButton}>
                                            채팅

                                            <img
                                                className={styles.closeIcon}
                                                src={process.env.PUBLIC_URL + "/icons/close.png"}
                                                onClick={() => { setIsMessage(false); }}
                                            />
                                        </div>


                                        <div className={styles.messageElementsContainer}>
                                            {
                                                messageList.map((current: any) => (
                                                    <div className={current.createdBy === "supervisor" ? styles.messageElementsWrapperSupervisor : styles.messageElementsWrapperApplicant}>

                                                        {
                                                            current.createdBy === "supervisor"

                                                                ?

                                                                <div className={styles.messageElementsHeaderSupervisor}>
                                                                    감독관
                                                                </div>

                                                                :

                                                                <div className={styles.messageElementsHeaderApplicant}>
                                                                    {applicantInfo.applicantName}
                                                                </div>
                                                        }

                                                        <div className={current.createdBy === "supervisor" ? styles.messageElementsTextSupervisor : styles.messageElementsTextApplicant}>
                                                            {current.message}
                                                        </div>
                                                    </div>

                                                ))
                                            }
                                        </div>

                                        <div className={styles.messageBox}>
                                            <input
                                                value={message}
                                                onChange={(event: any) => { setMessage(event.target.value); }}
                                                className={styles.messageInputBox}
                                                required
                                            />

                                            <img
                                                className={styles.messageSendButton}
                                                src={process.env.PUBLIC_URL + "/icons/send.png"}
                                                onClick={() => {
                                                    if (message) {
                                                        sendMessage(event);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            }

                            {
                                // 시험 종료 창

                                isExitingTest

                                &&

                                <div className={styles.background}>
                                    <div className={styles.backgroundContainer}>
                                        <div className={styles.backgroundContainerHeader}>
                                            시험 종료
                                        </div>

                                        <div className={styles.exitContainerTop}>
                                            답안지를 제출하고 시험을 종료하시겠습니까?<br />
                                            시험 시간이 종료될 때 까지, 다시 접속하여 시험에 응시할 수 있습니다.
                                        </div>

                                        {
                                            questionList.length === solved.length

                                                ?

                                                <div className={styles.exitContainerNoticePass}>
                                                    <img className={styles.exitContainerNoticeIcon} src={process.env.PUBLIC_URL + "/icons/pass.png"} />

                                                    모든 문제를 다 풀었습니다.
                                                </div>

                                                :

                                                <div className={styles.exitContainerNoticeAlert}>
                                                    <img className={styles.exitContainerNoticeIcon} src={process.env.PUBLIC_URL + "/icons/alert.png"} />

                                                    풀지 않은 문제가 {questionList.length - solved.length}개 있습니다.
                                                </div>
                                        }

                                        <div className={styles.exitContainerQuestionStatus}>
                                            {
                                                questionList.length > 0

                                                &&

                                                questionList.map((current: any, index: number) => (
                                                    current.type === "객관식"

                                                        ?

                                                        (
                                                            answerSheet[index] !== null

                                                                && answerSheet[index] !== undefined

                                                                && Object.values(answerSheet[index]).filter((elem: any) => elem === true).length > 0

                                                                ?

                                                                <div
                                                                    className={styles.questionStatusElementsSolved}
                                                                    onClick={() => {
                                                                        setIsExitingTest(false);
                                                                        setQuestionNumber(index);
                                                                    }}
                                                                >
                                                                    <div className={styles.questionStatusElementsNumber}>
                                                                        {index + 1}
                                                                    </div>

                                                                    <div className={styles.exitQuestionContainerTextSolved}>
                                                                        푼 문제
                                                                    </div>
                                                                </div>

                                                                :

                                                                <div
                                                                    className={styles.questionStatusElementsNotSolved}
                                                                    onClick={() => {
                                                                        setIsExitingTest(false);
                                                                        setQuestionNumber(index);
                                                                    }}
                                                                >
                                                                    <div className={styles.questionStatusElementsNumber}>
                                                                        {index + 1}
                                                                    </div>

                                                                    <div className={styles.exitQuestionContainerTextNotSolved}>
                                                                        풀지 않은 문제
                                                                    </div>
                                                                </div>

                                                        )

                                                        :

                                                        (
                                                            answerSheet[index] !== null

                                                                && answerSheet[index] !== undefined

                                                                && answerSheet[index] !== ""

                                                                ?

                                                                <div
                                                                    className={styles.questionStatusElementsSolved}
                                                                    onClick={() => {
                                                                        setIsExitingTest(false);
                                                                        setQuestionNumber(index);
                                                                    }}
                                                                >
                                                                    <div className={styles.questionStatusElementsNumber}>
                                                                        {index + 1}
                                                                    </div>

                                                                    <div className={styles.exitQuestionContainerTextSolved}>
                                                                        푼 문제
                                                                    </div>
                                                                </div>

                                                                :

                                                                <div
                                                                    className={styles.questionStatusElementsNotSolved}
                                                                    onClick={() => {
                                                                        setIsExitingTest(false);
                                                                        setQuestionNumber(index);
                                                                    }}
                                                                >
                                                                    <div className={styles.questionStatusElementsNumber}>
                                                                        {index + 1}
                                                                    </div>

                                                                    <div className={styles.exitQuestionContainerTextNotSolved}>
                                                                        풀지 않은 문제
                                                                    </div>
                                                                </div>
                                                        )
                                                ))
                                            }
                                        </div>

                                        {
                                            (checkedQuestions.length > 0 && width > 1200)

                                            &&

                                            <div>
                                                <div className={styles.exitContainerNoticeChecked}>
                                                    <img className={styles.exitContainerNoticeIcon} src={process.env.PUBLIC_URL + "/icons/flag.png"} style={{ padding: "0px" }} />

                                                    체크된 문제가 {checkedQuestions.length}개 있습니다.
                                                </div>

                                                <div className={styles.exitContainerCheckedQuestions}>
                                                    {checkedQuestions.map((current: any, index: number) => (
                                                        <div
                                                            className={styles.checkedQuestionElements}
                                                            onClick={() => {
                                                                setIsExitingTest(false);
                                                                setQuestionNumber(index);
                                                            }}
                                                        >
                                                            {current + 1}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        }

                                        <div className={styles.exitContainerBottom}>
                                            <div
                                                className={styles.exitContainerExitButton}
                                                onClick={() => {
                                                    submitAnswerSheet(event);
                                                    setIsApplyingTest(false);
                                                    setIsExitingTest(false);
                                                    setQuestionNumber(0);
                                                }}
                                            >
                                                시험 종료
                                            </div>

                                            <div
                                                className={styles.exitContainerCancelButton}
                                                onClick={() => {
                                                    setIsExitingTest(false);
                                                }}
                                            >
                                                취소
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </form>

                        :

                        <PreTestMode
                            testInfo={testInfo}
                            applicantName={applicantInfo.applicantName}
                            isTestTime={isTestTime}
                            setIsApplyingTest={setIsApplyingTest}
                            noOfQuestions={questionList?.length}
                            typeOfQuestions={questionList.map((row: any) => row.type)}
                            totalPoints={questionList ? (questionList.length > 0 && questionList.map((row: any) => row.points).reduce((sum: number, current: number) => { return sum + current; }, 0)) : 0}
                        />

                    :

                    <Error message="유효하지 않은 응시자 입니다." />
            }
        </div>
    )
}