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
    callback: () => console.log('share'),
  },
  {
    text: 'Keyboard shortcuts for very big uristen mennyire hatraltato kft.',
    icon: 'material-symbols:delete-outline-rounded',
    callback: () => console.log('delete'),
    segment: true,
  },
]

const numbers = [1, 5, 10, 30, 50]
const select = ref([])

const toggle = ref(false)
const input = ref('')

const selectedTab = ref('notifications')
const tabs = {
  home: 'Home page',
  profile: {
    text: 'Profile page',
    icon: 'material-symbols:close'

  },
  notifications: {
    text: 'Notifications',
    count: 3,
    disabled: true
  }
}
</script>

<template>
  <div class="experiments">
    <neb-tabs v-model="selectedTab" :tabs="tabs"/>
    {{ selectedTab }}

    <div>
      <neb-input v-model="input" required label="Example input" hint="Lorem ipsum dolor sit amet" placeholder="Temp placeholder..."/>
      <neb-textarea v-model="input" required label="Example textarea" hint="Lorem ipsum dolor sit amet" placeholder="Temp placeholder..."/>
      Input: {{ input }}
    </div>

    <div class="select-wrapper">
      <neb-select
        v-model="select"
        :options="menus"
        label="Test select"
        :floating-options="floatingOptions"
        hint="This is a hint text to help user."
        track-by-key="text"
        label-key="text"
        leading-icon="material-symbols:person-outline-rounded"
        use-only-tracked-key
        multiple
      />
    </div>
    {{ select }}

    <div>
      <neb-radio-button v-model="hello" value="cacac" label="First option"/>
      <neb-radio-button v-model="hello" value="vava" label="Second option"/>
      <neb-radio-button v-model="hello" value="adsasd" label="Third option"/>
    </div>

    <neb-toggle v-model="toggle" label="Test toggle label"/>
    {{ toggle }}

    <div>
      <neb-checkbox
        v-for="menu in menus"
        :key="menu.text"
        v-model="select"
        :value="menu.text"
        :label="menu.text"
      />

      {{ select }}
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
.select-wrapper {
  display: flex;
  width: 400px;
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
