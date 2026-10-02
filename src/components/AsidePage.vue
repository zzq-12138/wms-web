<script>
export default {
  name: 'AsidePage',
  data() {
    return {};
  },
  computed: {
    "menu": {
      get() {
        return this.$store.state.menu;
      },
    }
  },
  props: {
    isCollapse: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<template>
  <el-menu
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      style="height: 100%;text-align: left"
      default-active="/HomePage"
      :collapse="isCollapse"
      :collapse-transition="false"
      router
  >
    <el-menu-item index="/HomePage">
      <i class="el-icon-s-home" style="vertical-align: middle"></i>
      <span slot="title">首页</span>
    </el-menu-item>

    <el-menu-item :index="'/'+item.menuclick" v-for="(item, index) in menu" :key="index">
      <i :class="item.menuicon" style="vertical-align: middle"></i>
      <span slot="title">{{item.menuname}}</span>
    </el-menu-item>

  </el-menu>
</template>

<style scoped>
.el-menu-item {

}

</style>