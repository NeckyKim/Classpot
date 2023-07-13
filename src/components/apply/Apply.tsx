import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"

import GetTestInfo from "../hooks/GetTestInfo";
import GetApplicantInfo from "../hooks/GetApplicantInfo";
import GetQuestionList from "../hooks/GetQuestionList";
import TimeCalculator from "../hooks/TimeCalculator";

import PreTestScreen from "./preTestScreen/PreTestScreen";
import MainTestScreen from "./mainTestScreen/MainTestScreen";
import Error from "../../Error";

import { sampleTestInfo, sampleApplicantInfo } from "../../sampleTest";



export default function Apply() {
    const { userCode, testCode, applicantCode } = useParams();



    let testInfo: any;
    let applicantInfo: any;
    let questionList: any;

    if (userCode === "sample") {
        testInfo = sampleTestInfo;
        applicantInfo = sampleApplicantInfo;
        questionList = GetQuestionList("AGrRbUSDWXW1HEVRLgM5M1LDLB42", "HuXwp26wwo0yqAUqqNXb");
    }

    else {
        testInfo = GetTestInfo(userCode, testCode);
        applicantInfo = GetApplicantInfo(userCode, testCode, applicantCode);
        questionList = GetQuestionList(userCode, testCode);
    }



    let isTestTime = TimeCalculator(testInfo.startDate, testInfo.duration);

    const [isApplyingTest, setIsApplyingTest] = useState<boolean>(false);



    return (
        (testInfo.testName && applicantInfo)

            ?

            (
                (isApplyingTest && isTestTime.isTime === "running")

                    ?

                    <MainTestScreen
                        testInfo={testInfo}
                        applicantInfo={applicantInfo}
                        questionList={questionList}
                        isTestTime={isTestTime}
                        setIsApplyingTest={setIsApplyingTest}
                    />

                    :

                    <PreTestScreen
                        testInfo={testInfo}
                        applicantInfo={applicantInfo}
                        questionList={questionList}
                        isTestTime={isTestTime}
                        setIsApplyingTest={setIsApplyingTest}
                    />
            )

            :

            (
                !testInfo.testName

                    ?
                    <Error message="존재하지 않는 시험입니다." subMessage="시험 관리자에게 문의하세요." />

                    :

                    <Error message="존재하지 않는 응시자입니다." subMessage="시험 관리자에게 문의하세요." />
            )
    )
}