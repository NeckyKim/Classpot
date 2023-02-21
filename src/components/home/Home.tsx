import { useNavigate } from "react-router-dom";

import styles from "./Home.module.css";



export default function Home() {
    const navigate = useNavigate()

    

    return (
        <div className={styles.homeContainer}>
            <div className={styles.homeContainerTop}>
                지금은 온라인으로
                시험을 보는 시대
            </div>

            <div className={styles.homeContainerBottom}>
                <div className={styles.applyTestButton} onClick={() => {navigate("/apply")}}>
                    시험 응시하기
                </div>

                <div className={styles.sampleTestButton} onClick={() => {navigate("/apply/sample/applicant/sample")}}>
                    체험 해보기
                </div>
            </div>
        </div>
    )
}


