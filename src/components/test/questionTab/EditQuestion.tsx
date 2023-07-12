import { useState } from "react";

import { dbService } from "../../../FirebaseModules";
import { doc, updateDoc } from "firebase/firestore";

import ChoiceContainer from "./ChoiceContainer";

import Title from "../../../theme/Title";
import Label from "../../../theme/Label";
import InputBox from "../../../theme/InputBox";
import Buttons from "../../../theme/Buttons";
import SubmitButton from "../../../theme/SubmitButton";
import CancelButton from "../../../theme/CancelButton";
import RadioButton from "../../../theme/RadioButton";

import { toast } from "react-toastify";
import { Editor } from '@tinymce/tinymce-react';

import styles from "./EditQuestion.module.css";



export default function EditQuestion({ userCode, testCode, questionObject, setIsEditingQuestion }: { userCode: string | undefined, testCode: string | undefined, questionObject: any, setIsEditingQuestion: any }) {
    const [name, setName] = useState<string>(questionObject.name);
    const [type, setType] = useState<string>(questionObject.type);
    const [points, setPoints] = useState<number>(questionObject.points);

    const [question, setQuestion] = useState<string>(questionObject.question);
    const [choices, setChoices] = useState<string[]>(questionObject.choices);
    const [answer, setAnswer] = useState<boolean[] | string | boolean>(questionObject.answer);

    const [grading, setGrading] = useState<number>(questionObject.grading);



    async function editQuestion(event: any) {
        event.preventDefault();

        if (userCode && testCode) {
            if (!name) {
                toast.error("이름을 입력해주세요.", { toastId: "" });
            }

            else if (points === 0) {
                toast.error("배점은 1점 이상으로 설정해주세요.", { toastId: "" });
            }

            else if (type === "mc" && question === "") {
                toast.error("지문을 입력해주세요.", { toastId: "" });
            }

            else if (type === "mc" && Array.isArray(choices) && choices.filter(x => x.replace(/\s+/g, "") === "").length > 0) {
                toast.error("보기를 모두 입력해주세요.", { toastId: "" });
            }

            else if (type === "mc" && Array.isArray(answer) && answer.filter(x => x === true).length === 0) {
                toast.error("정답을 최소 1개를 설정해주세요.", { toastId: "" });
            }

            else if (type === "sa" && typeof answer === "string" && answer.replace(/(\s*)/g, "") === "") {
                toast.error("정답을 입력해주세요.", { toastId: "" });
            }

            else {
                try {
                    await updateDoc(doc(dbService, "users", userCode, "tests", testCode, "questions", questionObject.questionCode), {
                        name: name,
                        type: type,
                        points: points,
                        question: question,
                        answer: (type === "sa" && !Array.isArray(answer) && typeof answer === "string") ? answer.trim() : answer,
                        choices: choices,
                        grading: grading
                    })

                    setIsEditingQuestion(false);
                    setQuestion("");

                    toast.success("문제가 수정되었습니다.", { toastId: "" });
                }

                catch (error) {
                    console.log(error);
                    toast.error("문제 수정에 실패했습니다.", { toastId: "" });
                }
            }
        }

        else {
            toast.error("문제 수정에 실패했습니다.", { toastId: "" });
        }
    }



    return (
        <div className={styles.container}>
            <Title>
                문제 수정
            </Title>



            <div>
                <Label>
                    이름
                </Label>

                <InputBox
                    type="string"
                    value={name}
                    onChange={(event: any) => setName(event.target.value)}
                />
            </div>



            <div>
                <Label>
                    유형
                </Label>

                <div className={styles.typeContainer}>
                    <div className={styles.radioBox} style={{ borderRight: "1px solid rgb(220, 220, 220)" }}>
                        <RadioButton
                            value={type === "mc"}
                            onClick={() => {
                                if (type !== "mc") {
                                    setType("mc");
                                    setChoices(new Array(3).fill(""));
                                    setAnswer(new Array(3).fill(false));
                                }
                            }}
                        />
                        <img src={process.env.PUBLIC_URL + "/icons/mc.svg"} />
                        객관식
                    </div>

                    <div className={styles.radioBox} style={{ borderRight: "1px solid rgb(220, 220, 220)" }}>
                        <RadioButton
                            value={type === "sa"}
                            onClick={() => {
                                setType("sa");
                                setAnswer("");
                            }}
                        />
                        <img src={process.env.PUBLIC_URL + "/icons/sa.svg"} />
                        주관식
                    </div>

                    <div className={styles.radioBox} style={{ borderRight: "1px solid rgb(220, 220, 220)" }}>
                        <RadioButton
                            value={type === "tf"}
                            onClick={() => {
                                setType("tf");
                                setAnswer(true);
                            }}
                        />
                        <img src={process.env.PUBLIC_URL + "/icons/tf.svg"} />
                        참/거짓
                    </div>

                    <div className={styles.radioBox}>
                        <RadioButton
                            value={type === "essay"}
                            onClick={() => {
                                setType("essay");
                            }}
                        />
                        <img src={process.env.PUBLIC_URL + "/icons/essay.svg"} />
                        서술형
                    </div>
                </div>
            </div>



            <div>
                <Label>
                    배점
                </Label>

                <InputBox
                    type="number"
                    value={points}
                    onChange={(event: any) => setPoints(Number(event.target.value))}
                    style={{ width: "100px" }}
                    min={1}
                />
            </div>



            <div>
                <Label>
                    지문
                </Label>

                <div className={styles.questionContainer}>
                    <Editor
                        apiKey="8q7n1e2sd7e0wh0gt9d3vyc8p1kkznty14inel82mcodryjw"
                        value={question}
                        onEditorChange={(content) => setQuestion(content)}
                        init={{
                            height: 500,
                            menubar: false,
                            statusbar: false,
                            plugins: ['lists', 'image', 'table', 'codesample', 'lineheight'],
                            toolbar: 'fontsize | bold italic underline strikethrough | lineheight alignleft aligncenter alignright alignjustify | outdent indent | bullist numlist | image table codesample',
                            font_size_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
                            resize: false,
                            content_style: `
                                @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

                                body {
                                    font-family: 'Pretendard';
                                    font-weight: 500;
                                    line-height: 1;
                                }

                                p {
                                    font-size: 14pt;
                                }
                            `
                        }}
                    />
                </div>
            </div>



            <div>
                <Label>
                    {type === "mc" ? "보기" : "정답"}
                </Label>

                {
                    {
                        "mc":
                            (
                                Array.isArray(answer)

                                &&

                                <div className={styles.choices}>
                                    {[0, 1, 2].map(x => (<ChoiceContainer index={x} choices={choices} setChoices={setChoices} answer={answer} setAnswer={setAnswer} />))}
                                    {[3, 4, 5, 6, 7, 8, 9].map(x => (choices.length > x && <ChoiceContainer index={x} choices={choices} setChoices={setChoices} answer={answer} setAnswer={setAnswer} />))}

                                    <div
                                        className={styles.addChoiceButton}
                                        onClick={() => {
                                            if (Array.isArray(answer) && answer.length < 10) {
                                                let copy1 = [...choices];
                                                let copy2 = [...answer];

                                                copy1.push("");
                                                copy2.push(false);

                                                setChoices(copy1);
                                                setAnswer(copy2);
                                            }

                                            else {
                                                toast.error("보기는 최대 10개 까지 설정할 수 있습니다.", { toastId: "" });
                                            }
                                        }}
                                    >
                                        <img src={process.env.PUBLIC_URL + "/icons/dashboard/add_fill.svg"} className={styles.addChoiceIcon} />
                                        보기 추가
                                    </div>
                                </div>
                            ),

                        "sa":
                            (
                                !Array.isArray(answer) && typeof answer === "string"

                                &&

                                <input
                                    type="text"
                                    value={answer}
                                    onChange={(event) => setAnswer(event.target.value)}
                                    className={styles.answerInputBox}
                                    spellCheck={false}
                                />
                            )
                        ,

                        "tf":
                            <div className={styles.trueFalseContainer}>
                                <div className={styles.radioBox} style={{ borderRight: "1px solid rgb(220, 220, 220)" }}>
                                    <RadioButton
                                        value={(typeof answer === "boolean") && answer}
                                        onClick={() => setAnswer(true)}
                                    />

                                    참
                                </div>

                                <div className={styles.radioBox}>
                                    <RadioButton
                                        value={(typeof answer === "boolean") && !answer}
                                        onClick={() => setAnswer(false)}
                                    />

                                    거짓
                                </div>
                            </div>,

                        "essay":
                            <div className={styles.valueBox}>essay 문제는 정답을 설정할 수 없습니다.</div>
                    }[type]
                }
            </div>



            <div>
                <Label>
                    채점 방식
                </Label>

                {
                    type !== "essay"

                        ?

                        <div className={styles.gradingContainer}>
                            <div className={styles.gradingRadioBox} style={{ borderBottom: "1px solid rgb(220, 220, 220)" }}>
                                <RadioButton
                                    value={grading === 0}
                                    onClick={() => setGrading(0)}
                                />

                                <div className={styles.gradingText}>
                                    <div className={styles.gradingTextTop}>
                                        기본
                                    </div>

                                    <div className={styles.gradingTextBottom}>
                                        정답: +{points}점 / 오답: 0점 / 미응답: 0점 으로 채점됩니다.
                                    </div>
                                </div>
                            </div>

                            <div className={styles.gradingRadioBox} style={{ borderBottom: "1px solid rgb(220, 220, 220)" }}>
                                <RadioButton
                                    value={grading === 1}
                                    onClick={() => setGrading(1)}
                                />

                                <div className={styles.gradingText}>
                                    <div className={styles.gradingTextTop}>
                                        오답 시 감점
                                    </div>

                                    <div className={styles.gradingTextBottom}>
                                        정답: +{points}점 / 오답: -{points}점 / 미응답: 0점 으로 채점됩니다.
                                    </div>
                                </div>
                            </div>

                            <div className={styles.gradingRadioBox}>
                                <RadioButton
                                    value={grading === 2}
                                    onClick={() => setGrading(2)}
                                />

                                <div className={styles.gradingText}>
                                    <div className={styles.gradingTextTop}>
                                        응답 시 만점
                                    </div>

                                    <div className={styles.gradingTextBottom}>
                                        응답: +{points}점 / 미응답: 0점 으로 채점됩니다.
                                    </div>
                                </div>
                            </div>
                        </div>

                        :

                        <div className={styles.gradingContainer}>
                            <div className={styles.gradingRadioBox} style={{ borderBottom: "1px solid rgb(220, 220, 220)" }}>
                                <RadioButton
                                    value={grading === 0}
                                    onClick={() => setGrading(0)}
                                />

                                <div className={styles.gradingText}>
                                    <div className={styles.gradingTextTop}>
                                        기본
                                    </div>

                                    <div className={styles.gradingTextBottom}>
                                        0~{points}점으로 관리자가 직접 채점합니다.
                                    </div>
                                </div>
                            </div>

                            <div className={styles.gradingRadioBox}>
                                <RadioButton
                                    value={grading === 2}
                                    onClick={() => setGrading(2)}
                                />

                                <div className={styles.gradingText}>
                                    <div className={styles.gradingTextTop}>
                                        응답 시 만점
                                    </div>

                                    <div className={styles.gradingTextBottom}>
                                        응답: +{points}점 / 미응답: 0점 으로 채점됩니다.
                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </div>



            <Buttons>
                <SubmitButton text="수정하기" onClick={editQuestion} />
                <CancelButton text="취소하기" onClick={() => setIsEditingQuestion(false)} />
            </Buttons>
        </div>
    )
}