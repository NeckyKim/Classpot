import { Editor } from '@tinymce/tinymce-react';

import Label from '../../style/Label';
import QuestionType from '../../style/QuestionType';

import styles from './QuestionContainer.module.css';

export default function QuestionContainer({
  questionObject,
  index,
  answerSheet,
  score,
  showAnswer,
}: {
  questionObject: any;
  index: number;
  answerSheet: any;
  score: any;
  showAnswer: boolean;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.containerTop}>
        <div className={styles.containerTopNumber}>{index + 1}</div>

        <QuestionType type={questionObject.type} />

        <div className={styles.containerTopValue}>{questionObject.points}점</div>
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

        {questionObject.type === 'mc' && (
          <>
            <Label style={{ marginBottom: '10px' }}>제출 답안</Label>

            <div className={styles.choiceContainer}>
              {questionObject.choices.map((elem: any, index2: number) => (
                <div className={styles.choiceElements}>
                  <div
                    className={answerSheet[index]?.[index2] ? styles.choiceNumberCorrect : styles.choiceNumberIncorrect}
                  >
                    {index2 + 1}
                  </div>

                  <div
                    className={answerSheet[index]?.[index2] ? styles.choiceValueCorrect : styles.choiceValueIncorrect}
                  >
                    {elem}
                  </div>
                </div>
              ))}
            </div>
            <br />
            <br />

            {showAnswer && (
              <>
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
            )}
          </>
        )}

        {questionObject.type === 'tf' && (
          <>
            <Label style={{ marginBottom: '10px' }}>제출 답안</Label>

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

            {showAnswer && (
              <>
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
            )}
          </>
        )}

        {questionObject.type === 'sa' && (
          <>
            <Label style={{ marginBottom: '10px' }}>제출 답안</Label>

            {answerSheet[index] !== null && answerSheet[index] !== '' ? (
              <div className={styles.choiceValueCorrect}>{answerSheet[index]}</div>
            ) : (
              <div className={styles.answerSheetEmpty}>응답하지 않음</div>
            )}
            <br />
            <br />

            {showAnswer && (
              <>
                <Label>정답 </Label>

                <div className={styles.choiceValueCorrect}>{questionObject.answer}</div>
              </>
            )}
          </>
        )}

        {questionObject.type === 'essay' && (
          <>
            <Label style={{ marginBottom: '10px' }}>제출 답안</Label>

            {answerSheet[index] !== null && answerSheet[index] !== '' ? (
              <div className={styles.choiceValueCorrect}>{answerSheet[index]}</div>
            ) : (
              <div className={styles.answerSheetEmpty}>응답하지 않음</div>
            )}
          </>
        )}
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
      </div>
    </div>
  );
}
