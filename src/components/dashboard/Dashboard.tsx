import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { dbService } from "../../FirebaseModules";
import { doc, setDoc, collection } from "firebase/firestore";
import { onSnapshot, query, where } from "firebase/firestore";

import GetUserInfo from "../hooks/GetUserInfo"



type DashboardProps = {
    userCode: string;
    email: string;
}

export default function Dashboard({ userCode, email }: DashboardProps) {
    var userInfo = GetUserInfo(userCode);



    // 사용자 등록
    const [userName, setUserName] = useState<string>("");

    async function addUser(event: any) {
        event.preventDefault();

        try {
            await setDoc(doc(dbService, "users", userCode), {
                userCode: userCode,
                userName: userName,
                email: email
            })

            alert("사용자 등록이 완료되었습니다.");
        }

        catch (error) {
            console.log(error);
            alert("사용자 등록에 실패했습니다.");
        }
    }



    // 시험 추가
    const [isAddingTest, setIsAddingTest] = useState<boolean>(false);

    const [testName, setTestName] = useState<string>("");
    const [duration, setDuration] = useState<number>(60);

    async function addTest(event: any) {
        event.preventDefault();

        try {
            await setDoc(doc(collection(dbService, "tests")), {
                userCode: userCode,
                testName: testName,
                duration: duration
            })

            alert("시험 추가가 완료되었습니다.");

            setTestName("");
            setDuration(60);
            setIsAddingTest(false);
        }

        catch (error) {
            console.log(error);
            alert("시험 추가에 실패했습니다.");
        }
    }



    // 시험 목록 조회
    const [testList, setTestList] = useState<any>([]);

    useEffect(() => {
        onSnapshot(query(collection(dbService, "tests"), where("userCode", "==", userCode)), (snapshot) => {
            setTestList(snapshot.docs.map((current) => ({
                testCode: current.id, 
                ...current.data()
            })));
        });
    }, [])



    return (
        <div>
            대시보드

            {
                testList.map((current: any) => (
                    <Link to={"/test/" + current.testCode}>
                        <div>
                            {current.testName}
                        </div>
                    </Link>
                ))
            }

            {
                // 사용자 등록 화면
                userInfo === undefined

                    ?

                    <form onSubmit={addUser}>
                        사용자 이름 <input type="textbox" value={userName} onChange={(event) => { setUserName(event.target.value); }} required />

                        <input type="submit" value="등록하기" />
                    </form>

                    :

                    <div>
                        <button onClick={() => { setIsAddingTest(true); }}>
                            시험 추가하기
                        </button>
                    </div>
            }


            
            {
                // 시험 추가 화면
                isAddingTest

                &&

                <div>
                    <form onSubmit={addTest}>
                        시험 이름 <input type="textbox" value={testName} onChange={(event) => { setTestName(event.target.value) }} required />

                        <input type="submit" value="추가" />

                        <button onClick={() => {
                            setTestName("");
                            setDuration(60);
                            setIsAddingTest(false);
                        }}>
                            취소
                        </button>
                    </form>
                </div>
            }
        </div>
    )
}