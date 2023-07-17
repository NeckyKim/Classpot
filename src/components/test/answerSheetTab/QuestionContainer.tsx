import { dbService } from '../../../FirebaseModules';
import { doc, updateDoc } from 'firebase/firestore';

import { toast } from 'react-toastify';
import { Editor } from '@tinymce/tinymce-react';

import Label from '../../../style/Label';
import CancelButton from '../../../style/CancelButton';
import QuestionType from '../../../style/QuestionType';

import styles from './QuestionContainer.module.css';

export default function QuestionContainer({
  userCode,
  testCode,
  applicantCode,
  questionObject,
  index,
  answerSheet,
  reportCard,
  score,
}: {
  userCode: string | undefined;
  testCode: string | undefined;
  applicantCode: string | undefined;
  questionObject: any;
  index: number;
  answerSheet: any;
  reportCard: any;
  score: any;
}) {
  async function gradingManual(event: any) {
    event.preventDefault();

    if (userCode && testCode && applicantCode) {
      let score = Number(
        prompt(`해당 답안에 점수를 직접 부여합니다.\n0점부터 ${questionObject.points}점 까지 부여할 수 있습니다.`),
      );

      if (score < 0) {
        toast.error('0점 이상 설정할 수 있습니다.', { toastId: '' });
      } else if (score > questionObject.points) {
        toast.error('배점보다 점수를 높게 부여할 수 없습니다.', { toastId: '' });
      } else if (score > 0 && score <= questionObject.points) {
        let copy = JSON.parse(JSON.stringify(reportCard));
        copy[index] = score;

        try {
          await updateDoc(doc(dbService, 'users', userCode, 'tests', testCode, 'applicants', applicantCode), {
            reportCard: copy,
          });

          toast.success('채점 결과가 변경되었습니다.', { toastId: '' });
        } catch (error) {
          console.log(error);
          toast.error('채점 결과 수정에 실패했습니다.', { toastId: '' });
        }
      }
    } else {
      toast.error('채점 결과 수정에 실패했습니다.', { toastId: '' });
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.containerTop}>
        <div className={styles.containerTopNumber}>{index + 1}</div>

        <div className={styles.containerTopValue}>{questionObject.name}</div>

        <QuestionType type={questionObject.type} />

        <div className={styles.containerTopValue}>{questionObject.points}점</div>

        <div className={styles.containerTopValue}>
          {(() => {
            switch (questionObject.grading) {
              case 0:
                return questionObject.type === 'essay' ? '직접 채점' : '정답 시 만점';
              case 1:
                return '오답 시 감점';
              case 2:
                return '응답 시 만점';
            }
          })()}
        </div>
      </div>

      <div className={styles.containerBottom}>
        <Label style={{ marginBottom: '-10px' }}>지문</Label>

        <div className={styles.passage}>
          <Editor
            apiKey={process.env.REACT_APP_TINYMCE_EDITOR_ID}
            disabled={true}
            value={questionObject.question}
            init={{
              readonly: true,
              menubar: false,
              toolbar: false,
              statusbar: false,
              plugins: ['autoresize', 'codesample'],
              content_style: `
                            @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

                            body {
                                font-family:'Pretendard';
                                font-weight: 500;
                                margin: 0px;
                                padding: 0px;
                                word-break: keep-all;
                            }
                        `,
            }}
          />
        </div>

        {(() => {
          switch (questionObject.type) {
            case 'mc':
              return (
                <>
                  <Label>제출 답안</Label>

                  <div className={styles.choiceContainer}>
                    {questionObject.choices.map((elem: any, index2: number) => (
                      <div className={styles.choiceElements}>
                        <div
                          className={
                            answerSheet[index]?.[index2] ? styles.choiceNumberCorrect : styles.choiceNumberIncorrect
                          }
                        >
                          {index2 + 1}
                        </div>

                        <div
                          className={
                            answerSheet[index]?.[index2] ? styles.choiceValueCorrect : styles.choiceValueIncorrect
                          }
                        >
                          {elem}
                        </div>
                      </div>
                    ))}
                  </div>
                  <br />
                  <br />

                  <Label>정답</Label>

                  <div className={styles.choiceContainer}>
                    {questionObject.choices.map((elem: any, index: number) => (
                      <div className={styles.choiceElements}>
                        <div
                          className={
                            questionObject.answer[index] ? styles.choiceNumberCorrect : styles.choiceNumberIncorrect
                          }
                        >
                          {index + 1}
                        </div>

                        <div
                          className={
                            questionObject.answer[index] ? styles.choiceValueCorrect : styles.choiceValueIncorrect
                          }
                        >
                          {elem}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              );

            case 'tf':
              return (
                <>
                  <Label>제출 답안</Label>

                  <div className={styles.answer}>
                    {answerSheet[index] === true && (
                      <div className={styles.choiceElements}>
                        <div className={styles.choiceNumberTrue}>
                          <img src={process.env.PUBLIC_URL + '/icons/dashboard/correct.svg'} />
                        </div>

                        <div className={styles.choiceValueTrue}>참</div>
                      </div>
                    )}

                    {answerSheet[index] === false && (
                      <div className={styles.choiceElements}>
                        <div className={styles.choiceNumberFalse}>
                          <img src={process.env.PUBLIC_URL + '/icons/dashboard/wrong.svg'} />
                        </div>

                        <div className={styles.choiceValueFalse}>거짓</div>
                      </div>
                    )}

                    {(answerSheet[index] === null || answerSheet[index] === '') && (
                      <div className={styles.answerSheetEmpty}>응답하지 않음</div>
                    )}
                  </div>
                  <br />
                  <br />

                  <Label>정답</Label>

                  <div className={styles.answer}>
                    {questionObject.answer ? (
                      <div className={styles.choiceElements}>
                        <div className={styles.choiceNumberTrue}>
                          <img src={process.env.PUBLIC_URL + '/icons/dashboard/correct.svg'} />
                        </div>

                        <div className={styles.choiceValueTrue}>참</div>
                      </div>
                    ) : (
                      <div className={styles.choiceElements}>
                        <div className={styles.choiceNumberFalse}>
                          <img src={process.env.PUBLIC_URL + '/icons/dashboard/wrong.svg'} />
                        </div>

                        <div className={styles.choiceValueFalse}>거짓</div>
                      </div>
                    )}
                  </div>
                </>
              );

            case 'sa':
              return (
                <>
                  <Label>제출 답안</Label>

                  {answerSheet[index] !== null && answerSheet[index] !== '' ? (
                    <div className={styles.choiceValueCorrect}>{answerSheet[index]}</div>
                  ) : (
                    <div className={styles.answerSheetEmpty}>응답하지 않음</div>
                  )}
                  <br />
                  <br />

                  <Label>정답</Label>

                  <div className={styles.choiceValueCorrect}>{questionObject.answer}</div>
                </>
              );

            case 'essay':
              return (
                <>
                  <Label>제출 답안</Label>

                  {answerSheet[index] !== null && answerSheet[index] !== '' ? (
                    <div className={styles.choiceValueCorrect}>{answerSheet[index]}</div>
                  ) : (
                    <div className={styles.answerSheetEmpty}>응답하지 않음</div>
                  )}
                </>
              );
          }
        })()}
        <br />
        <br />

        <Label>채점 결과</Label>

        {score === questionObject.points && (
          <div className={styles.grading}>
            <div className={styles.gradingGreen}>정답</div>

            <div className={styles.gradingText}>+{questionObject.points}점</div>
          </div>
        )}

        {questionObject.type !== 'essay' && score === null && (
          <div className={styles.grading}>
            <div className={styles.gradingGray}>미응답</div>

            <div className={styles.gradingText}>0점</div>
          </div>
        )}

        {questionObject.type !== 'essay' && (score === 0 || score < 0) && (
          <div className={styles.grading}>
            <div className={styles.gradingRed}>오답</div>

            <div className={styles.gradingText}>{score}점</div>
          </div>
        )}

        {questionObject.type === 'essay' &&
          score === null &&
          (answerSheet[index] === null || answerSheet[index] === '') && (
            <div className={styles.grading}>
              <div className={styles.gradingGray}>미응답</div>
            </div>
          )}

        {questionObject.type === 'essay' && score === null && answerSheet[index] !== null && (
          <div className={styles.grading}>
            <div className={styles.gradingGray}>채점 전</div>
          </div>
        )}

        {questionObject.type === 'essay' && (score === 0 || score < 0) && (
          <div className={styles.grading}>
            <div className={styles.gradingRed}>오답</div>

            <div className={styles.gradingText}>{score}점</div>
          </div>
        )}

        {questionObject.type === 'essay' && score > 0 && score < questionObject.points && (
          <div className={styles.grading}>
            <div className={styles.gradingYellow}>부분 정답</div>

            <div className={styles.gradingText}>+{score}점</div>
          </div>
        )}

        {questionObject.type === 'essay' && questionObject.grading === 0 && (
          <CancelButton text="채점하기" onClick={gradingManual} style={{ marginTop: '20px' }} />
        )}
      </div>
    </div>
  );
}
