import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { dbService } from "../../FirebaseModules";
import { collection, onSnapshot, query, where } from "firebase/firestore";

import SubmitButton from "../../theme/SubmitButton";

import styles from "./CheckApplicantCode.module.css";



export default function CheckApplicantCode() {
    const { userCode, testCode }: any = useParams();
    const navigate = useNavigate();

    const [shortCode, setShortCode] = useState<string>("");

    const [results, setResults] = useState<any>(undefined);
    const [message, setMessage] = useState<string>("");



    function findApplicantCode(event: any) {
        event?.preventDefault()

        onSnapshot(query(collection(dbService, "users", userCode, "tests", testCode, "applicants"), where("shortApplicantCode", "==", shortCode)), (snapshot) => {
            setResults(snapshot.docs.map((current) => (
                current.id
            )));
        })
    }



    useEffect(() => {
        if (results) {
            if (results.length > 0) {
                navigate("applicant/" + results);
            }

            else {
                setMessage("유효하지 않은 응시자 코드입니다.");
            }
        }
    }, [results])



    return (
        <div className={styles.background}>
            <div className={styles.container}>
            <div className={styles.header}>
                    이번에는<br />
                    <span style={{ fontWeight: "700", color: "rgb(0, 100, 250)" }}>6자리 응시자 코드</span>를<br />
                    입력해주세요.
                </div>

                <input
                    type="text"
                    value={shortCode}
                    className={styles.inputBox}
                    maxLength={6}
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
                    onClick={findApplicantCode}
                    disabled={shortCode.length !== 6}
                />
            </div>
        </div>
    )
}