<script lang="ts">
type KeyType = string | number | symbol

type OptionLike<TrackByKey extends KeyType, LabelKey extends KeyType> = {
  [x in TrackByKey | LabelKey]: KeyType;
}
</script>

<script
  setup
  lang="ts"
  generic="
    TrackByKey extends KeyType,
    LabelKey extends KeyType,
    Option extends OptionLike<TrackByKey, LabelKey> | KeyType
  "
>
const props = defineProps<{
  options: Option[]
  labelKey?: LabelKey
  trackByKey?: TrackByKey
  label?: string
}>()

const processedOptions = computed(() => {
  return props.options.map(option => ({
    trackValue: getValue(option, props.trackByKey),
    labelValue: getValue(option, props.labelKey),
    option,
  }))
})

function getValue(option: Option, key?: TrackByKey | LabelKey) {
  if (typeof option === 'string' || typeof option === 'number' || typeof option === 'symbol')
    return option
  else
    return (option as OptionLike<TrackByKey, LabelKey>)[key!]
}

const input = ref<HTMLInputElement | null>(null)
</script>

<template>
  <neb-dropdown class="neb-select">
    <template #trigger="{ open }">
      <div class="neb-select-temp" @click="input!.focus()">
        <label v-if="label">{{ label }}</label>

        <div class="neb-select-input">
          <input ref="input" @focus="open()">
        </div>
      </div>
    </template>

    <template #content>
      <ul class="neb-overlay-transition">
        <li v-for="processedOption in processedOptions" :key="processedOption.trackValue">
          <slot :option="processedOption.option">
            {{ processedOption.labelValue }}
          </slot>
        </li>
      </ul>
    </template>
  </neb-dropdown>
</template>

<style scoped>
</style>
