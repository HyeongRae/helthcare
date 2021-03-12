<template>
  <div class="home">
    <Charts />
    <Table class="px-3" />
  </div>
</template>

<script>
// @ is an alias to /src
import Table from "@/components/Table.vue";
import Charts from "@/components/Charts.vue";
import { mapActions } from "vuex";

export default {
  name: "Home",
  components: {
    Table,
    Charts
  },
  methods: {
    ...mapActions({
      initData: "initData"
    })
  },
  created() {
    this.initData();
  }
};
</script>
<style></style>
