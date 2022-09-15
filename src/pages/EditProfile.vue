<template>
  <q-layout view="hHh lpR fFf">

    <q-header bordered class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="text-uppercase">
          Basic Project Monitoring
        </q-toolbar-title>
        Hi, {{ loggedUsers.firstname + ' ' + loggedUsers.lastname }}
        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>

    <div class="q-pa-md container-pos" style="max-width: 400px">
      <q-form @submit="editProfile" class="q-gutter-md form-pos">
        <q-input outlined v-model="pro.firstname" hint="First Name" />
        <q-input outlined v-model="pro.lastname" hint="Last Name" />
        <q-input outlined v-model="pro.email" hint="Email" lazy-rules
          :rules="[val => !!val || 'Email is required', isValidEmail]" />
        <div>
          <q-btn label="Update" type="submit" color="primary" />
        </div>
      </q-form>

    </div>

  </q-layout>
</template>
<script>
import { defineComponent, ref } from 'vue'
import { mapGetters } from 'vuex'

export default defineComponent({
  name: 'MainLayout',

  setup() {
    const leftDrawerOpen = ref(false)
    const rightDrawerOpen = ref(false)

    return {
      text: '',
      leftDrawerOpen,
      link: ref('inbox'),
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },

      rightDrawerOpen,
      toggleRightDrawer() {
        rightDrawerOpen.value = !rightDrawerOpen.value
      }
    }
  },
  data() {
    return {
      pro: {
        firstname: '',
        lastname: '',
        email: '',
        id: '',
      }
    }
  },
  created() {
    this.checkIsLogged()
    this.getProfileData()
  },

  computed: {
    ...mapGetters({
      isLogged: 'projects/isLogged',
      loggedUsers: 'projects/loggedUsers',
      profileData: 'projects/profileData'
    })
  },

  methods: {
    async logOut() {
      return await this.$store.dispatch('projects/logOut')
    },
    checkIsLogged() {
      this.loggedUsers.accessToken ? this.$router.push('/edit_profile') : this.$router.push('/')
    },
    async editProfile() {
      let data = {
        firstname: this.pro.firstname,
        lastname: this.pro.lastname,
        userCode: this.pro.userCode,
        email: this.pro.email,
        id: this.loggedUsers.id
      }
      await this.$store.dispatch('projects/editProfile', data)
    },
    async getProfileData() {
      let prox = await this.$store.dispatch('projects/getProfile', this.loggedUsers.id)
      console.log('prox: ', prox.ID)
      this.pro = {
        firstname: prox.FIRSTNAME,
        lastname: prox.LASTNAME,
        userCode: prox.USER_CODE,
        email: prox.EMAIL
      }
    },
    isValidEmail(val) {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
      return emailPattern.test(val) || 'Invalid email'
    }
  }
})

</script>
<style>
.container-pos {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: auto;
}

.form-pos {
  margin-top: -70px;
}
</style>