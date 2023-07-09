import { useState, useRef } from "react";

import { dbService } from "../../../FirebaseModules";
import { doc, updateDoc } from "firebase/firestore";

import GetTestInfo from "../../hooks/GetTestInfo";
import GetApplicantList from "../../hooks/GetApplicantList";
import TimeCalculator from "../../hooks/TimeCalculator";

import styles from "./ChattingTab.module.css";



export default function ChattingTab({ userCode, testCode }: { userCode: string | undefined, testCode: string | undefined }) {
    var applicantList = GetApplicantList(userCode, testCode);
    const [applicantIndex, setApplicantIndex] = useState<number | null>(null);

    var testInfo = GetTestInfo(userCode, testCode);
    var applicantList = GetApplicantList(userCode, testCode);
    var isTestTime = TimeCalculator(testInfo.startDate, testInfo.duration);

    const [chattingText, setChattingText] = useState<string>("");
    const chattingRef = useRef<any>();



    async function sendChatting(event: any) {
        event.preventDefault();

        if (userCode && testCode && applicantIndex !== null && applicantList[applicantIndex]?.applicantCode) {
            var currentTime = Date.now();

            localStorage.setItem(`Chatting_${userCode}_${testCode}_${applicantList[applicantIndex]?.applicantCode}`, String(currentTime));

            try {
                setChattingText("");

                await updateDoc(doc(dbService, "users", userCode, "tests", testCode, "applicants", applicantList[applicantIndex]?.applicantCode), {
                    chatting: [...applicantList[applicantIndex].chatting, {
                        sender: "manager",
                        time: currentTime,
                        text: chattingText,
                    }]
                })
            }

            catch (error) {
                console.log(error);
            }
        }
    }



    function scrollToBottom() {
        if (chattingRef.current) {
            chattingRef.current.scrollTop = chattingRef.current.scrollHeight;
        }
    }



    return (
        <div className={styles.container}>
            <div className={styles.applicantListContainer}>
                {
                    applicantList.length > 0

                        ?

                        applicantList.map((elem: any, index: number) => (
                            <div
                                className={applicantIndex === index ? styles.applicantSelected : styles.applicantNotSelected}
                                onClick={() => {
                                    setApplicantIndex(index);
                                    localStorage.setItem(`Chatting_${userCode}_${testCode}_${elem.applicantCode}`, elem.chatting.slice(-1)[0]?.time);
                                }}
                            >
                                <img
                                    className={styles.applicantImage}
                                    src={process.env.PUBLIC_URL + "/icons/dashboard/user.svg"}
                                />

                                <div>
                                    <div className={styles.applicantHeader}>
                                        <div className={styles.applicantName}>
                                            {elem.applicantName}
                                        </div>

                                        <div className={styles.applicantLastTime}>
                                            {
                                                localStorage.getItem(`Chatting_${userCode}_${testCode}_${elem.applicantCode}`) === String(elem.chatting.slice(-1)[0]?.time)

                                                    ?

                                                    (
                                                        elem.chatting.length > 0

                                                        &&

                                                        (
                                                            new Date(Date.now()).toLocaleDateString() === new Date(elem.chatting.slice(-1)[0]?.time).toLocaleDateString()

                                                                ?

                                                                new Date(elem.chatting.slice(-1)[0]?.time).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" })

                                                                :

                                                                new Date(elem.chatting.slice(-1)[0]?.time).toLocaleDateString().slice(0, -1)
                                                        )
                                                    )

                                                    :

                                                    (
                                                        elem.chatting.length > 0

                                                        &&

                                                        <div className={styles.applicantUnread} />
                                                    )
                                            }
                                        </div>
                                    </div>

                                    <div className={styles.applicantLastMessage}>
                                        {elem.chatting.slice(-1)[0]?.text}
                                    </div>
                                </div>
                            </div>
                        ))

                        :

                        <div>
                            응시자가 없습니다.
                        </div>
                }
            </div>



            <div>
                {
                    applicantIndex !== null

                        ?

                        <form
                            onSubmit={(event: any) => {
                                event.preventDefault();

                                if (chattingText) {
                                    sendChatting(event);
                                    scrollToBottom();
                                }
                            }}
                            className={styles.chattingContainer}
                        >
                            <div className={styles.chattingListContainer} ref={chattingRef}>
                                {
                                    applicantList[applicantIndex]?.chatting.length > 0

                                        ?

                                        applicantList[applicantIndex]?.chatting?.map((elem: any, index: number) => (
                                            <div>
                                                {
                                                    (
                                                        index === 0

                                                        ||

                                                        (
                                                            (index > 0)

                                                            &&

                                                            (
                                                                new Date(applicantList[applicantIndex]?.chatting[index - 1]?.time).toLocaleDateString()

                                                                !==

                                                                new Date(elem.time).toLocaleDateString()
                                                            )
                                                        )
                                                    )

                                                    &&

                                                    <div className={styles.time}>
                                                        <div className={styles.timeBorder} />

                                                        <div className={styles.timeValue}>
                                                            {String(new Date(elem.time).toLocaleDateString()).slice(0, -1)}
                                                        </div>

                                                        <div className={styles.timeBorder} />
                                                    </div>
                                                }

                                                {
                                                    (
                                                        index === 0

                                                        ||

                                                        (

                                                            (index > 0)

                                                            &&

                                                            (
                                                                applicantList[applicantIndex]?.chatting[index - 1]?.sender

                                                                !==

                                                                elem.sender
                                                            )
                                                        )

                                                        ||

                                                        (
                                                            (index > 0)

                                                            &&

                                                            (
                                                                new Date(applicantList[applicantIndex]?.chatting[index - 1]?.time).toLocaleDateString()

                                                                !==

                                                                new Date(elem.time).toLocaleDateString()
                                                            )
                                                        )
                                                    )

                                                    &&

                                                    <div className={elem.sender === "manager" ? styles.senderManager : styles.senderApplicant}>
                                                        <div className={styles.senderName}>
                                                            {elem.sender === "manager" ? "감독관" : applicantList[applicantIndex]?.applicantName}
                                                        </div>

                                                        <div className={styles.senderTime}>
                                                            {new Date(applicantList[applicantIndex]?.chatting[index]?.time).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" })}
                                                        </div>
                                                    </div>
                                                }

                                                <div className={elem.sender === "manager" ? styles.textManager : styles.textApplicant}>
                                                    {elem.text}
                                                </div>
                                            </div>
                                        ))

                                        :

                                        <div className={styles.empty}>
                                            채팅 기록이 없습니다.
                                        </div>
                                }
                            </div>

                            <div className={styles.chattingInputBoxZone}>
                                <input
                                    type="text"
                                    value={chattingText}
                                    onChange={(event: any) => setChattingText(event.target.value)}
                                    className={styles.chattingInputBox}
                                    spellCheck={false}
                                    placeholder={isTestTime.isTime === "running" ? "이곳에 내용을 입력하세요." : "채팅 기능은 시험 진행 중일 때만 사용할 수 있습니다."}
                                    disabled={isTestTime.isTime !== "running"}
                                />

                                <button
                                    type="submit"
                                    value="전송"
                                    className={styles.sendButton}
                                    disabled={!chattingText}
                                >
                                    <img src={process.env.PUBLIC_URL + "/icons/dashboard/send.svg"} />
                                </button>
                            </div>
                        </form>

                        :

                        <div className={styles.notSelected}>
                            응시자를 선택해주세요.
                        </div>
                }
            </div>
        </div>
    )
}