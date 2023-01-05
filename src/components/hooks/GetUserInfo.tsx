import { useEffect, useState } from "react"

import { dbService } from "../../FirebaseModules";
import { doc, onSnapshot } from "firebase/firestore";



export default function GetUserInfo(userCode: string) {
    const [userInfo, setUserInfo] = useState<any>(undefined);

    useEffect(() => {
        onSnapshot(doc(dbService, "users", userCode), (doc) => {
            setUserInfo(doc.data());
        });
    }, [])

    return userInfo;
}