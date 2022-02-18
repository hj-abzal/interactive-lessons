/* eslint-disable max-len */
import styled from '@emotion/styled';

export const StagesFlowEditorWrapper = styled.div`
  position: relative;
  background-color: white;
  border-radius: 16px;
  background-color: ${(p) => p.theme.colors.grayscale.background};
  width: 100%;
  height: 100%;
  overflow: auto;
  .content {
    position: relative;
    min-width: 100%;
    min-height: 100%;
    background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0iI0RFRTZFRSIvPgo8L3N2Zz4=");
    background-size: 20px 20px;
    background-position: -10px -10px;
    background-repeat: repeat;
  }
`;
