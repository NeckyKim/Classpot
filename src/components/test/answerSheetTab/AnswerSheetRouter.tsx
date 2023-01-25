import { useParams } from "react-router-dom";

import AnswerSheetMode from "./AnswerSheetMode";

import Error from "../../../Error";
import GetTestInfo from "../../hooks/GetTestInfo";



export default function AnswerSheetRouter({ userCode }: { userCode: string | null }) {
    const { testCode } = useParams();

    const testInfo: any = GetTestInfo(testCode);

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