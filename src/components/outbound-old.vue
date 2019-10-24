<template>
  <section class="container">
    <section class="top bor_ff bk_ff bxs">
      <el-row class="pt20 pl20 pb20">
        <el-col :span="5">
          <el-input v-model="inTaskNo" style="width:84%;" placeholder="出库任务号"></el-input>
        </el-col>
        <el-col :span="19" style="padding:0 15px;">
          <el-button class="mainButton" @click="queryTest" icon="el-icon-search">搜索</el-button>
          <el-button class="mainButton" @click="showElse" :icon="dropIcon">高级搜索</el-button>
          <el-button
            class="mainButton"
            @click="refresh"
            :icon="refIcon"
            style="float:right;background:#187541;border:#4EEE94 1px solid;"
          >自动刷新</el-button>
        </el-col>
      </el-row>
      <el-row v-if="dropShow" style="display:flex;">
        <el-col :span="20">
          <el-form :inline="true" :model="formData" class="demo-form-inline pl20 pr20 pb10">
            <el-row>
              <el-col :span="6">
                <el-form-item>
                  <el-select
                    filterable
                    clearable
                    v-model="taskStatus"
                    @change="test()"
                    placeholder="任务状态"
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
                <el-form-item>
                  <el-select filterable clearable v-model="equipCateg" placeholder="设备类别">
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
                <el-form-item>
                  <el-select filterable clearable v-model="ioWhSortCode" placeholder="出库类型">
                    <el-option
                      v-for="(item,index) in formData.inStoreTypeArrays"
                      :key="index"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-select filterable clearable v-model="whNo" placeholder="仓库名称">
                    <el-option
                      v-for="(item,index) in formData.storeNameArrays"
                      :key="index"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-date-picker
                    value-format="yyyy-MM-dd HH:mm:ss"
                    v-model="creatDate"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                  ></el-date-picker>
                </el-form-item>
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
              <span class="h_img"></span>
              <span class="h_title">出库任务列表</span>

              <!-- <el-button class="mainButton right">Excel</el-button> -->
            </el-row>
            <el-row class="excel nopt">
              <el-button class="start" icon="el-icon-video-play" @click="startTask">开始</el-button>
              <el-button class="pause" icon="el-icon-video-pause">暂停</el-button>
              <el-button class="mainButton" icon="el-icon-upload2" style="float:right">Excel</el-button>
            </el-row>
            <el-table
              v-loading="loading"
              ref="myTables1"
              :data="tableData"
              header-cell-class-name="tableHeaderStyle"
              header-row-class-name="tableRowStyle"
              highlight-current-row
              @selection-change="toggleSelection"
              @row-click="handleCurrentRow"
              @cell-click="handleCurrentCell"
              height="400"
              border
            >
              <el-table-column type="index" :index="indexMethod" label="序号" fixed="left" width="60"></el-table-column>
              <el-table-column type="selection" fixed="left" width="60"></el-table-column>
              <el-table-column prop="ioTaskNo" label="出库任务号" fixed="left" width="130"></el-table-column>
              <el-table-column prop="ioWhSortCode" label="出库类型" width="100"></el-table-column>
              <el-table-column prop="equipCategCn" label="设备类别" width="100"></el-table-column>
              <el-table-column prop="batchNumber" label="批次号" width="110"></el-table-column>
              <el-table-column prop="equipCode" label="物料/设备编码" width="150" show-overflow-tooltip></el-table-column>
              <el-table-column
                prop="equipCodeDesc"
                label="物料/设备描述"
                show-overflow-tooltip
                width="300"
              ></el-table-column>
              <el-table-column prop="taskQty" label="任务数量" width="100"></el-table-column>
              <el-table-column prop="finishQty" label="当前完成数" width="120"></el-table-column>
              <el-table-column prop="measurementUnit" label="计量单位" width="100"></el-table-column>
              <el-table-column prop="statusValue" label="任务状态" width="120"></el-table-column>
              <el-table-column prop="createDate" label="任务制定时间" width="150"></el-table-column>
              <el-table-column prop="finishDate" label="任务完成时间" width="150"></el-table-column>
              <el-table-column prop="whName" label="仓库名称" width="120"></el-table-column>
              <!-- 下方展示工单表格判断依据 -->
              <el-table-column prop="whType" label="库房类别" width="100" v-if="false"></el-table-column>
              <el-table-column prop="platformNo" label="出库站台" width="120"></el-table-column>
              <el-table-column label="操作" width="250" fixed="right">
                <template slot-scope="scope">
                  <el-button size="mini" class="optBtn-suc" @click.stop="toogleExpand(scope.row)">详情</el-button>
                  <!-- @click="handleDetails(scope.$index, scope.row)" -->
                  <el-button
                    size="mini"
                    type="danger"
                    class="optBtn-edit"
                    @click.stop="handleEdit(scope.$index, scope.row)"
                  >编辑</el-button>
                  <el-button
                    size="mini"
                    type="info"
                    class="optBtn-info"
                    @click.stop="handleDelete(scope.$index, scope.row)"
                  >明细</el-button>
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
    <!-- 出库工单模块 -->
    <section class="main">
      <el-row class="tableCont out bor_ff bk_ff bxs">
        <!-- <el-row class="tabCont" v-if="showTab"> -->
        <el-row class="buttonGroup nopt">
          <span class="h_img"></span>
          <span class="h_title">出库工单信息</span>
          <!-- <el-button class="mainButton right">Excel</el-button> -->
        </el-row>
        <el-row class="tabCont">
          <router-link :to="{path:'/inbound/manualorder/'+this.ioTaskNo}" v-if="showTab1">
            <div class="tab_item" :class="{'active':tabNum == 1}" @click="currentTabView(1)">人工库工单</div>
          </router-link>
          <router-link :to="{path:'/inbound/autorder/'+this.ioTaskNo }" v-if="showTab2">
            <div class="tab_item" :class="{'active':tabNum == 2}" @click="currentTabView(2)">自动设备工单</div>
          </router-link>
        </el-row>
        <router-view></router-view>
      </el-row>
    </section>
    <!-- 引用子组件 -->
    <my-dialog @close="closeDialog" :centerDialogVisible="centerDialogVisible" :testData="testData"></my-dialog>
    <edit-dialog @close="closeDialog" :editDialogVisible="editDialogVisible" :testData="testData"></edit-dialog>
  </section>
</template>
<script>
//先将组件引入
import myDialog from "./iotask/iotaskdet";
import editDialog from "./iotask/editiotask";
import util from "./utiljs/util";
export default {
  //在components声明
  components: {
    myDialog, //任务明细弹出框组件
    editDialog //编辑弹出框组件
  },
  data() {
    return {
      timerID: null, //计时标记
      loading: true, //表格动画
      tableData: [], //表格数据
      currentPage: 1, //默认当前页1
      currentPageSize: 10, //默认每页显示条数10
      totalSize: 0, //表格总页数
      centerDialogVisible: false, //任务详情默认不弹出的属性
      editDialogVisible: false, //编辑弹框默认不弹出的属性
      showElseFlag: false, //是否展开
      content: "显示额外查询条件",
      dropIcon: "el-icon-arrow-down",
      refIcon: "el-icon-caret-right",
      testData: null, //打开弹框时候的数据
      tabNum: 1, //tab的高亮
      showTab1: false, //是否展示tab1
      showTab2: false, //是否展示tab2
      dropShow: false, //是否展开
      firstItemSpan: 24, //当更多查询条件未显示时，第一个查询条件大小占满form，显示时再恢复到8，每一行三等分
      formSpan: 6, //表单一开始所占6份，展开后为18
      buttonSpan: 18, //button一开始所占18，展开后为6
      // oldRow: null, //前一个被选中的入库任务
      currentRow: "", //当前选中的行
      selectRowList: [], //所有选中的行
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
        ],
        inStoreTypeArrays: [
          { name: "配送出库", value: "01" },
          { name: "移库出库", value: "02" }
        ],
        storeNameArrays: [
          { name: "库房1", value: "01" },
          { name: "库房2", value: "02" }
        ]
      },
      dropFromData: {
        // 在这里定义折叠表单需要的属性
      },
      taskStatus: "", //搜索表单中的任务状态
      equipCateg: "",
      ioTaskNo: "",
      inTaskNo: "", //当前选中行的出库任务编号
      ioWhSortCode: "",
      whNo: "",
      creatDate: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },

  mounted() {
    this.getFirstStatus();
    // this.getDataList()
  },
  methods: {
    //展开详情
    toogleExpand(row) {
      let $table = this.$refs.myTables1;
      $table.toggleRowExpansion(row);
    },
    //刷新按钮
    refresh() {
      console.log("refresh");
      if (this.refIcon == "el-icon-caret-right") {
        this.refIcon = "el-icon-loading";
        this.start();
      } else {
        this.refIcon = "el-icon-caret-right";
        this.stop();
      }
    },

    //开始刷新方法
    start() {
      this.timerID = setInterval(() => {
        this.loadData();
      }, 3000);
    },
    //停止刷新方法
    stop() {
      clearInterval(this.timerID);
    },
    async getFirstStatus() {
      await this.loadData();
      console.log(this.tableData[0]);
      let row = this.tableData[0];
      if (row == null) return;
      //选中当前行
      this.handleCurrentRow(row);
    },
    closeDialog(val) {
      this.centerDialogVisible = val;
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
    onSubmit() {
      console.log("submit!");
    },
    testFunc(val) {
      console.log(val);
    },
    test() {
      let obj = {
        taskStatus: this.taskStatus
      };
      console.log(this.taskStatus);
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
    currentTabView(val) {
      this.tabNum = val;
    },

    /**
     * 当某一行被点击时会触发该事件	row, column, event
     */
    handleCurrentRow(row) {
      console.log("handleCurrentRow");
      console.log(row);
      //当前点击行已经被选中了
      if (this.selectRowList.includes(row)) {
        console.log("sucess");
        this.$refs.myTables1.toggleRowSelection(row, false);
        return;
      }
      this.$refs.myTables1.toggleRowSelection(row, true);
    },
    /**
     * 当某个单元格被点击时会触发该事件	row, column, cell, event
     */
    handleCurrentCell(row, column, cell) {
      console.log("handleCurrentCell");
      // console.log(cell.parentNode);
      // console.log(row, column, cell);
    },
    /**
     * 当选择项发生变化时会触发该事件
     * rows是选择的选项
     */
    toggleSelection(rows) {
      this.selectRowList = rows;
      if (rows.length == 0) {
        return;
      }
      console.log("toggleSelection");
      console.log(rows);
      let currentRow = rows[rows.length - 1];
      this.ioTaskNo = currentRow.ioTaskNo;
      //inStoreType
      //可以拿到选中的值，返回为一个数组 rows是这个数组，row是当前选中的值。可以将这个值赋给一个变量保存着，批量操作的时候用
      if (currentRow.whType == "01") {
        this.currentTabView(2);
        this.$router.push("/business/outbound/autorder/" + this.ioTaskNo);
        this.showTab1 = false;
        this.showTab2 = false;
      } else if (currentRow.whType == "02") {
        this.currentTabView(1);
        this.$router.push("/business/outbound/manualorder/" + this.ioTaskNo);
        this.showTab2 = false;
        this.showTab1 = false;
      } else {
        this.currentTabView(1);
        this.$router.push("/business/outbound/manualorder/" + this.ioTaskNo);
        this.showTab1 = true;
        this.showTab2 = true;
      }
      if (rows) {
        rows.forEach(row => {
          this.$refs.myTables1.toggleRowSelection(row, true);
          this.$refs.myTables1.setCurrentRow(row);
        });
      } else {
        this.$refs.myTables1.clearSelection();
      }
    },
    handleDetails(index, row) {
      //可以拿到这一行详情的下标和数据，
      // this.$refs.myTables1.toggleRowExpansion(row);
      console.log(index, row);
    },
    handleEdit(index, row) {
      //可以拿到这一行详情的下标和数据，
      this.centerDialogVisible = true; //打开弹框
      this.editDialogVisible = true;
      this.testData = row;
      console.log(index, row);
    },
    handleDelete(index, row) {
      //可以拿到这一行详情的下标和数据，
      this.centerDialogVisible = true; //打开弹框
      this.testData = row;
      console.log(index, row);
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
    getSelectData(selection) {
      console.log(selection);
    },
    queryTest() {
      this.currentPage = 1;
      this.currentPageSize = 10;
      this.loadData();
    },
    /**
     * 开始执行出库任务
     */
    startTask() {
      this.loading = true;
      this.axios
        .post("/wmsbusiness/iotask/starttask", {
          rowlist: this.selectRowList
        })
        .then(res => {
          this.loading = false; //取消加载动画
          this.loadData();
        })
        .catch(err => {
          this.loading = false; //取消加载动画
          this.$notify.error({
            title: "错误",
            message: "任务启动失败"
          });
        });
    },
    /**
     * 用来默认加载表格数据，搜索表单搜索数据等操作
     */
    async loadData() {
      console.log(this.inTaskNo);
      var urlAPI = "/wmsbusiness/iotask/queryall";
      await this.axios
        .get(urlAPI, {
          params: {
            inTaskNo: this.inTaskNo,
            status: this.taskStatus,
            equipCateg: this.equipCateg,
            whNo: this.whNo,
            ioWhSortCode: this.ioWhSortCode,
            creatDate: {
              beginDate: this.creatDate[0],
              endDate: this.creatDate[1]
            },
            currentPage: this.currentPage,
            currentPageSize: this.currentPageSize
          }
        })
        .then(res => {
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
      (this.inTaskNo = ""),
        (this.taskStatus = ""),
        (this.equipCateg = ""),
        (this.ioWhSortCode = ""),
        (this.whNo = ""),
        (this.creatDate = "");
    }
  }
};
</script>
<style lang="scss">
@keyframes shrink {
  0% {
    width: 80px;
  }
  50% {
    width: 0;
  }
  100% {
    width: 80px;
  }
}
.dropSection {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 100%;
  &::before {
    content: "";
    display: block;
    position: absolute;
    bottom: 0;
    width: 20px;
    height: 1px;
    margin-right: 40px;
    background-color: #19a5a1;
    box-shadow: 0 0 5px #7ac5cd;
    transition: 0.5s;
  }
  &:hover {
    color: #19a5a1;
    &.dropSection {
      &::before {
        width: 125px;
        transition: 0.5s;
      }
    }
  }
  .hovering {
    color: #19a5a1;
    transform: translateX(-40px);
    margin-left: 40px;
  }
  i {
    color: #999;
    font-size: 16px;
    transition: 0.3s;
  }
  span {
    transform: translateX(-30px);
    font-size: 14px;
    transition: 0.3s;
  }
}
.container {
  overflow-x: hidden;
  .b {
    border: #999 1px solid;
    border-radius: 5px;
  }
  .header {
    padding-left: 25px;
    padding-top: 15px;
    .h_img {
      // 标题图标的颜色和大小
      display: inline-block;
      height: 20px;
      width: 3px;
      border: 1px #19a5a1 solid;
      border-radius: 2px;
      background-color: #19a5a1;
      vertical-align: middle;
    }
    .h_title {
      // 标题文字的大小和颜色
      display: inline-block;
      color: #19a5a1;
      font-weight: bold;
      font-size: 16px;
      vertical-align: middle;
      padding-left: 13.8888px;
    }
  }
  .divider {
    //分割线的颜色 外边距 高度
    margin: 0px 0;
    height: 2px;
    background: #19a5a1;
    &.mb0 {
      margin-bottom: 0;
    }
  }
  .top {
    margin: 15px 25px 0 25px;
    .el-form--inline {
      //表单配置
      .el-form-item {
        width: 100%;
        margin-right: 0;
        margin-bottom: 12px;
        .el-form-item__label {
          //label占比
          width: 20%;
        }
        .el-form-item__content {
          //表单占比
          width: 86%;
          .el-select {
            width: 100%;
          }
          .el-date-editor {
            width: 100%;
          }
        }
      }
    }
  }
  .main {
    .view {
      margin: 20px 20px 20px 25px;
    }
    .tabCont {
      display: flex;
      padding-bottom: 0px;
      .tab_item {
        font-size: 14px;
        width: 200px;
        height: 50px;
        color: #999;
        text-align: center;
        line-height: 50px;
        border-bottom: #999 3px solid;
        &.active {
          color: #19a5a1;
          border-bottom: #19a5a1 3px solid;
          font-weight: bold;
        }
      }
    }
    .buttonGroup {
      padding: 5px 10px 5px 10px;
      background: #d7f2ef;
      &.nopt {
        padding-top: 5;
      }
      .el-button {
        font-size: 13px;
      }
      .nobr {
        border-radius: 0;
      }
      .h_img {
        // 标题图标的颜色和大小
        display: inline-block;
        height: 20px;
        width: 3px;
        border: 1px #19a5a1 solid;
        border-radius: 2px;
        background-color: #19a5a1;
        vertical-align: middle;
      }
      .h_title {
        // 标题文字的大小和颜色
        display: inline-block;
        color: #19a5a1;
        font-weight: bold;
        font-size: 14px;
        vertical-align: middle;
        padding-left: 13.8888px;
      }
    }

    .excel {
      padding: 2px 10px 2px 10px;
      &.nopt {
        padding-top: 2;
      }
      .el-button {
        font-size: 13px;
      }
      .nobr {
        border-radius: 0;
      }
    }

    //表格配置
    .tableCont {
      &.out {
        margin: 10px 20px 20px 25px;
      }
      th,
      td {
        text-align: center;
      }
      .el-table td {
        padding: 3px;
      }
      .el-table th {
        padding: 4px;
      }
      .tableExpandCont {
        display: flex;
        width: 60%;
        flex-wrap: wrap;
        padding-left: 11.5%;
        .tableExpand_item {
          display: flex;
          width: 20%;
          font-size: 14px;
          height: 30px;
          text-align: center;
          color: #666;
          label {
            width: 120px;
            text-align: right;
            padding-right: 10px;
            font-weight: bold;
          }
        }
      }
      .selectRow {
        background-color: #7ac5cd;
      }
      .el-radio__label {
        padding-left: 0;
      }
    }
  }
  .tableHeaderStyle {
    //表头背景 字体颜色
    background: rgb(215, 242, 239) !important;
    color: #19a5a1;
    font-size: 13px;
  }
  .tableRowStyle {
    //表格行字体大小  颜色
    font-size: 12px !important;
    color: #999 !important;
  }
}
.el-button {
  &.start {
    width: 80px;
    background-color: rgb(19, 194, 194);
    color: #fff;
    font-size: 12px;
    height: 28px;
    padding: 2px 4px;
    border: rgb(19, 194, 194) 1px solid;
  }
  &.pause {
    background-color: rgb(32, 178, 170);
    color: #fff;
    font-size: 12px;
    width: 80px;
    height: 28px;
    padding: 2px 4px;
  }
  &.optBtn-suc {
    background: #fff;
    border: #19a5a1 1px solid;
    color: #19a5a1;
    font-size: 12px;
  }
  &.optBtn-edit {
    background: #fff;
    border: #6495ed 1px solid;
    color: #6495ed;
    font-size: 12px;
  }
  &.optBtn-info {
    background: #6495ed;
    border: #6495ed 1px solid;
    color: #fff;
    font-size: 12px;
  }
  &.mainButton {
    //主要button的颜色  高度什么的
    background: #19a5a1;
    border: #19a5a1 1px solid;
    color: #fff;
    width: 100px;
    height: 28px;
    padding: 2px 4px;
  }
  &.defaultButton {
    background: #fff;
    border: #19a5a1 1px solid;
    color: #19a5a1;
    width: 100px;
    height: 28px;
    padding: 2px 4px;
  }
}
//一般button的颜色 高度什么的
</style>