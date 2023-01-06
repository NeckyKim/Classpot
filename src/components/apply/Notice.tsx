import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import styles from "./Notice.module.css";



const settings = {
    dots: true,
    infinite: true,
    fade: true,
    arrows: false,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false,
    swipeToSlide: false
};



export default function Notice() {
    return (
        <Slider {...settings}>
            <div className={styles.slide1}>
                <div className={styles.slide1Content}>
                    <div className={styles.slide1ContentLeft}>
                        <div className={styles.slide1IconContainer}>
                            <img className={styles.slide1Icon} src={process.env.PUBLIC_URL + "/icons/prevnext.png"} />
                        </div>
                    </div>

                    <div className={styles.slide1ContentRight}>
                        이전/다음 문제로 이동하면 답안지가 자동으로 제출됩니다.
                    </div>
                </div>

                <div className={styles.slide1Content}>
                    <div className={styles.slide1ContentLeft}>
                        <div className={styles.slide1IconContainer}>
                            <img className={styles.slide1Icon} src={process.env.PUBLIC_URL + "/icons/exit.png"} />
                        </div>
                    </div>

                    <div className={styles.slide1ContentRight}>
                        종료하기 버튼을 누르면 답안지가 자동으로 제출됩니다.
                    </div>
                </div>

                <div className={styles.slide1Content}>
                    <div className={styles.slide1ContentLeft}>
                        <div className={styles.slide1IconContainer}>
                            <img className={styles.slide1Icon} src={process.env.PUBLIC_URL + "/icons/timer.png"} />
                        </div>
                    </div>

                    <div className={styles.slide1ContentRight}>
                        시험이 종료되면 마지막으로 작성한 답안지가 자동으로 제출됩니다.
                    </div>
                </div>
            </div>

            <div className={styles.slide2}>
                <div className={styles.slide2Top}>
                    <div className={styles.slide2IconContainerLight}>
                        <img className={styles.slide2Icon} src={process.env.PUBLIC_URL + "/icons/sun.png"} />
                    </div>

                    <div className={styles.slide2IconContainerDark}>
                        <img className={styles.slide2Icon} src={process.env.PUBLIC_URL + "/icons/moon.png"} />
                    </div>
                </div>

                <div className={styles.slide2Bottom}>
                    어두운 화면과 밝은 화면을 선택하여 시험을 응시할 수 있습니다.
                </div>
            </div>

            <div className={styles.slide3}>
                <div className={styles.slide3Top}>
                    <div className={styles.slide3IconContainer}>
                        <img className={styles.slide3Icon} src={process.env.PUBLIC_URL + "/icons/textsize.png"} />
                    </div>
                </div>

                <div className={styles.slide3Bottom}>
                    글씨 크기를 조정하여 시험을 응시할 수 있습니다.
                </div>
            </div>
        </Slider>
    )
}