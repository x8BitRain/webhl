import {h, Component, Fragment, render} from 'preact'
import { Game } from './hlviewerjs/Game'
import { Config } from './hlviewerjs/Config'
import { Root } from './hlviewerjs/PlayerInterface/Root'
import { FileLoader, LocalAssets} from './components/FileLoader'

interface Payload {
  assets: LocalAssets,
  demoName: string,
  mapName: string,
  type: string
}

class App extends Component {

  private game: Game | null
  private rootNode: Element | null

  constructor() {
    super();
    this.game = null
    this.rootNode = null
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
  ) {
    const node = document.querySelector(rootSelector)
    if (!node) {
      return null
    }
    const config = Config.init(params)
    const result = Game.init(config)

    if (result.status === 'success') {
      this.game = result.game
      this.rootNode = node;

      this.drawInterface()
      this.game.draw()
    }

    return null
  }


  init = (payload: Payload) => {
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

  async componentDidMount() {}

  drawInterface() {
    render(<Root game={this.game as Game} root={this.rootNode as Element} />, this.rootNode as Element)
  }

  render() {
    return (
      <>
        <div id="app">
          <FileLoader init={this.init} />
          <div id="hlv-target">
          </div>
        </div>
      </>
    )
  }
}

export default App
