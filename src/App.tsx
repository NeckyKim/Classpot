import { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter } from 'react-router-dom'

import { authService } from "./FirebaseModules";

import HeaderTop from "./components/header/HeaderTop";

import Home from "./components/home/Home";
import Login from "./components/login/Login";
import Dashboard from './components/dashboard/Dashboard';
import Test from "./components/test/Test";
import CheckTestCode from "./components/home/CheckTestCode";
import CheckApplicantCode from "./components/home/CheckApplicantCode";
import TestMode from "./components/testMode/TestMode";
import AnswerSheetRouter from "./components/test/answerSheetTab/AnswerSheetRouter";

import Error from "./Error";

import { ToastContainer, Slide } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import './App.css';



export default function App() {
    const [userObject, setUserObject] = useState<any>(null);



    useEffect(() => {
        authService.onAuthStateChanged((user: any) => {
            setUserObject(user);
        })
    }, [])



    // 화면 너비
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        window.addEventListener("resize", () => { setWidth(window.innerWidth); });
    });



    return (
        <div>
            <BrowserRouter>
                <HeaderTop loggedIn={userObject !== null} />

                {
                    !location.pathname.includes("/apply/")

                    &&

                    <ToastContainer
                        transition={Slide}
                        position={width < 600 ? "bottom-center" : "bottom-right"}
                        autoClose={5000}
                        hideProgressBar
                        newestOnTop={true}
                        closeOnClick={false}
                        rtl={false}
                        pauseOnFocusLoss={false}
                        draggable={false}
                        pauseOnHover={false}
                        theme="colored"
                        limit={1}
                        style={
                            width < 600

                                ?

                                { right: "0px", bottom: "0px" }

                                :

                                { right: "40px", bottom: "40px" }
                        }
                    />
                }
                

                {
                    userObject === null

                        ?

                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/apply" element={<CheckTestCode />} />
                            <Route path="/apply/:testCode" element={<CheckApplicantCode />} />
                            <Route path="/apply/:testCode/applicant/:applicantCode" element={<TestMode />} />
                            <Route path="/test/:testCode/answersheet/:applicantCode" element={<AnswerSheetRouter userCode={null} />} />
                            <Route path="*" element={<Error message="존재하지 않는 페이지 입니다." />} />
                        </Routes>


                        :

                        <Routes>
                            <Route path="/" element={<Dashboard userCode={userObject.uid} email={userObject.email} />} />
                            <Route path="/test/:testCode" element={<Test userCode={userObject.uid} email={userObject.email} />} />
                            <Route path="/test/:testCode/answersheet/:applicantCode" element={<AnswerSheetRouter userCode={userObject.uid} />} />
                            <Route path="*" element={<Error message="유효하지 않은 시험 입니다." />} />
                        </Routes>
                }
            </BrowserRouter>
        </div>
    );
}