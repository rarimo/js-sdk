import { Typography } from '@mui/material'
import { Variant } from '@mui/material/styles/createTypography'

interface Props {
  text: string
  variant?: Variant | 'inherit'
}

/**
 * @description An error message
 *
 * @param props.text The error message
 * @param props.variant The text variant for the Material UI Typography component
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
