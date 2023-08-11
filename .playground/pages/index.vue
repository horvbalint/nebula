<script setup lang="ts">
definePageMeta({
  name: 'Fő oldal',
  nebula: {
    skipFromMenu: false
  }
})

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
</script>

<template>
  <div class="experiments">
    <neb-toast hide-action-row type="info" title="We’ve just released a new feature" description="We will conduct a scheduled maintanance on Friday."/>

    <neb-validator v-model="isValid" class="form-elements">
      <neb-input type="email" required v-model="email" label="Email" placeholder="Write here..."/>
      <neb-input v-if="!hide" type="password" required v-model="password" label="Password" placeholder="Write here..."/>

      <br>
      <neb-button :disabled="!isValid" @click="useNebToast({type: 'info', title: 'We’ve just released a new feature', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum dolor.', actions: [{text: 'Read more', callback: () => console.log('Read more')}, {text: 'Other', callback: () => console.log('other')}]})">Login</neb-button>
      <neb-button :disabled="!isValid" @click="useNebToast({type: 'error', title: 'We’ve just released a new feature', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum dolor.', actions: [{text: 'Read more', callback: () => console.log('Read more')}, {text: 'Other', callback: () => console.log('other')}]})">Login</neb-button>
      <neb-button :disabled="!isValid" @click="useNebToast({type: 'success', title: 'We’ve just released a new feature', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum dolor.', actions: [{text: 'Read more', callback: () => console.log('Read more')}, {text: 'Other', callback: () => console.log('other')}]})">Login</neb-button>
      <neb-button :disabled="!isValid" @click="useNebToast({type: 'warning', title: 'We’ve just released a new feature', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum dolor.', actions: [{text: 'Read more', callback: () => console.log('Read more')}, {text: 'Other', callback: () => console.log('other')}]})">Login</neb-button>
    </neb-validator>

    <!-- <div class="buttons">
      <neb-button type="primary" @click="popUpOpen = true">Primary</neb-button>
      <neb-button type="secondary" @click="popUpOpen = true">Secondary</neb-button>
      <neb-button type="secondary-neutral" @click="popUpOpen = true">Secondary neutral</neb-button>
      <neb-button type="tertiary" @click="popUpOpen = true">Tertiary</neb-button>
      <neb-button type="tertiary-neutral" @click="popUpOpen = true">Tertiary neutral</neb-button>
      <neb-button type="link" @click="popUpOpen = true">Link</neb-button>
      <neb-button type="link-neutral" @click="popUpOpen = true">Link neutral</neb-button>
    </div>

    <div class="buttons">
      <neb-button disabled type="primary" @click="popUpOpen = true">Primary</neb-button>
      <neb-button disabled type="secondary" @click="popUpOpen = true">Secondary</neb-button>
      <neb-button disabled type="secondary-neutral" @click="popUpOpen = true">Secondary neutral</neb-button>
      <neb-button disabled type="tertiary" @click="popUpOpen = true">Tertiary</neb-button>
      <neb-button disabled type="tertiary-neutral" @click="popUpOpen = true">Tertiary neutral</neb-button>
      <neb-button disabled type="link" @click="popUpOpen = true">Link</neb-button>
      <neb-button disabled type="link-neutral" @click="popUpOpen = true">Link neutral</neb-button>
    </div> -->

    <!-- <div class="pop-up">
      <div class="buttons">
        <neb-button @click="popUpOpen = true">Primary</neb-button>
      </div>

      <neb-pop-up v-model="popUpOpen">
        <div class="pop-up-body-1">
          <neb-button @click="popUp2 = true">Open second</neb-button>
        </div>
      </neb-pop-up>

      <neb-pop-up v-model="popUp2">
        <div class="pop-up-body">
          <neb-button @click="popUp2 = false">Close</neb-button>
        </div>
      </neb-pop-up>
    </div> -->

    <!-- <div class="neb-expand">
      <neb-button @click="expand = !expand">Toggle {{expand}}</neb-button>

      <p v-neb-expand="expand">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque ab minima, repellendus facere a quaerat quibusdam in quae rerum enim repudiandae asperiores quam molestias. Quos inventore illum repellendus natus quo.
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Impedit aspernatur dolor quos quam nesciunt aut consequatur ipsum cupiditate optio! Mollitia, quisquam pariatur fugit iure deserunt harum ut ea commodi cupiditate.
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus quasi inventore quam! Deleniti minima dolorem illo quisquam fuga amet eius iure nulla iusto culpa explicabo eveniet, libero rerum sequi. Porro.
      </p>
    </div> -->

    <!-- <div class="neb-blur">
      <div class="main-box" v-neb-blur="() => console.log('HERE')">
        Main box
      </div>

      <div class="exception-box" v-neb-blur-exception>
        Exception box
      </div>
    </div> -->
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
</style>
