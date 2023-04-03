import { useState, useEffect, useRef } from "react";

import { dbService } from "../../../FirebaseModules";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

import GetQuestionList from "../../hooks/GetQuestionList";
import GetApplicantList from "../../hooks/GetApplicantList";

import { toast } from "react-toastify";

import styles from "./ApplicantContainer.module.css";



export default function ApplicantContainer({ index, testCode, applicantObject }: { index: number, testCode: string | undefined, applicantObject: any }) {
    const [applicantName, setApplicantName] = useState<string>(applicantObject.applicantName);

    const [isEditingApplicant, setIsEditingApplicant] = useState<boolean>(false);
    const [isDeletingApplicant, setIsDeletingApplicant] = useState<boolean>(false);



    // 응시자 목록
    const applicantList: any = GetApplicantList(testCode);

    // 질문 목록
    var questionList: any = GetQuestionList(testCode);


    function copyURL() {
        try {
            navigator.clipboard.writeText(window.location.origin + "/apply/" + testCode + "/applicant/" + applicantObject.applicantCode);
            toast.success("응시자 URL이 복사되었습니다.");
        }

        catch (error) {
            toast.error("응시자 URL 복사에 실패하였습니다.")
        }
    }


    // 자동 채점 함수
    useEffect(() => {
        for (var i = 0; i < applicantList.length; i++) {
            var reportCard: number[] = new Array(100).fill(null);

            if (applicantList[i].answerSheet && applicantList[i].autoGrading) {
                for (var j = 0; j < questionList.length; j++) {
                    if (questionList[j].type === "객관식") {
                        if (JSON.stringify(questionList[j].answer) === JSON.stringify(applicantList[i].answerSheet[j])) {
                            reportCard[j] = questionList[j].points;
                        }

                        else {
                            reportCard[j] = 0;
                        }
                    }

                    else if (questionList[j].type === "주관식" || questionList[j].type === "참/거짓") {
                        if (questionList[j].answer === applicantList[i].answerSheet[j]) {
                            reportCard[j] = questionList[j].points;
                        }

                        else {
                            reportCard[j] = 0;
                        }
                    }

                    else if (questionList[j].type === "서술형") {
                        if (reportCard[j] !== -1) {
                            reportCard[j] = -1;
                        }
                    }
                }
            }


            if (testCode && applicantList[i].applicantCode) {
                try {
                    updateDoc(doc(dbService, "tests", testCode, "applicants", applicantList[i].applicantCode), {
                        reportCard: reportCard
                    })
                }

                catch (error) {
                    console.log(error);
                }
            }
        }
    })



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
            <div className={styles.applicantIndex}>
                {String(index).padStart(3, "0")}
            </div>

            <div className={styles.applicantCode}>
                {applicantObject.shortApplicantCode}
            </div>

            <div className={styles.applicantName}>
                {applicantObject.applicantName}
            </div>

            <div className={styles.totalPoints}>
                {applicantObject.reportCard.reduce((sum: number, current: number) => { return sum + current; }, 0)}점
            </div>


            {
                applicantObject.submittedTime !== 0

                    ?

                    <div className={styles.submittedTimeValid}>
                        {new Date(applicantObject.submittedTime).toLocaleDateString("ko-KR")}<br />
                        {new Date(applicantObject.submittedTime).toLocaleTimeString()}
                    </div>

                    :

                    <div className={styles.submittedTimeInvalid}>
                        미제출
                    </div>
            }

            <div className={styles.optionButton}>
                <img
                    src={process.env.PUBLIC_URL + "/icons/copy.png"}
                    onClick={copyURL}
                />
            </div>

            <div className={styles.optionButton}>
                <img
                    src={process.env.PUBLIC_URL + "/icons/edit.png"}
                    onClick={() => { setIsEditingApplicant(true); }}
                />
            </div>

            <div className={styles.optionButton}>
                <img
                    src={process.env.PUBLIC_URL + "/icons/delete.png"}
                    onClick={() => { setIsDeletingApplicant(true); }}
                />
            </div>

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