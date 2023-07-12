import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Home.module.css";



export default function Home() {
    const navigate = useNavigate()

    const [manual, setManual] = useState<number>(1);


    // 화면 너비
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        window.addEventListener("resize", () => { setWidth(window.innerWidth); });
    });


    return (
        <div className={styles.homeContainer}>
            <div className={styles.page1}>
                <div className={styles.page1Text}>
                    <div className={styles.page1SubText}>
                        온라인 시험 플랫폼 테스트콘
                    </div>

                    <div className={styles.page1MainText}>
                        테스트콘으로<span className={styles.enter} />빠르고 간편하게<br />
                        온라인 시험을<span className={styles.enter} />진행해보세요.
                    </div>

                    <div className={styles.page1ButtonsZone}>
                        <div className={styles.applyButton} onClick={() => { navigate("/apply") }}>
                            시험 응시하기
                        </div>

                        <div className={styles.demoButton} onClick={() => { navigate("apply/manager/sample/test/sample/applicant/sample") }}>
                            테스트콘 체험하기
                        </div>
                    </div>
                </div>

                <svg className={styles.background} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                    <defs>
                        <radialGradient id="Gradient1" cx="50%" cy="50%" fx="0.441602%" fy="50%" r=".5">
                            <animate attributeName="fx" dur="34s" values="0%;3%;0%" repeatCount="indefinite" />
                            <stop offset="0%" stop-color="rgba(100, 250, 100, 1)" />
                            <stop offset="100%" stop-color="rgba(100, 250, 100, 0)" />
                        </radialGradient>

                        <radialGradient id="Gradient2" cx="50%" cy="50%" fx="2.68147%" fy="50%" r=".5">
                            <animate attributeName="fx" dur="23.5s" values="0%;3%;0%" repeatCount="indefinite" />
                            <stop offset="0%" stop-color="rgba(0, 220, 220, 1)" />
                            <stop offset="100%" stop-color="rgba(0, 220, 220, 0)" />
                        </radialGradient>

                        <radialGradient id="Gradient3" cx="50%" cy="50%" fx="0.836536%" fy="50%" r=".5">
                            <animate attributeName="fx" dur="21.5s" values="0%;3%;0%" repeatCount="indefinite" />
                            <stop offset="0%" stop-color="rgba(0, 100, 250, 1)" />
                            <stop offset="100%" stop-color="rgba(0, 100, 250, 0)" />
                        </radialGradient>

                        <radialGradient id="Gradient4" cx="50%" cy="50%" fx="4.56417%" fy="50%" r=".5">
                            <animate attributeName="fx" dur="23s" values="0%;5%;0%" repeatCount="indefinite" />
                            <stop offset="0%" stop-color="rgba(0, 255, 0, 1)" />
                            <stop offset="100%" stop-color="rgba(0, 255, 0, 0)" />
                        </radialGradient>

                        <radialGradient id="Gradient5" cx="50%" cy="50%" fx="2.65405%" fy="50%" r=".5">
                            <animate attributeName="fx" dur="24.5s" values="0%;5%;0%" repeatCount="indefinite" />
                            <stop offset="0%" stop-color="rgba(0, 0, 255, 1)" />
                            <stop offset="100%" stop-color="rgba(0, 0, 255, 0)" />
                        </radialGradient>

                        <radialGradient id="Gradient6" cx="50%" cy="50%" fx="0.981338%" fy="50%" r=".5">
                            <animate attributeName="fx" dur="25.5s" values="0%;5%;0%" repeatCount="indefinite" />
                            <stop offset="0%" stop-color="rgba(255, 0, 0, 1)" />
                            <stop offset="100%" stop-color="rgba(255, 0, 0, 0)" />
                        </radialGradient>
                    </defs>

                    <rect x="13.744%" y="1.18473%" width="100%" height="100%" fill="url(#Gradient1)"
                        transform="rotate(334.41 50 50)">
                        <animate attributeName="x" dur="20s" values="25%;0%;25%" repeatCount="indefinite" />
                        <animate attributeName="y" dur="21s" values="0%;25%;0%" repeatCount="indefinite" />
                        <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="7s"
                            repeatCount="indefinite"></animateTransform>
                    </rect>

                    <rect x="-2.17916%" y="35.4267%" width="100%" height="100%" fill="url(#Gradient2)"
                        transform="rotate(255.072 50 50)">
                        <animate attributeName="x" dur="23s" values="-25%;0%;-25%" repeatCount="indefinite" />
                        <animate attributeName="y" dur="24s" values="0%;50%;0%" repeatCount="indefinite" />
                        <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="12s"
                            repeatCount="indefinite"></animateTransform>
                    </rect>

                    <rect x="9.00483%" y="14.5733%" width="100%" height="100%" fill="url(#Gradient3)"
                        transform="rotate(139.903 50 50)">
                        <animate attributeName="x" dur="25s" values="0%;25%;0%" repeatCount="indefinite" />
                        <animate attributeName="y" dur="12s" values="0%;25%;0%" repeatCount="indefinite" />
                        <animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="9s"
                            repeatCount="indefinite"></animateTransform>
                    </rect>
                </svg>
            </div>


            <div className={styles.page2}>
                <div className={styles.page2Text1}>
                    종이 시험은 더 이상 그만,<span className={styles.enter} />이제는 <span className={styles.page2TextHighlight}>디지털</span> 시대입니다.
                </div>

                <div className={styles.page2Text2}>
                    데스크톱, 태블릿, 노트북, 스마트폰으로 언제나 어디서든 시험을 진행할 수 있습니다.
                </div>

                <div className={styles.marquee}>
                    <div className={styles.marqueeInner1}>
                        <img className={styles.marqueeImage1} src={process.env.PUBLIC_URL + "/images/desktop1.png"} />
                        <img className={styles.marqueeImage2} src={process.env.PUBLIC_URL + "/images/tablet1.png"} />
                        <img className={styles.marqueeImage3} src={process.env.PUBLIC_URL + "/images/laptop1.png"} />
                        <img className={styles.marqueeImage4} src={process.env.PUBLIC_URL + "/images/ios1.png"} />
                        <img className={styles.marqueeImage5} src={process.env.PUBLIC_URL + "/images/android1.png"} />
                        <img className={styles.marqueeImage1} src={process.env.PUBLIC_URL + "/images/desktop2.png"} />
                        <img className={styles.marqueeImage2} src={process.env.PUBLIC_URL + "/images/tablet2.png"} />
                        <img className={styles.marqueeImage3} src={process.env.PUBLIC_URL + "/images/laptop2.png"} />
                        <img className={styles.marqueeImage4} src={process.env.PUBLIC_URL + "/images/ios2.png"} />
                        <img className={styles.marqueeImage5} src={process.env.PUBLIC_URL + "/images/android2.png"} />
                    </div>

                    <div className={styles.marqueeInner2}>
                        <img className={styles.marqueeImage1} src={process.env.PUBLIC_URL + "/images/desktop1.png"} />
                        <img className={styles.marqueeImage2} src={process.env.PUBLIC_URL + "/images/tablet1.png"} />
                        <img className={styles.marqueeImage3} src={process.env.PUBLIC_URL + "/images/laptop1.png"} />
                        <img className={styles.marqueeImage4} src={process.env.PUBLIC_URL + "/images/ios1.png"} />
                        <img className={styles.marqueeImage5} src={process.env.PUBLIC_URL + "/images/android1.png"} />
                        <img className={styles.marqueeImage1} src={process.env.PUBLIC_URL + "/images/desktop2.png"} />
                        <img className={styles.marqueeImage2} src={process.env.PUBLIC_URL + "/images/tablet2.png"} />
                        <img className={styles.marqueeImage3} src={process.env.PUBLIC_URL + "/images/laptop2.png"} />
                        <img className={styles.marqueeImage4} src={process.env.PUBLIC_URL + "/images/ios2.png"} />
                        <img className={styles.marqueeImage5} src={process.env.PUBLIC_URL + "/images/android2.png"} />
                    </div>
                </div>
            </div>

        
        
            <div className={styles.footer}>
                <img className={styles.footerImage} src={process.env.PUBLIC_URL + "/logos/logo_black.png"} />

                <div className={styles.footerText}>
                    ⓒ 2023 Testcon. All rights reserved.
                </div>
            </div>
        </div>
    )
}