<template>
  <q-dialog v-if="fModal" :model-value="true">
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section>
        <div class="text-subtitle2 text-weight-bold text-uppercase">{{ title }}</div>
      </q-card-section>
      <div class="q-pa-md" style="max-width: 400px">
        <q-form @submit="submitForm" class="q-gutter-md" ref="form">
          <q-input outlined v-if="title !== 'Delete Project'" v-model="projects.title" label="Title" hint="Title"
            lazy-rules :rules="[val => val && val.length > 0 || 'This is required']" />
          <q-input outlined v-if="title !== 'Delete Project'" v-model="projects.project_description" label="Description"
            hint="Content Description" lazy-rules :rules="[val => val && val.length > 0 || 'This is required']" />
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
      projects: {
        title: '',
        user_code: '',
        project_description: '',
        project_status: 'New Task',
        author: '',
        assigned_by: ''
      }
    }
  },
  props: ['vData', 'vAuthor', 'fModal', 'title'],

  created() {
    this.getSystemUsers()
    this.checkIsLogged()
  },

  computed: {
    ...mapGetters({
      isLogged: 'projects/isLogged',
      loggedUsers: 'projects/loggedUsers',
      users: 'projects/users',
      submitStatus: 'projects/submitStatus'
    })
  },

  watch: {
    vData: {
      handler(val) {
        if (val) {
          console.log('val: ', val)
          this.projects.title = val.title
          this.projects.user_code = val.user_code
          this.projects.project_description = val.project_description
          this.projects.project_status = val.project_status
          this.projects.author = val.author
          this.projects.assigned_by = val.assigned_by
        } else {
          this.projects.title = ''
          this.projects.user_code = ''
          this.projects.project_description = ''
          this.projects.project_status = ''
          this.projects.author = ''
          this.projects.assigned_by = ''
        }
      },
      immediate: true
    }

  },

  methods: {
    async getSystemUsers() {
      const users = await this.$store.dispatch('projects/getSystemUsers')
    },
    checkIsLogged() {
      this.loggedUsers.accessToken ? this.$router.push('/people') : this.$router.push('/')
    },
    async saveProject() {
      let data = {
        user_code: this.loggedUsers.user_code,
        title: this.projects.title,
        project_description: this.projects.project_description,
        project_status: this.projects.project_status,
        author: this.vAuthor.FIRSTNAME + ' ' + this.vAuthor.LASTNAME,
        assigned_by: this.loggedUsers.firstname + ' ' + this.loggedUsers.lastname,
      }
      const result = await this.$store.dispatch('projects/assignProject', data)
      console.log('result :', result.status)
      this.submitStatus === 200 ? (() => { this.close(); this.triggerPositive(); })() : null
    },
    submitForm() {
      console.log('action: ', this.title)
      this.title === 'Assign Project' ? this.saveProject() : this.title === 'Edit Project' ? this.saveEditProject() : this.deleteProject()
    },
    close() {
      this.$emit('close')
    }
  }
}) 
</script>