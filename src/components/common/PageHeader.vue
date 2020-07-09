<template>
  <div class="page">
    <el-menu
      class="nav"
      :default-active="activeIndex"
      background-color="#2d3664"
      text-color="#c0c4cc"
      active-text-color="#fff"
      mode="horizontal"
      :router="true"
    >
      <el-menu-item index="/first">first</el-menu-item>
      <el-menu-item index="/second">second</el-menu-item>
      <el-menu-item index="/third">third</el-menu-item>
    </el-menu>
  </div>
</template>
<script>

export default {
  name: 'Name', // Pascal命名
  components: {},
  props: [],
  data() {
    return {
      activeIndex: '/first',
    };
  },
  computed: {},
  watch: {
    $route() {
      // this.activeIndex = typeof this.$route.meta !== 'undefined' ? `/${this.$route.meta.activeItem.split('/')[1]}` : '';
    },
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
<style lang="scss" scoped>
/* // @import "@/assets/css/common.scss"; */
.page {
}
</style>
