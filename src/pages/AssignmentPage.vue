<template>
  <q-layout view="hHh lpR fFf">

    <q-header bordered class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <!-- <q-avatar>
              <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
            </q-avatar> -->
          BASIC PROJECT MONITORING
        </q-toolbar-title>
        <q-avatar class="text-white" size="44px" color="purple-5">{{ Array.from(loggedUsers.firstname)[0] + '' +
        Array.from(loggedUsers.lastname)[0]
        }}
        </q-avatar>
      </q-toolbar>
    </q-header>

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
    <div class="row flex-row my-projects">
      <div class="col-md-3 q-pa-sm" v-for="myProject in myProjects" :key="myProject" style="width: 1650px">
        <q-card class="my-card">
          <q-card-section style="height: 150px;">
            <h7 class="text-subtitle2">Title</h7>:{{ myProject.TITLE }}
            <q-space />
            <h7 class="text-subtitle2">Author</h7>: {{ myProject.AUTHOR }}
            <q-space />
            <h7 class="text-subtitle2">Assigned by</h7>: {{ myProject.ASSIGNED_BY }}
            <q-space />
            <h7 class="text-subtitle2">Status</h7>: {{ myProject.PROJECT_STATUS }}
          </q-card-section>
        </q-card>
      </div>
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

  created() {
    this.checkIsLogged(),
      this.getMyProjects()
  },

  computed: {
    ...mapGetters({
      isLogged: 'projects/isLogged',
      loggedUsers: 'projects/loggedUsers',
      profileData: 'projects/profileData',
      myProjects: 'projects/myProjects'
    })
  },

  methods: {
    async logOut() {
      return await this.$store.dispatch('projects/logOut')
    },
    checkIsLogged() {
      this.loggedUsers.accessToken ? this.$router.push('/assignment') : this.$router.push('/')
    },
    async getMyProjects() {
      console.log('code: ', this.loggedUsers.user_code)
      let results = await this.$store.dispatch('projects/getMyProjects', this.loggedUsers.user_code)
      console.log('andriod: ', results)
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

.my-projects {
  margin-top: -60px;
}
</style>