import { useState, useEffect } from "react";

import { dbService } from "../../../FirebaseModules";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

import { toast } from "react-toastify";

import styles from "./ApplicantContainer.module.css";



export default function ApplicantContainer({ testCode, applicantObject }: { testCode: string | undefined, applicantObject: any }) {
    const [applicantName, setApplicantName] = useState<string>(applicantObject.applicantName);

    const [moreButton, setMoreButton] = useState<boolean>(false);
    const [isEditingApplicant, setIsEditingApplicant] = useState<boolean>(false);
    const [isDeletingApplicant, setIsDeletingApplicant] = useState<boolean>(false);



    // 화면 너비
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        window.addEventListener("resize", () => { setWidth(window.innerWidth); });

        if (width > 1200) {
            setMoreButton(false);
        }
    });

    function copyURL() {
        try {
            navigator.clipboard.writeText(window.location.origin + "/apply/" + testCode + "/applicant/" + applicantObject.applicantCode);
            toast.success("응시자 URL이 복사되었습니다.");
        }

        catch (error) {
            toast.error("응시자 URL 복사에 실패하였습니다.")
        }

        setMoreButton(false);
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
        <div className={styles.applicantContainer}>
            <div className={styles.applicantName}>
                {applicantObject.applicantName}
            </div>

            <div className={styles.applicantCode}>
                {applicantObject.shortApplicantCode}
            </div>


            {
                width > 1200

                    ?

                    <div className={styles.optionButtons}>
                        <div
                            className={styles.optionCopyURLButton}
                            onClick={copyURL}
                        >
                            <img
                                className={styles.moreOptionIcon}
                                src={process.env.PUBLIC_URL + "/icons/copy.png"}
                            />
                            URL 복사
                        </div>

                        <div
                            className={styles.optionEditButton}
                            onClick={() => {
                                setIsEditingApplicant(true);
                                setIsDeletingApplicant(false);
                                setApplicantName(applicantObject.applicantName);
                                setMoreButton(false);
                            }}
                        >
                            <img
                                className={styles.moreOptionIcon}
                                src={process.env.PUBLIC_URL + "/icons/edit.png"}
                            />
                            수정
                        </div>

                        <div
                            className={styles.optionDeleteButton}
                            onClick={() => {
                                setIsEditingApplicant(false);
                                setIsDeletingApplicant(true);
                                setMoreButton(false);
                            }}
                        >
                            <img
                                className={styles.moreOptionIcon}
                                src={process.env.PUBLIC_URL + "/icons/delete.png"}
                            />
                            삭제
                        </div>
                    </div>

                    :

                    <img
                        className={styles.moreButton}
                        src={process.env.PUBLIC_URL + "/icons/more.png"}
                        onClick={() => {
                            setMoreButton(!moreButton);
                        }}
                    />
            }




            {
                moreButton

                &&

                <div className={styles.moreContainer}>
                    <div
                        className={styles.moreContainerCopyURLButton}
                        onClick={copyURL}
                    >
                        <img
                            className={styles.moreOptionIcon}
                            src={process.env.PUBLIC_URL + "/icons/copy.png"}
                        />
                        URL 복사
                    </div>

                    <div
                        className={styles.moreContainerEditButton}
                        onClick={() => {
                            setIsEditingApplicant(true);
                            setIsDeletingApplicant(false);
                            setApplicantName(applicantObject.applicantName);
                            setMoreButton(false);
                        }}
                    >
                        <img
                            className={styles.moreOptionIcon}
                            src={process.env.PUBLIC_URL + "/icons/edit.png"}
                        />
                        수정
                    </div>

                    <div
                        className={styles.moreContainerDeleteButton}
                        onClick={() => {
                            setIsEditingApplicant(false);
                            setIsDeletingApplicant(true);
                            setMoreButton(false);
                        }}
                    >
                        <img
                            className={styles.moreOptionIcon}
                            src={process.env.PUBLIC_URL + "/icons/delete.png"}
                        />
                        삭제
                    </div>
                </div>
            }

            {
                isEditingApplicant

                &&

                <form
                    className={styles.editDeleteApplicantBackground}
                    onSubmit={() => {
                        editApplicant(event, applicantObject.applicantCode)
                    }}
                >
                    <div className={styles.editDeleteApplicantContainer}>
                        <div className={styles.editDeleteApplicantContainerHeader}>
                            응시자 이름
                        </div>

                        <input
                            type="text"
                            value={applicantName}
                            className={styles.editApplicantInputBox}
                            onChange={(event: any) => { setApplicantName(event.target.value); }}
                            spellCheck={false}
                            required
                        />

                        <div className={styles.editDeleteContainerButtonZone}>
                            <input type="submit" value="변경" className={styles.editButton} />

                            <input
                                type="button"
                                value="취소"
                                className={styles.cancelButton}
                                onClick={() => {
                                    setIsEditingApplicant(false);
                                    setApplicantName("");
                                }}
                            />
                        </div>
                    </div>
                </form>
            }

            {
                isDeletingApplicant

                &&

                <div className={styles.editDeleteApplicantBackground}>
                    <div className={styles.editDeleteApplicantContainer}>
                        해당 응시자를 삭제하시겠습니까?

                        <div className={styles.editDeleteContainerButtonZone}>
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
                    </div>
                </div>
            }
        </div>
    )
}