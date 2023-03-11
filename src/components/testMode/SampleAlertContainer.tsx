

import styles from "./SampleAlertContainer.module.css";



interface sampleAlertContainerProps {
    setSampleAlert: React.Dispatch<React.SetStateAction<boolean>>
}



export default function SampleAlertContainer({ setSampleAlert }: sampleAlertContainerProps) {
    return (
        <div className={styles.background}>
            <div className={styles.container}>
                <div className={styles.containerHeader}>
                    시험 환경 점검
                </div>

                <ul className={styles.containerCenter}>
                    <li>시험 환경 점검은 실제 시험 화면과 동일한 환경에서 진행됩니다.</li>
                    <li>모든 내용은 본 시험과 전혀 연관이 없습니다.</li>
                    <li>시험 환경을 충분히 점검하신 후 본 시험을 시작해주세요.</li>
                </ul>

                <div className={styles.containerBottom}>
                    <div className={styles.exitButton} onClick={() => { setSampleAlert(false); }}>
                        닫기
                    </div>
                </div>
            </div>
        </div>
    )
}