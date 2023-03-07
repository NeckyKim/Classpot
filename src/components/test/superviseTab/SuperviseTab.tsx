import { useState, useEffect } from "react";

import { dbService } from "../../../FirebaseModules";
import { doc, setDoc, collection } from "firebase/firestore";

import GetNotificationList from "../../hooks/GetNotificationList";

import { toast } from "react-toastify";

import styles from "./SuperviseTab.module.css";



export default function SuperviseTab({ testCode }: { testCode: string | undefined }) {
    // 질문 목록
    const notificationList: any = GetNotificationList(testCode);

    const [isAddingNotification, setIsAddingNotification] = useState<boolean>(false);

    const [notification, setNotification] = useState<string>("");



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



    return (
        <div className={styles.superviseTabContainer}>
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
    )
}