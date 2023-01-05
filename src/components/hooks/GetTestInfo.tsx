import { useEffect, useState } from "react"

import { dbService } from "../../FirebaseModules";
import { doc, onSnapshot } from "firebase/firestore";



export default function GetTestInfo(testCode: any) {
    const [testInfo, setTestInfo] = useState<any>(undefined);

    useEffect(() => {
        onSnapshot(doc(dbService, "tests", testCode), (doc) => {
            setTestInfo(doc.data());
        });
    }, [])

    return testInfo;
}

