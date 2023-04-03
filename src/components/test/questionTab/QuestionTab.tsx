import { useState } from "react";

import AddQuestion from "./AddQuestion";
import EditQuestion from "./EditQuestion";
import GetQuestionList from "../../hooks/GetQuestionList";
import Error from "../../../Error";
import QuestionContainer from "./QuestionContainer";
import AnswerSheetSumbitCheck from "../../hooks/AnswerSheetSumbitCheck";

import styles from "./QuestionTab.module.css";



export default function QuestionTab({ userCode, testCode }: { userCode: string, testCode: string | undefined }) {
    const [tab, setTab] = useState<number>(1);



    const [isAddingQuestion, setIsAddingQuestion] = useState<boolean>(false);
    const [isEditingQuestion, setIsEditingQuestion] = useState<boolean>(false);
    const [index, setIndex] = useState<number>(0);



    // 질문 목록
    const questionList: any = GetQuestionList(testCode);

    const questionTypeList: number[] = [
        questionList.filter((elem: any) => elem.type === "객관식").length,
        questionList.filter((elem: any) => elem.type === "참/거짓").length,
        questionList.filter((elem: any) => elem.type === "주관식").length,
        questionList.filter((elem: any) => elem.type === "서술형").length
    ];

    const questionPointsList: number[] = [
        questionList.filter((elem: any) => elem.type === "객관식").map((row: any) => row.points).reduce((sum: number, current: number) => { return sum + current; }, 0),
        questionList.filter((elem: any) => elem.type === "참/거짓").map((row: any) => row.points).reduce((sum: number, current: number) => { return sum + current; }, 0),
        questionList.filter((elem: any) => elem.type === "주관식").map((row: any) => row.points).reduce((sum: number, current: number) => { return sum + current; }, 0),
        questionList.filter((elem: any) => elem.type === "서술형").map((row: any) => row.points).reduce((sum: number, current: number) => { return sum + current; }, 0)
    ];

    const questionTotalPoints: number = questionList.map((row: any) => row.points).reduce((sum: number, current: number) => { return sum + current; }, 0)



    const isAnswerSheetSumbitted: any = AnswerSheetSumbitCheck(testCode);



    return (
        <div className={styles.container}>
            <div className={styles.containerTop}>
                문제 관리
            </div>

            <div className={styles.containerCenter}>
                <div
                    className={tab === 1 ? styles.tabClicked : styles.tabNotClicked}
                    onClick={() => {
                        setTab(1);
                        setIsAddingQuestion(false);
                    }}>
                    문제 정보
                </div>

                <div
                    className={tab === 2 ? styles.tabClicked : styles.tabNotClicked}
                    onClick={() => {
                        setTab(2);
                        setIsAddingQuestion(false);
                    }}>
                    문제 관리
                </div>
            </div>

            {
                tab === 1

                &&

                <div className={styles.containerBottom}>
                    <div className={styles.questionInfoMainHeader}>
                        유형별 문항 & 배점 분포
                    </div>

                    <table className={styles.questionInfoTable}>
                        <thead>
                            <tr>
                                <th className={styles.questionInfoTable1}>유형</th>
                                <th className={styles.questionInfoTable2}>유형별 문항 수</th>
                                <th className={styles.questionInfoTable3}>유형별 문항 수 비율</th>
                                <th className={styles.questionInfoTable2}>유형별 총점</th>
                                <th className={styles.questionInfoTable3} style={{ borderRight: "none" }}>유형별 총점 비율</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>객관식</td>
                                <td>{questionTypeList[0]}개</td>
                                <td className={styles.questionInfoTableRight}>
                                    <div className={styles.questionInfoTableRightValue}>
                                        {Math.round(questionTypeList[0] / questionList.length * 100)}%
                                    </div>

                                    <div
                                        className={styles.questionInfoTableRightGraph}
                                        style={{ width: questionTypeList[0] / questionList.length * 100 + "px" }}
                                    />
                                </td>
                                <td>{questionPointsList[0]}점</td>
                                <td className={styles.questionInfoTableRight} style={{ borderRight: "none" }}>
                                    <div className={styles.questionInfoTableRightValue}>
                                        {Math.round(questionPointsList[0] / questionTotalPoints * 100)}%
                                    </div>

                                    <div
                                        className={styles.questionInfoTableRightGraph}
                                        style={{ width: questionPointsList[0] / questionTotalPoints * 200 + "px" }}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>참/거짓</td>
                                <td>{questionTypeList[1]}개</td>
                                <td className={styles.questionInfoTableRight}>
                                    <div className={styles.questionInfoTableRightValue}>
                                        {Math.round(questionTypeList[1] / questionList.length * 100)}%
                                    </div>

                                    <div
                                        className={styles.questionInfoTableRightGraph}
                                        style={{ width: questionTypeList[1] / questionList.length * 200 + "px" }}
                                    />
                                </td>
                                <td>{questionPointsList[1]}점</td>
                                <td className={styles.questionInfoTableRight} style={{ borderRight: "none" }}>
                                    <div className={styles.questionInfoTableRightValue}>
                                        {Math.round(questionPointsList[1] / questionTotalPoints * 100)}%
                                    </div>

                                    <div
                                        className={styles.questionInfoTableRightGraph}
                                        style={{ width: questionPointsList[1] / questionTotalPoints * 200 + "px" }}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>주관식</td>
                                <td>{questionTypeList[2]}개</td>
                                <td className={styles.questionInfoTableRight}>
                                    <div className={styles.questionInfoTableRightValue}>
                                        {Math.round(questionTypeList[2] / questionList.length * 100)}%
                                    </div>

                                    <div
                                        className={styles.questionInfoTableRightGraph}
                                        style={{ width: questionTypeList[2] / questionList.length * 200 + "px" }}
                                    />
                                </td>
                                <td>{questionPointsList[2]}점</td>
                                <td className={styles.questionInfoTableRight} style={{ borderRight: "none" }}>
                                    <div className={styles.questionInfoTableRightValue}>
                                        {Math.round(questionPointsList[2] / questionTotalPoints * 100)}%
                                    </div>

                                    <div
                                        className={styles.questionInfoTableRightGraph}
                                        style={{ width: questionPointsList[2] / questionTotalPoints * 200 + "px" }}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>서술형</td>
                                <td>{questionTypeList[3]}개</td>
                                <td className={styles.questionInfoTableRight}>
                                    <div className={styles.questionInfoTableRightValue}>
                                        {Math.round(questionTypeList[3] / questionList.length * 100)}%
                                    </div>

                                    <div
                                        className={styles.questionInfoTableRightGraph}
                                        style={{ width: questionTypeList[3] / questionList.length * 200 + "px" }}
                                    />
                                </td>
                                <td>{questionPointsList[3]}점</td>
                                <td className={styles.questionInfoTableRight} style={{ borderRight: "none" }}>
                                    <div className={styles.questionInfoTableRightValue}>
                                        {Math.round(questionPointsList[3] / questionTotalPoints * 100)}%
                                    </div>

                                    <div
                                        className={styles.questionInfoTableRightGraph}
                                        style={{ width: questionPointsList[3] / questionTotalPoints * 200 + "px" }}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td style={{ fontSize: "1.2rem", fontWeight: "700" }}>합계</td>
                                <td style={{ fontSize: "1.5rem", fontWeight: "700", color: "rgb(0, 100, 250)", borderRight: "none" }}>{questionList.length}개</td>
                                <td style={{ fontSize: "1.2rem" }}></td>
                                <td style={{ fontSize: "1.5rem", fontWeight: "700", color: "rgb(0, 100, 250)", borderRight: "none" }}>{questionTotalPoints}점</td>
                                <td style={{ fontSize: "1.2rem", borderRight: "none" }}></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            }

            {
                tab === 2

                &&

                <div className={styles.containerBottom}>
                    {
                        isAddingQuestion

                            ?

                            <AddQuestion userCode={userCode} setIsAddingQuestion={setIsAddingQuestion} />

                            :

                            (
                                isEditingQuestion

                                    ?

                                    <EditQuestion setIsEditingQuestion={setIsEditingQuestion} questionInfo={questionList[index]} />

                                    :

                                    <div>
                                        <div
                                            className={styles.addQuestionButton}
                                            onClick={() => {
                                                if (isAnswerSheetSumbitted) {
                                                    alert("응시자가 제출한 답안지가 있는 경우, 문제를 추가할 수 없습니다.");
                                                }

                                                else {
                                                    setIsAddingQuestion((prev) => !prev);
                                                }
                                            }}
                                        >
                                            문제 추가
                                        </div>

                                        {
                                            questionList.length > 0

                                                ?

                                                questionList.map((current: any, index: number) => (
                                                    <QuestionContainer testCode={testCode} userCode={userCode} questionObject={current} questionNumber={index} setIndex={setIndex} setIsEditingQuestion={setIsEditingQuestion} />
                                                ))

                                                :

                                                <Error message="문제가 없습니다." />
                                        }
                                    </div>
                            )
                    }
                </div>
            }
        </div>
    )
}