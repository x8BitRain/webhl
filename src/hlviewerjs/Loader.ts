import { Bsp } from './Bsp'
import { Sound } from './Sound'
import { Config } from './Config'
import { Tga } from './Parsers/Tga'
import { Wad } from './Parsers/Wad'
import { extname, evt } from './Util'
import { Replay } from './Replay/Replay'
import { Sprite } from './Parsers/Sprite'
import { ProgressCallback, xhr } from './Xhr'
import { BspParser } from './Parsers/BspParser'

enum LoadItemStatus {
  Loading = 1,
  Skipped = 2,
  Error = 3,
  Done = 4
}

class LoadItemBase<T> {
  name: string | object
  progress: number
  status: LoadItemStatus
  data: T | null

  constructor(name: string | object) {
    this.name = name
    this.progress = 0
    this.status = LoadItemStatus.Loading
    this.data = null
  }

  isLoading() {
    return this.status === LoadItemStatus.Loading
  }

  skip() {
    this.status = LoadItemStatus.Skipped
  }

  isSkipped() {
    return this.status === LoadItemStatus.Skipped
  }

  // TODO: Add error reason
  error() {
    this.status = LoadItemStatus.Error
  }

  isError() {
    return this.status === LoadItemStatus.Error
  }

  done(data: T) {
    this.status = LoadItemStatus.Done
    this.data = data
  }

  isDone() {
    return this.status === LoadItemStatus.Done
  }
}

class LoadItemReplay extends LoadItemBase<any> {
  type: 'replay' = 'replay'
}

class LoadItemBsp extends LoadItemBase<Bsp> {
  type: 'bsp' = 'bsp'
}

class LoadItemSky extends LoadItemBase<Tga> {
  type: 'sky' = 'sky'
}

class LoadItemWad extends LoadItemBase<Wad> {
  type: 'wad' = 'wad'
}

class LoadItemSound extends LoadItemBase<Sound> {
  type: 'sound' = 'sound'
}

class LoadItemSprite extends LoadItemBase<Sprite> {
  type: 'sprite' = 'sprite'
}

export type LoadItem =
  | LoadItemReplay
  | LoadItemBsp
  | LoadItemSky
  | LoadItemWad
  | LoadItemSound
  | LoadItemSprite

export class Loader extends EventTarget {
  config: Config

  replay?: LoadItemReplay
  map?: LoadItemBsp
  skies: LoadItemSky[]
  wads: LoadItemWad[]
  sounds: LoadItemSound[]
  sprites: { [name: string]: LoadItemSprite } = {}

  constructor(config: Config) {
    super()
    this.config = config
    this.replay = undefined
    this.map = undefined
    this.skies = []
    this.wads = []
    this.sounds = []
  }

  clear() {
    this.replay = undefined
    this.map = undefined
    this.skies.length = 0
    this.wads.length = 0
    this.sounds.length = 0
    this.sprites = {}
  }

  checkStatus() {
    if (this.replay && !this.replay.isDone()) {
      return
    }

    if (this.map && !this.map.isDone()) {
      return
    }

    for (let i = 0; i < this.skies.length; ++i) {
      if (this.skies[i].isLoading()) {
        return
      }
    }

    for (let i = 0; i < this.wads.length; ++i) {
      if (this.wads[i].isLoading()) {
        return
      }
    }

    for (let i = 0; i < this.sounds.length; ++i) {
      if (this.sounds[i].isLoading()) {
        return
      }
    }

    const sprites = Object.entries(this.sprites)
    for (let i = 0; i < sprites.length; ++i) {
      if (sprites[i][1].isLoading()) {
        return
      }
    }

    this.dispatchEvent(evt('loadAll', { detail: { loader: this } }))
  }

  readFileAsync(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      let reader = new FileReader()
      reader.onload = () => {
        resolve(reader.result)
      }
      reader.onerror = reject
      reader.readAsArrayBuffer(file)
    })
  }

  async processFile(file: File): Promise<ArrayBuffer | undefined> {
    try {
      return await this.readFileAsync(file)
    } catch (err) {
      console.error('Could not read file: ', file, err)
    }
  }

  async load(file: string) {
    console.log(file);
    const extension = extname(file)
    if (extension === '.dem') {
      await this.loadReplay(file)
    } else if (extension === '.bsp') {
      await this.loadMap(file)
    } else {
      console.error('Invalid file extension', file)
    }
  }

  async loadReplay(demo: string) {
    let buffer: ArrayBuffer | undefined
    this.replay = new LoadItemReplay(demo)

    this.dispatchEvent(evt('loadstart', { detail: { item: this.replay } }))

    const progressCallback: ProgressCallback = (_1, progress) => {
      if (this.replay) {
        this.replay.progress = progress
      }

      this.dispatchEvent(evt('progress', { detail: { item: this.replay } }))
    }

    const demoFile = this.config.paths.replays.find(
      (file) => file.name === demo
    )
    if (demoFile) {
      buffer = await this.processFile(demoFile)
    } else {
      this.replay.error()
      console.error('Could not load: ', demo)
      this.checkStatus()
    }

    if (this.replay.isError()) {
      return
    }

    const replay = await Replay.parseIntoChunks(buffer as ArrayBuffer)
    this.replay.done(replay)

    await this.loadMap(replay.maps[0].name + '.bsp')

    const sounds = replay.maps[0].resources.sounds
    sounds.forEach((sound: any) => {
      const soundPath = sound.name.split('/')
      const soundName = soundPath[soundPath.length - 1]
      if (sound.used) {
        this.loadSound(soundName, sound.index)
      }
    })

    this.dispatchEvent(evt('load', { detail: { item: this.replay } }))
    this.checkStatus()
  }

  async loadMap(name: string) {
    let buffer: ArrayBuffer | undefined
    this.map = new LoadItemBsp(name)

    this.dispatchEvent(evt('loadstart', { detail: { item: this.map } }))

    const progressCallback: ProgressCallback = (_1, progress) => {
      if (this.map) {
        this.map.progress = progress
      }

      this.dispatchEvent(evt('progress', { detail: { item: this.map } }))
    }

    const mapFile = this.config.paths.maps.find((file) => file.name === name)
    if (mapFile) {
      buffer = await this.processFile(mapFile)
    } else {
      this.map.error()
      console.error('Could not load: ', name)
      this.checkStatus()
    }

    if (this.map.isError()) {
      return
    }

    const map = BspParser.parse(name, buffer as ArrayBuffer)
    this.map.done(map)

    map.entities
      .map((e: any) => {
        if (typeof e.model === 'string' && e.model.indexOf('.spr') > -1) {
          return e.model as string
        }
        return undefined
      })
      .filter(
        (a: string | undefined, pos: number, arr: (string | undefined)[]) =>
          a && arr.indexOf(a) === pos
      )
      .forEach((a) => a && this.loadSprite(a))

    const skyname = map.entities[0].skyname
    if (skyname) {
      const sides = ['bk', 'dn', 'ft', 'lf', 'rt', 'up']
      sides
        .map((a) => `${skyname}${a}`)
        .forEach((a) => {
          this.loadSky(a)
        })
    }

    // check if there is at least one missing texture
    // if yes then load wad files (textures should be there)
    if (map.textures.find((a) => a.isExternal)) {
      const wads = map.entities[0].wad
      const wadPromises = wads.map((w: string) => this.loadWad(w))
      await Promise.all(wadPromises)
    }

    this.dispatchEvent(evt('load', { detail: { item: this.map } }))
    this.checkStatus()
    this.dispatchEvent(evt('loadAll', { detail: { loader: this } }))
  }

  async loadSprite(name: string) {
    let buffer
    const item = new LoadItemSprite(name)
    this.sprites[name] = item

    this.dispatchEvent(evt('loadstart', { detail: { item } }))

    const progressCallback: ProgressCallback = (_1, progress) => {
      item.progress = progress

      this.dispatchEvent(evt('progress', { detail: { item } }))
    }

    const spritePath = name.split('/')
    const spriteName = spritePath[spritePath.length - 1]

    const sprFile = this.config.paths.sprites.find(
      (file) => file.name === spriteName
    )

    if (sprFile) {
      buffer = await this.processFile(sprFile)
    } else {
      item.error()
      console.error('Could not load: ', spriteName)
      this.checkStatus()
    }

    if (item.isError()) {
      return
    }

    const sprite = Sprite.parse(buffer as ArrayBuffer)
    item.done(sprite)

    this.dispatchEvent(evt('load', { detail: { item } }))
    this.checkStatus()
  }

  async loadSky(name: string) {
    let buffer
    const item = new LoadItemSky(name)
    this.skies.push(item)
    this.dispatchEvent(evt('loadstart', { detail: { item } }))

    const progressCallback: ProgressCallback = (_1, progress) => {
      item.progress = progress
      this.dispatchEvent(evt('progress', { detail: { item } }))
    }

    const skyString = new RegExp(name + '.tga', 'i')
    const skyFile = this.config.paths.skies.find((file) =>
      file.name.match(skyString)
    )

    if (skyFile) {
      buffer = await this.processFile(skyFile)
    } else {
      buffer = await xhr('/missing.tga', {
        method: 'GET',
        isBinary: true,
        progressCallback
      }).catch((err: any) => {
        item.error()
        console.error(err, item)
        this.checkStatus()
      })
    }

    if (item.isError()) {
      return
    }

    const skyImage = Tga.parse(buffer, name)
    item.done(skyImage)

    this.dispatchEvent(evt('load', { detail: { item } }))
    this.checkStatus()
  }

  async loadWad(name: string) {
    let buffer: ArrayBuffer | undefined
    const wadItem = new LoadItemWad(name)
    this.wads.push(wadItem)
    this.dispatchEvent(evt('loadstart', { detail: { item: wadItem } }))

    const progressCallback: ProgressCallback = (_1, progress) => {
      wadItem.progress = progress
      this.dispatchEvent(evt('progress', { detail: { item: wadItem } }))
    }

    const wadString = new RegExp(name, 'i')
    const wadFile = this.config.paths.wads.find((file) =>
      file.name.match(wadString)
    )

    if (wadFile) {
      buffer = await this.processFile(wadFile)
    } else {
      wadItem.error()
      console.error('Could not load: ', name)
      this.checkStatus()
    }

    if (wadItem.isError()) {
      return
    }

    const wad = await Wad.parse(buffer as ArrayBuffer)
    wadItem.done(wad)

    if (!this.map || !this.map.data) {
      return
    }

    const map = this.map.data
    const cmp = (a: any, b: any) => a.toLowerCase() === b.toLowerCase()
    wad.entries.forEach((entry) => {
      if (entry.type !== 'texture') {
        return
      }

      map.textures.forEach((texture) => {
        if (cmp(entry.name, texture.name)) {
          texture.width = entry.width
          texture.height = entry.height
          texture.data = entry.data
        }
      })
    })

    this.dispatchEvent(evt('loadstart', { detail: { item: wadItem } }))
    this.checkStatus()
  }

  async loadSound(name: string, index: number) {
    let buffer: ArrayBuffer | undefined
    let data
    const sound = new LoadItemSound(name)
    this.sounds.push(sound)

    this.dispatchEvent(evt('loadstart', { detail: { item: sound } }))

    const progressCallback: ProgressCallback = (_1, progress) => {
      sound.progress = progress
      this.dispatchEvent(evt('loadstart', { detail: { item: sound } }))
    }

    const soundFile = this.config.paths.sounds.find(
      (file) => file.name === name
    )

    if (soundFile) {
      buffer = await this.processFile(soundFile)
      data = await Sound.create(buffer as ArrayBuffer).catch((err: any) => {
        sound.error()
        console.error(err, sound)
        this.checkStatus()
      })
    } else {
      sound.error()
      console.error('Could not load: ', name)
      this.checkStatus()
    }

    if (!data || sound.isError()) {
      return
    }

    data.index = index
    data.name = name
    sound.done(data)

    this.dispatchEvent(evt('loadstart', { detail: { item: sound } }))
    this.checkStatus()
  }
}
