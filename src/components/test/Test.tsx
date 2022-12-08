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

    var testInfo: TestInfoProps | undefined = GetTestInfo(userCode, testCode);

    var [tab, setTab] = useState<number>(1)

    console.log(tab)

    return (
        <div>
            <HeaderBottom testName={testInfo ? testInfo.testName : ""} />

            {
                userCode === testInfo?.userCode

                    ?

                    <div className={styles.container}>
                        <div className={styles.containerLeft}>
                            <div className={tab === 1 ? styles.tabSelected : styles.tabNotSelected} onClick={() => { setTab(1); }} >
                                응시 코드
                            </div>

                            <div className={tab === 2 ? styles.tabSelected : styles.tabNotSelected} onClick={() => { setTab(2); }} >
                                시험 설정
                            </div>

                            <div className={tab === 3 ? styles.tabSelected : styles.tabNotSelected} onClick={() => { setTab(3); }} >
                                문제 관리
                            </div>

                            <div className={tab === 4 ? styles.tabSelected : styles.tabNotSelected} onClick={() => { setTab(4); }} >
                                답안지 확인
                            </div>
                        </div>

                        <div className={styles.containerRight}>
                            {tab === 1 && <div>응시 코드</div>}
                            {tab === 2 && <div>시험 설정</div>}
                            {tab === 3 && <QuestionTab />}
                            {tab === 4 && <div>답안지 확인</div>}
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