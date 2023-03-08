import { Button, ButtonProps } from '@mui/material'

export type AppButtonProps = ButtonProps

/**
 * @description A generic UI button
 */
const AppButton = ({ children, ...props }: AppButtonProps) => {
  return (
    <Button variant="contained" {...props}>
      {children}
    </Button>
  )
}

export default AppButton
