<template>
  <q-dialog v-if="pModal" :model-value="true">
    <q-card style="width: 1600px; max-width: 80vw;">
      <q-card-section>
        <q-banner inline-actions class="text-black bg-green-1 text-uppercase">
          <div class="text-weight-bold">
            {{ vAuthor.FIRSTNAME + ' ' + vAuthor.LASTNAME }}'s PROJECTS
          </div>
        </q-banner>
      </q-card-section>
      <div class="row q-pa-sm flex-row">
        <div class="col-md-3 q-pa-sm" v-for="vPro in vPros" :key="vPro" style="width: 1550px">
          <q-card class="my-card">
            <q-card-section>
              <h7 class="text-subtitle2">Title</h7>:{{ vPro.TITLE }}
              <q-space />
              <h7 class="text-subtitle2">Author</h7>: {{ vPro.AUTHOR }}
              <q-space />
              <h7 class="text-subtitle2">Assigned by</h7>: {{ vPro.ASSIGNED_BY }}
              <q-space />
              <h7 class="text-subtitle2">Status</h7>: {{ vPro.PROJECT_STATUS }}
            </q-card-section>
          </q-card>
        </div>
      </div>
      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn flat label="Close" @click="close" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { defineComponent, ref } from 'vue'
import { mapGetters } from 'vuex'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'ListOfProjectsModal',
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
  props: ['vPros', 'vAuthor', 'pModal', 'title'],

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

  methods: {
    async getSystemUsers() {
      const users = await this.$store.dispatch('projects/getSystemUsers')
    },
    checkIsLogged() {
      this.loggedUsers.accessToken ? this.$router.push('/people') : this.$router.push('/')
    },
    close() {
      this.$emit('close')
    }
  }
})
</script>