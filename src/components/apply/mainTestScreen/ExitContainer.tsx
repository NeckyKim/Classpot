import Buttons from '../../../style/Buttons';
import CheckBox from '../../../style/CheckBox';
import DeleteButton from '../../../style/DeleteButton';
import Modal from '../../../style/Modal';

import styles from './ExitContainer.module.css';

export default function ExitContainer({
  unsolvedList,
  flaggedList,
  reEntry,
  setQuestionIndex,
  finished,
  setFinished,
  setShowExit,
  submitAnswerSheet,
  exitTest,
  setIsApplyingTest,
}: {
  unsolvedList: number[];
  flaggedList: number[];
  reEntry: boolean;
  setQuestionIndex: any;
  finished: boolean;
  setFinished: any;
  setShowExit: any;
  submitAnswerSheet: any;
  exitTest: any;
  setIsApplyingTest: any;
}) {
  return (
    <Modal title="시험 종료" onClose={() => setShowExit(false)}>
      {unsolvedList.length > 0 && (
        <div>
          <div className={styles.unsolvedLabel}>
            <img src={process.env.PUBLIC_URL + '/icons/apply/alert.svg'} className={styles.unsolvedIcon} />

            <div className={styles.unsolvedComment}>
              풀지 않은 문제가{' '}
              <span style={{ fontWeight: '700', color: 'rgb(250, 50, 50)' }}>{unsolvedList.length}개</span> 있습니다.
            </div>
          </div>

          <div className={styles.unsolvedContainer} style={flaggedList.length > 0 ? { marginBottom: '0px' } : {}}>
            {unsolvedList.map((elem) => (
              <div
                className={styles.unsolvedElements}
                onClick={() => {
                  setShowExit(false);
                  setQuestionIndex(elem);
                }}
              >
                {elem + 1}
              </div>
            ))}
          </div>
        </div>
      )}

      {flaggedList.length > 0 && (
        <div>
          <div className={styles.flaggedLabel} style={unsolvedList.length > 0 ? { borderTop: 'none' } : {}}>
            <img src={process.env.PUBLIC_URL + '/icons/apply/flag_filled.svg'} className={styles.flaggedIcon} />

            <div className={styles.unsolvedComment}>
              체크한 문제가 <span style={{ fontWeight: '700', color: 'rgb(250, 150, 0)' }}>{flaggedList.length}개</span>{' '}
              있습니다.
            </div>
          </div>

          <div className={styles.flaggedContainer}>
            {flaggedList.map((elem) => (
              <div
                className={styles.flaggedElements}
                onClick={() => {
                  setShowExit(false);
                  setQuestionIndex(elem);
                }}
              >
                {elem + 1}
              </div>
            ))}
          </div>
        </div>
      )}

      {reEntry ? (
        <div>
          시험을 종료해도, 시험장에 다시 입장하여 시험을 계속 응시할 수 있습니다.
          <br />
          <br />
        </div>
      ) : (
        <>
          <div className={styles.reEntryComment}>
            시험을 종료하면 제출된 답안을 더 이상 수정할 수 없으며,
            <br />
            시험장에 다시 입장할 수 없습니다.
          </div>

          <div className={styles.checkBoxContainer}>
            확인했으며 시험을 종료하겠습니다.
            <CheckBox
              value={finished}
              onClick={() => {
                setFinished((prev: boolean) => !prev);
              }}
            />
          </div>
        </>
      )}
      <br />

      <Buttons>
        {reEntry ? (
          <DeleteButton
            text="종료"
            onClick={() => {
              submitAnswerSheet();
              exitTest();
              setIsApplyingTest(false);
            }}
          />
        ) : (
          <DeleteButton
            text="종료"
            onClick={() => {
              submitAnswerSheet();
              exitTest();
              setIsApplyingTest(false);
            }}
            disabled={!finished}
          />
        )}
      </Buttons>
    </Modal>
  );
}
