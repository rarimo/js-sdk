import { Typography } from '@mui/material'
import { Variant } from '@mui/material/styles/createTypography'

interface Props {
  text: string
  variant?: Variant | 'inherit'
}

const ErrorText = ({ text, variant = 'subtitle2' }: Props) => {
  return (
    <Typography
      variant={variant}
      sx={{
        color: '#d32f2f',
        display: 'block',
        textAlign: 'center',
      }}
    >
      {text}
    </Typography>
  )
}

export default ErrorText
