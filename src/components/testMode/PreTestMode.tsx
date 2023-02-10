import { useState } from "react";

import styles from "./PreTestMode.module.css";



export default function PreTestMode({ testInfo, testCode, applicantName, applicantCode, isTestTime, setIsApplyingTest, noOfQuestions, totalPoints }: { testInfo: any, testCode: any, applicantName: any, applicantCode: any, isTestTime: any, setIsApplyingTest: any, noOfQuestions: number, totalPoints: number }) {
    const [tab, setTab] = useState<number>(1);


    
    return (
        <div>
            {
                (isTestTime[0] === "전" || isTestTime[0] === "중")

                &&

                <div className={styles.preTestModeContainer}>
                    <div className={styles.preTestModeContainerTop}>
                        <div className={styles.preTestModeContainerTop1}>
                            <div className={styles.header}>
                                시험 이름
                            </div>

                            <div className={styles.testName}>
                                {testInfo.testName}
                            </div>

                            <div className={styles.info}>
                                <div className={styles.header}>
                                    출제자
                                </div>

                                <div className={styles.infoValue}>
                                    {testInfo.userName}
                                </div>
                            </div>

                            <div className={styles.info}>
                                <div className={styles.header}>
                                    응시자
                                </div>

                                <div className={styles.infoValue}>
                                    {applicantName}
                                </div>
                            </div>

                            <div className={styles.info}>
                                <div className={styles.header}>
                                    시작 일시
                                </div>

                                <div className={styles.infoValue}>
                                    {new Date(testInfo?.startDate).toLocaleString("ko-KR")}
                                </div>
                            </div>

                            {
                                testInfo?.showInfo

                                &&

                                <div>
                                    <div className={styles.info}>
                                        <div className={styles.header}>
                                            응시 시간
                                        </div>

                                        <div className={styles.infoValue}>
                                            {testInfo?.duration}분
                                        </div>
                                    </div>


                                    <div className={styles.info}>
                                        <div className={styles.header}>
                                            문항 구성
                                        </div>

                                        <div className={styles.infoValue}>
                                            {noOfQuestions}문제&nbsp;&nbsp;{totalPoints}점
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>

                        <div className={styles.preTestModeContainerTop2}>
                            {
                                isTestTime[0] === "전"

                                &&

                                <div className={styles.buttonDisabled}>
                                    {isTestTime[1][0] !== 0 && <span>{isTestTime[1][0]}일 </span>}
                                    {isTestTime[1][1] !== 0 && <span>{isTestTime[1][1]}시간 </span>}
                                    {isTestTime[1][2] !== 0 && <span>{isTestTime[1][2]}분 </span>}
                                    {isTestTime[1][3]}초 후 시작
                                </div>
                            }

                            {
                                isTestTime[0] === "중"

                                &&

                                <div className={styles.buttonEnabled} onClick={() => { setIsApplyingTest(true); }}>
                                    시험 응시
                                </div>
                            }

                            {
                                isTestTime[0] === "후"

                                &&

                                (
                                    testInfo.feedback

                                        ?

                                        <div className={styles.buttonEnabled} onClick={() => {
                                            window.open("/test/" + testCode + "/answersheet/" + applicantCode)
                                        }}>
                                            시험 결과 보기
                                        </div>

                                        :

                                        <div className={styles.buttonDisabled}>
                                            시험 종료
                                        </div>
                                )
                            }
                        </div>
                    </div>



                    <div className={styles.preTestModeContainerBottom}>
                        <div className={styles.tabMenu}>
                            <div
                                className={tab === 1 ? styles.tabSelected : styles.tabNotSelected}
                                onClick={() => { setTab(1); }}
                            >
                                안내사항
                            </div>
                        </div>

                        <div>
                            {
                                tab === 1

                                &&

                                <ul>
                                    <li className={styles.tabContent}>
                                        Chrome 브라우저 환경에서 시험을 응시해주시길 바랍니다. 다른 브라우저에서는 시험이 정상적으로 진행되지 않을 수 있습니다.
                                    </li>

                                    <li className={styles.tabContent}>
                                        시험 도중에 페이지를 나가도 다시 접속하여 계속 응시할 수 있습니다.
                                    </li>

                                    <li className={styles.tabContent}>
                                        제출하기 버튼을 누르거나 다른 문제로 이동하면 답안지가 자동으로 제출됩니다.
                                    </li>

                                    <li className={styles.tabContent}>
                                        시험이 종료되면 마지막에 작성한 답안지가 자동으로 제출됩니다.
                                    </li>
                                </ul>
                            }
                        </div>
                    </div>
                </div>
            }

            {
                (isTestTime[0] === "후")

                &&

                <div className={styles.preTestModeContainer}>
                    <div className={styles.preTestModeContainerTop}>
                        <div className={styles.preTestModeContainerTop1}>
                            <div className={styles.header}>
                                시험 이름
                            </div>

                            <div className={styles.testName}>
                                {testInfo.testName}
                            </div>

                            <div className={styles.info}>
                                <div className={styles.header}>
                                    출제자
                                </div>

                                <div className={styles.infoValue}>
                                    {testInfo.userName}
                                </div>
                            </div>

                            <div className={styles.info}>
                                <div className={styles.header}>
                                    응시자
                                </div>

                                <div className={styles.infoValue}>
                                    {applicantName}
                                </div>
                            </div>

                            <div className={styles.info}>
                                <div className={styles.header}>
                                    시작 일시
                                </div>

                                <div className={styles.infoValue}>
                                    {new Date(testInfo?.startDate).toLocaleString("ko-KR")}
                                </div>
                            </div>
                        </div>

                        <div className={styles.preTestModeContainerTop2}>
                            {
                                isTestTime[0] === "전"

                                &&

                                <div className={styles.buttonDisabled}>
                                    {isTestTime[1][0] !== 0 && <span>{isTestTime[1][0]}일 </span>}
                                    {isTestTime[1][1] !== 0 && <span>{isTestTime[1][1]}시간 </span>}
                                    {isTestTime[1][2] !== 0 && <span>{isTestTime[1][2]}분 </span>}
                                    {isTestTime[1][3]}초 후 시작
                                </div>
                            }

                            {
                                isTestTime[0] === "중"

                                &&

                                <div className={styles.buttonEnabled} onClick={() => { setIsApplyingTest(true); }}>
                                    시험 응시
                                </div>
                            }

                            {
                                isTestTime[0] === "후"

                                &&

                                (
                                    testInfo.feedback

                                        ?

                                        <div className={styles.buttonEnabled} onClick={() => {
                                            window.open("/test/" + testCode + "/answersheet/" + applicantCode)
                                        }}>
                                            시험 결과 보기
                                        </div>

                                        :

                                        <div className={styles.buttonDisabled}>
                                            시험 종료
                                        </div>
                                )
                            }
                        </div>
                    </div>




                </div>
            }
        </div>
    )
}