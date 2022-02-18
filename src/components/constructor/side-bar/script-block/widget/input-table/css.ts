import styled from '@emotion/styled';

export const StyledTable = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    overflow: auto;
    display: flex;

    .scrollable {
        margin: 0 auto auto auto;
        padding: 120px calc(50vw - 480px) 60px calc(50vw - 480px);
        > div {
            position: relative;
        }
    }

    .hidden {
        opacity: 0;
    }

    .row {
        position: relative;

        .drag-handle {
            opacity: 0;
            pointer-events: auto;
            position: absolute;
            left: -16px;
            top: 9px;
            cursor: grab;
            &:active {
                cursor: grabbing;
            }
        }

        &:hover, &.dragging {
            .drag-handle {
                opacity: 0.5;
            }
        }
        display: flex;
        justify-content: space-between;
        form {
            display: flex;
        }
        form > label, &.head > label {
            width: 280px;
            display: block;
            height: auto !important;
            height: 100%;
            margin-right: 2px;
            margin-bottom: 2px;
            > div {
                height: 100%;
            }
        }
        &.head > label > div { 
            padding: 8px 8px 6px 30px;
            background-color: ${(p) => p.theme.colors.primary.default};
            color: ${(p) => p.theme.colors.grayscale.white};
            cursor: default;
        }
    }

    .more-table-row-list {
            display: flex;
            flex-direction: column;
            background: white;
            border-radius: 8px;
            padding: 2px;
            opacity: 1 !important;
            ${(p) => p.theme.shadows.mediumDark};
            > button {
                display: block;
                padding: 8px;
                border-radius: 6px;
                width: 100%;
                &:hover {
                    background: ${(p) => p.theme.colors.primary.light};
                }
            }
        }

    hr {
        display: none;
    }
`;
