<template>
  <v-row no-gutters>
    <v-col cols="12" sm="4"
      ><div class="chart"><PieChart :chartOptions="genderData" /></div
    ></v-col>
    <v-col cols="12" sm="4"
      ><div class="chart"><PieChart :chartOptions="raceData" /></div
    ></v-col>
    <v-col cols="12" sm="4"
      ><div class="chart"><PieChart :chartOptions="ethnicityData" /></div
    ></v-col>
  </v-row>
</template>

<script>
import PieChart from "@/components/PieChart.vue";
import { mapGetters } from "vuex";

export default {
  name: "Charts",
  data() {
    return {
      genderData: {
        series: [
          {
            name: "성별",
            type: "pie",
            data: []
          }
        ]
      },
      raceData: {
        series: [
          {
            name: "인종",
            type: "pie",
            data: []
          }
        ]
      },
      ethnicityData: {
        series: [
          {
            name: "민족",
            type: "pie",
            data: []
          }
        ]
      }
    };
  },
  components: {
    PieChart
  },
  computed: {
    ...mapGetters(["getGenderPieData", "getRacePieData", "getEthnicityPieData"])
  },
  methods: {},
  created() {
    this.genderData.series[0].data = this.getGenderPieData;
    this.raceData.series[0].data = this.getRacePieData;
    this.ethnicityData.series[0].data = this.getEthnicityPieData;
  }
};
</script>

<style>
.chart {
  height: 300px;
}
</style>
