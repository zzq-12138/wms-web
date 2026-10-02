<template>
  <div>
    <div>
      <el-input v-model="name" placeholder="请输入物品名" suffix-icon="el-icon-search" style="width: 200px;
       margin-bottom: 5px;float: left" @keyup.enter.native="loadPost">
      </el-input>
      <el-select v-model="storage" placeholder="请选择仓库">
        <el-option
            v-for="item in storageData"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="goodstype" placeholder="请选择分类">
        <el-option
            v-for="item in goodstypeData"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
      </el-select>
      <el-button type="primary" style="margin-left: 5px" @click="loadPost">查询</el-button>
      <el-button type="success" style="margin-left: 5px" @click="resetParam">重置</el-button>

    </div>
    <el-table :data="tableData"
              :header-cell-style="{background: '#beaeae', color: '#2a1f1f'}"
              border
    >
      <el-table-column prop="id" label="ID" width="60">
      </el-table-column>
      <el-table-column prop="goodsname" label="物品名" width="150">
      </el-table-column>
      <el-table-column prop="storagename" label="仓库" width="150">
      </el-table-column>
      <el-table-column prop="goodstypename" label="分类" width="150">
      </el-table-column>
      <el-table-column prop="count" label="数量" width="60">
      </el-table-column>
      <el-table-column prop="adminname" label="操作人" width="150">
      </el-table-column>
      <el-table-column prop="username" label="申请人" width="150">
      </el-table-column>
      <el-table-column prop="createtime" label="操作时间" width="60">
      </el-table-column>
      <el-table-column prop="remark" label="备注">
      </el-table-column>


    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'RecordManage',
  data() {

    return {
      user: sessionStorage.getItem('CurUser') ? JSON.parse(sessionStorage.getItem('CurUser')) : {},
      storage: '',
      goodstype: '',
      goodstypeData: [],
      storageData: [],
      tableData: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      name: '',

      centerDialogVisible: false,
      form: {
        id: '',
        name: '',
        storage: '',
        goodstype: '',
        count: '',
        remark: ''
      },
    }
  },
  methods: {
    loadStorage() {
      this.$axios.get(this.$httpUrl + '/storage/list').then(response => response.data).then(response => {
        console.log(response);
        if (response.code !== 200) {
          alert('获取失败' + response.msg);
        } else {
          this.storageData = response.data;
        }
      }).catch(error => {
        console.log(error);
      });
    },
    loadGoodstype() {
      this.$axios.get(this.$httpUrl + '/goodstype/list').then(response => response.data).then(response => {
        console.log(response);
        if (response.code !== 200) {
          alert('获取失败' + response.msg);
        } else {
          this.goodstypeData = response.data;
        }
      }).catch(error => {
        console.log(error);
      });
    },
    loadPost() {
      this.$axios.post(this.$httpUrl + '/record/listPage', {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        param: {
          name: this.name,
          storage: this.storage + '',
          goodstype: this.goodstype + '',
          roleId: this.user.roleId + '',
          userId: this.user.id + '',
        }
      }).then(response => response.data).then(response => {
        console.log(response);
        if (response.code !== 200) {
          alert('获取失败' + response.msg);
        } else {
          this.tableData = response.data;
          this.total = response.total;
        }
      }).catch(error => {
        console.log(error);
      });
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.loadPost();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.loadPost();
    },
    resetParam() {
      this.name = '';
      this.pageNum = 1;
      this.pageSize = 10;
      this.storage = '';
      this.goodstype = '';
      this.loadPost();
    },

    /* eslint-disable */
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
            done(false);
            console.log('取消');
          });
    },
    /* eslint-disable */
    resetForm() {
      this.form = {
        id: '',
        name: '',
        remark: ''
      };
      this.$refs.form.resetFields();
    },
  },
  beforeMount() {
    //this.loadGet();
    this.loadGoodstype()
    this.loadStorage()
    this.loadPost()
  },
}
;
</script>

<style scoped>

</style>