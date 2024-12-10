<script lang="ts" setup>
const modelValue = defineModel<string>({
  required: true,
})
</script>

<template>
  <neb-input v-model="modelValue" leading-icon="material-symbols:search-rounded" :placeholder="$t('nebula.neb-search-input.placeholder')">
    <template #trailing>
      <neb-button v-if="modelValue" type="link-neutral" @click.stop="modelValue = ''">
        <icon name="material-symbols:close-rounded" />
      </neb-button>
    </template>
  </neb-input>
</template>
