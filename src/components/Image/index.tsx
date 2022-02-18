import React from 'react';
import img from './img.png';
import styled from '@emotion/styled';
import {css} from '@emotion/react';
import {ReactComponent as Attach} from './attach.svg';

const Container = styled.div`
  width: 300px;
  height: 300px;
  padding: 30px;
  background-color: green;
`;

export const Image = () => (
    <div css={css`
      padding: 40px;
      background-color: yellow;
    `}>
        <Container>
            <Attach />
            <img src={img} alt=""/>
        </Container>
    </div>
);
