<template>
  <UpdateProjectModal :fModal="medium" :vData="singleProject" :title="formTitle" @close="closeDialog"
    @hide="closeDialog" />
  <TrendModal :tModal="trendModal" :vPTrend="singleProject" :uTrend="userTrends" :title="formTitle"
    @close="closeTDialog" @hide="closeTDialog" />
  <q-list class="q-pa-md rounded-borders" style="max-width: 1320px">
    <q-btn flat rounded color="primary" label="People" to="/people" />
    <q-input rounded outlined class="q-pa-md" placeholder="Search" v-model="searchProject" @keyup="filterProject" dense
      debounce="100">
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
    </q-input>
    <div class="row q-pa-sm flex-row">
      <div class="col-md-3 q-pa-sm" v-for="project in usersProjects" :key="project">
        <q-card class="my-card">
          <q-card-section>
            <q-label class="text-subtitle2 text-weight-bold text-uppercase">{{ project.TITLE }}</q-label>
            <q-space />
            <h7 class="text-subtitle2">Author</h7>: {{ project.AUTHOR }}
            <q-space />
            <h7 class="text-subtitle2">Assigned by</h7>: {{ project.ASSIGNED_BY }}
            <q-space />
            <h7 class="text-subtitle2">Status</h7>: {{ project.PROJECT_STATUS }}
            <q-space />
            <q-btn class="update-btn" rounded size="xs" color="green" label="Update"
              @click="openUpdateProject(project)" />
            <q-btn class="update-btn q-ml-sm" rounded size="xs" color="blue-grey" label="Trends"
              @click="openTrend(project)" />
            <q-btn class="update-btn q-ml-sm" rounded size="xs" color="red" label="Delete"
              @click="openDeleteProject(project)" />
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div v-if="searchMsg" class="q-pa-lg q-gutter-sm">
      <q-banner inline-actions rounded class="bg-red-4 text-white">
        Sorry, No results found. Please try again.
      </q-banner>
    </div>
  </q-list>

</template>
  
<script>
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'
import UpdateProjectModal from 'components/UpdateProjectModal.vue'
import TrendModal from 'components/TrendModal.vue'

export default defineComponent({
  name: 'ProjectsPage',
  components: {
    UpdateProjectModal,
    TrendModal
  },
  data() {
    return {
      singleProject: {
        id: '',
        user_code: '',
        project_code: '',
        title: '',
        project_description: '',
        project_status: 'New Project',
        author: '',
        assigned_by: ''
      },
      authors: {},
      userTrends: [],
      searchProject: '',
      medium: false,
      trendModal: false,
      formTitle: '',
      searchMsg: false
    }
  },
  created() {
    this.checkIsLogged()
    this.getUsersProjects()
  },

  computed: {
    ...mapGetters({
      isLogged: 'projects/isLogged',
      loggedUsers: 'projects/loggedUsers',
      users: 'projects/users',
      usersProjects: 'projects/usersProjects',
      trends: 'projects/trendsByProject'
    })
  },

  methods: {
    async getUsersProjects() {
      const listOfProjects = await this.$store.dispatch('projects/getUsersProjects')
    },
    checkIsLogged() {
      this.loggedUsers.accessToken ? this.$router.push('/projects') : this.$router.push('/')
    },
    openUpdateProject(details) {
      this.medium = true
      this.formTitle = 'Update Project'
      this.singleProject = {
        id: details.ID,
        user_code: details.USER_CODE,
        title: details.TITLE,
        project_description: details.PROJECT_DESCRIPTION,
        project_status: details.PROJECT_STATUS,
        author: details.AUTHOR,
        assigned_by: details.ASSIGNED_BY
      }
    },
    async filterProject() {
      if (this.searchProject === '') {
        this.getUsersProjects()
        this.searchMsg = false
      } else {
        let data = {
          searchData: this.searchProject
        }
        const results = await this.$store.dispatch('projects/searchUserProjects', data)
        results.length === 0 ? this.searchMsg = true : false
      }
    },
    async openTrend(details) {
      this.trendModal = true
      this.singleProject = {
        id: details.ID,
        user_code: details.USER_CODE,
        project_code: details.PROJECT_CODE,
        title: details.TITLE,
        project_description: details.PROJECT_DESCRIPTION,
        project_status: details.PROJECT_STATUS,
        author: details.AUTHOR,
        assigned_by: details.ASSIGNED_BY
      }
      const trendsByProject = await this.$store.dispatch('projects/getTrends', details.PROJECT_CODE)
      this.userTrends = trendsByProject
    },
    openDeleteProject(details) {
      this.medium = true
      this.formTitle = 'Delete Project'
      this.singleProject = {
        id: details.ID
      }
    },
    closeDialog() {
      this.medium = false
    },
    closeTDialog() {
      this.trendModal = false
    }

  },

})
</script>
<style>
.update-btn {
  margin-top: 10px;
}
</style>