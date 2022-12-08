import { useState } from "react";
import { useParams } from "react-router";

import { dbService } from "../../../FirebaseModules";
import { doc, setDoc, collection } from "firebase/firestore";

import Choices from "./Choices";

import styles from "./AddQuestion.module.css";



type AddQuestionProps = {
    setIsAddingQuestion: any;
}

export default function AddQuestion({ setIsAddingQuestion }: AddQuestionProps) {
    const { testCode } = useParams();

    const [type, setType] = useState<string>("객관식");
    const [points, setPoints] = useState<number>(1);

    const [question, setQuestion] = useState<string>("");
    const [answer, setAnswer] = useState<any>(new Array(10).fill(false));

    const [choices, setChoices] = useState<string[]>(new Array(10).fill(""));
    const [numberOfChoices, setNumberOfChoices] = useState<number>(3);

    console.log()

    async function addQuestion(event: any) {
        event.preventDefault();




        if (testCode && Object.values(answer).filter(element => element === true).length) {
            try {
                await setDoc(doc(collection(dbService, "tests", testCode, "questions")), {
                    type: type,
                    points: points,
                    question: question,
                    answer: answer,
                    choices: choices,
                    createdTime: Date.now()
                })

                setIsAddingQuestion(false);
                setQuestion("");
                setAnswer(undefined);

                alert("문제가 추가되었습니다.");
            }

            catch (error) {
                alert("문제 추가에 실패했습니다.");
            }
        }

        else {
            alert("객관식 문제는 정답을 한 개 이상 설정해야 합니다.")
        }
    }



    return (
        <div className={styles.container}>
            <div className={styles.questionHeader}>
                유형
            </div>

            <button onClick={() => {
                setType("객관식");
                setAnswer(new Array(10).fill(false))
            }}>
                객관식
            </button>

            <button onClick={() => {
                setType("진위형");
                setAnswer(true);
            }}>
                진위형
            </button>

            <button onClick={() => {
                setType("주관식");
                setAnswer("");
            }}>
                주관식
            </button>

            <button onClick={() => {
                setType("서술형");
                setAnswer("");
            }}>
                서술형
            </button>



            <form onSubmit={addQuestion}>
                <div className={styles.questionHeader}>
                    배점
                </div>

                <input
                    type="number"
                    min={1}
                    max={100}
                    value={points}
                    onChange={(event) => { setPoints(Number(event.target.value)); }}
                    required
                />



                <div className={styles.questionHeader}>
                    질문
                </div>

                <textarea
                    value={question}
                    onChange={(event) => { setQuestion(event.target.value); }}
                    className={styles.questionBox}
                    required
                />
                <br /><br />



                {
                    type === "객관식"

                    &&

                    <div>
                        <div className={styles.questionHeader}>
                            선택지
                        </div>

                        <input type="button" value="증가 +" onClick={() => {
                            if (numberOfChoices === 10) {
                                alert("더 이상 선택지를 추가할 수 없습니다.");
                            }

                            else {
                                setNumberOfChoices(numberOfChoices + 1);
                            }
                        }} />

                        <input type="button" value="감소 -" onClick={() => {
                            if (numberOfChoices === 3) {
                                alert("최소 3개의 선택지는 있어야합니다.");
                            }

                            else {
                                setNumberOfChoices(numberOfChoices - 1);
                            }
                        }} />

                        <Choices index={0} answer={answer} setAnswer={setAnswer} choices={choices} setChoices={setChoices} />
                        <Choices index={1} answer={answer} setAnswer={setAnswer} choices={choices} setChoices={setChoices} />
                        <Choices index={2} answer={answer} setAnswer={setAnswer} choices={choices} setChoices={setChoices} />
                        {numberOfChoices >= 4 && <Choices index={3} answer={answer} setAnswer={setAnswer} choices={choices} setChoices={setChoices} />}
                        {numberOfChoices >= 5 && <Choices index={4} answer={answer} setAnswer={setAnswer} choices={choices} setChoices={setChoices} />}
                        {numberOfChoices >= 6 && <Choices index={5} answer={answer} setAnswer={setAnswer} choices={choices} setChoices={setChoices} />}
                        {numberOfChoices >= 7 && <Choices index={6} answer={answer} setAnswer={setAnswer} choices={choices} setChoices={setChoices} />}
                        {numberOfChoices >= 8 && <Choices index={7} answer={answer} setAnswer={setAnswer} choices={choices} setChoices={setChoices} />}
                        {numberOfChoices >= 9 && <Choices index={8} answer={answer} setAnswer={setAnswer} choices={choices} setChoices={setChoices} />}
                        {numberOfChoices >= 10 && <Choices index={9} answer={answer} setAnswer={setAnswer} choices={choices} setChoices={setChoices} />}
                    </div>
                }

                {
                    type === "진위형"

                    &&

                    <div>

                    </div>

                }

                {
                    type === "주관식"

                    &&

                    <div>
                        <div>
                            정답
                        </div>

                        <input
                            type="textbox"
                            value={answer}
                            onChange={(event) => { setAnswer(event.target.value); }}
                            required
                        />
                    </div>
                }

                {
                    type === "서술형"

                    &&

                    <div>
                        서술형 문제는 정답을 설정하지 않습니다.
                    </div>
                }

                <br />

                <input type="submit" value="추가하기" />
            </form>

            <button onClick={() => {
                setIsAddingQuestion(false);

                setPoints(1);
                setQuestion("");
                setAnswer("");
            }}>
                취소
            </button>
        </div>
    )
}