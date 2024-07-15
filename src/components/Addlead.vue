<template>
    <v-dialog v-model="dialogVisible" max-width="800">
      <v-card class="ma-8 card">
        <div class="head-con">
          <span class=" heading text-h5">{{ lead ? 'Edit Lead' : 'Add Lead' }}<br><span class="heading text-h6 font-weight-light ">Please
              enter details here</span></span>
          <v-icon @click="closeDialog" class="close-icon">mdi-close</v-icon>
        </div>
        <v-card-text>
          <v-row dense>
            <v-col cols="12" md="6" sm="6">
              <v-text-field v-model="formData.firstName" label="First name*" variant="outlined" density="compact" required></v-text-field>
            </v-col>
            <v-col cols="12" md="6" sm="6">
              <v-text-field v-model="formData.lastName" variant="outlined" label="Last name*" density="compact" persistent-hint required></v-text-field>
            </v-col>
            <v-col cols="12" md="12" sm="6">
              <v-text-field v-model="formData.mobileNumber" label="Mobile Number" variant="outlined" density="compact"></v-text-field>
            </v-col>
            <v-col cols="12" md="12" sm="6">
              <v-text-field v-model="formData.email" label="Email*" variant="outlined" density="compact" required></v-text-field>
            </v-col>
            <v-col cols="12" sm="12">
              <v-autocomplete v-model="formData.selectedCities"
                :items="cities.map(city => city.name)"
                item-value="name"
                item-text="name"
                variant="outlined"
                label="Select City"
                density="compact"
                single-line
                clearable
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="12">
              <v-autocomplete v-model="formData.selectedStates"
                :items="states.map(state => state.name)"
                item-value="name"
                item-text="name"
                variant="outlined"
                label="State"
                density="compact"
                single-line
                clearable
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="12">
              <v-autocomplete v-model="formData.referredBy"
                :items="['sahil', 'harsh', 'pranjal', 'sneha', 'ritesh', 'Nilesh', 'Priya', 'Laxmi', 'Karan']"
                variant="outlined"
                label="Referred By"
                density="compact"
                auto-select-first
                single-line
                clearable
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="12">
              <v-autocomplete v-model="formData.source"
                :items="['IVR', 'PLR']"
                variant="outlined"
                label="Source"
                density="compact"
                auto-select-first
                single-line
                clearable
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="12">
              <v-textarea v-model="formData.notes"
                label="Notes"
                variant="outlined"
                density="compact"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" class="btn" text="Save" variant="flat" @click="saveLeads"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import { v4 as uuidv4 } from 'uuid'; 
  export default {
    props: {
      dialog: Boolean,
      lead: Object,
    },
    data() {
      return {
        dialogVisible: false,
        formData: {
          id: '',
          firstName: '',
          lastName: '',
          mobileNumber: '',
          email: '',
          selectedCities: [],
          selectedStates: [],
          referredBy: [],
          source: [],
          notes: '',
          createdAt: null,
        }
      };
    },
    computed: {
      cities() {
        return this.$store.state.cities;
      },
      states() {
        return this.$store.state.states;
      },
      state(){
        return this.$store.state.selectedCardIndex;
      }
    },
    watch: {
      dialog(newVal) {
        this.dialogVisible = newVal;
      },
      dialogVisible(newVal) {
        this.$emit('update:dialog', newVal);
      },
      lead: {
      handler(newVal) {
        if (newVal) {
          this.formData.id = newVal.id;
          this.formData.firstName = newVal.firstName;
          this.formData.lastName = newVal.lastName;
          this.formData.mobileNumber = newVal.mobileNumber;
          this.formData.email = newVal.email;
          this.formData.selectedCities = newVal.selectedCities;
          this.formData.selectedStates = newVal.selectedStates;
          this.formData.referredBy = newVal.referredBy;
          this.formData.source = newVal.source;
          this.formData.notes = newVal.notes;
        }
      },
      immediate: true,
    },
    },
    methods: {
      closeDialog() {
        this.dialogVisible = false;
        this.resetForm();
      },


      saveLeads() {
  if (!this.formData.id) {
    // Generate unique ID for new lead
    this.formData.id = uuidv4(); // Using UUID as an example

    this.$store.dispatch('saveLeads', {
      ...this.formData,
      createdAt: new Date().toISOString().split("T")[0], 
      status:this.state// Ensure createdAt is set

    })
      .then(() => {
        console.log('Lead saved successfully.');
        this.closeDialog();
      })
      .catch(error => {
        console.error('Error saving lead:', error);
      });
  } else {
    
    this.$store.dispatch('updateLead', this.formData)
      .then(() => {
        console.log('Lead updated successfully.');
        this.closeDialog();
      })
      .catch(error => {
        console.error('Error updating lead:', error);
      });
  }
},
      resetForm() {
        this.formData = {
          id:'',
          firstName: '',
          lastName: '',
          mobileNumber: '',
          email: '',
          selectedCities: [],
          selectedStates: [],
          referredBy: [],
          source: [],
          notes: ''
        };
      }
    },
    created() {
      // Fetch states and cities when component is created
      this.$store.dispatch("fetchStates");
      this.$store.dispatch("fetchCities");
    },
  };
  </script>
  
  <style scoped>
  .head-con {
      background-color: #3C91F4;
      ;
      height: 90px;
      padding-top: 2px;
  }
  
  .card {
  
      width: 50rem;
      height: 52rem;
  }
  
  .btn {
      width: 200px;
      height: 40px;
  }
  
  .heading {
      color: white;
      font-weight: bold;
      margin: 25px;
  }
  
  .v-row--dense>.v-col,
  .v-row--dense>[class*=v-col-] {
      padding: 2px;
  }
  
  .v-icon {
      margin-left: 28rem;
      color: white;
  }
  </style>
  