import { useNavigate } from "react-router-dom";

import { Mousewheel, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import styles from "./Home.module.css";



export default function Home() {
    const navigate = useNavigate()


    return (
        <Swiper
            direction={"vertical"}
            slidesPerView={1}
            spaceBetween={0}
            mousewheel={true}
            draggable={false}
            scrollbar={{
                hide: false,
                draggable: false
            }}
            modules={[Mousewheel, Scrollbar]}
            className={styles.container}
        >
            <SwiperSlide>
                <div className={styles.slide1}>
                    <div className={styles.slide1Up}>
                        <div className={styles.slide1UpText}>
                            이제는 온라인으로 시험을 보는 시대
                        </div>

                        <img className={styles.slide1UpLogo} src={process.env.PUBLIC_URL + "/logos/logo_textonly.png"} />
                    </div>

                    <div className={styles.slide1Down}>
                        <div className={styles.slide1DownContainer}>
                            <div className={styles.slide1DownSubContainer}>
                                <div className={styles.slide1DownText}>
                                    시험을 응시하러 접속하셨나요?
                                </div>

                                <div className={styles.applyTestButton} onClick={() => { navigate("/apply") }}>
                                    시험 응시하기
                                </div>
                            </div>

                            <div className={styles.slide1DownSubContainer}>
                                <div className={styles.slide1DownText}>
                                    테스트콘의 환경을 체험해볼 수 있습니다.
                                </div>

                                <div className={styles.sampleTestButton} onClick={() => { navigate("/apply/sample/applicant/sample") }}>
                                    체험 해보기
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SwiperSlide>
        </Swiper>
    )
}