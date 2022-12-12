import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { dbService } from "../../../FirebaseModules";
import { doc, deleteDoc, collection } from "firebase/firestore";

import GenerateApplyCode from "../../hooks/GenerateApplyCode";

import styles from "./TestSettings.module.css";



export default function TestSettingsTab({ testInfo, testCode }: { testInfo: any, testCode: string | undefined }) {
    const navigate = useNavigate();

    const [isEditingSettings, setIsEditingSettings] = useState<boolean>(false);

    const [isDeletingTest, setIsDeletingTest] = useState<boolean>(false);
    const [deletingTestConfirm, setDeletingTestConfirm] = useState<string>("");



    // 시험 추가
    async function deleteTest(event: any) {
        event.preventDefault();

        if (testCode) {
            try {
                await deleteDoc(doc(dbService, "tests", testCode))

                navigate("/");
                setIsDeletingTest(false);

                alert("시험 삭제가 완료되었습니다.");
            }

            catch (error) {
                console.log(error);
                alert("시험 삭제에 실패했습니다.");
            }
        }
    }



    return (
        <div>
            {
                isEditingSettings

                &&

                <div>
                </div>
            }



            {
                isDeletingTest

                &&

                <div className={styles.background}>
                    <form onSubmit={deleteTest} className={styles.deleteContainer}>
                        <div className={styles.header}>
                            시험 삭제
                        </div>

                        시험을 삭제하려면 시험 이름을 입력하신 후 확인을 누르세요.<br />
                        이 작업은 되돌릴 수 없습니다.

                        <input type="text" onChange={(event: any) => { setDeletingTestConfirm(event.target.value) }} className={styles.deleteConfirmTextBox} />

                        <input type="submit" disabled={!(testInfo.testName === deletingTestConfirm)} value="삭제" className={styles.deleteConfirmButton} />

                        <input type="button" value="취소" className={styles.cancelButton} onClick={() => { setIsDeletingTest(false); }} />
                    </form>
                </div>
            }



            <div>
                <div className={styles.header}>
                    응시 코드
                </div>

                <div className={styles.applyCodeContainer}>
                    <div className={styles.applyCode}>
                        {testInfo?.applyCode}
                    </div>

                    <div className={styles.applyCodeCopyButton} onClick={() => {
                        try {
                            navigator.clipboard.writeText(testInfo?.applyCode);
                            alert("응시 코드가 복사되었습니다.");
                        }

                        catch (error) {
                            alert("응시 코드 복사에 실패하였습니다.")
                        }
                    }}>
                        복사하기
                    </div>

                    <div className={styles.applyCodeText}>
                        위의 코드를 응시자들에게 알려주세요.
                    </div>
                </div>



                <div className={styles.header}>
                    시간 설정
                </div>

                <div className={styles.testDateContainer}>
                    <div>
                        <div>
                            시작 일시
                        </div>

                        <div>
                            {new Date(testInfo?.startDate).toLocaleString("ko-KR")}
                        </div>
                    </div>

                    <div>
                        <div>
                            응시 시간
                        </div>

                        <div>
                            {testInfo?.duration}분
                        </div>
                    </div>


                    <div>
                        <div>
                            종료 일시
                        </div>

                        <div>
                            {new Date(testInfo?.startDate + testInfo?.duration * 60000).toLocaleString("ko-KR")}
                        </div>
                    </div>
                </div>



                <div className={styles.header}>
                    시험 삭제
                </div>

                <div onClick={() => { setIsDeletingTest(true); }} className={styles.deleteButton}>
                    시험 삭제
                </div>
            </div>
        </div>
    )
}