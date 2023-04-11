import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./DisallowMobileContainer.module.css";



export default function DisallowMobileContainer() {
    var navigate = useNavigate();

    // 화면 너비
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        window.addEventListener("resize", () => { setWidth(window.innerWidth); });
    });



    return (
        <div className={styles.disallowMobileContainer}>
            <div className={styles.disallowMobileContainerheader}>
                <img className={styles.disallowMobileContainerheaderLogo} src={process.env.PUBLIC_URL + "/logos/logo_original.png"} onClick={() => { navigate("/") }} />
            </div>

            <div className={styles.disallowMobileContainerText1}>
                모바일 환경에서 시험을 응시할 수 없습니다.
            </div>

            <div className={styles.disallowMobileContainerText2}>
                브라우저 창을 최대로 키우거나 화면이 확대된 경우에는 원래 상태로 복구해주세요.
                화면의 너비가 최소 800px 이상인 기기에서만 시험을 응시할 수 있습니다.<br /><br />
            </div>

            <div className={styles.disallowMobileContainerWidth}>
                현재 화면 너비 {width}px
            </div>
        </div>
    )
}