import { useEffect, useRef } from "react";

import styles from "./NotificationContainer.module.css";



interface notificationListProps {
    notification: string
    createdBy: string
    createdTime: number
}

interface notificationContainerProps {
    notificationList: notificationListProps[]
    setIsNotification: React.Dispatch<React.SetStateAction<boolean>>
}



export default function NotificationContainer({ notificationList, setIsNotification }: notificationContainerProps) {
    // 공지사항창 스크롤바 밑으로 보내기
    const myRef = useRef<any>();

    const scrollToBottom = () => {
        if (myRef.current) {
            myRef.current.scrollTop = myRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
        sessionStorage.setItem("notifications", String(notificationList[notificationList.length - 1]?.createdTime));
    }, [notificationList]);



    return (
        <div className={styles.background}>
            <div className={styles.container}>
                <div className={styles.containerHeader}>
                    공지사항

                    <img
                        className={styles.closeIcon}
                        src={process.env.PUBLIC_URL + "/icons/close.png"}
                        onClick={() => { setIsNotification(false); }}
                    />
                </div>

                <div className={styles.containerCenter} ref={myRef}>
                    {
                        notificationList.length > 0

                            ?

                            notificationList.map((current: any) => (
                                <div>
                                    <div className={styles.notificationText}>
                                        {current.notification}
                                    </div>

                                    <div className={styles.notificationDate}>
                                        {new Date(current.createdTime).toLocaleString("ko-KR")}
                                    </div>
                                </div>
                            ))

                            :

                            <div className={styles.containerCenterEmpty}>
                                공지사항이 없습니다.
                            </div>
                    }
                </div>

                <div className={styles.containerBottom}>
                    <div className={styles.exitButton} onClick={() => { setIsNotification(false); }}>
                        닫기
                    </div>
                </div>
            </div>
        </div>
    )
}