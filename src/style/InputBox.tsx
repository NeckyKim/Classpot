import styled from 'styled-components';

const InputBoxStyle = styled.input`
    font-size: 1.1rem;
    font-weight: 600;
    width: 100%;
    border-radius: 5px;
    border: 1px solid rgb(220, 220, 220);
    padding: 10px;
    resize: vertical;
    position: absolute:
    top: 0px;
    left: 0px;

    &:hover {
        border: 2px solid rgba(0, 100, 250, 0.3);
        padding: 9px;
    }

    &:focus {
        border: 2px solid rgb(0, 100, 250);
        padding: 9px;
    }

    &:placeholder {
        font-weight: 400;
        color: rgb(180, 180, 180);
`;

export default function InputBox({
  type,
  value,
  onChange,
  placeholder,
  style,
  min,
  max,
}: {
  type: string;
  value: string | number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  style?: object;
  min?: number;
  max?: number;
}) {
  return (
    <InputBoxStyle
      type={String(type)}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      spellCheck={false}
      style={style}
      min={min}
      max={max}
    />
  );
}
