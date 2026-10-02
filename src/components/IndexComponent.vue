<script>
import AsidePage from "@/components/AsidePage.vue";
import HeaderPage from "@/components/HeaderPage.vue";
import asidePage from "@/components/AsidePage.vue";

export default {
  computed: {
    asidePage() {
      return asidePage
    }
  },
  components: {
    AsidePage,
    HeaderPage,
  },
  name: "IndexComponent",
  data() {
    return {
      isCollapse: false,
      asidePage_width: "200px",
      icon: 'el-icon-s-fold',
    };
  },
  methods: {
    doCollapse() {
      this.isCollapse = !this.isCollapse;
      if (this.isCollapse) {
        this.asidePage_width = "80px";
        this.icon = 'el-icon-s-unfold';
      } else {
        this.asidePage_width = "200px";
        this.icon = 'el-icon-s-fold';
      }
    },
  },
};
</script>

<template>
  <el-container style="height: 100%; border: 1px solid #eee">
    <el-aside :width="asidePage_width" style="background-color: rgb(238, 241, 246);margin-left: -1px">
      <AsidePage :isCollapse="isCollapse"></AsidePage>
    </el-aside>

    <el-container style="height: 100%">
      <el-header style="text-align: right; font-size: 12px;border-bottom: rgba(169,169,169,0.3) 1px solid">
        <HeaderPage @doCollapse="doCollapse" :icon="icon"></HeaderPage>
      </el-header>

      <el-main style="height: 100%">
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.el-header {
  #background-color: #B3C0D1
;
  color: #333;
  line-height: 60px;
}

.el-main {
  padding: 5px;
}

.el-aside {
  color: #333;
  margin-left: -1px;
}
</style>