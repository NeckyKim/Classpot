import { useEffect, useState } from "react";

import { dbService } from "../../FirebaseModules";
import { collection } from "firebase/firestore";
import { onSnapshot, query } from "firebase/firestore";



export default function GenerateApplicantCode(testCode: string | undefined) {
    const [usedApplicantCodeList, setUsedApplicantCodeList] = useState<any>([]);



    // 현재 사용중인 응시자 번호 목록
    useEffect(() => {
        onSnapshot(query(collection(dbService, "tests")), (snapshot) => {
            setUsedApplicantCodeList(snapshot.docs.map((current) => ({
                applyCode: current.data().applyCode
            })));
        });
    }, [])



    while (true) {
        let results: string = "";

        for (let i: number = 0; i < 5; i++) {
            results = results + "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(Math.floor(Math.random() * 36));
        }

        if (!usedApplicantCodeList.includes(results)) {
            return Array.from(results).sort(() => Math.random() - 0.5).join("");
        }
    }
}