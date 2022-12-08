import { useState } from "react";
import { useParams } from "react-router";

import QuestionTab from "./questionTab/QuestionTab";

import GetTestInfo from "../hooks/GetTestInfo";
import HeaderBottom from "../header/HeaderBottom";

import styles from "./Test.module.css";



type TestProps = {
    userCode: string;
    email: string;
}

type TestInfoProps = {
    userCode: string;
    testName: string;
    duration: number;
}

export default function Test({ userCode, email }: TestProps) {
    let { testCode } = useParams();

    var testInfo: TestInfoProps | undefined;
    testInfo = GetTestInfo(userCode, testCode);

    var [tab, setTab] = useState<number>(1)

    return (
        <div>
            <HeaderBottom testName={testInfo ? testInfo.testName : ""} />

            {
                userCode === testInfo?.userCode

                    ?

                    <div className={styles.container}>
                        <div className={styles.containerLeft}>
                            <div className={styles.containerLeftButton} onClick={() => { setTab(1); }} >
                                시험 설정
                            </div>

                            <div className={styles.containerLeftButton} onClick={() => { setTab(2); }} >
                                문제 관리
                            </div>

                            <div className={styles.containerLeftButton} onClick={() => { setTab(3); }} >
                                답안지 확인
                            </div>
                        </div>

                        <div className={styles.containerRight}>
                            {tab === 1 && <div>시험 설정</div>}
                            {tab === 2 && <QuestionTab />}
                            {tab === 3 && <div>답안지 확인</div>}
                        </div>
                    </div>

                    :

                    <div>
                        접근 권한이 없습니다.
                    </div>
            }
        </div>
    )
}