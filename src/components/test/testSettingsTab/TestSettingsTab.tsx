import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { dbService } from "../../../FirebaseModules";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

import GetTestInfo from "../../hooks/GetTestInfo";

import { toast } from "react-toastify";

import styles from "./TestSettings.module.css";



export default function TestSettingsTab({ testCode }: { testCode: string | undefined }) {
    const navigate = useNavigate();



    // 시험 정보
    const testInfo: any = GetTestInfo(testCode);



    // 시험 이름 변경
    const [isEditingTestName, setIsEditingTestName] = useState<boolean>(false);
    const [testName, setTestName] = useState<string>(testInfo.testName);

    useEffect(() => { setTestName(testInfo.testName); }, [testInfo])



    // 시작 일시 변경
    const [isEditingStartDate, setIsEditingStartDate] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<any>("");

    useEffect(() => {
        setStartDate(new Date(testInfo.startDate).toLocaleDateString("sv-SE") + "T" + new Date(testInfo.startDate).toLocaleTimeString("en-US", { hour12: false }));
    }, [testInfo])



    // 응시 시간 변경
    const [isEditingDuration, setIsEditingDuration] = useState<boolean>(false);
    const [duration, setDuration] = useState<any>("");

    useEffect(() => { setDuration(testInfo.duration); }, [testInfo])



    // 시험 삭제
    const [isDeletingTest, setIsDeletingTest] = useState<boolean>(false);
    const [deletingTestConfirmText, setDeletingTestConfirmText] = useState<string>("");



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



    async function editTestStartDate(event: any) {
        event.preventDefault();

        if (testCode) {
            try {
                await updateDoc(doc(dbService, "tests", testCode), {
                    startDate: Date.parse(startDate),
                })

                toast.success("시험 시작 일시가 변경되었습니다.");
                setIsEditingStartDate(false);
            }

            catch (error) {
                console.log(error);
                toast.error("시험 시작 일시 변경에 실패했습니다.");
            }
        }
    }



    async function editTestDuration(event: any) {
        event.preventDefault();

        if (testCode) {
            try {
                await updateDoc(doc(dbService, "tests", testCode), {
                    duration: duration,
                })

                toast.success("시험 응시 시간이 변경되었습니다.");
                setIsEditingDuration(false);
            }

            catch (error) {
                console.log(error);
                toast.error("시험 응시 시간 변경에 실패했습니다.");
            }
        }
    }



    async function changeFeedback(event: any) {
        event.preventDefault();

        if (testCode) {
            try {
                await updateDoc(doc(dbService, "tests", testCode), {
                    feedback: !testInfo.feedback,
                })

                toast.success("시험 피드백 공개 설정이 변경되었습니다.");
                setIsEditingDuration(false);
            }

            catch (error) {
                console.log(error);
                toast.error("시험 피드백 공개 설정 변경에 실패했습니다.");
            }
        }
    }



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
            <div>
                <div className={styles.header}>
                    시험 이름 설정
                </div>

                <div className={styles.settingsContainer}>
                    {
                        isEditingTestName

                            ?

                            <form className={styles.testNameEditing} onSubmit={editTestName}>
                                <input
                                    type="text"
                                    className={styles.testInputBox}
                                    value={testName}
                                    onChange={(event) => {
                                        setTestName(event.target.value);
                                    }}
                                    required
                                />

                                <input
                                    type="submit"
                                    className={styles.editConfirmButton}
                                    value="완료"
                                />

                                <input
                                    type="button"
                                    className={styles.editCancelButton}
                                    value="취소"
                                    onClick={() => { setIsEditingTestName(false); }}
                                />
                            </form>

                            :

                            <div className={styles.testNameNotEditing}>
                                <div className={styles.testNameValue}>
                                    {testInfo.testName}
                                </div>

                                <div
                                    className={styles.editButton}
                                    onClick={() => {
                                        setIsEditingTestName(true);
                                        setIsEditingStartDate(false);
                                        setIsEditingDuration(false);
                                    }}
                                >
                                    변경
                                </div>
                            </div>
                    }
                </div>




                <div className={styles.header}>
                    시간 설정
                </div>

                <div className={styles.settingsContainer}>
                    <div className={styles.settingsHeader}>
                        시작 일시
                    </div>

                    {
                        isEditingStartDate

                            ?

                            <form className={styles.testDateEditing} onSubmit={editTestStartDate}>
                                <input
                                    type="datetime-local"
                                    className={styles.testInputBox}
                                    value={startDate.toLocaleString("")}
                                    onChange={(event) => {
                                        setStartDate(event.target.value);
                                    }}
                                    required
                                />

                                <input
                                    type="submit"
                                    className={styles.editConfirmButton}
                                    value="완료"
                                />

                                <input
                                    type="button"
                                    className={styles.editCancelButton}
                                    value="취소"
                                    onClick={() => { setIsEditingStartDate(false); }}
                                />
                            </form>

                            :

                            <div className={styles.testDateNotEditing}>
                                <div className={styles.testDateValue}>
                                    {new Date(testInfo?.startDate).toLocaleString("ko-KR")}
                                </div>

                                <div
                                    className={styles.editButton}
                                    onClick={() => {
                                        setIsEditingTestName(false);
                                        setIsEditingStartDate(true);
                                        setIsEditingDuration(false);
                                    }}
                                >
                                    변경
                                </div>
                            </div>
                    }
                </div>



                <div className={styles.settingsContainer}>
                    <div className={styles.settingsHeader}>
                        응시 시간
                    </div>

                    {
                        isEditingDuration

                            ?

                            <form className={styles.testDateEditing} onSubmit={editTestDuration}>
                                <input
                                    type="numer"
                                    className={styles.testInputBox}
                                    value={duration}
                                    onChange={(event) => {
                                        setDuration(event.target.value);
                                    }}
                                    required
                                />

                                <input
                                    type="submit"
                                    className={styles.editConfirmButton}
                                    value="완료"
                                />

                                <input
                                    type="button"
                                    className={styles.editCancelButton}
                                    value="취소"
                                    onClick={() => { setIsEditingDuration(false); }}
                                />
                            </form>

                            :

                            <div className={styles.testDateNotEditing}>
                                <div className={styles.testDateValue}>
                                    {testInfo?.duration}분
                                </div>

                                <div
                                    className={styles.editButton}
                                    onClick={() => {
                                        setIsEditingTestName(false);
                                        setIsEditingStartDate(false);
                                        setIsEditingDuration(true);
                                    }}
                                >
                                    변경
                                </div>
                            </div>
                    }
                </div>

                <div className={styles.settingsContainer}>
                    <div className={styles.settingsHeader}>
                        종료 일시
                    </div>

                    <div className={styles.testDateNotEditing}>
                        <div className={styles.testDateValue}>
                            {new Date(testInfo?.startDate + testInfo?.duration * 60000).toLocaleString("ko-KR")}
                        </div>
                    </div>
                </div>



                <div className={styles.header}>
                    피드백 공개 설정
                </div>

                <div className={styles.settingsContainer}>
                    <div className={styles.settingsHeader}>
                        시험이 종료되면, 응시자들이 문제와 정답을 확인할 수 있습니다.
                    </div>

                    <div className={styles.feedbackButtons}>
                        <button
                            className={testInfo.feedback ? styles.feedbackEnabledButtonOn : styles.feedbackEnabledButtonOff}
                            onClick={changeFeedback}
                            disabled={testInfo.feedback === true}
                        >
                            공개함
                        </button>

                        <button
                            className={!testInfo.feedback ? styles.feedbackDisabledButtonOn : styles.feedbackDisabledButtonOff}
                            onClick={changeFeedback}
                            disabled={testInfo.feedback === false}
                        >
                            공개 안 함
                        </button>
                    </div>
                </div>




                <div className={styles.header}>
                    시험 삭제
                </div>

                {
                    isDeletingTest

                        ?

                        <form className={styles.deleteContainer} onSubmit={deleteTest}>
                            시험을 삭제하려면 시험 이름을 입력하신 후 확인을 누르세요.<br />
                            문제, 응시자 목록, 답안지가 전부 삭제됩니다.

                            <div className={styles.deleteContainerHighlighted}>
                                이 작업은 되돌릴 수 없으며, 삭제된 정보는 복구가 불가능합니다.
                            </div>

                            <input
                                type="text"
                                className={styles.deleteContainerInputBox}
                                value={deletingTestConfirmText}
                                onChange={(event) => {
                                    setDeletingTestConfirmText(event.target.value);
                                }}
                            />

                            <div className={styles.deleteContainerButtons}>
                                <div />

                                <input
                                    type="submit"
                                    className={styles.deleteConfirmButton}
                                    value="삭제"
                                    disabled={deletingTestConfirmText !== testInfo.testName}
                                />

                                <input
                                    type="button"
                                    className={styles.deleteCancelButton}
                                    value="취소"
                                    onClick={() => { setIsDeletingTest(false); }}
                                />
                            </div>
                        </form>

                        :

                        <div className={styles.settingsContainer}>
                            <div className={styles.settingsHeader}>
                                시험을 삭제합니다. 문제, 응시자 목록, 답안지가 전부 삭제됩니다.
                            </div>

                            <div onClick={() => { setIsDeletingTest(true); }} className={styles.testDeleteButton}>
                                시험 삭제
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}