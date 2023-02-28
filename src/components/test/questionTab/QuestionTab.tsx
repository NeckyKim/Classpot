import { useState, useEffect, useRef } from "react";

import AddQuestion from "./AddQuestion";
import EditQuestion from "./EditQuestion";
import GetQuestionList from "../../hooks/GetQuestionList";
import Error from "../../../Error";
import QuestionContainer from "./QuestionContainer";

import styles from "./QuestionTab.module.css";



export default function QuestionTab({ userCode, testCode }: { userCode: string, testCode: string | undefined }) {
    const [isAddingQuestion, setIsAddingQuestion] = useState<boolean>(false);
    const [isEditingQuestion, setIsEditingQuestion] = useState<boolean>(false);
    const [index, setIndex] = useState<number>(0);



    // 질문 목록
    const questionList: any = GetQuestionList(testCode);



    return (
        isAddingQuestion

            ?

            <AddQuestion userCode={userCode} setIsAddingQuestion={setIsAddingQuestion} />

            :

            <div>
                {
                    isEditingQuestion

                        ?

                        <EditQuestion setIsEditingQuestion={setIsEditingQuestion} questionInfo={questionList[index]} />

                        :

                        <div>
                            <div onClick={() => { setIsAddingQuestion((prev) => !prev); }} className={styles.addQuestionButton} >
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
                }
            </div>
    )
}