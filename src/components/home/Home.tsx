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

                        <div className={styles.demoButton} onClick={() => { navigate("/apply/sample/applicant/sample") }}>
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
                        <img className={styles.marqueeImage1} src={process.env.PUBLIC_URL + "/graphics/desktop1.png"} />
                        <img className={styles.marqueeImage2} src={process.env.PUBLIC_URL + "/graphics/tablet1.png"} />
                        <img className={styles.marqueeImage3} src={process.env.PUBLIC_URL + "/graphics/laptop1.png"} />
                        <img className={styles.marqueeImage4} src={process.env.PUBLIC_URL + "/graphics/ios1.png"} />
                        <img className={styles.marqueeImage5} src={process.env.PUBLIC_URL + "/graphics/android1.png"} />
                        <img className={styles.marqueeImage1} src={process.env.PUBLIC_URL + "/graphics/desktop2.png"} />
                        <img className={styles.marqueeImage2} src={process.env.PUBLIC_URL + "/graphics/tablet2.png"} />
                        <img className={styles.marqueeImage3} src={process.env.PUBLIC_URL + "/graphics/laptop2.png"} />
                        <img className={styles.marqueeImage4} src={process.env.PUBLIC_URL + "/graphics/ios2.png"} />
                        <img className={styles.marqueeImage5} src={process.env.PUBLIC_URL + "/graphics/android2.png"} />
                    </div>

                    <div className={styles.marqueeInner2}>
                        <img className={styles.marqueeImage1} src={process.env.PUBLIC_URL + "/graphics/desktop1.png"} />
                        <img className={styles.marqueeImage2} src={process.env.PUBLIC_URL + "/graphics/tablet1.png"} />
                        <img className={styles.marqueeImage3} src={process.env.PUBLIC_URL + "/graphics/laptop1.png"} />
                        <img className={styles.marqueeImage4} src={process.env.PUBLIC_URL + "/graphics/ios1.png"} />
                        <img className={styles.marqueeImage5} src={process.env.PUBLIC_URL + "/graphics/android1.png"} />
                        <img className={styles.marqueeImage1} src={process.env.PUBLIC_URL + "/graphics/desktop2.png"} />
                        <img className={styles.marqueeImage2} src={process.env.PUBLIC_URL + "/graphics/tablet2.png"} />
                        <img className={styles.marqueeImage3} src={process.env.PUBLIC_URL + "/graphics/laptop2.png"} />
                        <img className={styles.marqueeImage4} src={process.env.PUBLIC_URL + "/graphics/ios2.png"} />
                        <img className={styles.marqueeImage5} src={process.env.PUBLIC_URL + "/graphics/android2.png"} />
                    </div>
                </div>
            </div>

            <div className={styles.page3}>
                <div className={styles.page3Text}>
                    응시자를 위한 최적의 시험 환경을 제공하고 있습니다.
                </div>

                <div className={styles.featureContainer}>
                    <div className={styles.featureElements}>
                        <div className={styles.featureHeader}>
                            <img className={styles.featureImage} src={process.env.PUBLIC_URL + "/icons/chatting_normal.png"} />
                        </div>

                        <div className={styles.featureTitle}>
                            감독관 채팅
                        </div>

                        <div className={styles.featureDescription}>
                            응시자와 감독관이 1:1로 실시간 채팅을 진행할 수 있습니다.
                        </div>
                    </div>

                    <div className={styles.featureElements}>
                        <div className={styles.featureHeader}>
                            <img className={styles.featureImage} src={process.env.PUBLIC_URL + "/icons/notice_normal.png"} />
                        </div>

                        <div className={styles.featureTitle}>
                            공지사항 안내
                        </div>

                        <div className={styles.featureDescription}>
                            모든 응시자에게 공지사항을 전달할 수 있습니다.
                        </div>
                    </div>

                    <div className={styles.featureElements}>
                        <div className={styles.featureHeader}>
                            <img className={styles.featureImage} style={{filter: "brightness(0) invert(1)"}} src={process.env.PUBLIC_URL + "/icons/flag.png"} />
                        </div>

                        <div className={styles.featureTitle}>
                            다시 풀어 볼 문제 체크
                        </div>

                        <div className={styles.featureDescription}>
                            나중에 다시 풀어 볼 문제를 체크할 수 있습니다. 좌측에 주황색으로 표시되어 한 눈에 확인할 수 있습니다.
                        </div>
                    </div>

                    <div className={styles.featureElements}>
                        <div className={styles.featureHeader}>
                            <img className={styles.featureImage} src={process.env.PUBLIC_URL + "/icons/bright_dark.png"} />
                        </div>

                        <div className={styles.featureTitle}>
                            밝은/어두운 화면
                        </div>

                        <div className={styles.featureDescription}>
                            밝은 화면과 어두운 화면을 선택하여 응시할 수 있습니다.
                        </div>
                    </div>

                    <div className={styles.featureElements}>
                        <div className={styles.featureHeader}>
                            <img className={styles.featureImage} style={{filter: "brightness(0) invert(1)"}} src={process.env.PUBLIC_URL + "/icons/width.png"} />
                        </div>

                        <div className={styles.featureTitle}>
                            문제/지문 간격 조절
                        </div>

                        <div className={styles.featureDescription}>
                            문제와 지문 영역의 크기를 응시자가 직접 조절할 수 있습니다.
                        </div>
                    </div>
                </div>
            </div>


            <div className={styles.page4}>
                <div className={styles.manualTab}>
                    <div className={manual === 1 ? styles.tabSelected : styles.tabNotSelected} onClick={() => { setManual(1); }}>
                        <div className={manual === 1 ? styles.tabNumberSelected : styles.tabNumberNotSelected}>
                            1
                        </div>

                        <div className={manual === 1 ? styles.tabTextSelected : styles.tabTextNotSelected}>
                            문제 생성
                        </div>
                    </div>

                    <div className={manual === 2 ? styles.tabSelected : styles.tabNotSelected} onClick={() => { setManual(2); }}>
                        <div className={manual === 2 ? styles.tabNumberSelected : styles.tabNumberNotSelected}>
                            2
                        </div>

                        <div className={manual === 2 ? styles.tabTextSelected : styles.tabTextNotSelected}>
                            응시자 추가
                        </div>
                    </div>

                    <div className={manual === 3 ? styles.tabSelected : styles.tabNotSelected} onClick={() => { setManual(3); }}>
                        <div className={manual === 3 ? styles.tabNumberSelected : styles.tabNumberNotSelected}>
                            3
                        </div>

                        <div className={manual === 3 ? styles.tabTextSelected : styles.tabTextNotSelected}>
                            시험 안내
                        </div>
                    </div>

                    <div className={manual === 4 ? styles.tabSelected : styles.tabNotSelected} onClick={() => { setManual(4); }}>
                        <div className={manual === 4 ? styles.tabNumberSelected : styles.tabNumberNotSelected}>
                            4
                        </div>

                        <div className={manual === 4 ? styles.tabTextSelected : styles.tabTextNotSelected}>
                            시험 진행
                        </div>
                    </div>
                </div>

                {
                    manual === 1

                    &&

                    <div className={styles.manualContainer}>
                        <img className={styles.manualImage} src={process.env.PUBLIC_URL + "/manuals/1.png"} />

                        <div className={styles.manualContainerRight}>
                            <div className={styles.manualHeader}>
                                <img className={styles.manualHeaderImage} src={process.env.PUBLIC_URL + "/icons/questions.png"} />

                                <div className={styles.manualHeaderText}>
                                    문제 생성
                                </div>
                            </div>

                            <div className={styles.manualDescription}>
                                시험 문제를 추가합니다. 유형, 배점, 지문, 정답을 입력할 수 있습니다.<br />
                                시험 관리자는 다음과 같은 유형의 문제를 생성할 수 있습니다.

                                <ul className={styles.manualDescriptionList}>
                                    <li>객관식</li>
                                    <li>참/거짓</li>
                                    <li>주관식</li>
                                    <li>서술형</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                }

                {
                    manual === 2

                    &&

                    <div className={styles.manualContainer}>
                        <img className={styles.manualImage} src={process.env.PUBLIC_URL + "/manuals/2.png"} />

                        <div className={styles.manualContainerRight}>
                            <div className={styles.manualHeader}>
                                <img className={styles.manualHeaderImage} src={process.env.PUBLIC_URL + "/icons/applicants.png"} />

                                <div className={styles.manualHeaderText}>
                                    응시자 추가
                                </div>
                            </div>

                            <div className={styles.manualDescription}>
                                시험에 응시할 응시자를 추가합니다.<br />
                                시험 관리자는 다음 기능을 사용할 수 있습니다.

                                <ul className={styles.manualDescriptionList}>
                                    <li>응시자 이름 변경 및 삭제</li>
                                    <li>실시간 점수 확인</li>
                                    <li>응시자 목록 엑셀 다운로드</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                }

                {
                    manual === 3

                    &&

                    <div className={styles.manualContainer}>
                        <img className={styles.manualImage} src={process.env.PUBLIC_URL + "/manuals/3.png"} />

                        <div className={styles.manualContainerRight}>
                            <div className={styles.manualHeader}>
                                <img className={styles.manualHeaderImage} src={process.env.PUBLIC_URL + "/icons/list.png"} />

                                <div className={styles.manualHeaderText}>
                                    시험 안내
                                </div>
                            </div>

                            <div className={styles.manualDescription}>
                                응시자에게 시험 관련 정보를 안내합니다.<br />
                                시험 관리자는 응시자에게 다음과 같은 정보를 안내해야 합니다.

                                <ul className={styles.manualDescriptionList}>
                                    <li>시작 일시</li>
                                    <li>진행 시간</li>
                                    <li>문항 수</li>
                                    <li>총점</li>
                                    <li>시험 코드</li>
                                    <li>응시자 코드</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                }

                {
                    manual === 4

                    &&

                    <div className={styles.manualContainer}>
                        <img className={styles.manualImage} src={process.env.PUBLIC_URL + "/manuals/4.png"} />

                        <div className={styles.manualContainerRight}>
                            <div className={styles.manualHeader}>
                                <img className={styles.manualHeaderImage} src={process.env.PUBLIC_URL + "/icons/running.png"} />

                                <div className={styles.manualHeaderText}>
                                    시험 진행
                                </div>
                            </div>

                            <div className={styles.manualDescription}>
                                시험 시간이 되면 응시자는 시험을 시작할 수 있습니다.<br />
                                응시자가 다른 문제로 이동하거나 시험을 종료하면 답안지가 자동으로 제출됩니다.<br />
                                응시자는 다음 기능을 사용할 수 있습니다.

                                <ul className={styles.manualDescriptionList}>
                                    <li>문제 체크</li>
                                    <li>밝은/어두운 화면 설정</li>
                                    <li>지문/보기 간격 설정</li>
                                    <li>공지사항 확인</li>
                                    <li>관리자와 채팅</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                }
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