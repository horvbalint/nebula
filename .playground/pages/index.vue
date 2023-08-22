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
  }
}

const rows = ref([
  {
    id: 1,
    username: 'sunsetSeeker42',
    name: 'John Doe',
    email: 'john@example.com',
    age: 28,
    profession: 'Engineer',
    lastLogin: '2023-08-22T08:30:00.000Z',
  },
  {
    id: 2,
    username: 'artisticDreamer',
    name: 'Jane Smith',
    email: 'jane@example.com',
    age: 35,
    profession: 'Designer',
    lastLogin: '2023-08-22T08:30:00.000Z',
  },
  {
    id: 3,
    username: 'codeNinja',
    name: 'Michael Johnson',
    email: 'michael@example.com',
    age: 22,
    profession: 'Student',
    lastLogin: '2023-08-22T08:30:00.000Z',
  },
  {
    id: 4,
    username: 'wordWeaver',
    name: 'Emily Brown',
    email: 'emily@example.com',
    age: 40,
    profession: 'Writer',
    lastLogin: '2023-08-22T08:30:00.000Z',
  },
  {
    id: 5,
    username: 'pixelPioneer',
    name: 'Daniel Williams',
    email: 'daniel@example.com',
    age: 32,
    profession: 'Developer',
    lastLogin: '2023-08-22T08:30:00.000Z',
  },
  {
    id: 6,
    username: 'colorCanvas',
    name: 'Olivia Martinez',
    email: 'olivia@example.com',
    age: 27,
    profession: 'Artist',
    lastLogin: '2023-08-22T08:30:00.000Z',
  },
  {
    id: 7,
    username: 'adventureArchitect',
    name: 'William Taylor',
    email: 'william@example.com',
    age: 29,
    profession: 'Manager',
    lastLogin: '2023-08-22T08:30:00.000Z',
  },
  {
    id: 8,
    username: 'shutterSculptor',
    name: 'Sophia Anderson',
    email: 'sophia@example.com',
    age: 31,
    profession: 'Photographer',
    lastLogin: '2023-08-22T08:30:00.000Z',
  },
  {
    id: 9,
    username: 'healingHarmony',
    name: 'James Thomas',
    email: 'james@example.com',
    age: 45,
    profession: 'Doctor',
    lastLogin: '2023-08-22T08:30:00.000Z',
  },
  {
    id: 10,
    username: 'musicMaverick',
    name: 'Emma Jackson',
    email: 'emma@example.com',
    age: 23,
    profession: 'Student',
    lastLogin: '2023-08-22T08:30:00.000Z',
  },
  {
    id: 11,
    username: 'fictionFlare',
    name: 'Liam White',
    email: 'liam@example.com',
    age: 26,
    profession: 'Writer',
    lastLogin: '2023-08-22T08:30:00.000Z',
  },
  {
    id: 12,
    username: 'sketchSaga',
    name: 'Ava Harris',
    email: 'ava@example.com',
    age: 34,
    profession: 'Designer',
    lastLogin: '2023-08-22T08:30:00.000Z',
  },
  {
    id: 13,
    username: 'quantumQuill',
    name: 'Noah Wilson',
    email: 'noah@example.com',
    age: 37,
    profession: 'Engineer',
    lastLogin: '2023-08-22T08:30:00.000Z',
  },
  {
    id: 14,
    username: 'canvasChameleon',
    name: 'Isabella Lee',
    email: 'isabella@example.com',
    age: 30,
    profession: 'Artist',
    lastLogin: '2023-08-22T08:30:00.000Z',
  },
  {
    id: 15,
    username: 'byteBard',
    name: 'Mason Martin',
    email: 'mason@example.com',
    age: 29,
    profession: 'Developer',
    lastLogin: '2023-08-22T08:30:00.000Z',
  },
  {
    id: 16,
    username: 'lensLyricist',
    name: 'Mia Miller',
    email: 'mia@example.com',
    age: 28,
    profession: 'Photographer',
    lastLogin: '2023-08-22T08:30:00.000Z',
  },
  {
    id: 17,
    username: 'strategySculptor',
    name: 'Ethan Moore',
    email: 'ethan@example.com',
    age: 33,
    profession: 'Manager',
    lastLogin: '2023-08-22T08:30:00.000Z',
  },
  {
    id: 18,
    username: 'medicMuse',
    name: 'Amelia Clark',
    email: 'amelia@example.com',
    age: 41,
    profession: 'Doctor',
    lastLogin: '2023-08-22T08:30:00.000Z',
  },
  {
    id: 19,
    username: 'cyberScribe',
    name: 'Alexander Young',
    email: 'alexander@example.com',
    age: 24,
    profession: 'Student',
    lastLogin: '2023-08-22T08:30:00.000Z',
  },
  {
    id: 20,
    username: 'imaginationInk',
    name: 'Ella King',
    email: 'ella@example.com',
    age: 36,
    profession: 'Writer',
    lastLogin: '2021-08-22T08:30:00.000Z',
  }
])

const columns = ref([
  {
    text: 'ID',
    key: 'id'
  },
  {
    text: 'Username',
    key: 'username'
  },
  {
    text: 'Name',
    key: 'name'
  },
  {
    text: 'Email',
    key: 'email'
  },
  {
    text: 'Age',
    key: 'age',
  },
  {
    text: 'Profession',
    key: 'profession',
  },
  {
    text: 'Last login',
    key: 'lastLogin',
  }
])

const selectedRows = ref([] as typeof rows.value)
</script>

<template>
  <div class="experiments">
    <neb-table
      class="neb-table"
      v-model="selectedRows"
      :columns="columns"
      :rows="rows"
    >
      <template #header>
        Ebek listaja
      </template>

      <template #th-profession="{column}">
        Custom {{ column.text }}
      </template>

      <template #td-profession="{formatted}">
        CellCustom {{ formatted }}
      </template>
    </neb-table>

    {{ selectedRows }}

    <div>
      <neb-badge>Elfogadásra vár</neb-badge>
      <neb-badge color="error">Elutasitva</neb-badge>
      <neb-badge color="success">Elfogadva</neb-badge>
      <neb-badge color="warning">Elfogadásra vár</neb-badge>
      <neb-badge color="info">Folyamatban</neb-badge>
      <neb-badge color="primary">Beérkezett</neb-badge>

      <neb-badge small>Elfogadásra vár</neb-badge>
      <neb-badge small color="error">Elutasitva</neb-badge>
      <neb-badge small color="success">Elfogadva</neb-badge>
      <neb-badge small color="warning">Elfogadásra vár</neb-badge>
      <neb-badge small color="info">Folyamatban</neb-badge>
      <neb-badge small color="primary">Beérkezett</neb-badge>
    </div>

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
.neb-table {
  max-height: 600px;
}
</style>
