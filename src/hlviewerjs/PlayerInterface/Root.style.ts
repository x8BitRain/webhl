import { stylesheet } from 'typestyle'

const rootStyle = () => ({
  position: 'relative' as 'relative',
  color: 'white',
  width: '100%',
  height: '100%',
  cursor: 'none',
  userSelect: 'none' as 'none'
})

const titleStyle = () => ({
  position: 'absolute' as 'absolute',
  bottom: '6.5%',
  left: '1.6%',
  zIndex: 20,
  opacity: 0,
  transition: 'opacity 0.2s'
})

const controlsStyle = () => ({
  zIndex: 30,
  position: 'absolute' as 'absolute',
  width: '100%',
  bottom: 0,
  padding: '0 16px',
  boxSizing: 'border-box' as 'border-box',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  userSelect: 'none' as 'none',
  opacity: 0,
  transition: 'opacity 0.2s'
})

export const RootStyle = stylesheet({
  root: {
    ...rootStyle()
  },
  rootVisible: {
    ...rootStyle(),
    cursor: 'default'
  },

  title: {
    ...titleStyle()
  },
  titleVisible: {
    ...titleStyle(),
    opacity: 1
  },

  controls: {
    ...controlsStyle()
  },
  controlsVisible: {
    ...controlsStyle(),
    opacity: 1
  },

  screen: {
    position: 'absolute' as 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 10
  }
})
