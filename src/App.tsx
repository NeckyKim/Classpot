import { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

import { ToastContainer, Slide } from 'react-toastify';

import { authService } from './FirebaseModules';

import Header from './components/header/Header';
import Home from './components/home/Home';
import Login from './components/login/Login';
import Main from './components/main/Main';
import Test from './components/test/Test';
import CheckTestCode from './components/home/CheckTestCode';
import CheckApplicantCode from './components/home/CheckApplicantCode';
import Apply from './components/apply/Apply';
import Feedback from './components/feedback/Feedback';

import Error from './Error';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';

export default function App() {
  const [userObject, setUserObject] = useState<any>(null);

  useEffect(() => {
    authService.onAuthStateChanged((user: any) => {
      setUserObject(user);
    });
  }, []);

  return (
    <div className="app">
      <BrowserRouter>
        <Header loggedIn={userObject !== null} />

        {!location.pathname.split('/').includes('apply') && (
          <ToastContainer
            transition={Slide}
            position="bottom-right"
            autoClose={3000}
            hideProgressBar
            newestOnTop={true}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss={false}
            draggable={false}
            pauseOnHover={false}
            theme="colored"
            limit={1}
          />
        )}

        {userObject === null ? (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/apply" element={<CheckTestCode />} />
            <Route path="/apply/manager/:userCode/test/:testCode" element={<CheckApplicantCode />} />
            <Route path="/apply/manager/:userCode/test/:testCode/applicant/:applicantCode" element={<Apply />} />
            <Route
              path="/apply/manager/:userCode/test/:testCode/applicant/:applicantCode/feedback"
              element={<Feedback />}
            />
            <Route path="*" element={<Error message="존재하지 않는 페이지 입니다." />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Main userCode={userObject.uid} email={userObject.email} />} />
            <Route path="/test/:testCode" element={<Test userCode={userObject.uid} />} />
            <Route path="*" element={<Error message="유효하지 않은 시험 입니다." />} />
          </Routes>
        )}
      </BrowserRouter>
    </div>
  );
}
