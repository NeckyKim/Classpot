import styles from "./Error.module.css";


export default function Error({ message }: { message: string }) {
    return (
        <div className={styles.errorContainer}>
            {message}
        </div>
    )
}