import { useState } from "react";

import AddApplicant from "./AddApplicant";
import GetTestInfo from "../../hooks/GetTestInfo";
import GetApplicantList from "../../hooks/GetApplicantList";

import ApplicantContainer from "./ApplicantContainer";

import Title from "../../../theme/Title";
import Label from "../../../theme/Label";
import SubmitButton from "../../../theme/SubmitButton";

import { toast } from "react-toastify";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

import styles from "./ApplicantsTab.module.css";




export default function ApplicantsTab({ userCode, testCode }: { userCode: string | undefined, testCode: string | undefined }) {
    var testInfo = GetTestInfo(userCode, testCode);
    var applicantList = GetApplicantList(userCode, testCode);



    const [isAddingApplicant, setIsAddingApplicant] = useState<boolean>(false);



    function downloadApplicantList() {
        const ws = XLSX.utils.aoa_to_sheet([
            ["응시자 코드((number | string)[6])", "이름(string)", "점수(number)", "URL(string)"]
        ]);

        applicantList.map((elem: any) => {
            XLSX.utils.sheet_add_aoa(
                ws,
                [
                    [
                        elem.shortApplicantCode,
                        elem.applicantName,

                        `${window.location.origin}/apply/manager/${userCode}/test/${testCode}/applicant/${elem.applicantCode}`
                    ]
                ],
                { origin: -1 }
            );
            ws["!cols"] = [
                { wpx: 120 },
                { wpx: 240 },
                { wpx: 720 }
            ]
            return false;
        });

        const wb: any = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelButter = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const excelFile = new Blob([excelButter], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
        FileSaver.saveAs(excelFile, testInfo.testName + "_응시자 목록" + ".xlsx");
    }


    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <Title>
                    응시자 관리
                </Title>

                <div className={styles.containerTop}>
                    <div className={styles.info}>
                        <Label style={{ marginBottom: 0 }}>
                            총 응시자 수
                        </Label>

                        <div className={styles.infoValue}>
                            {applicantList.length} / 30명
                        </div>
                    </div>

                    <SubmitButton
                        text="응시자 추가"
                        onClick={() => {
                            if (applicantList.length === 30) {
                                toast.error("응시자를 더 이상 추가할 수 없습니다.", { toastId: "" });
                            }

                            else {
                                setIsAddingApplicant(true);
                            }
                        }}
                    />

                    <SubmitButton
                        text="응시자 목록 다운로드"
                        onClick={downloadApplicantList}
                    />
                </div>

                {
                    applicantList.length > 0

                        ?

                        <div>
                            <div className={styles.applicantListHeader}>
                                <div style={{ textAlign: "center" }}>프로필</div>
                                <div style={{ textAlign: "center" }}>응시자 코드</div>
                                <div>이름</div>
                                <div style={{ justifySelf: "center" }}>점수</div>
                                <div style={{ justifySelf: "center" }}>일시정지</div>
                                <div style={{ justifySelf: "center" }}>URL</div>
                                <div style={{ justifySelf: "center" }}>수정</div>
                                <div style={{ justifySelf: "center" }}>삭제</div>
                            </div>

                            {
                                applicantList.map((elem: any) => (
                                    <ApplicantContainer
                                        userCode={userCode}
                                        testCode={testCode}
                                        applicantObject={elem}
                                    />
                                ))
                            }
                        </div>

                        :

                        <div className={styles.empty}>
                            <img className={styles.emptyImage} src={process.env.PUBLIC_URL + "/graphics/empty_box.png"} />

                            <div className={styles.emptyMainText}>
                                응시자가 없습니다.
                            </div>

                            <div className={styles.emptySubText}>
                                오른쪽 상단의 [응시자 추가] 버튼을 눌러서 응시자를 추가해주세요.
                            </div>
                        </div>
                }

                {
                    isAddingApplicant

                    &&

                    <AddApplicant
                        userCode={userCode}
                        testCode={testCode}
                        setIsAddingApplicant={setIsAddingApplicant}
                    />
                }
            </div>
        </div>
    )
}