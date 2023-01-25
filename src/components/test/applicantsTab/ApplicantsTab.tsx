import { useState } from "react";

import { dbService } from "../../../FirebaseModules";
import { doc, setDoc, updateDoc, deleteDoc, collection } from "firebase/firestore";

import GenerateApplicantCode from "../../hooks/GenerateApplicantCode";
import GetApplicantList from "../../hooks/GetApplicantList";
import Error from "../../../Error";

import { toast } from "react-toastify";

import styles from "./ApplicantsTab.module.css";



export default function ApplicantsTab({ testCode }: { testCode: string | undefined }) {
    // 응시자 목록
    const applicantList: any = GetApplicantList(testCode);

    const [isAddingApplicant, setIsAddingApplicant] = useState<boolean>(false);
    const [isEditingApplicant, setIsEditingApplicant] = useState<boolean>(false);
    const [isDeletingApplicant, setIsDeletingApplicant] = useState<boolean>(false);

    const [applicantName, setApplicantName] = useState<string>("");

    const magicCode = GenerateApplicantCode(testCode);



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



    async function editApplicant(event: any, applicantCode: string) {
        event.preventDefault()

        if (testCode) {
            try {
                await updateDoc(doc(dbService, "tests", testCode, "applicants", applicantCode), {
                    applicantName: applicantName,
                });

                setIsEditingApplicant(false);
                toast.success("응시자 이름이 수정되었습니다.");
            }

            catch (error) {
                console.log(error);
                toast.error("응시자 이름 수정에 실패했습니다.");
            }
        }
    }



    async function deleteApplicant(event: any, applicantCode: string) {
        event.preventDefault()

        if (testCode) {
            try {
                await deleteDoc(doc(dbService, "tests", testCode, "applicants", applicantCode));

                setIsDeletingApplicant(false);
                toast.success("응시자가 삭제되었습니다.");
            }

            catch (error) {
                console.log(error);
                toast.error("응시자 삭제에 실패했습니다.");
            }
        }
    }



    return (
        <div>
            <button 
                className={styles.addApplicantButton} 
                onClick={() => { 
                    setIsAddingApplicant(true);
                    setIsEditingApplicant(false);
                    setIsDeletingApplicant(false);
                    setApplicantName("");
                }}
                >
                응시자 추가
            </button>

            {
                isAddingApplicant

                &&

                <form className={styles.addApplicantContainer} onSubmit={addApplicant}>
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
            }



            {
                applicantList.length > 0

                    ?

                    applicantList.map((current: any) => (
                        <div className={styles.applicantContainer}>
                            <div className={styles.applicantContainerTop}>
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
                                            toast.success("응시자 URL이 복사되었습니다.");
                                        }

                                        catch (error) {
                                            toast.error("응시자 URL 복사에 실패하였습니다.")
                                        }
                                    }}
                                >
                                    응시자 URL 복사
                                </button>

                                <button
                                    className={styles.editButton}
                                    onClick={() => {
                                        setIsAddingApplicant(false);
                                        setIsEditingApplicant(true);
                                        setIsDeletingApplicant(false);
                                        setApplicantName(current.applicantName);
                                    }}
                                >
                                    수정
                                </button>

                                <button
                                    className={styles.deleteButton}
                                    onClick={() => {
                                        setIsAddingApplicant(false);
                                        setIsEditingApplicant(false);
                                        setIsDeletingApplicant(true);
                                    }}
                                >
                                    삭제
                                </button>
                            </div>



                            {
                                isEditingApplicant

                                &&

                                <form 
                                    className={styles.applicantContainerEdit}
                                    onSubmit={() => {
                                        editApplicant(event, current.applicantCode)
                                    }}
                                >
                                    <input
                                        type="text"
                                        value={applicantName}
                                        className={styles.addApplicantInputBox}
                                        onChange={(event: any) => { setApplicantName(event.target.value); }}
                                        required
                                    />

                                    <input type="submit" value="변경" className={styles.editConfirmButton} />

                                    <input 
                                        type="button" 
                                        value="취소" 
                                        className={styles.editCancelButton} 
                                        onClick={() => {
                                            setIsEditingApplicant(false);
                                            setApplicantName("");
                                        }}
                                    />
                                </form>
                            }



                            {
                                isDeletingApplicant

                                &&

                                <div className={styles.applicantContainerDelete}>
                                    해당 응시자를 삭제하시겠습니까?

                                    <div
                                        className={styles.deleteConfirmButton}
                                        onClick={() => {
                                            deleteApplicant(event, current.applicantCode);
                                            setIsDeletingApplicant(false);
                                        }}
                                    >
                                        예
                                    </div>

                                    <div
                                        className={styles.deleteCancelButton}
                                        onClick={() => {
                                            setIsDeletingApplicant(false);
                                        }}
                                    >
                                        아니오
                                    </div>
                                </div>
                            }
                        </div>
                    ))

                    :

                    <Error message="응시자가 없습니다." />
            }
        </div>
    )
}