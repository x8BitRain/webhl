import { Component, h } from 'preact'
import { ControlsStyle as cs } from '../../Controls.style'

interface RecordButtonProps {
  onClick: Function
}

export class RecordButton extends Component<RecordButtonProps> {
  clicked = false;

  handleClick = () => {
    this.clicked = !this.clicked
    this.props.onClick()
  }

  render() {
    return (
      <div class={cs.button} onClick={() => this.handleClick()}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="red" id="mainSVG" style="">
          {
            this.clicked ?
            <rect id="svg_4" height="64" width="64" y="0" x="0" fill="red"/> :
            <circle xmlns='http://www.w3.org/2000/svg' fill='red' cx='32' cy='32' r='32' />
          }
        </svg>
    </div>
    )
  }
}