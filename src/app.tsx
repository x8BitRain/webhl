import { h, Component } from "preact";

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
    hlv.load('1.dem')
  }


  render() {
    return (
      <div id="app">
        <div id="hlv-target"></div>
      </div>
    );
  }
}

export default App;
