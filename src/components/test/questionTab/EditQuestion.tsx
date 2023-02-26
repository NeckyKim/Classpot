import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";

import { dbService } from "../../../FirebaseModules";
import { doc, updateDoc } from "firebase/firestore";

import ChoiceContainer from "./ChoiceContainer";

import { toast } from "react-toastify";
import { Editor } from '@tinymce/tinymce-react';

import styles from "./EditQuestion.module.css";
import tinyMceStyles from "./TinyMce.module.css";



export default function EditQuestion({ setIsEditingQuestion, questionInfo }: {
    setIsEditingQuestion: any,
    questionInfo: any
}) {
    const { testCode } = useParams();

    const [type, setType] = useState<string>(questionInfo.type);
    const [points, setPoints] = useState<number>(questionInfo.points);
    const [level, setLevel] = useState<number>(questionInfo.level);

    const [question, setQuestion] = useState<string>(questionInfo.question);
    const [answer, setAnswer] = useState<any>(questionInfo.answer);
    const [numberOfAnswers, setNumberOfAnswers] = useState<number>(0);

    const [choices, setChoices] = useState<string[]>(questionInfo.choices);
    const [numberOfChoices, setNumberOfChoices] = useState<number>(Object.values(questionInfo.choices).filter(element => element != "").length);



    useEffect(() => {
        if (type === "객관식") {
            setNumberOfAnswers(Object.values(answer).filter(element => element === true).length);
        }

        else {
            setNumberOfAnswers(1);
        }
    }, [answer])



    async function editQuestion(event: any) {
        event.preventDefault();

        if (testCode && numberOfAnswers) {
            try {
                await updateDoc(doc(dbService, "tests", testCode, "questions", questionInfo.questionCode), {
                    type: type,
                    points: points,
                    level: level,
                    question: question,
                    answer: answer,
                    choices: choices,
                })

                setIsEditingQuestion(false);
                setQuestion("");
                setAnswer(undefined);

                toast.success("문제가 수정되었습니다.");
            }

            catch (error) {
                console.log(error);
                toast.error("문제 수정에 실패했습니다.");
            }
        }

        else {
            toast.error("객관식 문제는 정답을 적어도 하나 이상 설정해야 합니다.");
        }
    }



    return (
        <form onSubmit={editQuestion}>
            <div className={styles.addQuestionsHeader}>
                유형
            </div>

            <div className={styles.typeButtons}>
                <div
                    className={type === "객관식" ? styles.typeSelected : styles.typeNotSelected}
                    style={{ 
                        borderRadius: "5px 0px 0px 5px",
                        borderRight: "none"
                    }}
                    onClick={() => {
                        setType("객관식");
                        setAnswer(new Array(10).fill(false));
                        setNumberOfAnswers(0);
                    }}>
                    객관식
                </div>

                <div
                    className={type === "참/거짓" ? styles.typeSelected : styles.typeNotSelected}
                    style={{ borderRight: "none" }}
                    onClick={() => {
                        setType("참/거짓");
                        setAnswer(true);
                        setNumberOfAnswers(1);
                    }}>
                    참/거짓
                </div>

                <div
                    className={type === "주관식" ? styles.typeSelected : styles.typeNotSelected}
                    style={{ borderRight: "none" }}
                    onClick={() => {
                        setType("주관식");
                        setAnswer("");
                        setNumberOfAnswers(1);
                    }}>
                    주관식
                </div>

                <div
                    className={type === "서술형" ? styles.typeSelected : styles.typeNotSelected}
                    style={{ borderRadius: "0px 5px 5px 0px" }}
                    onClick={() => {
                        setType("서술형");
                        setAnswer("");
                        setNumberOfAnswers(1);
                    }}>
                    서술형
                </div>
            </div>


            <div className={styles.pointsLevel}>
                <div>
                    <div className={styles.addQuestionsHeader}>
                        배점
                    </div>

                    <div className={styles.points}>
                        <input
                            type="number"
                            min={1}
                            max={100}
                            value={points}
                            onChange={(event) => {
                                setPoints(Number(event.target.value));
                            }}
                            className={styles.pointsInputBox}
                            required
                        />

                        <div className={styles.pointsUnit}>
                            점
                        </div>
                    </div>
                </div>

                <div>
                    <div className={styles.addQuestionsHeader}>
                        난이도
                    </div>

                    <select
                        className={styles.levelDropdownBox}
                        onChange={(event: any) => {
                            setLevel(Number(event.target.value));
                        }}
                    >
                        <option value={0} selected={questionInfo.level === 0}>매우 쉬움</option>
                        <option value={1} selected={questionInfo.level === 1}>쉬움</option>
                        <option value={2} selected={questionInfo.level === 2}>보통</option>
                        <option value={3} selected={questionInfo.level === 3}>어려움</option>
                        <option value={4} selected={questionInfo.level === 4}>매우 어려움</option>
                    </select>
                </div>
            </div>



            <div className={styles.addQuestionsHeader}>
                지문
            </div>

            <Editor
                apiKey="8q7n1e2sd7e0wh0gt9d3vyc8p1kkznty14inel82mcodryjw"
                value={question}
                onEditorChange={(content: any) => { setQuestion(content); }}
                init={{
                    height: 500,
                    skin: 'bootstrap',
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



            <div className={styles.choicesHeader}>
                정답

                <div className={styles.choicesButtonContainer}>
                    <input
                        type="button"
                        value="증가 +"
                        disabled={numberOfChoices === 10}
                        onClick={() => { setNumberOfChoices(numberOfChoices + 1); }}
                        className={styles.choicesIncreaseButton}
                    />

                    <input
                        type="button"
                        value="감소 -"
                        disabled={numberOfChoices === 3}
                        onClick={() => { setNumberOfChoices(numberOfChoices - 1); }}
                        className={styles.choicesDecreaseButton}
                    />
                </div>
            </div>

            {
                type === "객관식"

                &&        

                <div className={styles.choicesContainer}>
                    <ChoiceContainer index={0} answer={answer} setAnswer={setAnswer} choices={choices} setChoices={setChoices} />
                    <ChoiceContainer index={1} answer={answer} setAnswer={setAnswer} choices={choices} setChoices={setChoices} />
                    <ChoiceContainer index={2} answer={answer} setAnswer={setAnswer} choices={choices} setChoices={setChoices} />
                    {numberOfChoices >= 4 && <ChoiceContainer index={3} answer={answer} setAnswer={setAnswer} choices={choices} setChoices={setChoices} />}
                    {numberOfChoices >= 5 && <ChoiceContainer index={4} answer={answer} setAnswer={setAnswer} choices={choices} setChoices={setChoices} />}
                    {numberOfChoices >= 6 && <ChoiceContainer index={5} answer={answer} setAnswer={setAnswer} choices={choices} setChoices={setChoices} />}
                    {numberOfChoices >= 7 && <ChoiceContainer index={6} answer={answer} setAnswer={setAnswer} choices={choices} setChoices={setChoices} />}
                    {numberOfChoices >= 8 && <ChoiceContainer index={7} answer={answer} setAnswer={setAnswer} choices={choices} setChoices={setChoices} />}
                    {numberOfChoices >= 9 && <ChoiceContainer index={8} answer={answer} setAnswer={setAnswer} choices={choices} setChoices={setChoices} />}
                    {numberOfChoices >= 10 && <ChoiceContainer index={9} answer={answer} setAnswer={setAnswer} choices={choices} setChoices={setChoices} />}
                </div>
            }

            {
                type === "참/거짓"

                &&

                <div className={styles.trueFalseButtons}>
                    <div
                        className={answer ? styles.trueFalseSelected : styles.trueFalseNotSelected}
                        style={{borderRadius: "5px 0px 0px 5px"}}
                        onClick={() => { setAnswer(true); }}
                    >
                        참
                    </div>

                    <div
                        className={!answer ? styles.trueFalseSelected : styles.trueFalseNotSelected}
                        style={{borderRadius: "0px 5px 5px 0px"}}
                        onClick={() => { setAnswer(false); }}
                    >
                        거짓
                    </div>
                </div>
            }

            {
                type === "주관식"

                &&

                <input
                    type="text"
                    value={answer}
                    onChange={(event) => { setAnswer(event.target.value); }}
                    className={styles.answerInputBox}
                    required
                />
            }

            {
                type === "서술형"

                &&

                <div className={styles.answerInputBoxDisabled}>
                    서술형 문제는 정답을 설정할 수 없습니다.
                </div>
            }


            <div className={styles.addQuestionsButtons}>
                <input type="submit" value="수정" className={styles.submitButton} />

                <button
                    className={styles.cancelButton}
                    onClick={() => {
                        setIsEditingQuestion(false);
                        setPoints(1);
                        setQuestion("");
                        setAnswer("");
                    }}
                >
                    취소
                </button>
            </div>
        </form>
    )
}