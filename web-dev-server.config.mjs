// import { hmrPlugin, presets } from '@open-wc/dev-server-hmr';

const hmr = process.argv.includes('--hmr');

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  open: '/docs/',
  watch: ! hmr,
  nodeResolve: {
    exportConditions: ['browser', 'development'],
  },
});
