import { useNavigate } from "react-router-dom";

import { signInWithPopup } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { setPersistence } from "firebase/auth";
import { browserSessionPersistence } from "firebase/auth";

import { GoogleAuthProvider } from "firebase/auth";



export default function Login() {
    const auth = getAuth();

    var navigate = useNavigate();


    async function onSocialClick() {
        try {
            await setPersistence(auth, browserSessionPersistence)
                .then(() => {
                    return signInWithPopup(auth, new GoogleAuthProvider());
                })

                navigate("/");
        }

        catch (error) {
            console.log(error);
        }
    }



    return (
        <div>
            <button name="google" onClick={onSocialClick}>
                로그인
            </button>
        </div>
    )
}