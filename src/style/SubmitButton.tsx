import styled from 'styled-components';

const SubmitButtonStyle = styled.input`
  font-size: 1rem;
  width: fit-content;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: rgb(255, 255, 255);
  background-color: rgb(0, 100, 250);
  border-radius: 5px;
  border: none;
  padding-left: 20px;
  padding-right: 20px;

  &:hover {
    background-color: rgba(0, 100, 250, 0.8);
    cursor: pointer;
  }

  &:disabled {
    background-color: rgba(0, 100, 250, 0.3);
    cursor: not-allowed;
  }

  @media (max-width: 600px) {
    font-size: 0.85rem;
    height: 36px;
    line-height: 36px;
    padding-left: 10px;
    padding-right: 10px;
  }
`;

export default function SubmitButton({
  text,
  onClick,
  disabled,
  style,
}: {
  text: string;
  onClick: React.MouseEventHandler;
  disabled?: boolean;
  style?: any;
}) {
  return <SubmitButtonStyle type="button" value={text} onClick={onClick} disabled={disabled} style={style} />;
}
