<template>
  <q-dialog v-if="tModal" :model-value="true">
    <q-card style="width: 1500px; max-width: 80vw;">
      <q-card-section>
        <q-banner inline-actions class="text-black bg-green-1 text-subtitle2 text-uppercase">
          <div class="text-weight-bold">{{ vPTrend.title }}</div>
          {{ vPTrend.author }}
        </q-banner>
        <q-form @submit="submitComment" class="q-gutter-md" ref="form">
          <div class="q-pt-md text-uppercase text-weight-bold">Create Story</div>
          <div class="q-pt-sm q-pb-md" style="max-width: 1500px">
            <q-input v-model="projectComments.trend_description" outlined autogrow lazy-rules
              :rules="[val => val && val.length > 0 || 'This is required']" />
          </div>
          <q-btn class="q-mb-sm trend-btn" label="Submit" type="submit" color="primary" />
        </q-form>
        <q-separator />
        <div class="q-pt-md text-uppercase text-weight-bold">Stories</div>
        <div v-for="trend in uTrend" :key="trend" class="row flex-row q-pt-md text-weight-bold">
          <div class="col-md-12 text-weight-light">
            <q-avatar class="text-white" size="44px" color="purple-5">
              {{ Array.from(trend.TREND_BY)[0] }}
            </q-avatar>
            {{ trend.TREND_DESCRIPTION }}
          </div>
        </div>
      </q-card-section>
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
  props: ['vPTrend', 'uTrend', 'vAuthor', 'tModal', 'title'],

  setup() {
    const $q = useQuasar()
    return {
      triggerPositive() {
        $q.notify({
          type: 'positive',
          message: 'Comment was submitted'
        })
      }
    }
  },

  data() {
    return {
      projectComments: {
        trend_description: '',
        trend_by: ''
      }
    }
  },

  created() {
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
    vPTrend: {
      handler(val) {
        if (val) {
          console.log('val: ', val)
          this.projectComments.trend_description = val.trend_description
        } else {
          this.projectComments.trend_description = ''
        }
      },
      immediate: true
    }

  },
  methods: {
    checkIsLogged() {
      this.loggedUsers.accessToken ? this.$router.push('/projects') : this.$router.push('/')
    },
    async submitComment() {
      let data = {
        user_code: this.loggedUsers.user_code,
        project_code: this.vPTrend.project_code,
        title: this.vPTrend.title,
        trend_description: this.projectComments.trend_description,
        trend_by: this.loggedUsers.firstname + ' ' + this.loggedUsers.lastname,
      }
      const result = await this.$store.dispatch('projects/createComment', data)
      console.log('result :', result.status)
      this.submitStatus === 200 ? (() => { this.close(); this.triggerPositive(); })() : null
    },
    close() {
      this.$emit('close')
    }

  }
})
</script>
<style scoped>
.trend-btn {
  margin-top: -16px;
}
</style>