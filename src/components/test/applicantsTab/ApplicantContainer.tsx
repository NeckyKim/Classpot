import { useState } from "react";

import { dbService } from "../../../FirebaseModules";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

import { toast } from "react-toastify";

import styles from "./ApplicantContainer.module.css";



export default function ApplicantContainer({ testCode, applicantObject }: { testCode: string | undefined, applicantObject: any }) {
    const [applicantName, setApplicantName] = useState<string>(applicantObject.applicantName);

    const [isEditingApplicant, setIsEditingApplicant] = useState<boolean>(false);
    const [isDeletingApplicant, setIsDeletingApplicant] = useState<boolean>(false);



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
        <div className={styles.applicantContainer}>
            <div className={styles.applicantContainerTop}>
                <div className={styles.applicantContainer1}>
                    <div className={styles.applicantName}>
                        {applicantObject.applicantName}
                    </div>

                    <div className={styles.applicantCode}>
                        {applicantObject.shortApplicantCode}
                    </div>
                </div>

                <div className={styles.applicantContainer2}>
                    <div
                        className={styles.copyURLButton}
                        onClick={() => {
                            try {
                                navigator.clipboard.writeText(window.location.origin + "/apply/" + testCode + "/applicant/" + applicantObject.applicantCode);
                                toast.success("응시자 URL이 복사되었습니다.");
                            }

                            catch (error) {
                                toast.error("응시자 URL 복사에 실패하였습니다.")
                            }
                        }}
                    >
                        URL 복사
                    </div>

                    <div
                        className={styles.editButton}
                        onClick={() => {
                            setIsEditingApplicant(true);
                            setIsDeletingApplicant(false);
                            setApplicantName(applicantObject.applicantName);
                        }}
                    >
                        수정
                    </div>

                    <div
                        className={styles.deleteButton}
                        onClick={() => {
                            setIsEditingApplicant(false);
                            setIsDeletingApplicant(true);
                        }}
                    >
                        삭제
                    </div>
                </div>
            </div>


            {
                isEditingApplicant

                &&

                <form
                    className={styles.applicantContainerEdit}
                    onSubmit={() => {
                        editApplicant(event, applicantObject.applicantCode)
                    }}
                >
                    <input
                        type="text"
                        value={applicantName}
                        className={styles.inputBox}
                        onChange={(event: any) => { setApplicantName(event.target.value); }}
                        required
                    />

                    <input type="submit" value="변경" className={styles.editButton} />

                    <input
                        type="button"
                        value="취소"
                        className={styles.deleteButton}
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
                        className={styles.deleteButton}
                        onClick={() => {
                            deleteApplicant(event, applicantObject.applicantCode);
                            setIsDeletingApplicant(false);
                        }}
                    >
                        예
                    </div>

                    <div
                        className={styles.cancelButton}
                        onClick={() => {
                            setIsDeletingApplicant(false);
                        }}
                    >
                        아니오
                    </div>
                </div>
            }
        </div>
    )
}