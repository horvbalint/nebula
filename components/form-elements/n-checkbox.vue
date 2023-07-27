<script lang="ts">
export default {
  props: {
    value: { type: String },
    modelValue: {
      default: false,
      type: [Boolean, Array],
    },
    trueValue: { default: true },
    falseValue: { default: false },
  },
  emits: ['update:modelValue'],
  data() {
    return {

    }
  },
  computed: {
    isChecked() {
      if (Array.isArray(this.modelValue))
        return this.modelValue.includes(this.value)

      return this.modelValue === this.trueValue
    },
  },
  methods: {
    handleChange(event: Event) {
      const checkbox = event.target! as HTMLInputElement
      const isInputChecked = checkbox.checked

      if (Array.isArray(this.$props.modelValue)) {
        const newValue = [...this.$props.modelValue]

        if (isInputChecked)
          newValue.push(this.$props.value)
        else
          newValue.splice(newValue.indexOf(this.$props.value), 1)

        this.$emit('update:modelValue', newValue)
      }
      else {
        this.$emit('update:modelValue', isInputChecked ? this.$props.trueValue : this.$props.falseValue)
      }
    },
  },
}
</script>

<template>
  <label class="container">
    <slot />
    <input
      type="checkbox"
      :checked="isChecked"
      :value="value"
      @change="handleChange($event)"
    >
    <span class="checkmark" />
  </label>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  position: relative;
  padding-left: 24px;
  height: 17px;
  font-weight: 500;
  align-items: center;
  cursor: pointer;
  font-size: $text-xs;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 16px;
  width: 16px;
  background-color: #fff;
  border: 1px solid $neutral-color-300;
  border-radius: $radius-small;
}
.container:hover input ~ .checkmark {
  background: $primary-color-100;
  border-color: $primary-color-600;
  transition: all $duration-default;
}
.container:focus-within input ~ .checkmark {
  background: #fff;
  border-color: $primary-color-300;
  box-shadow: $primary-focus-shadow;
  transition: all $duration-default;
}
.container input:checked ~ .checkmark {
  background: $primary-color-50;
  border-color: $primary-color-600;
  transition: all $duration-default;
}
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}
.container input:checked ~ .checkmark:after {
  display: block;
}
.container .checkmark:after {
  left: 4px;
  top: 0px;
  width: 4px;
  height: 9px;
  border: solid $primary-color-600;
  border-width: 0 2px 2px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>
