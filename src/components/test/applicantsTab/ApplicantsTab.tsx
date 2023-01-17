import { useState } from "react";

import { dbService } from "../../../FirebaseModules";
import { doc, setDoc, collection } from "firebase/firestore";

import GenerateApplicantCode from "../../hooks/GenerateApplicantCode";
import GetApplicantList from "../../hooks/GetApplicantList";

import { toast } from "react-toastify";

import styles from "./ApplicantsTab.module.css";



export default function ApplicantsTab({ testCode }: { testCode: string | undefined }) {
    // 응시자 목록
    const applicantList: any = GetApplicantList(testCode);

    const [isAddingApplicant, setIsAddingApplicant] = useState<boolean>(false);
    const [applicantName, setApplicantName] = useState<string>("");
    const [applicantEmail, setApplicantEmail] = useState<string>("");

    const magicCode = GenerateApplicantCode(testCode);



    var answerSheet: string[] = new Array(100).fill(null);

    async function addApplicant(event: any) {
        event.preventDefault();

        if (testCode) {
            try {
                await setDoc(doc(collection(dbService, "tests", testCode, "applicants")), {
                    applicantName: applicantName,
                    createdTime: Date.now(),
                    submittedTime: Date.now(),
                    answerSheet: answerSheet,
                    magicCode: magicCode
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
        <div>
            <button className={styles.addApplicantButton} onClick={() => { setIsAddingApplicant(true); }}>
                응시자 추가
            </button>

            {
                isAddingApplicant

                &&

                <div>
                    <form className={styles.addApplicantContainer} onSubmit={addApplicant}>
                        <div>
                            이름
                        </div>

                        <div />

                        <div />

                        <input
                            type="text"
                            value={applicantName}
                            className={styles.addApplicantInputBox}
                            onChange={(event: any) => { setApplicantName(event.target.value); }}
                            required
                        />

                        <input type="submit" value="추가" className={styles.addConfirmButton} />

                        <input
                            type="button"
                            value="취소"
                            className={styles.addCancelButton}
                            onClick={() => {
                                setApplicantName("");
                                setIsAddingApplicant(false);
                            }}
                        />
                    </form>
                </div>
            }

            {
                applicantList.map((current: any) => (
                    <div className={styles.applicantContainer}>
                        <div className={styles.applicantName}>
                            {current.applicantName}
                        </div>

                        <div className={styles.applicantCode}>
                            {current.magicCode}
                        </div>

                        <button
                            className={styles.copyURLButton}
                            onClick={() => {
                                try {
                                    navigator.clipboard.writeText(window.location.origin + "/apply/" + testCode + "/applicant/" + current.applicantCode);
                                    toast.success("응시자 주소가 복사되었습니다.");
                                }

                                catch (error) {
                                    toast.error("응시자 주소 복사에 실패하였습니다.")
                                }
                            }}
                        >
                            응시 URL 복사
                        </button>

                        <button className={styles.editButton}>
                            수정
                        </button>

                        <button className={styles.deleteButton}>
                            삭제
                        </button>
                    </div>
                ))
            }
        </div>
    )
}