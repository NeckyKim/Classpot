import { useState } from "react";
import { useParams } from "react-router-dom";

import AnswerSheetMode from "./AnswerSheetMode";

import Error from "../../../Error";
import GetTestInfo from "../../hooks/GetTestInfo";



export default function AnswerSheetRouter({ userCode }: { userCode: string | null }) {
    const { testCode } = useParams();



    var testInfo: any = GetTestInfo(testCode);

    const [tempDate, setTempDate] = useState<number>(Date.now() + 15000);

    if (testCode === "sample") {
        testInfo = {
            applyCode: "SAMPL",
            createdTime: 1000000000,
            duration: "5",
            feedback: true,
            startDate: tempDate,
            testName: "샘플 문제",
            userCode: "AGrRbUSDWXW1HEVRLgM5M1LDLB42",
            userName: "테스트콘 김영우"
        }
    }



    return (
        userCode

            ?

            (
                userCode === testInfo.userCode

                    ?

                    <AnswerSheetMode userCode={userCode} editable={true} />

                    :

                    <Error message="접근 권한이 없습니다." />
            )

            :

            (
                testInfo.feedback

                    ?

                    <AnswerSheetMode userCode={userCode} editable={false} />

                    :

                    <Error message="시험 종료 후 피드백이 공개되지 않은 시험입니다." />
            )
    )
}