<template>
  <div class="page">
    Second
  </div>
</template>
<script>

export default {
  name: 'Name', // Pascal命名
  components: {},
  props: [],
  data() {
    return {};
  },
  computed: {},
  watch: {
    // 对象写法
    // temObj: {
    //   handler(newVal, oldVal) {

    //   },
    //   deep: true, // 深度
    //   immediate: true, // 立即执行
    // },

    // temStr(val) {

    // },
  },
  filters: {},
  beforeCreate() {},
  created() {},
  mounted() {
    this.initPage();
  },
  methods: {
    initPage() {},
  },
};
</script>
<style scoped>
/* // @import "@/assets/css/common.scss"; */
</style>
