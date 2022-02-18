import styled from '@emotion/styled';

export const SideBarWrapper = styled.div`
  position: relative;
  background-color: white;
  border-radius: 16px;
  background-color: ${(p) => p.theme.colors.grayscale.background};
  width: 100%;
  height: 100%;
  ${(p) => p.theme.shadows.mediumDark};
  .title {
    padding: 10px 14px 0 14px;
    font-size: 16px;
    font-weight: 500;
  }
  .tab-nav {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    height: 60px;
    border-radius: 16px 16px 0 0;
    border-bottom: 1px solid ${(p) => p.theme.colors.transparent.black10};
    width: 100%;
    overflow: hidden;
    background-color: ${(p) => p.theme.colors.grayscale.white};
    > button {
      transition: 0.1s ease;
      opacity: 0.5;
      &:hover {
        opacity: 1;
      }
      &.active {
        opacity: 1;
      }
    }
  }

  .content {
      position: absolute;
      width: 100%;
      height: calc(100% - 60px);
      .with-indent {
        padding: 14px 10px;
      }
      .svelte-jsoneditor-react{
            height: 100%;
            .jsoneditor-main {
                border-radius: 0 0 16px 16px;
                overflow: hidden;
                height: 100%;
            }
      }

      .stages-nav, .stages-sub-nav {
        display: flex;
        flex-wrap: nowrap;
        position: absolute;
        width: 100%;
        height: 58px;
        padding: 10px 10px 0;
        > button {
          min-width: 48px;
        }
        & > div {
          margin: 0 4px;
        }
        .input-select__control {
          border-radius: 4px 4px 4px 4px;
        }
        .first {
          border-radius: 12px 4px 4px 12px;
          margin-left: 0;
        }
        .last {
          border-radius: 4px 12px 12px 4px;
          margin-right: 0;
        }
        &.stages-sub-nav {
          top: 54px;
        }
        &.no-left-action {
          & > div {
            margin: 0 4px 0 0;
          }
          .input-select__control {
            border-radius: 12px 4px 4px 12px;
          }
        }
      }

      .script-blocks, .nodes-structure {
        position: absolute;
        top: 46px;
        width: 100%;
        height: calc(100% - 46px);
        padding: 10px 10px 10px;
        border-radius: 0 0 16px 16px;
        overflow-y: auto;
        
        &.nodes-structure {
          padding-top: 20px;
          top: 100px;
          height: calc(100% - 40px);
        }

        .script-blocks-inner, .nodes-structure-inner {
          .left-indent-wrapper {
            margin-left: 14px;
          }
          position: relative;
          &.disabled {
            pointer-events: none;
            user-select: none;
          }
          &.script-blocks-inner::before {
            content: "";
            position: absolute;
            top: -20px;
            bottom: -40px;
            left: calc(50% - 1px);
            width: 2px;
            height: 100%;
            background-color: ${(p) => p.theme.colors.grayscale.line};
          }
        }
      }

      .script-blocks-overlay, .nodes-structure-overlay {
        position: absolute;
        top: 46px;
        width: 100%;
        height: 30px;
        pointer-events: none;
        background: linear-gradient(
          to bottom, 
          ${(p) => p.theme.colors.grayscale.background} 0%, 
          ${(p) => p.theme.colors.grayscale.background}00 100%
        );
        &.nodes-structure-overlay {
          top: 100px;
        }
      }
  }
  
  .node-form {
    pointer-events: none;
    position: absolute;
    bottom: -85px;
    width: 100%;
  }
`;
