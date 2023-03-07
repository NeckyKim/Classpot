import { useState } from "react";
import { useNavigate } from "react-router-dom";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import styles from "./Home.module.css";



export default function Home() {
    const navigate = useNavigate()

    const [processTab, setProcessTab] = useState<number>(1);



    return (
        <div className={styles.homeContainer}>


            <div className={styles.page1}>
                <div className={styles.introContainer}>
                    <div className={styles.introText}>
                        이제는 온라인으로 시험을 보는 시대
                    </div>

                    <img className={styles.introLogo} src={process.env.PUBLIC_URL + "/logos/logo_textonly.png"} />
                </div>

                <div className={styles.buttonContainer}>
                    <div>
                        <div className={styles.buttonHeader}>
                            시험을 응시하려 오셨나요?
                        </div>

                        <div className={styles.applyTestButton} onClick={() => { navigate("/apply") }}>
                            시험 응시하기
                        </div>
                    </div>

                    <div>
                        <div className={styles.buttonHeader}>
                            시험 환경을 체험해보세요.
                        </div>
                        <div className={styles.sampleTestButton} onClick={() => { navigate("/apply/sample/applicant/sample") }}>
                            체험 해보기
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.page2}>
                <div className={styles.aboutTextContainer}>
                    <div className={styles.aboutText1}>
                        데스크탑, 태블릿, 스마트폰
                    </div>

                    <div className={styles.aboutText2}>
                        어디서든 시험을 진행할 수 있습니다.
                    </div>

                    <div className={styles.aboutText3}>
                        모바일 환경에서 시험을 응시하면 데스크탑 환경의 일부 기능을 사용할 수 없습니다.
                    </div>
                </div>

                <img className={styles.aboutImage} src={process.env.PUBLIC_URL + "/graphics/home.png"} />
            </div>

            <div className={styles.page3}>
                <div className={styles.processTabContainer}>
                    <div className={styles.processTabButton} onClick={() => { setProcessTab(1); }}>
                        <div className={processTab === 1 ? styles.processTabButtonNumberSelected : styles.processTabButtonNumberNotSelected}>
                            1
                        </div>

                        <div className={processTab === 1 ? styles.processTabButtonTextSelected : styles.processTabButtonTextNotSelected}>
                            문제 생성
                        </div>
                    </div>

                    <div className={styles.processTabButton} onClick={() => { setProcessTab(2); }}>
                        <div className={processTab === 2 ? styles.processTabButtonNumberSelected : styles.processTabButtonNumberNotSelected}>
                            2
                        </div>

                        <div className={processTab === 2 ? styles.processTabButtonTextSelected : styles.processTabButtonTextNotSelected}>
                            응시자 등록
                        </div>
                    </div>

                    <div className={styles.processTabButton} onClick={() => { setProcessTab(3); }}>
                        <div className={processTab === 3 ? styles.processTabButtonNumberSelected : styles.processTabButtonNumberNotSelected}>
                            3
                        </div>

                        <div className={processTab === 3 ? styles.processTabButtonTextSelected : styles.processTabButtonTextNotSelected}>
                            시험 안내
                        </div>
                    </div>

                    <div className={styles.processTabButton} onClick={() => { setProcessTab(4); }}>
                        <div className={processTab === 4 ? styles.processTabButtonNumberSelected : styles.processTabButtonNumberNotSelected}>
                            4
                        </div>

                        <div className={processTab === 4 ? styles.processTabButtonTextSelected : styles.processTabButtonTextNotSelected}>
                            시험 진행
                        </div>
                    </div>
                </div>

                {
                    processTab === 1

                    &&

                    <div className={styles.processElements}>
                        <img className={styles.processImage} src={process.env.PUBLIC_URL + "/graphics/1_image.png"} />

                        <div className={styles.processContent}>
                            <div className={styles.processHeader}>
                                <img className={styles.processHeaderIcon} src={process.env.PUBLIC_URL + "/graphics/1_icon.png"} />

                                <div className={styles.processHeaderText}>
                                    문제 생성
                                </div>
                            </div>

                            <div className={styles.processText}>
                                시험 문제를 생성합니다. 문제 유형, 배점, 난이도를 지정할 수 있습니다.<br /><br />

                                다음과 같은 문제 유형을 선택할 수 있습니다.<br />
                                <li>객관식</li>
                                <li>주관식</li>
                                <li>참/거짓</li>
                                <li>서술형</li>
                            </div>
                        </div>
                    </div>
                }

                {
                    processTab === 2

                    &&

                    <div className={styles.processElements}>
                        <img className={styles.processImage} src={process.env.PUBLIC_URL + "/graphics/2_image.png"} />

                        <div className={styles.processContent}>
                            <div className={styles.processHeader}>
                                <img className={styles.processHeaderIcon} src={process.env.PUBLIC_URL + "/graphics/2_icon.png"} />

                                <div className={styles.processHeaderText}>
                                    응시자 등록
                                </div>
                            </div>

                            <div className={styles.processText}>
                                응시자를 등록합니다. 응시자의 이름을 수정하거나 응시자를 목록에서 삭제할 수 있습니다.
                            </div>
                        </div>
                    </div>
                }

                {
                    processTab === 3

                    &&

                    <div className={styles.processElements}>
                        <img className={styles.processImage} src={process.env.PUBLIC_URL + "/graphics/3_image.png"} />

                        <div className={styles.processContent}>
                            <div className={styles.processHeader}>
                                <img className={styles.processHeaderIcon} src={process.env.PUBLIC_URL + "/graphics/3_icon.png"} />

                                <div className={styles.processHeaderText}>
                                    시험 안내
                                </div>
                            </div>

                            <div className={styles.processText}>
                                출제자가 응시자에게 6자리 시험 코드와 6자리 응시 코드를 안내하여 시험장에 접속할 수 있습니다. 시험장 URL을 전달하여 안내할 수도 있습니다.<br /><br />

                                시험 안내사항, 사용 방법, 약관 내용을 확인할 수 있으며, 시험 시작 전 시험 환경을 점검할 수 있습니다.
                            </div>
                        </div>
                    </div>
                }

                {
                    processTab === 4

                    &&

                    <div className={styles.processElements}>
                        <img className={styles.processImage} src={process.env.PUBLIC_URL + "/graphics/4_image.png"} />

                        <div className={styles.processContent}>
                            <div className={styles.processHeader}>
                                <img className={styles.processHeaderIcon} src={process.env.PUBLIC_URL + "/graphics/4_icon.png"} />

                                <div className={styles.processHeaderText}>
                                    시험 진행
                                </div>
                            </div>

                            <div className={styles.processText}>
                                시험을 진행합니다. 응시자가 다른 문제로 이동하거나 시험을 종료하면 답안지가 자동으로 제출됩니다.<br /><br />

                                설정에서 화면의 밝기와 화면 구성을 설정하여, 응시자가 편한 환경에서 시험을 진행할 수 있습니다.<br /><br />

                                채팅 기능을 이용하여, 출제자가 응시자에게 실시간으로 공지사항을 전달할 수 있고, 응시자는 출제자에게 필요 시 질문을 할 수 있습니다.
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

            <video autoPlay loop muted className={styles.video}>
                <source src="graphics/background.webm" type="video/webm" />
            </video>
        </div>
    )
}