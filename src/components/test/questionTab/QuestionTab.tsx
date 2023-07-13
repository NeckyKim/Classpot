import { useState } from "react";

import AddQuestion from "./AddQuestion";
import EditQuestion from "./EditQuestion";
import QuestionContainer from "./QuestionContainer";

import GetQuestionList from "../../hooks/GetQuestionList";

import Title from "../../../style/Title";
import Label from "../../../style/Label";
import SubmitButton from "../../../style/SubmitButton";

import { toast } from "react-toastify";

import styles from "./QuestionTab.module.css";



export default function QuestionTab({ userCode, testCode }: { userCode: string | undefined, testCode: string | undefined }) {
    const questionList: any = GetQuestionList(userCode, testCode);

    const [isAddingQuestion, setIsAddingQuestion] = useState<boolean>(false);
    const [isEditingQuestion, setIsEditingQuestion] = useState<boolean>(false);
    const [questionIndex, setQuestionIndex] = useState<number>(0);



    return (
        (isAddingQuestion)

            ?

            <AddQuestion
                userCode={userCode}
                testCode={testCode}
                setIsAddingQuestion={setIsAddingQuestion}
            />

            :

            (
                isEditingQuestion

                    ?

                    <EditQuestion
                        userCode={userCode}
                        testCode={testCode}
                        questionObject={questionList[questionIndex]}
                        setIsEditingQuestion={setIsEditingQuestion}
                    />

                    :

                    <div className={styles.wrapper}>
                        <div className={styles.container}>
                            <Title>
                                문제 관리
                            </Title>



                            <div className={styles.containerTop}>
                                <div className={styles.info}>
                                    <Label style={{ marginBottom: 0 }}>
                                        총 문항 수
                                    </Label>

                                    <div className={styles.infoValue}>
                                        {questionList.length} / 100개
                                    </div>
                                </div>

                                <SubmitButton
                                    text="문제 추가"
                                    onClick={() => {
                                        if (questionList.length === 100) {
                                            toast.error("문제를 더 이상 추가할 수 없습니다.", { toastId: "" });
                                        }

                                        else {
                                            setIsAddingQuestion(true);
                                        }
                                    }}
                                />
                            </div>



                            {
                                questionList.length > 0

                                    ?

                                    <div>
                                        <div className={styles.questionListHeader}>
                                            <div>번호</div>
                                            <div style={{ textAlign: "left" }}>이름</div>
                                            <div>유형</div>
                                            <div>배점</div>
                                            <div>채점 방식</div>
                                        </div>

                                        {
                                            questionList.map((elem: any, index: number) => (
                                                <QuestionContainer
                                                    userCode={userCode}
                                                    testCode={testCode}
                                                    questionObject={elem}
                                                    index={index}
                                                    setIsEditingQuestion={setIsEditingQuestion}
                                                    setQuestionIndex={setQuestionIndex}
                                                />
                                            ))
                                        }
                                    </div>

                                    :

                                    <div className={styles.empty}>
                                        <img className={styles.emptyImage} src={process.env.PUBLIC_URL + "/graphics/empty_folder.png"} />

                                        <div className={styles.emptyMainText}>
                                            문제가 없습니다.
                                        </div>

                                        <div className={styles.emptySubText}>
                                            오른쪽 상단의 [문제 추가] 버튼을 눌러서 문제를 추가해주세요.
                                        </div>
                                    </div>
                            }
                        </div>
                    </div>
            )
    )
}