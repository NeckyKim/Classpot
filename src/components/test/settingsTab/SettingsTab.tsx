import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { dbService } from "../../../FirebaseModules";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

import GetTestInfo from "../../hooks/GetTestInfo";

import { toast } from "react-toastify";

import styles from "./SettingsTab.module.css";



export default function SettingsTab({ testCode }: { testCode: string | undefined }) {
    const navigate = useNavigate();



    // 시험 정보
    const testInfo: any = GetTestInfo(testCode);



    // 시험 이름 변경
    const [isEditingTestName, setIsEditingTestName] = useState<boolean>(false);
    const [testName, setTestName] = useState<string>(testInfo.testName);

    useEffect(() => { setTestName(testInfo.testName); }, [testInfo])



    // 시작 일시
    const [isEditingTestTime, setIsEditingTestTime] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<any>("");
    const [duration, setDuration] = useState<any>("");

    useEffect(() => {
        setStartDate(new Date(testInfo.startDate).toLocaleDateString("sv-SE") + "T" + new Date(testInfo.startDate).toLocaleTimeString("en-US", { hour12: false }));
    }, [testInfo])

    useEffect(() => { setDuration(testInfo.duration); }, [testInfo])



    // 시험 삭제 여부
    const [isDeletingTest, setIsDeletingTest] = useState<boolean>(false);
    const [deleteTestConfirmText, setDeleteTestConfirmText] = useState<string>("");



    // 시험 이름 변경 함수
    async function editTestName(event: any) {
        event.preventDefault();

        if (testCode) {
            try {
                await updateDoc(doc(dbService, "tests", testCode), {
                    testName: testName,
                })

                toast.success("시험 이름이 변경되었습니다.");
                setIsEditingTestName(false);
            }

            catch (error) {
                console.log(error);
                toast.error("시험 이름이 변경에 실패했습니다.");
            }
        }
    }



    // 시작 일시 변경 함수
    async function editTestTime(event: any) {
        event.preventDefault();

        if (testCode) {
            try {
                await updateDoc(doc(dbService, "tests", testCode), {
                    startDate: Date.parse(startDate),
                    duration: duration
                })

                toast.success("시험 시작 일시와 응시 시간이 변경되었습니다.");
                setIsEditingTestTime(false);
                setIsEditingTestTime(false);
            }

            catch (error) {
                console.log(error);
                toast.error("시험 시작 일시와 응시 시간 변경에 실패했습니다.");
            }
        }
    }



    // 성적 공개 설정 변경 함수
    async function changeFeedback(event: any) {
        event.preventDefault();

        if (testCode) {
            try {
                await updateDoc(doc(dbService, "tests", testCode), {
                    feedback: !testInfo.feedback,
                })

                toast.success("종료 후 성적 공개 설정이 변경되었습니다.");
            }

            catch (error) {
                console.log(error);
                toast.error("종료 후성적 공개 설정 변경에 실패했습니다.");
            }
        }
    }


    // 시작 전 정보 공개 설정 변경 함수
    async function changeShowInfo(event: any) {
        event.preventDefault();

        if (testCode) {
            try {
                await updateDoc(doc(dbService, "tests", testCode), {
                    showInfo: !testInfo.showInfo,
                })

                toast.success("시작 전 정보 공개 설정이 변경되었습니다.");
            }

            catch (error) {
                console.log(error);
                toast.error("시작 전 정보 공개 설정 변경에 실패했습니다.");
            }
        }
    }



    // 시험 삭제 함수
    async function deleteTest(event: any) {
        event.preventDefault();

        if (testCode) {
            try {
                await deleteDoc(doc(dbService, "tests", testCode));

                navigate("/");
                toast.success("시험이 삭제되었습니다.");
            }

            catch (error) {
                console.log(error);
                toast.error("시험 삭제에 실패했습니다.");
            }
        }
    }



    return (
        <div>
            <div className={styles.settingsContainer}>
                <div className={styles.settingsHeader}>
                    시험 이름
                </div>


                {
                    isEditingTestName

                        ?

                        <form onSubmit={editTestName}>
                            <input
                                type="text"
                                className={styles.testNameInputBox}
                                value={testName}
                                onChange={(event) => {
                                    setTestName(event.target.value);
                                }}
                                required
                            />
                            <br />

                            <input
                                type="submit"
                                className={styles.editButton}
                                value="변경 완료"
                            />

                            <input
                                type="button"
                                className={styles.cancelButton}
                                onClick={() => {
                                    setIsEditingTestName(false);
                                    setTestName(testInfo.testName);
                                }}
                                value="변경 취소"
                            />
                        </form>

                        :

                        <div>
                            <div className={styles.settingsValue}>
                                {testInfo.testName}
                            </div>

                            <div
                                className={styles.editButton}
                                onClick={() => {
                                    setIsEditingTestName(true);
                                    setIsEditingTestTime(false);
                                }}
                            >
                                변경
                            </div>
                        </div>
                }
            </div>



            <div className={styles.settingsContainer}>
                <div className={styles.settingsHeader}>
                    시험 코드
                </div>

                <div className={styles.settingsValue}>
                    {testInfo.shortTestCode}
                </div>

                <div className={styles.description}>
                    응시자들에게 6자리 시험 코드를 안내하여, 응시자들이 시험 응시 페이지에 접속할 수 있습니다.
                </div>
            </div>



            <div className={styles.settingsContainer}>
                {
                    isEditingTestTime

                        ?

                        <form onSubmit={editTestTime}>
                            <div className={styles.dateContainer}>
                                <div>
                                    <div className={styles.settingsHeader}>
                                        시작 일시
                                    </div>

                                    <input
                                        type="datetime-local"
                                        className={styles.startDateInputBox}
                                        value={startDate.toLocaleString("")}
                                        onChange={(event) => {
                                            setStartDate(event.target.value);
                                        }}
                                        required
                                    />
                                </div>

                                <div>
                                    <div className={styles.settingsHeader}>
                                        진행 시간
                                    </div>

                                    <input
                                        type="number"
                                        className={styles.durationInputBox}
                                        value={duration}
                                        onChange={(event) => {
                                            setDuration(event.target.value);
                                        }}
                                        required
                                    />
                                </div>

                                <div>
                                    <div className={styles.settingsHeader}>
                                        종료 일시
                                    </div>

                                    <div className={styles.settingsValue}>
                                        {new Date(testInfo?.startDate + testInfo?.duration * 60000).toLocaleString("ko-KR")}
                                    </div>
                                </div>
                            </div>

                            <input
                                type="submit"
                                className={styles.editButton}
                                value="변경 완료"
                            />

                            <input
                                type="button"
                                className={styles.cancelButton}
                                onClick={() => {
                                    setIsEditingTestTime(false);
                                    setStartDate(new Date(testInfo.startDate).toLocaleDateString("sv-SE") + "T" + new Date(testInfo.startDate).toLocaleTimeString("en-US", { hour12: false }));
                                    setDuration(testInfo.duration);
                                }}
                                value="변경 취소"
                            />
                        </form>

                        :

                        <div>
                            <div className={styles.dateContainer}>
                                <div>
                                    <div className={styles.settingsHeader}>
                                        시작 일시
                                    </div>

                                    <div className={styles.startEndDateValue}>
                                        {new Date(testInfo?.startDate).toLocaleString("ko-KR")}
                                    </div>
                                </div>

                                <div>
                                    <div className={styles.settingsHeader}>
                                        진행 시간
                                    </div>

                                    <div className={styles.durationValue}>
                                        {testInfo.duration}분
                                    </div>
                                </div>

                                <div>
                                    <div className={styles.settingsHeader}>
                                        종료 일시
                                    </div>

                                    <div className={styles.startEndDateValue}>
                                        {new Date(testInfo?.startDate + testInfo?.duration * 60000).toLocaleString("ko-KR")}
                                    </div>
                                </div>
                            </div>

                            <div
                                className={styles.editButton}
                                onClick={() => {
                                    setIsEditingTestName(false);
                                    setIsEditingTestTime(true);
                                }}
                            >
                                변경
                            </div>
                        </div>
                }
            </div>    



            <div className={styles.settingsContainer}>
                <div className={styles.settingsHeader}>
                    시작 전 정보 공개
                </div>

                <div className={styles.feedbackContainer}>
                    <button
                        className={testInfo.showInfo ? styles.feedbackButtonOn : styles.feedbackButtonOff}
                        onClick={changeShowInfo}
                        disabled={testInfo.showInfo === true}
                        style={{ borderRadius: "5px 0px 0px 5px" }}
                    >
                        공개
                    </button>

                    <button
                        className={!testInfo.showInfo ? styles.feedbackButtonOn : styles.feedbackButtonOff}
                        onClick={changeShowInfo}
                        disabled={testInfo.showInfo === false}
                        style={{ borderRadius: "0px 5px 5px 0px" }}
                    >
                        비공개
                    </button>
                </div>

                <div className={styles.description}>
                    {
                        testInfo.feedback

                            ?

                            "시험이 시작되기 전 응시자들이 시험 문항 수, 응시 시간, 총점을 확인할 수 있습니다."

                            :

                            "시험이 시작되기 전 응시자들이 시험 문항 수, 응시 시간, 총점을 확인할 수 없습니다."
                    }
                </div>
            </div>



            <div className={styles.settingsContainer}>
                <div className={styles.settingsHeader}>
                    종료 후 성적 공개
                </div>

                <div className={styles.feedbackContainer}>
                    <button
                        className={testInfo.feedback ? styles.feedbackButtonOn : styles.feedbackButtonOff}
                        onClick={changeFeedback}
                        disabled={testInfo.feedback === true}
                        style={{ borderRadius: "5px 0px 0px 5px" }}
                    >
                        공개
                    </button>

                    <button
                        className={!testInfo.feedback ? styles.feedbackButtonOn : styles.feedbackButtonOff}
                        onClick={changeFeedback}
                        disabled={testInfo.feedback === false}
                        style={{ borderRadius: "0px 5px 5px 0px" }}
                    >
                        비공개
                    </button>
                </div>

                <div className={styles.description}>
                    {
                        testInfo.feedback

                            ?

                            "시험이 종료된 후 응시자들이 시험 문제, 본인의 답안지와 성적을 확인할 수 있습니다."

                            :

                            "시험이 종료된 후 응시자들이 시험 문제, 본인의 답안지와 성적을 확인할 수 없습니다."
                    }
                </div>
            </div>



            <div className={styles.settingsContainer}>
                <div className={styles.settingsHeader}>
                    시험 삭제
                </div>

                <div 
                    className={styles.deleteButton}
                    onClick={() => {
                        setIsDeletingTest(true);
                    }}
                >
                    삭제하기
                </div>

                <div className={styles.description} style={{color: "rgb(250, 50, 50)"}}>
                    시험 문제, 응시자 목록, 제출 답안지가 모두 삭제됩니다.
                </div>
            </div>

            {
                isDeletingTest

                &&

                <div className={styles.deleteTestBackground}>
                    <form className={styles.deleteTestContainer} onSubmit={deleteTest}>
                        시험 문제, 응시자 목록, 제출된 답안지가 전부 삭제됩니다.
                        <div style={{color: "rgb(250, 50, 50)"}}>
                            삭제된 모든 정보는 절대로 복구할 수 없습니다.
                        </div>
                        <br />
                        시험을 삭제하려면 시험 이름을 입력후 삭제 버튼을 누르세요.

                        <input
                            type="text"
                            className={styles.deleteConfirmTextInputBot}
                            onChange={(event) => {
                                setDeleteTestConfirmText(event.target.value);
                            }}
                        />

                        <div className={styles.deleteContainerButtonZone}>
                            <input
                                type="submit"
                                className={styles.deleteTestButton}
                                disabled={deleteTestConfirmText !== testInfo.testName}
                                value="삭제"
                            />

                            <input
                                type="button"
                                className={styles.cancelButton}
                                value="취소"
                                onClick={() => {
                                    setDeleteTestConfirmText("");
                                    setIsDeletingTest(false);
                                }}
                            />                        
                        </div>
                    </form>
                </div>
            }
        </div>
    )
}