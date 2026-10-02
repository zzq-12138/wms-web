<script>
export default {
  name: 'HeaderPage',
  data() {
    return {
      user: sessionStorage.getItem('CurUser') ? JSON.parse(sessionStorage.getItem('CurUser')) : {},
    };
  },
  props: {
    icon: {
      type: String,
    }
  },
  methods: {
    toUser() {
      console.log('toUser');

      this.$router.push("/HomePage");
    },
    logout() {
      console.log('logout');

      this.$confirm('确定退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true,
        type: 'warning'
      }).then(() => {

        this.$message({
          type: 'success',
          message: '已退出登录'
        });

        this.$router.push("/");
        sessionStorage.clear();

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        });
      });

    },
    collapse() {
      this.$emit('doCollapse');
    }
  },
  created() {
    this.$router.push("/HomePage");
  }
};
</script>

<template>
  <div style="display: flex;line-height: 60px">
    <div>
      <i :class="icon" style="font-size: 20px;line-height: 60px;cursor: pointer" @click="collapse"></i>
    </div>
    <div style="flex : 1; text-align: center;font-size: 34px" class="el-header">
      <span>欢迎来到仓库管理系统</span>
    </div>
    <span style="font-size: 15px">{{user.name}}</span>
    <el-dropdown>
      <i class="el-icon-arrow-down" style="margin-left: 5px"></i>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="toUser">个人中心</el-dropdown-item>
        <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>

</template>

<style scoped>

</style>