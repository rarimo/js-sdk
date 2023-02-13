import styled from '@emotion/styled'

import { MouseEventHandler } from 'react'

export type ButtonProps = {
  label?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  isActive?: boolean
  isDisabled?: boolean
  className?: string
  styles?: object
}

const StyledButton = styled.button`
  height: 48px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 24px 16px 24px;
  background-color: #000000;
  font-weight: 600;
  align-content: center;
  flex-wrap: nowrap;
  border: none;
  border-radius: 8px;
  color: #ffffff;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
  &:disabled {
    background: #ffffff;
    border: solid 0.5px #d3d3d3;
    color: #d3d3d3;
    cursor: not-allowed;
    box-shadow: none;
  }
`

const Button = ({
  label,
  isDisabled,
  className,
  onClick,
  styles,
}: ButtonProps) => {
  return (
    <StyledButton
      disabled={isDisabled ?? false}
      onClick={onClick}
      style={styles}
      className={className}
    >
      {label}
    </StyledButton>
  )
}

export default Button
