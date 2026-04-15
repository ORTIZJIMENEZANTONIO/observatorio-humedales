<template>
  <div class="article-editor">
    <div v-if="loading" class="editor-loading">
      <div class="animate-spin-smooth h-8 w-8 rounded-full border-2 border-primary border-t-transparent" />
      <span>Cargando editor...</span>
    </div>
    <div ref="editorContainer" class="editor-canvas" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  htmlContent?: string
  cssContent?: string
  editorData?: Record<string, any> | null
}>()

const emit = defineEmits<{
  ready: [editor: any]
  'upload-image': [file: File]
}>()

const editorContainer = ref<HTMLElement | null>(null)
let editor: any = null
const loading = ref(true)

// ── Public API ──
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

function getPreviewHtml(): string {
  if (!editor) return ''
  const html = editor.getHtml()
  const css = editor.getCss()
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
<style>body{margin:0;padding:24px;font-family:'Inter',system-ui,sans-serif;color:#1F2937;max-width:800px;margin:0 auto;}
img{max-width:100%;height:auto;}a{color:#0D6B7E;}
${css || ''}</style></head>
<body>${html || '<p style="color:#999;text-align:center;">Sin contenido</p>'}</body></html>`
}

function addAssets(newAssets: Array<{ url: string; original_name?: string; filename?: string }>) {
  if (!editor) return
  const am = editor.AssetManager
  const mapped = newAssets.map((a: any) => ({
    src: a.url,
    name: a.original_name || a.filename,
    type: 'image',
  }))
  am.add(mapped)

  // If an image component is selected, set the new image as its src
  if (mapped.length === 1) {
    const selected = editor.getSelected()
    if (selected && selected.get('type') === 'image') {
      selected.set('src', mapped[0].src)
    }
  }

  // Refresh asset manager view if open
  if (am.isOpen && am.isOpen()) {
    am.render()
  }
}

defineExpose({ getOutput, setContent, getPreviewHtml, addAssets })

// ── RTE Controls (from Axend CrmEmailEditor) ──
function registerRteControls(ed: any) {
  const ss = 'font-size:11px;padding:2px 4px;border:none;border-radius:2px;background:#464b5e;color:#ddd;cursor:pointer;outline:none;height:24px;'

  // Font family selector
  ed.RichTextEditor.add('fontFamily', {
    icon: `<select style="${ss}min-width:100px;">
      <option value="">- Fuente -</option>
      <option value="Inter, system-ui, sans-serif" style="font-family:Inter">Inter</option>
      <option value="Arial, Helvetica, sans-serif" style="font-family:Arial">Arial</option>
      <option value="Georgia, serif" style="font-family:Georgia">Georgia</option>
      <option value="'Times New Roman', Times, serif" style="font-family:'Times New Roman'">Times New Roman</option>
      <option value="Verdana, Geneva, sans-serif" style="font-family:Verdana">Verdana</option>
      <option value="'Courier New', Courier, monospace" style="font-family:'Courier New'">Courier New</option>
    </select>`,
    event: 'change',
    result: (rte: any, action: any) => {
      const val = action.btn.querySelector('select').value
      if (val) rte.exec('fontName', val)
    },
    update: (rte: any, action: any) => {
      try {
        const select = action.btn.querySelector('select')
        const current = (rte.doc.queryCommandValue('fontName') || '').replace(/['"]/g, '').toLowerCase()
        if (!current) { select.value = ''; return }
        for (const opt of select.options) {
          if (opt.value && opt.value.toLowerCase().includes(current)) { select.value = opt.value; return }
        }
        select.value = ''
      } catch { /* ignore */ }
    },
  })

  // Font size selector
  ed.RichTextEditor.add('fontSize', {
    icon: `<select style="${ss}min-width:65px;">
      <option value="">Tamano</option>
      <option value="1">10px</option>
      <option value="2">13px</option>
      <option value="3">16px</option>
      <option value="4">18px</option>
      <option value="5">24px</option>
      <option value="6">32px</option>
      <option value="7">48px</option>
    </select>`,
    event: 'change',
    result: (rte: any, action: any) => {
      const val = action.btn.querySelector('select').value
      if (val) rte.exec('fontSize', val)
    },
    update: (rte: any, action: any) => {
      try {
        const select = action.btn.querySelector('select')
        select.value = rte.doc.queryCommandValue('fontSize') || ''
      } catch { /* ignore */ }
    },
  })

  // Link editor with modal
  const btnStyle = 'font-size:11px;padding:2px 6px;border:none;border-radius:2px;background:#464b5e;color:#ddd;cursor:pointer;outline:none;height:24px;'

  ed.RichTextEditor.add('link', {
    icon: `<span style="${btnStyle}" title="Insertar/editar enlace">&#128279;</span>`,
    result: (rte: any) => {
      const doc = rte.doc || document
      const sel = doc.getSelection()
      const selectedText = sel ? sel.toString() : ''

      let savedRange: Range | null = null
      if (sel && sel.rangeCount > 0) savedRange = sel.getRangeAt(0).cloneRange()

      let existingLink: HTMLAnchorElement | null = null
      if (savedRange) {
        let node: Node | null = savedRange.commonAncestorContainer
        while (node && node.nodeType !== 1) node = node.parentNode
        while (node) {
          if ((node as Element).tagName === 'A') { existingLink = node as HTMLAnchorElement; break }
          node = node.parentNode
        }
      }

      const currentUrl = existingLink ? existingLink.getAttribute('href') || '' : ''
      const currentTarget = existingLink ? existingLink.getAttribute('target') === '_blank' : true
      const currentColor = existingLink ? existingLink.style.color || '' : '#0D6B7E'
      const currentUnderline = existingLink ? existingLink.style.textDecoration !== 'none' : false
      const currentBold = existingLink ? existingLink.style.fontWeight === 'bold' || existingLink.style.fontWeight === '700' : false
      const currentFontSize = existingLink ? parseInt(existingLink.style.fontSize, 10) || 15 : 15

      const overlay = document.createElement('div')
      overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.4);z-index:9999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(2px);'

      const modal = document.createElement('div')
      modal.style.cssText = 'background:#fff;border-radius:16px;padding:24px;min-width:380px;max-width:440px;box-shadow:0 8px 32px rgba(0,0,0,0.2);font-family:Inter,Arial,sans-serif;'

      const labelStyle = 'display:block;font-size:12px;font-weight:600;color:#1F2937;margin-bottom:4px;'
      const inputStyle = 'width:100%;padding:8px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:13px;box-sizing:border-box;margin-bottom:12px;outline:none;font-family:Inter,sans-serif;transition:border-color 0.15s;'
      const toggleOn = 'display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:8px;cursor:pointer;font-size:16px;border:2px solid #0D6B7E;background:#E6F4F7;color:#0D6B7E;'
      const toggleOff = 'display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:8px;cursor:pointer;font-size:16px;border:1px solid #d1d5db;background:#fff;color:#9ca3af;'

      modal.innerHTML = `
        <div style="font-size:16px;font-weight:600;color:#1F2937;margin-bottom:16px;">
          ${existingLink ? 'Editar enlace' : 'Insertar enlace'}
        </div>
        <label style="${labelStyle}">URL</label>
        <input id="rte-link-url" type="text" value="${currentUrl}" placeholder="https://ejemplo.com" style="${inputStyle}" />
        <label style="${labelStyle}">Texto</label>
        <input id="rte-link-text" type="text" value="${existingLink ? existingLink.textContent : selectedText}" placeholder="Texto del enlace" style="${inputStyle}" />
        <label style="${labelStyle}">Estilo</label>
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:12px;flex-wrap:wrap;">
          <div id="rte-link-toggle-bold" style="${currentBold ? toggleOn : toggleOff}" title="Negrita"><b>B</b></div>
          <div id="rte-link-toggle-underline" style="${currentUnderline ? toggleOn : toggleOff}" title="Subrayado"><u>U</u></div>
          <div id="rte-link-toggle-italic" style="${existingLink && existingLink.style.fontStyle === 'italic' ? toggleOn : toggleOff}" title="Cursiva"><i>I</i></div>
          <div style="width:1px;height:28px;background:#e5e7eb;margin:0 4px;"></div>
          <input id="rte-link-color" type="color" value="${currentColor || '#0D6B7E'}" style="width:36px;height:36px;border:1px solid #d1d5db;border-radius:8px;cursor:pointer;padding:2px;" title="Color" />
          <select id="rte-link-fontsize" style="height:36px;padding:0 8px;border:1px solid #d1d5db;border-radius:8px;font-size:13px;cursor:pointer;outline:none;" title="Tamano de fuente">
            <option value="12" ${currentFontSize === 12 ? 'selected' : ''}>12px</option>
            <option value="14" ${currentFontSize === 14 ? 'selected' : ''}>14px</option>
            <option value="15" ${currentFontSize === 15 || !existingLink ? 'selected' : ''}>15px</option>
            <option value="16" ${currentFontSize === 16 ? 'selected' : ''}>16px</option>
            <option value="18" ${currentFontSize === 18 ? 'selected' : ''}>18px</option>
            <option value="20" ${currentFontSize === 20 ? 'selected' : ''}>20px</option>
          </select>
        </div>
        <div style="margin-bottom:12px;">
          <label style="font-size:13px;color:#5E6B78;cursor:pointer;display:flex;align-items:center;gap:6px;">
            <input type="checkbox" id="rte-link-blank" ${currentTarget ? 'checked' : ''} style="width:16px;height:16px;cursor:pointer;accent-color:#0D6B7E;" />
            Abrir en nueva pestana
          </label>
        </div>
        <label style="${labelStyle}">Vista previa</label>
        <div id="rte-link-preview" style="padding:12px 16px;border:1px solid #f3f4f6;border-radius:8px;margin-bottom:16px;background:#f9fafb;min-height:24px;"></div>
        <div style="display:flex;gap:8px;justify-content:flex-end;">
          ${existingLink ? '<button id="rte-link-remove" style="padding:8px 16px;border:1px solid #D9363E;background:#fff;color:#D9363E;border-radius:8px;cursor:pointer;font-size:13px;font-family:Inter,sans-serif;">Quitar enlace</button>' : ''}
          <button id="rte-link-cancel" style="padding:8px 16px;border:1px solid #d1d5db;background:#fff;color:#5E6B78;border-radius:8px;cursor:pointer;font-size:13px;font-family:Inter,sans-serif;">Cancelar</button>
          <button id="rte-link-ok" style="padding:8px 16px;border:none;background:#0D6B7E;color:#fff;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;font-family:Inter,sans-serif;">Aplicar</button>
        </div>`

      overlay.appendChild(modal)
      document.body.appendChild(overlay)

      modal.addEventListener('mousedown', (e: Event) => e.stopPropagation())
      modal.addEventListener('mouseup', (e: Event) => e.stopPropagation())
      modal.addEventListener('click', (e: Event) => e.stopPropagation())

      const urlInput = modal.querySelector('#rte-link-url') as HTMLInputElement
      urlInput.focus()

      const toggleState = {
        bold: currentBold,
        underline: currentUnderline,
        italic: existingLink ? existingLink.style.fontStyle === 'italic' : false,
      }

      const updatePreview = () => {
        const preview = modal.querySelector('#rte-link-preview')!
        const pText = (modal.querySelector('#rte-link-text') as HTMLInputElement).value || 'Texto de ejemplo'
        const pColor = (modal.querySelector('#rte-link-color') as HTMLInputElement).value
        const pSize = (modal.querySelector('#rte-link-fontsize') as HTMLSelectElement).value
        const s = [
          `color:${pColor}`,
          toggleState.underline ? 'text-decoration:underline' : 'text-decoration:none',
          toggleState.bold ? 'font-weight:bold' : 'font-weight:normal',
          toggleState.italic ? 'font-style:italic' : 'font-style:normal',
          `font-size:${pSize}px`,
        ].join(';')
        preview.innerHTML = `<a href="#" style="${s}" onclick="return false">${pText}</a>`
      }

      ;['bold', 'underline', 'italic'].forEach(key => {
        const btn = modal.querySelector(`#rte-link-toggle-${key}`)!
        btn.addEventListener('click', () => {
          ;(toggleState as any)[key] = !(toggleState as any)[key]
          ;(btn as HTMLElement).style.cssText = (toggleState as any)[key] ? toggleOn : toggleOff
          updatePreview()
        })
      })

      modal.querySelector('#rte-link-text')!.addEventListener('input', updatePreview)
      modal.querySelector('#rte-link-color')!.addEventListener('input', updatePreview)
      modal.querySelector('#rte-link-fontsize')!.addEventListener('change', updatePreview)
      updatePreview()

      const close = () => overlay.remove()
      overlay.addEventListener('mousedown', (e: Event) => { if (e.target === overlay) close() })
      modal.querySelector('#rte-link-cancel')!.addEventListener('click', close)

      const removeBtn = modal.querySelector('#rte-link-remove')
      if (removeBtn) {
        removeBtn.addEventListener('click', () => {
          if (existingLink) {
            const parent = existingLink.parentNode!
            while (existingLink.firstChild) parent.insertBefore(existingLink.firstChild, existingLink)
            parent.removeChild(existingLink)
          }
          close()
        })
      }

      modal.querySelector('#rte-link-ok')!.addEventListener('click', () => {
        const url = (modal.querySelector('#rte-link-url') as HTMLInputElement).value.trim()
        if (!url) { close(); return }

        const text = (modal.querySelector('#rte-link-text') as HTMLInputElement).value.trim() || url
        const blank = (modal.querySelector('#rte-link-blank') as HTMLInputElement).checked
        const color = (modal.querySelector('#rte-link-color') as HTMLInputElement).value
        const fontSize = (modal.querySelector('#rte-link-fontsize') as HTMLSelectElement).value

        const style = [
          color ? `color:${color}` : '',
          toggleState.underline ? 'text-decoration:underline' : 'text-decoration:none',
          toggleState.bold ? 'font-weight:bold' : '',
          toggleState.italic ? 'font-style:italic' : '',
          `font-size:${fontSize}px`,
        ].filter(Boolean).join(';')

        if (existingLink) {
          existingLink.setAttribute('href', url)
          existingLink.setAttribute('target', blank ? '_blank' : '_self')
          existingLink.style.cssText = style
          existingLink.textContent = text
        } else if (savedRange) {
          const iframeSel = doc.getSelection()
          iframeSel.removeAllRanges()
          iframeSel.addRange(savedRange)

          const a = doc.createElement('a')
          a.setAttribute('href', url)
          if (blank) a.setAttribute('target', '_blank')
          a.style.cssText = style
          a.textContent = text

          savedRange.deleteContents()
          savedRange.insertNode(a)
          savedRange.selectNodeContents(a)
          savedRange.collapse(false)
          iframeSel.removeAllRanges()
          iframeSel.addRange(savedRange)
        }

        close()
      })
    },
  })
}

// ── Code Editor Panel (from Axend CrmEmailEditor) ──
function registerCodeEditorCommand(ed: any) {
  ed.Commands.add('open-html-editor', {
    run: (ed: any) => {
      const editorEl = editorContainer.value
      if (!editorEl || editorEl.querySelector('.code-panel')) return

      const panel = document.createElement('div')
      panel.className = 'code-panel'
      panel.style.cssText = 'position:absolute;bottom:0;left:0;right:0;height:40%;background:#1e1e1e;z-index:10;display:flex;flex-direction:column;border-top:3px solid #0D6B7E;'

      const toolbar = document.createElement('div')
      toolbar.style.cssText = 'display:flex;align-items:center;padding:0 8px;background:#252526;min-height:32px;'

      const btnHtml = document.createElement('button')
      btnHtml.textContent = 'HTML'
      btnHtml.style.cssText = 'padding:4px 14px;border:none;cursor:pointer;font-size:12px;font-weight:bold;background:#0D6B7E;color:#fff;border-radius:3px 3px 0 0;margin-right:2px;'

      const btnCss = document.createElement('button')
      btnCss.textContent = 'CSS'
      btnCss.style.cssText = 'padding:4px 14px;border:none;cursor:pointer;font-size:12px;background:#3c3c3c;color:#ccc;border-radius:3px 3px 0 0;'

      const spacer = document.createElement('div')
      spacer.style.cssText = 'flex:1;'

      const closeBtn = document.createElement('button')
      closeBtn.innerHTML = '&times;'
      closeBtn.style.cssText = 'background:none;border:none;color:#ccc;font-size:18px;cursor:pointer;padding:0 8px;'
      closeBtn.title = 'Cerrar'
      closeBtn.onclick = () => ed.stopCommand('open-html-editor')

      toolbar.appendChild(btnHtml)
      toolbar.appendChild(btnCss)
      toolbar.appendChild(spacer)
      toolbar.appendChild(closeBtn)

      const textarea = document.createElement('textarea')
      textarea.style.cssText = "flex:1;width:100%;font-family:'Fira Code',Consolas,Monaco,monospace;font-size:13px;line-height:1.5;padding:12px;border:none;resize:none;tab-size:2;background:#1e1e1e;color:#d4d4d4;outline:none;"
      textarea.spellcheck = false
      textarea.value = ed.getHtml()

      let activeTab = 'html'
      let syncing = false
      let debounceTimer: ReturnType<typeof setTimeout> | null = null

      const setTab = (tab: string) => {
        activeTab = tab
        syncing = true
        textarea.value = tab === 'html' ? ed.getHtml() : ed.getCss()
        syncing = false
        btnHtml.style.background = tab === 'html' ? '#0D6B7E' : '#3c3c3c'
        btnHtml.style.color = tab === 'html' ? '#fff' : '#ccc'
        btnCss.style.background = tab === 'css' ? '#0D6B7E' : '#3c3c3c'
        btnCss.style.color = tab === 'css' ? '#fff' : '#ccc'
      }

      btnHtml.onclick = () => setTab('html')
      btnCss.onclick = () => setTab('css')

      textarea.onkeydown = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          e.preventDefault()
          const start = textarea.selectionStart
          const end = textarea.selectionEnd
          textarea.value = textarea.value.substring(0, start) + '  ' + textarea.value.substring(end)
          textarea.selectionStart = textarea.selectionEnd = start + 2
        }
      }

      textarea.oninput = () => {
        if (syncing) return
        if (debounceTimer) clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => {
          syncing = true
          if (activeTab === 'html') ed.setComponents(textarea.value)
          else ed.setStyle(textarea.value)
          syncing = false
        }, 600)
      }

      const onCanvasUpdate = () => {
        if (syncing) return
        syncing = true
        textarea.value = activeTab === 'html' ? ed.getHtml() : ed.getCss()
        syncing = false
      }
      ed.on('component:update', onCanvasUpdate)
      ed.on('component:add', onCanvasUpdate)
      ed.on('component:remove', onCanvasUpdate)

      ;(panel as any)._cleanup = () => {
        if (debounceTimer) clearTimeout(debounceTimer)
        ed.off('component:update', onCanvasUpdate)
        ed.off('component:add', onCanvasUpdate)
        ed.off('component:remove', onCanvasUpdate)
      }

      const gjsFrame = editorEl.querySelector('.gjs-frame-wrapper, .gjs-cv-canvas') as HTMLElement
      if (gjsFrame) gjsFrame.style.height = '60%'

      panel.appendChild(toolbar)
      panel.appendChild(textarea)
      editorEl.style.position = 'relative'
      editorEl.appendChild(panel)
    },
    stop: () => {
      const editorEl = editorContainer.value
      if (!editorEl) return
      const panel = editorEl.querySelector('.code-panel') as any
      if (panel) {
        if (panel._cleanup) panel._cleanup()
        panel.remove()
      }
      const gjsFrame = editorEl.querySelector('.gjs-frame-wrapper, .gjs-cv-canvas') as HTMLElement
      if (gjsFrame) gjsFrame.style.height = ''
    },
  })
}

// ── Upload trigger (from Axend CrmEmailEditor) ──
function triggerFileUpload() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) emit('upload-image', file)
  }
  input.click()
}

// ── Article Blocks ──
function registerArticleBlocks(ed: any) {
  const bm = ed.BlockManager

  bm.add('article-heading', {
    label: 'Titulo',
    category: 'Contenido',
    content: '<h2 style="font-family: Inter, sans-serif; font-size: 24px; font-weight: 700; color: #1F2937; margin: 0 0 16px;">Titulo de seccion</h2>',
    media: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 12h12M6 4h12"/></svg>',
  })

  bm.add('article-paragraph', {
    label: 'Parrafo',
    category: 'Contenido',
    content: '<p style="font-family: Inter, sans-serif; font-size: 15px; line-height: 1.7; color: #374151; margin: 0 0 16px;">Escribe aqui el contenido del articulo. Puedes usar <strong>negritas</strong>, <em>italicas</em> y <a href="#" style="color: #0D6B7E;">enlaces</a>.</p>',
    media: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h10"/></svg>',
  })

  bm.add('article-link', {
    label: 'Enlace / Boton',
    category: 'Contenido',
    content: '<a href="#" style="font-family: Inter, sans-serif; display: inline-block; padding: 10px 24px; background: #0D6B7E; color: #fff; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">Texto del enlace</a>',
    media: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>',
  })

  bm.add('article-quote', {
    label: 'Cita',
    category: 'Contenido',
    content: '<blockquote style="font-family: Inter, sans-serif; font-size: 16px; font-style: italic; color: #5E6B78; border-left: 4px solid #0D6B7E; padding: 12px 20px; margin: 24px 0; background: #F7F8F4;">Texto de la cita o hallazgo relevante.</blockquote>',
    media: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"/></svg>',
  })

  bm.add('article-image', {
    label: 'Imagen con pie',
    category: 'Contenido',
    content: `<figure style="margin: 24px 0; text-align: center;">
      <img src="https://placehold.co/800x400/E6F4F7/0D6B7E?text=Imagen" style="max-width: 100%; height: auto; border-radius: 12px;" />
      <figcaption style="font-family: Inter, sans-serif; font-size: 12px; color: #5E6B78; margin-top: 8px;">Descripcion de la imagen. Fuente: ...</figcaption>
    </figure>`,
    media: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
  })

  bm.add('article-callout', {
    label: 'Destacado',
    category: 'Contenido',
    content: `<div style="font-family: Inter, sans-serif; background: #E6F4F7; border: 1px solid rgba(13,107,126,0.2); border-radius: 12px; padding: 20px; margin: 24px 0;">
      <p style="font-size: 14px; font-weight: 600; color: #094E5C; margin: 0 0 8px;">Dato importante</p>
      <p style="font-size: 14px; color: #0D6B7E; margin: 0;">Los humedales artificiales pueden remover hasta un 80% de contaminantes.</p>
    </div>`,
    media: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
  })

  bm.add('article-divider', {
    label: 'Separador',
    category: 'Contenido',
    content: '<hr style="border: none; border-top: 1px solid #E5E7EB; margin: 32px 0;" />',
    media: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/></svg>',
  })

  bm.add('article-source', {
    label: 'Fuente / Referencia',
    category: 'Contenido',
    content: `<div style="font-family: Inter, sans-serif; font-size: 12px; color: #5E6B78; background: #F7F8F4; border-radius: 8px; padding: 12px 16px; margin: 24px 0;">
      <strong style="color: #1F2937;">Fuente:</strong> Autor, A. (2024). Titulo del articulo. <em>Revista</em>, Vol(Num), pp. <a href="#" style="color: #0D6B7E;">Enlace</a>
    </div>`,
    media: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>',
  })

  // Table blocks
  const cellStyle = 'padding:8px 12px;border:1px solid #e0e0e0;font-size:13px;color:#374151;font-family:Inter,sans-serif;'
  const headerStyle = 'padding:8px 12px;border:1px solid #e0e0e0;font-size:13px;font-weight:600;color:#1F2937;background:#E6F4F7;font-family:Inter,sans-serif;'
  const tableStyle = 'width:100%;border-collapse:collapse;'

  bm.add('table-2col', {
    label: 'Tabla 2 columnas',
    category: 'Tablas',
    content: `<table style="${tableStyle}">
      <tr><td style="${headerStyle}">Encabezado</td><td style="${headerStyle}">Valor</td></tr>
      <tr><td style="${cellStyle}">Campo 1</td><td style="${cellStyle}">Valor 1</td></tr>
      <tr><td style="${cellStyle}">Campo 2</td><td style="${cellStyle}">Valor 2</td></tr>
    </table>`,
    media: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M12 3v18"/></svg>',
  })

  bm.add('table-3col', {
    label: 'Tabla 3 columnas',
    category: 'Tablas',
    content: `<table style="${tableStyle}">
      <tr><td style="${headerStyle}">Columna 1</td><td style="${headerStyle}">Columna 2</td><td style="${headerStyle}">Columna 3</td></tr>
      <tr><td style="${cellStyle}">Dato 1</td><td style="${cellStyle}">Dato 2</td><td style="${cellStyle}">Dato 3</td></tr>
      <tr><td style="${cellStyle}">Dato 4</td><td style="${cellStyle}">Dato 5</td><td style="${cellStyle}">Dato 6</td></tr>
    </table>`,
    media: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18M15 3v18"/></svg>',
  })

  bm.add('table-detail', {
    label: 'Tabla detalle',
    category: 'Tablas',
    content: `<table style="${tableStyle}">
      <tr><td colspan="2" style="${headerStyle}text-align:center;">Detalles</td></tr>
      <tr><td style="${cellStyle}font-weight:bold;width:40%;">Parametro</td><td style="${cellStyle}">Valor</td></tr>
      <tr><td style="${cellStyle}font-weight:bold;">Tipo</td><td style="${cellStyle}">Descripcion</td></tr>
      <tr><td style="${cellStyle}font-weight:bold;">Estado</td><td style="${cellStyle}">Activo</td></tr>
    </table>`,
    media: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M10 3v18"/></svg>',
  })
}

// ── Initialize Editor (dynamic import like Axend CrmEmailEditor) ──
async function initEditor() {
  if (typeof window === 'undefined') return

  try {
    const [grapejsMod, presetMod] = await Promise.all([
      import('grapesjs'),
      import('grapesjs-preset-webpage'),
    ])

    // Load CSS dynamically (like Axend)
    if (!document.getElementById('grapesjs-css')) {
      const link = document.createElement('link')
      link.id = 'grapesjs-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/grapesjs@0.22.14/dist/css/grapes.min.css'
      document.head.appendChild(link)
    }

    const gjs = grapejsMod.default || grapejsMod
    const gjsPreset = presetMod.default || presetMod

    editor = gjs.init({
      container: editorContainer.value,
      height: '100%',
      width: 'auto',
      fromElement: false,
      storageManager: false,

      plugins: [gjsPreset],
      pluginsOpts: {
        [gjsPreset]: {
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

    // Cell type extension: double-click → RTE activation (from Axend CrmEmailEditor)
    editor.DomComponents.addType('cell', {
      extendView: 'text',
      model: {
        defaults: {
          editable: true,
          droppable: true,
        },
      },
    })

    // Inject styles into canvas iframe
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

    // Constrain images when inserted or dropped (from Axend)
    editor.on('component:add', (model: any) => {
      if (model.get('type') === 'image') {
        const style = model.getStyle() || {}
        if (!style['max-width']) {
          model.addStyle({ 'max-width': '100%', height: 'auto' })
        }
      }
    })

    // Register all controls and blocks
    registerRteControls(editor)
    registerCodeEditorCommand(editor)
    registerArticleBlocks(editor)

    // Rename preset-webpage block categories to Spanish
    const categoryMap: Record<string, string> = {
      'Basic': 'Estructura',
      'Extra': 'Extra',
    }
    const blockLabelMap: Record<string, string> = {
      'column1': '1 columna',
      'column2': '2 columnas',
      'column3': '3 columnas',
      'text': 'Texto',
      'link': 'Enlace',
      'image': 'Imagen',
      'video': 'Video',
      'map': 'Mapa',
    }
    editor.BlockManager.getAll().each((block: any) => {
      const cat = block.getCategoryLabel?.() || block.get('category')
      if (typeof cat === 'string' && categoryMap[cat]) {
        block.set('category', categoryMap[cat])
      }
      const id = block.get('id')
      if (blockLabelMap[id]) {
        block.set('label', blockLabelMap[id])
      }
    })

    // Remove duplicate export-template button from preset
    editor.Panels.removeButton('options', 'export-template')

    // Tooltips en español para todos los botones del toolbar
    const tooltipMap: Record<string, string> = {
      'sw-visibility': 'Mostrar/ocultar bordes de componentes',
      'preview': 'Vista previa sin paneles',
      'fullscreen': 'Pantalla completa',
      'gjs-open-import-webpage': 'Importar codigo HTML',
    }
    const optionsPanel = editor.Panels.getPanel('options')
    if (optionsPanel) {
      optionsPanel.get('buttons').each((btn: any) => {
        const tip = tooltipMap[btn.get('id')]
        if (tip) btn.set('attributes', { ...btn.get('attributes'), title: tip })
      })
    }

    const deviceTooltips: Record<string, string> = {
      'set-device-desktop': 'Escritorio',
      'set-device-tablet': 'Tablet (768px)',
      'set-device-mobile': 'Movil (375px)',
    }
    const devicesPanel = editor.Panels.getPanel('devices-c')
    if (devicesPanel) {
      devicesPanel.get('buttons').each((btn: any) => {
        const tip = deviceTooltips[btn.get('id')]
        if (tip) btn.set('attributes', { ...btn.get('attributes'), title: tip })
      })
    }

    const viewTooltips: Record<string, string> = {
      'open-sm': 'Estilos del elemento seleccionado',
      'open-layers': 'Capas (estructura del documento)',
      'open-blocks': 'Bloques para arrastrar al editor',
      'open-tm': 'Configuracion del componente',
    }
    const viewsPanel = editor.Panels.getPanel('views')
    if (viewsPanel) {
      viewsPanel.get('buttons').each((btn: any) => {
        const tip = viewTooltips[btn.get('id')]
        if (tip) btn.set('attributes', { ...btn.get('attributes'), title: tip })
      })
    }

    // Boton editor de codigo HTML/CSS
    editor.Panels.addButton('options', {
      id: 'edit-html',
      label: '&lt;/&gt;',
      command: 'open-html-editor',
      active: false,
      togglable: true,
      attributes: { title: 'Editar codigo HTML y CSS directamente' },
    })

    // Boton subir imagen en asset manager
    editor.on('asset:open', () => {
      nextTick(() => {
        const amEl = document.querySelector('.gjs-am-assets-header')
        if (amEl && !amEl.querySelector('.editor-upload-btn')) {
          const btn = document.createElement('button')
          btn.className = 'editor-upload-btn'
          btn.innerHTML = '+ Subir imagen'
          btn.style.cssText = 'background:#0D6B7E;color:#fff;border:none;border-radius:4px;padding:8px 16px;cursor:pointer;font-size:13px;margin:8px 0;'
          btn.onclick = () => triggerFileUpload()
          amEl.appendChild(btn)
        }
        const amContainer = document.querySelector('.gjs-am-file-uploader')
        if (amContainer && !amContainer.querySelector('.editor-upload-btn')) {
          const btn = document.createElement('button')
          btn.className = 'editor-upload-btn'
          btn.innerHTML = '+ Subir imagen'
          btn.style.cssText = 'background:#0D6B7E;color:#fff;border:none;border-radius:4px;padding:8px 16px;cursor:pointer;font-size:13px;margin:8px;'
          btn.onclick = () => triggerFileUpload()
          amContainer.appendChild(btn)
        }
      })
    })

    // Load content
    if (props.editorData) {
      editor.loadProjectData(props.editorData)
    } else if (props.htmlContent) {
      editor.setComponents(props.htmlContent)
      if (props.cssContent) editor.setStyle(props.cssContent)
    }

    loading.value = false
    emit('ready', editor)
  } catch (err) {
    console.error('Error initializing GrapesJS:', err)
    loading.value = false
  }
}

onMounted(() => {
  initEditor()
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
  position: relative;
}
.editor-canvas {
  height: 600px;
}
.editor-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: #f9fafb;
  z-index: 1;
}
.editor-loading span {
  color: #5E6B78;
  font-size: 0.875rem;
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
