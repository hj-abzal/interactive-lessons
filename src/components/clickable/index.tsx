import React, {ButtonHTMLAttributes} from 'react';
import {css} from '@emotion/react';

export type ClickableProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  ref?: React.Ref<HTMLButtonElement>,
  showInteraction?: boolean,
};

// eslint-disable-next-line react/display-name
export const Clickable: React.FC<ClickableProps> = React.forwardRef<HTMLButtonElement, ClickableProps>(
    ({
        children,
        showInteraction = true,
        ...props
    }: ClickableProps,
    ref
    ) => (
        <button
            {...props}
            ref={ref}
            css={css`
              display: inline-block;
              border: none;
              margin: 0;
              padding: 0;
              width: auto;
              text-decoration: none;
              background: transparent;
              -webkit-appearance: none;
              -moz-appearance: none;
              /* Corrects font smoothing for webkit */
              -webkit-font-smoothing: inherit;
              -moz-osx-font-smoothing: inherit;
              overflow: visible;
              /* inherit font & color from ancestor */
              color: inherit;
              font: inherit;
              /* Normalize \`line-height\`. Cannot be changed from \`normal\` in Firefox 4+. */
              line-height: normal;
              text-align: inherit;
              outline: none;

              user-select: none;

              /* Remove excess padding and border in Firefox 4+ */
              &::-moz-focus-inner {
                border: 0;
                padding: 0;
              }

              ${showInteraction && `
                    cursor: pointer;
                    
                    &:focus {s
                      opacity: 0.7;
                    }
                
                    &:active {
                      opacity: 0.5;
                    }
              `}
            `}
        >
            {children}
        </button>
    ));
