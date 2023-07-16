import styled from 'styled-components';

const ButtonsStyle = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 10px;
`;

export default function Buttons({
  children,
  position,
  gap,
  style,
}: {
  children: any;
  position?: 'left' | 'center' | 'right';
  gap?: number;
  style?: any;
}) {
  return <ButtonsStyle style={{ ...style, justifyContent: position, gap: `${gap}px` }}>{children}</ButtonsStyle>;
}
