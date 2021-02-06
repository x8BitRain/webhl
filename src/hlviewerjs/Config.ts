type ConfigPaths = {
  replays: [File]
  maps: [File]
  wads: [File]
  skies: [File]
  sounds: [File]
  sprites: [File]
}

export class Config {
  public static init(params: any): Config {
    return new Config({
      paths: {
        replays: (params && params.paths && params.paths.replays),
        maps: (params && params.paths && params.paths.maps),
        wads: (params && params.paths && params.paths.wads),
        skies: (params && params.paths && params.paths.skies),
        sounds: (params && params.paths && params.paths.sounds),
        sprites: (params && params.paths && params.paths.sprites)
      }
    })
  }

  paths: ConfigPaths

  constructor(params: { paths: ConfigPaths }) {
    this.paths = { ...params.paths }
  }
}
