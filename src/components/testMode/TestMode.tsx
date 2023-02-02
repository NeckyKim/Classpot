import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { dbService } from "../../FirebaseModules";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import Error from "../../Error";
import GetTestInfo from "../hooks/GetTestInfo";
import GetApplicantInfo from "../hooks/GetApplicantInfo";
import GetQuestionList from "../hooks/GetQuestionList";
import GetApplicantList from "../hooks/GetApplicantList";
import TimeCalculator from "../hooks/TimeCalculator";
import PreTestMode from "./PreTestMode";
import SampleQuestions from "./SampleQuestions";

import ReactQuill from "react-quill";

import { ToastContainer, cssTransition } from "react-toastify";
import { toast } from "react-toastify";

import styles from "./TestMode.module.css";
import "react-quill/dist/quill.snow.css";



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



    const [tempDate, setTempDate] = useState<number>(Date.now() + 15000);
    
    if (testCode === "sample") {
        testInfo = {
            applyCode: "SAMPL",
            createdTime: 1000000000,
            duration: "200",
            feedback: true,
            startDate: tempDate,
            testName: "시험 환경 체험 문제",
            userCode: "AGrRbUSDWXW1HEVRLgM5M1LDLB42",
            userName: "테스트콘"
        }

        applicantList = [
            {
                applicantCode: "sample",
                answerSheet: new Array(100).fill(null),
                applicantName: "체험 응시자",
                autoGrading: true,
                createdTime: Date.now(),
                magicCode: "SAMPL",
                reportCard: new Array(100).fill(null),
                submittedTime: Date.now()
            }
        ]

        questionList = SampleQuestions;
    }

    if (applicantCode === "sample") {
        applicantInfo = {
            answerSheet: new Array(100).fill(null),
            applicantName: "체험 응시자",
            autoGrading: true,
            createdTime: Date.now(),
            magicCode: "SAMPL",
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



    // 글자 크기 설정
    const [fontSizeIndex, setFontSizeIndex] = useState<number>(3);
    const fontSizeValue: [string, string][] = [
        ["아주 작게", "0.75rem"],
        ["작게", "0.9rem"],
        ["조금 작게", "1.05rem"],
        ["보통", "1.2rem"],
        ["조금 크게", "1.5rem"],
        ["크게", "2.0rem"],
        ["아주 크게", "2.5rem"],
    ]



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
                localStorage.setItem("sampleTestAnswerSheet", JSON.stringify(answerSheet));

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
                className={(answerSheet[questionNumber] || {})[choicesNumber] ? styles.choiceSelected : styles.choiceNotSelected}

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
                {questionList[questionNumber].choices[choicesNumber]}
            </div>
        )
    }



    // 체크 표시한 문제
    const [checkedQuestions, setCheckedQuestions] = useState<number[]>([]);



    // 종료하기
    const [isExitingTest, setIsExitingTest] = useState<boolean>(false);



    const Fade = cssTransition({
        enter: "fadeIn",
        exit: "fadeOut"
    });



    return (
        <div>
            <ToastContainer
                transition={ Fade }
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
                applicantList.map((row: any) => row.applicantCode).includes(applicantCode)

                    ?


                    isApplyingTest && isTestTime[0] === "중"

                        ?

                        <form onSubmit={submitAnswerSheet} className={styles.testModeContainer}>
                            <div className={styles.testModeContainerTop}>
                                <img className={styles.testconLogo} src={process.env.PUBLIC_URL + "/logos/icon_gray.png"} />

                                <div className={styles.testModeCotainerTopInfo}>
                                    <div className={styles.testName}>
                                        {testInfo.testName}
                                    </div>

                                    <div className={styles.applicantName}>
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



                            <div className={styles.testModeContainerCenter}>
                                <div className={styles.navigation}>
                                    {
                                        questionList.length > 0

                                        &&

                                        questionList.map((current: any, index: number) => (
                                            <div
                                                className={index === questionNumber ? styles.navigationNumberSelected : styles.navigationNumberNotSelected}

                                                onClick={() => {
                                                    setQuestionNumber(index);
                                                    submitAnswerSheet(event);
                                                }}
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

                                                    <img className={styles.navigationNumberSolved} src={process.env.PUBLIC_URL + "/icons/check.png"} />
                                                }

                                                {
                                                    (
                                                        (current.type === "참/거짓" || current.type === "주관식" || current.type === "서술형")

                                                        && answerSheet[index] !== null

                                                        && answerSheet[index] !== undefined

                                                        && answerSheet[index] !== ""
                                                    )

                                                    &&

                                                    <img className={styles.navigationNumberSolved} src={process.env.PUBLIC_URL + "/icons/check.png"} />
                                                }

                                                {
                                                    checkedQuestions.includes(index)

                                                    &&

                                                    <img className={styles.navigationNumberChecked} src={process.env.PUBLIC_URL + "/icons/flag.png"} />
                                                }
                                            </div>
                                        ))
                                    }
                                </div>



                                <div className={styles.questionAnswer}>
                                    {
                                        questionList.length > 0

                                        &&

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

                                            <div
                                                className={questionNumber !== 0 ? styles.prevNextButtonOn : styles.prevNextButtonOff}
                                                style={{ borderRadius: "5px 0px 0px 5px" }}
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
                                                style={{ borderRadius: "0px 5px 5px 0px", marginLeft: "1px" }}
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

                                        <div className={styles.questionAnswerContent}>
                                            <div className={styles.questionContent}>
                                                <ReactQuill
                                                    value={questionList[questionNumber].question}
                                                    readOnly={true}
                                                    modules={{ toolbar: false }}
                                                    theme="snow"
                                                    style={{ padding: "0px 30px 30px 30px" }}
                                                />
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
                                                            onClick={() => {
                                                                let temp = [...answerSheet];
                                                                temp[questionNumber] = true;
                                                                setModified(true);
                                                                setAnswerSheet(temp);
                                                            }}
                                                        >
                                                            참
                                                        </div>

                                                        <div
                                                            className={answerSheet[questionNumber] === false ? styles.choiceSelected : styles.choiceNotSelected}
                                                            onClick={() => {
                                                                let temp = [...answerSheet];
                                                                temp[questionNumber] = false;
                                                                setModified(true);
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
                                                        value={answerSheet[questionNumber]}
                                                        spellCheck={false}
                                                        onChange={(event: any) => {
                                                            let temp = [...answerSheet];
                                                            temp[questionNumber] = String(event.target.value);
                                                            setModified(true);
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
                                                            value={answerSheet[questionNumber]}
                                                            spellCheck={false}
                                                            onChange={(event: any) => {
                                                                let temp = [...answerSheet];
                                                                temp[questionNumber] = String(event.target.value);
                                                                setModified(true);
                                                                setAnswerSheet(temp);
                                                            }}
                                                        />

                                                        <div className={styles.answerTextLength}>
                                                            총 {answerSheet[questionNumber] ? answerSheet[questionNumber].length : 0}자
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>



                            <div className={styles.testModeContainerBottom}>
                                <div className={styles.submittedTime}>
                                    최종 제출 시간
                                    {width < 600 ? <br /> : " "}
                                    {submittedTime && new Date(submittedTime).toLocaleString("ko-KR")}
                                </div>
                                <input type="submit" className={styles.submitButton} value="제출하기" />

                                <input
                                    type="button"
                                    className={styles.exitButton}
                                    value="종료하기"
                                    onClick={() => {
                                        setIsExitingTest(true);
                                    }}
                                />
                            </div>

                            {
                                isExitingTest

                                &&

                                <div className={styles.exitBackground}>
                                    <div className={styles.exitContainer}>
                                        <div className={styles.exitContainerTop}>
                                            답안지를 제출하고 시험을 종료하시겠습니까?<br />
                                            시험 시간이 종료될 때 까지, 다시 접속하여 시험에 응시할 수 있습니다.
                                        </div>

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
                                                종료하기
                                            </div>

                                            <div
                                                className={styles.exitContainerCancelButton}
                                                onClick={() => {
                                                    setIsExitingTest(false);
                                                }}
                                            >
                                                계속 문제풀기
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </form>

                        :

                        <PreTestMode testInfo={testInfo} testCode={testCode} applicantName={applicantInfo.applicantName} applicantCode={applicantCode} isTestTime={isTestTime} setIsApplyingTest={setIsApplyingTest} />

                    :

                    <Error message="유효하지 않은 응시자 입니다." />
            }
        </div>
    )
}