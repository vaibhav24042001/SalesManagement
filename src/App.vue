<template>
  <v-app fluid fill-height class="light-background">
    <v-main>
      <router-view />
    </v-main>
    <v-dialog v-model="showAddListDialog">
      <!-- Your dialog content here -->
    </v-dialog>
  </v-app>
</template>

<script setup>
  import { computed } from 'vue';
  import { useStore } from 'vuex';

  const store = useStore();

  const showAddListDialog = computed({
    get: () => store.state.showAddListDialog,
    set: (value) => store.dispatch(value ? 'openAddListDialog' : 'closeAddListDialog'),
  });
</script>

<style scoped>
  .light-background {
    background-color: #F4F4F0;
    /* Change this to the desired background color */
  }
</style>
