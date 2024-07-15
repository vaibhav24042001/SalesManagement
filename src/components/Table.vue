<template>
  <div>
    <v-data-table
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="serverItems"
      :hide-default-footer="false"
      :loading="loading"
      :search="search"
      item-value="id"
      class="table"
    >
      <template v-slot:item.action="{ item }">
        <v-btn
          class="mr-1"
          color="grey"
          variant="outlined"
          @click="editItem(item)"
          >Edit</v-btn
        >
        <v-btn
          class="mr-1"
          variant="outlined"
          color="grey"
          @click="deleteItem(item)"
          >Delete</v-btn
        >
        <v-btn
          variant="outlined"
          color="grey"
          rounded="lg"
          size="40"
          icon="mdi-dots-vertical"
        ></v-btn>
      </template>
    </v-data-table>
   
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "Table",
  props: {
    selectedCardIndex: Number,
  },
  data() {
    return {
      itemsPerPage: 10,
      headers: [
        {
          title: "Registration Date",
          align: "center",
          value: "RegistrationDate",
        },
        { title: "Client Name", align: "center", value: "ClientName" },
        { title: "Contact", align: "center", value: "Contact" },
        { title: "Refered By", align: "center", value: "ReferedBy" },
        { title: "Source", align: "center", value: "Source" },
        { title: "Action", key: "action", align: "center", sortable: false },
      ],
      search: "",
      serverItems: [],
      loading: true,
    };
  },

  computed: {
    ...mapState(["leads"]),
    
  },

  watch: {
    leads: {
      handler: "loadItems", // Watch for changes in leads
      immediate: true, // Trigger immediately on component load
    },
  },
  mounted() {
    this.fetchLeads();
  },
  methods: {
    ...mapActions(["fetchLeads", "deleteLead", "editLead"]),

    loadItems() {
      this.loading = true;
      // Here, update `serverItems` with the mapped `leads` data

      // Map leads to serverItems
      this.serverItems = this.leads.map((lead) => ({
        RegistrationDate: lead.createdAt, // Replace with actual date field from lead
        ClientName: `${lead.firstName} ${lead.lastName}`,
        Contact: lead.mobileNumber,
        ReferedBy: lead.referredBy,
        Source: lead.source,
        id: lead.id, // Assuming `id` is a unique identifier for each lead
        ...lead, // Include other fields as needed
      }));

      this.loading = false;
    },

    async editItem(item) {
      try {
        console.log(item);
        await this.editLead(item.id);
        console.log("Lead edited successfully.",item.id);
        this.$emit("edit-lead", item);
      } catch (error) {
        console.error("Error editing lead:", error);
      }
    },


    deleteItem(item) {
      console.log(item);
      if (confirm("Are you sure you want to delete this lead?")) {
        this.deleteLead(item.id)
          .then(() => {
            console.log("Lead deleted successfully.");
          })
          .catch((error) => {
            console.error("Error deleting lead:", error);
          });
      }
    },
  },
};
</script>

<style scoped>
.table {
  font-size: 20px;
}

.v-data-table__tr {
  height: 72px;
}

.v-data-table-header th {
  color: #808080 !important;
}
</style>
