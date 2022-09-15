<template>
  <q-dialog v-if="fModal" :model-value="true">
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section>
        <div class="text-subtitle2 text-weight-bold text-uppercase">{{ title }}</div>
      </q-card-section>
      <div class="q-pa-md" style="max-width: 400px">
        <q-form @submit="submitForm" class="q-gutter-md" ref="form">
          <q-input outlined v-if="title !== 'Delete Project'" v-model="singleProject.title" label="Title" hint="Title"
            lazy-rules :rules="[val => val && val.length > 0 || 'This is required']" />
          <q-input outlined v-if="title !== 'Delete Project'" v-model="singleProject.project_description"
            label="Description" hint="Project Description" lazy-rules
            :rules="[val => val && val.length > 0 || 'This is required']" />
          <!-- <h6 class="text-subtitle2" v-if="title !== 'Delete Project'">Status: {{ singleProject.project_status }}</h6> -->
          <q-select v-if="title !== 'Delete Project'" outlined v-model="singleProject.project_status" :options="pStatus"
            hint="Status" />
          <q-card-section v-else class="q-pt-none">
            Are you sure you want to delete this project?
          </q-card-section>

          <div>
            <q-btn v-if="title === 'Delete Project'" label="Delete" type="submit" color="red" />
            <q-btn v-else label="Submit" type="submit" color="primary" />
          </div>
        </q-form>
      </div>
      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn flat label="Close" @click="close" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'
import { mapGetters } from 'vuex'

export default defineComponent({
  name: 'AddProjectModal',
  setup() {
    const $q = useQuasar()
    return {
      triggerPositive() {
        $q.notify({
          type: 'positive',
          message: 'Project was submitted'
        })
      },
      triggerInfo() {
        $q.notify({
          type: 'info',
          message: 'Project was updated'
        })
      },
      triggerNegative() {
        $q.notify({
          type: 'negative',
          message: 'Project was deleted'
        })
      }
    }
  },
  data() {
    return {
      singleProject: {
        id: '',
        title: '',
        user_code: '',
        project_description: '',
        project_status: 'New Project',
        author: '',
        assigned_by: ''
      },
      filteredProjects: [],
      pStatus: [
        'New Project',
        'In Progress',
        'For Testing',
        'Re Work',
        'Done'
      ]
    }
  },
  props: ['vData', 'fModal', 'title'],

  created() {
    this.getSystemUsers()
  },

  computed: {
    ...mapGetters({
      isLogged: 'projects/isLogged',
      loggedUsers: 'projects/loggedUsers',
      users: 'projects/users',
      submitStatus: 'projects/submitStatus',
      usersProjects: 'projects/usersProjects'
    })
  },

  watch: {
    vData: {
      handler(val) {
        if (val) {
          this.singleProject.id = val.id
          this.singleProject.title = val.title
          this.singleProject.user_code = val.user_code
          this.singleProject.project_description = val.project_description
          this.singleProject.project_status = val.project_status
          this.singleProject.author = val.author
          this.singleProject.assigned_by = val.assigned_by
        } else {
          this.singleProject.id = ''
          this.singleProject.title = ''
          this.singleProject.user_code = ''
          this.singleProject.project_description = ''
          this.singleProject.project_status = ''
          this.singleProject.author = ''
          this.singleProject.assigned_by = ''
        }
      },
      immediate: true
    }

  },

  methods: {
    async getSystemUsers() {
      return await this.$store.dispatch('projects/getSystemUsers')
    },
    async getUsersProjects() {
      return await this.$store.dispatch('projects/getUsersProjects')
    },
    checkIsLogged() {
      this.loggedUsers.accessToken ? this.$router.push('/people') : this.$router.push('/')
    },
    async updateProject() {
      let data = {
        id: this.singleProject.id,
        user_code: this.singleProject.user_code,
        title: this.singleProject.title,
        project_description: this.singleProject.project_description,
        project_status: this.singleProject.project_status,
        assigned_by: this.loggedUsers.firstname + ' ' + this.loggedUsers.lastname,
      }
      const result = await this.$store.dispatch('projects/updateProject', data)
      this.submitStatus === 200 ? (() => { this.close(); this.triggerInfo(); this.getUsersProjects(); })() : null
      this.filteredProjects = this.usersProjects
    },
    async deleteProject() {
      let data = {
        id: this.singleProject.id,
      }
      const result = await this.$store.dispatch('projects/deleteProject', data)
      this.submitStatus === 200 ? (() => { this.close(); this.triggerNegative(); this.getUsersProjects(); })() : null
    },
    submitForm() {
      this.title === 'Assign Project' ? this.saveProject() : this.title === 'Update Project' ? this.updateProject() : this.deleteProject()
    },
    close() {
      this.$emit('close')
    }
  }
}) 
</script>