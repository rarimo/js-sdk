import {
  FormControl,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import { Network } from 'iconoir-react'
import { useMemo } from 'react'

import { useDappContext } from '@/hooks'

import styles from './BridgeChainSelect.module.css'

/**
 * @description A drop-down list for selecting the chain to use
 * @group Components
 */
const BridgeChainSelect = () => {
  const { supportedChains, selectedChain, setSelectedChain } = useDappContext()

  const handleChange = (event: SelectChangeEvent) => {
    const selectedChain = supportedChains.find(
      chain => chain.id === event.target.value,
    )

    setSelectedChain(selectedChain)
  }

  const value = useMemo(
    () => (selectedChain ? String(selectedChain.id) : ''),
    [selectedChain],
  )

  return (
    <FormControl fullWidth sx={{ mt: 1 }}>
      <InputLabel id="bridge-chain-select-lbl">Chain</InputLabel>
      <Select
        fullWidth
        labelId="bridge-chain-select-lbl"
        value={value}
        label="Chain"
        onChange={handleChange}
      >
        {supportedChains.map(chain => (
          <MenuItem key={chain.id} value={chain.id}>
            <ListItemIcon
              sx={{
                minWidth: 40,
              }}
            >
              {chain.icon ? (
                <img
                  className={styles.ListItemIcon}
                  src={chain.icon}
                  width={28}
                  height={28}
                  alt={`${chain.name} icon`}
                />
              ) : (
                <Network className={styles.DefaultIcon} />
              )}
            </ListItemIcon>
            <ListItemText
              primary={chain.name}
              sx={{
                m: 0,
              }}
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default BridgeChainSelect
