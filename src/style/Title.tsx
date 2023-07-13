import styled from "styled-components";

const TitleStyle = styled.div`
    font-size: 1.8rem;
    font-weight: 700;
`

export default function Title({ children }: {
    children: string
}) {
    return (
        <TitleStyle>
            {children}
        </TitleStyle>
    )
}