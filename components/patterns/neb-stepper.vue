<script lang="ts" setup>
interface Step {
  title: string
  text?: string
}

const props = defineProps<{
  modelValue: number
  steps: Step[]
}>()

const emit = defineEmits(['update:modelValue'])

function isDone(index: number) {
  return props.modelValue > index
}

watch(() => props.modelValue, () => {
  if (props.modelValue >= props.steps.length - 1)
    return emit('update:modelValue', props.steps.length - 1)

  if (props.modelValue <= 0)
    return emit('update:modelValue', 0)
})
</script>

<template>
  <div class="neb-stepper">
    <ul class="steps-wrapper">
      <li
        v-for="(step, index) in steps"
        :key="step.title"
        class="step"
        :class="{
          active: modelValue === index,
          done: isDone(index),
        }"
      >
        <div class="step-progress">
          <div class="circle">
            <icon class="check" name="mdi:check-bold" />
            <icon class="dot" name="octicon:dot-fill-24" />
          </div>

          <hr v-if="index !== steps.length - 1">
        </div>

        <div class="step-text">
          <h6>{{ step.title }}</h6>
          <p>{{ step.text }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.neb-stepper {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}
.steps-wrapper {
  width: 100%;
  list-style: none;
  margin: 0;
  padding: 0;

  display: flex;
  align-items: flex-start;
}
.step {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  align-items: center;
  text-align: center;

  &.active {
    .circle {
      border-color: var(--primary-color);
      background: var(--primary-color-50);
      box-shadow: var(--primary-focus-shadow-light);

      .icon {
        color: var(--primary-color);
      }
    }
    .step-text {
      h6 {
        color: var(--primary-color-700);
      }
      p {
        color: var(--primary-color-600);
      }
    }
  }
  &.done {
    .circle {
      border-color: var(--primary-color);
      background: var(--primary-color-50);

      .icon {
        color: var(--primary-color);
      }
      .check {
        display: block;
      }
      .dot {
        display: none;
      }
    }
    .step-progress hr {
      background-position: 0;
    }
  }
}
.step-progress {
  height: 32px;
  position: relative;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  hr {
    margin-right: -50%;
    width: 100%;
    border: none;
    height: 2px;
    background: linear-gradient(90deg, var(--primary-color) 50%, var(--neutral-color-200) 50%);
    background-position: 100%;
    background-size: 200% 100%;
    transition: all var(--duration-default);
  }
}
.circle {
  height: 32px;
  width: 32px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  flex-shrink: 0;
  flex-grow: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--white-color);
  border-radius: 50%;
  border: 2px solid var(--neutral-color-200);
  transition: all var(--duration-slow);

  .icon {
    width: 20px;
    height: 20px;
    color: var(--neutral-color-200);
  }
  .check {
    display: none;
  }
  .dot {
    display: block;
  }
}
.step-text {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);

  h6 {
    font-size: var(--text-md);
    font-weight: 600;
    color: var(--neutral-color-700);
    transition: all var(--duration-slow);
  }
  p {
    font-size: var(--text-md);
    font-weight: 400;
    color: var(--neutral-color-600);
    transition: all var(--duration-slow);
  }
}
</style>
