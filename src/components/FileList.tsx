import { h, Component, createRef, Fragment } from 'preact'
import { LocalAssets } from './FileLoader'

interface RootProps {
  fileNames: [File]
  headerName: string
  callBack: any
}

class FileList extends Component<RootProps> {
  render(props: RootProps) {
    return (
      <>
        <div class="window file-upload" name={this.props.headerName}>
          <div class="box inset" id="item-list">
            {props.fileNames.map((file: File) => (
              <p class="menu-item" onClick={this.props.callBack}>
                {file.name}
              </p>
            ))}
          </div>
        </div>
      </>
    )
  }
}

export default FileList
