import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { dbService } from "../../FirebaseModules";
import { doc, setDoc, collection } from "firebase/firestore";
import { onSnapshot, query, where } from "firebase/firestore";

import GenerateApplyCode from "../hooks/GenerateApplyCode";
import GetUserInfo from "../hooks/GetUserInfo";

import { toast } from "react-toastify";

import styles from "./Dashboard.module.css";




export default function Dashboard({ userCode, email }: {
    userCode: string,
    email: string
}) {
    // 사용자 정보
    var userInfo = GetUserInfo(userCode);

    

    // 사용자 등록
    const [userName, setUserName] = useState<string>("");

    async function addUser(event: any) {
        event.preventDefault();

        try {
            await setDoc(doc(dbService, "users", userCode), {
                userCode: userCode,
                userName: userName,
                email: email
            })

            toast.success("사용자 등록이 완료되었습니다.");
        }

        catch (error) {
            console.log(error);
            toast.error("사용자 등록에 실패했습니다.");
        }
    }



    // 시험 목록 조회
    const [testList, setTestList] = useState<any>([]);

    useEffect(() => {
        onSnapshot(query(collection(dbService, "tests"), where("userCode", "==", userCode)), (snapshot) => {
            setTestList(snapshot.docs.map((current) => ({
                testCode: current.id,
                ...current.data()
            })));
        });
    }, [])



    const [isAddingTest, setIsAddingTest] = useState<boolean>(false);

    const [testName, setTestName] = useState<string>("");
    const [startDate, setStartDate] = useState<any>(new Date().toLocaleDateString("sv-SE") + "T" + new Date().toLocaleTimeString("en-US", { hour12: false }));
    const [duration, setDuration] = useState<number>(60);

    const applyCode = GenerateApplyCode();



    // 시험 추가
    async function addTest(event: any) {
        event.preventDefault();

        try {
            await setDoc(doc(collection(dbService, "tests")), {
                userCode: userCode,
                userName: userName,
                testName: testName,
                startDate: Date.parse(startDate),
                duration: duration,
                createdTime: Date.now(),
                applyCode: applyCode
            })

            toast.success("시험 추가가 완료되었습니다.");

            setTestName("");
            setStartDate(new Date().toLocaleDateString("sv-SE") + "T" + new Date().toLocaleTimeString("en-US", { hour12: false }));
            setDuration(60);

            setIsAddingTest(false);
        }

        catch (error) {
            console.log(error);
            toast.error("시험 추가에 실패했습니다.");
        }
    }



    return (
        <div className={styles.container}>
            {
                // 사용자 등록 화면
                userInfo === undefined

                    ?

                    <form onSubmit={addUser}>
                        사용자 이름 <input type="textbox" value={userName} onChange={(event) => { setUserName(event.target.value); }} required />

                        <input type="submit" value="등록하기" />
                    </form>

                    :

                    <div>
                        {
                            isAddingTest

                                ?

                                <form onSubmit={addTest}>
                                    <div className={styles.testHeader}>
                                        시험 이름
                                    </div>
                                    <input
                                        type="textbox"
                                        value={testName}
                                        onChange={(event) => {
                                            setTestName(event.target.value);
                                        }}
                                        className={styles.testInputBox}
                                        required
                                    />
                                    <br />


                                    <div className={styles.testHeader}>
                                        시작 일시
                                    </div>
                                    <input
                                        type="datetime-local"
                                        value={startDate}
                                        onChange={(event) => {
                                            setStartDate(event.target.value);
                                        }}
                                        className={styles.testInputBox}
                                        required
                                    />
                                    <br />

                                    <div className={styles.testHeader}>
                                        응시 시간
                                    </div>
                                    <input
                                        type="number"
                                        value={duration}
                                        onChange={(event) => {
                                            setDuration(Number(event.target.value));
                                        }}
                                        className={styles.testInputBox}
                                        required
                                    />
                                    <br />

                                    <div className={styles.testHeader}>
                                        종료 일시
                                    </div>
                                    <div className={styles.testFixedBox}>
                                        {new Date(Date.parse(startDate) + duration * 60000).toLocaleString()}
                                    </div>
                                    <br />

                                    <input type="submit" value="추가" className={styles.submitButton} />

                                    <button
                                        className={styles.cancelButton}
                                        onClick={() => {
                                            setTestName("");
                                            setDuration(60);
                                            setIsAddingTest(false);
                                        }}
                                    >
                                        취소
                                    </button>
                                </form>

                                :

                                <div>
                                    {
                                        testList.map((current: any) => (
                                            <Link to={"/test/" + current.testCode} style={{ textDecoration: "none" }}>
                                                <div className={styles.button}>
                                                    <div className={styles.name}>
                                                        {current.testName}
                                                    </div>

                                                    <div>
                                                        <div className={styles.date}>
                                                            {new Date(current.startDate).toLocaleDateString("ko-KR")}
                                                        </div>

                                                        <div className={styles.time}>
                                                            {new Date(current.startDate).toLocaleTimeString("ko-KR")}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    }

                                    <button onClick={() => { setIsAddingTest(true); }} className={styles.addButton}>
                                        시험 추가
                                    </button>
                                </div>
                        }

                    </div>
            }
        </div>
    )
}