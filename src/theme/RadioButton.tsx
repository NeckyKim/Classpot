import styled from "styled-components";
import styles from "./RadioButton.module.css";

const ButtonOn = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 10px;
    border: 1px solid rgb(0, 100, 250);
    background-color: rgb(0, 100, 250);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:hover {
        background-color: rgba(0, 100, 250, 0.7);
    }
`

const ButtonOff = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 10px;
    border: 1px solid rgb(220, 220, 220);
    background-color: rgb(255, 255, 255);
    cursor: pointer;

    &:hover {
        background-color: rgb(220, 220, 220);
    }
`

const Icon = styled.div`
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background-color: rgb(255, 255, 255);
`

export default function RadioButton({ value, onClick }: { value: boolean, onClick: any }) {
    return (
        (value)

            ?

            <ButtonOn onClick={onClick}>
                {value && <Icon />}
            </ButtonOn>

            :

            <ButtonOff onClick={onClick}>

            </ButtonOff>
    )
}