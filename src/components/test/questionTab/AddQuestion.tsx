import { useState } from 'react';

import { dbService } from '../../../FirebaseModules';
import { doc, setDoc, collection } from 'firebase/firestore';

import ChoiceContainer from './ChoiceContainer';

import Title from '../../../style/Title';
import Label from '../../../style/Label';
import InputBox from '../../../style/InputBox';
import Buttons from '../../../style/Buttons';
import SubmitButton from '../../../style/SubmitButton';
import CancelButton from '../../../style/CancelButton';
import RadioButton from '../../../style/RadioButton';

import { toast } from 'react-toastify';
import { Editor } from '@tinymce/tinymce-react';

import styles from './AddQuestion.module.css';

export default function AddQuestion({
  userCode,
  testCode,
  setIsAddingQuestion,
}: {
  userCode: string | undefined;
  testCode: string | undefined;
  setIsAddingQuestion: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [name, setName] = useState<string>('');
  const [type, setType] = useState<string>('mc');
  const [points, setPoints] = useState<number>(1);

  const [question, setQuestion] = useState<string>('');
  const [choices, setChoices] = useState<string[]>(new Array(3).fill(''));
  const [answer, setAnswer] = useState<boolean[] | string | boolean>(new Array(3).fill(false));

  const [grading, setGrading] = useState<number>(0);

  async function addQuestion(event: any) {
    event.preventDefault();

    if (userCode && testCode) {
      if (!name) {
        toast.error('이름을 입력해주세요.', { toastId: '' });
      } else if (points === 0) {
        toast.error('배점은 1점 이상으로 설정해주세요.', { toastId: '' });
      } else if (type === 'mc' && question === '') {
        toast.error('지문을 입력해주세요.', { toastId: '' });
      } else if (
        type === 'mc' &&
        Array.isArray(choices) &&
        choices.filter((x) => x.replace(/\s+/g, '') === '').length > 0
      ) {
        toast.error('보기를 모두 입력해주세요.', { toastId: '' });
      } else if (type === 'mc' && Array.isArray(answer) && answer.filter((x) => x === true).length === 0) {
        toast.error('정답을 최소 1개를 설정해주세요.', { toastId: '' });
      } else if (type === 'sa' && typeof answer === 'string' && answer.replace(/(\s*)/g, '') === '') {
        toast.error('정답을 입력해주세요.', { toastId: '' });
      } else {
        try {
          await setDoc(doc(collection(dbService, 'users', userCode, 'tests', testCode, 'questions')), {
            name: name,
            type: type,
            points: points,
            question: question,
            answer: type === 'sa' && !Array.isArray(answer) && typeof answer === 'string' ? answer.trim() : answer,
            choices: choices,
            created: Date.now(),
            grading: grading,
          });

          setIsAddingQuestion(false);
          setQuestion('');

          toast.success('문제가 추가되었습니다.', { toastId: '' });
        } catch (error) {
          console.log(error);
          toast.error('문제 추가에 실패했습니다.', { toastId: '' });
        }
      }
    } else {
      toast.error('문제 추가에 실패했습니다.', { toastId: '' });
    }
  }

  return (
    <div className={styles.container}>
      <Title>문제 추가</Title>

      <div>
        <Label>이름</Label>

        <InputBox type="string" value={name} onChange={(event: any) => setName(event.target.value)} />
      </div>

      <div>
        <Label>유형</Label>

        <div className={styles.typeContainer}>
          <div className={styles.radioBox} style={{ borderRight: '1px solid rgb(220, 220, 220)' }}>
            <RadioButton
              value={type === 'mc'}
              onClick={() => {
                if (type !== 'mc') {
                  setType('mc');
                  setChoices(new Array(3).fill(''));
                  setAnswer(new Array(3).fill(false));
                }
              }}
            />
            <img src={process.env.PUBLIC_URL + '/icons/mc.svg'} />
            객관식
          </div>

          <div className={styles.radioBox} style={{ borderRight: '1px solid rgb(220, 220, 220)' }}>
            <RadioButton
              value={type === 'sa'}
              onClick={() => {
                setType('sa');
                setAnswer('');
              }}
            />
            <img src={process.env.PUBLIC_URL + '/icons/sa.svg'} />
            주관식
          </div>

          <div className={styles.radioBox} style={{ borderRight: '1px solid rgb(220, 220, 220)' }}>
            <RadioButton
              value={type === 'tf'}
              onClick={() => {
                setType('tf');
                setAnswer(true);
              }}
            />
            <img src={process.env.PUBLIC_URL + '/icons/tf.svg'} />
            참/거짓
          </div>

          <div className={styles.radioBox}>
            <RadioButton
              value={type === 'essay'}
              onClick={() => {
                setType('essay');
              }}
            />
            <img src={process.env.PUBLIC_URL + '/icons/essay.svg'} />
            서술형
          </div>
        </div>
      </div>

      <div>
        <Label>배점</Label>

        <InputBox
          type="number"
          value={points}
          onChange={(event: any) => setPoints(Number(event.target.value))}
          style={{ width: '100px' }}
          min={1}
        />
      </div>

      <div>
        <Label>지문</Label>

        <div className={styles.questionContainer}>
          <Editor
            apiKey={process.env.REACT_APP_TINYMCE_EDITOR_ID}
            initialValue=""
            value={question}
            onEditorChange={(content) => setQuestion(content)}
            init={{
              height: 500,
              menubar: false,
              statusbar: false,
              plugins: ['lists', 'image', 'table', 'codesample', 'lineheight'],
              toolbar:
                'fontsize | bold italic underline strikethrough | lineheight alignleft aligncenter alignright alignjustify | outdent indent | bullist numlist | image table codesample',
              font_size_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
              resize: false,
              content_style: `
                                @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

                                body {
                                    font-family: 'Pretendard';
                                    font-weight: 500;
                                    line-height: 1;
                                    word-break: keep-all;
                                }

                                p {
                                    font-size: 14pt;
                                }
                            `,
            }}
          />
        </div>
      </div>

      <div>
        <Label>{type === 'mc' ? '보기' : '정답'}</Label>

        {(() => {
          switch (type) {
            case 'mc':
              return (
                Array.isArray(answer) && (
                  <div className={styles.choices}>
                    {[0, 1, 2].map((x) => (
                      <ChoiceContainer
                        index={x}
                        choices={choices}
                        setChoices={setChoices}
                        answer={answer}
                        setAnswer={setAnswer}
                      />
                    ))}
                    {[3, 4, 5, 6, 7, 8, 9].map(
                      (x) =>
                        choices.length > x && (
                          <ChoiceContainer
                            index={x}
                            choices={choices}
                            setChoices={setChoices}
                            answer={answer}
                            setAnswer={setAnswer}
                          />
                        ),
                    )}

                    <div
                      className={styles.addChoiceButton}
                      onClick={() => {
                        if (Array.isArray(answer) && answer.length < 10) {
                          let copy1 = [...choices];
                          let copy2 = [...answer];

                          copy1.push('');
                          copy2.push(false);

                          setChoices(copy1);
                          setAnswer(copy2);
                        } else {
                          toast.error('보기는 최대 10개 까지 설정할 수 있습니다.', { toastId: '' });
                        }
                      }}
                    >
                      <img
                        src={process.env.PUBLIC_URL + '/icons/dashboard/add_fill.svg'}
                        className={styles.addChoiceIcon}
                      />
                      보기 추가
                    </div>
                  </div>
                )
              );

            case 'sa':
              return (
                !Array.isArray(answer) &&
                typeof answer === 'string' && (
                  <input
                    type="text"
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    className={styles.answerInputBox}
                    spellCheck={false}
                  />
                )
              );

            case 'tf':
              return (
                <div className={styles.trueFalseContainer}>
                  <div className={styles.radioBox} style={{ borderRight: '1px solid rgb(220, 220, 220)' }}>
                    <RadioButton value={typeof answer === 'boolean' && answer} onClick={() => setAnswer(true)} />참
                  </div>

                  <div className={styles.radioBox}>
                    <RadioButton value={typeof answer === 'boolean' && !answer} onClick={() => setAnswer(false)} />
                    거짓
                  </div>
                </div>
              );

            case 'essay':
              return <div className={styles.valueBox}>서술형 문제는 정답을 설정할 수 없습니다.</div>;
          }
        })()}
      </div>

      <div>
        <Label>채점 방식</Label>

        {type !== 'essay' ? (
          <div className={styles.gradingContainer}>
            <div className={styles.gradingRadioBox} style={{ borderBottom: '1px solid rgb(220, 220, 220)' }}>
              <RadioButton value={grading === 0} onClick={() => setGrading(0)} />

              <div className={styles.gradingText}>
                <div className={styles.gradingTextTop}>정답 시 만점</div>

                <div className={styles.gradingTextBottom}>
                  정답: +{points}점 / 오답: 0점 / 미응답: 0점 으로 채점됩니다.
                </div>
              </div>
            </div>

            <div className={styles.gradingRadioBox} style={{ borderBottom: '1px solid rgb(220, 220, 220)' }}>
              <RadioButton value={grading === 1} onClick={() => setGrading(1)} />

              <div className={styles.gradingText}>
                <div className={styles.gradingTextTop}>오답 시 감점</div>

                <div className={styles.gradingTextBottom}>
                  정답: +{points}점 / 오답: -{points}점 / 미응답: 0점 으로 채점됩니다.
                </div>
              </div>
            </div>

            <div className={styles.gradingRadioBox}>
              <RadioButton value={grading === 2} onClick={() => setGrading(2)} />

              <div className={styles.gradingText}>
                <div className={styles.gradingTextTop}>응답 시 만점</div>

                <div className={styles.gradingTextBottom}>응답: +{points}점 / 미응답: 0점 으로 채점됩니다.</div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.gradingContainer}>
            <div className={styles.gradingRadioBox} style={{ borderBottom: '1px solid rgb(220, 220, 220)' }}>
              <RadioButton value={grading === 0} onClick={() => setGrading(0)} />

              <div className={styles.gradingText}>
                <div className={styles.gradingTextTop}>직점 채점</div>

                <div className={styles.gradingTextBottom}>0~{points}점으로 관리자가 직접 채점합니다.</div>
              </div>
            </div>

            <div className={styles.gradingRadioBox}>
              <RadioButton value={grading === 2} onClick={() => setGrading(2)} />

              <div className={styles.gradingText}>
                <div className={styles.gradingTextTop}>응답 시 만점</div>

                <div className={styles.gradingTextBottom}>응답: +{points}점 / 미응답: 0점 으로 채점됩니다.</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Buttons>
        <SubmitButton text="추가하기" onClick={addQuestion} />
        <CancelButton text="취소하기" onClick={() => setIsAddingQuestion(false)} />
      </Buttons>
    </div>
  );
}
