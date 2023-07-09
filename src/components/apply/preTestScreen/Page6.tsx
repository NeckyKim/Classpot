import { useState, useEffect, useRef } from 'react';
import AgoraRTC from "agora-rtc-sdk-ng";
import { createAgoraClient } from "../../../AgoraModules"

import TimeCalculator from "../../hooks/TimeCalculator";

import Buttons from "../../../theme/Buttons";

import styles from "./Page6.module.css";



AgoraRTC.setLogLevel(4);

let agoraCommandQueue = Promise.resolve();



export default function Page6({ questionList, testInfo, setIsApplyingTest }: { questionList: any, testInfo: any, setIsApplyingTest: any }) {
    var isTestTime = TimeCalculator(testInfo.startDate, testInfo.duration);



    return (
        <div>
            <div className={styles.comment}>
                {
                    isTestTime.isTime === "before"

                        ?

                        <>
                            시험 준비가 모두 <span style={{ fontWeight: "700", color: "rgb(0, 100, 250)" }}>완료</span>되었습니다.<br />
                            시작 시간이 되면 <span style={{ fontWeight: "700", color: "rgb(0, 100, 250)" }}>시험 시작 버튼</span>을 눌러 시험을 시작해주세요.
                        </>

                        :

                        <>
                            지금 시험이 <span style={{ fontWeight: "700", color: "rgb(0, 100, 250)" }}>진행 중</span> 입니다.<br />
                            <span style={{ fontWeight: "700", color: "rgb(0, 100, 250)" }}>시험 시작 버튼</span>을 눌러 시험을 시작해주세요.
                        </>
                }
            </div>



            <div className={styles.infoContainer}>
                <div className={styles.infoElements}>
                    <div className={styles.infoLabel}>
                        시작 일시
                    </div>

                    <div className={styles.infoValue}>
                        {new Date(testInfo.startDate).getFullYear()}년&nbsp;
                        {new Date(testInfo.startDate).getMonth() + 1}월&nbsp;
                        {new Date(testInfo.startDate).getDate()}일&nbsp;
                        {String(new Date(testInfo.startDate).getHours()).padStart(2, "0")}:
                        {String(new Date(testInfo.startDate).getMinutes()).padStart(2, "0")}
                    </div>
                </div>

                <div className={styles.infoElements}>
                    <div className={styles.infoLabel}>
                        진행 시간
                    </div>

                    <div className={styles.infoValue}>
                        {testInfo.duration}분
                    </div>
                </div>

                <div className={styles.infoElements}>
                    <div className={styles.infoLabel}>
                        문제 수
                    </div>

                    <div className={styles.infoValue}>
                        총 {questionList.length}문항
                    </div>
                </div>

                <div className={styles.infoElements}>
                    <div className={styles.infoLabel}>
                        총점
                    </div>

                    <div className={styles.infoValue}>
                        총 {questionList.length !== 0 ? (questionList.length > 0 && questionList.map((row: any) => row.points).reduce((sum: number, current: number) => { return sum + current; }, 0)) : 0}점
                    </div>
                </div>

                <div className={styles.infoElements}>
                    <div className={styles.infoLabel}>
                        문제 유형
                    </div>

                    <div className={styles.infoValue}>
                        {new Set(questionList.map((x: any) => x.type + "　"))}
                    </div>
                </div>
            </div>



            <ul className={styles.alertContainer}>
                <li>
                    시험을 시작하면 중간에 멈출 수 없습니다. 주어진 시간 안에 문제를 풀어주세요.
                </li>

                <li>
                    시험 시작 하기 전, 하단의 [응시 환경 체험] 버튼을 눌러 사전에 응시 환경을 점검해주세요. 사전에 응시 환경을 점검하지 않아 본 시험에 발생한 문제는 책임지지 않습니다.
                </li>

                <li>
                    시험 시작 시간이 되면, 하단에 [시험 시작] 버튼을 눌러 시험을 시작할 수 있습니다.
                </li>
            </ul>



            <Buttons>
                {
                    isTestTime.isTime === "before"

                        ?

                        <div className={styles.startButtonDisabled}>
                            {(isTestTime.beforeTime.days > 0) && (String(isTestTime.beforeTime.days) + "일 ")}
                            {(isTestTime.beforeTime.hours > 0) && (String(isTestTime.beforeTime.hours) + "시간 ")}
                            {(isTestTime.beforeTime.minutes > 0) && (String(isTestTime.beforeTime.minutes) + "분 ")}
                            {(isTestTime.beforeTime.seconds > 0) && (String(isTestTime.beforeTime.seconds) + "초 ")}
                            후 시작
                        </div>

                        :

                        <div className={styles.startButtonEnabled} onClick={() => setIsApplyingTest(true)}>
                            시험 시작

                            <div className={styles.startButtonEnabledInside} />
                        </div>
                }
            </Buttons>
        </div>
    )
}