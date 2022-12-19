import { useEffect, useState } from "react";

import { dbService } from "../../../FirebaseModules";
import { doc, updateDoc, collection } from "firebase/firestore";
import { onSnapshot, query, where } from "firebase/firestore";

import styles from "./EditTestSettings.module.css"


export default function EditTestSettings({ setIsEditingSettings, testInfo, testCode }: {
    setIsEditingSettings: any;
    testInfo: any;
    testCode: string | undefined;
}) {
    const [testName, setTestName] = useState<string>(testInfo.testName);
    const [startDate, setStartDate] = useState<any>(new Date(testInfo.startDate).toLocaleDateString("sv-SE") + "T" + new Date(testInfo.startDate).toLocaleTimeString("en-US", { hour12: false }));
    const [duration, setDuration] = useState<number>(testInfo.duration);



    // 시험 설정 변경
    async function editTestSettings(event: any) {
        event.preventDefault();

        if (testCode) {
            try {
                await updateDoc(doc(dbService, "tests", testCode), {
                    testName: testName,
                    startDate: Date.parse(startDate),
                    duration: duration
                })
    
                alert("시험 설정 변경이 완료되었습니다.");
    
                setIsEditingSettings(false);
            }
    
            catch (error) {
                console.log(error);
    
                alert("시험 설정 변경에 실패했습니다.");
            }
        }
    }



    return (
        <div className={styles.background}>
        <form onSubmit={editTestSettings} className={styles.editContainer}>
            <div className={styles.editHeader}>
                시험 이름
            </div>
            <input
                type="textbox"
                value={testName}
                onChange={(event) => {
                    setTestName(event.target.value);
                }}
                className={styles.editInputBox}
                required
            />
            <br />


            <div className={styles.editHeader}>
                시작 일시
            </div>
            <input
                type="datetime-local"
                value={startDate}
                onChange={(event) => {
                    setStartDate(event.target.value);
                }}
                className={styles.editInputBox}
                required
            />
            <br />

            <div className={styles.editHeader}>
                응시 시간
            </div>
            <input
                type="number"
                value={duration}
                onChange={(event) => {
                    setDuration(Number(event.target.value));
                }}
                className={styles.editInputBox}
                required
            />
            <br />

            <div className={styles.editHeader}>
                종료 일시
            </div>
            <div className={styles.editFixedBox}>
                {new Date(Date.parse(startDate) + duration * 60000).toLocaleString()}
            </div>
            <br />

            <input type="submit" value="변경" className={styles.submitButton} />

            <button
                className={styles.cancelButton}
                onClick={() => {
                    setTestName("");
                    setDuration(60);
                    setIsEditingSettings(false);
                }}
            >
                취소
            </button>
        </form>
        </div>
    )
}