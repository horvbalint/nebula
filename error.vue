<script lang="ts" setup>
import type { NuxtError } from 'nuxt/app'

defineProps<{
  error: NuxtError
}>()

const appConfig = useAppConfig()
const router = useRouter()

function goBack() {
  history.back()
}
function goHome() {
  router.push(appConfig.nebula.homePath)
}
</script>

<template>
  <div class="error-page">
    <span class="status-code" :class="{ error: error.statusCode !== 404 }">{{ error.statusCode }}</span>

    <div class="error-page-content">
      <div class="error-text">
        <h1>{{ error?.message }}</h1>
        <p>There was an error while rendering this page.</p>
      </div>

      <footer>
        <neb-button type="secondary-neutral" @click="goBack()">
          <icon name="material-symbols:arrow-back-rounded" />
          Go back
        </neb-button>

        <neb-button @click="goHome()">
          Go home
        </neb-button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.error-page-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-12);
  width: 100%;
}
.error-text {
  max-width: 80%;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  text-align: center;

  h1 {
    font-size: var(--title-lg);
    color: var(--neutral-color-900);
  }
  p {
    font-size: var(--text-xl);
    color: var(--neutral-color-600);
  }
}
.status-code {
  z-index: -1;
  position: fixed;
  font-size: 500px;
  font-weight: 600;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--neutral-color-100);

  &.error {
    color: var(--error-color-100);
  }
}
footer {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.dark-mode {
  .status-code {
    color: var(--neutral-color-900);

    &.error {
      color: var(--error-color-950);
    }
  }
  .error-text {
    h1 {
      color: var(--neutral-color-100);
    }
    p {
      color: var(--neutral-color-400);
    }
  }
}

@media (--tablet-viewport) {
  .status-code {
    top: 8%;
    transform: translate(-50%, 0);
    font-size: 150px;
    color: var(--neutral-color-200);
  }
  .error-text {
    text-align: center;
    max-width: 90%;
    gap: var(--space-4);

    h1 {
      font-size: var(--title-xs);
    }
    p {
      font-size: var(--text-md);
    }
  }
}
</style>
