import styled from "styled-components";

export const Navigator = styled.div`
    width: 80px;
    height: calc(100vh - 110px);
    padding-top: 15px;
    padding-bottom: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    overflow: auto;

    &.light {
        background-color: rgb(248, 248, 248);
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
`

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

    &.notselecteddark {
        border: 1px solid rgb(70, 80, 100);
        color: rgb(255, 255, 255);
        background-color: rgb(50, 60, 80);
        cursor: pointer;
    }
`

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
`

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
`

export const QuestionHeader = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    padding-bottom: 30px;
    margin-bottom: 10px;

    &.light {
        border-bottom: 1px solid rgb(220, 220, 220);
    }

    &.dark {
        border-bottom: 1px solid rgb(70, 80, 100);
    }
`

export const QuestionNumberLabel = styled.div`
    font-size: 1.75rem;
    font-weight: 400;
    line-height: 24px;

    &.light {
        color: rgb(0, 0, 0);
    }

    &.dark {
        color: rgb(255, 255, 255);
    }
`

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
`

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
`

export const QuestionAnswerContainer = styled.div`
    height: calc(100vh - 110px);
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
`

export const QuestionInfo = styled.div`
    font-weight: 700;
    line-height: 15px;

    &.light {
        color: rgb(0, 0, 0);
    }

    &.dark {
        color: rgb(255, 255, 255);
    }
`

export const QuestionContainer = styled.div`
    &.rllight {
        height: 100%;
        border-right: 1px solid rgb(220, 220, 220);
        padding-left: 80px;
        padding-right: 80px;
        padding-top: 40px;
        overflow: auto;
    }

    &.rldark {
        height: 100%;
        border-right: 1px solid rgb(70, 80, 100);
        padding-left: 80px;
        padding-right: 80px;
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
`

export const AnswerContainer = styled.div`
    &.rl {
        height: 100%;
        padding-left: 75px;
        padding-right: 75px;
        padding-top: 40px;
        padding-bottom: 20px;
        overflow: auto;
    }

    &.ud {
        height: fit-content;
        padding-left: calc(15vw - 5px);
        padding-right: calc(15vw - 5px);
        padding-bottom: 20px;
        margin-top: -40px;
    }
`

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
        color: rgb(0, 0, 0);
    }

    &.sadark {
        height: 45px;
        border: 1px solid rgb(70, 80, 100);
        resize: none;
        color: rgb(255, 255, 255);
    }

    &.essaylight {
        height: 300px;
        min-height: 45px;
        border: 1px solid rgb(220, 220, 220);
        resize: vertical;
        color: rgb(250, 0, 0);
    }

    &.essaydark {
        height: 300px;
        min-height: 45px;
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
`

export const ContainerBottom = styled.div`
    width: 100vw;
    height: 100%;
    padding-left: 30px;
    padding-right: 30px;
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
`

export const ChoiceElements = styled.div`
    display: grid;
    grid-template-columns: fit-content(100%) 1fr;
    gap: 10px;
    padding: 5px;
    border-radius: 5px;
    cursor: pointer;

    &.light {
        color: rgb(0, 0, 0);
    }

    &.light:hover {
        background-color: red;
    }

    &.dark {
        color: rgb(255, 255, 255);
    }

    &.dark:hover {
        background-color: red;
    }
`

export const ChoiceNumber = styled.div`
    width: 28px;
    height: 28px;
    line-height: 28px;
    border-radius: 14px;
    text-align: center;

    &.light {

    }

    &.dark {
        
    }
`

export const ChoiceValue = styled.div`
    &.light {

    }

    &.dark {

    }
`