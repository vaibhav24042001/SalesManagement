import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    isAuthenticated: false,
    user: null,
    error: null,
    showAddListDialog: false,
    states: [],
    cities: [],
    selectedCardIndex: 0, // Initial selected card index
    leads: [],
    leadsCounts: {},
    editingLead: null,
  },
  mutations: {
    SET_AUTH(state, payload) {
      state.isAuthenticated = payload;
    },
    SET_USER(state, payload) {
      state.user = payload;
    },
    SET_ERROR(state, payload) {
      state.error = payload;
    },
    // Mutation to set dialog visibility
    SET_ADD_LIST_DIALOG(state, payload) {
      state.showAddListDialog = payload;
    },
    SET_STATES(state, payload) {
      state.states = payload;
    },
    SET_CITIES(state, payload) {
      state.cities = payload;
    },
    SET_SELECTED_CARD_INDEX(state, index) {
      state.selectedCardIndex = index;
    },
    SET_LEADS(state, leads) {
      state.leads = leads;
    },
    SET_LEADS_COUNT(state, { index, count }) {
      state.leadsCounts = {
        ...state.leadsCounts,
        [index]: count,
      };
    },
    REMOVE_LEAD(state, leadId) {
      state.leads = state.leads.filter((lead) => lead.id !== leadId);
    },
    SET_EDITING_LEAD(state, lead) {
      state.editingLead = lead;
    },
    CLEAR_EDITING_LEAD(state) {
      state.editingLead = null;
    },
  },
  actions: {
    async editLead({ commit }, leadId) {
      try {
        const response = await axios.get(
          `http://localhost:7000/leads/${leadId}`
        );

        const leadData = response.data;

        commit("SET_EDITING_LEAD", leadData);
        return leadData; // Optionally return data if necessary
      } catch (error) {
        console.error("Error fetching lead for editing:", error);
        throw error;
      }
    },

    async fetchLeadById({ commit }, leadId) {
      try {
        const response = await axios.get(
          `http://localhost:7000/leads/${leadId.id}`
        );
        commit("SET_EDITING_LEAD", response.data); // Set editingLead state
      } catch (error) {
        console.error("Error fetching lead by ID:", error);
        throw error;
      }
    },

    async updateLead({ commit, state }, leadData) {
      try {
        const response = await axios.put(
          `http://localhost:7000/leads/${leadData.id}`,

          {
            ...leadData,
            createdAt: new Date().toISOString().split("T")[0],
            status: state.selectedCardIndex,
          }
        );
        // Handle response as needed
        console.log("Lead updated successfully:", response.data);
      } catch (error) {
        console.error("Error updating lead:", error);
        throw error;
      }
    },

    async deleteLead({ commit }, leadId) {
      try {
        await axios.delete(`http://localhost:7000/leads/${leadId}`);

        commit("REMOVE_LEAD", leadId);
        console.log(`Lead with ID ${leadId} deleted successfully.`);
      } catch (error) {
        console.error("Error deleting lead:", error);
        throw error; // Propagate error to the calling function
      }
    },

    async fetchLeads({ commit, state }) {
      try {
        const response = await axios.get(
          `http://localhost:7000/leads?status=${state.selectedCardIndex}`
        );
        commit("SET_LEADS", response.data);
        commit("SET_LEADS_COUNT", {
          index: state.selectedCardIndex,
          count: response.data.length,
        });
        console.log(response.data.length);
      } catch (error) {
        console.error("Error fetching leads:", error);
        throw error;
      }
    },
    async saveLeads({ commit }, leadData) {
      try {
        // Perform API call to save lead data
        const response = await axios.post("http://localhost:7000/leads", {
          ...leadData,
          createdAt: new Date().toISOString().split("T")[0],
        });
        // Handle response as needed
        console.log("Lead saved successfully:", response.data);
      } catch (error) {
        console.error("Error saving lead:", error);
        throw error; // Propagate error to the calling function
      }
    },

    async fetchStates({ commit }) {
      try {
        const response = await axios.get("http://localhost:7000/state");
        commit("SET_STATES", response.data);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    },
    async fetchCities({ commit }) {
      try {
        const response = await axios.get("http://localhost:7000/citie");
        commit("SET_CITIES", response.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    },

    async login({ commit }, { email, password }) {
      try {
        const response = await axios.get(
          `http://localhost:7000/users?email=${email}&password=${password}`
        );

        if (response.data.length === 0) {
          throw new Error("Invalid credentials");
        }

        const user = response.data[0];

        // Set user data and authentication state
        commit("SET_USER", user);
        commit("SET_AUTH", true);
        commit("SET_ERROR", null);

        // Store authentication state in local storage
        localStorage.setItem("isAuthenticated", true);
        localStorage.setItem("user", JSON.stringify(user));
        return true;
      } catch (error) {
        commit("SET_ERROR", error.message);
        commit("SET_AUTH", false);
        commit("SET_USER", null);
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("user");
        throw error;
      }
    },
    logout({ commit }) {
      // Clear user data and authentication state
      commit("SET_USER", null);
      commit("SET_AUTH", false);
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
    },
    checkAuth({ commit }) {
      // Check local storage for authentication state on app startup
      const isAuthenticated = localStorage.getItem("isAuthenticated");
      const user = JSON.parse(localStorage.getItem("user"));

      if (isAuthenticated && user) {
        commit("SET_AUTH", true);
        commit("SET_USER", user);
      } else {
        commit("SET_AUTH", false);
        commit("SET_USER", null);
      }
    },
    openAddListDialog({ commit }) {
      commit("SET_ADD_LIST_DIALOG", true); // Commit mutation to set dialog visibility to true
    },
    closeAddListDialog({ commit }) {
      commit("SET_ADD_LIST_DIALOG", false); // Commit mutation to set dialog visibility to false
    },
    setSelectedCardIndex({ commit }, index) {
      commit("SET_SELECTED_CARD_INDEX", index); // Commit mutation to set selected card index
    },
  },
  getters: {
    getLeadCountByIndex: (state) => (index) => {
      return state.leadsCounts[index] || 0;
    },
    getEditingLead(state) {
      return state.editingLead;
    },
  },
});
