/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";

const stepperContainer = css`
  display: inline-flex;
  align-items: center;
  height: 32px;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 6px;
  overflow: hidden;
  box-sizing: content-box;
`;

const stepperButton = css`
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  font-size: 18px;
  font-weight: 400;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: #e0e0e0;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const valueDisplay = css`
  min-width: 28px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

export default function DrinkStepper({ value, onChange, min = 1, max = 10 }) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div css={stepperContainer}>
      <button
        css={stepperButton}
        onClick={handleDecrement}
        disabled={value <= min}
        aria-label="Decrease drink count"
      >
        −
      </button>
      <span css={valueDisplay}>{value}</span>
      <button
        css={stepperButton}
        onClick={handleIncrement}
        disabled={value >= max}
        aria-label="Increase drink count"
      >
        +
      </button>
    </div>
  );
}
