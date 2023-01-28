import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { dbService } from "../../FirebaseModules";
import { collection, onSnapshot, query, where } from "firebase/firestore";

import styles from "./CheckTestCode.module.css";



export default function CheckTestCode() {
    const navigate = useNavigate()

    const [applyCode, setApplyCode] = useState<string>("");
    const [results, setResults] = useState<any>(undefined);
    const [message, setMessage] = useState<string>("");



    function applyCodeToTestCode(event: any) {
        event?.preventDefault()

        onSnapshot(query(collection(dbService, "tests"), where("applyCode", "==", applyCode)), (snapshot) => {
            setResults(snapshot.docs.map((current) => (
                current.id
            )));
        })
    }



    useEffect(() => {
        if (results) {
            if (results.length > 0) {
                navigate("/apply/" + results);
            }

            else {
                setMessage("유효하지 않은 시험 코드입니다.");
            }
        }
    }, [results])



    return (
        <div>
            <form
                className={styles.homeContainer}
                onSubmit={applyCodeToTestCode}
            >
                <div className={styles.header}>
                    5자리 시험 코드를 입력하세요.
                </div>

                <input
                    type="text"
                    value={applyCode}
                    className={styles.inputBox}
                    maxLength={5}
                    spellCheck={false}
                    onChange={(event: any) => {
                        setApplyCode(String(event.target.value).toUpperCase());
                    }}
                />

                <div className={styles.message}>
                    {message}
                </div>

                <input
                    type="submit"
                    value="시험 코드 확인"
                    className={styles.goToTestButton}
                    disabled={applyCode.length !== 5}
                />
            </form>
        </div>
    )
}