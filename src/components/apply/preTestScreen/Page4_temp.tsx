import { useState, useRef } from "react";
import { useParams } from "react-router-dom";

import Buttons from "../../../theme/Buttons";
import SubmitButton from "../../../theme/SubmitButton";

import AgoraRTC from "agora-rtc-sdk-ng";
import { createAgoraClient } from "../../../AgoraModules"

import styles from "./Page4.module.css";



AgoraRTC.setLogLevel(4);

let agoraCommandQueue = Promise.resolve();



export default function Page4({ setPage, checks, setChecks }: any) {
    const {userCode, testCode, applicantCode} = useParams();

    const [video, setVideo] = useState<any>();

    const videoRef = useRef<any>();


    /***************** agora-rtc *****************/

    const [userList, setUserList] = useState<any>([]);   
    const [uid, setUid] = useState<any>(null);

    console.log(userList);

    function shareScreen() {
        function onVideoTrack(user: any) {
            setUserList((prev: any) => [...prev, user]);
        };
    
        function onUserDisconnected(user: any) {
            setUserList((prev: any) => prev.filter((x: any) => x.uid !== user.uid));
        };
    
        const { connect, disconnect } = createAgoraClient({ onVideoTrack, onUserDisconnected });
    
        async function setup() {
            const { tracks, uid } = await connect();
    
            setUid(uid);
            setUserList((prev: any) => [...prev, { uid, applicantCode, videoTrack: tracks }]);
    
            tracks.play(videoRef.current);
        }
    
        async function cleanup() {
            await disconnect();
    
            setUid(null);
            setUserList([]);
        }

        agoraCommandQueue = agoraCommandQueue.then(setup);

        return () => { agoraCommandQueue = agoraCommandQueue.then(cleanup); };
    }

    /*********************************************/



    return (
        <div>
            <div className={styles.comment}>
                시험 감독을 위해 <span style={{ fontWeight: "700", color: "rgb(0, 100, 250)" }}>화면을 공유</span>해주세요.
            </div>

            <div className={styles.videoContainer}>
                <video autoPlay ref={videoRef} className={styles.video} />

                {
                    !video

                    &&

                    <div className={styles.videoEmpty}>
                        <img src={process.env.PUBLIC_URL + "/icons/apply/camera_off.svg"} />

                        공유된 화면이 없습니다.
                    </div>
                }

                {
                    video

                        ?

                        <div className={styles.videoOn}>
                            <img src={process.env.PUBLIC_URL + "/icons/apply/camera_on.svg"} />

                            화면 공유 중
                        </div>

                        :

                        <div className={styles.videoOff}>
                            <img src={process.env.PUBLIC_URL + "/icons/apply/camera_off.svg"} />

                            화면 없음
                        </div>
                }


            </div>

            <SubmitButton
                text="공유하기"
                onClick={shareScreen}
            />



            <ol className={styles.alertContainer}>
                <div>
                    화면 공유 방법
                </div>

                <li>
                    [공유하기] 버튼을 클릭합니다.
                </li>

                <li>
                    상단의 [전체 화면] 탭을 클릭합니다.
                </li>

                <li>
                    공유할 화면을 클릭 후, 하단의 [공유] 버튼을 클릭합니다.
                </li>
            </ol>

            <div className={styles.infoContainer}>
                [전체 화면] 공유가 아닌 [Chrome 탭] 또는 [창] 공유를 하여 특정 화면만 공유할 경우 부정행위로 간주되어 불이익을 받을 수 있습니다.
            </div>



            <Buttons>
                <SubmitButton
                    text="다음"
                    onClick={() => {
                        setPage(6);

                        let copy = [...checks];
                        copy[3] = true;
                        setChecks(copy);
                    }}
                    disabled={!video}
                />
            </Buttons>
        </div>
    )
}