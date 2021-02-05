import { h, Component, createRef, Fragment } from 'preact'

class FileList extends Component {
  render(props) {
    return (
      <>
        <div class="window" id="file-upload" name={this.props.headerName}>
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
