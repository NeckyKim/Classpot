import { useState } from "react";

import { dbService } from "../../../FirebaseModules";
import { doc, deleteDoc, collection, orderBy, onSnapshot, query } from "firebase/firestore";

import styles from "./TestSettings.module.css";



export default function TestSettingsTab({ testInfo, testCode }: { testInfo: any, testCode: any }) {
    const [isEditingSettings, setIsEditingSettings] = useState<boolean>(false);

    return (
        <div>
            {
                isEditingSettings

                    ?

                    <div>
                    </div>

                    :

                    <div>
                        <div className={styles.header}>
                            응시 코드
                        </div>

                        <div className={styles.applyCodeContainer}>
                            <div className={styles.applyCode}>
                                {testInfo.applyCode}
                            </div>

                            <div className={styles.applyCodeText}>
                                위의 코드를 응시자들에게 알려주세요.
                            </div>
                        </div>

                        <div className={styles.header}>
                            시간 설정
                        </div>

                        <div className={styles.testDateContainer}>
                            <div>
                                <div>
                                    시작 일시
                                </div>

                                <div>
                                    {new Date(testInfo.startDate).toLocaleString("ko-KR")}
                                </div>
                            </div>

                            <div>
                                <div>
                                    응시 시간
                                </div>

                                <div>
                                    {testInfo.duration}분
                                </div>
                            </div>
                            

                            <div>
                                <div>
                                    종료 일시
                                </div>

                                <div>
                                {new Date(testInfo.startDate + testInfo.duration * 60000).toLocaleString("ko-KR")}
                                </div>
                            </div>
                        </div>
                    </div>
            }

        </div>
    )
}