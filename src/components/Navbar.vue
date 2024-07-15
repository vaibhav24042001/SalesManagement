<template>
  <v-app-bar app>
    <v-toolbar-title class="custom-color">
      <span class="font-weight-bold text-h5">Sales Management  </span> 
      <span class="lead-management">Lead management</span> 
      <span class="lead">/Lead </span>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn color="primary" size="large" @click="logout">Logout</v-btn>

    <v-icon class="mr-4" size="40">mdi-account-circle</v-icon>
    <div class="text-grey mr-6">{{ user ? user.name : '' }}</div>
  </v-app-bar>
</template>

<script setup>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

const user = store.state.user;

const logout = () => {
  store.dispatch('logout');
  router.push('/'); // Redirect to login page after logout
};
</script>

<style scoped>
.custom-color {
  color: rgb(96, 96, 255); /* Custom color for Sales Management */
}

.lead-management {
  color: black !important; /* Color for Lead Management */
}

.lead {
  color: gray;
}
</style>
