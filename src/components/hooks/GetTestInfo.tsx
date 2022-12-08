import { useEffect, useState } from "react"

import { dbService } from "../../FirebaseModules";
import { doc, getDoc, } from "firebase/firestore";



type TestInfoProps = {
    userCode: string;
    testName: string;
    duration: number;
}

export default function GetTestInfo(userCode: string, testCode: any) {
    const [testInfo, settestInfo] = useState<TestInfoProps | undefined>(undefined);

    useEffect(() => {
        getDoc(doc(dbService, "tests", testCode)).then((doc: any) => { settestInfo(doc.data()); });
    }, []);

    return testInfo;
}