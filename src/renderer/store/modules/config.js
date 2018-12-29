import { remote } from 'electron';
import path from 'path';

const state = {
   poddir: path.join(remote.app.getPath('home'), 'podpupper'),
   concurrentDownloads: 3,
   concurrentRefreshes: 3
};

export default {
   state
};
