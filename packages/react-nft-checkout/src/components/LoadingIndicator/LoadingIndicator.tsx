import { Box, CircularProgress, Typography } from '@mui/material'

/**
 * @description A loading indicator with a message
 *
 * @param props.text The message to show during loading
 */
const LoadingIndicator = ({ text }: { text: string }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap={1}
      marginTop={1.5}
    >
      <CircularProgress />
      <Typography>{text}</Typography>
    </Box>
  )
}

export default LoadingIndicator
