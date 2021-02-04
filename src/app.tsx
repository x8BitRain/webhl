import { h, Component, Fragment, createRef } from "preact";
import HLViewer from "./hlviewerjs";


class App extends Component {
  fileUpload = createRef();
  constructor() {
    super();
    this.state = { errored: false };
  }

  componentDidMount() {
    const hlv = HLViewer.init('#hlv-target', {
      paths: {
        base:    '/',
        replays: 'assets/demos',
        maps:    'assets/maps',
        wads:    'assets/wads',
        skies:   'assets/skies',
        sounds:  'assets/sounds'
      }
    })
    this.fileUpload.current.addEventListener('change', function(this: HTMLInputElement): void {
      let reader = new FileReader();
      reader.onload = function () {
        let arrayBuffer = this.result
        hlv ? hlv.load(arrayBuffer as object) : console.error('HLViewer not Instantiated yet')
      }
      if (this.files && this.parentElement) {
        reader.readAsArrayBuffer(this.files[0])
        this.parentElement.style.opacity = '0'
      }
    }, false);
  }


  render() {
    // @ts-ignore
    return (
      <>
        <div class="window" id="fileUpload" name="Upload Demo" accept=".dem">
          <input type="file" ref={this.fileUpload} />
        </div>
        <div id="app">
          <div id="hlv-target" />
        </div>
      </>
    );
  }
}

export default App;
