import { h, Component, createRef, Fragment, JSX } from 'preact'
import FileList from './FileList'
import { directoryOpen } from 'browser-fs-access'

interface RootState {
  errored: boolean
  filesLoaded: boolean
  localAssets: LocalAssets | null
  maps: [] | null
  demos: []  | null
  showUI: boolean
}

interface RootProps {
  init: Function
}

export interface LocalAssets {
  bsp: [File]
  dem: [File]
  wad: [File]
  tga: [File]
  wav: [File]
  spr: [File]
  [index: string]: any
}

export class FileLoader extends Component<RootProps, RootState> {
  fileUpload = createRef()
  constructor(props: RootProps) {
    super(props)
    console.log(props);
    this.state = {
      errored: false,
      filesLoaded: false,
      localAssets: null,
      maps: null,
      demos: null,
      showUI: true,
    }
  }

  loadGameDir = async () => {
    let assets: any = {};
    const fileTypes = [
      'bsp',
      'dem',
      'wad',
      'wav',
      'tga',
      'spr'
    ]

    const blobs = await directoryOpen({
      recursive: true
    })

    fileTypes.forEach(type => {
      const typeString = new RegExp('.' + type, 'i')
      assets[type] = blobs.filter((map) => map.name.match(typeString))
    })

    this.setState({
      localAssets: assets,
      filesLoaded: true
    })
  }

  hideUI = () => {
    window.localStorage.setItem('showUI', 'false')
    this.setState({
      showUI: false
    })
  }

  loadMap = ({currentTarget}: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    const mapName = currentTarget.innerText
    this.props.init({
      mapName,
      assets: this.state.localAssets,
      type: 'map',
    })
    this.hideUI()
  }

  loadDemo = ({currentTarget}: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    const demoName = currentTarget.innerText
    this.props.init({
      demoName,
      assets: this.state.localAssets,
      type: 'demo',
      showUI: false
    })
    this.hideUI()
  }

  componentDidMount() {
  }

  render() {
    // @ts-ignore
    return (
      <div id="interface-container">
        {this.state.showUI ?
          (<div id="window-container">
          {this.state.localAssets ? (
            <>
              <FileList
                fileNames={this.state.localAssets.bsp}
                headerName="Maps"
                callBack={this.loadMap}
              />
              <FileList
                fileNames={this.state.localAssets.dem}
                headerName="Demos"
                callBack={this.loadDemo}
              />
            </>
          ) : null}
        </div>) : null
        }
        {!this.state.filesLoaded ? (
          <div class="window" id="file-upload" name="Web HL">
            <button onClick={this.loadGameDir}>Open Game Directory</button>
          </div>
        ) : null}
      </div>
    )
  }
}

