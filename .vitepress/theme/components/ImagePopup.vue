<template>
  <div class="image-popup">
    <!-- Thumbnail -->
    <img
      :src="src"
      :alt="alt"
      class="thumbnail"
      loading="lazy"
      @click="open = true"
    />

    <!-- Fullscreen overlay -->
    <Teleport to="body">
      <div
        v-if="open"
        class="overlay"
        role="dialog"
        aria-modal="true"
        :aria-label="alt || 'Screenshot'"
        @click.self="open = false"
      >
        <div class="image-wrapper">
          <button
            class="close-btn"
            aria-label="Close"
            @click="open = false"
          >✕</button>

          <img :src="src" :alt="alt" class="popup-image" />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref, watch } from 'vue';

defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: '' },
});

const open = ref(false);

/**
 * Esc closes the lightbox, and the page behind it must not scroll while it is
 * open — otherwise dismissing the overlay leaves the reader somewhere else.
 */
function onKeydown(event) {
  if (event.key === 'Escape') {
    open.value = false;
  }
}

watch(open, (isOpen) => {
  if (typeof document === 'undefined') {
    return;
  }

  document.body.style.overflow = isOpen ? 'hidden' : '';

  if (isOpen) {
    document.addEventListener('keydown', onKeydown);
  } else {
    document.removeEventListener('keydown', onKeydown);
  }
});

onBeforeUnmount(() => {
  if (typeof document === 'undefined') {
    return;
  }

  document.body.style.overflow = '';
  document.removeEventListener('keydown', onKeydown);
});
</script>

<style scoped>
.image-popup {
  margin: 20px 0;
}

.thumbnail {
  cursor: zoom-in;
  max-width: 100%;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  transition: border-color 0.25s;
}

.thumbnail:hover {
  border-color: var(--vp-c-brand-1);
}

.overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: grid;
  place-items: center;
  padding: 32px;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
}

.image-wrapper {
  position: relative;
  max-width: 100%;
  max-height: 100%;
}

.popup-image {
  display: block;
  max-width: 100%;
  max-height: calc(100vh - 64px);
  border-radius: 10px;
  box-shadow: 0 24px 60px -20px rgba(0, 0, 0, 0.6);
}

.close-btn {
  position: absolute;
  top: -14px;
  right: -14px;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 15px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.close-btn:hover {
  background: var(--vp-c-brand-1);
  color: #fff;
}

@media (max-width: 640px) {
  .overlay {
    padding: 16px;
  }

  .close-btn {
    top: -12px;
    right: -6px;
  }
}
</style>
