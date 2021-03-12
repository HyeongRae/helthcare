<template>
  <div class="mb-12">
    <!-- row 선택 -->
    <div class="py-2">
      한 페이지당 row 개수 선택 :
      <input type="number" class="crow" v-model="row" @change="changeRow" />
    </div>

    <!-- 필터 -->
    <v-card elevation="1" tile class="py-1 px-1">
      <p>검색 필터</p>
      <v-row class="px-1">
        <v-col>
          <v-select :items="race" label="인종" @input="selectRace"></v-select>
        </v-col>
        <v-col>
          <v-select
            :items="ethnicity"
            label="민족"
            @input="selectEthnicity"
          ></v-select>
        </v-col>
      </v-row>
    </v-card>
    <div class="my-1">
      <p>적용되고 있는 필터</p>
      <p>
        인종 :
        <span v-for="(race, index) in filter.race_filter" :key="race + index">
          {{ race }}
          <button class="x_btn" @click="deleteRaceFilter(race)">x</button>
        </span>
      </p>

      <p>
        민족 :
        <span
          v-for="(eth, index) in filter.ethnicity_filter"
          :key="eth + index"
        >
          {{ eth }}
          <button class="x_btn" @click="deleteEthnicityFilter(eth)">x</button>
        </span>
      </p>
    </div>
    <!-- 테이블 -->
    <v-row no-gutters class="text-center">
      <v-col class="talbe_border">환자 id</v-col>
      <v-col class="talbe_border">성별</v-col>
      <v-col class="talbe_border" @click="changeSort">
        생년월일
        <span v-if="sort_flag == 0">ㅡ</span>
        <span v-if="sort_flag == 1">↑</span>
        <span v-if="sort_flag == 2">↓</span>
      </v-col>
      <v-col class="talbe_border">나이</v-col>
      <v-col class="talbe_border">인종</v-col>
      <v-col class="talbe_border">민족</v-col>
      <v-col class="talbe_border">사망 여부</v-col>
    </v-row>

    <div
      class="talbe_border"
      v-for="(person, index) in persons"
      :key="index"
      @click="checkPerson(person.person_id, index)"
      v-bind:class="{ fix: person.detail_active }"
    >
      <v-row no-gutters class="text-center">
        <v-col>{{ person.person_id }}</v-col>
        <v-col>{{ person.gender_source_value }}</v-col>
        <v-col>{{ person.birth_datetime }}</v-col>
        <v-col>{{ person.age }}</v-col>
        <v-col>{{ person.race_source_value }}</v-col>
        <v-col>{{ person.ethnicity_source_value }}</v-col>
        <v-col v-if="person.death == undefined"> ㅡ </v-col>
        <v-col v-else>{{ person.death.death_date }}</v-col>
      </v-row>
      <v-row
        v-bind:class="{ 'd-none': !person.detail_active }"
        v-if="detail_person[index] != undefined"
        no-gutters
      >
        방문 수 : {{ detail_person[index].visit }}
      </v-row>
      <v-row
        v-bind:class="{ 'd-none': !person.detail_active }"
        v-if="detail_person[index] != undefined"
        no-gutters
      >
        진단 :
        <v-chip
          small
          class="mx-1"
          v-for="(co, idx) in detail_person[index].condition_occurrence"
          :key="co.person_id + idx"
          >{{ co.condition_concept_id }}</v-chip
        >
      </v-row>
    </div>

    <!-- 페이징 -->
    <div width="1000px" class="text-center">
      <v-btn @click="LLClick" small> &lt;&lt; </v-btn>
      <v-btn @click="leftClick" small> &lt; </v-btn>
      <v-btn
        v-for="(num, index) in nums"
        :key="index"
        class="d-inline-block"
        width="10px"
        @click="getData(num)"
        small
      >
        {{ num }}
      </v-btn>
      <v-btn @click="rightClick" small> &gt; </v-btn>
      <v-btn @click="RRClick" small> &gt;&gt; </v-btn>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "Table",
  data() {
    return {
      persons: [],
      detail_person: [],
      row: 5,
      page: 1,
      Max_Page: 10,
      nums: [],
      filter: {
        race_filter: [],
        ethnicity_filter: []
      }
    };
  },
  computed: {
    ...mapState(["sort_flag", "race", "ethnicity"]),
    ...mapGetters(["paging", "getLastPage", "getPersonDetail"])
  },
  methods: {
    ...mapActions(["sortBirth"]),
    changeTableView() {
      this.detail_person = [];
      this.persons = this.paging(parseInt(this.row), this.page, this.filter);
    },
    changeRow() {
      this.initPages();
      this.changeTableView();
    },
    getData(num) {
      this.page = num;
      this.changeTableView();
    },
    checkPerson(id, index) {
      this.detail_person[index] = this.getPersonDetail(id);
      this.persons[index].detail_active = !this.persons[index].detail_active;
    },
    initPages() {
      this.page = 1;
      if (this.getLastPage(this.row, this.filter) < this.Max_Page)
        this.nums = Array.from(
          { length: this.getLastPage(this.row, this.filter) },
          (v, i) => i + 1
        );
      else this.nums = Array.from({ length: this.Max_Page }, (v, i) => i + 1);
    },
    leftClick() {
      if (this.nums[0] == 1) {
        return;
      }
      this.nums.pop();
      this.nums.unshift(this.nums[0] - 1);
    },
    rightClick() {
      if (
        this.nums[this.nums.length - 1] >=
        this.getLastPage(this.row, this.filter)
      ) {
        return;
      }
      this.nums.push(this.nums[this.nums.length - 1] + 1);
      this.nums.shift();
    },
    LLClick() {
      let temp = this.nums[0];
      let arr = [];
      for (let i = this.Max_Page; i > 0; i--) {
        if (temp - i < 1) break;
        arr.push(temp - i);
      }
      if (arr.length != 0) this.nums = arr;
      else {
        if (this.getLastPage(this.row, this.filter) < this.Max_Page)
          this.nums = Array.from(
            { length: this.getLastPage(this.row, this.filter) },
            (v, i) => i + 1
          );
        else this.nums = Array.from({ length: this.Max_Page }, (v, i) => i + 1);
      }
    },
    RRClick() {
      const lastPage = this.getLastPage(this.row, this.filter);

      let temp = this.nums[this.nums.length - 1];
      let arr = [];
      for (let i = 1; i <= this.Max_Page; i++) {
        if (temp + i > lastPage) break;
        arr.push(temp + i);
      }
      if (arr.length == 0)
        for (let i = this.Max_Page - 1; i >= 0; i--) {
          if (lastPage - i >= 1) arr.push(lastPage - i);
        }

      this.nums = arr;
    },
    changeSort() {
      this.sortBirth();
      this.changeTableView();
    },
    selectRace(race) {
      if (this.filter.race_filter.filter(r => r == race).length > 0) return;
      this.filter.race_filter.push(race);
      this.initPages();
      this.changeTableView();
    },
    selectEthnicity(ethnicity) {
      if (this.filter.ethnicity_filter.filter(e => e == ethnicity).length > 0)
        return;
      this.filter.ethnicity_filter.push(ethnicity);
      this.initPages();
      this.changeTableView();
    },
    deleteRaceFilter(race) {
      const idx = this.filter.race_filter.indexOf(race);
      this.filter.race_filter.splice(idx, 1);
      this.initPages();
      this.changeTableView();
    },
    deleteEthnicityFilter(ethnicity) {
      const idx = this.filter.ethnicity_filter.indexOf(ethnicity);
      this.filter.ethnicity_filter.splice(idx, 1);
      this.initPages();
      this.changeTableView();
    }
  },
  mounted() {
    this.changeTableView();
    this.nums = Array.from({ length: this.Max_Page }, (v, i) => i + 1);
  }
};
</script>

<style>
.crow {
  border: 1px black solid;
  width: 50px;
}

.talbe_border {
  border: 1px gray solid;
  padding: 5px !important;
}
</style>
