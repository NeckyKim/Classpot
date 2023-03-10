import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { dbService } from "../../FirebaseModules";
import { doc, getDoc, updateDoc, collection, onSnapshot, query, orderBy } from "firebase/firestore";

import Error from "../../Error";
import GetTestInfo from "../hooks/GetTestInfo";
import GetApplicantInfo from "../hooks/GetApplicantInfo";
import GetQuestionList from "../hooks/GetQuestionList";
import GetApplicantList from "../hooks/GetApplicantList";
import GetNotificationList from "../hooks/GetNotificationList";
import TimeCalculator from "../hooks/TimeCalculator";
import PreTestMode from "./PreTestMode";

import SettingContainer from "./SettingContainer";
import ChattingContainer from "./ChattingContainer";
import NotificationContainer from "./NotificationContainer";
import ExitContainer from "./ExitContainer";

import { ToastContainer, cssTransition } from "react-toastify";
import { toast } from "react-toastify";
import { Editor } from "@tinymce/tinymce-react";
import { Splitter, SplitterPanel } from "primereact/splitter";

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
    const [isExiting, setIsExiting] = useState<boolean>(false);

    // 설정
    const [isSetting, setIsSetting] = useState<boolean>(false);

    // 채팅
    const [isChatting, setIsChatting] = useState<boolean>(false);

    // 다크 모드
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const darkBackgroundColor = "rgb(40, 50, 70)";
    const darkBackgroundColorDeep = "rgb(30, 40, 60)";
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
    const [solvedQuestions, setSolvedQuestions] = useState<number[]>([]);

    useEffect(() => {
        questionList.filter((elem: any, index: number) => {
            if (elem.type === "객관식") {
                if (answerSheet[index] !== null && answerSheet[index] !== undefined && Object.values(answerSheet[index]).filter((elem: any) => elem === true).length > 0) {
                    if (!solvedQuestions.includes(index)) {
                        var temp = [...solvedQuestions];
                        temp.push(index);
                        setSolvedQuestions(temp);
                    }
                }

                else {
                    if (solvedQuestions.includes(index)) {
                        setSolvedQuestions([...solvedQuestions].filter((elem: number) => elem !== index));
                    }
                }
            }

            else {
                if (answerSheet[index] !== "" && answerSheet[index] !== null && answerSheet[index] !== undefined) {
                    if (!solvedQuestions.includes(index)) {
                        var temp = [...solvedQuestions];
                        temp.push(index);
                        setSolvedQuestions(temp);
                    }
                }

                else {
                    if (solvedQuestions.includes(index)) {
                        setSolvedQuestions([...solvedQuestions].filter((elem: number) => elem !== index));
                    }
                }
            }
        })
    }, [answerSheet])



    // 공지사항
    const [isNotification, setIsNotification] = useState<boolean>(false);
    var notificationList: any = GetNotificationList(testCode);

    // 채팅 불러오기
    const [chattingList, setChattingList] = useState<any>([]);

    useEffect(() => {
        if (testCode && applicantCode) {
            onSnapshot(query(collection(dbService, "tests", testCode, "applicants", applicantCode, "chattings"), orderBy("createdTime")), (snapshot) => {
                setChattingList(snapshot.docs.map((current) => ({
                    ...current.data()
                })));
            });
        }
    }, [])



    // 시험 유형
    const typeDictionary: { [index: string]: string } = {
        "객관식": "multiple_choice",
        "주관식": "short_answer",
        "참/거짓": "true_false",
        "서술형": "essay"
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

                <div className={styles.sampleAlertBackground}>
                    <div className={styles.sampleAlertContainer}>
                        <div className={styles.sampleAlertContainerHeader}>
                            시험 환경 점검
                        </div>

                        <ul className={styles.sampleAlertGuide}>
                            <li>시험 환경 점검은 실제 시험 화면과 동일한 환경에서 진행됩니다.</li>
                            <li>모든 내용은 본 시험과 전혀 연관이 없습니다.</li>
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
                                            backgroundColor: darkBackgroundColorDeep,
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
                                            className={index === questionNumber ? styles.navigationSelected : styles.navigationNotSelected}
                                            onClick={() => {
                                                setQuestionNumber(index);
                                                submitAnswerSheet(event);
                                            }}
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
                                                    className={styles.navigationSolved}
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
                                                    className={styles.navigationSolved}
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
                                                    className={styles.navigationChecked}
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
                                        <img className={styles.questionTypeIcon} src={process.env.PUBLIC_URL + "/icons/" + typeDictionary[questionList[questionNumber].type] + ".png"} />

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
                                                            font-weight: 500;
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
                                                        font-weight: 500;
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
                                            backgroundColor: darkBackgroundColorDeep,
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
                                        ((notificationList?.length !== 0) && sessionStorage.getItem("notifications") !== String(notificationList[notificationList.length - 1]?.createdTime))

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
                                            isDarkMode || ((notificationList?.length !== 0) && sessionStorage.getItem("notifications") !== String(notificationList[notificationList.length - 1]?.createdTime))

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
                                        ((chattingList?.length === 0) || (sessionStorage.getItem("chattings") === String(chattingList[chattingList.length - 1]?.createdTime)))

                                            ?

                                            styles.notificationButtonNormal

                                            :

                                            styles.notificationButtonPulse
                                    }
                                    onClick={() => {
                                        setIsChatting(true);
                                        sessionStorage.setItem("chattings", chattingList[chattingList.length - 1]?.createdTime);
                                    }}
                                    style={
                                        ((chattingList?.length !== 0) && sessionStorage.getItem("chattings") !== String(chattingList[chattingList.length - 1]?.createdTime))

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
                                            isDarkMode || ((chattingList?.length !== 0) && sessionStorage.getItem("chattings") !== String(chattingList[chattingList.length - 1]?.createdTime))

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
                                        setIsExiting(true);
                                    }}
                                />
                            </div>


                            {
                                // 설정 창

                                isSetting

                                &&

                                <SettingContainer
                                    width={width}
                                    isDarkMode={isDarkMode}
                                    split={split}
                                    setIsDarkMode={setIsDarkMode}
                                    setSplit={setSplit}
                                    setIsNotification={setIsNotification}
                                    setIsSetting={setIsSetting}
                                />
                            }

                            {
                                // 공지사항 창

                                isNotification

                                &&

                                <NotificationContainer
                                    notificationList={notificationList}
                                    setIsNotification={setIsNotification}
                                />
                            }

                            {
                                // 채팅 창

                                isChatting

                                &&

                                <ChattingContainer
                                    testCode={testCode}
                                    applicantCode={applicantCode}
                                    applicantName={applicantInfo.applicantName}
                                    setIsChatting={setIsChatting}
                                />
                            }

                            {
                                isExiting

                                &&

                                <ExitContainer
                                    questionList={questionList}
                                    solvedQuestions={solvedQuestions}
                                    checkedQuestions={checkedQuestions}
                                    answerSheet={answerSheet}
                                    setQuestionNumber={setQuestionNumber}
                                    setIsExiting={setIsExiting}
                                    setIsApplyingTest={setIsApplyingTest}
                                    submitAnswerSheet={submitAnswerSheet}
                                />
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