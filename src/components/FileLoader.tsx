import { h, Component, createRef, Fragment } from 'preact'
import HLViewer from './../hlviewerjs'
import FileList from './FileList'
import { fileOpen, directoryOpen } from 'browser-fs-access'

interface RootState {
  errored: boolean
  filesLoaded: false
  localAssets: LocalAssets
}

export interface LocalAssets {
  bsp: [File] | null
  dem: [File] | null
  wad: [File] | null
  tga: [File] | null
  wav: [File] | null
}

export class FileLoader extends Component<RootState> {
  fileUpload = createRef()
  constructor(props) {
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
    const localAssets: {[index: string]: any} = {};
    const fileTypes = [
      'bsp',
      'dem',
      'wad',
      'wav',
      'tga'
    ]

    const blobs = await directoryOpen({
      recursive: true
    })

    fileTypes.forEach(type => {
      localAssets[type] = blobs.filter((map) => map.name.match('.' + type))
    })

    this.setState({
      localAssets,
      filesLoaded: true
    })
  }

  loadMap = (e) => {
    const mapName = e.target.innerText
    console.log(mapName);
    this.props.initHLV({
      mapName,
      assets: this.state.localAssets,
      type: 'map'
    })
  }

  loadDemo = (e) => {
    const demoName = e.target.innerText
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

