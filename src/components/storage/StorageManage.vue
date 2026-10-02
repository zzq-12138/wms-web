<script>
export default {
  name: 'StorageManage',
  data() {

    return {
      tableData: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      name: '',

      centerDialogVisible: false,
      form: {
        id: '',
        name: '',
        remark: ''
      },
      rules: {
        name: [
          {required: true, message: '请输入仓库名', trigger: 'blur'},
          {min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    mod(row) {

      this.centerDialogVisible = true;

      this.$nextTick(() => {
        this.form.id = row.id;
        this.form.name = row.name;
        this.form.remark = row.remark;
      });
    },
    del(id) {
      this.$axios.get(this.$httpUrl + '/storage/delete?id=' + id).then(response => response.data).then(response => {
        if (response.code !== 200) {
          this.$message({
            message: '删除失败' + response.msg,
            type: 'error'
          });
        } else {
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.centerDialogVisible = false;
          if (this.tableData.length === 1 && this.pageNum > 1) {
            this.pageNum--;
          }
          this.loadPost();
        }
      }).catch(error => {
        console.log(error);
      });
    },
    loadPost() {
      this.$axios.post(this.$httpUrl + '/storage/listPage', {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        param: {
          name: this.name,
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
    },
    add() {
      this.centerDialogVisible = true;
      this.$nextTick(() => {
        this.resetForm();
      });
    },
    doSave() {
      this.$axios.post(this.$httpUrl + '/storage/save', this.form).then(response => response.data).then(response => {
        console.log(response);
        if (response.code !== 200) {
          this.$message({
            message: '新增失败' + response.msg,
            type: 'error'
          });
        } else {
          this.$message({
            message: '新增成功',
            type: 'success'
          });
          this.centerDialogVisible = false;
          this.loadPost();
          this.resetForm();
        }
      }).catch(error => {
        console.log(error);
      });
    },
    doMod() {
      this.$axios.post(this.$httpUrl + '/storage/update', this.form).then(response => response.data).then(response => {
        if (response.code !== 200) {
          this.$message({
            message: '修改失败' + response.msg,
            type: 'error'
          });
        } else {
          this.$message({
            message: '修改成功',
            type: 'success'
          });
          this.centerDialogVisible = false;
          this.loadPost();
          this.resetForm();
        }
      }).catch(error => {
        console.log(error);
      });
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.id) {
            this.doMod();
          } else {
            this.doSave();
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });

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
    this.loadPost()
  },
}
;
</script>

<template>
  <div>
    <div>
      <el-input v-model="name" placeholder="请输入仓库名" suffix-icon="el-icon-search" style="width: 200px;
       margin-bottom: 5px;float: left" @keyup.enter.native="loadPost">
      </el-input>
      <el-button type="primary" style="margin-left: 5px" @click="loadPost">查询</el-button>
      <el-button type="success" style="margin-left: 5px" @click="resetParam">重置</el-button>
      <el-button type="primary" style="margin-left: 5px" @click="add">新增</el-button>

    </div>
    <el-table :data="tableData"
              :header-cell-style="{background: '#beaeae', color: '#2a1f1f'}"
              border
    >
      <el-table-column prop="id" label="ID" width="60">
      </el-table-column>
      <el-table-column prop="name" label="仓库名" width="150">
      </el-table-column>
      <el-table-column prop="remark" label="备注">
      </el-table-column>
      <el-table-column prop="operate" label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="success" @click="mod(scope.row)">编辑</el-button>
          <el-popconfirm
              title="确定删除吗？"
              @confirm="del(scope.row.id)"
              style="margin-left: 5px"
          >
            <el-button slot="reference" size="small" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
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

    <el-dialog
        title="提示"
        :visible.sync="centerDialogVisible"
        width="30%"
        :before-close="handleClose"
        center>
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">

        <el-form-item label="仓库名" prop="name">
          <el-col :span="20">
            <el-input v-model="form.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-col :span="20">
            <el-input type="textarea" v-model="form.remark"></el-input>
          </el-col>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="save">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<style scoped>

</style>