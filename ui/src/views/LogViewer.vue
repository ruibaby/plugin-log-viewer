<script lang="ts" setup>
import { useMonaco } from '@/composables/use-monaco'
import { axiosInstance } from '@halo-dev/api-client'
import { VButton, VPageHeader, VStatusDot } from '@halo-dev/components'
import { useQuery } from '@tanstack/vue-query'
import { saveAs } from 'file-saver'
import { computed, ref, watch } from 'vue'
import MingcuteDownload3Line from '~icons/mingcute/download-3-line'
import MingcuteFileCodeLine from '~icons/mingcute/file-code-line'

const enableRefetch = ref(true)
const enableAutoScroll = ref(true)

const { data, isFetching } = useQuery({
  queryKey: ['plugin:log-viewer:data'],
  queryFn: async () => {
    const { data } = await axiosInstance.get<string>('/actuator/logfile')
    return data
  },
  refetchInterval: computed(() => (enableRefetch.value ? 2000 : undefined)),
})

const { container, editor } = useMonaco(data)

watch(
  () => data.value,
  (value) => {
    if (!editor.value) {
      return
    }
    if (editor.value.getValue() !== value) {
      editor.value.setValue(value ?? '')
      if (enableAutoScroll.value) {
        editor.value.revealLine(editor.value.getModel()?.getLineCount() ?? 0)
      }
    }
  },
  {
    immediate: true,
  },
)

function handleDownload() {
  const blob = new Blob([data.value ?? ''], { type: 'text/plain;charset=utf-8' })
  saveAs(blob, `halo-log-${Date.now()}.log`)
}
</script>
<template>
  <VPageHeader title="日志">
    <template #icon>
      <MingcuteFileCodeLine />
    </template>
    <template #actions>
      <Transition name="fade">
        <VStatusDot v-show="isFetching" state="warning" />
      </Transition>
      <VButton size="sm" ghost @click="enableRefetch = !enableRefetch">
        {{ enableRefetch ? '自动刷新（开启）' : '自动刷新（关闭）' }}
      </VButton>
      <VButton size="sm" ghost @click="enableAutoScroll = !enableAutoScroll">
        {{ enableAutoScroll ? '自动滚动（开启）' : '自动滚动（关闭）' }}
      </VButton>
      <VButton @click="handleDownload">
        <template #icon>
          <MingcuteDownload3Line />
        </template>
        下载
      </VButton>
    </template>
  </VPageHeader>
  <div id="container" style="height: 100%; border-top: 1px solid #eee" ref="container"></div>
</template>
