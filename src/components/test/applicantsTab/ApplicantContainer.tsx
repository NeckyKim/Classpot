import { useState } from "react";

import { dbService } from "../../../FirebaseModules";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

import { toast } from "react-toastify";

import Modal from "../../../theme/Modal";
import Label from "../../../theme/Label";
import InputBox from "../../../theme/InputBox";
import Buttons from "../../../theme/Buttons";
import SubmitButton from "../../../theme/SubmitButton";
import DeleteButton from "../../../theme/DeleteButton";
import CancelButton from "../../../theme/CancelButton";

import styles from "./ApplicantContainer.module.css";



export default function ApplicantContainer({ userCode, testCode, applicantObject }: { userCode: string | undefined, testCode: string | undefined, applicantObject: any }) {
    const [applicantName, setApplicantName] = useState<string>(applicantObject.applicantName);

    const [isEditingApplicant, setIsEditingApplicant] = useState<boolean>(false);
    const [isDeletingApplicant, setIsDeletingApplicant] = useState<boolean>(false);



    async function editApplicant() {
        if (userCode && testCode) {
            try {
                await updateDoc(doc(dbService, "users", userCode, "tests", testCode, "applicants", applicantObject.applicantCode), {
                    applicantName: applicantName
                });

                setIsEditingApplicant(false);
                toast.success("응시자 이름이 수정되었습니다.", { toastId: "" });
            }

            catch (error) {
                console.log(error);
                toast.error("응시자 이름을 수정하지 못했습니다.", { toastId: "" });
            }
        }
    }



    async function deleteApplicant() {
        if (userCode && testCode) {
            try {
                await deleteDoc(doc(dbService, "users", userCode, "tests", testCode, "applicants", applicantObject.applicantCode));

                setIsDeletingApplicant(false);
                toast.success("응시자가 삭제되었습니다.", { toastId: "" });
            }

            catch (error) {
                console.log(error);
                toast.error("응시자를 삭제하지 못했습니다.", { toastId: "" });
            }
        }
    }



    async function pasueApplicant() {
        if (userCode && testCode && applicantObject.applicantCode) {
            try {
                await updateDoc(doc(dbService, "users", userCode, "tests", testCode, "applicants",applicantObject.applicantCode), {
                    pause: !applicantObject.pause
                })
            }

            catch (error) {
                console.log(error);
            }
        }
    }



    function sumArray(array: number[]) {
        return array?.reduce((sum: number, current: number) => {
            return sum + current
        }, 0)
    }

    console.log(applicantObject.reportCard)

    return (
        <div>
            <div className={styles.container}>
                <img
                    className={styles.applicantImage}
                    src={process.env.PUBLIC_URL + "/icons/dashboard/user.svg"}
                />

                <div className={styles.applicantCode}>
                    {applicantObject.shortApplicantCode}
                </div>

                <div className={styles.applicantName}>
                    {applicantObject.applicantName}
                </div>

                <div className={styles.applicantScore}>
                    {sumArray(applicantObject.reportCard)}
                </div>

                <div className={applicantObject.pause ? styles.applicantPauseOffButton : styles.applicantPauseOnButton} onClick={() => {
                    if (applicantObject.pause) {
                        if (confirm("일시 정지를 해제하시겠습니까?")) {
                            pasueApplicant();
                        }
                    }

                    else {
                        if (confirm(`${applicantObject.applicantName} 응시자를 일시 정지 하시겠습니까?`)) {
                            pasueApplicant();
                        }
                    }
                }}>
                    {applicantObject.pause ? "일시정지 해제" : "일시정지"}
                </div>

                <img
                    className={styles.applicantIcon}
                    src={process.env.PUBLIC_URL + "/icons/dashboard/copy.svg"}
                    onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/apply/manager/${userCode}/test/${testCode}/applicant/${applicantObject.applicantCode}`);
                        toast.success("URL이 복사되었습니다.", { toastId: "" });
                    }}
                />

                <img
                    className={styles.applicantIcon}
                    src={process.env.PUBLIC_URL + "/icons/dashboard/edit.svg"}
                    onClick={() => {
                        setIsEditingApplicant(true);
                        setApplicantName(applicantObject.applicantName)
                    }}
                />

                <img
                    className={styles.applicantIcon}
                    src={process.env.PUBLIC_URL + "/icons/dashboard/delete.svg"}
                    onClick={() => setIsDeletingApplicant(true)}
                />
            </div>



            {
                isEditingApplicant

                &&

                <Modal title="응시자 수정" onClose={() => setIsEditingApplicant(false)}>
                    <Label>
                        응시자 이름
                    </Label>

                    <InputBox
                        type="text"
                        value={applicantName}
                        onChange={(event: any) => setApplicantName(event.target.value)}
                    />
                    <br /><br /><br />

                    <Buttons>
                        <SubmitButton
                            text="수정"
                            onClick={editApplicant}
                            disabled={applicantName.replace(/(\s*)/g, "") === ""}
                        />

                        <CancelButton
                            text="취소"
                            onClick={() => setIsEditingApplicant(false)}
                        />
                    </Buttons>
                </Modal>
            }

            {
                isDeletingApplicant

                &&

                <Modal title="응시자 삭제" onClose={() => setIsDeletingApplicant(false)}>
                    해당 응시자를 삭제하시겠습니까?
                    <br /><br /><br />

                    <Buttons>
                        <DeleteButton
                            text="삭제"
                            onClick={deleteApplicant}
                            disabled={applicantName.replace(/(\s*)/g, "") === ""}
                        />

                        <CancelButton
                            text="취소"
                            onClick={() => setIsDeletingApplicant(false)}
                        />
                    </Buttons>
                </Modal>
            }
        </div>
    )
}