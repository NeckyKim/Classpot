import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import DashboardTab from './dashboardTab/DashboardTab';
import SettingTab from './settingsTab/SettingTab';
import QuestionTab from './questionTab/QuestionTab';
import ApplicantsTab from './applicantsTab/ApplicantsTab';
// import MonitoringTab from "./monitoringTab/MonitoringTab";
import ChattingTab from './chattingTab/ChattingTab';
import AnswerSheetTab from './answerSheetTab/AnswerSheetTab';

import Error from '../../Error';

import GetUserInfo from '../utils/GetUserInfo';
import GetTestInfo from '../utils/GetTestInfo';

import styles from './Test.module.css';

export default function Test({ userCode }: { userCode: string | undefined }) {
  const { testCode } = useParams();

  const navigate = useNavigate();

  const [tab, setTab] = useState<number>(0);

  // 관리자 정보
  var userInfo: any = GetUserInfo(userCode);

  // 시험 정보
  var testInfo: any = GetTestInfo(userCode, testCode);

  const [wide, setWide] = useState<boolean>(true);

  return testInfo && testInfo.managerCode === userCode ? (
    <div className={styles.container}>
      <div className={wide ? styles.sideBarWide : styles.sideBarNarrow}>
        <div className={wide ? styles.sideBarWideTop : styles.sideBarNarrowTop} onClick={() => navigate('/')}>
          <img src={process.env.PUBLIC_URL + '/logos/icon_color.png'} className={styles.sideBarLogoIcon} />

          <div className={wide ? styles.sideBarLogoShow : styles.sideBarLogoHide}>testcon</div>
        </div>

        <div className={styles.sideBarBottom}>
          <div className={tab === 0 ? styles.tabSelected : styles.tabNotSelected} onClick={() => setTab(0)}>
            <img className={styles.tabIcon} src={process.env.PUBLIC_URL + '/icons/dashboard/dashboard.svg'} />

            <div className={wide ? styles.tabTextWide : styles.tabTextNarrow}>대시보드</div>
          </div>

          <div className={tab === 1 ? styles.tabSelected : styles.tabNotSelected} onClick={() => setTab(1)}>
            <img className={styles.tabIcon} src={process.env.PUBLIC_URL + '/icons/dashboard/setting.svg'} />

            <div className={wide ? styles.tabTextWide : styles.tabTextNarrow}>시험 설정</div>
          </div>

          <div className={tab === 2 ? styles.tabSelected : styles.tabNotSelected} onClick={() => setTab(2)}>
            <img className={styles.tabIcon} src={process.env.PUBLIC_URL + '/icons/dashboard/book.svg'} />

            <div className={wide ? styles.tabTextWide : styles.tabTextNarrow}>문제 관리</div>
          </div>

          <div className={tab === 3 ? styles.tabSelected : styles.tabNotSelected} onClick={() => setTab(3)}>
            <img className={styles.tabIcon} src={process.env.PUBLIC_URL + '/icons/dashboard/people.svg'} />

            <div className={wide ? styles.tabTextWide : styles.tabTextNarrow}>응시자 관리</div>
          </div>

          {/* <div
                            className={tab === 4 ? styles.tabSelected : styles.tabNotSelected}
                            onClick={() => {
                                setTab(4);
                            }}
                        >
                            <img
                                className={styles.tabIcon}
                                src={process.env.PUBLIC_URL + "/icons/dashboard/monitor.svg"}
                            />

                            <div className={wide ? styles.tabTextWide : styles.tabTextNarrow}>
                                모니터링
                            </div>
                        </div> */}

          <div className={tab === 5 ? styles.tabSelected : styles.tabNotSelected} onClick={() => setTab(5)}>
            <img className={styles.tabIcon} src={process.env.PUBLIC_URL + '/icons/dashboard/chatting.svg'} />

            <div className={wide ? styles.tabTextWide : styles.tabTextNarrow}>채팅</div>
          </div>

          <div className={tab === 6 ? styles.tabSelected : styles.tabNotSelected} onClick={() => setTab(6)}>
            <img className={styles.tabIcon} src={process.env.PUBLIC_URL + '/icons/dashboard/answersheet.svg'} />

            <div className={wide ? styles.tabTextWide : styles.tabTextNarrow}>결과 확인</div>
          </div>

          <div className={styles.wideNarrowButton} onClick={() => setWide((prev) => !prev)}>
            <img
              className={wide ? styles.narrowIcon : styles.wideIcon}
              src={process.env.PUBLIC_URL + '/icons/dashboard/arrow_right.svg'}
            />
          </div>
        </div>
      </div>

      <div className={wide ? styles.contentWide : styles.contentNarrow}>
        <div className={wide ? styles.headerWide : styles.headerNarrow}>{testInfo.testName}</div>

        {tab === 0 && <DashboardTab userInfo={userInfo} testInfo={testInfo} />}
        {tab === 1 && <SettingTab userInfo={userInfo} testInfo={testInfo} />}
        {tab === 2 && <QuestionTab userCode={userCode} testCode={testInfo.testCode} />}
        {tab === 3 && <ApplicantsTab userCode={userCode} testCode={testInfo.testCode} />}
        {/* {tab === 4 && <MonitoringTab userCode={userCode} testCode={testInfo.testCode} />} */}
        {tab === 5 && <ChattingTab userCode={userCode} testCode={testInfo.testCode} />}
        {tab === 6 && <AnswerSheetTab userCode={userCode} testCode={testInfo.testCode} />}
      </div>
    </div>
  ) : (
    <Error message="해당 페이지에 접근 권한이 없습니다." />
  );
}
