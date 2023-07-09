import NewUser from "./NewUser";
import TestList from "./TestList";

import GetUserInfo from "../hooks/GetUserInfo";



export default function Dashboard({ userCode, email }: { userCode: string, email: string }) {
    // 사용자 정보
    var userInfo = GetUserInfo(userCode);



    return (
        // 사용자 등록 화면
        userInfo === undefined

            ?

            <NewUser userCode={userCode} email={email} />

            :

            <TestList userCode={userCode} userName={userInfo.userName} />
    )
}