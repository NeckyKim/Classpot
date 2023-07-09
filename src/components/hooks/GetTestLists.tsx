import { useEffect, useState } from "react"

import { dbService } from "../../FirebaseModules";
import { onSnapshot, query, collection, orderBy } from "firebase/firestore";



export default function GetTestList(userCode: string | undefined) {
    const [testList, setTestList] = useState<any>([]);

    if (userCode) {
        useEffect(() => {
            onSnapshot(query(collection(dbService, "users", userCode, "tests"), orderBy("created")), (snapshot) => {
                setTestList(snapshot.docs.map((current) => ({
                    testCode: current.id,
                    ...current.data()
                })));
            });
        }, [])
    }

    return testList;
}