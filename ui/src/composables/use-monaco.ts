import * as monaco from 'monaco-editor'
import { onMounted, onUnmounted, shallowRef, useTemplateRef, watchEffect, type Ref } from 'vue'

function registerSpringLogLanguage() {
  monaco.languages.register({ id: 'springlog' })
  monaco.languages.setMonarchTokensProvider('springlog', {
    tokenizer: {
      root: [
        [/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}\+\d{2}:\d{2}/, 'timestamp'],

        [/\bTRACE\b/, 'log-level-trace'],
        [/\bDEBUG\b/, 'log-level-debug'],
        [/\bINFO\b/, 'log-level-info'],
        [/\bWARN\b/, 'log-level-warn'],
        [/\bERROR\b/, 'log-level-error'],
        [/\bFATAL\b/, 'log-level-error'],

        [/\b\d+\s+---/, 'process-id'],

        [/\[[^\]]+\]/, 'thread-name'],

        [/\b[a-z]+(\.[a-z][a-zA-Z0-9]*)*\.[A-Z][a-zA-Z0-9]*\b/, 'class-name'],

        [/\b\w*Exception\b/, 'exception-name'],
        [/\b\w*Error\b/, 'exception-name'],

        [/^\s*at\s+/, 'stack-trace-at'],
        [/^Caused by:/, 'caused-by'],

        [/\([^)]*\.java:\d+\)/, 'file-location'],
        [/\(Unknown Source\)/, 'unknown-source'],
        [/\(Native Method\)/, 'native-method'],

        [/~\[[^\]]+\.jar[^\]]*\]/, 'jar-path'],

        [/https?:\/\/[^\s]+/, 'url'],

        [/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?\b/, 'ip-address'],

        [/---/, 'separator'],

        [/"[^"]*"/, 'string'],
        [/'[^']*'/, 'string'],

        [/\b\d+\b/, 'number'],
      ],
    },
  })

  monaco.editor.defineTheme('springlog-theme', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'timestamp', foreground: '888888', fontStyle: 'bold' },
      { token: 'log-level-trace', foreground: 'cccccc' },
      { token: 'log-level-debug', foreground: '0066cc' },
      { token: 'log-level-info', foreground: '00aa00', fontStyle: 'bold' },
      { token: 'log-level-warn', foreground: 'ff8800', fontStyle: 'bold' },
      { token: 'log-level-error', foreground: 'dd0000', fontStyle: 'bold' },
      { token: 'process-id', foreground: '666666' },
      { token: 'thread-name', foreground: '008800' },
      { token: 'class-name', foreground: '0066cc' },
      { token: 'exception-name', foreground: 'dd0000', fontStyle: 'bold' },
      { token: 'stack-trace-at', foreground: '666666' },
      { token: 'caused-by', foreground: 'dd0000', fontStyle: 'bold' },
      { token: 'file-location', foreground: '666666' },
      { token: 'unknown-source', foreground: '999999', fontStyle: 'italic' },
      { token: 'native-method', foreground: '999999', fontStyle: 'italic' },
      { token: 'jar-path', foreground: '666666' },
      { token: 'url', foreground: '0066cc' },
      { token: 'ip-address', foreground: '0088aa' },
      { token: 'separator', foreground: '666666' },
      { token: 'string', foreground: '008800' },
      { token: 'number', foreground: '0088aa' },
    ],
    colors: {},
  })
}

export function useMonaco(value: Ref<string | undefined>) {
  const container = useTemplateRef<HTMLDivElement>('container')
  const editor = shallowRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  watchEffect(() => {
    if (container.value && !editor.value) {
      editor.value = monaco.editor.create(container.value, {
        value: value.value ?? '',
        automaticLayout: true,
        readOnly: true,
        language: 'springlog',
        theme: 'springlog-theme',
        mouseWheelZoom: true,
      })
      editor.value.revealLine(editor.value.getModel()?.getLineCount() ?? 0)
    }
  })

  onMounted(() => {
    registerSpringLogLanguage()
  })

  onUnmounted(() => {
    editor.value?.dispose()
    editor.value = null
  })

  return {
    container,
    editor,
  }
}
