import { useEffect, useState } from "react"

import { dbService } from "../../FirebaseModules";
import { doc, onSnapshot } from "firebase/firestore";




export default function GetApplicantInfo(testCode: string | undefined, applicantCode: string | undefined) {
    const [applicantInfo, setApplicantInfo] = useState<any>([]);

    if (testCode && applicantCode) {
        useEffect(() => {
            onSnapshot(doc(dbService, "tests", testCode, "applicants", applicantCode), (doc) => {
                setApplicantInfo(doc.data());
            });
        }, [])
    }

    return applicantInfo;
}