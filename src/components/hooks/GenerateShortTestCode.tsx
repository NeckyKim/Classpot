import { useEffect, useState } from "react";

import { dbService } from "../../FirebaseModules";
import { collection } from "firebase/firestore";
import { onSnapshot, query } from "firebase/firestore";



export default function GenerateShortTestCode(userCode: string | undefined) {
    const [usedCodeList, setUsedCodeList] = useState<any>([]);

    if (userCode) {
        useEffect(() => {
            onSnapshot(query(collection(dbService, "users", userCode, "tests")), (snapshot) => {
                setUsedCodeList(snapshot.docs.map((current) => ({
                    applyCode: current.data().applyCode
                })));
            });
        }, [])
    }

    

    while (true) {
        let results: string = "";

        for (let i: number = 0; i < 4; i++) {
            results = results + "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(Math.floor(Math.random() * 36));
        }

        if (!usedCodeList.includes(results)) {
            return Array.from(results).sort(() => Math.random() - 0.5).join("");
        }
    }
}