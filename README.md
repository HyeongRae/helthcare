# 요구사항 우선순위

|번호|내용|순위|
|------|---|---|
|1|테이블|상|
|1-1|목록|상|
|1-2|페이징|상|
|1-3|정렬|하|
|2|필터|중|
|3|상세정보|중|
|4|그래프|중|

# 구현 설명
1. framework : Vue.js

2. library
○ vuetify : UI 라이브러리
○ vuex : 상태 관리, 저장소 라이브러리
○ vue-echarts-v3 : 그래프 라이브러리
  link: https://github.com/xlsdg/vue-echarts-v3

3. components 
Charts.vue : 그래프를 모아둔 컴포넌트
PieChart.vue : 그래프 구현
Table.vue : 테이블 구현

테이블과 파이그래프가 그려지는 Home.vue가 created 될때 데이터를 전처리하도록 하였습니다.

데이터를 전처리 과정에서 사망여부는 pserson과 합치고 필터를 위해 성별, 인종, 민족의 종류를 따로 저장해두었습니다.

테이블에서 데이터를 불러올때 상세정보까지 함께 불러오면 속도가 느려져서 환자를 클릭했을 경우에 선택된 것만 불러오도록 하였습니다.

필터는 인종과 민족 두가지를 구현하였는데 select에서 선택하면 하단에 어떤 필터가 적용되고 있는지 표기하였습니다.
x를 투르면 해당 필터를 제거할 수 있습니다.

페이지에 보이는 행의 개수는 input type number에 입력하면 실시간으로 적용되게 구현하였습니다.

정렬은 오름차순, 내림차순, 초기화 세가지로 구현하였습니다.

그래프는 이전에 사용해보았던 echart 라이브러리를 활용하여 구현하였습니다.


# 구현하지 못한 것
필터 중에서 성별, 나이, 사망여부는 구현하지 않았습니다.

○ 생각한 구현 방법

 인종과 민족의 필터를 구현한 부분 상단에 v-row를 추가하여 
성별 필터, 사망여부는 checkbox를 활용하여 선택 및 해제를 할수 있게 하고
세부적인 동작은 인종과 민족의 필터를 구현한 부분과 같이 할 것입니다.
나이는 input type number를 활용하여 1 ~ 4 와 같이 나이를 선택할수 있게 하고
동작은 인종과 민족의 필터를 구현한 부분과 같이 할 것입니다.


# 실행 방법
1. front/src/assets/data 에 데이터 추가
2. front에서 yarn install 후 yarn serve

