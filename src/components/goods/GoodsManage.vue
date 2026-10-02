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

      <el-button type="primary" style="margin-left: 5px" v-if="user.roleId!==2" @click="inGoods">入库</el-button>
      <el-button type="primary" style="margin-left: 5px" v-if="user.roleId!==2" @click="outGoods">出库</el-button>
      <el-button type="primary" style="margin-left: 5px" @click="add" v-if="user.roleId!==2">新增</el-button>

    </div>
    <el-table :data="tableData"
              :header-cell-style="{background: '#beaeae', color: '#2a1f1f'}"
              border
              highlight-current-row
              @current-change="selectCurrentChange"
    >
      <el-table-column prop="id" label="ID" width="60">
      </el-table-column>
      <el-table-column prop="name" label="物品名" width="150">
      </el-table-column>
      <el-table-column prop="storage" label="仓库" width="150" :formatter="formatStorage">
      </el-table-column>
      <el-table-column prop="goodstype" label="分类" width="150" :formatter="formatGoodsType">
      </el-table-column>
      <el-table-column prop="count" label="数量" width="60">
      </el-table-column>
      <el-table-column prop="remark" label="备注">
      </el-table-column>

      <el-table-column prop="operate" label="操作" v-if="user.roleId!==2">
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

        <el-form-item label="物品名" prop="name">
          <el-col :span="20">
            <el-input v-model="form.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="仓库名" prop="storage">
          <el-col :span="20">
            <el-select v-model="form.storage" placeholder="请选择仓库">
              <el-option
                  v-for="item in storageData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="分类名" prop="goodstype">
          <el-col :span="20">
            <el-select v-model="form.goodstype" placeholder="请选择分类">
              <el-option
                  v-for="item in goodstypeData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="数量" prop="count">
          <el-col :span="20">
            <el-input v-model="form.count"></el-input>
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

    <el-dialog
        title="出入库"
        :visible.sync="inDialogVisible"
        width="30%"
        :before-close="handleClose"
        center>

      <el-dialog
          width="75%"
          title="用户选择"
          :visible.sync="innerVisible"
          append-to-body>

        <SelectUser @doSelectUser="doSelectUser"></SelectUser>

        <span slot="footer" class="dialog-footer">
          <el-button @click="inDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmUser">确 定</el-button>
        </span>
      </el-dialog>

      <el-form ref="form1" :rules="rules1" :model="form1" label-width="80px">

        <el-form-item label="物品名">
          <el-col :span="20">
            <el-input v-model="form1.goodsname" readonly></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="申请人">
          <el-col :span="20">
            <el-input v-model="form1.username" readonly @click.native="selectUser"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="数量" prop="count">
          <el-col :span="20">
            <el-input v-model="form1.count"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-col :span="20">
            <el-input type="textarea" v-model="form1.remark"></el-input>
          </el-col>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
       <el-button @click="inDialogVisible = false">取 消</el-button>
       <el-button type="primary" @click="doInGoods">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SelectUser from "@/components/user/SelectUser.vue";

export default {
  name: 'GoodsManage',
  components: {SelectUser},
  data() {

    let checkCount = (rule, value, callback) => {
      if (value === '' || value === null || value === undefined) {
        callback();
      } else if (!/^[0-9]+$/.test(value)) {
        callback(new Error('只能输入正整数数字'));
      } else if (parseInt(value, 10) > 999999999) {
        callback(new Error('数量不能大于999999999'));
      } else {
        callback();
      }
    };

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
      templateUser: {},
      currentRow: {},
      centerDialogVisible: false,
      inDialogVisible: false,
      innerVisible: false,
      form: {
        id: '',
        name: '',
        storage: '',
        goodstype: '',
        count: '',
        remark: ''
      },
      form1: {
        goods: '',
        goodsname: '',
        count: '',
        remark: '',
        username: '',
        userid: '',
        adminId: '',
        action: '1',
      },
      rules: {
        name: [
          {required: true, message: '请输入物品名', trigger: 'blur'},
        ], storage: [
          {required: true, message: '请选择仓库名', trigger: 'blur'},
        ], goodstype: [
          {required: true, message: '请选择物品分类名', trigger: 'blur'},
        ], count: [
          {required: true, message: '请输入数量', trigger: 'blur'},
          {pattern: /^[0-9]*$/, message: '只能输入正整数数字', trigger: 'blur'},
          {validator: checkCount, trigger: 'blur'}
        ],
      },
      rules1: {}
    }
  },
  methods: {
    doSelectUser(val) {
      this.templateUser = val;
    },
    confirmUser() {
      this.form1.username = this.templateUser.name;
      this.form1.userid = this.templateUser.id;
      this.innerVisible = false;
    },
    selectUser() {
      this.innerVisible = true;
    },
    selectCurrentChange(val) {
      this.currentRow = val;
    },
    formatStorage(row) {
      let temp = this.storageData.find(item => {
        return item.id === row.storage;
      })

      return temp ? temp.name : row.storage;
    },
    formatGoodsType(row) {
      let temp = this.goodstypeData.find(item => {
        return item.id === row.goodstype;
      })

      return temp ? temp.name : row.goodstype;
    },
    mod(row) {

      this.centerDialogVisible = true;

      this.$nextTick(() => {
        this.form.id = row.id;
        this.form.name = row.name;
        this.form.remark = row.remark;
        this.form.storage = row.storage;
        this.form.goodstype = row.goodstype;
        this.form.count = row.count;
      });
    },
    del(id) {
      this.$axios.get(this.$httpUrl + '/goods/delete?id=' + id).then(response => response.data).then(response => {
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
      this.$axios.post(this.$httpUrl + '/goods/listPage', {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        param: {
          name: this.name,
          storage: this.storage + '',
          goodstype: this.goodstype + ''
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
    inGoods() {
      if (!this.currentRow.id) {
        alert('请先选择物品');
        return;
      }

      this.inDialogVisible = true;
      this.$nextTick(() => {
        this.resetInForm();
      });

      this.form1.goodsname = this.currentRow.name;
      this.form1.goods = this.currentRow.id;
      this.form1.adminId = this.user.id;
      this.form1.action = '1';
    },
    outGoods() {
      if (!this.currentRow.id) {
        alert('请先选择物品');
        return;
      }

      this.inDialogVisible = true;
      this.$nextTick(() => {
        this.resetInForm();
      });

      this.form1.goodsname = this.currentRow.name;
      this.form1.goods = this.currentRow.id;
      this.form1.adminId = this.user.id;
      this.form1.action = '2';
    },
    add() {
      this.centerDialogVisible = true;
      this.$nextTick(() => {
        this.resetForm();
      });
    },
    doSave() {
      this.$axios.post(this.$httpUrl + '/goods/save', this.form).then(response => response.data).then(response => {
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
    doInGoods() {
      this.$axios.post(this.$httpUrl + '/record/save', this.form1).then(response => response.data).then(response => {
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
          this.inDialogVisible = false;
          this.loadPost();
          this.resetInForm();
        }
      }).catch(error => {
        console.log(error);
      });
    },

    doMod() {
      this.$axios.post(this.$httpUrl + '/goods/update', this.form).then(response => response.data).then(response => {
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
    resetInForm() {
      this.form = {
        id: '',
      };
      this.$refs.form1.resetFields();
    },
  },
  beforeMount() {
    //this.loadGet();
    this.loadPost()
    this.loadStorage()
    this.loadGoodstype()
  },
}
;
</script>

<style scoped>

</style>