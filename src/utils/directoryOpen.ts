interface Options {
  recursive: boolean
}

const folderRegex = new RegExp(
  name +
    '(platform|models|resource|save|overviews|media|scripts|logos|hw|cl_dlls|events|text|manual|classes|stats)',
  'i'
)
const fileRegex = new RegExp(name + '(.wav|.wad|.bsp|.dem|.spr|.tga)', 'i')

const getFiles = async (
  dirHandle: any,
  recursive: boolean,
  path: string = dirHandle.name
): Promise<any> => {
  const dirs = []
  const files = []
  for await (const entry of dirHandle.values()) {
    const nestedPath = `${path}/${entry.name}`
    if (entry.kind === 'file' && entry.name.match(fileRegex)) {
      files.push(await entry.getFile())
    } else if (entry.kind === 'directory' && recursive) {
      if (!entry.name.match(folderRegex)) {
        dirs.push(getFiles(entry, recursive, nestedPath))
      }
    }
  }
  return [...(await Promise.all(dirs)).flat(), ...(await Promise.all(files))]
}

export default async (options: Options) => {
  options.recursive = options.recursive || false
  // @ts-ignore
  const handle = await window.showDirectoryPicker()
  return await getFiles(handle, options.recursive)
}
