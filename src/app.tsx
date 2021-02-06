import { h, Component, Fragment, createRef } from 'preact'
import HLViewer from './hlviewerjs'
import { FileLoader, LocalAssets} from './components/FileLoader'

interface Payload {
  demoName: string,
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
        base: '/',
        // skies: 'assets/skies',
        // sounds: 'assets/sounds',
        replays: payload.assets.dem,
        maps: payload.assets.bsp,
        wads: payload.assets.wad,
        skies: payload.assets.tga,
        sounds: payload.assets.wav
      }
    })
    console.log(payload);
    if (payload.type === 'demo') {
      this.startDemo(hlv, payload.demoName)
    } else {
      this.startMap(hlv, payload.mapName)
    }

  }

  startDemo = (hlv: any, demoName: string) => {
    // const targetDemo = demos.find((demo) => demo.name.match(demoName))
    // let reader = new FileReader()
    // reader.onload = function () {
    //   let arrayBuffer = this.result
      hlv
        ? hlv.load(demoName)
        : console.error('HLViewer not Instantiated yet')
    //   console.log(hlv)
    // }
    // targetDemo ? reader.readAsArrayBuffer(targetDemo) : null
  }

  startMap = (hlv: any, mapName: string) => {
    // const targetDemo = demos.find((demo) => demo.name.match(demoName))
    // let reader = new FileReader()
    // reader.onload = function () {
    //   let arrayBuffer = this.result
    hlv
      ? hlv.load(mapName)
      : console.error('HLViewer not Instantiated yet')
    //   console.log(hlv)
    // }
    // targetDemo ? reader.readAsArrayBuffer(targetDemo) : null
  }

  async componentDidMount() {
    // const hlv = HLViewer.init('#hlv-target', {
    //   paths: {
    //     base:    '/',
    //     replays: 'assets/demos',
    //     maps:    'assets/maps',
    //     wads:    'assets/wads',
    //     skies:   'assets/skies',
    //     sounds:  'assets/sounds'
    //   }
    // })
    // this.fileUpload.current.addEventListener('change', function(this: HTMLInputElement): void {
    //   let reader = new FileReader();
    //   reader.onload = function () {
    //     let arrayBuffer = this.result
    //     hlv ? hlv.load(arrayBuffer as object) : console.error('HLViewer not Instantiated yet')
    //   }
    //   if (this.files && this.parentElement) {
    //     reader.readAsArrayBuffer(this.files[0])
    //     this.parentElement.style.opacity = '0'
    //   }
    // }, false);
  }

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
