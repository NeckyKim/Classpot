import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { dbService } from "../../FirebaseModules";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import Error from "../../Error";
import GetTestInfo from "../hooks/GetTestInfo";
import GetApplicantInfo from "../hooks/GetApplicantInfo";
import GetQuestionList from "../hooks/GetQuestionList";
import GetApplicantList from "../hooks/GetApplicantList";

import { toast } from "react-toastify";

import styles from "./ApplyMode.module.css";




export default function ApplyMode() {
    const { testCode } = useParams();
    const { applicantCode } = useParams();



    // 시험 정보
    const testInfo: any = GetTestInfo(testCode);

    // 응시자 정보
    const applicantInfo: any = GetApplicantInfo(testCode, applicantCode);

    // 질문 목록
    const questionList: any = GetQuestionList(testCode);



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



    // 응시자 목록
    const applicantList: any = GetApplicantList(testCode);



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



    // 답안 변경 여부
    const [modified, setModified] = useState<boolean>(false);



    // 답안지 제출하기
    async function submitAnswerSheet(event: any) {
        event.preventDefault();

        if (testCode && applicantCode && modified) {
            try {
                await updateDoc(doc(dbService, "tests", testCode, "applicants", applicantCode), {
                    answerSheet: answerSheet,
                    submittedTime: Date.now()
                })

                toast.success("답안지가 제출되었습니다.", {

                });

                setModified(false);
                setSubmittedTime(Date.now());
            }

            catch (error) {
                toast.error("답안지 제출에 실패했습니다.");
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

    // 시험 시작 전 남은 시간
    var daysBefore = Math.floor((startTime - currentTime) / 86400000)
    var hoursBefore = Math.floor(((startTime - currentTime) - daysBefore * 14400000) / 3600000);
    var minutesBefore = Math.floor(((startTime - currentTime) - hoursBefore * 3600000) / 60000);
    var secondsBefore = Math.floor(((startTime - currentTime) - hoursBefore * 3600000 - minutesBefore * 60000) / 1000);



    // 시험 응시 중 남은 시간
    var hoursCurrent = Math.floor((finishTime - currentTime) / 3600000);
    var minutesCurrent = Math.floor(((finishTime - currentTime) - hoursCurrent * 3600000) / 60000);
    var secondsCurrent = Math.floor(((finishTime - currentTime) - hoursCurrent * 3600000 - minutesCurrent * 60000) / 1000);



    // 시험 응시 화면
    const [isApplyingTest, setIsApplyingTest] = useState<boolean>(false);
    const [questionNumber, setQuestionNumber] = useState<number>(0);


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



    return (
        applicantList.map((row: any) => row.applicantCode).includes(applicantCode)

            ?


            isApplyingTest && isTestTime === "중"

                ?

                <form onSubmit={submitAnswerSheet} className={styles.applyModeContainer}>
                    <div className={styles.applyModeContainerTop}>
                        <div className={styles.testName}>
                            {testInfo.testName}
                        </div>

                        <div className={styles.applicantName}>
                            {applicantInfo.applicantName}
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



                    <div className={styles.applyModeContainerCenter}>
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

                                    <div>
                                        <input
                                            type="button"
                                            value="이전"
                                            className={questionNumber !== 0 ? styles.prevButtonAbled : styles.prevButtonDisabled}
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
                                            className={questionNumber !== questionList.length - 1 ? styles.nextButtonAbled : styles.nextButtonDisabled}
                                            onClick={() => {
                                                if (questionNumber !== questionList.length - 1) {
                                                    setQuestionNumber(questionNumber + 1);
                                                }

                                                submitAnswerSheet(event);
                                            }}
                                        />
                                    </div>
                                </div>
                            }



                            {
                                questionList.length > 0

                                &&

                                <div className={styles.questionAnswerContent}>
                                    <div className={styles.questionContent}>
                                        {questionList[questionNumber].question}

                                        <img
                                            src={questionList[questionNumber].imageFile}
                                            width={questionList[questionNumber].imageSize * 25 + "%"}
                                            className={styles.questionImage}
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



                    <div className={styles.applyModeContainerBottom}>
                        <div className={styles.fontSizeContainer}>
                            <div
                                className={styles.fontSizeSmall}
                                onClick={() => {
                                    if (fontSizeIndex !== 0) {
                                        setFontSizeIndex(fontSizeIndex - 1);
                                    }
                                }
                                }>
                                -
                            </div>

                            <div className={styles.fontSizeValue}>
                                {fontSizeValue[fontSizeIndex][0]}
                            </div>

                            <div
                                className={styles.fontSizeLarge}
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

                <div>
                    {
                        isTestTime === "전"

                        &&

                        <div className={styles.preModeContainer}>
                            <div className={styles.preModeTop}>
                                <div className={styles.preModeHeader}>
                                    시험 이름
                                </div>

                                <div className={styles.preModeTestName}>
                                    {testInfo.testName}
                                </div>

                                <div className={styles.preModeInfo}>
                                    <div className={styles.preModeInfoHeader}>
                                        출제자
                                    </div>

                                    <div className={styles.preModeInfoValue}>
                                        {testInfo.userName}
                                    </div>
                                </div>

                                <div className={styles.preModeInfo}>
                                    <div className={styles.preModeInfoHeader}>
                                        응시자
                                    </div>

                                    <div className={styles.preModeInfoValue}>
                                        {applicantInfo.applicantName}
                                    </div>
                                </div>

                                <div className={styles.preModeTimer}>
                                    {daysBefore !== 0 && <span>{daysBefore}일&nbsp;</span>}
                                    {hoursBefore !== 0 && <span>{hoursBefore}시간&nbsp;</span>}
                                    {minutesBefore !== 0 && <span>{minutesBefore}분&nbsp;</span>}
                                    {secondsBefore}초&nbsp;
                                    후 시작
                                </div>
                            </div>

                            <div className={styles.preModeBottom}>


                            </div>




                        </div>
                    }

                    {
                        isTestTime === "중"

                        &&

                        <div className={styles.noticeContainer}>
                            
                        </div>
                    }

                    {
                        isTestTime === "후"

                        &&

                        <div className={styles.noticeContainer}>
                            <div />

                            <div className={styles.noticeContainerTop}>
                                시험이 종료되었습니다.
                            </div>
                        </div>
                    }
                </div>

            :

            <Error message="유효하지 않은 응시자 입니다." />
    )
}