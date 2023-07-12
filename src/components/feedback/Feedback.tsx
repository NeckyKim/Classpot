import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"

import GetTestInfo from "../hooks/GetTestInfo";
import GetApplicantList from "../hooks/GetApplicantList";
import GetApplicantInfo from "../hooks/GetApplicantInfo";
import GetQuestionList from "../hooks/GetQuestionList";
import TimeCalculator from "../hooks/TimeCalculator";

import QuestionContainer from "./QuestionContainer";
import Error from "../../Error";

import styles from "./Feedback.module.css";



export default function Feedback() {
    const { userCode, testCode, applicantCode } = useParams();



    function sumArray(array: number[]) {
        return array?.reduce((sum: number, current: number) => {
            return sum + current
        }, 0)
    }



    function createArray(start: number, finish: number) {
        return [...Array(finish - start + 1)].map((v, i) => i + start)
    }


    
    let testInfo = GetTestInfo(userCode, testCode);
    let applicantList = GetApplicantList(userCode, testCode);
    let applicantInfo = GetApplicantInfo(userCode, testCode, applicantCode);
    let questionList = GetQuestionList(userCode, testCode);

    let isFeedbackTime = TimeCalculator(testInfo.feedbackTime?.start, (testInfo.feedbackTime?.finish - testInfo.feedbackTime?.start) / 60000);



    const [totalScore, setTotalScore] = useState<number>(0);

    useEffect(() => {
        setTotalScore(sumArray(questionList.map((x: any) => x.points)));
    }, [questionList])



    const [applicantScores, setApplicantScores] = useState<number[]>([]);
    const [applicantAverage, setApplicantAverage] = useState<number>(0);

    useEffect(() => {
        let temp = [];

        for (let i = 0; i < applicantList.length; i++) {
            temp.push(sumArray(applicantList[i].reportCard));
        }

        temp.sort().reverse();
        setApplicantScores(temp);
        setApplicantAverage(sumArray(temp) / applicantList.length)
    }, [applicantList])



    const [myScore, setMyScore] = useState<number>(0);

    const [correctNumbers, setCorrectNumbers] = useState<number[]>([0, 0, 0, 0]);
    const [correctPoints, setCorrectPoints] = useState<number[]>([0, 0, 0, 0]);
    const [typeNumbers, setTypeNumbers] = useState<number[]>([0, 0, 0, 0]);
    const [typePoints, setTypePoints] = useState<number[]>([0, 0, 0, 0]);

    useEffect(() => {
        let copy1 = [...correctNumbers];
        let copy2 = [...correctPoints];
        let copy3 = [...typeNumbers];
        let copy4 = [...typePoints];

        for (let i = 0; i < questionList.length; i++) {
            if (questionList[i].type === "mc") {
                if (questionList[i].points === applicantInfo.reportCard[i]) {
                    copy1[0] = copy1[0] + 1;
                }

                copy2[0] = copy2[0] + applicantInfo.reportCard[i];
                copy3[0] = copy3[0] + 1;
                copy4[0] = copy4[0] + questionList[i].points;
            }

            else if (questionList[i].type === "tf") {
                if (questionList[i].points === applicantInfo.reportCard[i]) {
                    copy1[1] = copy1[1] + 1;
                }

                copy2[1] = copy2[1] + applicantInfo.reportCard[i];
                copy3[1] = copy3[1] + 1;
                copy4[1] = copy4[1] + questionList[i].points;
            }

            else if (questionList[i].type === "sa") {
                if (questionList[i].points === applicantInfo.reportCard[i]) {
                    copy1[2] = copy1[2] + 1;
                }

                copy2[2] = copy2[2] + applicantInfo.reportCard[i];
                copy3[2] = copy3[2] + 1;
                copy4[2] = copy4[2] + questionList[i].points;
            }

            else if (questionList[i].type === "essay") {
                if (questionList[i].points === applicantInfo.reportCard[i]) {
                    copy1[3] = copy1[3] + 1;
                }

                copy2[3] = copy2[3] + applicantInfo.reportCard[i];
                copy3[3] = copy3[3] + 1;
                copy4[3] = copy4[3] + questionList[i].points;
            }
        }

        setCorrectNumbers(copy1);
        setCorrectPoints(copy2);
        setTypeNumbers(copy3);
        setTypePoints(copy4);

        setMyScore(sumArray(applicantInfo.reportCard));
    }, [applicantInfo.reportCard])



    const [tab, setTab] = useState<number>(0);



    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerTestName}>{testInfo?.testName}</div>
                <div className={styles.headerApplicantName}>{applicantInfo?.applicantName}</div>
            </div>



            {
                testInfo.feedback

                    ?

                    (
                        isFeedbackTime.isTime === "running"

                            ?

                            <>
                                <div className={styles.containerTop}>
                                    <div>
                                        <div className={styles.infoHeader}>
                                            응시자 이름
                                        </div>

                                        <div className={styles.infoValue}>
                                            {applicantInfo.applicantName}
                                        </div>
                                    </div>

                                    <div>
                                        <div className={styles.infoHeader}>
                                            점수
                                        </div>

                                        <div className={styles.infoValue}>
                                            {myScore}점
                                        </div>
                                    </div>
                                </div>



                                <div className={styles.containerBottom}>
                                    <div className={styles.menuBar}>
                                        <div
                                            className={tab === 0 ? styles.menuButtonSelected : styles.menuButtonNotSelected}
                                            onClick={() => setTab(0)}
                                        >
                                            <img src={process.env.PUBLIC_URL + "/icons/feedback/score.svg"} />
                                            점수
                                        </div>

                                        <div
                                            className={tab === 1 ? styles.menuButtonSelected : styles.menuButtonNotSelected}
                                            onClick={() => setTab(1)}
                                        >
                                            <img src={process.env.PUBLIC_URL + "/icons/feedback/answersheet.svg"} />
                                            문제
                                        </div>
                                    </div>

                                    {
                                        tab === 0

                                            ?

                                            <>
                                                <div className={styles.label}>
                                                    종합 결과표
                                                </div>

                                                <table className={styles.statisticTable}>
                                                    <tr>
                                                        <th>득점</th>
                                                        <th>정답 문항 수</th>
                                                        {testInfo.feedbackScore?.average && <th>평균</th>}
                                                        {testInfo.feedbackScore?.rank && <th>등수</th>}
                                                    </tr>

                                                    <tr>
                                                        <td>
                                                            <div>{myScore} / {totalScore}</div>
                                                            <div>({(myScore / totalScore * 100).toFixed(1)}%)</div>
                                                        </td>

                                                        <td>
                                                            <div>{sumArray(correctNumbers)} / {questionList.length}</div>
                                                            <div>({(sumArray(correctNumbers) / questionList.length * 100).toFixed(1)}%)</div>
                                                        </td>

                                                        {
                                                            testInfo.feedbackScore?.average

                                                            &&

                                                            <td>
                                                                <div>{applicantAverage.toFixed(1)}</div>
                                                            </td>
                                                        }

                                                        {
                                                            testInfo.feedbackScore?.rank

                                                            &&

                                                            <td>
                                                                <div>{applicantScores?.indexOf(myScore) + 1} / {applicantList.length}</div>
                                                                <div>(상위 {((applicantScores?.indexOf(myScore) + 1) / applicantList.length * 100).toFixed(1)}%)</div>
                                                            </td>
                                                        }
                                                    </tr>
                                                </table>



                                                <div className={styles.label}>
                                                    문제 유형별 점수표
                                                </div>

                                                <table className={styles.detailTable}>
                                                    <tr>
                                                        <th style={{ width: "20%" }}>문제 유형</th>
                                                        <th style={{ width: "40%" }}>정답 문항 수 / 전체 문항 수</th>
                                                        <th style={{ width: "40%" }}>득점 / 총점</th>
                                                    </tr>

                                                    {
                                                        [["mc", "객관식"], ["tf", "참/거짓"], ["sa", "주관식"], ["essay", "서술형"]].map((elem: any, index: number) => (
                                                            typeNumbers[index] > 0

                                                            &&

                                                            <tr>
                                                                <td>{elem[1]}</td>
                                                                <td>
                                                                    <span>{correctNumbers[index]} / {typeNumbers[index]}</span>
                                                                    <span>({(correctNumbers[index] / typeNumbers[index] * 100).toFixed(1)}%)</span>
                                                                </td>
                                                                <td>
                                                                    <span>{correctPoints[index]} / {typePoints[index]}</span>
                                                                    <span>({(correctPoints[index] / typePoints[index] * 100).toFixed(1)}%)</span>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }
                                                </table>
                                            </>

                                            :

                                            <>
                                                {
                                                    questionList.map((elem: any, index: number) => (
                                                        <QuestionContainer
                                                            questionObject={questionList[index]}
                                                            index={index}
                                                            answerSheet={applicantInfo.answerSheet}
                                                            score={applicantInfo.reportCard[index]}
                                                            showAnswer={testInfo.feedbackQnA.answer}
                                                        />
                                                    ))
                                                }
                                            </>
                                    }
                                </div>
                            </>

                            :

                            <Error message="시험 성적 공개기간이 아닙니다." />
                    )

                    :

                    <Error message="시험 성적이 공개된 시험이 아닙니다." />
            }
        </div>
    )
}