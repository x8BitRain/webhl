import { Component, h } from 'preact'
import { classes } from 'typestyle'
import { Game } from '../../Game'
import { Recorder } from '../../Recorder'
import { FreeModeStyle as s } from './style'
import { ControlsStyle as cs } from '../Controls.style'
import { SettingsButton } from '../Buttons/SettingsButton'
import { FullscreenButton } from '../Buttons/FullscreenButton'
import { RecordButton } from '../Buttons/RecordButton'

interface FreeModeProps {
  class: string
  game: Game
  root: Element
}

export class FreeMode extends Component<FreeModeProps> {
  recorder = new Recorder()

  onRecord = () => {
    this.recorder.record(this.props.game)
  }

  render() {
    return (
      <div class={classes(this.props.class, s.controls)}>
        <div class={cs.buttons}>
          <div class={cs.left}>
            <RecordButton onClick={this.onRecord} />
          </div>
          <div class={cs.right}>
            <SettingsButton game={this.props.game} />
            <FullscreenButton active={false} root={this.props.root} />
          </div>
        </div>
      </div>
    )
  }
}
