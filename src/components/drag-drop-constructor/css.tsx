import styled from '@emotion/styled';

export const SourceItems = styled.div`
  position: absolute;
  bottom: 0;
  left: 380px;
  right: 200px;
  height: 190px;
  padding: 0 40px 20px 40px;
  overflow-x: auto;
  display: flex;
  flex-wrap: nowrap;
  > div {
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    margin-right: 10px;
    border: 4px solid transparent;
    white-space: nowrap;
    user-select: none;
    > img {
      max-width: none;
      width: 100px;
      user-select: none;
    }
  }
  &.overlay {
      pointer-events: none;
      background: linear-gradient(
        to right, 
        ${(p) => p.theme.colors.grayscale.background} 0%, 
        ${(p) => p.theme.colors.grayscale.background}00 5%, 
        ${(p) => p.theme.colors.grayscale.background}00 95%, 
        ${(p) => p.theme.colors.grayscale.background} 100%
      );
  }
`;

export const DroppedItems = styled.div`
  display: flex;
  width: 500px;
  height: 300px;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  overflow-x: auto;
  > div {
    position: absolute;
    display: none;
  }
`;
