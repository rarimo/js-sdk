import { Typography } from '@mui/material'
import { Variant } from '@mui/material/styles/createTypography'

interface Props {
  text: string
  variant?: Variant | 'inherit'
}

/**
 * @description An error message
 * @group Components
 *
 * @param props The properties for the component, including:
 * - `text`: The text of the error message
 * - `variant`: The Material UI Typography component
 */
const ErrorText = ({ text, variant = 'subtitle2' }: Props) => {
  return (
    <Typography
      variant={variant}
      sx={{
        color: 'error.main',
        display: 'block',
        textAlign: 'center',
      }}
    >
      {text}
    </Typography>
  )
}

export default ErrorText
