<template>
  <v-container class="bg-white px-1 px-md-16 border-0-md" fluid>

    <!--  Top Bar  -->
    <v-row>


    </v-row>
  </v-container>
</template>

<script>

export default {
  data() {
    return {
      navigationMenu: false
    }
  },
  methods : {
    async openProfile() {
      if (this.user.value && this.user.value.authenticated) {
        await navigateTo(this.user.value.role === 'admin' ? '/admin-dashboard' : '/dashboard');
      } else {
        this.$refs.login.openModal();
      }
    }
  },
  computed: {
    user() {
      return useCookie('user')
    }
  },
  mounted() {

  }
}
</script>

<style scoped>
.textSmall {
  font-size: 0.85em;
  display: inline-block;
}
</style>
