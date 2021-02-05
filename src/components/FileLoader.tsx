import { h, Component, createRef, Fragment } from 'preact'
import HLViewer from './../hlviewerjs'
import FileList from './FileList'
import { fileOpen, directoryOpen } from 'browser-fs-access'

interface RootState {
  errored: boolean
  filesLoaded: false
  maps: [] | null
  demos: [] | null
  wads: [] | null
  skies: [] | null
  sounds: [] | null
}

class FileLoader extends Component<RootState> {
  fileUpload = createRef()
  constructor(props) {
    super(props)
    this.state = {
      errored: false,
      filesLoaded: false,
      maps: null,
      demos: null
    }
  }

  loadGameDir = async () => {
    const options = {
      recursive: true
    }
    const blobs = await directoryOpen(options)
    const maps = blobs.filter((map) => map.name.match('.bsp'))
    const demos = blobs.filter((demo) => demo.name.match('.dem'))
    const wads = blobs.filter((demo) => demo.name.match('.wad'))
    const sounds = blobs.filter((demo) => demo.name.match('.wav'))
    const skies = blobs.filter((demo) => demo.name.match('.tga'))

    console.log(maps, 'MAPS')
    console.log(demos, 'DEMOS?')
    this.setState({
      maps,
      demos,
      wads,
      sounds,
      skies,
      filesLoaded: true
    })
  }

  loadMap = (e) => {
    console.log(e.target.innerText)
    const mapName = e.target.innerText
    this.props.initHLV(mapName, 'map')
  }

  loadDemo = (e) => {
    console.log(e.target.innerText)
    const demoName = e.target.innerText
    this.props.initHLV(demoName, this.state.demos, 'demo')
  }

  componentDidMount() {}

  render() {
    // @ts-ignore
    return (
      <>
        <div id="interface-container">
          <div id="window-container">
            {this.state.maps ? (
              <FileList
                fileNames={this.state.maps}
                headerName="Maps"
                callBack={this.loadMap}
              />
            ) : null}
            {this.state.demos ? (
              <FileList
                fileNames={this.state.demos}
                headerName="Demos"
                callBack={this.loadDemo}
              />
            ) : null}
          </div>
          {!this.state.filesLoaded ? (
            <div class="window" id="file-upload" name="Web HL">
              <button onClick={this.loadGameDir}>Open Game Directory</button>
            </div>
          ) : null}
        </div>
      </>
    )
  }
}

export default FileLoader
