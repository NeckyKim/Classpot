import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { dbService } from "../../FirebaseModules";
import { collection, onSnapshot, query, where } from "firebase/firestore";

import styles from "./Home.module.css";



export default function Home() {
    const navigate = useNavigate()

    const [applyCode, setApplyCode] = useState<string>("");
    const [results, setResults] = useState<any>(undefined);



    function applyCodeToTestCode() {
        onSnapshot(query(collection(dbService, "tests"), where("applyCode", "==", applyCode)), (snapshot) => {
            setResults(snapshot.docs.map((current) => (
                current.id
            )));
        })
    }



    useEffect(() => {
        if (results) {
            navigate("/apply/" + results);
        }
    }, [results])



    return (
        <div className={styles.homeContainer}>
            <div className={styles.intro}>
                5자리 응시 코드를 입력하세요.
            </div>

            <input
                type="text"
                value={applyCode}
                className={styles.applyCodeInputBox}
                maxLength={5}
                onChange={(event: any) => {
                    setApplyCode(String(event.target.value).toUpperCase());
                }}
            />

            <button
                className={styles.applyButton}
                disabled={applyCode.length !== 5}
                onClick={() => {
                    applyCodeToTestCode();
                }}
            >
                시험 응시
            </button>
        </div>
    )
}


