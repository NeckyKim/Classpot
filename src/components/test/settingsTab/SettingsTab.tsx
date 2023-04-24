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
    async function editTestInfo(event: any) {
        event.preventDefault();

        if (testCode) {
            try {
                await updateDoc(doc(dbService, "tests", testCode), {
                    testName: testName,
                    startDate: Date.parse(startDate),
                    duration: duration
                })

                toast.success("시험 기본 정보가 변경되었습니다.");
                setIsEditingTestName(false);
            }

            catch (error) {
                console.log(error);
                toast.error("시험 기본 정보가 변경에 실패했습니다.");
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


    // 모바일 응시 허용 설정 변경 함수
    async function changeAllowMobile(event: any) {
        event.preventDefault();

        if (testCode) {
            try {
                await updateDoc(doc(dbService, "tests", testCode), {
                    allowMobile: !testInfo.allowMobile,
                })

                toast.success("모바일 환경 응시 설정이 변경되었습니다.");
            }

            catch (error) {
                console.log(error);
                toast.error("모바일 환경 응시 설정 변경에 실패했습니다.");
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
        <div className={styles.container}>
            <div className={styles.optionContainer}>
                <div className={styles.optionContainerTop}>
                    기본 정보
                </div>

                <form className={styles.optionContainerBottom} onSubmit={editTestInfo} >
                    <div className={styles.settingsContainer}>
                        <div className={styles.settingsHeader} style={{ marginTop: "0px" }}>
                            시험 이름
                        </div>

                        <input
                            type="text"
                            className={styles.settingsInputBox}
                            value={testName}
                            onChange={(event) => {
                                setTestName(event.target.value);
                            }}
                            required
                        />
                    </div>

                    <div className={styles.settingsContainer}>
                        <div className={styles.settingsHeader}>
                            시험 코드
                        </div>

                        <div className={styles.settingsInputBox}>
                            {testInfo.shortTestCode}
                        </div>
                    </div>

                    <div className={styles.dateContainer}>
                        <div className={styles.settingsHeader}>
                            시작 일시
                        </div>

                        <input
                            type="datetime-local"
                            className={styles.dateInputBox}
                            value={startDate.toLocaleString("ko-KR")}
                            onChange={(event) => {
                                setStartDate(event.target.value);
                            }}
                            required
                        />

                        <div className={styles.settingsHeader}>
                            진행 시간
                        </div>

                        <input
                            type="number"
                            className={styles.settingsInputBox}
                            value={duration}
                            onChange={(event) => {
                                setDuration(event.target.value);
                            }}
                            required
                        />
                    </div>

                    <input
                        type="submit"
                        className={styles.settingsConfirmButton}
                        value="변경 완료"
                    />
                </form>
            </div>

            <div className={styles.optionContainer}>
                <div className={styles.optionContainerTop}>
                    시험 진행 설정
                </div>

                <div className={styles.optionContainerBottom}>
                    <div className={styles.toggleContainer}>
                        <div className={styles.toggleHeader}>
                            재입장 허용
                        </div>

                        <div className={true ? styles.toggleButtonOn : styles.toggleButtonOff}>
                            <div className={true ? styles.toggleRight : styles.toggleLeft} />
                        </div>
                    </div>

                    <div className={styles.toggleContainer}>
                        <div className={styles.toggleHeader}>
                            채팅 허용
                        </div>

                        <div className={true ? styles.toggleButtonOn : styles.toggleButtonOff}>
                            <div className={true ? styles.toggleRight : styles.toggleLeft} />
                        </div>
                    </div>

                    <div className={styles.toggleContainer}>
                        <div className={styles.toggleHeader}>
                            모바일 환경(스마트폰, 태블릿) 응시 허용
                        </div>

                        <div className={testInfo.allowMobile ? styles.toggleButtonOn : styles.toggleButtonOff} onClick={changeAllowMobile}>
                            <div className={testInfo.allowMobile ? styles.toggleRight : styles.toggleLeft} />
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.optionContainer}>
                <div className={styles.optionContainerTop}>
                    시험 성적 공개 설정
                </div>

                <div className={styles.optionContainerBottom}>
                    <div className={styles.toggleContainer}>
                        <div className={styles.toggleHeader} style={{ marginTop: "0px" }}>
                            종료 후 성적 공개
                        </div>

                        <div className={testInfo.feedback ? styles.toggleButtonOn : styles.toggleButtonOff} onClick={changeFeedback}>
                            <div className={testInfo.feedback ? styles.toggleRight : styles.toggleLeft} />
                        </div>
                    </div>

                    {
                        testInfo.feedback

                        &&

                        <div className={styles.feedbackContainer}>
                            <div className={styles.feedbackElements}>
                                <div className={styles.feedbackHeader}>
                                    점수
                                </div>

                                <div className={styles.feedbackChecked}>
                                    <img className={styles.checkIcon} src={process.env.PUBLIC_URL + "/icons/checked.png"} />
                                </div>
                            </div>

                            <div className={styles.feedbackElements}>
                                <div className={styles.feedbackHeader}>
                                    평균 점수
                                </div>

                                <div className={styles.feedbackChecked}>
                                    <img className={styles.checkIcon} src={process.env.PUBLIC_URL + "/icons/checked.png"} />
                                </div>
                            </div>

                            <div className={styles.feedbackElements}>
                                <div className={styles.feedbackHeader}>
                                    석차
                                </div>

                                <div className={styles.feedbackChecked}>
                                    <img className={styles.checkIcon} src={process.env.PUBLIC_URL + "/icons/checked.png"} />
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>

            <div className={styles.optionContainer}>
                <div className={styles.optionContainerTop}>
                    위험 구역
                </div>

                <div className={styles.optionContainerBottom}>
                    <div
                        className={styles.deleteButton}
                        onClick={() => {
                            setIsDeletingTest(true);
                        }}
                    >
                        삭제하기
                    </div>
                </div>
            </div>

            {
                isDeletingTest

                &&

                <div className={styles.background}>
                    <form className={styles.backgroundContainer} onSubmit={deleteTest}>
                        시험 문제, 응시자 목록, 제출된 답안지가 전부 삭제됩니다.
                        <div style={{ color: "rgb(250, 50, 50)" }}>
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
                            spellCheck={false}
                        />

                        <div className={styles.deleteContainerButtonZone}>
                            <input
                                type="submit"
                                className={styles.deleteTestConfirmButton}
                                disabled={deleteTestConfirmText !== testInfo.testName}
                                value="삭제"
                            />

                            <input
                                type="button"
                                className={styles.deleteTestCancelButton}
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