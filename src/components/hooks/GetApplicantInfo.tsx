import { useEffect, useState } from "react"

import { dbService } from "../../FirebaseModules";
import { doc, onSnapshot } from "firebase/firestore";




export default function GetApplicantInfo(userCode: string | undefined, testCode: string | undefined, applicantCode: string | undefined) {
    const [applicantInfo, setApplicantInfo] = useState<any>([]);

    if (userCode && testCode && applicantCode) {
        useEffect(() => {
            onSnapshot(doc(dbService, "users", userCode, "tests", testCode, "applicants", applicantCode), (doc) => {
                setApplicantInfo(doc.data());
            });
        }, [])
    }

    return applicantInfo;
}