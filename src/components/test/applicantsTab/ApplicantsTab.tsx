import { useEffect, useState } from "react";

import { dbService } from "../../../FirebaseModules";
import { doc, setDoc, collection, orderBy, onSnapshot, query } from "firebase/firestore";

import GenerateApplicantCode from "../../hooks/GenerateApplicantCode";



export default function ApplicantsTab({ testInfo, testCode }: { testInfo: any, testCode: string | undefined }) {
    const [applicantCode, setApplicantCode] = useState<string>(GenerateApplicantCode(testCode));



    // 응시자 목록
    const [applicantsList, setApplicantsList] = useState<any>([]);

    if (testCode) {
        useEffect(() => {
            onSnapshot(query(collection(dbService, "tests", testCode, "applicants"), orderBy("createdTime")), (snapshot) => {
                setApplicantsList(snapshot.docs.map((current) => ({
                    applicantCode: current.id,
                    ...current.data()
                })));
            });
        }, [])
    }



    async function addApplicants(event: any) {
        event.preventDefault();

        if (testCode) {
            try {
                await setDoc(doc(collection(dbService, "tests", testCode, "applicants")), {
                    userName: "",
                    createdTime: Date.now()
                })

                alert("응시자가 추가됐습니다.");
            }

            catch (error) {
                alert("응시자 추가에 실패했습니다.");
            }
        }
    }



    return (
        <div>
            <button onClick={addApplicants}>
                응시자 추가
            </button>

            {
                applicantsList.map((current: any) => (
                    <div>
                        {current.applicantCode}
                    </div>
                ))
            }
        </div>
    )
}