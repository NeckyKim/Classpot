import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { dbService } from "../../FirebaseModules";
import { collection, onSnapshot, query, where } from "firebase/firestore";

import GetTestInfo from "../hooks/GetTestInfo";

import Error from "../../Error";




export default function Apply() {
    const { testCode }: any = useParams();

    var navigate = useNavigate();

    // 시험 정보
    var testInfo: any | undefined = GetTestInfo(testCode);



    const [magicCode, setMagicCode] = useState<string>("");
    const [results, setResults] = useState<any>(undefined);



    function applyCodeToApplicantCode() {
        onSnapshot(query(collection(dbService, "tests", testCode, "applicants"), where("magicCode", "==", magicCode)), (snapshot) => {
            setResults(snapshot.docs.map((current) => (
                current.id
            )));
        })
    }



    useEffect(() => {
        if (results) {
            navigate("applicant/" + results);
        }
    }, [results])




    return (
        testInfo

            ?

            <div>
                시험 이름: {testInfo.testName}<br />

                <input
                    type="text"
                    value={magicCode}
                    maxLength={5}
                    onChange={(event: any) => {
                        setMagicCode(String(event.target.value).toUpperCase());
                    }} />

                <button
                    disabled={magicCode.length !== 5}
                    onClick={() => {
                        applyCodeToApplicantCode();
                    }}
                >
                    시험 응시
                </button>
            </div>

            :

            <Error message="유효하지 않은 응시 코드 입니다." />
    )
}