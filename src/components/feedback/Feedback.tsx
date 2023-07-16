import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import GetTestInfo from '../utils/GetTestInfo';
import GetApplicantList from '../utils/GetApplicantList';
import GetApplicantInfo from '../utils/GetApplicantInfo';
import GetQuestionList from '../utils/GetQuestionList';
import TimeCalculator from '../utils/TimeCalculator';

import QuestionContainer from './QuestionContainer';
import Error from '../../Error';

import styles from './Feedback.module.css';

export default function Feedback() {
  const { userCode, testCode, applicantCode } = useParams();

  function sumArray(array: number[]) {
    return array?.reduce((sum: number, current: number) => {
      return sum + current;
    }, 0);
  }

  let testInfo = GetTestInfo(userCode, testCode);
  let applicantList = GetApplicantList(userCode, testCode);
  let applicantInfo = GetApplicantInfo(userCode, testCode, applicantCode);
  let questionList = GetQuestionList(userCode, testCode);

  let isFeedbackTime = TimeCalculator(
    testInfo.feedbackTime?.start,
    (testInfo.feedbackTime?.finish - testInfo.feedbackTime?.start) / 60000,
  );

  const [totalScore, setTotalScore] = useState<number>(0);

  useEffect(() => {
    setTotalScore(sumArray(questionList.map((x: any) => x.points)));
  }, [questionList]);

  const [applicantScores, setApplicantScores] = useState<number[]>([]);
  const [applicantAverage, setApplicantAverage] = useState<number>(0);

  useEffect(() => {
    let temp = [];

    for (let i = 0; i < applicantList.length; i++) {
      temp.push(sumArray(applicantList[i].reportCard));
    }

    temp.sort().reverse();
    setApplicantScores(temp);
    setApplicantAverage(sumArray(temp) / applicantList.length);
  }, [applicantList]);

  let myScore: number = sumArray(applicantInfo.reportCard);

  let correctNumbers: number[] = [0, 0, 0, 0];
  let correctPoints: number[] = [0, 0, 0, 0];
  let typeNumbers: number[] = [0, 0, 0, 0];
  let typePoints: number[] = [0, 0, 0, 0];

  console.log();
  for (let i = 0; i < questionList.length; i++) {
    if (questionList[i].type === 'mc') {
      if (questionList[i].points === applicantInfo.reportCard[i]) {
        correctNumbers[0] = correctNumbers[0] + 1;
      }

      correctPoints[0] = correctPoints[0] + applicantInfo.reportCard[i];
      typeNumbers[0] = typeNumbers[0] + 1;
      typePoints[0] = typePoints[0] + questionList[i].points;
    } else if (questionList[i].type === 'tf') {
      if (questionList[i].points === applicantInfo.reportCard[i]) {
        correctNumbers[1] = correctNumbers[1] + 1;
      }

      correctPoints[1] = correctPoints[1] + applicantInfo.reportCard[i];
      typeNumbers[1] = typeNumbers[1] + 1;
      typePoints[1] = typePoints[1] + questionList[i].points;
    } else if (questionList[i].type === 'sa') {
      if (questionList[i].points === applicantInfo.reportCard[i]) {
        correctNumbers[2] = correctNumbers[2] + 1;
      }

      correctPoints[2] = correctPoints[2] + applicantInfo.reportCard[i];
      typeNumbers[2] = typeNumbers[2] + 1;
      typePoints[2] = typePoints[2] + questionList[i].points;
    } else if (questionList[i].type === 'essay') {
      if (questionList[i].points === applicantInfo.reportCard[i]) {
        correctNumbers[3] = correctNumbers[3] + 1;
      }

      correctPoints[3] = correctPoints[3] + applicantInfo.reportCard[i];
      typeNumbers[3] = typeNumbers[3] + 1;
      typePoints[3] = typePoints[3] + questionList[i].points;
    }
  }

  const [tab, setTab] = useState<number>(0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTestName}>{testInfo?.testName}</div>
        <div className={styles.headerApplicantName}>{applicantInfo?.applicantName}</div>
      </div>

      {testInfo.feedback ? (
        isFeedbackTime.isTime === 'running' ? (
          <>
            <div className={styles.containerTop}>
              <div>
                <div className={styles.infoHeader}>응시자 이름</div>

                <div className={styles.infoValue}>{applicantInfo.applicantName}</div>
              </div>

              <div>
                <div className={styles.infoHeader}>점수</div>

                <div className={styles.infoValue}>{myScore}점</div>
              </div>
            </div>

            <div className={styles.containerBottom}>
              <div className={styles.menuBar}>
                <div
                  className={tab === 0 ? styles.menuButtonSelected : styles.menuButtonNotSelected}
                  onClick={() => setTab(0)}
                >
                  <img src={process.env.PUBLIC_URL + '/icons/feedback/score.svg'} />
                  점수
                </div>

                <div
                  className={tab === 1 ? styles.menuButtonSelected : styles.menuButtonNotSelected}
                  onClick={() => setTab(1)}
                >
                  <img src={process.env.PUBLIC_URL + '/icons/feedback/answersheet.svg'} />
                  문제
                </div>
              </div>

              {tab === 0 ? (
                <>
                  <div className={styles.label}>종합 결과표</div>

                  <table className={styles.statisticTable}>
                    <tr>
                      <th>득점</th>
                      <th>정답 문항 수</th>
                      {testInfo.feedbackScore?.average && <th>평균</th>}
                      {testInfo.feedbackScore?.rank && <th>등수</th>}
                    </tr>

                    <tr>
                      <td>
                        <div>
                          {myScore} / {totalScore}
                        </div>
                        <div>({((myScore / totalScore) * 100).toFixed(1)}%)</div>
                      </td>

                      <td>
                        <div>
                          {sumArray(correctNumbers)} / {questionList.length}
                        </div>
                        <div>({((sumArray(correctNumbers) / questionList.length) * 100).toFixed(1)}%)</div>
                      </td>

                      {testInfo.feedbackScore?.average && (
                        <td>
                          <div>{applicantAverage.toFixed(1)}</div>
                        </td>
                      )}

                      {testInfo.feedbackScore?.rank && (
                        <td>
                          <div>
                            {applicantScores?.indexOf(myScore) + 1} / {applicantList.length}
                          </div>
                          <div>
                            (상위 {(((applicantScores?.indexOf(myScore) + 1) / applicantList.length) * 100).toFixed(1)}
                            %)
                          </div>
                        </td>
                      )}
                    </tr>
                  </table>

                  <div className={styles.label}>문제 유형별 점수표</div>

                  <table className={styles.detailTable}>
                    <tr>
                      <th style={{ width: '20%' }}>문제 유형</th>
                      <th style={{ width: '40%' }}>정답 문항 수 / 전체 문항 수</th>
                      <th style={{ width: '40%' }}>득점 / 총점</th>
                    </tr>

                    {[
                      ['mc', '객관식'],
                      ['tf', '참/거짓'],
                      ['sa', '주관식'],
                      ['essay', '서술형'],
                    ].map(
                      (elem: any, index: number) =>
                        typeNumbers[index] > 0 && (
                          <tr>
                            <td>{elem[1]}</td>
                            <td>
                              <span>
                                {correctNumbers[index]} / {typeNumbers[index]}
                              </span>
                              <span>({((correctNumbers[index] / typeNumbers[index]) * 100).toFixed(1)}%)</span>
                            </td>
                            <td>
                              <span>
                                {correctPoints[index]} / {typePoints[index]}
                              </span>
                              <span>({((correctPoints[index] / typePoints[index]) * 100).toFixed(1)}%)</span>
                            </td>
                          </tr>
                        ),
                    )}
                  </table>
                </>
              ) : (
                <>
                  {questionList.map((elem: any, index: number) => (
                    <QuestionContainer
                      questionObject={questionList[index]}
                      index={index}
                      answerSheet={applicantInfo.answerSheet}
                      score={applicantInfo.reportCard[index]}
                      showAnswer={testInfo.feedbackQnA.answer}
                    />
                  ))}
                </>
              )}
            </div>
          </>
        ) : (
          <Error message="시험 성적 공개기간이 아닙니다." />
        )
      ) : (
        <Error message="시험 성적이 공개된 시험이 아닙니다." />
      )}
    </div>
  );
}
