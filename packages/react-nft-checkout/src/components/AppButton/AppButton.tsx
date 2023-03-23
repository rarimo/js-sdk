import { Button, ButtonProps } from '@mui/material'

export type AppButtonProps = ButtonProps

/**
 * @description A generic UI button that extends the Material UI Button component
 * @group Components
 * @see https://mui.com/material-ui/react-button/
 */
const AppButton = ({ children, ...props }: AppButtonProps) => {
  return (
    <Button variant="contained" {...props}>
      {children}
    </Button>
  )
}

export default AppButton
