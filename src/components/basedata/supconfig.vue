<template>
  <section class="container">
    <header class="header">
      <span class="h_img"></span>
      <span class="h_title">供应商维护列表</span>
    </header>
    <section class="top bor_ff bk_ff bxs">
      <el-row class="pt20 pl20 pb20">
        <el-col :span="5">
          <el-input v-model="supplierName" style="width:84%;" placeholder="供应商名称"></el-input>
        </el-col>
        <el-col :span="19" style="padding:0 15px;">
          <el-button class="mainButton" @click="queryTest" icon="el-icon-search">搜索</el-button>
          <el-button class="mainButton" @click="showElse" :icon="dropIcon">高级搜索</el-button>
          <el-button
            class="mainButton"
            @click="refresh"
            :icon="refIcon"
            style="float:right;background:#187541;"
          >自动刷新</el-button>
        </el-col>
      </el-row>
      <el-row v-if="dropShow" style="display:flex;">
        <el-col :span="20">
          <el-form :inline="true" :model="formData" class="demo-form-inline pl20 pr20 pb10">
            <el-row>
              <el-col :span="6">
                <el-form-item>
                  <el-select filterable clearable v-model="equipType" placeholder="设备类别">
                    <el-option
                      v-for="(item,index) in formData.equipTypeArrays"
                      :key="index"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-input v-model="supplierCode" style="width:84%;" placeholder="供应商编码"></el-input>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-select
                    filterable
                    clearable
                    v-model="status"
                    @change="test()"
                    placeholder="状态"
                  >
                    <el-option
                      v-for="(item,index) in formData.taskStatusArrays"
                      :key="index"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-input v-model="supplierShortName" style="width:84%;" placeholder="供应商简称"></el-input>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
        <el-col
          :span="4"
          style="display:flex;justify-content:flex-end;align-self:flex-end;padding-bottom:22px;padding-right:15px;"
        >
          <el-button class="defaultButton" @click="queryTest" icon="el-icon-refresh-left">搜索</el-button>
          <el-button class="defaultButton" @click="reset" icon="el-icon-refresh-left">重置</el-button>
        </el-col>
      </el-row>
      <el-divider class="divider"></el-divider>
      <el-row>
        <section class="main">
          <el-row class="tableCont notftr bor_ff bk_ff">
            <el-row class="buttonGroup nopt">
              <el-button class="start" icon="el-icon-plus" @click="handleEdit">添加</el-button>
              <el-button
                class="mainButton"
                icon="el-icon-upload2"
                style="float:right;"
                @click="addData"
              >导出</el-button>
            </el-row>
            <el-table
              v-loading="loading"
              ref="myTables1"
              :data="tableData"
              header-cell-class-name="tableHeaderStyle"
              header-row-class-name="tableRowStyle"
              highlight-current-row
              height="450"
              border
            >
              <el-table-column type="index" :index="indexMethod" label="序号" fixed="left" width="60"></el-table-column>
              <el-table-column prop="supplierCode" label="供应商编码" width="130"></el-table-column>
              <el-table-column prop="supplierOrgNo" label="供应商组织机构代码" width="250"></el-table-column>
              <el-table-column prop="supplierName" label="供应商名称" width="300"></el-table-column>
              <el-table-column prop="supplierShortName" label="供应商简称" width="100"></el-table-column>
              <el-table-column prop="equipType" label="设备类别" width="200"></el-table-column>
              <el-table-column prop="supAddress" label="地址" show-overflow-tooltip width="500"></el-table-column>
              <el-table-column prop="contact" label="联系人" width="100"></el-table-column>
              <el-table-column label="状态" width="120" fixed="right">
                <template slot-scope="scope">
                  <el-tooltip :content="(scope.row.status == '02') ? '启用' : '停用'" placement="top">
                    <el-switch
                      v-model="scope.row.status"
                      active-value="02"
                      inactive-value="01"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      @change="changestatus(scope.$index, scope.row)"
                    ></el-switch>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="230" fixed="right">
                <template slot-scope="scope">
                  <!-- <el-button
                    size="mini"
                    :type= "(scope.row.status == '01') ?'success':'info'"
                    icon="el-icon-s-operation"
                    @click="setStatus(scope.$index, scope.row)"
                  > {{(scope.row.status == '01') ?'启用':'停用'}}</el-button>-->
                  <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-edit"
                    @click="handleEdit(scope.$index, scope.row)"
                  >编辑</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.$index, scope.row)"
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row type="flex" justify="end">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-size="currentPageSize"
                layout="prev, pager, next,sizes,jumper,total"
                :total="totalSize"
              ></el-pagination>
            </el-row>
          </el-row>
        </section>
      </el-row>
    </section>
    <!-- 引用添加和编辑的子组件 -->
    <edit-dialog @close="closeDialog" :editDialogVisible="editDialogVisible" :testData="testData"></edit-dialog>
  </section>
</template>
<script>
import editDialog from "./childcomponent/editdialog";
export default {
  components: {
    editDialog //编辑弹出框组件
  },
  data() {
    return {
      loading: false, //表格动画
      editDialogVisible: false, //编辑弹框默认不弹出的属性
      buttonColor: "",
      status: "",
      btnStatus: this.tableData,
      tableData: [], //表格数据
      currentPage: 1, //默认当前页1
      currentPageSize: 10, //默认每页显示条数10
      totalSize: 0, //表格总页数
      dropIcon: "el-icon-arrow-down",
      refIcon: "el-icon-caret-right",
      testData: null, //打开弹框时候的数据
      dropShow: false, //是否展开
      formData: {
        taskStatusArrays: [
          { name: "未执行", value: "01" },
          { name: "执行中", value: "02" },
          { name: "以完成", value: "03" },
          { name: "暂停", value: "04" },
          { name: "等待执行", value: "05" }
        ],
        equipTypeArrays: [
          { name: "电能表", value: "0732" },
          { name: "封箱", value: "7253" }
        ]
      },
      supplierName: "",
      equipType: "",
      supplierCode: "",
      supplierShortName: "",
      status: ""
    };
  },
  mounted() {
    this.getFirstStatus();
    // this.getDataList()
  },
  methods: {
    closeDialog(val) {
      this.loadData();
      this.editDialogVisible = val;
    },
    /**
     * 自定义序号
     */
    indexMethod(index) {
      return this.utils.indexMethod(
        index,
        this.currentPage,
        this.currentPageSize
      );
    },
    //展示其他查询条件
    showElse() {
      if (this.dropShow) {
        this.dropShow = false;
        this.dropIcon = "el-icon-arrow-down";
      } else {
        this.dropIcon = "el-icon-arrow-up";
        this.dropShow = true;
      }
    },
    async getFirstStatus() {
      await this.loadData();
    },
    handleEdit(index, row) {
      //可以拿到这一行详情的下标和数据，
      this.editDialogVisible = true;
      console.log(row);
      if (row != undefined) {
        this.testData = row;
      } else {
        this.testData = {};
      }
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该条供应商维护信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var urlAPI = "/wmsbasedata/supplierinfo/deletebyid";
          this.axios
            .get(urlAPI, {
              params: {
                id: row.supplierInfoId
              }
            })
            .then(res => {
              console.log(res.data);
              if (res.data == "suc") {
                this.loadData();
                this.$message({
                  type: "success",
                  message: "数据删除成功"
                });
              } else {
                this.$notify.error({
                  title: "错误",
                  message: "数据删除失败",
                  duration: 0
                });
              }
            })
            .catch(err => {
              this.$notify.error({
                title: "错误",
                message: "数据删除失败"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleCurrentChange(val) {
      //可以拿到当前页数，然后在这里可以请求接口
      this.currentPage = val;
      this.loadData();
    },
    handleSizeChange(val) {
      this.currentPageSize = val;
      this.loadData();
    },
    handleCurrentTableChange(val) {
      this.$refs.myTables1.toggleRowSelection(val, true);
      console.log(`当前页: ${val}`);
    },
    queryTest() {
      this.currentPage = 1;
      this.currentPageSize = 10;
      this.loadData();
    },
    /**
     * 用来默认加载表格数据，搜索表单搜索数据等操作
     */
    async loadData() {
      var urlAPI = "/wmsbasedata/supplierinfo/queryall";
      await this.axios
        .get(urlAPI, {
          params: {
            supplierName: this.supplierName,
            equipType: this.equipType,
            supplierCode: this.supplierCode,
            status: this.status,
            supplierShortName: this.supplierShortName,
            currentPage: this.currentPage,
            currentPageSize: this.currentPageSize
          }
        })
        .then(res => {
          console.log(res.data);
          this.loading = false; //取消加载动画
          this.tableData = []; //清空表格的数据
          this.totalSize = res.data.total;
          let obj = null;
          if (res.data.records.length > 0) {
            this.tableData = res.data.records;
          } else {
            this.tableData = [];
          }
        })
        .catch(err => {
          this.$notify.error({
            title: "错误",
            message: "数据加载失败"
          });
        });
    },
    /**
     * 获取搜索表单的下拉数据
     */
    getDateType() {
      var urlAPI = "/vw/getViewByNames";
      this.axios
        .get(urlAPI, {
          params: {
            names: "VW_EQUIP_CATEG"
          }
        })
        .then(res => {
          console.log(res.data.VW_EQUIP_CATEG);

          if (res.data.VW_EQUIP_CATEG.length > 0) {
            this.formData.equipTypeArrays = res.data.VW_EQUIP_CATEG;
          }
        })
        .catch(err => {
          this.$notify.error({
            title: "错误",
            message: "数据加载失败"
          });
        });
    },
    /**
     * 测试多个请求并发执行
     */
    getDataList() {
      let ajax = this.axios;
      ajax
        .all([
          this.axios.get(
            "/wmsbusiness/iotask/queryall?inTaskNo=&status=&equipCateg=&whNo=&ioWhSortCode=&creatDate=%7B%7D&currentPage=1&currentPageSize=10"
          )
        ])
        .then(
          ajax.spread(function(res) {
            console.log(res);
          })
        );
    },
    /**
     * 重置
     */
    reset() {
      (this.supplierName = ""),
        (this.equipType = ""),
        (this.supplierCode = ""),
        (this.supplierShortName = ""),
        (this.status = "");
    },
    /**
     * 自动刷新
     */
    refresh() {
      if (this.refIcon == "el-icon-caret-right") {
        this.refIcon = "el-icon-loading";
      } else {
        this.refIcon = "el-icon-caret-right";
      }
    },
    /**
     * 新建数据
     */
    addData() {
      console.log("添加数据");
    },
    setStatus(index, row) {
      row.status = row.status == "01" ? "02" : "01";
    },
    /**
     * 启用、停用状态的更改
     */
    changestatus(index, row) {
      var urlAPI = "/wmsbasedata/supplierinfo/updatestatusbyid";
      this.axios
        .post(urlAPI, {
          supplierInfoId: row.supplierInfoId,
          status: row.status
        })
        .then(res => {
          console.log(res.data);
          if (res.data == "suc") {
            console.log("状态更改成功");
          } else {
            this.$notify.error({
              title: "错误",
              message: "状态更改失败",
              duration: 0
            });
          }
        })
        .catch(err => {
          this.$notify.error({
            title: "错误",
            message: "数据加载失败"
          });
        });
    }
  }
};
</script>

<style>
</style>