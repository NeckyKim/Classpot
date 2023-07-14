import Title from "../../../style/Title";

import styles from "./Dashboard.module.css";



export default function DashboardTab({ userInfo, testInfo }: { userInfo: any, testInfo: any }) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <Title>
                    시험 진행 상황
                </Title>

                <Title>
                    응시자 안내 가이드
                </Title>

                <div className={styles.guideWrapper}>
                    <div className={styles.guideContainer}>
                        <div className={styles.guideLabel}>
                            시험 코드 8자리 & 응시자 코드 6자리
                        </div>

                        <div className={styles.guideGraphics}>
                            <img src={process.env.PUBLIC_URL + "/icons/dashboard/guide11.svg"} />

                            <img src={process.env.PUBLIC_URL + "/icons/dashboard/guide12.svg"} />

                            <img src={process.env.PUBLIC_URL + "/icons/dashboard/guide13.svg"} />
                        </div>

                        <ol>
                            <li>응시자 전원에게 시험 코드 8자리를 안내합니다.</li>
                            <li>응시자마다 개인의 고유 응시자 코드 6자리를 안내합니다.</li>
                            <li>응시자는 시험 코드 8자리와 응시자 코드 6자리를 입력하여 시험장에 입실할 수 있습니다.</li>
                        </ol>
                    </div>

                    <div className={styles.guideContainer}>
                        <div className={styles.guideLabel}>
                            접속 링크
                        </div>

                        <div className={styles.guideGraphics}>
                            <img src={process.env.PUBLIC_URL + "/icons/dashboard/guide21.svg"} />

                            <img src={process.env.PUBLIC_URL + "/icons/dashboard/guide22.svg"} />
                        </div>

                        <ol>
                            <li>응시자마다 개인의 시험장 접속 URL을 안내합니다.</li>
                            <li>응시자는 시험장 접속 URL을 통하여 시험장에 입실할 수 있습니다.</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    )
}