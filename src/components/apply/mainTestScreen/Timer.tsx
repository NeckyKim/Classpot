import styles from "./Timer.module.css";



export default function Timer({ isTestTime }: { isTestTime: any }) {
    return (
        <div className={styles.timer}>
        <img className={isTestTime.remainingTime.hours > 0 ? styles.timerIconWhite : styles.timerIconRed} src={process.env.PUBLIC_URL + "/icons/apply/timer.svg"} />

        <div className={isTestTime.remainingTime.hours > 0 ? styles.timerLabelWhite : styles.timerLabelRed}>
            남은 시간
        </div>

        <div className={isTestTime.remainingTime.hours > 0 ? styles.timerValueWhite : styles.timerValueRed} >
            {isTestTime.remainingTime.hours > 0 && isTestTime.remainingTime.hours + ":"}
            {String(isTestTime.remainingTime.minutes).padStart(2, "0")}:
            {String(isTestTime.remainingTime.seconds).padStart(2, "0")}
        </div>
    </div>
    )
}