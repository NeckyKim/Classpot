import { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter } from 'react-router-dom'

import { authService } from "./FirebaseModules";

import HeaderTop from "./components/header/HeaderTop";

import Home from "./components/home/Home";
import Login from "./components/login/Login";
import Dashboard from './components/dashboard/Dashboard';
import Test from "./components/test/Test";
import Apply from "./components/apply/Apply";
import ApplyMode from "./components/apply/ApplyMode";
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



    return (
        <div>
            <BrowserRouter>
                <HeaderTop loggedIn={userObject !== null} />

                <ToastContainer
                    transition={Slide}
                    position="bottom-right"
                    autoClose={5000}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable={false}
                    pauseOnHover={false}
                    theme="colored"
                    limit={1}
                    style={
                        location.pathname.includes("/apply/")

                            ?

                            {
                                right: "30px",
                                bottom: "70px"
                            }

                            :

                            {
                                right: "40px",
                                bottom: "40px"
                            }
                    }
                />

                {
                    userObject === null

                        ?

                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/apply/:testCode" element={<Apply />} />
                            <Route path="/apply/:testCode/applicant/:applicantCode" element={<ApplyMode />} />
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