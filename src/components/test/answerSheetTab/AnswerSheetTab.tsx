import { useState, useEffect } from 'react';

import { dbService } from '../../../FirebaseModules';
import { doc, updateDoc } from 'firebase/firestore';

import QuestionContainer from './QuestionContainer';

import GetApplicantList from '../../utils/GetApplicantList';
import GetQuestionList from '../../utils/GetQuestionList';

import styles from './AnswerSheetTab.module.css';

export default function AnswerSheetTab({ userCode, testCode }: { userCode: any; testCode: any }) {
  let applicantList = GetApplicantList(userCode, testCode);
  let questionList = GetQuestionList(userCode, testCode);

  const [applicantIndex, setApplicantIndex] = useState<number | null>(null);

  function sumArray(array: number[]) {
    return array?.reduce((sum: number, current: number) => {
      return sum + current;
    }, 0);
  }

  for (let i = 0; i < applicantList?.length; i++) {
    let reportCard = applicantList[i]?.reportCard;

    for (let j = 0; j < questionList?.length; j++) {
      // mc
      if (questionList[j]?.type === 'mc' && applicantList[i]?.answerSheet[j] !== null) {
        // 채점: 기본
        if (questionList[j]?.grading === 0) {
          // 정답
          if (
            JSON.stringify(questionList[j].answer) === JSON.stringify(Object.values(applicantList[i]?.answerSheet[j]))
          ) {
            reportCard[j] = questionList[j].points;
          }

          // 미응답
          else if (
            JSON.stringify(new Array(questionList[j].choices.length).fill(false)) ===
            JSON.stringify(Object.values(applicantList[i]?.answerSheet[j]))
          ) {
            reportCard[j] = null;
          }

          // 오답
          else {
            reportCard[j] = 0;
          }
        }

        // 채점: 오답 시 감점
        else if (questionList[j]?.grading === 1) {
          // 정답
          if (
            JSON.stringify(questionList[j].answer) === JSON.stringify(Object.values(applicantList[i]?.answerSheet[j]))
          ) {
            reportCard[j] = questionList[j].points;
          }

          // 미응답
          else if (
            JSON.stringify(new Array(questionList[j].choices.length).fill(false)) ===
            JSON.stringify(Object.values(applicantList[i]?.answerSheet[j]))
          ) {
            reportCard[j] = null;
          }

          // 오답
          else {
            reportCard[j] = -questionList[j].points;
          }
        }

        // 채점: 응답 시 만점
        else if (questionList[j]?.grading === 2) {
          // 응답
          if (
            JSON.stringify(new Array(questionList[j].choices.length).fill(false)) !==
              JSON.stringify(Object.values(applicantList[i]?.answerSheet[j])) &&
            applicantList[i]?.answerSheet[j] !== null
          ) {
            reportCard[j] = questionList[j].points;
          }

          // 미응답
          else {
            reportCard[j] = null;
          }
        }
      }

      // tf
      else if (questionList[j]?.type === 'tf') {
        // 채점: 기본
        if (questionList[j]?.grading === 0) {
          // 정답
          if (questionList[j].answer === applicantList[i]?.answerSheet[j]) {
            reportCard[j] = questionList[j].points;
          }

          // 미응답
          else if (applicantList[i]?.answerSheet[j] === null) {
            reportCard[j] = null;
          }

          // 오답
          else if (questionList[j].answer !== applicantList[i]?.answerSheet[j]) {
            reportCard[j] = 0;
          }
        }

        // 채점: 오답 시 감점
        else if (questionList[j]?.grading === 1) {
          // 정답
          if (questionList[j].answer === applicantList[i]?.answerSheet[j]) {
            reportCard[j] = questionList[j].points;
          }

          // 미응답
          else if (applicantList[i]?.answerSheet[j] === null) {
            reportCard[j] = null;
          }

          // 오답
          else if (questionList[j].answer !== applicantList[i]?.answerSheet[j]) {
            reportCard[j] = -questionList[j].points;
          }
        }

        // 채점: 응답 시 만점
        else if (questionList[j]?.grading === 2) {
          // 응답
          if (applicantList[i]?.answerSheet[j] === true || applicantList[i]?.answerSheet[j] === false) {
            reportCard[j] = questionList[j].points;
          }

          // 미응답
          else {
            reportCard[j] = null;
          }
        }
      }

      // sa
      else if (questionList[j]?.type === 'sa') {
        // 채점: 기본
        if (questionList[j]?.grading === 0) {
          // 정답
          if (questionList[j].answer === applicantList[i]?.answerSheet[j]) {
            reportCard[j] = questionList[j].points;
          }

          // 미응답
          else if (applicantList[i]?.answerSheet[j] === '' || applicantList[i]?.answerSheet[j] === null) {
            reportCard[j] = null;
          }

          // 오답
          else {
            reportCard[j] = 0;
          }
        }

        // 채점: 오답 시 감점
        else if (questionList[j]?.grading === 1) {
          // 정답
          if (questionList[j].answer === applicantList[i]?.answerSheet[j]) {
            reportCard[j] = questionList[j].points;
          }

          // 미응답
          else if (applicantList[i]?.answerSheet[j] === '' || applicantList[i]?.answerSheet[j] === null) {
            reportCard[j] = null;
          }

          // 오답
          else {
            reportCard[j] = -questionList[j].points;
          }
        }

        // 채점: 응답 시 만점
        else if (questionList[j]?.grading === 2) {
          // 응답
          if (applicantList[i]?.answerSheet[j]) {
            reportCard[j] = questionList[j].points;
          }

          // 미응답
          else {
            reportCard[j] = null;
          }
        }
      }

      // essay
      else if (questionList[j]?.type === 'essay') {
        // 채점: 응답 시 만점
        if (questionList[j]?.grading === 2) {
          // 응답
          if (applicantList[i]?.answerSheet[j]) {
            reportCard[j] = questionList[j].points;
          }

          // 미응답
          else {
            reportCard[j] = null;
          }
        }
      }
    }

    updateDoc(doc(dbService, 'users', userCode, 'tests', testCode, 'applicants', applicantList[i].applicantCode), {
      reportCard: reportCard,
    });
  }

  const [myScore, setMyScore] = useState<number>(0);

  const [correctNumbers, setCorrectNumbers] = useState<number[]>([0, 0, 0, 0]);
  const [correctPoints, setCorrectPoints] = useState<number[]>([0, 0, 0, 0]);
  const [typeNumbers, setTypeNumbers] = useState<number[]>([0, 0, 0, 0]);
  const [typePoints, setTypePoints] = useState<number[]>([0, 0, 0, 0]);

  useEffect(() => {
    if (applicantIndex) {
      let copy1 = [...correctNumbers];
      let copy2 = [...correctPoints];
      let copy3 = [...typeNumbers];
      let copy4 = [...typePoints];

      for (let i = 0; i < questionList?.length; i++) {
        if (questionList[i]?.type === 'mc') {
          if (questionList[i]?.points === applicantList[applicantIndex]?.reportCard[i]) {
            copy1[0] = copy1[0] + 1;
          }

          copy2[0] = copy2[0] + applicantList[applicantIndex]?.reportCard[i];
          copy3[0] = copy3[0] + 1;
          copy4[0] = copy4[0] + questionList[i].points;
        } else if (questionList[i]?.type === 'tf') {
          if (questionList[i]?.points === applicantList[applicantIndex]?.reportCard[i]) {
            copy1[1] = copy1[1] + 1;
          }

          copy2[1] = copy2[1] + applicantList[applicantIndex]?.reportCard[i];
          copy3[1] = copy3[1] + 1;
          copy4[1] = copy4[1] + questionList[i].points;
        } else if (questionList[i]?.type === 'sa') {
          if (questionList[i]?.points === applicantList[applicantIndex]?.reportCard[i]) {
            copy1[2] = copy1[2] + 1;
          }

          copy2[2] = copy2[2] + applicantList[applicantIndex]?.reportCard[i];
          copy3[2] = copy3[2] + 1;
          copy4[2] = copy4[2] + questionList[i].points;
        } else if (questionList[i]?.type === 'essay') {
          if (questionList[i]?.points === applicantList[applicantIndex]?.reportCard[i]) {
            copy1[3] = copy1[3] + 1;
          }

          copy2[3] = copy2[3] + applicantList[applicantIndex]?.reportCard[i];
          copy3[3] = copy3[3] + 1;
          copy4[3] = copy4[3] + questionList[i].points;
        }
      }

      setCorrectNumbers(copy1);
      setCorrectPoints(copy2);
      setTypeNumbers(copy3);
      setTypePoints(copy4);

      setMyScore(sumArray(applicantList[applicantIndex]?.reportCard));
    }
  }, [applicantIndex]);

  const [correct, setCorrect] = useState<number>(0);

  useEffect(() => {
    let count = 0;

    if (applicantIndex !== null) {
      for (let i = 0; i < questionList.length; i++) {
        if (questionList[i].points === applicantList[applicantIndex].reportCard[i]) {
          count = count + 1;
        }
      }

      setCorrect(count);
    }
  }, [applicantIndex]);

  return (
    <div className={styles.container}>
      <div className={styles.applicantListContainer}>
        {applicantList.length > 0 ? (
          applicantList.map((elem: any, index: number) => (
            <div
              className={applicantIndex === index ? styles.applicantSelected : styles.applicantNotSelected}
              onClick={() => {
                setApplicantIndex(index);
                localStorage.setItem(
                  `Chatting_${userCode}_${testCode}_${elem.applicantCode}`,
                  elem.chatting.slice(-1)[0]?.time,
                );
              }}
            >
              <img className={styles.applicantImage} src={process.env.PUBLIC_URL + '/icons/dashboard/user.svg'} />

              <div className={styles.applicantName}>{elem.applicantName}</div>

              <div className={styles.applicantScore}>{sumArray(elem.reportCard)}점</div>
            </div>
          ))
        ) : (
          <div>응시자가 없습니다.</div>
        )}
      </div>

      <div className={styles.answerSheetContainer}>
        {applicantIndex !== null ? (
          <>
            <div className={styles.infoContainer}>
              <div>
                <div className={styles.infoHeader}>응시자 이름</div>

                <div className={styles.infoValue}>
                  <div className={styles.infoValue1}>{applicantList[applicantIndex].applicantName}</div>
                </div>
              </div>

              <div>
                <div className={styles.infoHeader}>점수</div>

                <div className={styles.infoValue}>
                  <div className={styles.infoValue1}>
                    {sumArray(applicantList[applicantIndex].reportCard)}/
                    {sumArray(questionList.map((x: any) => x.points))}점
                  </div>

                  <div className={styles.infoValue2}>
                    (
                    {(
                      (sumArray(applicantList[applicantIndex].reportCard) /
                        sumArray(questionList.map((x: any) => x.points))) *
                      100
                    ).toFixed(1)}
                    %)
                  </div>
                </div>
              </div>

              <div>
                <div className={styles.infoHeader}>정답률</div>

                <div className={styles.infoValue}>
                  <div className={styles.infoValue1}>
                    {correct}/{questionList.length}개
                  </div>

                  <div className={styles.infoValue2}>({((correct / questionList.length) * 100).toFixed(1)}%)</div>
                </div>
              </div>
            </div>

            {questionList.length > 0 ? (
              questionList.map((elem: any, index: number) => (
                <QuestionContainer
                  userCode={userCode}
                  testCode={testCode}
                  applicantCode={applicantList[applicantIndex].applicantCode}
                  questionObject={elem}
                  index={index}
                  answerSheet={applicantList[applicantIndex].answerSheet}
                  reportCard={applicantList[applicantIndex].reportCard}
                  score={applicantList[applicantIndex].reportCard[index]}
                />
              ))
            ) : (
              <div className={styles.empty}>문제가 없습니다.</div>
            )}
          </>
        ) : (
          <div className={styles.empty}>응시자를 선택해주세요.</div>
        )}
      </div>
    </div>
  );
}
