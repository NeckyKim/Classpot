import { useState, useEffect } from "react";

import { dbService } from "../../../FirebaseModules";
import { doc, updateDoc } from "firebase/firestore";

import GetApplicantList from "../../hooks/GetApplicantList";
import GetTestInfo from "../../hooks/GetTestInfo";
import TimeCalculator from "../../hooks/TimeCalculator";

import Modal from "../../../style/Modal";
import Title from "../../../style/Title";
import Label from "../../../style/Label";

import AgoraRTC from "agora-rtc-sdk-ng";
import { createAgoraClient } from "../../../AgoraModules"

import styles from "./MonitoringTab.module.css";



AgoraRTC.setLogLevel(4);

let agoraCommandQueue = Promise.resolve();



export default function MonitoringTab({ userCode, testCode }: { userCode: string | undefined, testCode: string | undefined }) {
    var testInfo = GetTestInfo(userCode, testCode);
    var applicantList = GetApplicantList(userCode, testCode);
    var isTestTime = TimeCalculator(testInfo.startDate, testInfo.duration);

    const [applicantIndex, setApplicantIndex] = useState<number>(-1);
    const [showLog, setShowLog] = useState<boolean>(false);



    async function pauseTest(applicantCode: string, pause: boolean) {
        if (userCode && testCode && applicantCode) {
            try {
                await updateDoc(doc(dbService, "users", userCode, "tests", testCode, "applicants", applicantCode), {
                    pause: !pause
                })
            }

            catch (error) {
                console.log(error);
            }
        }
    }



    const [userList, setUserList] = useState<any>([]);
    const [uid, setUid] = useState<any>(null);


            
    // useEffect(() => {
    //     function onVideoTrack(user: any) {
    //         setUserList((prev: any) => [...prev, user]);
    //     };
        
    //     const { connect } = createAgoraClient({ onVideoTrack });


    //     async function setup() {
    //         const { tracks, uid } = await connect();

    //         setUid(uid);
    //         setUserList(tracks);
    //     }

    //     agoraCommandQueue = agoraCommandQueue.then(setup);
    // }, [])



    return (
        <div className={styles.container}>
            <Title>
                모니터링
            </Title>

            

            {
                applicantList.length > 0

                    ?

                    <div className={styles.applicantContainer}>
                        {applicantList.map((elem: any, index: number) => (
                            <div className={styles.applicantElements}>
                                <div className={styles.applicantInfo}>
                                    <div className={styles.applicantName}>
                                        {elem.applicantName}
                                    </div>

                                    {
                                        !elem.finished

                                            ?

                                            (
                                                elem.submitted !== 0

                                                    ?

                                                    <div className={styles.statusRunning}>
                                                        진행중
                                                    </div>

                                                    :

                                                    <div className={styles.statusBefore}>
                                                        이전
                                                    </div>
                                            )

                                            :

                                            <div className={styles.statusFinished}>
                                                완료
                                            </div>
                                    }
                                </div>



                                <div>
                                    <div className={styles.infoLabel}>
                                        제출 시간
                                    </div>

                                    <div className={styles.infoValue}>
                                        {elem.submitted ? new Date(elem.submitted).toLocaleString() : "---"}
                                    </div>
                                </div>



                                <div>
                                    <div className={styles.infoLabel}>
                                        점수
                                    </div>

                                    <div className={styles.infoValue}>
                                        0점
                                    </div>
                                </div>



                                <div className={styles.controlButton}>
                                    <div
                                        className={styles.logButton}
                                        onClick={() => {
                                            setApplicantIndex(index);
                                            setShowLog(true);
                                        }}
                                    >
                                        행동 로그
                                    </div>

                                    <div
                                        className={elem.pause ? styles.pauseButtonPaused : styles.pauseButtonNormal}
                                        onClick={() => {
                                            if (elem.pause) {
                                                if (confirm("일시 정지를 해제하시겠습니까?")) {
                                                    pauseTest(elem.applicantCode, elem.pause);
                                                }
                                            }

                                            else {
                                                if (confirm(`${elem.applicantName} 응시자를 일시 정지 하시겠습니까?`)) {
                                                    pauseTest(elem.applicantCode, elem.pause);
                                                }
                                            }
                                        }}
                                    >
                                        {elem.pause ? "일시 정지 해제" : "일시 정지"}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    :

                    <div>
                        없음
                    </div>
            }

            {
                showLog

                &&

                <Modal title="시험 행동 로그" onClose={() => setShowLog(false)}>
                    <Label>
                        응시자 이름
                    </Label>
                    
                    <div className={styles.logApplicantName}>
                        {applicantList[applicantIndex]?.applicantName}
                    </div>

                    {Object.values(applicantList[applicantIndex]?.log).map((elem: any, index: number) => (
                        <div className={styles.logElements}>
                            <div className={styles.logLabel} />

                            <div className={styles.logTime}>
                                {new Date(elem.time).toLocaleTimeString()}
                            </div>

                            <div className={styles.logAction}>
                                {elem.action}
                            </div>

                            {applicantList[applicantIndex]?.log.length - 1 !== index && <div className={styles.logLine} />}
                        </div>
                    ))}
                </Modal>
            }
        </div>
    )
}