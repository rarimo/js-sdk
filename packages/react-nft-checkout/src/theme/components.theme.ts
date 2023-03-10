import { Components } from '@mui/material'

import { BaseTheme } from '@/types'

export const componentsTheme: Components<BaseTheme> = {
  MuiButton: {
    styleOverrides: {
      root: ({ ownerState }) => ({
        backgroundColor: '#000000',
        borderRadius: '0.5rem',
        boxShadow: 'none',
        color: '#ffffff',
        fontFamily: 'sans-serif',
        fontWeight: '600',
        textTransform: 'none',
        transitionProperty: 'background-color, color, opacity, filter',
        transitionDuration: '0.25s',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        ...(ownerState.size === 'small' && {
          padding: '0.5rem 1rem',
        }),
        ...(ownerState.size === 'medium' && {
          padding: '1rem 2rem',
          fontSize: '1rem',
          lineHeight: '1.4',
          letterSpacing: '0',
        }),
        ...(ownerState.size === 'large' && {
          padding: '1.5rem 3rem',
        }),
        '&:hover, &:focus-visible, &:active': {
          boxShadow: 'none',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        },
        '&:disabled, &.Mui-disabled': {
          filter: 'grayscale(0.75)',
          opacity: '0.5',
          color: '#ffffff',
          backgroundColor: '#000000',
          cursor: 'not-allowed',
        },
      }),
    },
  },
}
