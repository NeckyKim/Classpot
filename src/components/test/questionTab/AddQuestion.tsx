import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { v4 as uuidv4 } from "uuid";

import { dbService } from "../../../FirebaseModules";
import { doc, setDoc } from "firebase/firestore";

import Choices from "./Choices";

import { toast } from "react-toastify";
import { Editor } from '@tinymce/tinymce-react';

import styles from "./AddQuestion.module.css";
import tinyMceStyles from "./TinyMce.module.css";



export default function AddQuestion(this: any, { userCode, setIsAddingQuestion }: { userCode: string, setIsAddingQuestion: any }) {
    const { testCode } = useParams();

    const [type, setType] = useState<string>("객관식");
    const [points, setPoints] = useState<number>(1);

    const [question, setQuestion] = useState<string>("");
    const [answer, setAnswer] = useState<any>(new Array(10).fill(false));
    const [numberOfAnswers, setNumberOfAnswers] = useState<number>(0);

    const [choices, setChoices] = useState<string[]>(new Array(10).fill(""));
    const [numberOfChoices, setNumberOfChoices] = useState<number>(3);



    useEffect(() => {
        if (type === "객관식") {
            setNumberOfAnswers(Object.values(answer).filter(element => element === true).length);
        }
    }, [answer])



    async function addQuestion(event: any) {
        event.preventDefault();

        const id: string = uuidv4();

        if (testCode && numberOfAnswers) {
            try {
                await setDoc(doc(dbService, "tests", testCode, "questions", id), {
                    type: type,
                    points: points,
                    question: question,
                    answer: answer,
                    choices: choices,
                    createdTime: Date.now(),
                })

                setIsAddingQuestion(false);
                setQuestion("");
                setAnswer(undefined);

                toast.success("문제가 추가되었습니다.");
            }

            catch (error) {
                console.log(error);
                toast.error("문제 추가에 실패했습니다.");
            }
        }

        else {
            toast.error("객관식 문제는 정답을 적어도 하나 이상 설정해야 합니다.");
        }
    }




    return (
        <form onSubmit={addQuestion}>
            <div className={styles.header}>
                문제 설정
            </div>

            <div className={styles.questionTypeContainer}>
                <div className={styles.addQuestionHeader}>
                    유형
                </div>

                <div className={styles.questionTypeButtons}>
                    <div
                        className={type === "객관식" ? styles.questionTypeSelected : styles.questionTypeNotSelected}
                        style={{ borderRadius: "5px 0px 0px 5px" }}
                        onClick={() => {
                            setType("객관식");
                            setAnswer(new Array(10).fill(false));
                            setNumberOfAnswers(0);
                        }}>
                        객관식
                    </div>

                    <div
                        className={type === "참/거짓" ? styles.questionTypeSelected : styles.questionTypeNotSelected}
                        onClick={() => {
                            setType("참/거짓");
                            setAnswer(true);
                            setNumberOfAnswers(1);
                        }}>
                        참/거짓
                    </div>

                    <div
                        className={type === "주관식" ? styles.questionTypeSelected : styles.questionTypeNotSelected}
                        onClick={() => {
                            setType("주관식");
                            setAnswer("");
                            setNumberOfAnswers(1);
                        }}>
                        주관식
                    </div>

                    <div
                        className={type === "서술형" ? styles.questionTypeSelected : styles.questionTypeNotSelected}
                        style={{ borderRadius: "0px 5px 5px 0px" }}
                        onClick={() => {
                            setType("서술형");
                            setAnswer("");
                            setNumberOfAnswers(1);
                        }}>
                        서술형
                    </div>
                </div>
            </div>



            <div className={styles.questionPointsContainer}>
                <div className={styles.addQuestionHeader}>
                    배점
                </div>

                <input
                    type="number"
                    min={1}
                    max={100}
                    value={points}
                    onChange={(event) => { setPoints(Number(event.target.value)); }}
                    className={styles.questionPointsInputBox}
                    required
                />

                <div className={styles.questionPointsUnit}>
                    점
                </div>
            </div>



            <div className={styles.header}>
                지문
            </div>
            
            <Editor
                apiKey="8q7n1e2sd7e0wh0gt9d3vyc8p1kkznty14inel82mcodryjw"
                initialValue=""
                value={question}
                onEditorChange={(content: any) => { setQuestion(content); }}
                init={{
                    height: 500,
                    menubar: false,
                    statusbar: false,
                    plugins: ['lists', 'image', 'table', 'lineheight'],
                    toolbar: 'fontsize | bold italic strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify lineheight | outdent indent | bullist numlist | image table',
                    font_size_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
                    line_height_formats: "0.8 1 1.2 1.4 1.6 1.8 2",
                    resize: false,
                    content_style: `
                        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
                        body{
                            font-family:'Pretendard';
                            font-weight: 600;
                            font-size: 12pt;
                            line-height: 1;
                        }
                    `
                }}
            />



            <div className={styles.header}>
                정답
            </div>

            {
                type === "객관식"

                &&

                <div>
                    <div className={styles.choiceButtonContainer}>
                        <input
                            type="button"
                            value="증가 +"
                            disabled={numberOfChoices === 10}
                            onClick={() => { setNumberOfChoices(numberOfChoices + 1); }}
                            className={styles.choiceButtonUp}
                        />

                        <input
                            type="button"
                            value="감소 -"
                            disabled={numberOfChoices === 3}
                            onClick={() => { setNumberOfChoices(numberOfChoices - 1); }}
                            className={styles.choiceButtonDown}
                        />
                    </div>

                    <div className={styles.choicesContainer}>
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
                </div>
            }

            {
                type === "참/거짓"

                &&

                <div>
                    <div className={styles.answerContainer}>
                        <div
                            className={answer ? styles.answerTrueSelected : styles.answerTrueNotSelected}
                            onClick={() => { setAnswer(true); }}
                        >
                            참
                        </div>

                        <div
                            className={!answer ? styles.answerFalseSelected : styles.answerFalseNotSelected}
                            onClick={() => { setAnswer(false); }}
                        >
                            거짓
                        </div>
                    </div>
                </div>

            }

            {
                type === "주관식"

                &&

                <div>
                    <input
                        type="text"
                        value={answer}
                        onChange={(event) => { setAnswer(event.target.value); }}
                        className={styles.answerBox}
                        required
                    />
                </div>
            }

            {
                type === "서술형"

                &&

                <div>
                    <div className={styles.answerBoxUnable}>
                        서술형 문제는 정답을 설정할 수 없습니다.
                    </div>
                </div>
            }

            <br />

            <input type="submit" value="추가" className={styles.submitButton} />

            <button
                className={styles.cancelButton}
                onClick={() => {
                    setIsAddingQuestion(false);
                    setPoints(1);
                    setQuestion("");
                    setAnswer("");
                }}
            >
                취소
            </button>
        </form>
    )
}