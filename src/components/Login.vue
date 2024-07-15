<template>
  <v-main class="form">
    <form @submit.prevent="loginUser" v-if="!isAuthenticated">
      <h1 class="text-h5 ma-8 custom-color">Welcome, please Sign in</h1>
      <v-text-field
        v-model="email"
        label="E-mail"
        required
        class="ma-8"
      ></v-text-field>
      <v-text-field
        v-model="password"
        label="Password"
        type="password"
        required
        class="ma-8"
      ></v-text-field>

      <div class="btn-b">
        <v-btn type="submit" size="large" class="btn" color="blue">Login</v-btn>
      </div>
      <div class="custom-color-link">
        <router-link to="/forgot-password" class="text-h5 custom-color"
          >Forgot password</router-link
        >
      </div>
      <div v-if="error" class="custom-color">{{ error }}</div>
    </form>
    <template v-else>
      <router-link to="/home"></router-link>
    </template>
  </v-main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const isAuthenticated = ref(false);
const email = ref("");
const password = ref("");
const error = ref(null);

const loginUser = async () => {
  try {
    const loggedIn = await store.dispatch("login", {
      email: email.value,
      password: password.value,
    });
    if (loggedIn) {
      router.push("/home"); // Redirect to home after successful login
    }
  } catch (err) {
    error.value = err.message;
  }
};

onMounted(() => {
  // Check authentication on component mount
  store.dispatch("checkAuth");

  // Check if user is already authenticated
  isAuthenticated.value = store.state.isAuthenticated;

  if (isAuthenticated.value) {
    router.push("/home"); // Redirect to home if already authenticated
  }
});
</script>

<style scoped>
.custom-color {
  color: rgb(96, 96, 255);
}

.btn {
  width: 200px;
  margin-top: -10px;
}

.btn-b {
  padding-left: 7.5rem;
}

.custom-color-link {
  margin: 2rem;
  margin-left: 8rem;
}
</style>
