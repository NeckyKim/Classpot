import TimeCalculator from '../../utils/TimeCalculator';

import Buttons from '../../../style/Buttons';
import SubmitButton from '../../../style/SubmitButton';

import styles from './AfterPage.module.css';

export default function AfterPage({ testInfo }: { testInfo: any }) {
  let isFeedbackTime = TimeCalculator(
    testInfo.feedbackTime?.start,
    (testInfo.feedbackTime?.finish - testInfo.feedbackTime?.start) / 60000,
  );

  return (
    <div className={styles.container}>
      <div className={styles.comment}>
        시험이 종료되었습니다.
        <br />
        수고하셨습니다.
      </div>

      {testInfo.feedback && (
        <>
          <div className={styles.header}>성적 공개 기간</div>

          <div className={styles.infoContainer}>
            <div className={styles.infoElements}>
              <div className={styles.infoLabel}>공개 시작 일시</div>

              <div className={styles.infoValue}>
                {new Date(testInfo.feedbackTime.start).getFullYear()}년&nbsp;
                {new Date(testInfo.feedbackTime.start).getMonth() + 1}월&nbsp;
                {new Date(testInfo.feedbackTime.start).getDate()}일&nbsp;
                {String(new Date(testInfo.feedbackTime.start).getHours()).padStart(2, '0')}:
                {String(new Date(testInfo.feedbackTime.start).getMinutes()).padStart(2, '0')}
              </div>
            </div>

            <div className={styles.infoElements}>
              <div className={styles.infoLabel}>공개 종료 일시</div>

              <div className={styles.infoValue}>
                {new Date(testInfo.feedbackTime.finish).getFullYear()}년&nbsp;
                {new Date(testInfo.feedbackTime.finish).getMonth() + 1}월&nbsp;
                {new Date(testInfo.feedbackTime.finish).getDate()}일&nbsp;
                {String(new Date(testInfo.feedbackTime.finish).getHours()).padStart(2, '0')}:
                {String(new Date(testInfo.feedbackTime.finish).getMinutes()).padStart(2, '0')}
              </div>
            </div>

            <div
              className={styles.infoElements}
              style={{
                gridColumnStart: 1,
                gridColumnEnd: 3,
              }}
            >
              <div className={styles.infoLabel}>공개 항목</div>

              <div className={styles.infoValue}>
                {testInfo.feedbackQnA.question && '문제　'}
                {testInfo.feedbackQnA.answer && '정답　'}
                {testInfo.feedbackScore.score && '본인 점수　'}
                {testInfo.feedbackScore.average && '전체 평균 점수　'}
                {testInfo.feedbackScore.rank && '등수'}
              </div>
            </div>
          </div>

          <Buttons>
            <SubmitButton
              text="시험 결과 확인"
              onClick={() => window.open(location.href + '/feedback')}
              disabled={isFeedbackTime.isTime !== 'running'}
            />
          </Buttons>
        </>
      )}
    </div>
  );
}
