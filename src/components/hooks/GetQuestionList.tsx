import { useEffect, useState } from "react"

import { dbService } from "../../FirebaseModules";
import { onSnapshot, query, collection, orderBy } from "firebase/firestore";



export default function GetQuestionList(testCode: string | undefined) {
    const [questionList, setQuestionList] = useState<any>([]);

    if (testCode) {
        useEffect(() => {
            onSnapshot(query(collection(dbService, "tests", testCode, "questions"), orderBy("createdTime")), (snapshot) => {
                setQuestionList(snapshot.docs.map((current) => ({
                    questionCode: current.id,
                    ...current.data()
                })));
            });
        }, [])
    }

    return questionList;
}