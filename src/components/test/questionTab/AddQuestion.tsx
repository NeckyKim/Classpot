import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { v4 as uuidv4 } from "uuid";

import { dbService } from "../../../FirebaseModules";
import { doc, setDoc } from "firebase/firestore";

import Choices from "./Choices";

import { toast } from "react-toastify";
import ReactQuill from "react-quill";

// import { Editor, Viewer } from "@toast-ui/react-editor";
// import colorSyntax from "@toast-ui/editor-plugin-color-syntax";

import styles from "./AddQuestion.module.css";
import "react-quill/dist/quill.snow.css";

// import "@toast-ui/editor/dist/toastui-editor.css";
// import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
// import "tui-color-picker/dist/tui-color-picker.css";



export default function AddQuestion(this: any, { userCode, setIsAddingQuestion }: { userCode: string, setIsAddingQuestion: any }) {
    const { testCode } = useParams();

    const [type, setType] = useState<string>("객관식");
    const [points, setPoints] = useState<number>(1);

    const [question, setQuestion] = useState<string>("");
    const [answer, setAnswer] = useState<any>(new Array(10).fill(false));
    const [numberOfAnswers, setNumberOfAnswers] = useState<number>(0);

    const [choices, setChoices] = useState<string[]>(new Array(10).fill(""));
    const [numberOfChoices, setNumberOfChoices] = useState<number>(3);



    const modules = {
        toolbar: {
            container: [
                [
                    { font: [] },
                    { size: ["small", false, "large", "huge"] },
                    { color: [] },
                    { background: [] }
                ],
                ["bold", "italic", "underline", "code-block"],
                [
                    { align: [] },
                    { list: "ordered" },
                    { list: "bullet" },
                ],
                ["image"],
            ],
        },
    }



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



    const editorRef = useRef<any>();

    function onEditorChange () {
        (setQuestion(editorRef.current?.getInstance().getHTML()));
    };



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

            <ReactQuill
                className={styles.questionPassageInputBox}
                modules={modules}
                theme="snow"
                onChange={(editor: any) => { setQuestion(editor) }}
            />

            {/* <Editor
                ref={editorRef}
                hideModeSwitch={true}
                onChange={onEditorChange}
                height="600px"
                initialEditType="wysiwyg"
                plugins={[colorSyntax]}
                toolbarItems={[
                    ['heading', 'bold', 'italic', 'strike'],
                    ['hr', 'quote'],
                    ['ul', 'ol', 'indent', 'outdent'],
                    ['table', 'image'],
                ]}
            /> */}

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