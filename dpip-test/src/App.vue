<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const pipWindow = ref<Window | null>(null)
let onVisibilityChange: (() => void) | null = null

const supportsDocumentPip = computed(
  () => Boolean(window.documentPictureInPicture && window.documentPictureInPicture.requestWindow),
)

async function openDocumentPip() {
  if (!supportsDocumentPip.value) return
  if (pipWindow.value && !pipWindow.value.closed) return

  const win = await window.documentPictureInPicture!.requestWindow({
    width: 420,
    height: 220,
  })
  pipWindow.value = win

  const onClose = () => {
    pipWindow.value = null
  }
  win.addEventListener('pagehide', onClose, { once: true })
  win.addEventListener('unload', onClose, { once: true })

  win.document.title = 'DPIP TEST'
  win.document.body.style.margin = '0'

  const root = win.document.createElement('div')
  root.style.height = '100vh'
  root.style.display = 'grid'
  root.style.placeItems = 'center'
  root.style.background = '#0b1020'
  root.style.color = '#ffffff'
  root.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
  root.style.fontSize = '40px'
  root.style.fontWeight = '800'
  root.style.letterSpacing = '0.08em'

  const text = win.document.createElement('div')
  text.textContent = 'DPIP TEST'
  root.append(text)

  win.document.body.replaceChildren(root)
}

function closeDocumentPip() {
  if (!pipWindow.value) return
  try {
    pipWindow.value.close()
  } finally {
    pipWindow.value = null
  }
}

onMounted(() => {
  onVisibilityChange = () => {
    if (document.hidden) {
      void openDocumentPip().catch(() => {
        // Browsers may require a user gesture to open Document PiP.
      })
      return
    }

    closeDocumentPip()
  }

  document.addEventListener('visibilitychange', onVisibilityChange)
})

onBeforeUnmount(() => {
  if (onVisibilityChange) {
    document.removeEventListener('visibilitychange', onVisibilityChange)
    onVisibilityChange = null
  }
  closeDocumentPip()
})
</script>

<template>
  <main class="page" :data-supported="supportsDocumentPip ? 'yes' : 'no'">
    <div class="title">DPIP TEST</div>
  </main>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: radial-gradient(1200px 700px at 20% 10%, #24335a 0%, #0b1020 55%, #070a14 100%);
  color: #ffffff;
}

.title {
  font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  font-size: clamp(56px, 10vw, 120px);
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
</style>
