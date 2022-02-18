import {css} from '@emotion/react';

export const globalStyles = css`
  /* Dark theme start */
  /* html{
        filter: invert(1) hue-rotate(180deg);
        background-color: #fcfcfc;
    }
    img, .img {
        filter: invert(1) hue-rotate(180deg);
    } */
  /* Dark theme end */

  body, html {
    font-family: 'Ubuntu', sans-serif;
    background-color: white;
    min-width: 320px;
  }
  
  b, strong {
    font-weight: bold;
  }
  
  code {
    font-family: monospace;
    padding: 8px;
    background-color: ghostwhite;
    width: 100%;
    display: block;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  p,
  label,
  span,
  button,
  input {
    font-family: 'Ubuntu', sans-serif;
    font-style: normal;
    font-weight: normal;
    color: #14142b;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  button {
    font-weight: bold;
  }
  h1 {
    font-size: 60px;
    line-height: 72px;
  }
  h2 {
    font-size: 50px;
    line-height: 64px;
  }
  h3 {
    font-size: 40px;
    line-height: 56px;
  }
  h4 {
    font-size: 33px;
    line-height: 40px;
  }
  h5 {
    font-size: 24px;
    line-height: 32px;
  }
  p {
    font-size: 17px;
    line-height: 34px;
  }
  p.small {
    font-size: 15px;
    line-height: 24px;
  }
  
  label {
    font-size: 12px;
    line-height: 16px;
  }
  
  button {
    font-size: 16px;
    line-height: 21px;
  }

  img {
    max-width: 100%;
  }

  a {
    text-decoration: underline;
    text-decoration-color: rgba(0, 0, 0, 0);
    color: #063ef9;
    cursor: pointer;
    &:hover {
      text-decoration-color: rgba(0, 0, 0, 0.1);
    }
  }
`;
