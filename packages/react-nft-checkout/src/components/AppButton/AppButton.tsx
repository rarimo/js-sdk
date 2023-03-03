import { HTMLAttributes, useMemo } from 'react'

import styles from './AppButton.module.css'

type SIZES = 'large' | 'medium' | 'small'

export type AppButtonProps = {
  text?: string
  size?: SIZES
  disabled?: boolean
} & HTMLAttributes<HTMLButtonElement>

const AppButton = ({
  text,
  size = 'medium',
  disabled = false,
  children,
  className = '',
  ...rest
}: AppButtonProps) => {
  const isDisabled: boolean = ['', 'disabled', true].includes(
    disabled as string | boolean,
  )

  const buttonClasses = useMemo(
    () =>
      [
        styles.AppButton,
        styles[`AppButton-${size}`],
        ...(disabled ? [styles['AppButton-disabled']] : []),
        ...(className ? [className] : []),
      ].join(' '),
    [className, disabled, size],
  )

  return (
    <button
      className={buttonClasses}
      disabled={isDisabled}
      {...(rest as HTMLAttributes<HTMLButtonElement>)}
    >
      {children || <span className={styles.Text}>{text}</span>}
    </button>
  )
}

export default AppButton
