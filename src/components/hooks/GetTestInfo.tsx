import { useEffect, useState } from "react"

import { dbService } from "../../FirebaseModules";
import { doc, onSnapshot } from "firebase/firestore";



export default function GetTestInfo(testCode: string | undefined) {
    const [testInfo, setTestInfo] = useState<any>([]);

    if (testCode) {
        useEffect(() => {
            onSnapshot(doc(dbService, "tests", testCode), (doc) => {
                setTestInfo(doc.data());
            });
        }, [])
    }

    return testInfo;
}