import { useState, useEffect, useRef } from "react";

import { dbService } from "../../../FirebaseModules";
import { doc, setDoc, collection, onSnapshot, query, orderBy } from "firebase/firestore";

import GetApplicantList from "../../hooks/GetApplicantList";
import GetNotificationList from "../../hooks/GetNotificationList";

import { toast } from "react-toastify";

import styles from "./SuperviseTab.module.css";



interface chattingListProps {
    message: string
    createdBy: string
    createdTime: number
}



export default function SuperviseTab({ testCode }: { testCode: string | undefined }) {
    const [tab, setTab] = useState<number>(1);
    const [applicantIndex, setApplicantIndex] = useState<number>(-1);
    const [applicantCode, setApplicantCode] = useState<string>("");



    // 응시자 목록
    const applicantList: any = GetApplicantList(testCode);



    // 공지사항 목록
    const notificationList: any = GetNotificationList(testCode);
    const [notification, setNotification] = useState<string>("");

    const [isAddingNotification, setIsAddingNotification] = useState<boolean>(false);



    // 응시자별 채팅 목록
    const [chattingList, setChattingList] = useState<any>([]);

    useEffect(() => {
        if (testCode && applicantCode) {
            onSnapshot(query(collection(dbService, "tests", testCode, "applicants", applicantCode, "chattings"), orderBy("createdTime")), (snapshot) => {
                setChattingList(snapshot.docs.map((current) => ({
                    ...current.data()
                })));
            });
        }
    }, [applicantIndex])

    const [message, setMessage] = useState<string>("");



    async function addNotification(event: any) {
        event.preventDefault();

        if (testCode) {
            try {
                await setDoc(doc(collection(dbService, "tests", testCode, "notifications")), {
                    notification: notification,
                    createdTime: Date.now(),
                })

                setNotification("");
                setIsAddingNotification(false);

                toast.success("공지사항이 추가되었습니다.");
            }

            catch (error) {
                console.log(error);
                toast.error("공지사항 추가에 실패했습니다.");
            }
        }
    }



    async function sendChatting(event: any) {
        event.preventDefault();

        if (testCode && applicantCode) {
            try {
                await setDoc(doc(collection(dbService, "tests", testCode, "applicants", applicantCode, "chattings")), {
                    message: message,
                    createdTime: Date.now(),
                    createdBy: "supervisor"
                })

                setMessage("");
            }

            catch (error) {
                console.log(error);
            }
        }
    }



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



    return (
        <div className={styles.container}>
            <div className={styles.containerTop}>
                시험 진행
            </div>

            <div className={styles.containerCenter}>
                <div className={tab === 1 ? styles.tabClicked : styles.tabNotClicked} onClick={() => { setTab(1); }}>
                    전체 공지사항
                </div>

                <div className={tab === 2 ? styles.tabClicked : styles.tabNotClicked} onClick={() => { setTab(2); }}>
                    응시자별 채팅
                </div>
            </div>



            {
                tab === 1

                &&

                <div className={styles.containerBottom}>
                    {
                        isAddingNotification

                            ?

                            <form onSubmit={addNotification}>
                                <textarea
                                    value={notification}
                                    onChange={(event: any) => { setNotification(event.target.value); }}
                                    className={styles.notificationInputBox}
                                    required
                                /><br />

                                <div className={styles.addNotificationButtons}>
                                    <input
                                        type="submit"
                                        value="공지사항 추가"
                                        className={styles.confirmButton}
                                    />

                                    <input
                                        type="button"
                                        value="취소"
                                        className={styles.cancelButton}
                                        onClick={() => {
                                            setIsAddingNotification(false);
                                            setNotification("");
                                        }}
                                    />
                                </div>
                            </form>

                            :

                            <div>
                                <div
                                    className={styles.addNotificationButton}
                                    onClick={() => {
                                        setIsAddingNotification(true);
                                        setNotification("");
                                    }}
                                >
                                    공지사항 추가
                                </div>

                                {notificationList.map((current: any) => (
                                    <div className={styles.notificationElements}>
                                        <div className={styles.notificationElementsText}>
                                            {current.notification}
                                        </div>

                                        <div className={styles.notificationElementsDate}>
                                            {new Date(current.createdTime).toLocaleString("ko-KR")}
                                        </div>
                                    </div>
                                ))}
                            </div>
                    }
                </div>
            }

            {
                tab === 2

                &&

                <div className={styles.chattingContainer}>
                    <div className={styles.chattingContainerLeft}>
                        {
                            applicantList.map((current: any, index: number) => (
                                <div className={applicantIndex === index ? styles.applicantContainerSelected : styles.applicantContainerNotSelected}
                                    onClick={() => {
                                        setApplicantIndex(index);
                                        setApplicantCode(current.applicantCode);
                                    }}
                                >
                                    {current.applicantName}
                                </div>
                            ))
                        }
                    </div>

                    <div className={styles.chattingContainerRight}>
                        {
                            applicantIndex !== -1

                                ?

                                <div className={styles.chattingContainerSelected}>
                                    <div>
                                    {
                                        chattingList.length > 0

                                            ?

                                            <div className={styles.chattingContainerSelectedTop} ref={myRef}>
                                                {
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
                                                                    {applicantList[applicantIndex].applicantName}
                                                                </div>

                                                                <div className={styles.chattingMessageApplicant}>
                                                                    {current.message}
                                                                </div>
                                                            </div>
                                                    ))
                                                }
                                            </div>

                                            :

                                            <div className={styles.chattingContainerEmpty}>
                                                해당 응시자와 진행한 채팅이 없습니다.
                                            </div>
                                    }
                                    </div>

                                    <form className={styles.chattingContainerSelectedBottom} onSubmit={sendChatting}>
                                        <input
                                            value={message}
                                            onChange={(event: any) => { setMessage(event.target.value); }}
                                            className={styles.messageInputBox}
                                            required
                                        />

                                        <input
                                            type="submit"
                                            value="전송"
                                            disabled={!message}
                                            className={styles.sendButton}
                                        />
                                    </form>
                                </div>

                                :

                                <div className={styles.chattingContainerNotSelected}>
                                    응시자를 선택하세요.
                                </div>
                        }
                    </div>
                </div>
            }
        </div>
    )
}