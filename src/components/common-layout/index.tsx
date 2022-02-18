import React from 'react';
import styled from '@emotion/styled';
import CornerWrapper from '../corner-wrapper';

const Wrapper = styled.div`
    position: absolute;
    width: 100%;
    height: 100px;
`;

export type CornerWrapperProps = {
  title?: string;
};

const CommonLayout = (p:CornerWrapperProps) => {
    return (
        <Wrapper>
            {p.title && <CornerWrapper position='top-left'>
                <h4>{p.title}</h4>
            </CornerWrapper>}
        </Wrapper>
    );
};

export default CommonLayout;
