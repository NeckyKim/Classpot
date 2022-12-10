import { useState } from "react";
import { useParams } from "react-router";

import QuestionTab from "./questionTab/QuestionTab";

import GetTestInfo from "../hooks/GetTestInfo";
import HeaderBottom from "../header/HeaderBottom";

import styles from "./Test.module.css";
import TestSettingsTab from "./testSettingsTab/TestSettingsTab";



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



    return (
        <div>
            {
                userCode === testInfo?.userCode

                    ?

                    <div>
                        <HeaderBottom testName={testInfo ? testInfo.testName : ""} />

                        <div className={styles.container}>
                            <div className={styles.containerLeft}>
                                <div className={tab === 1 ? styles.tabSelected : styles.tabNotSelected} onClick={() => { setTab(1); }} >
                                    시험 설정
                                </div>

                                <div className={tab === 2 ? styles.tabSelected : styles.tabNotSelected} onClick={() => { setTab(2); }} >
                                    문제 관리
                                </div>

                                <div className={tab === 3 ? styles.tabSelected : styles.tabNotSelected} onClick={() => { setTab(3); }} >
                                    답안지 확인
                                </div>
                            </div>

                            <div className={styles.containerRight}>
                                {tab === 1 && <TestSettingsTab testInfo={testInfo} testCode={testCode}/>}
                                {tab === 2 && <QuestionTab testInfo={testInfo} testCode={testCode}/>}
                                {tab === 3 && <div>답안지 확인</div>}
                            </div>
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