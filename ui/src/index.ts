import { definePlugin } from '@halo-dev/console-shared'
import { markRaw } from 'vue'
import MingcuteFileCodeLine from '~icons/mingcute/file-code-line'

export default definePlugin({
  components: {},
  routes: [
    {
      parentName: 'OverviewRoot',
      route: {
        path: '/log-viewer',
        name: 'LogViewer',
        component: () => import('./views/LogViewer.vue'),
        meta: {
          title: '日志',
          permissions: ['*'],
          searchable: true,
          hideFooter: true,
          menu: {
            name: '日志',
            icon: markRaw(MingcuteFileCodeLine),
            priority: 0,
          },
        },
      },
    },
  ],
})
