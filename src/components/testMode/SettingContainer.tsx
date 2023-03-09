import styles from "./SettingContainer.module.css";



interface notificationContainerProps {
    width: number
    isDarkMode: boolean
    split: boolean
    setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>
    setSplit: React.Dispatch<React.SetStateAction<boolean>>
    setIsNotification: React.Dispatch<React.SetStateAction<boolean>>
    setIsSetting: React.Dispatch<React.SetStateAction<boolean>>
}



export default function SettingContainer({ setIsSetting, isDarkMode, setIsDarkMode, width, split, setSplit }: notificationContainerProps) {
    return (
        <div className={styles.background}>
            <div className={styles.container}>
                <div className={styles.containerHeader}>
                    설정

                    <img
                        className={styles.closeIcon}
                        src={process.env.PUBLIC_URL + "/icons/close.png"}
                        onClick={() => { setIsSetting(false); }}
                    />
                </div>

                <div className={styles.settingContainer}>
                    <div className={styles.settingHeader}>
                        화면 밝기
                    </div>

                    <div
                        className={!isDarkMode ? styles.settingsElementsButtonClicked : styles.settingsElementsButtonNotClicked}
                        onClick={() => { setIsDarkMode(false); }}
                    >
                        <img
                            className={styles.settingsIcon}
                            src={process.env.PUBLIC_URL + "/icons/bright.png"}
                            style={!isDarkMode ? { filter: "invert()" } : {}}
                        />

                        밝게
                    </div>

                    <div
                        className={isDarkMode ? styles.settingsElementsButtonClicked : styles.settingsElementsButtonNotClicked}
                        onClick={() => { setIsDarkMode(true); }}
                    >
                        <img
                            className={styles.settingsIcon}
                            src={process.env.PUBLIC_URL + "/icons/dark.png"}
                            style={isDarkMode ? { filter: "invert()" } : {}}
                        />

                        어둡게
                    </div>

                    {
                        width > 1200

                        &&

                        <div style={{ marginTop: "30px" }}>
                            <div className={styles.settingHeader}>
                                화면 구성
                            </div>

                            <div
                                className={split ? styles.settingsElementsButtonClicked : styles.settingsElementsButtonNotClicked}
                                onClick={() => { setSplit(true); }}
                            >
                                <img
                                    className={styles.settingsIcon}
                                    src={process.env.PUBLIC_URL + "/icons/RL.png"}
                                    style={split ? { filter: "invert()" } : {}}
                                />

                                좌우로 분할
                            </div>

                            <div
                                className={!split ? styles.settingsElementsButtonClicked : styles.settingsElementsButtonNotClicked}
                                onClick={() => { setSplit(false); }}
                            >
                                <img
                                    className={styles.settingsIcon}
                                    src={process.env.PUBLIC_URL + "/icons/UD.png"}
                                    style={!split ? { filter: "invert()" } : {}}
                                />

                                위아래로 분할
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}