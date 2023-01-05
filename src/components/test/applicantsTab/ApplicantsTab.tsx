import { useEffect, useState } from "react";

import { dbService } from "../../../FirebaseModules";
import { doc, setDoc, collection, orderBy, onSnapshot, query } from "firebase/firestore";



export default function ApplicantsTab({ testInfo, testCode }: { testInfo: any, testCode: string | undefined }) {
    // 응시자 목록
    const [applicantsList, setApplicantsList] = useState<any>([]);

    const [isAddingApplicant, setIsAddingApplicant] = useState<boolean>(false);
    const [applicantName, setApplicantName] = useState<string>("");


    
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



    var answerSheet: string[] = new Array(100).fill(null);

    async function addApplicants(event: any) {
        event.preventDefault();

        if (testCode) {
            try {
                await setDoc(doc(collection(dbService, "tests", testCode, "applicants")), {
                    applicantName: applicantName,
                    createdTime: Date.now(),
                    submittedTime: Date.now(),
                    answerSheet: answerSheet
                })

                alert("응시자가 추가됐습니다.");

                setApplicantName("");
                setIsAddingApplicant(false);
            }

            catch (error) {
                alert("응시자 추가에 실패했습니다.");
            }
        }
    }



    return (
        <div>
            <button onClick={() => { setIsAddingApplicant(true); }}>
                응시자 추가
            </button>

            {
                isAddingApplicant

                &&

                <form onSubmit={addApplicants}>
                    <input type="text" value={applicantName} required onChange={(event: any) => { setApplicantName(event.target.value); }} />

                    <input type="submit" value="추가" />

                    <input type="button" value="취소" onClick={() => {
                        setApplicantName("");
                        setIsAddingApplicant(false);
                    }} />
                </form>
            }

            {
                applicantsList.map((current: any) => (
                    <div>
                        {current.applicantCode} &nbsp;
                        {current.applicantName}

                        <button onClick={() => {
                            try {
                                navigator.clipboard.writeText("localhost:3000/apply/" + testCode + "/applicant/" + current.applicantCode);
                                alert("응시 코드가 복사되었습니다.");
                            }

                            catch (error) {
                                alert("응시 코드 복사에 실패하였습니다.")
                            }
                        }}>
                            복사하기
                        </button>
                    </div>
                ))
            }
        </div>
    )
}