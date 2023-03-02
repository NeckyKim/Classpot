import { useState } from "react";

import styles from "./PreTestMode.module.css";



export default function PreTestMode({ testInfo, testCode, applicantName, applicantCode, isTestTime, setIsApplyingTest, noOfQuestions, totalPoints }: { testInfo: any, testCode: any, applicantName: any, applicantCode: any, isTestTime: any, setIsApplyingTest: any, noOfQuestions: number, totalPoints: number }) {
    const [tab, setTab] = useState<number>(1);

    const [check1, setCheck1] = useState<boolean>(false);
    const [check2, setCheck2] = useState<boolean>(false);

    return (
        <div>
            {
                (isTestTime[0] === "전" || isTestTime[0] === "중")

                &&

                <div className={styles.preTestModeBackground}>
                    <div className={styles.preTestModeContainer}>
                        <div className={styles.preTestModeContainerLeft}>
                            <button
                                className={tab === 1 ? styles.tabButtonClicked : styles.tabButtonNotClicked}
                                onClick={() => { setTab(1); }}
                            >
                                <div className={tab === 1 ? styles.tabNumberClicked : styles.tabNumberNotClicked}>1</div>

                                <div>
                                    시험 안내
                                </div>
                            </button>

                            <button
                                className={tab === 2 ? styles.tabButtonClicked : styles.tabButtonNotClicked}
                                onClick={() => { setTab(2); }}
                            >
                                <div className={tab === 2 ? styles.tabNumberClicked : styles.tabNumberNotClicked}>2</div>

                                <div>
                                    유의 사항
                                </div>
                            </button>

                            <button
                                className={tab === 3 ? styles.tabButtonClicked : styles.tabButtonNotClicked}
                                onClick={() => { setTab(3); }}
                                disabled={!check1}
                            >
                                <div className={tab === 3 ? styles.tabNumberClicked : styles.tabNumberNotClicked}>3</div>

                                <div>
                                    약관 동의
                                </div>
                            </button>

                            <button
                                className={tab === 4 ? styles.tabButtonClicked : styles.tabButtonNotClicked}
                                onClick={() => { setTab(4); }}
                                disabled={!check2}
                            >
                                <div className={tab === 4 ? styles.tabNumberClicked : styles.tabNumberNotClicked}>4</div>

                                <div>
                                    준비 완료
                                </div>
                            </button>
                        </div>

                        <div className={styles.preTestModeContainerRight}>
                            <div className={styles.testName}>
                                {testInfo.testName}
                            </div>

                            {
                                tab === 1

                                &&

                                <div className={styles.tab1}>
                                    <div className={styles.tab1Top}>
                                        안녕하세요,&nbsp;
                                        <span className={styles.highlight}>
                                            {applicantName}
                                        </span>님.<br /><br />

                                        본 시험은 &nbsp;
                                        <span className={styles.highlight}>
                                            {new Date(testInfo.startDate).toLocaleString("ko-KR")}
                                        </span>부터&nbsp;

                                        <span className={styles.highlight}>
                                            {new Date(testInfo.startDate + testInfo.duration * 60000).toLocaleString("ko-KR")}
                                        </span>까지<br />

                                        약&nbsp;
                                        <span className={styles.highlight}>
                                            {testInfo.duration}분
                                        </span> 동안 진행됩니다.<br /><br />

                                        총&nbsp;
                                        <span className={styles.highlight}>
                                            {noOfQuestions}문항
                                        </span>으로 구성되어 있으며,&nbsp;

                                        <span className={styles.highlight}>
                                            {totalPoints}점
                                        </span>&nbsp;만점으로 진행됩니다.<br /><br />

                                        유의 사항을 확인해주시고, 약관 동의를 해주셔야 시험에 응시할 수 있습니다.
                                    </div>

                                    <div className={styles.tab1Bottom}>
                                        <div
                                            className={styles.nextButton}
                                            onClick={() => {
                                                setTab(2);
                                            }}
                                        >
                                            다음
                                        </div>
                                    </div>
                                </div>
                            }

                            {
                                tab === 2

                                &&

                                <div className={styles.tab2}>
                                    <div className={styles.tab2Top}>
                                        <div className={styles.tabHeader}>
                                            다음 유의 사항을 확인해주세요.
                                        </div>

                                        <div className={styles.notificationContainer}>
                                            <li className={styles.notificationElements}>
                                                Chrome 브라우저 환경에서 시험을 응시해주세요. 다른 브라우저에서는 시험이 정상적으로 진행되지 않을 수 있습니다.
                                            </li>

                                            <li className={styles.notificationElements}>
                                                시험 도중에 페이지를 나가도 다시 접속하여 계속 응시할 수 있습니다.
                                            </li>

                                            <li className={styles.notificationElements}>
                                                제출하기 버튼을 누르거나 다른 문제로 이동하면 답안지가 자동으로 제출됩니다.
                                            </li>

                                            <li className={styles.notificationElements}>
                                                시험이 종료되면 마지막에 작성한 답안지가 자동으로 제출됩니다.
                                            </li>

                                            <li className={styles.notificationElements}>
                                                개인의 응시 환경 또는 네트워크 연결 문제로 인한 문제로 인해 발생한 불이익은 책임지지 않습니다.
                                            </li>

                                            <li className={styles.notificationElements}>
                                                안내사항을 제대로 숙지하지 않아 발생한 불이익은 책임지지 않습니다.
                                            </li>
                                        </div>

                                        <div className={styles.checkBox}>
                                            <div className={styles.checkBoxText}>
                                                위의 유의 사항을 모두 확인했으며, 이를 따르지 않아 발생하는 문제의 책임은 본인에게 있음을 확인하였습니다.
                                            </div>

                                            <div
                                                className={check1 ? styles.checkBoxChecked : styles.checkBoxNotChecked}
                                                onClick={() => { setCheck1((prev) => !prev); }}
                                            >
                                                {check1 && <img className={styles.checkBoxIcon} src={process.env.PUBLIC_URL + "/icons/checked.png"} />}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.tab2Bottom}>
                                        <button
                                            className={styles.nextButton}
                                            onClick={() => {
                                                setCheck1(true);
                                                setTab(3);
                                            }}
                                            disabled={!check1}
                                        >
                                            다음
                                        </button>
                                    </div>
                                </div>
                            }

                            {
                                tab === 3

                                &&

                                <div className={styles.tab3}>
                                    <div className={styles.tab3Top}>
                                        <div className={styles.tabHeader}>
                                            다음 약관 내용을 확인해주세요.
                                        </div>

                                        <div className={styles.agreementContainer}>
                                            본 시험 문제는 저작권의 보호를 받으며, 지문 및 보기에 대한 정보를 복제, 공중송신 배포하거나 2차 저작물을 작성하는 등의 행위를 금합니다. 문제에 대한 정보를 시험 출제자의 동의 없이 타인에게 공개하거나 전달하는 행위는 출제자의 재산을 침해하는 것으로, 이를 침해하는 이는 저작권법에 따라 5년 이하의 징역 또는 5천만 원 이하의 벌금에 처할 수 있습니다.<br /><br />

                                            시험 진행 중 부정행위가 확인되는 경우, 시험 즉시 종료, 재응시 불가 및 실격 처리 등의 조치가 이루어질 수 있으며 이에 동의합니다.<br />
                                        </div>

                                        <div className={styles.checkBox}>
                                            <div className={styles.checkBoxText}>
                                                위의 내용에 동의합니다.
                                            </div>

                                            <div
                                                className={check2 ? styles.checkBoxChecked : styles.checkBoxNotChecked}
                                                onClick={() => { setCheck2((prev) => !prev); }}
                                            >
                                                {check2 && <img className={styles.checkBoxIcon} src={process.env.PUBLIC_URL + "/icons/checked.png"} />}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.tab3Bottom}>
                                        <button
                                            className={styles.nextButton}
                                            onClick={() => {
                                                setCheck2(true);
                                                setTab(4);
                                            }}
                                            disabled={!check2}
                                        >
                                            다음
                                        </button>
                                    </div>
                                </div>
                            }

                            {
                                tab === 4

                                &&

                                <div className={styles.tab4}>
                                    <div className={styles.tab4Top}>
                                        <div className={styles.tabHeader}>
                                            시험에 응시할 준비가 모두 완료되었습니다.<br />
                                            응시 시간이 되면 아래의 버튼을 클릭하여, 시험을 시작해주세요.
                                        </div>
                                    </div>

                                    <div className={styles.tab4Center}>
                                        <div className={styles.testInfoContainer}>
                                            <div className={styles.testInfoHeader}>
                                                시작 일시
                                            </div>

                                            <div className={styles.testInfoValue}>
                                                {new Date(testInfo.startDate).toLocaleString("ko-KR")}
                                            </div>
                                        </div>

                                        <div className={styles.testInfoContainer}>
                                            <div className={styles.testInfoHeader}>
                                                진행 시간
                                            </div>

                                            <div className={styles.testInfoValue}>
                                                {testInfo.duration}분
                                            </div>
                                        </div>

                                        <div className={styles.testInfoContainer}>
                                            <div className={styles.testInfoHeader}>
                                                종료 일시
                                            </div>

                                            <div className={styles.testInfoValue}>
                                                {new Date(testInfo.startDate + testInfo.duration * 60000).toLocaleString("ko-KR")}
                                            </div>
                                        </div>

                                        <div className={styles.testInfoContainer}>
                                            <div className={styles.testInfoHeader}>
                                                문항 수
                                            </div>

                                            <div className={styles.testInfoValue}>
                                                {noOfQuestions}문항
                                            </div>
                                        </div>
                                        
                                        <div className={styles.testInfoContainer}>
                                            <div className={styles.testInfoHeader}>
                                                총점
                                            </div>

                                            <div className={styles.testInfoValue}>
                                                {totalPoints}점
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.tab4Bottom}>
                                        {
                                            isTestTime[0] === "전"

                                            &&

                                            <button className={styles.startButton} disabled>
                                                {isTestTime[1][0] !== 0 && <span>{isTestTime[1][0]}일 </span>}
                                                {isTestTime[1][1] !== 0 && <span>{isTestTime[1][1]}시간 </span>}
                                                {isTestTime[1][2] !== 0 && <span>{isTestTime[1][2]}분 </span>}
                                                {isTestTime[1][3]}초 후 시작
                                            </button>
                                        }

                                        {
                                            isTestTime[0] === "중"

                                            &&

                                            <button className={styles.startButton} onClick={() => { setIsApplyingTest(true); }}>
                                                시험 응시
                                            </button>
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                    </div>



                    {/* <div className={styles.preTestModeContainerTop2}>
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
                    </div> */}
                </div>
            }
        </div>
    )
}