import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { dbService } from "../../FirebaseModules";
import { collection, orderBy, onSnapshot, query } from "firebase/firestore";

import GetTestInfo from "../hooks/GetTestInfo";
import GetQuestionList from "../hooks/GetQuestionList";
import GetApplicantList from "../hooks/GetApplicantList";
import Error from "../../Error";




export default function Apply() {
    const { testCode }: any = useParams();

    var navigate = useNavigate();

    // 시험 정보
    var testInfo: any | undefined = GetTestInfo(testCode);

    // 질문 목록
    const [questionList, setQuestionList] = GetQuestionList(testCode);

    // 응시자 목록
    const [applicantsList, setApplicantsList] = GetApplicantList(testCode);



    const [applicantCode, setApplicantCode] = useState<string>("");

    function checkApplicants(event: any) {
        event.preventDefault();

        if (applicantsList.includes(applicantCode)) {
            navigate("applicant/" + applicantCode);
        }
    }



    return (
        <div>
            {
                testInfo

                    ?

                    <form onSubmit={checkApplicants}>
                        {testCode}<br />

                        시험 이름: {testInfo.testName}<br />

                        <input type="text" value={applicantCode} onChange={(event: any) => { setApplicantCode(event.target.value); }} />

                        <input type="submit" value="응시하기" />
                    </form>

                    :

                    <Error message="유효하지 않은 응시 코드 입니다." />
            }
        </div>
    )
}