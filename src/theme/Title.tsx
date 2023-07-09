import styled from "styled-components";

const Style = styled.div`
    font-size: 1.8rem;
    font-weight: 700;
`

export default function Title({ children }: { children: string }) {
    return (
        <Style>
            {children}
        </Style>
    )
}