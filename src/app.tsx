import { h, Component, Fragment, render } from 'preact'
import { Game } from './hlviewerjs/Game'
import { Config } from './hlviewerjs/Config'
import { Root } from './hlviewerjs/PlayerInterface/Root'
import { FileLoader, LocalAssets } from './components/FileLoader'

interface Payload {
  assets: LocalAssets
  demoName: string
  mapName: string
  type: string
}

interface RootState {
  showUI: boolean
  fov: number
}

class App extends Component {
  private game: Game | null
  private rootNode: Element | null
  state: RootState

  constructor() {
    super()
    this.game = null
    this.rootNode = null
    this.state = {
      showUI: true,
      fov: 100
    }
  }

  initHLV(
    rootSelector: string,
    params: {
      paths: {
        replays: [File]
        maps: [File]
        sounds: [File]
        skies: [File]
        wads: [File]
        sprites: [File]
      }
    }
  ): void {
    const node = document.querySelector(rootSelector)
    if (!node) {
      return null
    }
    const config = Config.init(params)
    const result = Game.init(config)

    if (result.status === 'success') {
      this.game = result.game
      this.rootNode = node

      this.drawInterface()
      this.game.draw()
    }

    return null
  }

  init = (payload: Payload) => {
    if (!this.game) {
      this.initHLV('#hlv-target', {
        paths: {
          replays: payload.assets.dem,
          maps: payload.assets.bsp,
          wads: payload.assets.wad,
          skies: payload.assets.tga,
          sounds: payload.assets.wav,
          sprites: payload.assets.spr
        }
      })
      if (payload.type === 'demo') {
        this.startDemo(payload.demoName)
      } else {
        this.startMap(payload.mapName)
      }
    } else {
      if (payload.type === 'demo') {
        this.startDemo(payload.demoName)
        console.warn()
      } else {
        this.startMap(payload.mapName)
      }
    }
  }

  startDemo = (demoName: string) => {
    this.game
      ? this.game.load(demoName)
      : console.error('HLViewer not Instantiated yet')
  }

  startMap = (mapName: string) => {
    this.game
      ? this.game.load(mapName)
      : console.error('HLViewer not Instantiated yet')
  }

  toggleUI = (state: boolean) => {
    this.setState({
      showUI: state || !this.state.showUI
    })
  }

  componentDidMount() {
    window.addEventListener('keydown', (event) => {
      if (event.code === 'Backquote') {
        this.toggleUI(!this.state.showUI)
      }
    })
  }

  componentWillUnmount() {
    this.game = null
  }

  drawInterface() {
    render(
      <Root
        game={this.game as Game}
        root={this.rootNode as Element}
        toggleUI={this.toggleUI}
      />,
      this.rootNode as Element
    )
  }

  render() {
    return (
      <>
        <FileLoader
          init={this.init}
          showUI={this.state.showUI}
          toggleUI={this.toggleUI}
        />
        <div id="hlv-target" />
      </>
    )
  }
}

export default App
