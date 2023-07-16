import { useNavigate } from 'react-router-dom';

import Buttons from '../../style/Buttons';
import SubmitButton from '../../style/SubmitButton';
import Background from './Background';

import styles from './Section1.module.css';

export default function Section1() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.text}>
        <div className={styles.subText}>온라인 시험 플랫폼 테스트콘</div>

        <div className={styles.mainText}>
          테스트콘으로 빠르고 간편하게
          <br />
          온라인 시험을 진행해보세요.
        </div>
        <br />
        <br />

        <Buttons gap={10} position="center">
          <SubmitButton
            text="시험 응시하기"
            onClick={() => {
              navigate('/apply');
            }}
          />

          <SubmitButton
            text="체험하기"
            onClick={() => {
              navigate('apply/manager/sample/test/sample/applicant/sample');
            }}
          />
        </Buttons>
      </div>

      <Background />
    </div>
  );
}
