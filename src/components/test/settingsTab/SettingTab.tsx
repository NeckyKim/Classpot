import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";

import { dbService } from "../../../FirebaseModules";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

import Modal from "../../../theme/Modal";
import Title from "../../../theme/Title";
import Buttons from "../../../theme/Buttons";
import SubmitButton from "../../../theme/SubmitButton";
import DeleteButton from "../../../theme/DeleteButton";
import InputBox from "../../../theme/InputBox";
import Toggle from "../../../theme/Toggle";
import CheckBox from "../../../theme/CheckBox";
import colorPalette from "../../../theme/ColorPalette";

import { toast } from "react-toastify";

import styles from "./SettingTab.module.css";




export default function SettingsTab({ userInfo, testInfo }: { userInfo: any, testInfo: any }) {
    const navigate = useNavigate();

    const [testName, setTestName] = useState<string>(testInfo.testName);
    const [startDate, setStartDate] = useState<string>(new Date(testInfo.startDate).toLocaleDateString("sv-SE") + "T" + new Date(testInfo.startDate).toLocaleTimeString("en-US", { hour12: false }));
    const [duration, setDuration] = useState<number>(testInfo.duration);

    const [webCam, setWebCam] = useState<boolean>(testInfo.webCam);
    const [idCard, setIdCard] = useState<boolean>(testInfo.idCard);

    const [preview, setPreview] = useState<boolean>(testInfo.preview);
    const [noticeChatting, setNoticeChatting] = useState<boolean>(testInfo.noticeChatting);
    const [reEntry, setReEntry] = useState<boolean>(testInfo.reEntry);

    const [feedback, setFeedback] = useState<boolean>(testInfo.feedback);
    const [feedbackStart, setFeedbackStart] = useState<string>(new Date(testInfo.feedbackTime?.start).toLocaleDateString("sv-SE") + "T" + new Date(testInfo.feedbackTime?.start).toLocaleTimeString("en-US", { hour12: false }));
    const [feedbackFinish, setFeedbackFinish] = useState<string>(new Date(testInfo.feedbackTime?.finish).toLocaleDateString("sv-SE") + "T" + new Date(testInfo.feedbackTime?.finish).toLocaleTimeString("en-US", { hour12: false }));

    const [feedbackQuestion, setFeedbackQuestion] = useState<boolean>(testInfo.feedbackQnA?.question);
    const [feedbackAnswer, setFeedbackAnswer] = useState<boolean>(testInfo.feedbackQnA?.answer);

    const [feedbackScore, setFeedbackScore] = useState<boolean>(testInfo.feedbackScore?.score);
    const [feedbackAverage, setFeedbackAverage] = useState<boolean>(testInfo.feedbackScore?.average);
    const [feedbackRank, setFeedbackRank] = useState<boolean>(testInfo.feedbackScore?.rank);



    const [isDeletingTest, setIsDeletingTest] = useState<boolean>(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState<string>("");



    async function editTestInfo(event: any) {
        event.preventDefault();

        if (testName.replace(/(\s*)/g, "") === "") {
            toast.error("시험 이름을 입력해 주세요.", { toastId: "" });
        }

        else if (startDate === "") {
            toast.error("시작 일시를 올바르게 입력해 주세요.", { toastId: "" });
        }

        else if (duration === 0) {
            toast.error("진행 시간은 1분 이상이어야 합니다.", { toastId: "" });
        }

        else if (feedback && feedbackStart === "") {
            toast.error("성적 공개 시작 일시를 올바르게 입력해 주세요.", { toastId: "" });
        }

        else if (feedback && ((Date.parse(startDate) + duration * 60000) > Date.parse(feedbackStart))) {
            toast.error("시험 종료 일시 이후로 성적 공개 시작 일시를 설정해 주세요.", { toastId: "" });
        }

        else if (feedback && ((Date.parse(feedbackStart) >= Date.parse(feedbackFinish)))) {
            toast.error("성적 공개 시작 일시 이후로 성적 공개 종료 일시를 설정해 주세요.", { toastId: "" });
        }

        else {
            try {
                await updateDoc(doc(dbService, "users", testInfo.managerCode, "tests", testInfo.testCode), {
                    testName: testName,
                    startDate: Date.parse(startDate),
                    duration: duration,
                    webCam: webCam,
                    idCard: idCard,
                    feedback: feedback,
                    feedbackTime: {
                        start: Date.parse(feedbackStart),
                        finish: Date.parse(feedbackFinish)
                    },
                    feedbackScore: {
                        score: feedbackScore,
                        rank: feedbackRank,
                        average: feedbackAverage,
                    },
                    feedbackQnA: {
                        question: feedbackQuestion,
                        answer: feedbackAnswer
                    },
                    noticeChatting: noticeChatting,
                    reEntry: reEntry,
                    preview: preview
                })

                toast.success("시험 설정을 수정했습니다.", { toastId: "" });
            }

            catch (error) {
                console.log(error);
                toast.error("시험 설정을 수정하지 못했습니다.", { toastId: "" });
            }
        }
    }



    async function deleteTest() {
        try {
            await deleteDoc(doc(dbService, "users", testInfo.managerCode, "tests", testInfo.testCode));

            toast.success("시험을 삭제했습니다.", { toastId: "" });
            navigate("/");
        }

        catch (error) {
            console.log(error);
            toast.error("시험을 삭제하지 못했습니다.", { toastId: "" });
        }
    }



    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.subContainer}>
                    <Title>
                        기본 정보
                    </Title>

                    <div>
                        <div className={styles.subHeader}>
                            시험 이름
                        </div>

                        <input
                            type="textbox"
                            value={testName}
                            className={styles.inputBox}
                            onChange={(event) => setTestName(event.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <div className={styles.subHeader}>
                            시험 코드
                        </div>

                        <div className={styles.codeBox}>
                            <div className={styles.codeBoxValue}>
                                {userInfo.shortUserCode + testInfo.shortTestCode}
                            </div>

                            <div
                                className={styles.codeBoxButton} onClick={() => {
                                    navigator.clipboard.writeText(userInfo.shortUserCode + testInfo.shortTestCode);
                                    toast.success("시험 코드를 복사했습니다.", { toastId: "" });
                                }}
                            >
                                <img className={styles.codeBoxButtonIcon} src={process.env.PUBLIC_URL + "/icons/dashboard/copy.svg"} />
                                복사
                            </div>
                        </div>
                    </div>

                    <div className={styles.flexBox}>
                        <div style={{ width: "80%" }}>
                            <div className={styles.subHeader}>
                                시작 일시
                            </div>

                            <input
                                type="datetime-local"
                                value={startDate}
                                className={styles.inputBox}
                                onChange={(event) => setStartDate(event.target.value)}
                                required
                            />
                        </div>

                        <div style={{ width: "20%" }}>
                            <div className={styles.subHeader}>
                                진행 시간
                            </div>

                            <input
                                type="number"
                                value={duration}
                                className={styles.inputBox}
                                onChange={(event) => setDuration(Number(event.target.value))}
                                required
                            />
                        </div>

                    </div>
                </div>



                <div className={styles.subContainer}>
                    <Title>
                        시험 진행
                    </Title>

                    <div className={styles.toggle}>
                        <Toggle value={preview} onClick={() => setPreview((prev) => !prev)} />

                        <div className={styles.toggleHeader}>
                            문제 정보 사전 공개(문항 수, 총점, 문제 유형)
                        </div>
                    </div>

                    <div className={styles.toggle}>
                        <Toggle value={noticeChatting} onClick={() => setNoticeChatting((prev) => !prev)} />

                        <div className={styles.toggleHeader}>
                            공지사항 및 채팅 기능 허용
                        </div>
                    </div>

                    <div className={styles.toggle}>
                        <Toggle value={reEntry} onClick={() => setReEntry((prev) => !prev)} />

                        <div className={styles.toggleHeader}>
                            재입장 응시 허용
                        </div>
                    </div>
                </div>



                {/* <div className={styles.subContainer}>
                <Title text="시험 감독 기능" />

                <div className={styles.toggle}>
                    <Toggle value={webCam} onClick={() => setWebCam((prev) => !prev)} />

                    <div className={styles.toggleHeader}>
                        화면 공유
                    </div>
                </div>

                <div className={styles.toggle}>
                    <Toggle value={idCard} onClick={() => setIdCard((prev) => !prev)} />

                    <div className={styles.toggleHeader}>
                        신분증 촬영
                    </div>
                </div>
            </div> */}



                <div className={styles.subContainer}>
                    <Title>
                        성적 공개
                    </Title>

                    <div className={styles.toggle}>
                        <Toggle value={feedback} onClick={() => setFeedback((prev) => !prev)} />

                        <div className={styles.toggleHeader}>
                            성적 공개
                        </div>
                    </div>

                    {
                        feedback

                        &&

                        <>
                            <div className={styles.flexBox}>
                                <div style={{ width: "50%" }}>
                                    <div className={styles.subHeader}>
                                        공개 시작 일시
                                    </div>

                                    <input
                                        type="datetime-local"
                                        value={feedbackStart}
                                        className={styles.inputBox}
                                        onChange={(event) => setFeedbackStart(event.target.value)}
                                        required
                                    />
                                </div>

                                <div style={{ width: "50%" }}>
                                    <div className={styles.subHeader}>
                                        공개 종료 일시
                                    </div>

                                    <input
                                        type="datetime-local"
                                        value={feedbackFinish}
                                        className={styles.inputBox}
                                        onChange={(event) => setFeedbackFinish(event.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <div className={styles.subHeader}>
                                    점수 공개
                                </div>

                                <div className={styles.checkBoxContainer}>
                                    <div className={styles.checkBox}>
                                        <CheckBox
                                            value={feedbackScore}
                                            onClick={() => {
                                                if (feedbackScore) {
                                                    setFeedbackScore(false);
                                                    setFeedbackAverage(false);
                                                }

                                                else {
                                                    setFeedbackScore(true);
                                                }
                                            }}
                                        />
                                        본인 점수
                                    </div>

                                    <div className={styles.checkBox}>
                                        <CheckBox
                                            value={feedbackAverage}
                                            onClick={() => {
                                                if (feedbackAverage) {
                                                    setFeedbackAverage(false);
                                                }

                                                else {
                                                    setFeedbackScore(true);
                                                    setFeedbackAverage(true);
                                                }
                                            }}
                                        />
                                        전체 평균 점수
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className={styles.subHeader}>
                                    등수 공개
                                </div>

                                <div className={styles.checkBoxContainer}>
                                    <div className={styles.checkBox}>
                                        <CheckBox
                                            value={feedbackRank}
                                            onClick={() => {
                                                setFeedbackRank((prev) => !prev);
                                            }}
                                        />
                                        등수
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className={styles.subHeader}>
                                    문제와 정답
                                </div>

                                <div className={styles.checkBoxContainer}>
                                    <div className={styles.checkBox}>
                                        <CheckBox
                                            value={feedbackQuestion}
                                            onClick={() => {
                                                if (feedbackQuestion) {
                                                    setFeedbackQuestion(false);
                                                    setFeedbackAnswer(false);
                                                }

                                                else {
                                                    setFeedbackQuestion(true);
                                                }
                                            }}
                                        />
                                        문제
                                    </div>

                                    <div className={styles.checkBox}>
                                        <CheckBox
                                            value={feedbackAnswer}
                                            onClick={() => {
                                                if (feedbackAnswer) {
                                                    setFeedbackAnswer(false);
                                                }

                                                else {
                                                    setFeedbackQuestion(true);
                                                    setFeedbackAnswer(true);
                                                }
                                            }}
                                        />
                                        정답
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                </div>



                <div className={styles.subContainer}>
                    <Title>
                        시험 삭제
                    </Title>

                    <DeleteButton
                        text="삭제하기"
                        onClick={() => {
                            setIsDeletingTest(true);
                            setDeleteConfirmText("");
                        }}
                    />
                </div>



                {
                    isDeletingTest

                    &&

                    <Modal title="시험 삭제" onClose={() => setIsDeletingTest(false)}>
                        <div>
                            시험을 삭제하시겠습니까?<br />
                            해당 시험의 모든 데이터가 완전히 삭제됩니다.
                        </div>
                        <br />

                        <div style={{ color: "rgb(250, 50, 50)" }}>
                            다음 내용이 삭제됩니다.
                        </div>

                        <ul className={styles.deleteInfo}>
                            <li>시험 설정</li>
                            <li>문제 </li>
                            <li>응시자 정보</li>
                            <li>응시자별 제출 답안지</li>
                            <li>공지사항</li>
                            <li>응시자별 채팅 기록</li>
                        </ul>
                        <br />

                        <div>
                            시험을 삭제하려면 시험 이름을 입력하세요.<br />
                        </div>
                        <br />

                        <InputBox
                            type="text"
                            value={deleteConfirmText}
                            onChange={(event: any) => setDeleteConfirmText(event.target.value)}
                            placeholder={testInfo.testName}
                        />
                        <br /><br /><br />

                        <Buttons>
                            <DeleteButton
                                text="삭제"
                                onClick={deleteTest}
                                disabled={deleteConfirmText !== testInfo.testName}
                            />
                        </Buttons>
                    </Modal>
                }



                <Buttons>
                    <SubmitButton
                        text="수정하기"
                        onClick={editTestInfo}
                    />
                </Buttons>
            </div>
        </div>
    )
}