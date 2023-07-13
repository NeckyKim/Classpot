import styled from "styled-components";

const LabelStyle = styled.div`
    font-size: 1.1rem;
    font-weight: 600;
    color: rgb(150, 150, 150);
    margin-bottom: 10px;
`

export default function Label({ children, style }: {
    children: string,
    style?: any
}) {
    return (
        <LabelStyle style={style}>
            {children}
        </LabelStyle>
    )
}