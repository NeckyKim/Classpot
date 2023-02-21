import { useEffect, useState } from "react";

import { dbService } from "../../FirebaseModules";
import { collection } from "firebase/firestore";
import { onSnapshot, query } from "firebase/firestore";



export default function GenerateShortApplicantCode(testCode: string | undefined) {
    const [usedApplicantCodeList, setUsedApplicantCodeList] = useState<any>([]);



    // 현재 사용중인 응시 번호 목록
    if (testCode) {
        useEffect(() => {
            onSnapshot(query(collection(dbService, "tests", testCode, "applicants")), (snapshot) => {
                setUsedApplicantCodeList(snapshot.docs.map((current) => ({
                    applicantCode: current.data().applicantCode
                })));
            });
        }, [])
    }



    while (true) {
        let results: string = "";

        for (let i: number = 0; i < 6; i++) {
            results = results + "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(Math.floor(Math.random() * 36));
        }

        if (!usedApplicantCodeList.includes(results)) {
            return Array.from(results).sort(() => Math.random() - 0.5).join("");
        }
    }
}