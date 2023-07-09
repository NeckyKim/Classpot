import { useState } from "react";

import { dbService } from "../../../FirebaseModules";
import { doc, setDoc, collection } from "firebase/firestore";

import GenerateShortApplicantCode from "../../hooks/GenerateShortApplicantCode";

import Modal from "../../../theme/Modal";
import Label from "../../../theme/Label";
import InputBox from "../../../theme/InputBox";
import Buttons from "../../../theme/Buttons";
import SubmitButton from "../../../theme/SubmitButton";

import { toast } from "react-toastify";
import CancelButton from "../../../theme/CancelButton";



export default function AddApplicant({ userCode, testCode, setIsAddingApplicant }: { userCode: string | undefined, testCode: string | undefined, setIsAddingApplicant: any }) {
    const [applicantName, setApplicantName] = useState<string>("");

    const shortApplicantCode = GenerateShortApplicantCode(userCode, testCode);



    async function addApplicant(event: any) {
        event.preventDefault();

        if (userCode && testCode) {
            try {
                await setDoc(doc(collection(dbService, "users", userCode, "tests", testCode, "applicants")), {
                    applicantName: applicantName.trim(),
                    created: Date.now(),
                    answerSheet: new Array(100).fill(null),
                    reportCard: new Array(100).fill(null),
                    shortApplicantCode: shortApplicantCode,
                    submitted: 0,
                    pause: false,
                    finished: false,
                    log: [],
                    chatting: []
                })

                toast.success("응시자 추가가 완료되었습니다.", { toastId: "" });

                setApplicantName("");
                setIsAddingApplicant(false);
            }

            catch (error) {
                console.log(error);
                toast.error("응시자 추가에 실패했습니다.", { toastId: "" });
            }
        }
    }



    return (
        <Modal title="응시자 추가" onClose={() => setIsAddingApplicant(false)}>
            <Label>
                응시자 이름
            </Label>

            <InputBox
                type="text"
                value={applicantName}
                onChange={(event: any) => setApplicantName(event.target.value)}
            />
            <br /><br /><br />

            <Buttons>
                <SubmitButton
                    text="추가"
                    onClick={addApplicant}
                    disabled={applicantName.replace(/(\s*)/g, "") === ""}
                />

                <CancelButton
                    text="취소"
                    onClick={() => {
                        setIsAddingApplicant(false)
                        setApplicantName("");
                    }}
                />
            </Buttons>
        </Modal>
    )
}