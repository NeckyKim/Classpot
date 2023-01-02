import { useEffect, useState } from "react"

import { dbService } from "../../FirebaseModules";
import { doc, getDoc, } from "firebase/firestore";



type TestInfoProps = {
    userCode: string;
    testName: string;
    createdTime: number;
    startDate: number;
    duration: number;
    applyCode: string;
}

export default function GetTestInfo(testCode: any) {
    const [testInfo, setTestInfo] = useState<TestInfoProps | undefined>(undefined);

    useEffect(() => {
        getDoc(doc(dbService, "tests", testCode)).then((doc: any) => {
            setTestInfo(doc.data());
        });
    }, []);

    return testInfo;
}