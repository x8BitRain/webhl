import { Game } from './Game'

export class Recorder {
  recorder: MediaRecorder | null = null;
  isRecording = false;

  record = (game: Game) => {
    if (this.isRecording) {
      game.player.pause()
      this.recorder.stop()
      this.isRecording = false
      return
    }
    const canvas = game.canvas
    const stream = (canvas as any).captureStream(60) // record at 60fps
    if (game.mode === 1) {
      game.soundSystem.stream.stream.getAudioTracks()
        .forEach((a) => stream.addTrack(a))
    }
    const chunks: Blob[] = []
    this.recorder = new MediaRecorder(stream, {
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 30720000,
      mimeType: 'video/webm'
    })
    this.recorder.addEventListener('dataavailable', (e) => {
      chunks.push(e.data)
    })
    this.recorder.addEventListener('stop', () => {
      exportVid(new Blob(chunks, { type: 'video/webm' }))
    })

    game.player.play()
    this.isRecording = true
    this.recorder.start()

    const exportVid = (blob: any) => {
      const vid = document.createElement('video')
      vid.src = URL.createObjectURL(blob)
      vid.controls = true
      document.body.appendChild(vid)
      const a = document.createElement('a')
      a.download = 'output.webm'
      a.href = vid.src
      a.textContent = 'Download the clip'
      document.body.appendChild(a)
      a.click()
    }
  }
}


