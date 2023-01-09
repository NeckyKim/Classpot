import { useEffect, useState } from "react"

import { dbService } from "../../FirebaseModules";
import { onSnapshot, query, collection, orderBy } from "firebase/firestore";



export default function GetApplicantList(testCode: string | undefined) {
    const [applicantList, setApplicantList] = useState<any>([]);

    if (testCode) {
        useEffect(() => {
            onSnapshot(query(collection(dbService, "tests", testCode, "applicants"), orderBy("createdTime")), (snapshot) => {
                setApplicantList(snapshot.docs.map((current) => ({
                    applicantCode: current.id,
                    ...current.data()
                })));
            });
        }, [])
    }

    return applicantList;
}