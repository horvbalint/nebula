<script lang="ts">
export default defineNuxtComponent({
  inheritAttrs: false,
  props: {
    leadingIcon: {
      type: String,
    },
    modelValue: {
      type: [String, Number],
      required: true,
    },
    trailingIcon: {
      type: String,
    },
    label: {
      type: String,
    },
    hint: {
      type: String,
    },
  },
  emits: ['update:modelValue', 'validate'],
  data() {
    return {
      errors: [] as (keyof ValidityState)[],
      errorDict: new Map<keyof ValidityState, string>([
        ['badInput', 'Hibás érték!'],
        ['patternMismatch', 'A mező nem megfelelő formátumú!'],
        ['rangeOverflow', 'A beírt érték túl nagy!'],
        ['rangeUnderflow', 'A beírt érték túl alacsony!'],
        ['stepMismatch', 'A lépésköz nem megfelelő!'],
        ['tooLong', 'A beírt szöveg túl hosszú!'],
        ['tooShort', 'A beírt szöveg túl rövid!'],
        ['typeMismatch', 'A mező nem megfelelő formátumú!'],
        ['valueMissing', 'A mező kitöltése kötelező!'],
      ]),
    }
  },
  computed: {
    computedLeadingIcon(): string | undefined {
      switch (this.$attrs.type) {
        case 'email': return 'material-symbols:mail-outline-rounded'
        case 'password': return 'material-symbols:key-outline-rounded'
        default: return this.$props.leadingIcon
      }
    },
  },
  methods: {
    handleInput(event: Event) {
      const input = event.target as HTMLInputElement
      this.$emit('update:modelValue', input.value)
    },
    checkValidity() {
      this.errors = []

      const input = this.$refs.input as HTMLInputElement
      const validity = input.validity

      let key: keyof ValidityState
      for (key in validity) {
        if (key === 'valid' || this.errors.includes(key))
          continue

        if (validity[key])
          this.errors.push(key)
      }

      this.$emit('validate', this.errors)
    },
  },
})
</script>

<template>
  <div class="ut-input-component">
    <label>
      <span>{{ label }} <span v-if="$attrs.required" class="required-star">*</span></span>

      <div class="ut-input" :class="{ 'has-error': errors.length }">
        <slot name="leading">
          <icon v-if="computedLeadingIcon" :name="computedLeadingIcon" />
        </slot>

        <input
          ref="input"
          v-bind="$attrs"
          :value="modelValue"
          @input="handleInput($event)"
          @blur="checkValidity()"
        >

        <slot name="trailing">
          <icon
            v-if="errors.length"
            name="material-symbols:error-outline-rounded"
            color="#F04438"
          />

          <icon v-else-if="trailingIcon" :name="trailingIcon" />
        </slot>
      </div>

      <p v-if="hint" class="hint">{{ hint }}</p>

      <ul v-if="errors.length" class="error-list">
        <li v-for="error in errors" :key="error">{{ errorDict.get(error) }}</li>
      </ul>
    </label>
  </div>
</template>

<style lang="scss" scoped>
.ut-input-component {
  width: 100%;
}
label {
  display: flex;
  flex-direction: column;
  gap: $space-xs;
  font-size: $text-sm;
  font-weight: 500;
  width: 100%;
}
.required-star {
  color: $error-color-500;
}
.ut-input {
  background: #fff;
  display: flex;
  align-items: center;
  gap: $space-xxs;
  padding: $space-xs $space-xss;
  height: 40px;
  border-radius: $radius-default;
  border: 1px solid $neutral-color-300;
  transition: all $duration-default;

  &.has-error {
    border-color: $error-color-300;

    &:focus-within {
      box-shadow: $error-focus-shadow;
      border-color: $error-color-300;
    }
  }
  &:focus-within {
    border-color: $primary-color-300;
    box-shadow: $primary-focus-shadow;
  }
  input {
    flex: 1;
    border: none;
    background: inherit;
    height: 100%;
    font-size: $text-sm;
    outline: none;
    color: $neutral-color-900;
  }
  input:-webkit-autofill,
  input:-webkit-autofill:focus {
    -webkit-box-shadow:0 0 0 50px white inset; /* Change the color to your own background color */
  }
  .icon {
    color: $neutral-color-600;
  }
}
.hint {
  font-size: $text-xs;
  color: $neutral-color-600;
  font-weight: 400;
}
.error-list {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: $space-xxs;

  li {
    color: $error-color-500;
    font-size: $text-xs;
    font-weight: 400;
  }
}
</style>
