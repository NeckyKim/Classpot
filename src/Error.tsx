import { useState } from "react";

import { Oval } from "react-loader-spinner";

import styles from "./Error.module.css";



export default function Error({ message }: { message: string }) {
    const [loading, setLoading] = useState(true);

    setTimeout(() => {
        setLoading(false);
    }, 3000)

    return (
        loading

            ?

            <div className={styles.loadingContainer}>
                <Oval
                    height={200}
                    width={200}
                    color="rgb(0, 100, 250)"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    ariaLabel='oval-loading'
                    secondaryColor="transparent"
                    strokeWidth={3}
                    strokeWidthSecondary={3}
                />

                <div className={styles.text}>
                    정보를 불러오는 중입니다.
                </div>

                <div className={styles.subText}>
                    잠시만 기다려주세요.
                </div>
            </div>

            :

            <div className={styles.errorContainer}>
                <div className={styles.text}>
                    {message}
                </div>
            </div>
    )
}
