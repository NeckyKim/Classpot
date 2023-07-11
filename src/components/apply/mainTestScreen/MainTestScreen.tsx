import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"

import { dbService } from "../../../FirebaseModules";
import { doc, updateDoc } from "firebase/firestore";

import Timer from "./Timer";
import SettingContainer from "./SettingContainer";
import ChattingContainer from "./ChattingContainer";
import ExitContainer from "./ExitContainer";

import Buttons from "../../../theme/Buttons";
import SubmitButton from "../../../theme/SubmitButton";

import { Editor } from "@tinymce/tinymce-react";
import { toast } from "react-toastify";

import styles from "./MainTestScreen.module.css";
import * as S from "./MainTestScreenStyles";



export default function MainTestScreen({ testInfo, applicantInfo, questionList, isTestTime, setIsApplyingTest }: { testInfo: any, applicantInfo: any, questionList: any, isTestTime: any, setIsApplyingTest: any }) {
    const { userCode, testCode, applicantCode } = useParams();

    const [questionIndex, setQuestionIndex] = useState<number>(0);
    const [answerSheet, setAnswerSheet] = useState<any[]>(applicantInfo.answerSheet);

    const [finished, setFinished] = useState<boolean>(false);
    const [log, setLog] = useState<any[]>(applicantInfo.log);

    const [chattingText, setChattingText] = useState<string>("");

    const [showSetting, setShowSetting] = useState<boolean>(false);
    const [showChatting, setShowChatting] = useState<boolean>(false);
    const [showExit, setShowExit] = useState<boolean>(false);

    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>("");

    const [screenMode, setScreenMode] = useState<boolean>(true);
    const [lightMode, setLightMode] = useState<boolean>(true);

    const [unsolvedList, setUnsolvedList] = useState<number[]>([]);
    const [flaggedList, setFlaggedList] = useState<number[]>([]);



    function toastAction(message: string) {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    }



    function logSetter(message: string) {
        let copy = JSON.parse(JSON.stringify(log));
        copy.push({ time: Date.now(), action: message });

        setLog(copy);
    }



    async function sendChatting() {
        if (userCode && testCode && applicantCode) {
            try {
                logSetter("채팅 전송");
                setChattingText("");

                await updateDoc(doc(dbService, "users", userCode, "tests", testCode, "applicants", applicantCode), {
                    chatting: [...applicantInfo.chatting, {
                        sender: "applicant",
                        time: Date.now(),
                        text: chattingText,
                    }],
                    log: log
                })
            }

            catch (error) {
                console.log(error);
            }
        }
    }



    async function submitAnswerSheet() {
        if (userCode && testCode && applicantCode && (JSON.stringify([...answerSheet]) !== JSON.stringify(applicantInfo.answerSheet))) {
            try {
                logSetter("답안지 제출");

                await updateDoc(doc(dbService, "users", userCode, "tests", testCode, "applicants", applicantCode), {
                    answerSheet: answerSheet,
                    submitted: Date.now(),
                    log: log
                })

                toastAction("답안지가 제출되었습니다.");
            }

            catch (error) {
                console.log(error);
            }
        }
    }



    async function exitTest() {
        if (userCode && testCode && applicantCode) {
            try {
                await updateDoc(doc(dbService, "users", userCode, "tests", testCode, "applicants", applicantCode), {
                    finished: finished,
                    log: [...log, { time: Date.now(), action: "시험 종료" }]
                })

                toastAction("답안지가 제출되었습니다.");
            }

            catch (error) {
                console.log(error);
            }
        }
    }


    if (isTestTime.remainingTime.hours === 0 && isTestTime.remainingTime.minutes === 0 && isTestTime.remainingTime.seconds === 0 && !applicantInfo.finished) {
        submitAnswerSheet();
        exitTest();

        toast.success("답안지가 제출되었습니다.", { toastId: "" });
    }



    useEffect(() => {
        let copy = JSON.parse(JSON.stringify(log));
        copy.push({ time: Date.now(), action: "시험 시작" });
        copy.push({ time: Date.now(), action: "1번 문제 진입" });

        setLog(copy);
    }, [])



    useEffect(() => {
        setUnsolvedList([]);

        let temp = [];

        for (let i = 0; i < questionList?.length; i++) {
            if (answerSheet[i] === null || answerSheet[i] === "") {
                temp.push(i);
            }

            else if (questionList[i]?.type === "mc") {
                if (Object.values(answerSheet[i]).filter(x => x === false)?.length === questionList[i]?.choices?.length) {
                    temp.push(i);
                }
            }
        }

        setUnsolvedList(temp);
    }, [questionList, answerSheet])



    return (
        <div className={styles.container}>
            <div className={showToast ? styles.toastContainerShow : styles.toastContainerHide}>
                {toastMessage}
            </div>



            <div className={styles.containerTop}>
                <div className={styles.info}>
                    <div className={styles.infoTestName}>{testInfo.testName}</div>
                    <div className={styles.infoApplicantName}>{applicantInfo.applicantName}</div>
                </div>

                <Timer isTestTime={isTestTime} />
            </div>



            <div className={styles.containerCenter}>
                <S.Navigator className={lightMode ? "light" : "dark"}>
                    {questionList.map((elem: any, index: number) => (
                        <S.NavigatorElements
                            className={(questionIndex === index ? "selected" : "notselected") + (lightMode ? "light" : "dark")}
                            onClick={() => {
                                if (questionIndex !== index) {
                                    logSetter(`${index + 1}번 문제 진입`);
                                }

                                submitAnswerSheet();
                                setQuestionIndex(index);
                            }}
                        >
                            {index + 1}

                            <div className={styles.mark}>
                                {!unsolvedList.includes(index) && <S.solvedMark className={lightMode ? "light" : "dark"} />}
                                {flaggedList.includes(index) && <S.flaggedMark className={lightMode ? "light" : "dark"} />}
                            </div>
                        </S.NavigatorElements>
                    ))}
                </S.Navigator>



                <S.QuestionAnswerContainer className={(screenMode ? "rl" : "ud") + (lightMode ? "light" : "dark")}>
                    <S.QuestionContainer className={(screenMode ? "rl" : "ud") + (lightMode ? "light" : "dark")}>
                        <S.QuestionHeader className={lightMode ? "light" : "dark"}>
                            <div className={styles.questionNumber}>
                                <S.QuestionNumberLabel className={lightMode ? "light" : "dark"}>
                                    문제
                                </S.QuestionNumberLabel>

                                <S.QuestionNumberValue className={lightMode ? "light" : "dark"}>
                                    {String(questionIndex + 1)}
                                </S.QuestionNumberValue>

                                <S.QuestionNumberTotal className={lightMode ? "light" : "dark"}>
                                    / {questionList.length}
                                </S.QuestionNumberTotal>

                                <div
                                    className={flaggedList.includes(questionIndex) ? styles.questionFlagged : styles.questionNotFlagged}
                                    onClick={() => {
                                        let copy = [...flaggedList];

                                        if (copy.includes(questionIndex)) {
                                            logSetter(`${questionIndex + 1}번 문제 체크 해제`);
                                            copy = copy.filter(x => x !== questionIndex)
                                        }

                                        else {
                                            logSetter(`${questionIndex + 1}번 문제 체크`);
                                            copy.push(questionIndex);
                                            copy.sort();
                                        }

                                        setFlaggedList(copy);
                                    }}
                                >
                                    <img
                                        className={flaggedList.includes(questionIndex) ? styles.questionFlaggedIcon : styles.questionNotFlaggedIcon}
                                        src={process.env.PUBLIC_URL + (flaggedList.includes(questionIndex) ? "/icons/apply/flag_filled.svg" : "/icons/apply/flag_empty.svg")}
                                    />

                                    {flaggedList.includes(questionIndex) ? "문제 체크 취소" : "문제 체크"}
                                </div>
                            </div>

                            <S.QuestionInfo className={lightMode ? "light" : "dark"}>
                                {(() => {
                                    switch (questionList[questionIndex]?.type) {
                                        case "mc": return "객관식"
                                        case "sa": return "주관식"
                                        case "tf": return "참/거짓"
                                        case "essay": return "서술형"
                                    }
                                })()}
                                &nbsp;
                                {questionList[questionIndex]?.points}점
                            </S.QuestionInfo>
                        </S.QuestionHeader>

                        <Editor
                            apiKey={process.env.REACT_APP_TINYMCE_EDITOR_ID}
                            disabled={true}
                            value={questionList[questionIndex]?.question}
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
                    </S.QuestionContainer>



                    <S.AnswerContainer className={screenMode ? "rl" : "ud"}>
                        {(() => {
                            switch (questionList[questionIndex]?.type) {
                                case "mc":
                                    return <div className={styles.choiceContainer}>
                                        {
                                            questionList[questionIndex].choices.map((elem: string, index: number) => (
                                                <S.ChoiceElements
                                                    className={lightMode ? "light" : "dark"}
                                                    onClick={() => {
                                                        let copy = JSON.parse(JSON.stringify(answerSheet));

                                                        if (answerSheet[questionIndex] === null) {
                                                            copy[questionIndex] = Object.assign({}, new Array(questionList[questionIndex].choices.length).fill(false));
                                                        }

                                                        copy[questionIndex][index] = !copy[questionIndex][index];

                                                        setAnswerSheet(copy);
                                                    }}
                                                >
                                                    <div className={(answerSheet[questionIndex] !== null && answerSheet[questionIndex][index]) ? styles.choiceNumberSelected : styles.choiceNumberNotSelected}>
                                                        {index + 1}
                                                    </div>

                                                    <div className={(answerSheet[questionIndex] !== null && answerSheet[questionIndex][index]) ? styles.choiceValueSelected : styles.choiceValueNotSelected}>
                                                        {elem}
                                                    </div>
                                                </S.ChoiceElements>
                                            ))
                                        }
                                    </div>

                                case "sa":
                                    return <>
                                        <S.AnswerInputBox
                                            value={answerSheet[questionIndex]}
                                            className={(questionList[questionIndex]?.type ? "sa" : "essay") + (lightMode ? "light" : "dark")}
                                            spellCheck={false}
                                            onChange={(event) => {
                                                let copy = JSON.parse(JSON.stringify(answerSheet));
                                                copy[questionIndex] = event.target.value;
                                                setAnswerSheet(copy);
                                            }}
                                            placeholder="이곳에 정답을 입력하세요."
                                        />

                                        <div className={styles.answerInputBoxInfo}>
                                            <div
                                                className={styles.answerInputBoxInfoButton}
                                                onClick={() => {
                                                    if (confirm("답안을 전부 삭제하시겠습니까? 삭제된 답안은 되돌릴 수 없습니다.")) {
                                                        let copy = JSON.parse(JSON.stringify(answerSheet));
                                                        copy[questionIndex] = "";
                                                        setAnswerSheet(copy);
                                                    }
                                                }}
                                            >
                                                <img src={process.env.PUBLIC_URL + "/icons/apply/refresh.svg"} />

                                                답안 전체 삭제
                                            </div>

                                            {answerSheet[questionIndex] ? answerSheet[questionIndex]?.length : 0}자 (공백 포함)
                                        </div>
                                    </>

                                case "tf":
                                    return <div className={styles.choiceContainer}>
                                        <div
                                            className={styles.choiceElements}
                                            onClick={() => {
                                                let copy = JSON.parse(JSON.stringify(answerSheet));

                                                if (copy[questionIndex] === true) {
                                                    copy[questionIndex] = null;
                                                }

                                                else {
                                                    copy[questionIndex] = true;
                                                }

                                                setAnswerSheet(copy);
                                            }}
                                        >
                                            <div className={(answerSheet[questionIndex] !== null && answerSheet[questionIndex]) ? styles.choiceNumberSelected : styles.choiceNumberNotSelected}>
                                                O
                                            </div>

                                            <div className={(answerSheet[questionIndex] !== null && answerSheet[questionIndex]) ? styles.choiceValueSelected : styles.choiceValueNotSelected}>
                                                참
                                            </div>
                                        </div>

                                        <div
                                            className={styles.choiceElements}
                                            onClick={() => {
                                                let copy = JSON.parse(JSON.stringify(answerSheet));

                                                if (copy[questionIndex] === false) {
                                                    copy[questionIndex] = null;
                                                }

                                                else {
                                                    copy[questionIndex] = false;
                                                }

                                                setAnswerSheet(copy);
                                            }}
                                        >
                                            <div className={(answerSheet[questionIndex] !== null && !answerSheet[questionIndex]) ? styles.choiceNumberSelected : styles.choiceNumberNotSelected}>
                                                X
                                            </div>

                                            <div className={(answerSheet[questionIndex] !== null && !answerSheet[questionIndex]) ? styles.choiceValueSelected : styles.choiceValueNotSelected}>
                                                거짓
                                            </div>
                                        </div>
                                    </div>

                                case "essay":
                                    return <>
                                        <S.AnswerInputBox
                                            value={answerSheet[questionIndex]}
                                            className={(questionList[questionIndex]?.type ? "sa" : "essay") + (lightMode ? "light" : "dark")}
                                            spellCheck={false}
                                            onChange={(event) => {
                                                let copy = JSON.parse(JSON.stringify(answerSheet));
                                                copy[questionIndex] = event.target.value;
                                                setAnswerSheet(copy);
                                            }}
                                            placeholder="이곳에 정답을 입력하세요."
                                        />

                                        <div className={styles.answerInputBoxInfo}>
                                            <div
                                                className={styles.answerInputBoxInfoButton}
                                                onClick={() => {
                                                    if (confirm("답안을 전부 삭제하시겠습니까? 삭제된 답안은 되돌릴 수 없습니다.")) {
                                                        let copy = JSON.parse(JSON.stringify(answerSheet));
                                                        copy[questionIndex] = "";
                                                        setAnswerSheet(copy);
                                                    }
                                                }}
                                            >
                                                <img src={process.env.PUBLIC_URL + "/icons/apply/refresh.svg"} />

                                                답안 전체 삭제
                                            </div>

                                            {answerSheet[questionIndex] ? answerSheet[questionIndex]?.length : 0}자 (공백 포함)
                                        </div>
                                    </>
                            }
                        })()}
                    </S.AnswerContainer>
                </S.QuestionAnswerContainer>
            </div>



            <S.ContainerBottom className={lightMode ? "light" : "dark"}>
                <div className={styles.containerBottomButtonWrapper}>
                    <img
                        src={process.env.PUBLIC_URL + "/icons/apply/setting.svg"}
                        className={styles.containerBottomButton}
                        onClick={() => {
                            setShowSetting(true);
                            logSetter("설정창 열기");
                        }}
                    />

                    <img
                        src={process.env.PUBLIC_URL + "/icons/apply/chatting.svg"}
                        className={styles.containerBottomButton}
                        onClick={() => {
                            setShowChatting(true);
                            setChattingText("");
                            logSetter("채팅창 열기");
                        }}
                    />
                </div>

                <Buttons>
                    <SubmitButton
                        text="제출하기"
                        onClick={submitAnswerSheet}
                    />

                    <SubmitButton
                        text="종료하기"
                        onClick={() => setShowExit(true)}
                    />
                </Buttons>
            </S.ContainerBottom>



            {
                showSetting

                &&

                <SettingContainer
                    setShowSetting={setShowSetting}
                    screenMode={screenMode}
                    setScreenMode={setScreenMode}
                    lightMode={lightMode}
                    setLightMode={setLightMode}
                />
            }

            {
                showChatting

                &&

                <ChattingContainer
                    applicantName={applicantInfo.applicantName}
                    chatting={applicantInfo.chatting}
                    setShowChatting={setShowChatting}
                    chattingText={chattingText}
                    setChattingText={setChattingText}
                    sendChatting={sendChatting}
                />
            }

            {
                showExit

                &&

                <ExitContainer
                    unsolvedList={unsolvedList}
                    flaggedList={flaggedList}
                    reEntry={testInfo.reEntry}
                    setQuestionIndex={setQuestionIndex}
                    finished={finished}
                    setFinished={setFinished}
                    setShowExit={setShowExit}
                    submitAnswerSheet={submitAnswerSheet}
                    exitTest={exitTest}
                    setIsApplyingTest={setIsApplyingTest}
                />
            }

            {
                applicantInfo.pause

                &&

                <div className={styles.pauseScreen}>
                    관리자가 시험을 일시 정지 했습니다.
                </div>
            }
        </div >
    )
}