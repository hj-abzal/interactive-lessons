import styled from '@emotion/styled';

export const StyledContentRoot = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;

export const StyledEditorRoot = styled.div`
  display: grid; 
  position: absolute;
  width: 100vw;
  height: 100vh;
  max-height: 100vh;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 10px;
  grid-template-columns: 320px 1fr; 
  grid-template-rows: 68px 1fr; 
  gap: 10px 10px; 
  grid-template-areas: 
    "side-bar nav-bar"
    "side-bar lesson"; 
  background-color: ${(p) => p.theme.colors.grayscale.background};

  .side-bar { 
    grid-area: side-bar;
    overflow-y: hidden;
  }
      
  .header { 
    grid-area: header; 
  }

  .lesson {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 16px;
      overflow: hidden;
      ${(p) => p.theme.shadows.mediumDark}
  }
`;
