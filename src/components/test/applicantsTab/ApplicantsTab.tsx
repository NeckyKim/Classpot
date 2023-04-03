import { useState } from "react";

import { dbService } from "../../../FirebaseModules";
import { doc, setDoc, collection } from "firebase/firestore";

import ApplicantContainer from "./ApplicantContainer";
import GetTestInfo from "../../hooks/GetTestInfo";
import GetQuestionList from "../../hooks/GetQuestionList";
import GetApplicantList from "../../hooks/GetApplicantList";
import GenerateShortApplicantCode from "../../hooks/GenerateShortApplicantCode";
import Error from "../../../Error";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

import { toast } from "react-toastify";
import { Editor } from '@tinymce/tinymce-react';

import styles from "./ApplicantsTab.module.css";




export default function ApplicantsTab({ testCode }: { testCode: string | undefined }) {
    const [tab, setTab] = useState<number>(1);


    // 시험 정보
    const testInfo: any = GetTestInfo(testCode);


    // 응시자 목록
    const applicantList: any = GetApplicantList(testCode);

    // 질문 목록
    var questionList: any = GetQuestionList(testCode);

    const [isAddingApplicant, setIsAddingApplicant] = useState<boolean>(false);
    const [applicantName, setApplicantName] = useState<string>("");

    const shortApplicantCode = GenerateShortApplicantCode(testCode);

    // 답안지 확인 응시자
    const [applicantIndex, setApplicantIndex] = useState<number>(-1);
    const [isSelectingApplicant, setIsSeletingApplicant] = useState<boolean>(false);

    var answerSheet: string[] = new Array(100).fill(null);
    var reportCard: string[] = new Array(100).fill(null);


    async function addApplicant(event: any) {
        event.preventDefault()

        if (testCode) {
            try {
                await setDoc(doc(collection(dbService, "tests", testCode, "applicants")), {
                    applicantName: applicantName,
                    createdTime: Date.now(),
                    submittedTime: 0,
                    answerSheet: answerSheet,
                    reportCard: reportCard,
                    autoGrading: true,
                    shortApplicantCode: shortApplicantCode
                })

                toast.success("응시자가 추가됐습니다.");

                setApplicantName("");
                setIsAddingApplicant(false);
            }

            catch (error) {
                toast.error("응시자 추가에 실패했습니다.");
            }
        }
    }



    function downloadApplicantList() {
        const ws = XLSX.utils.aoa_to_sheet([
            ["응시자 코드(6자리)", "이름(문자)", "점수(숫자)", "답안지 제출 시간(시간)"]
        ]);

        applicantList.map((elem: any) => {
            XLSX.utils.sheet_add_aoa(
                ws,
                [
                    [
                        elem.shortApplicantCode,
                        elem.applicantName,
                        elem.reportCard.reduce((sum: number, current: number) => { return sum + current; }, 0),
                        elem.submittedTime !== 0 ? new Date(elem.submittedTime).toLocaleString() : "미제출"
                    ]
                ],
                { origin: -1 }
            );
            ws["!cols"] = [
                { wpx: 120 },
                { wpx: 300 },
                { wpx: 80 },
                { wpx: 150 }
            ]
            return false;
        });

        const wb: any = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelButter = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const excelFile = new Blob([excelButter], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
        FileSaver.saveAs(excelFile, testInfo.testName + "_응시자 목록" + ".xlsx");
    }



    return (
        <div className={styles.container}>
            <div className={styles.containerTop}>
                응시자 관리
            </div>

            <div className={styles.containerCenter}>
                <div
                    className={tab === 1 ? styles.tabClicked : styles.tabNotClicked}
                    onClick={() => {
                        setTab(1);
                        setIsAddingApplicant(false);
                    }}>
                    응시자 목록
                </div>

                <div
                    className={tab === 2 ? styles.tabClicked : styles.tabNotClicked}
                    onClick={() => {
                        setTab(2);
                        setIsAddingApplicant(false);
                    }}>
                    답안지 확인
                </div>
            </div>

            {
                tab === 1

                &&

                <div className={styles.containerBottom}>
                    {
                        isAddingApplicant

                            ?

                            <form onSubmit={addApplicant}>
                                <div className={styles.addApplicantHeader}>
                                    응시자 이름
                                </div>

                                <input
                                    type="text"
                                    value={applicantName}
                                    className={styles.applicantNameInputBox}
                                    onChange={(event: any) => { setApplicantName(event.target.value); }}
                                    required
                                />

                                <div className={styles.addApplicantButtons}>
                                    <input
                                        type="submit"
                                        value="추가"
                                        className={styles.confirmButton}
                                    />

                                    <input
                                        type="button"
                                        value="취소"
                                        className={styles.cancelButton}
                                        onClick={() => {
                                            setIsAddingApplicant(false);
                                            setApplicantName("");
                                        }}
                                    />
                                </div>
                            </form>

                            :

                            <div>
                                <div className={styles.applicantContainerTop}>
                                    <div className={styles.applicantNumberHeader}>
                                        총 응시자 수
                                    </div>

                                    <div className={styles.applicantsNumberValue}>
                                        {applicantList.length}명
                                    </div>

                                    <div
                                        className={styles.addApplicantButton}
                                        onClick={() => {
                                            setIsAddingApplicant(true);
                                            setApplicantName("");
                                        }}
                                    >
                                        응시자 추가
                                    </div>

                                    <div className={styles.downloadListButton} onClick={downloadApplicantList}>
                                        엑셀 다운로드
                                    </div>
                                </div>


                                {
                                    applicantList.length > 0

                                        ?

                                        <div>
                                            <div className={styles.applicantContainerHeader}>
                                                <div className={styles.applicantContainerHeaderTextAlignCenter}>번호</div>
                                                <div className={styles.applicantContainerHeaderTextAlignCenter}>응시자 코드</div>
                                                <div className={styles.applicantContainerHeaderTextAlignLeft} style={{ paddingLeft: "20px" }}>이름</div>
                                                <div className={styles.applicantContainerHeaderTextAlignCenter}>점수</div>
                                                <div className={styles.applicantContainerHeaderTextAlignCenter}>답안지 제출 시간</div>
                                                <div className={styles.applicantContainerHeaderTextAlignCenter}>URL 복사</div>
                                                <div className={styles.applicantContainerHeaderTextAlignCenter}>수정</div>
                                                <div className={styles.applicantContainerHeaderTextAlignCenter}>삭제</div>
                                            </div>

                                            {
                                                applicantList.map((current: any, index: number) => <ApplicantContainer index={index + 1} testCode={testCode} applicantObject={current} />)
                                            }
                                        </div>

                                        :

                                        <Error message="응시자가 없습니다." />
                                }
                            </div>
                    }
                </div>
            }

            {
                tab === 2

                &&

                <div className={styles.containerBottom}>
                    <div className={styles.answerSheetContainer}>
                        <div className={styles.answerSheetContainerLeft}>
                            {
                                isSelectingApplicant

                                    ?

                                    <div className={styles.applicantListClicked}>
                                        {
                                            applicantList.map((elem: any, index: number) => (
                                                <div
                                                    onClick={() => {
                                                        setApplicantIndex(index);
                                                        setIsSeletingApplicant(false);
                                                    }}
                                                >
                                                    {elem.applicantName}
                                                </div>
                                            ))
                                        }
                                    </div>

                                    :

                                    <div className={styles.applicantListNotClicked} onClick={() => { setIsSeletingApplicant(true); }}>
                                        {applicantIndex === -1 ? "응시자 선택" : applicantList[applicantIndex].applicantName}

                                        <div className={styles.answerSheetApplicantInfo}>
                                            <div className={styles.answerSheetApplicantInfo1}>
                                            {applicantList[applicantIndex]?.reportCard.reduce((sum: number, current: number) => { return sum + current; }, 0)}
                                            </div>
                                            
                                            <div className={styles.answerSheetApplicantInfo2}>
                                                /
                                            </div>

                                            <div className={styles.answerSheetApplicantInfo2}>
                                            {questionList.map((elem: any) => elem.points).reduce((sum: number, current: number) => { return sum + current; }, 0)}점
                                            </div>
                                        </div>
                                    </div>
                            }
                        </div>

                        <div className={styles.answerSheetContainerRight}>
                            {
                                applicantIndex === -1

                                    ?

                                    <Error message="응시자를 선택하세요." />

                                    :

                                    <div>
                                        {
                                            applicantList[applicantIndex].answerSheet.filter((elem: any) => elem !== null).length > 0

                                                ?

                                                questionList.map((current: any, questionIndex: number) => (
                                                    <div className={styles.questionContainer}>
                                                        <div className={styles.questionContainer1}>
                                                            <div
                                                                style={{}}
                                                                className={
                                                                    applicantList[applicantIndex].reportCard[questionIndex] === questionList[questionIndex].points

                                                                        ?

                                                                        styles.questionNumberCorrect

                                                                        :

                                                                        (
                                                                            applicantList[applicantIndex].reportCard[questionIndex] === -1

                                                                                ?

                                                                                styles.questionNumberBefore

                                                                                :

                                                                                (
                                                                                    applicantList[applicantIndex].reportCard[questionIndex] === 0

                                                                                        ?

                                                                                        styles.questionNumberIncorrect

                                                                                        :

                                                                                        styles.questionNumberSomeCorrect
                                                                                )
                                                                        )
                                                                }
                                                            >
                                                                {questionIndex + 1}
                                                            </div>
                                                        </div>

                                                        <div className={styles.questionContainer2}>
                                                            <Editor
                                                                apiKey="8q7n1e2sd7e0wh0gt9d3vyc8p1kkznty14inel82mcodryjw"
                                                                disabled={true}
                                                                init={{
                                                                    readonly: true,
                                                                    menubar: false,
                                                                    toolbar: false,
                                                                    statusbar: false,
                                                                    plugins: ["autoresize", 'codesample'],
                                                                    content_style: `
                                                        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

                                                        body {
                                                            font-family:'Pretendard';
                                                            font-weight: 500;
                                                            margin: 0px;
                                                            padding: 0px;
                                                        }
                                                    `
                                                                }}
                                                                value={current.question}
                                                            />
                                                        </div>

                                                        <div className={styles.questionContainer3}>
                                                            {
                                                                current.type === "객관식"

                                                                &&

                                                                <div className={styles.choiceAnswerContainer}>
                                                                    <div className={styles.choiceAnswerElements}>
                                                                        <div className={applicantList[applicantIndex]?.answerSheet[questionIndex][0] ? styles.choiceNumberSelected : styles.choiceNumberNotSelected}>
                                                                            1
                                                                        </div>

                                                                        <div className={applicantList[applicantIndex]?.answerSheet[questionIndex][0] ? styles.choiceValueSelected : styles.choiceValueNotSelected}>
                                                                            {current.choices[0]}
                                                                        </div>
                                                                    </div>

                                                                    <div className={styles.choiceAnswerElements}>
                                                                        <div className={applicantList[applicantIndex]?.answerSheet[questionIndex][1] ? styles.choiceNumberSelected : styles.choiceNumberNotSelected}>
                                                                            2
                                                                        </div>

                                                                        <div className={applicantList[applicantIndex]?.answerSheet[questionIndex][1] ? styles.choiceValueSelected : styles.choiceValueNotSelected}>
                                                                            {current.choices[1]}
                                                                        </div>
                                                                    </div>

                                                                    <div className={styles.choiceAnswerElements}>
                                                                        <div className={applicantList[applicantIndex]?.answerSheet[questionIndex][2] ? styles.choiceNumberSelected : styles.choiceNumberNotSelected}>
                                                                            3
                                                                        </div>

                                                                        <div className={applicantList[applicantIndex]?.answerSheet[questionIndex][2] ? styles.choiceValueSelected : styles.choiceValueNotSelected}>
                                                                            {current.choices[2]}
                                                                        </div>
                                                                    </div>

                                                                    {
                                                                        current.choices[3]

                                                                        &&

                                                                        <div className={styles.choiceAnswerElements}>
                                                                            <div className={applicantList[applicantIndex]?.answerSheet[questionIndex][3] ? styles.choiceNumberSelected : styles.choiceNumberNotSelected}>
                                                                                4
                                                                            </div>

                                                                            <div className={applicantList[applicantIndex]?.answerSheet[questionIndex][3] ? styles.choiceValueSelected : styles.choiceValueNotSelected}>
                                                                                {current.choices[3]}
                                                                            </div>
                                                                        </div>
                                                                    }

                                                                    {
                                                                        current.choices[4]

                                                                        &&

                                                                        <div className={styles.choiceAnswerElements}>
                                                                            <div className={applicantList[applicantIndex]?.answerSheet[questionIndex][4] ? styles.choiceNumberSelected : styles.choiceNumberNotSelected}>
                                                                                5
                                                                            </div>

                                                                            <div className={applicantList[applicantIndex]?.answerSheet[questionIndex][4] ? styles.choiceValueSelected : styles.choiceValueNotSelected}>
                                                                                {current.choices[4]}
                                                                            </div>
                                                                        </div>
                                                                    }

                                                                    {
                                                                        current.choices[5]

                                                                        &&

                                                                        <div className={styles.choiceAnswerElements}>
                                                                            <div className={applicantList[applicantIndex]?.answerSheet[questionIndex][5] ? styles.choiceNumberSelected : styles.choiceNumberNotSelected}>
                                                                                6
                                                                            </div>

                                                                            <div className={applicantList[applicantIndex]?.answerSheet[questionIndex][5] ? styles.choiceValueSelected : styles.choiceValueNotSelected}>
                                                                                {current.choices[5]}
                                                                            </div>
                                                                        </div>
                                                                    }

                                                                    {
                                                                        current.choices[6]

                                                                        &&

                                                                        <div className={styles.choiceAnswerElements}>
                                                                            <div className={applicantList[applicantIndex]?.answerSheet[questionIndex][6] ? styles.choiceNumberSelected : styles.choiceNumberNotSelected}>
                                                                                7
                                                                            </div>

                                                                            <div className={applicantList[applicantIndex]?.answerSheet[questionIndex][6] ? styles.choiceValueSelected : styles.choiceValueNotSelected}>
                                                                                {current.choices[6]}
                                                                            </div>
                                                                        </div>
                                                                    }

                                                                    {
                                                                        current.choices[7]

                                                                        &&

                                                                        <div className={styles.choiceAnswerElements}>
                                                                            <div className={applicantList[applicantIndex]?.answerSheet[questionIndex][7] ? styles.choiceNumberSelected : styles.choiceNumberNotSelected}>
                                                                                8
                                                                            </div>

                                                                            <div className={applicantList[applicantIndex]?.answerSheet[questionIndex][7] ? styles.choiceValueSelected : styles.choiceValueNotSelected}>
                                                                                {current.choices[7]}
                                                                            </div>
                                                                        </div>
                                                                    }

                                                                    {
                                                                        current.choices[8]

                                                                        &&

                                                                        <div className={styles.choiceAnswerElements}>
                                                                            <div className={applicantList[applicantIndex]?.answerSheet[questionIndex][8] ? styles.choiceNumberSelected : styles.choiceNumberNotSelected}>
                                                                                9
                                                                            </div>

                                                                            <div className={applicantList[applicantIndex]?.answerSheet[questionIndex][8] ? styles.choiceValueSelected : styles.choiceValueNotSelected}>
                                                                                {current.choices[8]}
                                                                            </div>
                                                                        </div>
                                                                    }

                                                                    {
                                                                        current.choices[9]

                                                                        &&

                                                                        <div className={styles.choiceAnswerElements}>
                                                                            <div className={applicantList[applicantIndex]?.answerSheet[questionIndex][9] ? styles.choiceNumberSelected : styles.choiceNumberNotSelected}>
                                                                                10
                                                                            </div>

                                                                            <div className={applicantList[applicantIndex]?.answerSheet[questionIndex][9] ? styles.choiceValueSelected : styles.choiceValueNotSelected}>
                                                                                {current.choices[9]}
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                </div>
                                                            }

                                                            {
                                                                current.type === "참/거짓"

                                                                &&

                                                                <div>
                                                                    {applicantList[applicantIndex].answerSheet[questionIndex] ? "참" : "거짓"}
                                                                </div>
                                                            }

                                                            {
                                                                current.type === "주관식"

                                                                &&

                                                                <div>
                                                                    {applicantList[applicantIndex].answerSheet[questionIndex]}
                                                                </div>
                                                            }


                                                            {
                                                                current.type === "서술형"

                                                                &&

                                                                <div>
                                                                    {applicantList[applicantIndex].answerSheet[questionIndex]}
                                                                </div>
                                                            }
                                                        </div>

                                                        <div className={styles.questionContainer4}>
                                                            <div className={styles.questionContainer4Left}>
                                                                {
                                                                    applicantList[applicantIndex].reportCard[questionIndex] === questionList[questionIndex].points

                                                                        ?

                                                                        <div className={styles.resultCorrect}>
                                                                            정답
                                                                        </div>

                                                                        :

                                                                        (
                                                                            applicantList[applicantIndex].reportCard[questionIndex] === -1

                                                                                ?

                                                                                <div className={styles.resultBefore}>
                                                                                    채점 전
                                                                                </div>

                                                                                :

                                                                                (
                                                                                    applicantList[applicantIndex].reportCard[questionIndex] === 0

                                                                                        ?

                                                                                        <div className={styles.resultIncorrect}>
                                                                                            오답
                                                                                        </div>

                                                                                        :

                                                                                        <div className={styles.resultSomeCorrect}>
                                                                                            부분 정답
                                                                                        </div>
                                                                                )
                                                                        )
                                                                }
                                                            </div>

                                                            <div className={styles.questionContainer4Right}>
                                                                {
                                                                    applicantList[applicantIndex].reportCard[questionIndex] > -1

                                                                    &&

                                                                    <div
                                                                        className={
                                                                            applicantList[applicantIndex].reportCard[questionIndex] === questionList[questionIndex].points

                                                                                ?

                                                                                styles.pointsCorrect

                                                                                :

                                                                                (
                                                                                    applicantList[applicantIndex].reportCard[questionIndex] === 0

                                                                                        ?

                                                                                        styles.pointsIncorrect

                                                                                        :

                                                                                        styles.pointsSomeCorrect
                                                                                )
                                                                        }
                                                                    >
                                                                        {applicantList[applicantIndex].reportCard[questionIndex]}
                                                                        /
                                                                        {questionList[questionIndex].points}
                                                                        점
                                                                    </div>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))

                                                :

                                                <Error message="해당 응시자는 답안지를 제출하지 않았습니다." />
                                        }
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}