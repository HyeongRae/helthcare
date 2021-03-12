<template>
  <IEcharts :option="chartOptions" :resizable="true" />
</template>

<script>
import IEcharts from "vue-echarts-v3/src/full.js";
//import echarts from "echarts/lib/echarts";
export default {
  name: "PieChart",
  components: {
    IEcharts
  },
  props: ["chartOptions"]
};
</script>

<style></style>
