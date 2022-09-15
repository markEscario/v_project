<template>
  <q-list class="q-pa-md rounded-borders" style="max-width: 1320px">
    <q-btn flat rounded color="primary" label="People" />
    <q-btn flat rounded color="primary" label="Projects" />
    <AddProjectModal :fModal="medium" :vData="projects" :title="formTitle" @close="closeDialog" @hide="closeDialog" />
    <q-item v-for="user in users" :key="user" class="q-pr-xl">
      <q-item-section avatar top>
        <q-avatar>
          <img src="https://cdn.quasar.dev/img/avatar2.jpg">
        </q-avatar>
      </q-item-section>
      <q-item-label class="q-mt-sm">{{ user.FIRSTNAME }} {{ user.LASTNAME }} - {{ user.POSITION }}</q-item-label>
    </q-item>
    <q-btn rounded size="sm" class="text-subtitle" color="primary" @click="openAddTask" label="Assign Task" />
    <q-btn rounded size="sm" class="text-subtitle q-ml-sm" color="warning" @click="openAddTask" label="Projects" />
    <q-separator spaced />
  </q-list>
</template>

<script>
import { defineComponent } from 'vue'
import { ref } from 'vue'
import { mapGetters } from 'vuex'
import AddProjectModal from 'components/AddProjectModal.vue'

export default defineComponent({
  name: 'IndexPage',
  components: {
    AddProjectModal
  },
  setup() {
    return {
      tab: ref('mails')
    }
  },
  data() {
    return {
      projects: {
        user_code: '',
        title: '',
        project_description: '',
        project_status: 'New Project',
        author: '',
        assigned_by: ''
      },
      medium: false,
      formTitle: ''
    }
  },

  created() {
    this.getSystemUsers()
  },

  computed: {
    ...mapGetters({
      isLogged: 'projects/isLogged',
      loggedUsers: 'projects/loggedUsers',
      users: 'projects/users'
    })
  },

  methods: {
    async getSystemUsers() {
      const users = await this.$store.dispatch('projects/getSystemUsers')
      console.log('users: ', users.data)
    },
    checkIsLogged() {
      this.loggedUsers.accessToken ? this.$router.push('/projects') : this.$router.push('/')
    },
    openAddTask() {
      this.medium = true
      this.formTitle = 'Assign Project'
      this.projects = {
        title: '',
        user_code: '',
        project_description: '',
        project_status: 'New Project',
        author: '',
        assigned_by: ''
      }
    },
    closeDialog() {
      this.medium = false
    }
  },


})
</script>
