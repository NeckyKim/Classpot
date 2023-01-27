import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { dbService } from "../../FirebaseModules";
import { collection, onSnapshot, query, where } from "firebase/firestore";

import GetTestInfo from "../hooks/GetTestInfo";

import styles from "./CheckApplicantCode.module.css";



export default function CheckApplicantCode() {
    const { testCode }: any = useParams();

    const navigate = useNavigate()

    var testInfo: any | undefined = GetTestInfo(testCode);

    const [magicCode, setMagicCode] = useState<string>("");
    const [results, setResults] = useState<any>(undefined);
    const [message, setMessage] = useState<string>("");



    function applyCodeToApplicantCode(event: any) {
        event?.preventDefault()

        onSnapshot(query(collection(dbService, "tests", testCode, "applicants"), where("magicCode", "==", magicCode)), (snapshot) => {
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
        <div>
            <form
                className={styles.homeContainer}
                onSubmit={applyCodeToApplicantCode}
            >
                <div className={styles.header}>
                    5자리 응시자 코드를 입력하세요.
                </div>

                <input
                    type="text"
                    value={magicCode}
                    className={styles.inputBox}
                    maxLength={5}
                    onChange={(event: any) => {
                        setMagicCode(String(event.target.value).toUpperCase());
                    }}
                />

                <div className={styles.message}>
                    {message}
                </div>

                <input
                    type="submit"
                    value="응시자 코드 확인"
                    className={styles.goToTestButton}
                    disabled={magicCode.length !== 5}
                />
            </form>
        </div>
    )
}