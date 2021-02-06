import { h, Component, createRef, Fragment, JSX } from 'preact'
import FileList from './FileList'
import { directoryOpen } from 'browser-fs-access'

interface RootState {
  errored: boolean
  filesLoaded: boolean
  localAssets: LocalAssets | null
  maps: [] | null
  demos: []  | null
}

interface RootProps {
  initHLV: Function
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
      demos: null
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
      assets[type] = blobs.filter((map) => map.name.match('.' + type))
    })

    this.setState({
      localAssets: assets,
      filesLoaded: true
    })
  }

  loadMap = ({currentTarget}: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    const mapName = currentTarget.innerText
    this.props.initHLV({
      mapName,
      assets: this.state.localAssets,
      type: 'map'
    })
  }

  loadDemo = ({currentTarget}: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    const demoName = currentTarget.innerText
    this.props.initHLV({
      demoName,
      assets: this.state.localAssets,
      type: 'demo'
    })
  }

  componentDidMount() {}

  render() {
    // @ts-ignore
    return (
      <div id="interface-container">
        <div id="window-container">
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
        </div>
        {!this.state.filesLoaded ? (
          <div class="window" id="file-upload" name="Web HL">
            <button onClick={this.loadGameDir}>Open Game Directory</button>
          </div>
        ) : null}
      </div>
    )
  }
}

