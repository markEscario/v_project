<template>
  <q-layout view="hHh lpR fFf">
    <q-header bordered class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="text-uppercase">
          <!-- <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar> -->
          Basic Project Monitoring
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <div class="q-pa-md container-pos" style="max-width: 400px">
        <h6 class="text-subtitle2 text-red" v-if="loginResponse">{{ loginResponse.message }}</h6>
        <q-form @submit="handleLogin" class="q-gutter-md">
          <q-input outlined v-model="loginInput.username" hint="Username" lazy-rules
            :rules="[val => val && val.length > 0 || 'This is required']" />

          <q-input v-model="loginInput.password" outlined :type="isPwd ? 'password' : 'text'" hint="Password" lazy-rules
            :rules="[val => val && val.length > 0 || 'This is required']">
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
            </template>
          </q-input>
          <!-- <q-toggle v-model="accept" label="I accept the license and terms" /> -->
          <div>
            <q-btn label="Submit" type="submit" color="primary" />
            <q-btn label="Create Account" type="button" color="primary" flat class="q-ml-sm" to="/registration" />
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
      loginInput: {
        username: '',
        password: ''
      },
      formMessage: ''
    }
  },

  created() {
    this.checkIsLogged()
  },

  computed: {
    ...mapGetters({
      loggedUsers: 'projects/loggedUsers',
      loginResponse: 'projects/loginResponse',
      usersProjects: 'projects/usersProjects',
    })
  },

  methods: {
    async handleLogin() {
      let data = {
        username: this.loginInput.username,
        password: this.loginInput.password
      }
      const res = await this.$store.dispatch('projects/handleLogin', data)
      console.log('res: ', res.data)
      this.loggedUsers.accessToken ? this.$router.push('/projects') : this.$router.push('/')
    },
    checkIsLogged() {
      this.loggedUsers.accessToken ? this.$router.push('/projects') : this.$router.push('/')
    },
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