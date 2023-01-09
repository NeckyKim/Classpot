import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { v4 as uuidv4 } from "uuid";

import { dbService, storageService } from "../../../FirebaseModules";
import { doc, setDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

import Choices from "./Choices";

import styles from "./AddQuestion.module.css";





export default function AddQuestion({ userCode, setIsAddingQuestion }: { userCode: string, setIsAddingQuestion: any; }) {
    const { testCode } = useParams();

    const [type, setType] = useState<string>("객관식");
    const [points, setPoints] = useState<number>(1);

    const [question, setQuestion] = useState<string>("");
    const [answer, setAnswer] = useState<any>(new Array(10).fill(false));
    const [numberOfAnswers, setNumberOfAnswers] = useState<number>(0);

    const [choices, setChoices] = useState<string[]>(new Array(10).fill(""));
    const [numberOfChoices, setNumberOfChoices] = useState<number>(3);

    const [file, setFile] = useState<string>("");



    useEffect(() => {
        if (type === "객관식") {
            setNumberOfAnswers(Object.values(answer).filter(element => element === true).length);
        }
    }, [answer])









    async function addQuestion(event: any) {
        event.preventDefault();

        var fileURL: string = "";

        if (file !== "") {
            const response = await uploadString(ref(storageService, userCode + "/" + uuidv4()), file, "data_url");
            fileURL = await getDownloadURL(response.ref);       
        }

        if (testCode && numberOfAnswers) {
            try {
                await setDoc(doc(collection(dbService, "tests", testCode, "questions")), {
                    type: type,
                    points: points,
                    question: question,
                    answer: answer,
                    choices: choices,
                    createdTime: Date.now(),
                    file: fileURL
                })

                setIsAddingQuestion(false);
                setQuestion("");
                setAnswer(undefined);
                setFile("");

                alert("문제가 추가되었습니다.");
            }

            catch (error) {
                alert("문제 추가에 실패했습니다.");
            }
        }

        else {
            alert("객관식 문제는 정답을 적어도 하나 이상 설정해야 합니다.");
        }
    }



    function onFileChange(event: any) {
        const {
            target: { files }
        } = event;

        const theFile = files[0];

        const reader = new FileReader();

        reader.onloadend = (finishedEvent: any) => {
            const {
                currentTarget: { result },
            } = finishedEvent;

            setFile(result);
        }

        reader.readAsDataURL(theFile);
    }

    const fileInput: any = useRef();

    function onClearFile() {
        setFile("");

        if (fileInput.current) {
            fileInput.current.value = null;
        }
    }




    


    return (
        <div className={styles.container}>
            <div className={styles.questionHeader}>
                유형
            </div>

            <div className={styles.questionTypeContainer}>
                <div
                    className={type === "객관식" ? styles.questionTypeSelectedLeft : styles.questionTypeNotSelectedLeft}
                    onClick={() => {
                        setType("객관식");
                        setAnswer(new Array(10).fill(false));
                        setNumberOfAnswers(0);
                    }}>
                    객관식
                </div>

                <div
                    className={type === "참/거짓" ? styles.questionTypeSelectedMiddle : styles.questionTypeNotSelectedMiddle}
                    onClick={() => {
                        setType("참/거짓");
                        setAnswer(true);
                        setNumberOfAnswers(1);
                    }}>
                    참/거짓
                </div>

                <div
                    className={type === "주관식" ? styles.questionTypeSelectedMiddle : styles.questionTypeNotSelectedMiddle}
                    onClick={() => {
                        setType("주관식");
                        setAnswer("");
                        setNumberOfAnswers(1);
                    }}>
                    주관식
                </div>

                <div
                    className={type === "서술형" ? styles.questionTypeSelectedRight : styles.questionTypeNotSelectedRight}
                    onClick={() => {
                        setType("서술형");
                        setAnswer("");
                        setNumberOfAnswers(1);
                    }}>
                    서술형
                </div>
            </div>



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
                    className={styles.questionPoints}
                    required
                />

                <div className={styles.questionPointsUnit}>
                    점
                </div>



                <div className={styles.questionHeader}>
                    질문
                </div>

                <textarea
                    value={question}
                    onChange={(event) => { setQuestion(event.target.value); }}
                    className={styles.questionBox}
                    spellCheck={false}
                    required
                />

                <input type="file" accept="image/*" onChange={onFileChange} ref={fileInput} />

                {
                    file

                    &&

                    <div>
                        <img src={file} width="50px" />

                        <button onClick={onClearFile}>이미지 삭제</button>
                    </div>
                }

                {
                    type === "객관식"

                    &&

                    <div>
                        <div className={styles.questionHeader}>
                            선택지
                        </div>

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
                        <div className={styles.questionHeader}>
                            정답
                        </div>



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
                        <div className={styles.questionHeader}>
                            정답
                        </div>

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
                        <div className={styles.questionHeader}>
                            정답
                        </div>

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
        </div>
    )
}