import { h, Component, Fragment, createRef } from 'preact'
import HLViewer from './hlviewerjs'
import { FileLoader, LocalAssets} from './components/FileLoader'

interface Payload {
  demoName: string,
  mapName: string,
  assets: LocalAssets,
  type: string
}

class App extends Component {
  constructor() {
    super()
    this.state = { errored: false }
  }

  initHLV = (payload: Payload) => {
    const hlv = HLViewer.init('#hlv-target', {
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
      this.startDemo(hlv, payload.demoName)
    } else {
      this.startMap(hlv, payload.mapName)
    }
  }

  startDemo = (hlv: any, demoName: string) => {
    hlv
      ? hlv.load(demoName)
      : console.error('HLViewer not Instantiated yet')
  }

  startMap = (hlv: any, mapName: string) => {
    hlv
      ? hlv.load(mapName)
      : console.error('HLViewer not Instantiated yet')
  }

  async componentDidMount() {}

  render() {
    // @ts-ignore
    return (
      <>
        <div id="app">
          <FileLoader initHLV={this.initHLV} />
          <div id="hlv-target" />
        </div>
      </>
    )
  }
}

export default App
