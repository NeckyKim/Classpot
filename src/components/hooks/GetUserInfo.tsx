import { useEffect, useState } from "react"

import { dbService } from "../../FirebaseModules";
import { doc, getDoc, } from "firebase/firestore";



export default function GetUserInfo(userCode: string) {
    const [userInfo, setUserInfo] = useState<object | undefined>(undefined);

    useEffect(() => {
        getDoc(doc(dbService, "users", userCode)).then((doc: any) => { setUserInfo(doc.data()); });
    }, []);

    return userInfo;
}