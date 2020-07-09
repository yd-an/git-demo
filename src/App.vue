<template>
  <div id="app">
    <main>
      <page-aside></page-aside>
      <div class="content-container">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script>
import PageAside from '@/components/common/PageAside';

export default {
  name: 'App',
  components: {
    PageAside,
  },
};
</script>

<style lang="scss">
#app {
  display: flex;
  flex-direction: column;
  min-width: 1366px;
  height: 100%;
  & main {
    flex: 1;
    display: flex;
    overflow: hidden;
    & .content-container {
      position: relative;
      flex: 1;
      padding:30px 40px;
      min-height: 100%;
      overflow: auto;
      background-color: #f4f3f9;
    }
  }
}

</style>
