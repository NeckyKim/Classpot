import { useState } from "react";

import { dbService } from "../../../FirebaseModules";
import { doc, setDoc, collection } from "firebase/firestore";

import ApplicantContainer from "./ApplicantContainer";
import GenerateShortApplicantCode from "../../hooks/GenerateShortApplicantCode";
import GetApplicantList from "../../hooks/GetApplicantList";
import Error from "../../../Error";

import { toast } from "react-toastify";

import styles from "./ApplicantsTab.module.css";



export default function ApplicantsTab({ testCode }: { testCode: string | undefined }) {
    // 응시자 목록
    const applicantList: any = GetApplicantList(testCode);

    const [isAddingApplicant, setIsAddingApplicant] = useState<boolean>(false);


    const [applicantName, setApplicantName] = useState<string>("");

    const shortApplicantCode = GenerateShortApplicantCode(testCode);



    var answerSheet: string[] = new Array(100).fill(null);
    var reportCard: string[] = new Array(100).fill(null);



    async function addApplicant(event: any) {
        event.preventDefault()

        if (testCode) {
            try {
                await setDoc(doc(collection(dbService, "tests", testCode, "applicants")), {
                    applicantName: applicantName,
                    createdTime: Date.now(),
                    submittedTime: Date.now(),
                    answerSheet: answerSheet,
                    reportCard: reportCard,
                    autoGrading: true,
                    shortApplicantCode: shortApplicantCode
                })

                toast.success("응시자가 추가됐습니다.");

                setApplicantName("");
                setIsAddingApplicant(false);
            }

            catch (error) {
                toast.error("응시자 추가에 실패했습니다.");
            }
        }
    }



    return (
        <div className={styles.applicantTabContainer}>
            {
                isAddingApplicant

                    ?

                    <form onSubmit={addApplicant}>
                        <div className={styles.addApplicantHeader}>
                            응시자 이름
                        </div>

                        <input
                            type="text"
                            value={applicantName}
                            className={styles.applicantNameInputBox}
                            onChange={(event: any) => { setApplicantName(event.target.value); }}
                            required
                        />

                        <div className={styles.addApplicantButtons}>
                            <input
                                type="submit"
                                value="추가"
                                className={styles.confirmButton}
                            />

                            <input
                                type="button"
                                value="취소"
                                className={styles.cancelButton}
                                onClick={() => {
                                    setApplicantName("");
                                    setIsAddingApplicant(false);
                                }}
                            />
                        </div>
                    </form>

                    :

                    <div>
                        <div
                            className={styles.addApplicantButton}
                            onClick={() => {
                                setIsAddingApplicant(true);
                                setApplicantName("");
                            }}
                        >
                            응시자 추가
                        </div>

                        {
                            applicantList.length > 0

                                ?

                                applicantList.map((current: any) => <ApplicantContainer testCode={testCode} applicantObject={current} />)

                                :

                                <Error message="응시자가 없습니다." />
                        }
                    </div>
            }
        </div>
    )
}