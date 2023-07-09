import { useEffect, useState } from "react"

import { dbService } from "../../FirebaseModules";
import { onSnapshot, query, collection, orderBy } from "firebase/firestore";



export default function GetQuestionList(userCode: string | undefined, testCode: string | undefined) {
    const [questionList, setQuestionList] = useState<any>([]);

    if (userCode && testCode) {
        useEffect(() => {
            onSnapshot(query(collection(dbService, "users", userCode, "tests", testCode, "questions"), orderBy("created")), (snapshot) => {
                setQuestionList(snapshot.docs.map((current) => ({
                    questionCode: current.id,
                    ...current.data()
                })));
            });
        }, [])
    }

    return questionList;
}