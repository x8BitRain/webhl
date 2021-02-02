import { h, Component, Fragment } from "preact";
import HLViewer from "./hlviewerjs";


class App extends Component {
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
    hlv ? hlv.load('kz_ea_highblock.dem') : null;
  }


  render() {
    // @ts-ignore
    return (
      <div id="app">
        <div id="hlv-target" />
      </div>
    );
  }
}

export default App;
