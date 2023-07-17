import styled from 'styled-components';

export const Navigator = styled.div`
  width: 80px;
  height: calc(100vh - 100px);
  padding-top: 15px;
  padding-bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  overflow: auto;

  &.light {
    background-color: rgb(255, 255, 255);
    border-right: 1px solid rgb(220, 220, 220);
  }

  &.light::-webkit-scrollbar {
    width: 4px;
    background-color: transparent;
  }

  &.light::-webkit-scrollbar-thumb {
    background-color: rgb(230, 230, 230);
  }

  &.dark {
    background-color: rgb(30, 40, 60);
    border-right: 1px solid rgb(70, 80, 100);
  }

  &.dark::-webkit-scrollbar {
    width: 4px;
    background-color: transparent;
  }

  &.dark::-webkit-scrollbar-thumb {
    background-color: rgb(110, 120, 140);
  }

  @media (max-width: 1000px) {
    display: none;
  }
`;

export const NavigatorElements = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  width: 40px;
  height: 40px;
  line-height: 38px;
  text-align: center;
  border-radius: 5px;
  position: relative;

  &.selectedlight,
  &.selecteddark {
    border: 1px solid rgb(0, 100, 250);
    color: rgb(255, 255, 255);
    background-color: rgb(0, 100, 250);
  }

  &.notselectedlight {
    border: 1px solid rgb(220, 220, 220);
    color: rgb(0, 0, 0);
    background-color: rgb(255, 255, 255);
    cursor: pointer;
  }

  &.notselectedlight:hover {
    background-color: rgb(248, 248, 248);
  }

  &.notselecteddark {
    border: 1px solid rgb(70, 80, 100);
    color: rgb(255, 255, 255);
    background-color: rgb(50, 60, 80);
    cursor: pointer;
  }

  &.notselecteddark:hover {
    background-color: rgb(70, 80, 100);
  }
`;

export const solvedMark = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 7px;
  background-color: rgb(0, 220, 220);

  &.light {
    border: 2px solid rgb(248, 248, 248);
  }

  &.dark {
    border: 2px solid rgb(30, 40, 60);
  }
`;

export const flaggedMark = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 7px;
  background-color: rgb(250, 150, 0);

  &.light {
    border: 2px solid rgb(248, 248, 248);
  }

  &.dark {
    border: 2px solid rgb(30, 40, 60);
  }
`;

export const QuestionHeader = styled.div`
  display: grid;
  grid-template-columns: fit-content(100%) fit-content(100%) fit-content(100%) fit-content(100%) 1fr fit-content(100%) fit-content(
      100%
    );
  gap: 5px;
  align-items: end;
  padding-bottom: 30px;
  margin-bottom: 10px;

  &.light {
    border-bottom: 1px solid rgb(220, 220, 220);
  }

  &.dark {
    border-bottom: 1px solid rgb(70, 80, 100);
  }

  @media (max-width: 1000px) {
    grid-template-columns: fit-content(100%) fit-content(100%) fit-content(100%) 1fr fit-content(100%) fit-content(100%);
  }

  @media (max-width: 600px) {
    padding-bottom: 20px;
    margin-bottom: 0px;
  }
`;

export const QuestionNumberLabel = styled.div`
  font-size: 1.75rem;
  font-weight: 400;
  line-height: 24px;
  margin-left: 15px;
  margin-right: 5px;

  &.light {
    color: rgb(0, 0, 0);
  }

  &.dark {
    color: rgb(255, 255, 255);
  }

  @media (max-width: 600px) {
    font-size: 1.3rem;
  }
`;

export const QuestionNumberValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  line-height: 24px;

  &.light {
    color: rgb(0, 0, 0);
  }

  &.dark {
    color: rgb(255, 255, 255);
  }

  @media (max-width: 600px) {
    font-size: 1.3rem;
  }
`;

export const QuestionNumberTotal = styled.div`
  font-size: 2rem;
  font-weight: 200;
  line-height: 24px;

  &.light {
    color: rgb(180, 180, 180);
  }

  &.dark {
    color: rgb(80, 90, 110);
  }

  @media (max-width: 600px) {
    font-size: 1.3rem;
  }
`;

export const QuestionPrevNext = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;

  &.lightenabled {
    filter: invert(0.6);
  }

  &.darkenabled {
    filter: invert();
  }

  &.lightenabled:hover,
  &.darkenabled:hover {
    filter: invert(56%) sepia(89%) saturate(7494%) hue-rotate(210deg) brightness(97%) contrast(104%);
  }

  &.lightdisabled {
    filter: invert(0.85);
  }

  &.darkdisabled {
    filter: invert(0.3);
  }
`;

export const QuestionAnswerContainer = styled.div`
  width: 100%;
  height: calc(100vh - 100px);
  display: grid;
  overflow: auto;

  &.rllight {
    grid-template-columns: 1fr 1fr;
    background-color: rgb(255, 255, 255);
  }

  &.rldark {
    grid-template-columns: 1fr 1fr;
    background-color: rgb(30, 40, 60);
  }

  &.udlight {
    grid-template-rows: fit-content(100%) fit-content(100%);
    background-color: rgb(255, 255, 255);
  }

  &.uddark {
    grid-template-rows: fit-content(100%) fit-content(100%);
    background-color: rgb(30, 40, 60);
  }

  @media (max-width: 1000px) {
    &.rllight,
    &.udlight {
      grid-template-columns: none;
      grid-template-rows: fit-content(100%) fit-content(100%);
      background-color: rgb(255, 255, 255);
    }

    &.rldark,
    &.uddark {
      grid-template-columns: none;
      grid-template-rows: fit-content(100%) fit-content(100%);
      background-color: rgb(30, 40, 60);
    }

    &.rllight::-webkit-scrollbar,
    &.udlight::-webkit-scrollbar,
    &.rldark::-webkit-scrollbar,
    &.uddark::-webkit-scrollbar {
      width: 10px;
      background-color: transparent;
    }

    &.rllight::-webkit-scrollbar-thumb,
    &.udlight::-webkit-scrollbar-thumb {
      background-color: rgb(230, 230, 230);
    }

    &.rldark::-webkit-scrollbar-thumb,
    &.uddark::-webkit-scrollbar-thumb {
      background-color: rgb(110, 120, 140);
    }
  }
`;

export const QuestionInfo = styled.div`
  font-weight: 700;
  line-height: 15px;
  margin-right: 15px;

  &.light {
    color: rgb(0, 0, 0);
  }

  &.dark {
    color: rgb(255, 255, 255);
  }

  @media (max-width: 600px) {
    font-size: 0.8rem;
  }
`;

export const FlagButton = styled.div`
  font-size: 0.7rem;
  font-weight: 400;
  width: fit-content;
  height: 20px;
  border-radius: 3px;
  margin-left: 10px;
  padding-left: 3px;
  padding-right: 5px;
  display: flex;
  align-items: center;
  cursor: pointer;

  &.flaggedlight,
  &.flaggeddark {
    color: rgb(255, 255, 255);
    background-color: rgb(250, 150, 0);
  }

  &.notflaggedlight {
    color: rgb(120, 120, 120);
    background-color: rgb(240, 240, 240);
  }

  &.notflaggedlight:hover {
    background-color: rgb(230, 230, 230);
  }

  &.notflaggeddark {
    color: rgb(150, 150, 150);
    background-color: rgb(60, 70, 90);
  }

  &.notflaggeddark:hover {
    background-color: rgb(70, 80, 100);
  }

  @media (max-width: 1000px) {
    display: none;
  }
`;

export const FlagIcon = styled.img`
  width: 17px;
  height: 17px;
  padding: 3px;

  &.flagged {
    filter: invert();
  }

  &.notflagged {
    filter: invert(66%) sepia(11%) saturate(0%) hue-rotate(162deg) brightness(89%) contrast(97%);
  }
`;

export const QuestionContainer = styled.div`
  &.rllight {
    height: 100%;
    border-right: 1px solid rgb(220, 220, 220);
    padding-left: min(3vw, 80px);
    padding-right: min(3vw, 80px);
    padding-top: 40px;
    overflow: auto;
  }

  &.rldark {
    height: 100%;
    border-right: 1px solid rgb(70, 80, 100);
    padding-left: min(3vw, 80px);
    padding-right: min(3vw, 80px);
    padding-top: 40px;
    overflow: auto;
  }

  &.udlight {
    height: fit-content;
    padding-left: 15vw;
    padding-right: 15vw;
    padding-top: 40px;
  }

  &.uddark {
    height: fit-content;
    padding-left: 15vw;
    padding-right: 15vw;
    padding-top: 40px;
  }

  @media (max-width: 1000px) {
    &.rllight,
    &.rldark,
    &.udlight,
    &.uddark {
      height: fit-content;
      padding-left: 5vw;
      padding-right: 5vw;
      overflow: visible;
      border-right: none;
    }
  }

  @media (max-width: 600px) {
    &.rllight,
    &.rldark,
    &.udlight,
    &.uddark {
      padding-top: 20px;
    }
  }
`;

export const AnswerContainer = styled.div`
  &.rl {
    height: 100%;
    padding-left: min(3vw, 80px);
    padding-right: min(3vw, 80px);
    padding-top: 40px;
    padding-bottom: 20px;
    overflow: auto;
  }

  &.ud {
    height: fit-content;
    padding-left: 15vw;
    padding-right: 15vw;
    padding-bottom: 20px;
  }

  @media (max-width: 1000px) {
    &.rl,
    &.ud {
      height: fit-content;
      padding-left: 5vw;
      padding-right: 5vw;
      padding-top: 0px;
      padding-bottom: 80px;
      overflow: visible;
    }
  }
`;

export const AnswerInputBox = styled.textarea`
  font-size: 1.1rem;
  width: 100%;
  border-radius: 5px;
  padding: 10px;
  background-color: transparent;

  &::placeholder {
    font-weight: 400;
    color: rgb(150, 150, 150);
  }

  &.salight {
    height: 45px;
    border: 1px solid rgb(220, 220, 220);
    resize: none;
  }

  &.sadark {
    height: 45px;
    border: 1px solid rgb(70, 80, 100);
    resize: none;
    color: rgb(255, 255, 255);
  }

  &.essaylight {
    height: 300px;
    border: 1px solid rgb(220, 220, 220);
    resize: vertical;
  }

  &.essaydark {
    height: 300px;
    border: 1px solid rgb(70, 80, 100);
    resize: vertical;
    color: rgb(255, 255, 255);
  }

  &.salight::-webkit-scrollbar,
  &.sadark::-webkit-scrollbar,
  &.essaylight::-webkit-scrollbar,
  &.essaydark::-webkit-scrollbar {
    display: none;
  }

  &.salight:hover,
  &.sadark:hover,
  &.essaylight:hover,
  &.essaydark:hover {
    border: 2px solid rgba(0, 100, 250, 0.3);
    padding: 9px;
  }

  &.salight:focus,
  &.sadark:focus,
  &.essaylight:focus,
  &.essaydark:focus {
    border: 2px solid rgb(0, 100, 250);
    padding: 9px;
  }
`;

export const ContainerBottom = styled.div`
  width: 100vw;
  height: 50px;
  padding-left: 30px;
  padding-right: 30px;
  position: fixed;
  bottom: 0px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  &.light {
    border-top: 1px solid rgb(220, 220, 220);
    background-color: rgb(255, 255, 255);
  }

  &.dark {
    border-top: 1px solid rgb(70, 80, 100);
    background-color: rgb(30, 40, 60);
  }

  @media (max-width: 600px) {
    padding-left: min(30px, 5vw);
    padding-right: min(30px, 5vw);
  }
`;

export const ChoiceElements = styled.div`
  display: grid;
  grid-template-columns: fit-content(100%) 1fr;
  gap: 10px;
  border-radius: 5px;
  cursor: pointer;

  &.light {
    color: rgb(0, 0, 0);
  }

  &.light:hover {
    background-color: rgb(240, 240, 240);
  }

  &.dark {
    color: rgb(255, 255, 255);
  }

  &.dark:hover {
    background-color: rgb(40, 50, 70);
  }
`;

export const ChoiceNumber = styled.div`
    width: 28px;
    height: 28px;
    line-height: 28px;
    border-radius: 14px;
    text-align: center;

    &.selectedlight,
    &.selecteddark {
        border: 1px solid rgb(0, 100, 250);
        background-color: rgb(0, 100, 250);
        color: rgb(255, 255, 255);
    }

    &.notselecteddark {
        border: 1px solid rgb(70, 80, 100);
        background-color: rgb(50, 60, 80);
    }

    &.notselectedlight {
        border: 1px solid rgb(220, 220, 220);
        background-color: rgb(248, 248, 248);
    }
`;

export const ChoiceValue = styled.div`
  font-size: 1.1rem;
  line-height: 28px;

  &.selectedlight,
  &.selecteddark {
    color: rgb(0, 100, 250);
  }

  &.notselecteddark {
    color: rgb(255, 255, 255);
  }

  &.notselectedlight {
    color: rgb(0, 0, 0);
  }
`;
