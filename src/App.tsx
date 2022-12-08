import { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter } from 'react-router-dom'

import { authService } from "./FirebaseModules";

import HeaderTop from "./components/header/HeaderTop";

import Home from "./components/home/Home";
import Login from "./components/login/Login";
import Dashboard from './components/dashboard/Dashboard';
import Test from "./components/test/Test";

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
                        </Routes>


                        :

                        <Routes>
                            <Route path="/" element={<Dashboard userCode={userObject.uid} email={userObject.email} />} />
                            <Route path="/test/:testCode" element={<Test userCode={userObject.uid} email={userObject.email} />} />
                            <Route path="*" element={<div>페이지 오류</div>} />
                        </Routes>
                }
            </BrowserRouter>
        </div>
    );
}