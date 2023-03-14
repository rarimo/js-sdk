import { Components } from '@mui/material'

import { BaseTheme } from '@/types'

export const componentsTheme: Components<BaseTheme> = {
  MuiButton: {
    styleOverrides: {
      root: ({ ownerState, theme }) => ({
        backgroundColor: theme.palette.common.black,
        borderRadius: '0.5rem',
        boxShadow: 'none',
        color: theme.palette.common.white,
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
          color: theme.palette.common.white,
          backgroundColor: theme.palette.common.black,
          cursor: 'not-allowed',
        },
      }),
    },
  },
  MuiDialogContent: {
    styleOverrides: {
      root: {
        display: 'flex',
        flexDirection: 'column',
        gridGap: '0.625rem',
        padding: '3rem',
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: '1.5rem',
      },
    },
  },
  MuiList: {
    styleOverrides: {
      root: ({ theme }) => ({
        width: '100%',
        backgroundColor: theme.palette.background.paper,
      }),
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: '0.5rem',
        padding: '0.25rem',
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: ({ theme }) => ({
        border: '1px solid rgba(0, 0, 0, 0.12)',
        padding: theme.spacing(1.5),
        borderRadius: theme.spacing(1.5),
        background: '#f4f6fd',
        color: theme.palette.secondary.main,
        boxShadow: 'none',
        overflow: 'unset',
      }),
    },
  },
}
