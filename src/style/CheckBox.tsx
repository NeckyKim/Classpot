import styled from "styled-components";

const BoxOn = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 3px;
    border: 1px solid rgb(0, 100, 250);
    background-color: rgb(0, 100, 250);
    cursor: pointer;

    &:hover {
        background-color: rgba(0, 100, 250, 0.7);
    }
`

const BoxOff = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 3px;
    border: 1px solid rgb(220, 220, 220);
    background-color: rgb(255, 255, 255);
    cursor: pointer;

    &:hover {
        background-color: rgb(220, 220, 220);
    }
`

const IconOn = styled.img`
    width: 18px;
    height: 18px;
    padding: 3px;
    filter: invert();
    opacity: 1;
`

const IconOff = styled.img`
    width: 18px;
    height: 18px;
    padding: 3px;
    filter: invert();
    opacity: 0;
`

export default function CheckBox({ value, onClick }: {
    value: boolean,
    onClick: React.MouseEventHandler
}) {
    return (
        (value)

            ?

            <BoxOn onClick={onClick}>
                <IconOn src={process.env.PUBLIC_URL + "/icons/dashboard/check.svg"} />
            </BoxOn>

            :

            <BoxOff onClick={onClick}>
                <IconOff src={process.env.PUBLIC_URL + "/icons/dashboard/check.svg"} />
            </BoxOff>
    )
}