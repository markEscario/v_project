<template>
  <q-layout view="hHh lpR fFf">

    <q-header bordered class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="text-uppercase">
          <!-- <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar> -->
          Basic Project Monitoring
          <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        </q-toolbar-title>
        <q-avatar class="text-white" size="44px" color="purple-5">{{ Array.from(loggedUsers.firstname)[0] + '' +
        Array.from(loggedUsers.lastname)[0]
        }}
        </q-avatar>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-input rounded outlined class="q-pa-md" placeholder="Search" v-model="searchCompletedProject"
        @keyup="filterCompletedProject" dense debounce="100">
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-list style="max-width: 350px">
        <q-item-label header class="text-weight-bold">COMPLETED PROJECTS</q-item-label>

        <q-item class="q-pa-md" v-for="completedProject in completedProjects" :key="completedProject" clickable
          v-ripple>
          <q-item-section avatar>
            <q-avatar class="text-white" size="40px" color="orange">{{ Array.from(completedProject.AUTHOR)[0] }}
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">{{ completedProject.TITLE }}</q-item-label>
            <q-item-label caption lines="2">
              <span class="text-weight-bold">{{ completedProject.AUTHOR }}</span>
              {{ completedProject.PROJECT_DESCRIPTOIN }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

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
  data() {
    return {
      searchCompletedProject: ''
    }
  },
  created() {
    this.checkIsLogged()
    this.getCompletedProjects()
  },
  computed: {
    ...mapGetters({
      isLogged: 'projects/isLogged',
      loggedUsers: 'projects/loggedUsers',
      usersProjects: 'projects/usersProjects',
      completedProjects: 'projects/completedProjects'
    })
  },

  methods: {
    async logOut() {
      return await this.$store.dispatch('projects/logOut')
    },
    async getCompletedProjects() {
      const listOfProjects = await this.$store.dispatch('projects/getCompletedProjects')
    },
    checkIsLogged() {
      this.loggedUsers.accessToken ? this.$router.push('/dashboard') : this.$router.push('/')
    },
    async filterCompletedProject() {
      if (this.searchCompletedProject === '') {
        this.getCompletedProjects()
      } else {
        let data = {
          searchData: this.searchCompletedProject
        }
        const results = await this.$store.dispatch('projects/searchCompletedProjects', data)
        this.completedProjects = results.filter(result => result.PROJECT_STATUS === 'Done')
        console.log('com projects: ', this.completedProjects)
      }
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