import { useState } from 'react';

import Buttons from '../../../style/Buttons';
import SubmitButton from '../../../style/SubmitButton';
import CheckBox from '../../../style/CheckBox';

import styles from './Page3.module.css';

export default function Page3({ setPage, checks, setChecks }: { setPage: any; checks: boolean[]; setChecks: any }) {
  const [agreement1, setAgreement1] = useState<boolean>(true);
  const [agreement2, setAgreement2] = useState<boolean>(false);
  const [agreement3, setAgreement3] = useState<boolean>(false);

  return (
    <div>
      <div className={styles.comment}>
        다음 <span style={{ fontWeight: '700', color: 'rgb(0, 100, 250)' }}>약관 내용</span>을 확인하고&nbsp;
        <span style={{ fontWeight: '700', color: 'rgb(0, 100, 250)' }}>동의</span>해주세요.
      </div>

      <div
        className={styles.agreementContainer}
        onClick={() => setAgreement1((prev) => !prev)}
        style={{ borderTop: '1px solid rgb(220, 220, 220)' }}
      >
        <div className={styles.agreementHeader}>
          문제 저작권 보호 및 유출 금지 동의
          <img
            src={process.env.PUBLIC_URL + '/icons/apply/arrow_down.svg'}
            className={agreement1 ? styles.agreementArrowDown : styles.agreementArrowUp}
          />
        </div>

        <div className={agreement1 ? styles.agreementOpen : styles.agreementClosed}>
          <br />본 시험 문제는 저작권의 보호를 받으며, 지문 및 보기에 대한 정보를 무단 복제, 공중송신 배포, 활용하거나
          2차 저작물을 작성하는 등의 행위를 금합니다. 문제에 대한 정보를 시험 출제자의 동의 없이 타인에게 공개하거나
          전달하는 행위는 출제자의 재산을 침해하는 것으로, 이를 위반할 경우 관계법에 의거 민사 또는 형사상의 법적 조치도
          취할 수 있음을 알려드립니다.
        </div>
      </div>

      <div className={styles.agreementContainer} onClick={() => setAgreement2((prev) => !prev)}>
        <div className={styles.agreementHeader}>
          부정행위 처리 동의
          <img
            src={process.env.PUBLIC_URL + '/icons/apply/arrow_down.svg'}
            className={agreement2 ? styles.agreementArrowDown : styles.agreementArrowUp}
          />
        </div>

        <div className={agreement2 ? styles.agreementOpen : styles.agreementClosed}>
          <br />
          부정행위는 시험 규정 외 불공정하거나 부정한 방법을 이용하여 점수를 취득하거나 취득하려고 하는 행위 등 공정한
          시험 평가에 저촉되는 모든 행위를 말합니다. 시험 진행 중 부정행위가 확인되는 경우, 시험 즉시 종료, 재시험 불가,
          시험 성적 무효 처리 등의 조치가 이루어질 수 있으며 이에 동의합니다.
        </div>
      </div>

      <div className={styles.agreementContainer} onClick={() => setAgreement3((prev) => !prev)}>
        <div className={styles.agreementHeader}>
          개인정보 수집·이용 동의
          <img
            src={process.env.PUBLIC_URL + '/icons/apply/arrow_down.svg'}
            className={agreement3 ? styles.agreementArrowDown : styles.agreementArrowUp}
          />
        </div>

        <div className={agreement3 ? styles.agreementOpen : styles.agreementClosed}>
          <br />
          테스트콘이 제공하는 시험 기능 이용을 위하여 아래와 같이 개인 정보를 수집·이용 및 제공하고자 합니다. 아래
          사항을 확인하신 후, 동의 여부를 체크해 주시길 바랍니다. 응시자는 개인 정보의 수집·이용 동의를 거부할 권리가
          있습니다. 다만 제공받은 정보는 서비스 이용에 필수적인 항목으로 동의 거부 시에는 시험 참여가 제한됩니다.
          <table>
            <thead>
              <tr>
                <th>수집 목적</th>
                <th>수집 항목</th>
                <th style={{ borderRight: 'none' }}>보유·이용 기간</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>시험 평가 및 진행</td>
                <td>시험 응시 결과(정답 유무, 점수, 채팅 목록 등)</td>
                <td style={{ borderRight: 'none' }}>수집 목적 달성 시 까지</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.agreeCheckBox}>
        다음 약관의 내용을 모두 확인했으며 동의합니다.
        <CheckBox
          value={checks[2]}
          onClick={() => {
            let copy = [...checks];
            copy[2] = !copy[2];
            setChecks(copy);
          }}
        />
      </div>

      <Buttons>
        <SubmitButton text="다음" onClick={() => setPage(4)} disabled={!checks[2]} />
      </Buttons>
    </div>
  );
}
