import Buttons from "../../../style/Buttons";
import SubmitButton from "../../../style/SubmitButton";

import styles from "./Page2.module.css";



export default function Page2({ setPage, checks, setChecks, testInfo }: { setPage: any, checks: boolean[], setChecks: any, testInfo: any }) {
    return (
        <div>
            <div className={styles.comment}>
                다음 <span style={{ fontWeight: "700", color: "rgb(0, 100, 250)" }}>시험 규정</span>을 확인해주세요.
            </div>



            <div className={styles.featureContainer}>
                <div className={styles.featureElementsDisabled}>
                    <div className={styles.featureElementsImageWrapper}>
                        <img className={styles.featureElementsIcon} src={process.env.PUBLIC_URL + "/icons/apply/capture.svg"} />

                        <div className={styles.featureElementsBanned}>
                            <img src={process.env.PUBLIC_URL + "/icons/apply/banned.svg"} />
                        </div>
                    </div>

                    <div>
                        캡처 및 유출 금지
                    </div>
                </div>

                {
                    testInfo?.reEntry

                        ?

                        <div className={styles.featureElementsEnabled}>
                            <div className={styles.featureElementsImageWrapper}>
                                <img className={styles.featureElementsIcon} src={process.env.PUBLIC_URL + "/icons/apply/door.svg"} />
                            </div>

                            <div>
                                재입장 가능
                            </div>
                        </div>

                        :

                        <div className={styles.featureElementsDisabled}>
                            <div className={styles.featureElementsImageWrapper}>
                                <img className={styles.featureElementsIcon} src={process.env.PUBLIC_URL + "/icons/apply/door.svg"} />

                                <div className={styles.featureElementsBanned}>
                                    <img src={process.env.PUBLIC_URL + "/icons/apply/banned.svg"} />
                                </div>
                            </div>

                            <div>
                                재입장 불가능
                            </div>
                        </div>
                }

                {
                    testInfo?.feedback

                        ?

                        <div className={styles.featureElementsEnabled}>
                            <div className={styles.featureElementsImageWrapper}>
                                <img className={styles.featureElementsIcon} src={process.env.PUBLIC_URL + "/icons/apply/feedback.svg"} />
                            </div>

                            <div>
                                시험 성적 공개
                            </div>
                        </div>

                        :

                        <div className={styles.featureElementsDisabled}>
                            <div className={styles.featureElementsImageWrapper}>
                                <img className={styles.featureElementsIcon} src={process.env.PUBLIC_URL + "/icons/apply/feedback.svg"} />

                                <div className={styles.featureElementsBanned}>
                                    <img src={process.env.PUBLIC_URL + "/icons/apply/banned.svg"} />
                                </div>
                            </div>

                            <div>
                                시험 성적 비공개
                            </div>
                        </div>
                }

                {
                    testInfo?.noticeChatting

                    &&

                    <div className={styles.featureElementsEnabled}>
                        <div className={styles.featureElementsImageWrapper}>
                            <img className={styles.featureElementsIcon} src={process.env.PUBLIC_URL + "/icons/apply/chatting.svg"} />
                        </div>

                        관리자 채팅 가능
                    </div>
                }
            </div>



            <ol className={styles.alertContainer}>
                <div>
                    주의 사항
                </div>

                <li>
                    본 시험은 데스크탑 또는 노트북에서 시험을 응시해주세요.
                </li>

                <li>
                    Chrome 브라우저 환경에서 시험을 진행해주세요. 다른 브라우저에서는 시험이 원할히 진행되지 않을 수 있습니다.
                </li>

                <li>
                    원할한 시험 진행을 위해 무선 네트워크(Wi-Fi, LTE, 5G)대신 유선 네트워크(LAN)에서 시험을 응시해주세요. 스터디룸, 카페, 도서관, PC방 등 공용 네트워크를 사용하는 장소는 권장하지 않습니다.
                </li>

                <li>
                    개인의 응시 환경 또는 네트워크 연결 문제로 인한 문제로 인해 발생한 불이익은 책임지지 않으며, 응시자 본인에게 있습니다.
                </li>

                <li>
                    다른 사람이 들어올 수 없는 개인의 공간에서 응시해야 합니다. 스터디룸, 카페, 도서관, PC방 등 장소에서는 응시를 금지합니다.
                </li>

                <li>
                    문제 또는 본인의 답안을 캡처하거나 유출하여 인터넷에 공유하는 행위를 금지합니다.
                </li>

                <li>
                    교재 또는 인터넷을 참고할 수 없습니다.
                </li>

                <li>
                    Chrome을 제외한 다른 외부 프로그램을 이용할 수 없습니다.
                </li>

                <li>
                    타인의 도움을 받는 행위(대리 응시, 실시간 소통, 답안 공유 등)을 모두 금지합니다.
                </li>
            </ol>



            <Buttons>
                <SubmitButton
                    text="다음"
                    onClick={() => {
                        setPage(3);

                        let copy = [...checks];
                        copy[1] = true;
                        setChecks(copy);
                    }}
                />
            </Buttons>
        </div>
    )
}