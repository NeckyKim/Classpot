import { useParams } from "react-router-dom";

import { dbService } from "../../../FirebaseModules";
import { doc, updateDoc } from "firebase/firestore";

import Error from "../../../Error";
import GetTestInfo from "../../hooks/GetTestInfo";
import GetQuestionList from "../../hooks/GetQuestionList";
import GetApplicantInfo from "../../hooks/GetApplicantInfo";

import styles from "./AnswerSheetMode.module.css";



export default function AnswerSheetMode({ userCode, editable }: { userCode: string | null, editable: boolean }) {
    const { testCode } = useParams();
    const { applicantCode } = useParams();

    const testInfo: any = GetTestInfo(testCode);
    const questionList: any = GetQuestionList(testCode);
    const applicantInfo: any = GetApplicantInfo(testCode, applicantCode);

    var reportCard: number[] = new Array(100).fill(null);



    async function submitReportCard(event: any) {
        event.preventDefault();

        if (testCode && applicantCode) {
            try {
                await updateDoc(doc(dbService, "tests", testCode, "applicants", applicantCode), {
                    reportCard: reportCard
                })
            }

            catch (error) {
                console.log(error);
            }
        }
    }


    async function changeScores(event: any) {
        event.preventDefault();

        if (testCode && applicantCode) {
            try {
                await updateDoc(doc(dbService, "tests", testCode, "applicants", applicantCode), {
                    reportCard: applicantInfo.reportCard
                })
            }

            catch (error) {
                console.log(error);
            }
        }
    }



    async function changeAutoGradingMode(event: any) {
        event.preventDefault();

        var ok = false;

        if (applicantInfo.autoGrading === false) {
            ok = confirm("자동 채점을 사용하시겠습니까? 수동으로 채점된 모든 항목들이 초기화되고 자동으로 다시 채점됩니다.");
        }

        else {
            ok = true
        }

        if (testCode && applicantCode && ok) {
            try {
                await updateDoc(doc(dbService, "tests", testCode, "applicants", applicantCode), {
                    autoGrading: !(applicantInfo.autoGrading)
                })
            }

            catch (error) {
                console.log(error);
            }
        }
    }



    if (applicantInfo.answerSheet && applicantInfo.autoGrading) {
        for (var i = 0; i < questionList.length; i++) {
            if (questionList[i].type === "객관식") {
                if (JSON.stringify(questionList[i].answer) === JSON.stringify(applicantInfo.answerSheet[i])) {
                    reportCard[i] = questionList[i].points;
                }

                else {
                    reportCard[i] = 0;
                }
            }

            else if (questionList[i].type === "주관식" || questionList[i].type === "참/거짓") {
                if (questionList[i].answer === applicantInfo.answerSheet[i]) {
                    reportCard[i] = questionList[i].points;
                }

                else {
                    reportCard[i] = 0;
                }
            }

            else if (questionList[i].type === "서술형") {
                if (reportCard[i] !== -1) {
                    reportCard[i] = -1;
                }
            }
        }

        submitReportCard(event);
    }



    return (
        applicantInfo.answerSheet && applicantInfo.answerSheet.filter((elements: any) => elements === null).length !== 100

            ?

            <div className={styles.answerSheetModeContainer}>
                <div className={styles.answerSheetModeContainerTop}>
                    <div className={styles.answerSheetModeContainerTopInfo}>
                        <div className={styles.testName}>
                            {testInfo.testName}
                        </div>

                        <div className={styles.applicantName}>
                            {applicantInfo.applicantName}
                        </div>
                    </div>

                    {
                        editable

                            ?

                            <div
                                className={styles.autoGradingButton}
                                onClick={changeAutoGradingMode}
                            >
                                자동 채점 {applicantInfo.autoGrading ? "ON" : "OFF"}
                            </div>

                            :

                            <div />
                    }


                    <div className={styles.scores}>
                        <div className={styles.scoresHeader}>
                            {editable ? "점수" : "나의 점수"}
                        </div>

                        <div className={styles.scoresValue}>
                            {applicantInfo.reportCard && applicantInfo.reportCard.filter((elements: any) => elements === null).length !== 100 && applicantInfo.reportCard.filter((element: any) => (element >= 0 && element !== null)).reduce(function add(sum: number, current: number) { return sum + current })}점
                        </div>
                    </div>
                </div>

                <div className={styles.answerSheetModeContainerBottom}>
                    {
                        questionList.map((current: any, index: number) => (
                            <div className={styles.questionAnswer}>
                                <div className={styles.questionAnswerHeader}>
                                    <div className={styles.questionNumber}>
                                        Q.{index + 1}
                                    </div>

                                    <div className={styles.questionType}>
                                        {current.type}
                                    </div>

                                    <div className={styles.questionPoints}>
                                        {current.points}점
                                    </div>
                                </div>

                                <div className={styles.questionContent}>
                                    {current.question}
                                </div>

                                <div>
                                    {
                                        current.type === "객관식"

                                        &&

                                        <div>
                                            <div className={styles.questionAnswerSubHeader}>
                                                정답
                                            </div>

                                            <div className={questionList[index].answer[0] ? styles.correctChoice : styles.wrongChoice}>{current.choices[0]}</div>
                                            <div className={questionList[index].answer[1] ? styles.correctChoice : styles.wrongChoice}>{current.choices[1]}</div>
                                            <div className={questionList[index].answer[2] ? styles.correctChoice : styles.wrongChoice}>{current.choices[2]}</div>
                                            {current.choices[3] && <div className={questionList[index].answer[3] ? styles.correctChoice : styles.wrongChoice}>{current.choices[3]}</div>}
                                            {current.choices[4] && <div className={questionList[index].answer[4] ? styles.correctChoice : styles.wrongChoice}>{current.choices[4]}</div>}
                                            {current.choices[5] && <div className={questionList[index].answer[5] ? styles.correctChoice : styles.wrongChoice}>{current.choices[5]}</div>}
                                            {current.choices[6] && <div className={questionList[index].answer[6] ? styles.correctChoice : styles.wrongChoice}>{current.choices[6]}</div>}
                                            {current.choices[7] && <div className={questionList[index].answer[7] ? styles.correctChoice : styles.wrongChoice}>{current.choices[7]}</div>}
                                            {current.choices[8] && <div className={questionList[index].answer[8] ? styles.correctChoice : styles.wrongChoice}>{current.choices[8]}</div>}


                                            <div className={styles.questionAnswerSubHeader}>
                                                답안
                                            </div>

                                            <div className={current.points === applicantInfo.reportCard[index] ? styles.gradedCorrect : (applicantInfo.reportCard[index] !== 0 ? styles.gradedSomeCorrect : styles.gradedIncorrect)}>
                                                {applicantInfo.answerSheet[index][0] && <div className={styles.choice}>{current.choices[0]}</div>}
                                                {applicantInfo.answerSheet[index][1] && <div className={styles.choice}>{current.choices[1]}</div>}
                                                {applicantInfo.answerSheet[index][2] && <div className={styles.choice}>{current.choices[2]}</div>}
                                                {applicantInfo.answerSheet[index][3] && <div className={styles.choice}>{current.choices[3]}</div>}
                                                {applicantInfo.answerSheet[index][4] && <div className={styles.choice}>{current.choices[4]}</div>}
                                                {applicantInfo.answerSheet[index][5] && <div className={styles.choice}>{current.choices[5]}</div>}
                                                {applicantInfo.answerSheet[index][6] && <div className={styles.choice}>{current.choices[6]}</div>}
                                                {applicantInfo.answerSheet[index][7] && <div className={styles.choice}>{current.choices[7]}</div>}
                                                {applicantInfo.answerSheet[index][8] && <div className={styles.choice}>{current.choices[8]}</div>}

                                                <div className={styles.grading}>
                                                    <div className={styles.gradingResults}>
                                                        {current.points === applicantInfo.reportCard[index] ? "정답" : (applicantInfo.reportCard[index] !== 0 ? "부분 정답" : "오답")}
                                                    </div>

                                                    <div className={styles.gradingPoints}>
                                                        {applicantInfo.reportCard[index]} / {current.points}점
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }

                                    {
                                        current.type === "참/거짓"

                                        &&

                                        <div>
                                            <div className={styles.questionAnswerSubHeader}>
                                                정답
                                            </div>

                                            <div className={styles.correctChoice}>
                                                {current.answer ? "참" : "거짓"}
                                            </div>

                                            <div className={styles.questionAnswerSubHeader}>
                                                답안
                                            </div>

                                            <div className={current.points === applicantInfo.reportCard[index] ? styles.gradedCorrect : (applicantInfo.reportCard[index] !== 0 ? styles.gradedSomeCorrect : styles.gradedIncorrect)}>
                                                <div className={styles.choice}>
                                                    {applicantInfo.answerSheet[index] ? "참" : "거짓"}
                                                </div>

                                                <div className={styles.grading}>
                                                    <div className={styles.gradingResults}>
                                                        {current.points === applicantInfo.reportCard[index] ? "정답" : (applicantInfo.reportCard[index] !== 0 ? "부분 정답" : "오답")}
                                                    </div>

                                                    <div className={styles.gradingPoints}>
                                                        {applicantInfo.reportCard[index]} / {current.points}점
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }

                                    {
                                        current.type === "주관식"

                                        &&

                                        <div>
                                            <div className={styles.questionAnswerSubHeader}>
                                                정답
                                            </div>

                                            <div className={styles.correctChoice}>
                                                {current.answer}
                                            </div>

                                            <div className={styles.questionAnswerSubHeader}>
                                                답안
                                            </div>

                                            <div className={current.points === applicantInfo.reportCard[index] ? styles.gradedCorrect : (applicantInfo.reportCard[index] !== 0 ? styles.gradedSomeCorrect : styles.gradedIncorrect)}>
                                                <div className={styles.choice}>
                                                    {applicantInfo.answerSheet[index]}
                                                </div>

                                                <div className={styles.grading}>
                                                    <div className={styles.gradingResults}>
                                                        {current.points === applicantInfo.reportCard[index] ? "정답" : (applicantInfo.reportCard[index] !== 0 ? "부분 정답" : "오답")}
                                                    </div>

                                                    <div className={styles.gradingPoints}>
                                                        {applicantInfo.reportCard[index]} / {current.points}점
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }

                                    {
                                        current.type === "서술형"

                                        &&

                                        <div>
                                            <div className={styles.questionAnswerSubHeader}>
                                                답안
                                            </div>

                                            <div className={applicantInfo.reportCard[index] === -1 ? styles.gradedBefore : (current.points === applicantInfo.reportCard[index] ? styles.gradedCorrect : (applicantInfo.reportCard[index] !== 0 ? styles.gradedSomeCorrect : styles.gradedIncorrect))}>
                                                <div className={styles.choice}>
                                                    {applicantInfo.answerSheet[index]}
                                                </div>

                                                <div className={styles.grading}>
                                                    <div className={styles.gradingResults}>
                                                        {applicantInfo.reportCard[index] === -1 ? "채점 전" : (current.points === applicantInfo.reportCard[index] ? "정답" : (applicantInfo.reportCard[index] !== 0 ? "부분 정답" : "오답"))}
                                                    </div>

                                                    <div className={styles.gradingPoints}>
                                                        {applicantInfo.reportCard[index] !== -1 && (applicantInfo.reportCard[index] + "/" + current.points + "점")}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }

                                    {
                                        editable

                                        &&

                                        <div>
                                            <div className={styles.questionAnswerSubHeader}>
                                                채점
                                            </div>

                                            <div>
                                                {
                                                    applicantInfo.autoGrading

                                                        ?

                                                        <div className={styles.manualGradingGuide}>
                                                            자동 채점을 해제하면 점수를 수정할 수 있습니다.
                                                        </div>

                                                        :

                                                        <div className={styles.manualGradingContainer}>
                                                            <button
                                                                className={styles.manualGradingWrong}
                                                                disabled={applicantInfo.reportCard[index] === 0}
                                                                onClick={() => {
                                                                    var temp = applicantInfo.reportCard;
                                                                    temp[index] = 0;

                                                                    changeScores(event);
                                                                }}
                                                            >
                                                                오답
                                                            </button>

                                                            <div
                                                                className={(applicantInfo.reportCard[index] !== 0 && applicantInfo.reportCard[index] !== current.points) ? styles.manualGradingSomeOn : styles.manualGradingSomeOff}
                                                                onClick={() => {
                                                                    var temp = applicantInfo.reportCard;

                                                                    var check = prompt("점수를 입력하세요");

                                                                    if (!!Number(check)) {
                                                                        if (Number(check) >= 0 && Number(check) <= current.points) {
                                                                            temp[index] = Number(check);
                                                                            changeScores(event);
                                                                        }

                                                                        else {
                                                                            alert("최소 0점부터 " + current.points + "까지 점수를 부여할 수 있습니다.");
                                                                        }
                                                                    }

                                                                    else {
                                                                        alert("숫자를 입력해야 합니다.");
                                                                    }
                                                                }}
                                                            >
                                                                부분 정답
                                                            </div>

                                                            <button
                                                                className={styles.manualGradingCorrect}
                                                                disabled={applicantInfo.reportCard[index] === current.points}
                                                                onClick={() => {
                                                                    var temp = applicantInfo.reportCard;
                                                                    temp[index] = current.points;

                                                                    changeScores(event);
                                                                }}
                                                            >
                                                                정답
                                                            </button>
                                                        </div>
                                                }
                                            </div>
                                        </div>
                                    }


                                    {

                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>

                <div className={styles.marginBottom} />
            </div>


            :

            <Error message="해당 응시자는 답안지를 제출하지 않았습니다." />
    )
}