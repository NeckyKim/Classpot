import { useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";

import { authService } from "../../FirebaseModules";

import QuestionTab from "./questionTab/QuestionTab";
import SettingsTab from "./settingsTab/SettingsTab";
import ApplicantsTab from "./applicantsTab/ApplicantsTab";
import SuperviseTab from "./superviseTab/SuperviseTab";

import Error from "../../Error";
import GetTestInfo from "../hooks/GetTestInfo";

import styles from "./Test.module.css";



export default function Test({ userCode, email }: { userCode: string; email: string; }) {
    const { testCode } = useParams();

    var navigate = useNavigate();



    // 시험 정보
    var testInfo: any | undefined = GetTestInfo(testCode);

    var [tab, setTab] = useState<number>(1)



    return (
        userCode === testInfo?.userCode

            ?

            <div>
                <div className={styles.containerLeftTop}>
                    <img className={styles.containerLogo} src={process.env.PUBLIC_URL + "/logos/logo_white.png"} onClick={() => { navigate("/") }} />
                </div>

                <div className={styles.containerRightTop}>
                    {testInfo.testName}

                    <div
                        className={styles.logoutButton}
                        onClick={() => {
                            authService.signOut();
                            navigate("/");
                        }}
                    >
                        로그아웃
                    </div>
                </div>

                <div className={styles.containerLeftBottom}>
                    <div className={tab === 1 ? styles.tabSelected : styles.tabNotSelected} onClick={() => { setTab(1); }} >
                        <img className={tab === 1 ? styles.tabIconSelected : styles.tabIconNotSelected} src={process.env.PUBLIC_URL + "/icons/settings.png"} />

                        <div className={tab === 1 ? styles.tabTextSelected : styles.tabTextNotSelected}>
                            시험 설정
                        </div>
                    </div>

                    <div className={tab === 2 ? styles.tabSelected : styles.tabNotSelected} onClick={() => { setTab(2); }} >
                        <img className={tab === 2 ? styles.tabIconSelected : styles.tabIconNotSelected} src={process.env.PUBLIC_URL + "/icons/questions.png"} />

                        <div className={tab === 2 ? styles.tabTextSelected : styles.tabTextNotSelected}>
                            문제 관리
                        </div>
                    </div>

                    <div className={tab === 3 ? styles.tabSelected : styles.tabNotSelected} onClick={() => { setTab(3); }} >
                        <img className={tab === 3 ? styles.tabIconSelected : styles.tabIconNotSelected} src={process.env.PUBLIC_URL + "/icons/applicants.png"} />

                        <div className={tab === 3 ? styles.tabTextSelected : styles.tabTextNotSelected}>
                            응시자 관리
                        </div>
                    </div>

                    <div className={tab === 4 ? styles.tabSelected : styles.tabNotSelected} onClick={() => { setTab(4); }} >
                        <img className={tab === 4 ? styles.tabIconSelected : styles.tabIconNotSelected} src={process.env.PUBLIC_URL + "/icons/supervisor.png"} />

                        <div className={tab === 4 ? styles.tabTextSelected : styles.tabTextNotSelected}>
                            시험 진행
                        </div>
                    </div>
                </div>

                <div className={styles.containerRightBottom}>
                    {tab === 1 && <SettingsTab testCode={testCode} />}
                    {tab === 2 && <QuestionTab userCode={userCode} testCode={testCode} />}
                    {tab === 3 && <ApplicantsTab testCode={testCode} />}
                    {tab === 4 && <SuperviseTab testCode={testCode} />}
                </div>
            </div>

            :

            <Error message="접근 권한이 없습니다." />
    )
}