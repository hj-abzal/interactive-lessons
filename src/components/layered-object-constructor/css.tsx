import styled from '@emotion/styled';

export const StyledRoot = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;

export const MainFrame = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px 100px 0px 0px;

  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 190px;
`;

export const SourceItems = styled.div`
  position: absolute;
  bottom: 0;
  left: 380px;
  right: 0;//200px;
  height: 190px;
  padding: 0 40px 20px 40px;
  overflow-x: auto;
  display: flex;
  flex-wrap: nowrap;
  > div {
    margin-right: 10px;
    user-select: none;
    text-align: center;
    > .wrapper {
      border-radius: 31px;
      overflow: hidden;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-direction: column;
      > .title-plate {
        background-color: ${(p) => p.theme.colors.primary.default};
        color: white;
        width: 100%;
        padding: 20px 30px 16px 30px;
      }
      > .content {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 20px;
        flex: auto;
        max-width: 240px;
        &.space-between {
          justify-content: space-between;
        }
        > img {
          max-width: none;
          width: 100px;
          user-select: none;
        }
        > span {
          white-space: normal;
        }
      }
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
