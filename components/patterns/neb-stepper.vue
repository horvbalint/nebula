<script lang="ts" setup>
export interface Step {
  title: string
  text?: string
  unfinished?: boolean
  icon?: string
}

const props = withDefaults(defineProps<{
  modelValue: number
  steps: Step[]
  vertical?: boolean
  skippable?: boolean
  hasLine?: boolean
}>(), {
  vertical: false,
})

const emit = defineEmits(['update:modelValue'])

function isDone(index: number) {
  return props.modelValue > index
}
function hasWarning(step: Step, index: number) {
  return step.unfinished && props.modelValue > index
}
function handleClick(index: number) {
  if (!props.skippable)
    return

  emit('update:modelValue', index)
}

watch(() => props.modelValue, () => {
  if (props.modelValue >= props.steps.length - 1)
    return emit('update:modelValue', props.steps.length - 1)

  if (props.modelValue < 0)
    return emit('update:modelValue', 0)
})
</script>

<template>
  <ul class="neb-stepper" :class="{ vertical: $props.vertical }">
    <li
      v-for="(step, index) in $props.steps"
      :key="step.title"
      class="step"
      :class="{
        active: modelValue === index,
        done: isDone(index),
        unfinished: hasWarning(step, index),
      }"
    >
      <div class="step-progress">
        <div class="circle">
          <template v-if="!hasWarning(step, index)">
            <icon v-if="props.modelValue <= index" class="circle-icon" :name="step.icon || 'octicon:circle-icon-fill-24'" />
            <icon v-else class="check" name="mdi:check-bold" />
          </template>

          <icon v-else class="unfinished" name="mdi:exclamation-thick" />
        </div>

        <hr v-if="index !== steps.length - 1">
      </div>

      <div class="step-text">
        <div class="step-texts" :class="{ 'step-text-hover-wrapper': skippable }" @click="handleClick(index)">
          <h6>{{ step.title }}</h6>
          <p>{{ step.text }}</p>
        </div>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.neb-stepper {
  width: 100%;
  flex: 1;
  list-style: none;
  margin: 0;
  padding: 0;

  display: flex;
  align-items: flex-start;
}
.step {
  flex: 1;
  display: flex;
  gap: var(--space-2);
  flex-direction: column;
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
    }
    .step-progress hr {
      background-position: 0;
    }
  }
  &.unfinished {
    .circle {
      background: var(--warning-color-50);
      border-color: var(--warning-color);

      .icon {
        color: var(--warning-color);
      }
    }
    .step-progress {
      hr {
        background-image: linear-gradient(90deg, var(--warning-color) 50%, var(--neutral-color-200) 50%);
      }
    }
    .step-text {
      h6 {
        color: var(--warning-color);
      }
      p {
        color: var(--warning-color-400);
      }
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
    display: block;
    margin-right: -50%;
    width: 100%;
    border: none;
    height: 2px;
    background-image: linear-gradient(90deg, var(--primary-color) 50%, var(--neutral-color-200) 50%);
    background-position: 100%;
    background-size: 200% 100%;
    transition: all var(--duration-default);
  }
}
.circle {
  height: 36px;
  width: 36px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  flex-shrink: 0;
  flex-grow: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: var(--radius-default);
  border: 1px solid var(--neutral-color-200);
  transition: all var(--duration-slow);

  .icon {
    width: 20px;
    height: 20px;
    color: var(--neutral-color-500);
  }
}
.step-text {
  padding: 0 var(--space-4);

  .step-text-hover-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-default);
    cursor: pointer;

    &:hover {
      background: var(--neutral-color-100);
    }
  }
  h6 {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--neutral-color-700);
    transition: all var(--duration-slow);
  }
  p {
    font-size: var(--text-sm);
    font-weight: 400;
    color: var(--neutral-color-600);
    transition: all var(--duration-slow);
  }
}
.step-texts {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.vertical {
  flex-direction: column;

  .step {
    flex-direction: row;
    align-items: stretch;
    text-align: left;

    &:last-child .step-text {
      padding-bottom: 0;
    }
  }
  .step-progress {
    height: auto;
    width: 32px;
    flex-direction: column;
    justify-content: flex-start;

    .circle {
      position: static;
      transform: none;
    }
    hr {
      margin-right: 0;
      height: 100%;
      width: 2px;
    }
  }
  .step-text {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: var(--space-1);
    padding-bottom: var(--space-4);
    padding-left: var(--space-1);
  }
}

.dark-mode {
  .step {
    .circle {
      background: var(--neutral-color-950);
      border-color: var(--neutral-color-700);

      .circle-icon {
        color: var(--neutral-color-700);
      }
    }
    &.done {
      .step-progress hr {
        background-position: 0;
      }
      .circle {
        background: var(--primary-color-950);
        border-color: var(--primary-color-800);
      }
    }
    &.active .circle {
      background: var(--primary-color-950);
      box-shadow: none;
      border-color: var(--primary-color-800);

      .circle-icon {
        color: var(--primary-color-500);
      }
    }
    .step-text {
      .step-text-hover-wrapper {
        &:hover {
          background: var(--neutral-color-900);
        }
      }
      h6 {
        color: var(--neutral-color-300);
      }
      p {
        color: var(--neutral-color-400);
      }
    }
    .step-progress {
      hr {
        background-image: linear-gradient(90deg, var(--primary-color) 50%, var(--neutral-color-900) 50%);
      }
    }
  }
}
</style>
