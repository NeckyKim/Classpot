import styled from "styled-components";

const Container = styled.div`
    width: 48px;
    height: 24px;
    border-radius: 12px;
    padding: 3px;
    cursor: pointer;
    transition: 0.5s;

    &.on {
        background-color: rgb(0, 100, 250);
    }

    &.off {
        background-color: rgb(220, 220, 220);
    }
`

const Switch = styled.div`
    width: 18px;
    height: 18px;
    border-radius: 9px;
    background-color: rgb(255, 255, 255);
    transition: 0.5s;

    &.on {
        margin-left: 24px;
    }
`

export default function Toggle({ value, onClick }: {
    value: boolean,
    onClick: React.MouseEventHandler
}) {
    return (
        <Container className={value ? "on" : "off"} onClick={onClick}>
            <Switch className={value ? "on" : ""} />
        </Container>
    )
}