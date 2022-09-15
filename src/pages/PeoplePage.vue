<template>
  <div class="row flex-row q-pa-xs">
    <div class="col-md-2">
      <q-btn flat rounded color="primary" label="People" to="/people" />
      <q-btn flat rounded color="primary" label="Projects" to="/projects" />
    </div>
  </div>
  <q-input rounded outlined class="q-pa-md" placeholder="Search People" v-model="searchPeople" @keyup="filterPeople"
    dense debounce="100">
    <template v-slot:prepend>
      <q-icon name="search" />
    </template>
  </q-input>
  <ListOfProjectsModal :pModal="projectModal" :vAuthor="authors" :vPros="projectByAuthors" @close="closePDialog"
    @hide="closePDialog" />
  <AddProjectModal :fModal="medium" :vAuthor="authors" :vData="projects" :title="formTitle" @close="closeDialog"
    @hide="closeDialog" />
  <div class="row flex-row q-pa-md">
    <div class="col-md-3" v-for="user in users" :key="user">

      <q-avatar class="text-white" size="44px" color="purple-5">{{ Array.from(user.FIRSTNAME)[0] + '' +
      Array.from(user.LASTNAME)[0]
      }}
      </q-avatar>

      <q-item-label class="q-mt-sm">{{ user.FIRSTNAME }} {{ user.LASTNAME }} - {{ user.POSITION }}</q-item-label>
      <q-btn rounded size="sm" class="text-subtitle" color="primary" @click="openAddTask(user)" label="Assign Task" />
      <q-btn rounded size="sm" class="text-subtitle q-ml-sm" color="warning" @click="openListOfProjects(user)"
        label="Projects" />

    </div>
  </div>
</template>
  
<script>
import { defineComponent } from 'vue'
import { ref } from 'vue'
import { mapGetters } from 'vuex'
import AddProjectModal from 'components/AddProjectModal.vue'
import ListOfProjectsModal from 'components/ListOfProjectsModal.vue'

export default defineComponent({
  name: 'IndexPage',
  components: {
    AddProjectModal,
    ListOfProjectsModal
  },
  setup() {
    return {
      tab: ref('mails')
    }
  },
  data() {
    return {
      projectByAuthors: [],
      projects: {
        user_code: '',
        title: '',
        project_description: '',
        project_status: 'New Project',
        author: '',
        assigned_by: ''
      },
      authors: {},
      medium: false,
      projectModal: false,
      formTitle: ''
    }
  },

  created() {
    this.getSystemUsers()
    this.getUsersProjects()
  },

  computed: {
    ...mapGetters({
      isLogged: 'projects/isLogged',
      loggedUsers: 'projects/loggedUsers',
      users: 'projects/users',
      usersProjects: 'projects/usersProjects'
    })
  },

  methods: {
    async getUsersProjects() {
      const listOfProjects = await this.$store.dispatch('projects/getUsersProjects')
    },
    async getSystemUsers() {
      const users = await this.$store.dispatch('projects/getSystemUsers')
    },
    checkIsLogged() {
      this.loggedUsers.accessToken ? this.$router.push('/people') : this.$router.push('/')
    },
    openAddTask(user) {
      this.medium = true
      this.formTitle = 'Assign Project'
      this.authors = user
    },
    openListOfProjects(user) {
      this.projectModal = true
      this.projectByAuthors = this.usersProjects.filter(userProject => userProject.USER_CODE === user.USER_CODE)
      this.authors = user
    },
    closeDialog() {
      this.medium = false
      this.projects = {}
    },
    closePDialog(user) {
      this.projectModal = false
    },
    async filterPeople() {
      if (this.searchPeople === '') {
        this.getSystemUsers()
      } else {
        let data = {
          searchData: this.searchPeople
        }
        const results = await this.$store.dispatch('projects/searchSystemUsers', data)
      }
    }
  }

})
</script>
  