import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { dbService } from "../../FirebaseModules";
import { collection, onSnapshot, query, where } from "firebase/firestore";

import SubmitButton from "../../theme/SubmitButton";

import styles from "./CheckTestCode.module.css";


export default function CheckTestCode() {
    const navigate = useNavigate()

    const [shortCode, setShortCode] = useState<string>("");

    const [userCode, setUserCode] = useState<any>(undefined);
    const [testCode, setTestCode] = useState<any>(undefined);
    const [message, setMessage] = useState<string>("");



    function findUserCode() {
        onSnapshot(query(collection(dbService, "users"), where("shortUserCode", "==", shortCode.substring(0, 4))), (snapshot) => {
            setUserCode(snapshot.docs.map((current) => (current.id))[0]);
        })
    }

    function findTestCode() {
        if (userCode) {
            onSnapshot(query(collection(dbService, "users", userCode, "tests"), where("shortTestCode", "==", shortCode.substring(4, 8))), (snapshot) => {
                setTestCode(snapshot.docs.map((current) => (current.id))[0]);
            })
        }

        else {
            setMessage("유효하지 않은 시험 코드입니다.");
        }
    }



    useEffect(() => {
        if (shortCode.length === 4) {
            findUserCode();
        }

        if (userCode && testCode) {
            navigate(`/apply/manager/${userCode}/test/${testCode}`);
        }
    }, [shortCode, userCode, testCode])



    return (
        <div className={styles.background}>
            <div className={styles.container}>
                <div className={styles.header}>
                    안녕하세요.<br />
                    <span style={{ fontWeight: "700", color: "rgb(0, 100, 250)" }}>8자리 시험 코드</span>를<br />
                    입력해주세요.
                </div>

                <input
                    type="text"
                    value={shortCode}
                    className={styles.inputBox}
                    maxLength={8}
                    spellCheck={false}
                    onChange={(event: any) => {
                        setShortCode(String(event.target.value).toUpperCase());
                    }}
                />

                <div className={styles.message}>
                    {message}
                </div>

                <SubmitButton
                    text="응시 코드 확인"
                    onClick={findTestCode}
                    disabled={shortCode.length !== 8}
                />
            </div>
        </div>
    )
}