import { h, Component, createRef, Fragment, JSX } from 'preact'
import FileList from './FileList'
import { directoryOpen } from 'browser-fs-access'

interface RootState {
  errored: boolean
  filesLoaded: boolean
  localAssets: LocalAssets | null
  maps: [] | null
  demos: [] | null
}

interface RootProps {
  init: Function
  toggleUI: Function
  showUI: boolean
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
    this.state = {
      errored: false,
      filesLoaded: false,
      localAssets: null,
      maps: null,
      demos: null
    }
  }

  loadGameDir = async () => {
    let assets: any = {}
    const fileTypes = ['bsp', 'dem', 'wad', 'wav', 'tga', 'spr']

    const blobs = await directoryOpen({
      recursive: true
    })

    fileTypes.forEach((type) => {
      const typeString = new RegExp('.' + type, 'i')
      assets[type] = blobs.filter((map) => map.name.match(typeString))
    })

    this.setState({
      localAssets: assets,
      filesLoaded: true
    })
  }

  loadMap = ({ currentTarget }: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    const mapName = currentTarget.innerText
    this.props.init({
      mapName,
      assets: this.state.localAssets,
      type: 'map'
    })
    this.props.toggleUI(false)
  }

  loadDemo = ({
    currentTarget
  }: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    const demoName = currentTarget.innerText
    this.props.init({
      demoName,
      assets: this.state.localAssets,
      type: 'demo',
      showUI: false
    })
    this.props.toggleUI(false)
  }

  render() {
    // @ts-ignore
    return (
      <div id="interface-container">
        {this.props.showUI ? (
          <>
            {this.state.localAssets ? (
              <div id="window-container">
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
              </div>
            ) : null}
          </>
        ) : null}
        {!this.state.filesLoaded ? (
          <div class="window file-upload" name="Web HL">
            <button onClick={this.loadGameDir}>Open Game Directory</button>
          </div>
        ) : null}
      </div>
    )
  }
}
