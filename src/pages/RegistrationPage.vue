<template>
  <q-layout view="hHh lpR fFf">
    <q-header bordered class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="text-uppercase">
          Basic Project Monitoring
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <div class="q-pa-md container-pos" style="max-width: 400px">
        <h6 class="text-weight-bold: text-subtitle2 text-green" v-if="registerResponse">{{ registerResponse }}</h6>
        <q-form @submit="handleRegister" class="q-gutter-md">
          <q-input outlined v-model="userInput.firstname" hint="First Name" lazy-rules
            :rules="[val => val && val.length > 0 || 'This is required']" />

          <q-input outlined v-model="userInput.lastname" hint="Last Name" lazy-rules
            :rules="[val => val && val.length > 0 || 'This is required']" />

          <q-input outlined v-model="userInput.email" hint="Email" lazy-rules
            :rules="[val => !!val || 'Email is required', isValidEmail]" />

          <q-input outlined v-model="userInput.position" hint="Position" lazy-rules
            :rules="[val => !!val || 'Position is required']" />

          <q-input outlined v-model="userInput.username" hint="Username" lazy-rules
            :rules="[val => val && val.length > 0 || 'This is required']" />

          <q-input outlined v-model="userInput.password" :type="isPwd ? 'password' : 'text'" hint="Password" lazy-rules
            :rules="[val => val && val.length > 0 || 'This is required']">
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
            </template>
          </q-input>
          <!-- <q-toggle v-model="accept" label="I accept the license and terms" /> -->
          <div>
            <q-btn label="Submit" type="submit" color="primary" />
            <q-btn label="Sign In" type="button" color="primary" flat class="q-ml-sm" to="/" />
          </div>
        </q-form>

      </div>
    </q-page-container>

    <q-footer bordered class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div class="text-subtitle2">V Projects. Beta 1.0</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'RegistrationPage',
  setup() {
    const $q = useQuasar()
    return {
      isPwd: ref(true),
    }
  },

  data() {
    return {
      userInput: {
        firstname: '',
        lastname: '',
        position: '',
        email: '',
        username: '',
        password: ''
      },
      formMessage: ''
    }
  },

  computed: {
    ...mapGetters({
      users: 'projects/users',
      registerResponse: 'projects/registerResponse'
    })

  },
  methods: {
    async handleRegister() {
      console.log('username: ', this.userInput.username)
      let data = {
        firstname: this.userInput.firstname,
        lastname: this.userInput.lastname,
        email: this.userInput.email,
        position: this.userInput.position,
        username: this.userInput.username,
        password: this.userInput.password
      }
      const res = await this.$store.dispatch('projects/register', data)
      console.log('result: ', res);

    },
    isValidEmail(val) {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || 'Invalid email';
    }
  }
})
</script>
<style>
.container-pos {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}
</style>


