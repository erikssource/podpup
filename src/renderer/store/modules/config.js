import { remote } from 'electron'
import path from 'path'

const state = {
   poddir: path.join(remote.app.getPath('home'), 'podpupper')
}

export default {
   state
}