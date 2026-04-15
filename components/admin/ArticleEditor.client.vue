<template>
  <div class="article-editor">
    <div ref="editorContainer" class="editor-canvas" />
  </div>
</template>

<script setup lang="ts">
import grapesjs from 'grapesjs'
import gjsPresetWebpage from 'grapesjs-preset-webpage'
import 'grapesjs/dist/css/grapes.min.css'

const props = defineProps<{
  htmlContent?: string
  cssContent?: string
  editorData?: Record<string, any> | null
}>()

const emit = defineEmits<{
  ready: [editor: any]
}>()

const editorContainer = ref<HTMLElement | null>(null)
let editor: any = null

function getOutput() {
  if (!editor) return { html: '', css: '', editorData: null }
  return {
    html: editor.getHtml(),
    css: editor.getCss(),
    editorData: JSON.parse(JSON.stringify(editor.getProjectData())),
  }
}

function setContent(html: string, css?: string) {
  if (!editor) return
  editor.setComponents(html)
  if (css) editor.setStyle(css)
}

defineExpose({ getOutput, setContent })

onMounted(() => {
  if (!editorContainer.value) return

  editor = grapesjs.init({
    container: editorContainer.value,
    height: '100%',
    width: 'auto',
    fromElement: false,
    storageManager: false,

    plugins: [gjsPresetWebpage],
    pluginsOpts: {
      [gjsPresetWebpage as any]: {
        blocksBasicOpts: {
          blocks: ['column1', 'column2', 'column3', 'text', 'link', 'image', 'video', 'map'],
          flexGrid: true,
        },
        navbarOpts: false,
        countdownOpts: false,
        formsOpts: false,
      },
    },

    deviceManager: {
      devices: [
        { name: 'Desktop', width: '' },
        { name: 'Tablet', width: '768px', widthMedia: '992px' },
        { name: 'Mobile', width: '375px', widthMedia: '480px' },
      ],
    },

    assetManager: {
      upload: false,
      dropzone: false,
    },

    styleManager: {
      sectors: [
        {
          name: 'General',
          open: true,
          properties: ['font-family', 'font-size', 'font-weight', 'line-height', 'color', 'background-color', 'text-align'],
        },
        {
          name: 'Espaciado',
          properties: ['padding', 'margin'],
        },
        {
          name: 'Bordes',
          properties: ['border', 'border-radius', 'box-shadow'],
        },
        {
          name: 'Dimensiones',
          properties: ['width', 'max-width', 'height'],
        },
      ],
    },

    canvas: {
      styles: [
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
      ],
    },

    blockManager: {
      blocks: [],
    },
  })

  // Custom blocks for articles
  const bm = editor.BlockManager

  bm.add('article-heading', {
    label: 'Titulo',
    category: 'Articulo',
    content: '<h2 style="font-family: Inter, sans-serif; font-size: 24px; font-weight: 700; color: #1F2937; margin: 0 0 16px;">Titulo de seccion</h2>',
    media: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 12h12M6 4h12"/></svg>',
  })

  bm.add('article-paragraph', {
    label: 'Parrafo',
    category: 'Articulo',
    content: '<p style="font-family: Inter, sans-serif; font-size: 15px; line-height: 1.7; color: #374151; margin: 0 0 16px;">Escribe aqui el contenido del articulo. Puedes usar <strong>negritas</strong>, <em>italicas</em> y <a href="#" style="color: #0D6B7E;">enlaces</a>.</p>',
    media: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h10"/></svg>',
  })

  bm.add('article-quote', {
    label: 'Cita',
    category: 'Articulo',
    content: '<blockquote style="font-family: Inter, sans-serif; font-size: 16px; font-style: italic; color: #5E6B78; border-left: 4px solid #0D6B7E; padding: 12px 20px; margin: 24px 0; background: #F7F8F4;">Texto de la cita o hallazgo relevante.</blockquote>',
    media: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"/></svg>',
  })

  bm.add('article-image', {
    label: 'Imagen con pie',
    category: 'Articulo',
    content: `<figure style="margin: 24px 0; text-align: center;">
      <img src="https://placehold.co/800x400/E6F4F7/0D6B7E?text=Imagen" style="max-width: 100%; height: auto; border-radius: 12px;" />
      <figcaption style="font-family: Inter, sans-serif; font-size: 12px; color: #5E6B78; margin-top: 8px;">Descripcion de la imagen. Fuente: ...</figcaption>
    </figure>`,
    media: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
  })

  bm.add('article-callout', {
    label: 'Destacado',
    category: 'Articulo',
    content: `<div style="font-family: Inter, sans-serif; background: #E6F4F7; border: 1px solid rgba(13,107,126,0.2); border-radius: 12px; padding: 20px; margin: 24px 0;">
      <p style="font-size: 14px; font-weight: 600; color: #094E5C; margin: 0 0 8px;">Dato importante</p>
      <p style="font-size: 14px; color: #0D6B7E; margin: 0;">Los humedales artificiales pueden remover hasta un 80% de contaminantes.</p>
    </div>`,
    media: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
  })

  bm.add('article-divider', {
    label: 'Separador',
    category: 'Articulo',
    content: '<hr style="border: none; border-top: 1px solid #E5E7EB; margin: 32px 0;" />',
    media: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/></svg>',
  })

  bm.add('article-source', {
    label: 'Fuente / Referencia',
    category: 'Articulo',
    content: `<div style="font-family: Inter, sans-serif; font-size: 12px; color: #5E6B78; background: #F7F8F4; border-radius: 8px; padding: 12px 16px; margin: 24px 0;">
      <strong style="color: #1F2937;">Fuente:</strong> Autor, A. (2024). Titulo del articulo. <em>Revista</em>, Vol(Num), pp. <a href="#" style="color: #0D6B7E;">Enlace</a>
    </div>`,
    media: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>',
  })

  // Canvas frame styles
  editor.on('canvas:frame:load', ({ window: frameWindow }: any) => {
    const doc = frameWindow.document
    const style = doc.createElement('style')
    style.textContent = `
      body {
        margin: 0;
        padding: 24px;
        font-family: 'Inter', system-ui, sans-serif;
        color: #1F2937;
        max-width: 800px;
        margin: 0 auto;
      }
      img { max-width: 100%; height: auto; }
      a { color: #0D6B7E; }
    `
    doc.head.appendChild(style)
  })

  // Load content
  if (props.editorData) {
    editor.loadProjectData(props.editorData)
  } else if (props.htmlContent) {
    editor.setComponents(props.htmlContent)
    if (props.cssContent) editor.setStyle(props.cssContent)
  }

  emit('ready', editor)
})

onBeforeUnmount(() => {
  if (editor) {
    editor.destroy()
    editor = null
  }
})
</script>

<style scoped>
.article-editor {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  background: white;
}
.editor-canvas {
  height: 600px;
}

/* GrapesJS theme overrides to match design system */
.article-editor :deep(.gjs-one-bg) {
  background-color: #f8f9fa;
}
.article-editor :deep(.gjs-two-color) {
  color: #1F2937;
}
.article-editor :deep(.gjs-three-bg) {
  background-color: #0D6B7E;
  color: white;
}
.article-editor :deep(.gjs-four-color),
.article-editor :deep(.gjs-four-color-h:hover) {
  color: #0D6B7E;
}
.article-editor :deep(.gjs-pn-btn.gjs-pn-active) {
  background-color: #0D6B7E;
  color: white;
  border-radius: 4px;
}
.article-editor :deep(.gjs-block) {
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  min-height: auto;
  padding: 8px;
}
.article-editor :deep(.gjs-block:hover) {
  border-color: #0D6B7E;
  box-shadow: 0 0 0 1px #0D6B7E;
}
.article-editor :deep(.gjs-category-title) {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
}
</style>
