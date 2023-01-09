import { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Alert.module.css";



export default function Alert({ message, navigateTo }: { message: string, navigateTo: string }) {
    const navigate = useNavigate();

    const [showAlert, setShowAlert] = useState<boolean>(true);



    return (
        <div>
            {
                showAlert

                &&

                <div className={styles.alertBackground}>
                    <div className={styles.alertContainer}>
                        {message}

                        <div className={styles.alertButton} onClick={() => {
                            setShowAlert(false);
                            navigate(navigateTo);
                        }}>
                            확인
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}