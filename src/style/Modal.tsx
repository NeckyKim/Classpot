import { useEffect, useRef } from 'react';

import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
`;

const floatDown = keyframes`
    0% {
        opacity: 0;
        margin-top: 100px;
    }

    100% {
        opacity: 1;
        margin-top: 150px;
    }
`;

const Background = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  position: fixed;
  top: 0px;
  left: 0px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  opacity: 0;
  animation: ${fadeIn} 0.4s forwards;
  z-index: 40;
`;

const Container = styled.div`
  width: 500px;
  height: fit-content;
  max-height: calc(100vh - 300px);
  border-radius: 5px;
  border: 1px solid rgb(220, 220, 220);
  padding: 40px;
  box-shadow: 0px 10px 10px 0px rgba(0, 0, 0, 0.1);
  background-color: rgb(255, 255, 255);
  word-break: keep-all;
  opacity: 0;
  margin-top: 100px;
  animation: ${floatDown} 0.4s forwards;
  overflow: auto;

  @media (max-width: 600px) {
    width: min(500px, 90vw);
    padding: min(40px, 5vw);
  }
`;

const Top = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

const Title = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 30px;
  margin-bottom: 30px;

  @media (max-width: 600px) {
    font-size: 1.5rem;
    width: min(500px, 90vw);
    margin-bottom: min(30px, 4vw);
  }
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: -2px;
  filter: invert(0.7);
  cursor: pointer;

  &:hover {
    filter: invert(0.5);
  }
`;

export default function Modal({ children, title, onClose }: { children: any; title: string; onClose: any }) {
  const modalRef = useRef(null);

  useEffect(() => {
    window.addEventListener('click', (event: any) => {
      if (event.target === modalRef.current) {
        onClose();
      }
    });
  });

  return (
    <Background ref={modalRef}>
      <Container>
        <Top>
          <Title>{title}</Title>

          <Icon src={process.env.PUBLIC_URL + '/icons/dashboard/close.svg'} onClick={onClose} />
        </Top>

        {children}
      </Container>
    </Background>
  );
}
