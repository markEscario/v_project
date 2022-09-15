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
        <q-avatar class="text-white" size="44px" color="purple-5">{{ Array.from(loggedUsers.firstname)[0] + '' +
        Array.from(loggedUsers.lastname)[0] }}
        </q-avatar>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <div class="q-pa-sm container-pos" style="max-width: 400px">
        <h6 class="text-weight-bold: text-subtitle2 text-green text-center">
          <q-avatar class="text-white" size="94px" color="red-5">
            {{ Array.from(loggedUsers.firstname)[0] + '' + Array.from(loggedUsers.lastname)[0] }}
          </q-avatar>
        </h6>
        <q-btn flat rounded color="primary" label="Edit" to="/edit_profile" />
        <q-btn flat rounded color="primary" label="Projects" to="/projects" />
        <!-- <q-uploader url="http://localhost:4444/uploads" style="max-width: 300px" class="container-pos" /> -->
      </div>
    </q-page-container>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
      <!-- drawer content -->
      <q-list padding class="rounded-borders text-primary">
        <q-item clickable v-ripple :active="link === 'inbox'" active-class="my-menu-link">
          <q-item-section avatar>
            <q-icon name="account_circle" />
          </q-item-section>

          <q-item-section>
            <router-link to="/profile">Profile</router-link>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple :active="link === 'outbox'" active-class="my-menu-link">
          <q-item-section avatar>
            <q-icon name="send" />
          </q-item-section>

          <q-item-section>
            <router-link to="/assignment">My Projects</router-link>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple :active="link === 'settings'" @click="link = 'settings'" active-class="my-menu-link">
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>

          <q-item-section>Settings</q-item-section>
        </q-item>
        <q-separator spaced />
        <q-item clickable v-ripple :active="link === 'help'" @click="link = 'help'" active-class="my-menu-link">
          <q-item-section avatar>
            <q-icon name="help" />
          </q-item-section>

          <q-item-section>Help</q-item-section>
        </q-item>
        <q-item v-if="loggedUsers" clickable v-ripple :active="link === 'help'" active-class="my-menu-link">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>

          <q-item-section v-if="loggedUsers" clickable v-ripple :active="link === 'logout'">
            <a href="" @click="logOut">Logout</a>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

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

  created() {
    this.checkIsLogged(),
      this.getProfileData()
  },

  computed: {
    ...mapGetters({
      isLogged: 'projects/isLogged',
      loggedUsers: 'projects/loggedUsers',
      profileData: 'projects/profileData',
    })
  },

  methods: {
    async logOut() {
      return await this.$store.dispatch('projects/logOut')
    },
    checkIsLogged() {
      this.loggedUsers.accessToken ? this.$router.push('/profile') : this.$router.push('/')
    },
    async getProfileData() {
      let pro = await this.$store.dispatch('projects/getProfile', this.loggedUsers.id)
    }
  },

  watch: {
    isLogged: {
      handler(val) {
        if (val) {
          console.log('val: ', val)
        }
      },
      immediate: true
    }

  }
})
</script>
<style>
.container-pos {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>