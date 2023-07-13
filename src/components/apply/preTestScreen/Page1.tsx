import Buttons from "../../../style/Buttons";
import SubmitButton from "../../../style/SubmitButton";

import styles from "./Page1.module.css";



export default function Page1({ setPage, checks, setChecks, testInfo, applicantInfo, questionList }: { setPage: any, checks: boolean[], setChecks: any, testInfo: any, applicantInfo: any, questionList: any }) {
    return (
        <div>
            <div className={styles.comment}>
                안녕하세요,&nbsp;
                <span style={{ fontWeight: "700", color: "rgb(0, 100, 250)" }}>{applicantInfo?.applicantName}</span>님.
                <br />
                시작하기 전에 <span style={{ fontWeight: "700", color: "rgb(0, 100, 250)" }}>시험 기본 정보</span>를 확인해주세요.
            </div>



            <div className={styles.header}>
                기본 정보
            </div>

            <div className={styles.infoContainer}>
                <div
                    className={styles.infoElements}
                    style={{
                        gridColumnStart: 1,
                        gridColumnEnd: 3,
                    }}
                >
                    <div className={styles.infoLabel}>
                        시험 이름
                    </div>

                    <div className={styles.infoValue}>
                        {testInfo.testName}
                    </div>
                </div>

                <div
                    className={styles.infoElements}
                    style={{
                        gridColumnStart: 1,
                        gridColumnEnd: 3,
                    }}
                >
                    <div className={styles.infoLabel}>
                        관리자
                    </div>

                    <div className={styles.infoValue}>
                        {testInfo.managerName}
                    </div>
                </div>

                <div
                    className={styles.infoElements}
                    style={{
                        gridColumnStart: 1,
                        gridColumnEnd: 3,
                    }}
                >
                    <div className={styles.infoLabel}>
                        응시자
                    </div>

                    <div className={styles.infoValue}>
                        {applicantInfo?.applicantName}
                    </div>
                </div>
            </div>



            <div className={styles.header}>
                시험 진행 기간
            </div>

            <div className={styles.infoContainer}>
                <div className={styles.infoElements}>
                    <div className={styles.infoLabel}>
                        시험 시작 일시
                    </div>

                    <div className={styles.infoValue}>
                        {new Date(testInfo.startDate).getFullYear()}년&nbsp;
                        {new Date(testInfo.startDate).getMonth() + 1}월&nbsp;
                        {new Date(testInfo.startDate).getDate()}일&nbsp;
                        {String(new Date(testInfo.startDate).getHours()).padStart(2, "0")}:
                        {String(new Date(testInfo.startDate).getMinutes()).padStart(2, "0")}
                    </div>
                </div>

                <div className={styles.infoElements}>
                    <div className={styles.infoLabel}>
                        시험 종료 일시
                    </div>

                    <div className={styles.infoValue}>
                        {new Date(testInfo.startDate + testInfo.duration * 60000).getFullYear()}년&nbsp;
                        {new Date(testInfo.startDate + testInfo.duration * 60000).getMonth() + 1}월&nbsp;
                        {new Date(testInfo.startDate + testInfo.duration * 60000).getDate()}일&nbsp;
                        {String(new Date(testInfo.startDate + testInfo.duration * 60000).getHours()).padStart(2, "0")}:
                        {String(new Date(testInfo.startDate + testInfo.duration * 60000).getMinutes()).padStart(2, "0")}
                    </div>
                </div>

                <div className={styles.infoElements}>
                    <div className={styles.infoLabel}>
                        진행 시간
                    </div>

                    <div className={styles.infoValue}>
                        {testInfo.duration}분
                    </div>
                </div>
            </div>



            {
                testInfo.preview

                &&

                <>
                    <div className={styles.header}>
                        문항 구성
                    </div>

                    <div className={styles.infoContainer}>
                        <div className={styles.infoElements}>
                            <div className={styles.infoLabel}>
                                문제 수
                            </div>

                            <div className={styles.infoValue}>
                                총 {questionList.length}문항
                            </div>
                        </div>

                        <div className={styles.infoElements}>
                            <div className={styles.infoLabel}>
                                총점
                            </div>

                            <div className={styles.infoValue}>
                                총 {questionList.length !== 0 ? (questionList.length > 0 && questionList.map((row: any) => row.points).reduce((sum: number, current: number) => { return sum + current; }, 0)) : 0}점
                            </div>
                        </div>

                        <div className={styles.infoElements}>
                            <div className={styles.infoLabel}>
                                문제 유형
                            </div>

                            <div className={styles.infoValue}>
                                {new Set(questionList.map((x: any) => x.type)).has("mc") && "객관식　"}
                                {new Set(questionList.map((x: any) => x.type)).has("sa") && "주관식　"}
                                {new Set(questionList.map((x: any) => x.type)).has("tf") && "참/거짓　"}
                                {new Set(questionList.map((x: any) => x.type)).has("essay") && "서술형"}
                            </div>
                        </div>
                    </div>
                </>
            }

            {
                testInfo.feedback

                &&

                <>
                    <div className={styles.header}>
                        성적 공개 기간
                    </div>

                    <div className={styles.infoContainer}>
                        <div className={styles.infoElements}>
                            <div className={styles.infoLabel}>
                                공개 시작 일시
                            </div>

                            <div className={styles.infoValue}>
                                {new Date(testInfo.feedbackTime.start).getFullYear()}년&nbsp;
                                {new Date(testInfo.feedbackTime.start).getMonth() + 1}월&nbsp;
                                {new Date(testInfo.feedbackTime.start).getDate()}일&nbsp;
                                {String(new Date(testInfo.feedbackTime.start).getHours()).padStart(2, "0")}:
                                {String(new Date(testInfo.feedbackTime.start).getMinutes()).padStart(2, "0")}
                            </div>
                        </div>

                        <div className={styles.infoElements}>
                            <div className={styles.infoLabel}>
                                공개 종료 일시
                            </div>

                            <div className={styles.infoValue}>
                                {new Date(testInfo.feedbackTime.finish).getFullYear()}년&nbsp;
                                {new Date(testInfo.feedbackTime.finish).getMonth() + 1}월&nbsp;
                                {new Date(testInfo.feedbackTime.finish).getDate()}일&nbsp;
                                {String(new Date(testInfo.feedbackTime.finish).getHours()).padStart(2, "0")}:
                                {String(new Date(testInfo.feedbackTime.finish).getMinutes()).padStart(2, "0")}
                            </div>
                        </div>

                        <div
                            className={styles.infoElements}
                            style={{
                                gridColumnStart: 1,
                                gridColumnEnd: 3,
                            }}
                        >
                            <div className={styles.infoLabel}>
                                공개 항목
                            </div>

                            <div className={styles.infoValue}>
                                {testInfo.feedbackQnA.question && "문제　"}
                                {testInfo.feedbackQnA.answer && "정답　"}
                                {testInfo.feedbackScore.score && "본인 점수　"}
                                {testInfo.feedbackScore.average && "전체 평균 점수　"}
                                {testInfo.feedbackScore.rank && "등수"}
                            </div>
                        </div>
                    </div>
                </>
            }



            <Buttons>
                <SubmitButton
                    text="다음"
                    onClick={() => {
                        setPage(2);

                        let copy = [...checks];
                        copy[0] = true;
                        setChecks(copy);
                    }}
                />
            </Buttons>
        </div>
    )
}