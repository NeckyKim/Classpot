import { useState } from "react";

import Page1 from "./Page1";
import Page2 from "./Page2";
import Page3 from "./Page3";
import Page4 from "./Page4";
import Page6 from "./Page6";
import AfterPage from "./AfterPage";

import Modal from "../../../theme/Modal";
import CancelButton from "../../../theme/CancelButton";
import Buttons from "../../../theme/Buttons";

import styles from "./PreTestScreen.module.css";




export default function PreTestScreen({ testInfo, applicantInfo, questionList, isTestTime, setIsApplyingTest }: any) {
    const [page, setPage] = useState<number>(1);

    const [checks, setChecks] = useState<boolean[]>([false, false, false, false, false, false])

    const [showError, setShowError] = useState<boolean>(false);



    return (
        <div className={styles.background}>
            <div className={styles.header}>
                <div className={styles.headerTestName}>{testInfo?.testName}</div>
                <div className={styles.headerApplicantName}>{applicantInfo?.applicantName}</div>
            </div>

            {
                (!applicantInfo?.finished) && (isTestTime?.isTime === "before" || isTestTime?.isTime === "running")

                    ?

                    <div className={styles.container1}>
                        <div className={styles.containerTop}>
                            <div className={styles.navigator} onClick={() => setPage(1)}>
                                <div className={page === 1 ? styles.navigatorIconSelected : styles.navigatorIconNotSelected}>
                                    1
                                </div>

                                <div className={page === 1 ? styles.navigatorTextSelected : styles.navigatorTextNotSelected}>
                                    시험 안내
                                </div>
                            </div>



                            <img className={styles.arrow} src={process.env.PUBLIC_URL + "/icons/apply/arrow_right.svg"} />



                            <div
                                className={styles.navigator}
                                onClick={() => {
                                    if (!checks[0]) {
                                        setShowError(true);
                                    }

                                    else {
                                        setPage(2);
                                    }
                                }}
                            >
                                <div className={page === 2 ? styles.navigatorIconSelected : styles.navigatorIconNotSelected}>
                                    2
                                </div>

                                <div className={page === 2 ? styles.navigatorTextSelected : styles.navigatorTextNotSelected}>
                                    시험 규정
                                </div>
                            </div>



                            <img className={styles.arrow} src={process.env.PUBLIC_URL + "/icons/apply/arrow_right.svg"} />



                            <div
                                className={styles.navigator}
                                onClick={() => {
                                    if (!checks[1]) {
                                        setShowError(true);
                                    }

                                    else {
                                        setPage(3);
                                    }
                                }}
                            >
                                <div className={page === 3 ? styles.navigatorIconSelected : styles.navigatorIconNotSelected}>
                                    3
                                </div>

                                <div className={page === 3 ? styles.navigatorTextSelected : styles.navigatorTextNotSelected}>
                                    약관 동의
                                </div>
                            </div>



                            <img className={styles.arrow} src={process.env.PUBLIC_URL + "/icons/apply/arrow_right.svg"} />


                            {
                                testInfo.webCam

                                &&

                                <>
                                    <div
                                        className={styles.navigator}
                                        onClick={() => {
                                            if (!checks[2]) {
                                                setShowError(true);
                                            }

                                            else {
                                                setPage(4);
                                            }
                                        }}
                                    >
                                        <div className={page === 4 ? styles.navigatorIconSelected : styles.navigatorIconNotSelected}>
                                            4
                                        </div>

                                        <div className={page === 4 ? styles.navigatorTextSelected : styles.navigatorTextNotSelected}>
                                            화면 공유
                                        </div>
                                    </div>



                                    <img className={styles.arrow} src={process.env.PUBLIC_URL + "/icons/apply/arrow_right.svg"} />
                                </>
                            }


                            <div
                                className={styles.navigator}
                                onClick={() => {
                                    if (testInfo.webCam) {
                                        if (!checks[3]) {
                                            setShowError(true);
                                        }

                                        else {
                                            setPage(6);
                                        }
                                    }

                                    else {
                                        if (!checks[2]) {
                                            setShowError(true);
                                        }

                                        else {
                                            setPage(6);
                                        }
                                    }
                                }}
                            >
                                <div className={page === 6 ? styles.navigatorIconSelected : styles.navigatorIconNotSelected}>
                                    {testInfo.webCam ? 5 : 4}
                                </div>

                                <div className={page === 6 ? styles.navigatorTextSelected : styles.navigatorTextNotSelected}>
                                    준비 완료
                                </div>
                            </div>
                        </div>

                        {/* <div style={{
                            width: `calc(25% * ${page + 1})`,
                            borderBottom: "2px solid rgb(0, 100, 250)",
                            transition: "0.5s"
                        }} /> */}

                        <div className={styles.containerBottom}>
                            {
                                page === 1

                                &&

                                <Page1
                                    setPage={setPage}
                                    checks={checks} setChecks={setChecks}
                                    testInfo={testInfo}
                                    applicantInfo={applicantInfo}
                                    questionList={questionList}
                                />}

                            {
                                page === 2

                                &&

                                <Page2
                                    setPage={setPage}
                                    checks={checks} setChecks={setChecks}
                                    testInfo={testInfo}
                                />
                            }

                            {
                                page === 3

                                &&

                                <Page3
                                    setPage={setPage}
                                    checks={checks} setChecks={setChecks}
                                />
                            }

                            {
                                page === 4

                                &&

                                <Page4
                                    setPage={setPage}
                                    checks={checks} setChecks={setChecks}
                                />
                            }

                            {
                                page === 6

                                &&

                                <Page6
                                    testInfo={testInfo}
                                    questionList={questionList}
                                    setIsApplyingTest={setIsApplyingTest}
                                />
                            }
                        </div>
                    </div>

                    :

                    <AfterPage testInfo={testInfo} />
            }

            {
                showError

                &&

                <Modal title="알림" onClose={() => setShowError(false)}>
                    다음 항목으로 넘어갈 수 없습니다.
                    <br /><br />

                    <Buttons>
                        <CancelButton
                            text="확인"
                            onClick={() => setShowError(false)}
                        />
                    </Buttons>
                </Modal>
            }
        </div>
    )
}