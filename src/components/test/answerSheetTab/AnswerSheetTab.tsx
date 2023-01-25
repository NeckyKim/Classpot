import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import GetApplicantList from "../../hooks/GetApplicantList";

import Error from "../../../Error";

import styles from "./AnswerSheetTab.module.css";




export default function AnswerSheetTab({ testCode }: { testCode: string | undefined }) {
    // 응시자 목록
    const applicantList: any = GetApplicantList(testCode);



    return (
        <div>
            {
                applicantList.length > 0

                    ?

                    applicantList.map((current: any) => (
                        <div className={styles.applicantContainer}>
                            <div className={styles.applicantName}>
                                {current.applicantName}
                            </div>

                            <div className={styles.scores}>
                                {current && current.reportCard.filter((elements: any) => elements === null).length !== 100 && current.reportCard.filter((element: any) => (element >= 0 && element !== null)).reduce(function add(sum: number, current: number) {return sum + current})}점
                            </div>
                            
                            <div
                                className={styles.checkAnswerSheetButton}
                                onClick={() => { window.open("/test/" + testCode + "/answersheet/" + current.applicantCode) }}>
                                답안지 확인
                            </div>
                        </div>
                    ))

                    :

                    <Error message="응시자가 없습니다." />
            }
        </div>
    )
}