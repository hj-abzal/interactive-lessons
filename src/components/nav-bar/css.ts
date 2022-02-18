import styled from '@emotion/styled';

export const Wrapper = styled.div`
    border-radius: 12px;
    background-color: ${(p) => p.theme.colors.grayscale.white};
    box-sizing: border-box;
    width: 100%;
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    ${(p) => p.theme.shadows.mediumDark};

    .nav-icons {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 4px;
        > * {
            margin-left: 4px;
        }
    }

    .breadcrumbs {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 60px;
        padding-left: 20px;
        > * {
            margin-right: 10px;
        }
        p {
            color: ${(p) => p.theme.colors.grayscale.label};
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }
`;
