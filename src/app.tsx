import { h, Component, Fragment, createRef } from "preact"
import HLViewer from "./hlviewerjs"
import FileLoader from "./components/FileLoader";

class App extends Component {
  constructor() {
    super();
    this.state = { errored: false };
  }

  initHLV = (itemName: string, demos: [], type: string) => {
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
    if (type === 'demo') {
      this.startDemo(hlv, demos, itemName);
    } else {
      // not ready yet
    }
  }

  startDemo = (hlv: any, demos: [], demoName: string) => {
    const targetDemo = demos.find(demo => demo.name.match(demoName));
    let reader = new FileReader();
    reader.onload = function () {
      let arrayBuffer = this.result
      hlv ? hlv.load(arrayBuffer as object, 'demo') : console.error('HLViewer not Instantiated yet')
      console.log(hlv);
    }
    targetDemo ? reader.readAsArrayBuffer(targetDemo) : null
  }

  async componentDidMount() {
    // const hlv = HLViewer.init('#hlv-target', {
    //   paths: {
    //     base:    '/',
    //     replays: 'assets/demos',
    //     maps:    'assets/maps',
    //     wads:    'assets/wads',
    //     skies:   'assets/skies',
    //     sounds:  'assets/sounds'
    //   }
    // })
    // this.fileUpload.current.addEventListener('change', function(this: HTMLInputElement): void {
    //   let reader = new FileReader();
    //   reader.onload = function () {
    //     let arrayBuffer = this.result
    //     hlv ? hlv.load(arrayBuffer as object) : console.error('HLViewer not Instantiated yet')
    //   }
    //   if (this.files && this.parentElement) {
    //     reader.readAsArrayBuffer(this.files[0])
    //     this.parentElement.style.opacity = '0'
    //   }
    // }, false);
  }


  render() {
    // @ts-ignore
    return (
      <>
        <div id="app">
          <FileLoader initHLV={this.initHLV} />
          <div id="hlv-target" />
        </div>
      </>
    );
  }
}

export default App;
