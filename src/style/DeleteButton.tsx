import styled from 'styled-components';

const DeleteButtonStyle = styled.input`
  font-size: 1rem;
  width: fit-content;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: rgb(255, 255, 255);
  background-color: rgb(250, 50, 50);
  border-radius: 5px;
  border: none;
  padding-left: 20px;
  padding-right: 20px;

  &:hover {
    background-color: rgba(250, 50, 50, 0.8);
    cursor: pointer;
  }

  &:disabled {
    background-color: rgba(250, 50, 50, 0.3);
    cursor: not-allowed;
  }

  @media (max-width: 600px) {
    font-size: 0.9rem;
    height: 36px;
    line-height: 36px;
    border-radius: 3px;
    padding-left: 12px;
    padding-right: 12px;
  }
`;

export default function DeleteButton({
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
  return <DeleteButtonStyle type="button" value={text} onClick={onClick} disabled={disabled} style={style} />;
}
