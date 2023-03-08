import { useState, useEffect } from "react";

import { dbService } from "../../../FirebaseModules";
import { doc, setDoc, collection, onSnapshot, query, orderBy } from "firebase/firestore";

import GetApplicantList from "../../hooks/GetApplicantList";
import GetNotificationList from "../../hooks/GetNotificationList";

import { toast } from "react-toastify";

import styles from "./SuperviseTab.module.css";



export default function SuperviseTab({ testCode }: { testCode: string | undefined }) {
    const [tab, setTab] = useState<number>(1);
    const [applicantNumber, setApplicantNumber] = useState<number>(0);
    const [applicantCode, setApplicantCode] = useState<string>("");



    // 응시자 목록
    const applicantList: any = GetApplicantList(testCode);





    // 공지사항 목록
    const notificationList: any = GetNotificationList(testCode);
    const [notification, setNotification] = useState<string>("");

    const [isAddingNotification, setIsAddingNotification] = useState<boolean>(false);



    // 응시자별 채팅 목록

    const [messageList, setMessageList] = useState<any>([]);

    useEffect(() => {
        if (testCode && applicantCode) {
            onSnapshot(query(collection(dbService, "tests", testCode, "applicants", applicantCode, "messages"), orderBy("createdTime")), (snapshot) => {
                setMessageList(snapshot.docs.map((current) => ({
                    ...current.data()
                })));
            });
        }
    }, [applicantNumber])

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



    async function sendMessage(event: any) {
        event.preventDefault();

        if (testCode && applicantCode) {
            try {
                await setDoc(doc(collection(dbService, "tests", testCode, "applicants", applicantCode, "messages")), {
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

                <div className={styles.containerBottom}>
                    <div className={styles.chattingContainer}>
                        {
                            applicantList.map((current: any, index: number) => (
                                <div onClick={() => {
                                    setApplicantNumber(index);
                                    setApplicantCode(current.applicantCode);
                                }}>
                                    {current.applicantName}
                                </div>
                            ))
                        }

                        {applicantNumber}<br />
                        {applicantCode}<br />


                        {
                            messageList.length > 0

                                ?

                                <div>
                                    {
                                        messageList.map((current: any) => (
                                            <div>
                                                {current.message}
                                            </div>
                                        ))
                                    }
                                </div>

                                :

                                "해당 응시자와 진행한 채팅이 없습니다."
                        }

                        <form onSubmit={sendMessage}>
                            <input
                                value={message}
                                onChange={(event: any) => { setMessage(event.target.value); }}
                                className={styles.notificationInputBox}
                                required
                            /><br />

                            <input
                                type="submit"
                                value="전송"
                                className={styles.confirmButton}
                            />
                        </form>
                    </div>
                </div>
            }
        </div>
    )
}