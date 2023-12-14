import preact from '@preact/preset-vite'
import type { UserConfig } from 'vite'

const config: UserConfig = {
  base: "/webhl/",
  plugins: [preact()],
}

export default config
