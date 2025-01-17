<script setup lang="ts">
import type { AsyncDataRequestStatus } from 'nuxt/app'
import type { FetchError } from 'ofetch'

const props = withDefaults(defineProps<{
  status: AsyncDataRequestStatus
  refresh?: () => Promise<void>
  error?: FetchError | null
  loadingIcon?: string
  loadingTitle?: string
  loadingDescription?: string
  errorIcon?: string
  errorTitle?: string
  errorDescription?: string
}>(), {
  loadingTitle: 'Loading',
  errorTitle: 'Error',
})

watch(() => props.error, () => {
  if (props.error)
    console.error(props.error)
})
</script>

<template>
  <neb-loading-state
    v-if="props.status === 'pending'"
    :icon="props.loadingIcon"
    :title="props.loadingTitle"
    :description="props.loadingDescription"
  >
    <slot name="loading" />
  </neb-loading-state>

  <neb-error-state
    v-else-if="props.status === 'error'"
    :icon="props.errorIcon"
    :title="props.errorTitle"
    :description="props.errorDescription"
  >
    <slot name="error">
      <neb-button v-if="props.refresh" destructive @click="props.refresh()">
        <icon name="material-symbols:refresh-rounded" />
        {{ $t('nebula.state-content.error.refresh') }}
      </neb-button>
    </slot>
  </neb-error-state>

  <slot v-else />
</template>
