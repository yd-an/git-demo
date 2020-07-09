<template>
  <div class="app">
    <p class="text">我的首页</p>
  </div>
</template>

<script>

export default {
  name: 'Home',
  components: {},
  data() {
    return {
      circleBoxStyle1: [],
    };
  },
  // created() {
  // this.getAlertsNum();
  // this.getAlarmRule();
  // },
  // methods: {
  // 获取报警评分
  // getAlertsNum() {
  //   const param = {
  //     applicationCode: '1',
  //     processed: '2',
  //   };
  //   this.$api.post('/content/summary/program/today', param).then(res => {
  //     console.log(res);
  //   });
  // },
  // getAlarmRule() {
  //   const params = {
  //     applicationCode: 1,
  //   };
  //   this.$api
  //     .post('/content/summary/last7Days/method/percent', params)
  //     .then(res => {
  //       this.pieList = res.rspData.map((item, index) => {
  //         return {
  //           value: item.count,
  //           legendname: item.alarmMethod,
  //           name: item.alarmMethod,
  //           itemStyle: { color: this.colorList[index] },
  //         };
  //       });
  //     });
  // },
  // },
};

</script>

<style lang="scss" scope>
.app {
  & .text {
    color: aqua;
  }
}
</style>
