import { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter } from 'react-router-dom'

import { authService } from "./FirebaseModules";

import HeaderTop from "./components/header/HeaderTop";

import Home from "./components/home/Home";
import Login from "./components/login/Login";
import Dashboard from './components/dashboard/Dashboard';
import Test from "./components/test/Test";
import Apply from "./components/apply/Apply";
import TestMode from "./components/apply/TestMode";

import Error from "./Error";

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

                {
                    userObject === null

                        ?

                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/apply/:testCode" element={<Apply />} />
                            <Route path="/apply/:testCode/applicant/:applicantCode" element={<TestMode />} />
                        </Routes>


                        :

                        <Routes>
                            <Route path="/" element={<Dashboard userCode={userObject.uid} email={userObject.email} />} />
                            <Route path="/test/:testCode" element={<Test userCode={userObject.uid} email={userObject.email} />} />
                            <Route path="*" element={<Error message="페이지 오류 입니다."/>} />
                        </Routes>
                }
            </BrowserRouter>
        </div>
    );
}