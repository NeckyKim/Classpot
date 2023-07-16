import styled from 'styled-components';

const QuestionTypeContainer = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  width: fit-content;
  height: 28px;
  border-radius: 14px;
  color: rgb(100, 100, 100);
  background-color: rgb(235, 235, 235);
  padding-left: 12px;
  padding-right: 12px;
  display: flex;
  flex-direction: row;
  gap: 5px;
  justify-content: center;
  align-items: center;
`;

const QuestionTypeIcon = styled.img`
  width: 16px;
  height: 16px;
  filter: invert(0.5);
`;

export default function QuestionType({ type }: { type: 'mc' | 'sa' | 'tf' | 'essay' }) {
  return (
    <QuestionTypeContainer>
      <QuestionTypeIcon src={process.env.PUBLIC_URL + `/icons/${type}.svg`} />

      {(() => {
        switch (type) {
          case 'mc':
            return '객관식';
          case 'sa':
            return '주관식';
          case 'tf':
            return '참/거짓';
          case 'essay':
            return '서술형';
        }
      })()}
    </QuestionTypeContainer>
  );
}
