import styles from './Section3.module.css';

export default function Section3() {
  return (
    <div className={styles.container}>
      <div className={styles.subText}>쉽고, 빠르고, 간편한</div>
      <div className={styles.mainText}>4-Step 시험 진행 과정</div>
      <div className={styles.stepContainer}>
        <div className={styles.stepElements}>
          <div className={styles.stepNumber}>1</div>
          <img src={process.env.PUBLIC_URL + '/icons/dashboard/people.svg'} />
          <div className={styles.stepText}>
            <div className={styles.stepLabel}>응시자 추가</div>
            <div className={styles.stepComment}>
              응시자를 추가하여, 각 응시자마다 시험 코드 6자리와 고유 응시자 번호 8자리로 시험을 안내합니다.
            </div>
          </div>
        </div>

        <div className={styles.stepElements}>
          <div className={styles.stepNumber}>2</div>
          <img src={process.env.PUBLIC_URL + '/icons/dashboard/book.svg'} />
          <div className={styles.stepText}>
            <div className={styles.stepLabel}>문제 생성</div>
            <div className={styles.stepComment}>
              객관식, 주관식, 참/거짓, 서술형 문제를 생성할 수 있습니다. 정답/오답/미응답 상황에 따른 배점/감점 여부도
              설정할 수 있습니다.
            </div>
          </div>
        </div>

        <div className={styles.stepElements}>
          <div className={styles.stepNumber}>3</div>
          <img src={process.env.PUBLIC_URL + '/icons/dashboard/monitor.svg'} />
          <div className={styles.stepText}>
            <div className={styles.stepLabel}>시험 진행</div>
            <div className={styles.stepComment}>채팅, 공지사항, 일시정지 기능으로 시험을 감독할 수 있습니다. </div>
          </div>
        </div>

        <div className={styles.stepElements}>
          <div className={styles.stepNumber}>4</div>
          <img src={process.env.PUBLIC_URL + '/icons/dashboard/answersheet.svg'} />
          <div className={styles.stepText}>
            <div className={styles.stepLabel}>결과 확인</div>
            <div className={styles.stepComment}>
              시험이 종료되면, 답안지가 자동으로 채점되어, 결과를 한 눈에 확인할 수 있습니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
