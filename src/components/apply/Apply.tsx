import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { dbService } from "../../FirebaseModules";
import { doc, deleteDoc, collection, orderBy, onSnapshot, query } from "firebase/firestore";

import GetTestInfo from "../hooks/GetTestInfo";
import Error from "../../Error";



export default function Apply() {
    var { testCode }: any = useParams();



    // 시험 정보
    var testInfo: any | undefined = GetTestInfo(testCode);



    // 질문 목록
    const [questionList, setQuestionList] = useState<any>([]);

    if (testCode !== null) {
        useEffect(() => {
            onSnapshot(query(collection(dbService, "tests", testCode, "questions"), orderBy("createdTime")), (snapshot) => {
                setQuestionList(snapshot.docs.map((current) => ({
                    questionCode: current.id,
                    ...current.data()
                })));
            });
        }, [])
    }



    // IP 주소 조회
    const [ip, setIp] = useState();

    useEffect(() => {
        axios.get('https://geolocation-db.com/json/')
            .then((res) => {
                setIp(res.data.IPv4)
            })
    }, [])



    return (
        <div>
            {
                testInfo

                    ?

                    <div>
                        {testCode}<br />

                        시험 이름: {testInfo.testName}<br />
                        
                        현재 IP 주소: {ip}

                        <button>
                            
                        </button>
                    </div>

                    :

                    <Error message="유효하지 않은 응시 코드 입니다." />
            }
        </div>
    )
}