<template>
  <div>
    <Navbar></Navbar>
    <v-row>
      <v-col class="mt-4 ml-10" cols="6" md="2">
        <v-text-field
          class="boxi"
          v-model="search"
          density="compact"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="solo"
          flat
          hide-details
          single-line
        ></v-text-field>
      </v-col>
      <v-col class="mt-4 boxi" cols="6" md="2">
        <v-autocomplete
          v-model="selectedItem"
          :items="item"
          density="compact"
          label="Comfortable"
          hide-details
          variant="solo"
        ></v-autocomplete>
      </v-col>
      <v-col cols="8" md="" sm="4" class="w-100 d-flex justify-end">
        <v-btn class="ma-3" @click="openAddListDialog" size="large" color="blue"
          >+ Add Lead</v-btn
        >
      </v-col>
    </v-row>

    <v-divider></v-divider>

    <v-item-group v-model="selectedCardIndex" selected-class="bg-primary">
      <v-container class="xyz">
        <v-row class="d-flex justify-left">
          <v-col v-for="n in 4" :key="n" cols="12" md="2" class="px-0">
            <v-item v-slot="{ selectedClass, toggle }">
              <v-card
                :class="['d-flex align-center', selectedClass]"
                height="200"
                dark
                @click="selectCard(n - 1)"
              >
                <div class="text-h6 flex-grow-1 text-left ml-8">
                  <div class="circle-box">
                    <div class="circle"></div>
                  </div>
                  <div class="font">{{ cardNames[n - 1] }}</div>
                  <div class="text-h3 font-weight-bold">
                    {{ getLeadCountByIndex(n - 1) }}
                  </div>
                </div>
              </v-card>
            </v-item>
          </v-col>
        </v-row>
      </v-container>
    </v-item-group>

    <Addlist :dialog="showAddListDialog" :lead="editingLead" @close="closeAddListDialog"
    @save="saveLeads"></Addlist>

    <Table :selectedCardIndex="selectedCardIndex"  @edit-lead="editLead"></Table>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import Navbar from "../components/Navbar.vue";
import Table from "../components/Table.vue";
import Addlist from "../components/Addlead.vue";

export default {
  name: "Home",
  components: {
    Navbar,
    Table,
    Addlist,
  },
  data() {
    return {
      cardNames: [
        "Draft PO",
        "Open Orders",
        "Acknowledgement Pending",
        "Rejected",
      ],

      item: ["Foo", "Bar", "Fizz", "Buzz"],

      search: "",
      items: [],
      selectedItem: null,
     
    };
  },
  computed: {
    ...mapState(["showAddListDialog", "selectedCardIndex", "leads","editingLead"]),
    ...mapGetters(["getLeadCountByIndex", "getEditingLead"]),
  },
  watch: {
    selectedCardIndex: {
      handler: "loadItems", // Use string notation to access the method
      immediate: true,
    },
  },

  methods: {
    ...mapActions([
      "openAddListDialog",
      "closeAddListDialog",
      "fetchLeads",
      "setSelectedCardIndex", 
      "fetchLeadById", // Add this action
      "updateLead",
    ]),
    editItem(item) {
     
      this.fetchLeadById(item.id)
        .then(() => {
          this.$store.dispatch('openAddListDialog');
        })
        .catch((error) => {
          console.error("Error fetching lead for editing:", error);
        });
    },

    selectCard(index) {
      this.setSelectedCardIndex(index);
      this.fetchLeads();
    },
    loadItems() {
      this.fetchLeads()
        .then(() => {

        })
        .catch((error) => {
          console.error("Error fetching leads:", error);
        });
    },
    editLead(item) {
      
      this.fetchLeadById(item)
        .then(() => {
          this.openAddListDialog();
        })
        .catch((error) => {
          console.error("Error fetching lead for editing:", error);
        });
    },
    saveLeads(leadData) {
      if (leadData.id) {
       
        this.updateLead(leadData)
          .then(() => {
            console.log('Lead updated successfully.');
            this.closeAddListDialog();
          })
          .catch((error) => {
            console.error('Error updating lead:', error);
          });
      } else {
        
        this.saveLeads(leadData);
      }
    },
   
  },
  
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap");
.px-0 {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.m-0 {
  margin: 0 !important;
}

.xyz {
  max-width: 2400px;
}

.v-container {
  padding: 0px;
}

.font {
  font-family: "Inter", sans-serif;
  font-weight: 300; /* Adjust font-weight if needed */
}

.circle {
  background-color: rgb(23, 163, 23);
  width: 15px;
  height: 15px;
  border-radius: 50%; /* Ensure circle shape */
}

.circle-box {
  background-color: aliceblue;
  width: 25px;
  height: 25px;
  border-radius: 25%; /* Ensure circle shape */
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
}

.boxi {
  border-radius: 30px;
}
</style>
