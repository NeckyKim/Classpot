import Title from '../../../style/Title';
import TimeCalculator from '../../utils/TimeCalculator';

import styles from './DashboardTab.module.css';

export default function DashboardTab({ userInfo, testInfo }: { userInfo: any; testInfo: any }) {
  var isTestTime = TimeCalculator(testInfo.startDate, testInfo.duration);

  console.log(isTestTime);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Title>시험 진행 상황</Title>

        <div className={styles.timeContainer}>
          {(() => {
            switch (isTestTime.isTime) {
              case 'before':
                return '시험 시작 전';
              case 'running':
                return '시험 진행 중';
              case 'after':
                return '시험 종료';
            }
          })()}
        </div>

        <Title>응시자 접속 가이드</Title>

        <div className={styles.guideWrapper}>
          <div className={styles.guideContainer}>
            <div className={styles.guideLabel}>시험 코드 8자리와 응시자 코드 6자리로 접속</div>

            <div className={styles.guideGraphicsContainer}>
              <img src={process.env.PUBLIC_URL + '/graphics/guide11.svg'} className={styles.guideGraphic} />
              <img src={process.env.PUBLIC_URL + '/icons/dashboard/arrow_right.svg'} className={styles.guideArrow} />
              <img src={process.env.PUBLIC_URL + '/graphics/guide12.svg'} className={styles.guideGraphic} />
              <img src={process.env.PUBLIC_URL + '/icons/dashboard/arrow_right.svg'} className={styles.guideArrow} />
              <img src={process.env.PUBLIC_URL + '/graphics/guide13.svg'} className={styles.guideGraphic} />
              <img src={process.env.PUBLIC_URL + '/icons/dashboard/arrow_right.svg'} className={styles.guideArrow} />
              <img src={process.env.PUBLIC_URL + '/graphics/guide14.svg'} className={styles.guideGraphic} />
            </div>

            <ol>
              <li>응시자 전원에게 시험 코드 8자리를 안내합니다.</li>
              <li>응시자마다 개인의 고유 응시자 코드 6자리를 안내합니다.</li>
              <li>응시자는 관리자로부터 안내받은 시험 코드 8자리와 응시자 코드 6자리를 입력합니다.</li>
              <li>응시자가 정상적으로 시험장에 입실했는지 확인합니다.</li>
            </ol>
          </div>

          <div className={styles.guideContainer}>
            <div className={styles.guideLabel}>시험장 URL로 접속</div>

            <div className={styles.guideGraphicsContainer}>
              <img src={process.env.PUBLIC_URL + '/graphics/guide21.svg'} className={styles.guideGraphic} />
              <img src={process.env.PUBLIC_URL + '/icons/dashboard/arrow_right.svg'} className={styles.guideArrow} />
              <img src={process.env.PUBLIC_URL + '/graphics/guide22.svg'} className={styles.guideGraphic} />
              <img src={process.env.PUBLIC_URL + '/icons/dashboard/arrow_right.svg'} className={styles.guideArrow} />
              <img src={process.env.PUBLIC_URL + '/graphics/guide23.svg'} className={styles.guideGraphic} />
            </div>

            <ol>
              <li>응시자마다 개인의 고유 시험장 URL을 안내합니다.</li>
              <li>응시자는 관리자로부터 안내받은 시험장 URL로 접속합니다.</li>
              <li>응시자가 정상적으로 시험장에 입실했는지 확인합니다.</li>
            </ol>
          </div>

          <div className={styles.guideContainer}>
            <div className={styles.guideLabel}>QR 코드로 접속 (스마트폰 또는 태블릿만 가능)</div>

            <div className={styles.guideGraphicsContainer}>
              <img src={process.env.PUBLIC_URL + '/graphics/guide12.svg'} className={styles.guideGraphic} />
              <img src={process.env.PUBLIC_URL + '/icons/dashboard/arrow_right.svg'} className={styles.guideArrow} />
              <img src={process.env.PUBLIC_URL + '/graphics/guide31.svg'} className={styles.guideGraphic} />
              <img src={process.env.PUBLIC_URL + '/icons/dashboard/arrow_right.svg'} className={styles.guideArrow} />
              <img src={process.env.PUBLIC_URL + '/graphics/guide32.svg'} className={styles.guideGraphic} />
              <img src={process.env.PUBLIC_URL + '/icons/dashboard/arrow_right.svg'} className={styles.guideArrow} />
              <img src={process.env.PUBLIC_URL + '/graphics/guide33.svg'} className={styles.guideGraphic} />
              <img src={process.env.PUBLIC_URL + '/icons/dashboard/arrow_right.svg'} className={styles.guideArrow} />
              <img src={process.env.PUBLIC_URL + '/graphics/guide34.svg'} className={styles.guideGraphic} />
            </div>

            <ol>
              <li>응시자마다 개인의 고유 응시자 코드 6자리를 안내합니다.</li>
              <li>응시자 전원에게 QR 코드를 안내합니다.</li>
              <li>응시자는 관리자로부터 안내받은 QR 코드를 촬영합니다.</li>
              <li>응시자는 관리자로부터 안내받은 응시자 코드 6자리를 입력합니다.</li>
              <li>응시자가 정상적으로 시험장에 입실했는지 확인합니다.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
