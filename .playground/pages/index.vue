<script setup lang="ts">
import type { UseFloatingOptions } from '@floating-ui/vue'

definePageMeta({
  name: 'Fő oldal',
  nebula: {
    skipFromMenu: false
  }
})

const hello = ref('')
const username = ref('')
const email = ref('')
const password = ref('')
const checkbox = ref(false)
const popUpOpen = ref(false)
const popUp2 = ref(false)
const expand = ref(false)
const isValid = ref(false)
const errors = ref(null)
const hide = ref(false)

const floatingOptions: UseFloatingOptions = {
  placement: 'bottom-start'
}

const menus = [
  {
    text: 'View profile',
    icon: 'material-symbols:edit-outline-rounded',
    callback: () => console.log('edit'),
  },
  {
    text: 'Settings',
    icon: 'material-symbols:ios-share-rounded',
    callback: () => console.log('share')
  },
  {
    text: 'Keyboard shortcuts',
    icon: 'material-symbols:delete-outline-rounded',
    callback: () => console.log('delete'),
    segment: true,
  }
]

const numbers = [1, 5, 10, 30, 50]
</script>

<template>
  <div class="experiments">
    <neb-select
      :options="menus"
      track-by-key="text"
      label-key="icon"
      label="Test select"
    />

    <neb-radio-button v-model="hello" value="cacac" label="First option"/>
    <neb-radio-button v-model="hello" value="vava" label="Second option"/>
    <neb-radio-button v-model="hello" value="adsasd" label="Third option"/>

    {{ hello }}

    <neb-validator v-model="isValid" class="form-elements">
      <neb-input type="email" required v-model="email" label="Email" placeholder="Write here..."/>
      <neb-input v-if="!hide" type="password" required v-model="password" label="Password" placeholder="Write here..."/>

      <br>
      <neb-button :disabled="!isValid" @click="useNebToast({type: 'info', title: 'We’ve just released a new feature', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum dolor.', actions: [{text: 'Read more', callback: () => console.log('Read more')}, {text: 'Other', callback: () => console.log('other')}]})">Login</neb-button>
    </neb-validator>

    <div class="neb-dropdown2">
      <neb-menu :menus="menus" :floating-options="floatingOptions">
        <template #button="{toggle}">
          <neb-button @click="toggle()" type="secondary-neutral">
            Account
            <icon name="material-symbols:keyboard-arrow-down"/>
          </neb-button>
        </template>
      </neb-menu>
    </div>
  </div>
</template>

<style scoped>
.experiments {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  padding: var(--space-12);
}
.form-elements {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.buttons {
  max-width: 300px;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.pop-up-body-1 {
  width: 800px;
  height: 600px;
  background: red;
  border-radius: var(--radius-default);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pop-up-body {
  width: 600px;
  height: 400px;
  background: white;
  border-radius: var(--radius-default);
  display: flex;
  align-items: center;
  justify-content: center;
}

.neb-blur {
  margin-top: var(--space-6);
  display: flex;
  gap: var(--space-4);
  align-items: center;

  .main-box {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 400px;
    height: 150px;
    background: var(--primary-color-700);
    color: var(--neutral-color-300);
    border-radius: var(--radius-default);
    border: 1px solid var(--primary-color-500);
  }

  .exception-box {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    height: 100px;
    background: var(--success-color-100);
    border-radius: var(--radius-default);
    border: 1px solid var(--success-color-300);
  }
}
.top-slot {
  padding: var(--space-2) var(--space-4);
  padding-bottom: var(--space-3);

  h6 {
    font-size: var(--text-sm);
    font-weight: 600;
  }
  p {
    font-size: var(--text-sm);
    font-weight: 400;
  }
}
</style>
