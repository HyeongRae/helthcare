import Vue from "vue";
import Vuex from "vuex";
import PersonData from "../assets/data/person.json";
import ConditonOccurrenceData from "../assets/data/condition_occurrence.json";
import DeathData from "../assets/data/death.json";
import VisitOccurrenceData from "../assets/data/visit_occurrence.json";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    person: [],
    visit_occurrence: [],
    condition_occurrence: [],
    gender: [],
    death: [],
    race: [],
    ethnicity: [],
    sort_flag: 0
  },
  getters: {
    paging: state => (row, page, filter) => {
      return state.person
        .filter(function(p) {
          if (
            filter.race_filter.length != 0 &&
            !filter.race_filter.includes(p.race_source_value)
          )
            return false;
          if (
            filter.ethnicity_filter.length != 0 &&
            !filter.ethnicity_filter.includes(p.ethnicity_source_value)
          )
            return false;
          return true;
        })
        .slice(
          row * (page - 1),
          row * (page - 1) + row >= state.person.length
            ? state.person.length
            : row * (page - 1) + row
        );
    },
    //마지막 페이지
    getLastPage: state => (row, filter) => {
      let p = state.person.filter(function(p) {
        if (
          filter.race_filter.length != 0 &&
          !filter.race_filter.includes(p.race_source_value)
        )
          return false;
        if (
          filter.ethnicity_filter.length != 0 &&
          !filter.ethnicity_filter.includes(p.ethnicity_source_value)
        )
          return false;
        return true;
      });

      if (p.length % row == 0) return parseInt(p.length / row);
      else return parseInt(p.length / row + 1);
    },
    getPersonDetail: state => id => {
      return {
        visit: state.visit_occurrence.filter(vo => vo.person_id == id).length,
        condition_occurrence: state.condition_occurrence.filter(
          co => co.person_id == id
        )
      };
    },
    getGenderPieData: state => {
      let data = [];
      state.gender.forEach(gender =>
        data.push({
          name: gender,
          value: state.person.filter(p => p.gender_source_value == gender)
            .length
        })
      );
      return data;
    },
    getRacePieData: state => {
      let data = [];
      state.race.forEach(race =>
        data.push({
          name: race,
          value: state.person.filter(p => p.race_source_value == race).length
        })
      );
      return data;
    },
    getEthnicityPieData: state => {
      let data = [];
      state.ethnicity.forEach(ethnicity =>
        data.push({
          name: ethnicity,
          value: state.person.filter(p => p.ethnicity_source_value == ethnicity)
            .length
        })
      );
      return data;
    }
  },
  mutations: {
    setGender(state, data) {
      state.gender = data;
    },
    setRace(state, data) {
      state.race = data;
    },
    setEthnicity(state, data) {
      state.ethnicity = data;
    },
    setDeath(state, data) {
      state.death = data;
    },
    setPerson(state, data) {
      state.person = data;
    },
    setVisitOccurrence(state, data) {
      state.visit_occurrence = data;
    },
    setConditionOccurrence(state, data) {
      state.condition_occurrence = data;
    },
    sortUpBirth: state => {
      state.person.sort(function(a, b) {
        return new Date(a.birth_datetime) - new Date(b.birth_datetime);
      });
    },
    sortDownBirth: state => {
      state.person.sort(function(a, b) {
        return new Date(b.birth_datetime) - new Date(a.birth_datetime);
      });
    },
    initPersonData: state => {
      function calcAge(birthdate) {
        const today = new Date();
        const birth = new Date(birthdate);
        let age = today.getFullYear() - birth.getFullYear();
        const month = today.getMonth() - birth.getMonth();
        if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) {
          age--;
        }
        return age;
      }

      const person = PersonData.person.map(d => ({
        person_id: d.person_id,
        gender_source_value: d.gender_source_value,
        birth_datetime: d.birth_datetime.split(" ")[0],
        age: calcAge(d.birth_datetime),
        race_source_value: d.race_source_value,
        ethnicity_source_value: d.ethnicity_source_value,
        death: state.death.find(o => {
          if (o.person_id == d.person_id) return o.death_date;
        }),
        detail_active: false
      }));
      state.person = person;
    }
  },
  actions: {
    initData({ commit }) {
      //데이터 전처리
      const death = DeathData.death.map(d => ({
        person_id: d.person_id,
        death_date: d.death_date
      }));
      commit("setDeath", death);
      commit("initPersonData");

      const conditonOccurrence = ConditonOccurrenceData.condition_occurrence.map(
        d => ({
          person_id: d.person_id,
          visit_occurrence_id: d.visit_occurrence_id,
          condition_start_date: d.condition_start_date,
          condition_end_date: d.condition_end_date,
          condition_concept_id: d.condition_concept_id
        })
      );
      commit("setConditionOccurrence", conditonOccurrence);

      const visitOccurrence = VisitOccurrenceData.visit_occurrence.map(d => ({
        person_id: d.person_id,
        visit_occurrence_id: d.visit_occurrence_id
      }));
      commit("setVisitOccurrence", visitOccurrence);

      //성별 종류 모아두기
      let gender = this.state.person.map(d => d.gender_source_value);
      gender = Array.from(new Set(gender));
      commit("setGender", gender);

      //인종 종류 모아두기
      let race = this.state.person.map(d => d.race_source_value);
      race = Array.from(new Set(race));
      commit("setRace", race);

      //민족 종류 모아두기
      let ethnicity = this.state.person.map(d => d.ethnicity_source_value);
      ethnicity = Array.from(new Set(ethnicity));
      commit("setEthnicity", ethnicity);
    },
    sortBirth({ commit }) {
      switch (this.state.sort_flag) {
        case 0:
          commit("sortUpBirth");
          this.state.sort_flag = 1;
          break;

        case 1:
          commit("sortDownBirth");
          this.state.sort_flag = 2;
          break;

        case 2: {
          commit("initPersonData");
          this.state.sort_flag = 0;
          break;
        }
      }
    }
  }
});
