<template>
  <div class="page">
    Third
  </div>
</template>
<script type="text/ecmascript-6">
/**
 * @name 组件名
 * @author your name
 * @description 简单描述
 */

// js
// import assetsIs from "@/assets/js/assetsIs"; //export default
// import { api1, api2 } from "@/assets/js/api"; //export多个
// 公共组件
// import header from "@/components/header";
// 本模块组件
// import dialogCreate from "views/module_name/component/dialogCreate";

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
