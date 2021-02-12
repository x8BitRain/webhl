import { h, Component, createRef, Fragment, JSX } from 'preact'
import FileList from './FileList'
import initConsole from '../utils/console'
import chromeDirectoryOpen from '../utils/directoryOpen'
import { directoryOpen } from "browser-fs-access";

interface RootState {
  errors: []
  errored: boolean
  showConsole: boolean
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
      errors: [],
      showConsole: false,
      errored: false,
      filesLoaded: false,
      localAssets: null,
      maps: null,
      demos: null
    }
  }

  loadGameDir = async () => {
    let blobs: File[];
    const app = document.querySelector('#app') as HTMLElement
    app ? app.classList.add('loading') : null
    let assets: any = {}
    const fileTypes = ['bsp', 'dem', 'wad', 'wav', 'tga', 'spr']
    // @ts-ignore
    if (!!window.chrome) {
      blobs = await chromeDirectoryOpen({
        recursive: true
      })
    } else {
      blobs = await directoryOpen({
        recursive: true
      })
    }
    app.classList.remove('loading')
    fileTypes.forEach((type) => {
      const typeString = new RegExp('.' + type, 'i')
      assets[type] = (blobs).filter((map: File) => map.name.match(typeString))
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

  loadDemoManual = ({currentTarget}: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    const file = currentTarget.files[0]
    this.state.localAssets.dem.push(file)
    this.props.init({
      demoName: file.name,
      assets: this.state.localAssets,
      type: 'demo',
      showUI: false
    })
    this.props.toggleUI(false)
  }

  showConsole = ({currentTarget}: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    localStorage.setItem('showConsole', String(!this.state.showConsole === true))
    this.setState({
      showConsole: (currentTarget).checked
    })
  }

  componentDidMount() {
    initConsole(this.props.toggleUI, this.state.showConsole, this.state.errors)
    this.setState({
      showConsole: (window.localStorage.getItem('showConsole') === 'true')
    })

  }

  render() {
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
                  <div style={'z-index: 11'}>
                    <FileList
                      fileNames={this.state.localAssets.dem}
                      headerName="Demos"
                      callBack={this.loadDemo}
                    />
                    <div class="window file-upload" id="demo-upload" name={'Demo Upload'}>
                      <input type='file' onChange={this.loadDemoManual} accept={'.dem'} />
                    </div>
                    <div class="window file-upload"id="settings-box" name={'Settings'}>
                      <label htmlFor='show-console-setting'>
                        <input type='checkbox' name='Show Console' id='show-console-setting' checked={this.state.showConsole} onChange={this.showConsole}/>
                        Show console
                      </label>
                    </div>
                    <div class="box file-upload">
                      <a href='https://github.com/x8BitRain/webhl'>GitHub</a>
                    </div>
                  </div>
                </>
                {this.state.showConsole ? <div class='window' id='error-box' name={'Console'}>
                  <div class='box inset' id='item-list'>
                    {this.state.errors ?
                      this.state.errors.map((error: string) => (
                        <p class='menu-item'>
                          {error}
                        </p>
                      )) : null}
                  </div>
                </div> : null}
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
