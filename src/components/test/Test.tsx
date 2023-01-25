import { useState } from "react";
import { useParams } from "react-router";

import QuestionTab from "./questionTab/QuestionTab";
import SettingsTab from "./settingsTab/SettingsTab";
import ApplicantsTab from "./applicantsTab/ApplicantsTab";
import AnswerSheetTab from "./answerSheetTab/AnswerSheetTab";

import Error from "../../Error";
import GetTestInfo from "../hooks/GetTestInfo";
import HeaderBottom from "../header/HeaderBottom";

import styles from "./Test.module.css";




export default function Test({ userCode, email }: { userCode: string; email: string; }) {
    const { testCode } = useParams();



    // 시험 정보
    var testInfo: any | undefined = GetTestInfo(testCode);

    var [tab, setTab] = useState<number>(1)



    return (
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
                            응시자 관리
                        </div>

                        <div className={tab === 4 ? styles.tabSelected : styles.tabNotSelected} onClick={() => { setTab(4); }} >
                            답안지 확인
                        </div>
                    </div>

                    <div className={styles.containerRight}>
                        {tab === 1 && <SettingsTab testCode={testCode} />}
                        {tab === 2 && <QuestionTab userCode={userCode} testCode={testCode} />}
                        {tab === 3 && <ApplicantsTab testCode={testCode} />}
                        {tab === 4 && <AnswerSheetTab testCode={testCode} />}
                    </div>
                </div>
            </div>

            :

            <Error message="접근 권한이 없습니다." />
    )
}