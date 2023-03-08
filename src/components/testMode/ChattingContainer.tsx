import { useEffect, useState, useRef } from "react";

import { dbService } from "../../FirebaseModules";
import { doc, setDoc, collection, onSnapshot, query, orderBy } from "firebase/firestore";

import styles from "./ChattingContainer.module.css";



interface chattingListProps {
    message: string
    createdBy: string
    createdTime: number
}

interface chattingContainerProps {
    testCode: string | undefined
    applicantCode: string | undefined
    applicantName: string
    setIsChatting: React.Dispatch<React.SetStateAction<boolean>>
}



export default function ChattingContainer({ testCode, applicantCode, applicantName, setIsChatting }: chattingContainerProps) {
    // 채팅 불러오기
    const [chattingList, setChattingList] = useState<any>([]);

    useEffect(() => {
        if (testCode && applicantCode) {
            onSnapshot(query(collection(dbService, "tests", testCode, "applicants", applicantCode, "chattings"), orderBy("createdTime")), (snapshot) => {
                setChattingList(snapshot.docs.map((current) => ({
                    ...current.data()
                })));
            });
        }
    }, [])


    
    // 채팅창 스크롤바 밑으로 보내기
    const myRef = useRef<any>();

    const scrollToBottom = () => {
        if (myRef.current) {
            myRef.current.scrollTop = myRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
        sessionStorage.setItem("chattings", String(chattingList[chattingList.length - 1]?.createdTime));
    }, [chattingList]);



    // 채팅 보내기
    const [message, setMessage] = useState<string>("");

    async function sendChatting(event: any) {
        event.preventDefault();

        if (testCode && applicantCode) {
            try {
                var date = Date.now();

                setMessage("");

                await setDoc(doc(collection(dbService, "tests", testCode, "applicants", applicantCode, "chattings")), {
                    message: message,
                    createdTime: date,
                    createdBy: "applicant"
                })

                sessionStorage.setItem("chattings", String(date));
            }

            catch (error) {
                console.log(error);
            }
        }
    }



    return (
        <div className={styles.background}>
            <div className={styles.container}>
                <div className={styles.containerHeader}>
                    채팅

                    <img
                        className={styles.closeIcon}
                        src={process.env.PUBLIC_URL + "/icons/close.png"}
                        onClick={() => { 
                            setIsChatting(false);
                            setMessage("");
                        }}
                    />
                </div>

                <div className={styles.containerCenter} ref={myRef}>
                    {
                        chattingList.length > 0

                        ?

                            chattingList.map((current: chattingListProps) => (
                                current.createdBy === "supervisor"
    
                                    ?
    
                                    <div className={styles.chattingElementsSupervisor}>
                                        <div className={styles.chattingHeaderSupervisor}>
                                            감독관
                                        </div>
    
                                        <div className={styles.chattingMessageSupervisor}>
                                            {current.message}
                                        </div>
                                    </div>
    
                                    :
    
                                    <div className={styles.chattingElementsApplicant}>
                                        <div className={styles.chattingHeaderApplicant}>
                                            {applicantName}
                                        </div>
    
                                        <div className={styles.chattingMessageApplicant}>
                                            {current.message}
                                        </div>
                                    </div>
                            ))
                        

                        :

                        <div className={styles.containerCenterEmpty}>
                            채팅이 없습니다.
                        </div>
                    }
                </div>

                <form className={styles.containerBottom}>
                    <input
                        type="text"
                        className={styles.messageInputBox}
                        value={message}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setMessage(event.target.value); }}
                        required
                    />

                    <button
                        className={styles.sendButton}
                        onClick={() => {
                            if (message) {
                                sendChatting(event);
                            }
                        }}
                        disabled={!message}
                    >
                        전송
                    </button>
                </form>
            </div>
        </div>
    )
}