<template>
  <section class="container">
    <section class="top bor_ff bk_ff bxs">
      <el-row class="pt20 pl20 pb20">
        <el-col :span="5">
          <el-input v-model="inTaskNo" style="width:84%;" placeholder="入库任务号"></el-input>
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
                <el-input v-model="batchNumber" style="width:84%;" placeholder="批次号"></el-input>
                <!-- <el-form-item>
                  <el-select filterable clearable v-model="equipCateg" placeholder="设备类别">
                    <el-option
                      v-for="(item,index) in formData.equipTypeArrays"
                      :key="index"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>-->
              </el-col>
              <el-col :span="6">
                <el-input v-model="equipCode" style="width:84%;" placeholder="物料码"></el-input>
                <!-- <el-form-item>
                  <el-select filterable clearable v-model="equipCateg" placeholder="设备类别">
                    <el-option
                      v-for="(item,index) in formData.equipTypeArrays"
                      :key="index"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>-->
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-select filterable clearable v-model="ioWhSortCode" placeholder="入库类型">
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
              <span class="h_title">入库任务列表</span>

              <!-- <el-button class="mainButton right">Excel</el-button> -->
            </el-row>
            <el-row class="excel nopt">
              <el-button class="start" icon="el-icon-video-play" @click="startTask">开始</el-button>
              <el-button class="mainButton" icon="el-icon-upload2" style="float:right">Excel</el-button>
            </el-row>
            <el-table
              v-loading="loading"
              ref="ioTaskTable"
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
              <!-- <el-table-column type="expand" fixed="left" width="40">
                <template slot-scope="props">
                  <article class="tableExpandCont">
                    <section class="tableExpand_item">
                      <label>数据来源:</label>
                      <span>{{ props.row.dataSource }}</span>
                    </section>
                    <section class="tableExpand_item">
                      <label>类别:</label>
                      <span>{{ props.row.typeCodeValue}}</span>
                    </section>
                    <section class="tableExpand_item">
                      <label>型号:</label>
                      <span>{{ props.row.modelCodeValue }}</span>
                    </section>
                    <section class="tableExpand_item">
                      <label>接线方式:</label>
                      <span>{{ props.row.wiringModeValue }}</span>
                    </section>
                    <section class="tableExpand_item">
                      <label>制造单位:</label>
                      <span>{{ props.row.manufacturerValue }}</span>
                    </section>
                    <section class="tableExpand_item">
                      <label>通讯规约:</label>
                      <span>{{ props.row.commProtCodeValue }}</span>
                    </section>
                    <section class="tableExpand_item">
                      <label>芯片厂家:</label>
                      <span>{{ props.row.chipManufacturerValue }}</span>
                    </section>
                    <section class="tableExpand_item">
                      <label>采集方式:</label>
                      <span>{{ props.row.collModeValue }}</span>
                    </section>
                    <section class="tableExpand_item">
                      <label>通讯方式:</label>
                      <span>{{ props.row.commModeValue }}</span>
                    </section>
                    <section class="tableExpand_item">
                      <label>电压:</label>
                      <span>{{ props.row.voltCodeValue }}</span>
                    </section>
                    <section class="tableExpand_item">
                      <label>标定电流:</label>
                      <span>{{ props.row.ratedCurrentValue }}</span>
                    </section>
                    <section class="tableExpand_item">
                      <label>有功准确度等级:</label>
                      <span>{{ props.row.apPreLevelCodeValue }}</span>
                    </section>
                    <section class="tableExpand_item">
                      <label>无功准确度等级:</label>
                      <span>{{ props.row.rpPreLevelCodeValue }}</span>
                    </section>
                    <section class="tableExpand_item">
                      <label>额定电压:</label>
                      <span>{{ props.row.rvCode }}</span>
                    </section>
                    <section class="tableExpand_item">
                      <label>额定电流:</label>
                      <span>{{ props.row.rcCode }}</span>
                    </section>
                    <section class="tableExpand_item">
                      <label>TA准确度等级:</label>
                      <span>{{ props.row.taPreCodeValue }}</span>
                    </section>
                    <section class="tableExpand_item">
                      <label>TV准确度等级:</label>
                      <span>{{ props.row.tvPreCodeValue }}</span>
                    </section>
                    <section class="tableExpand_item">
                      <label>电压变化:</label>
                      <span>{{ props.row.voltRatioCodeValue }}</span>
                    </section>
                    <section class="tableExpand_item">
                      <label>电流变化:</label>
                      <span>{{ props.row.rcRatioCodeValue }}</span>
                    </section>
                    <section class="tableExpand_item">
                      <label>费率:</label>
                      <span>{{ props.row.feeRatioValue }}</span>
                    </section>
                  </article>
                </template>
              </el-table-column>-->
              <el-table-column type="index" :index="indexMethod" label="序号" fixed="left" width="60"></el-table-column>
              <el-table-column type="selection" fixed="left" width="60"></el-table-column>
              <el-table-column prop="ioTaskNo" label="入库任务号" fixed="left" width="130"></el-table-column>
              <el-table-column prop="ioWhSortCodeValue" label="入库类型" width="220"></el-table-column>
              <el-table-column prop="batchNumber" label="批次号" width="110"></el-table-column>
              <el-table-column prop="equipCode" label="物料码" width="150" show-overflow-tooltip></el-table-column>
              <el-table-column prop="equipCodeDesc" label="物料码描述" show-overflow-tooltip width="300"></el-table-column>
              <el-table-column prop="taskQty" label="任务数量" width="100"></el-table-column>
              <el-table-column prop="finishQty" label="完成数量" width="120"></el-table-column>
              <el-table-column prop="measurementUnit" label="计量单位" width="100"></el-table-column>
              <el-table-column prop="statusValue" fixed="left" label="任务状态" width="120"></el-table-column>
              <el-table-column prop="createDate" label="任务生成时间" width="150"></el-table-column>
              <el-table-column prop="startDate" label="任务开始时间" width="150"></el-table-column>
              <el-table-column prop="finishDate" label="任务完成时间" width="150"></el-table-column>
              <el-table-column prop="whName" label="仓库名称" width="120"></el-table-column>
              <!-- 下方展示工单表格判断依据 -->
              <!-- <el-table-column prop="whType" label="库房类别" width="100" v-if="false"></el-table-column>
              <el-table-column prop="platformNo" label="入库站台" width="120"></el-table-column>-->
              <!-- <el-table-column label="操作" width="250" fixed="right">
                <template slot-scope="scope">
                  <el-button size="mini" class="optBtn-suc" @click.stop="toogleExpand(scope.row)">详情</el-button>
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
              </el-table-column>-->
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
    <!-- 入库工单模块 -->
    <section class="main">
      <el-row class="tableCont out bor_ff bk_ff bxs">
        <!-- <el-row class="tabCont" v-if="showTab"> -->
        <el-row class="buttonGroup nopt">
          <span class="h_img"></span>
          <span class="h_title">入库工单信息</span>
          <!-- <el-button class="mainButton right">Excel</el-button> -->
        </el-row>
        <el-row class="tabCont">
          <!-- <router-link :to="{path:'/business/inbound/manualorder/'+this.ioTaskNo}" v-if="showTab1"> -->
          <div
            class="tab_item"
            :class="{'active':tabNum == 1}"
            @click="currentTabView(1)"
            v-if="showTab1"
          >人工库工单</div>
          <!-- </router-link> -->

          <!-- <router-link :to="{path:'/business/inbound/autorder/'+this.ioTaskNo }" v-if="showTab2"> -->
          <div
            class="tab_item"
            :class="{'active':tabNum == 2}"
            @click="currentTabView(2)"
            v-if="showTab2"
          >自动设备工单</div>
          <!-- </router-link> -->
        </el-row>
        <!-- <keep-alive> -->
        <!-- <router-view></router-view> -->
        <!-- </keep-alive> -->
        <manual-Order
          v-if="showTable1"
          :iotaskno="this.ioTaskNo"
          :currentRow="this.currentRow"
          :types="this.types"
          @refreshTable="refreshTableHere"
          ref="manual"
        ></manual-Order>
        <aut-Order
          v-if="showTable2"
          :iotaskno="this.ioTaskNo"
          :currentRow="this.currentRow"
          ref="auto"
        ></aut-Order>
      </el-row>
    </section>
    <!-- 引用子组件 -->
    <!-- <my-dialog @close="closeDialog" :centerDialogVisible="centerDialogVisible" :testData="testData"></my-dialog>
    <edit-dialog @close="closeDialog" :editDialogVisible="editDialogVisible" :testData="testData"></edit-dialog>-->
  </section>
</template>
<script>
//先将组件引入
// import myDialog from "./iotask/iotaskdet";
// import editDialog from "./iotask/editiotask";
import util from "./utiljs/util";
import manualOrder from "./ioorder/manualorder";
import autOrder from "./ioorder/autorder";
// import { async } from "q";
export default {
  //在components声明
  components: {
    // myDialog, //任务明细弹出框组件
    manualOrder,
    autOrder
  },
  // watch: {
  //   //监控出入库任务变化
  //   $route() {
  //     document.body.scrollTop = "0";
  //   }
  // },
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
      showTable1: false, //人工库工单
      showTable2: false, //自动设备工单
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
          { name: "正在执行", value: "02" },
          { name: "等待执行", value: "03" },
          { name: "暂停", value: "04" },
          { name: "执行完毕", value: "05" }
        ],
        equipTypeArrays: [
          { name: "电能表", value: "0732" },
          { name: "封箱", value: "7253" }
        ],
        inStoreTypeArrays: [
          { name: "采购入库", value: "0101" },
          { name: "调拨入库", value: "0103" },
          { name: "废旧退货入库", value: "0104" }
        ],
        storeNameArrays: [
          { name: "库房1", value: "01" },
          { name: "库房2", value: "02" }
        ]
      },
      dropFromData: {
        // 在这里定义折叠表单需要的属性
      },
      /*查询条件↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
      inTaskNo: "", //查询条件中的入库任务号
      taskStatus: "", //搜索表单中的任务状态
      //批次号
      batchNumber: "",
      //物料码
      equipCode: "",
      ioWhSortCode: "",
      whNo: "",
      creatDate: "",
      /*查询条件↑↑↑↑↑↑↑↑↑↑*/
      ioTaskNo: "", //当前选中的入库任务号
      //当前选中项的库区功能类型
      types: [],
      //当前库房类型 auto manual mix
      type: "",
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
  updated() {},
  mounted() {
    this.getFirstStatus();
  },
  methods: {
    //展开详情
    toogleExpand(row) {
      let $table = this.$refs.ioTaskTable;
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
    //页面刷新方法
    async refreshTableHere() {
      await this.loadData();
      // this.$nextTick(function() {
      //   console.log("refreshTableHere");
      //   this.$refs.ioTaskTable.toggleRowSelection(this.currentRow, true);
      // });
    },
    async getFirstStatus() {
      await this.loadData();
      console.log(this.tableData[0]);
      let row = this.tableData[0];
      if (row == null) return;
      //当前行选中
      await this.handleCurrentRow(row);
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
      if (val == 1) {
        this.showTable1 = true;
        this.showTable2 = false;
      } else {
        this.showTable1 = false;
        this.showTable2 = true;
      }
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
        this.$refs.ioTaskTable.toggleRowSelection(row, false);
        return;
      }
      this.$refs.ioTaskTable.toggleRowSelection(row, true);
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
    async toggleSelection(rows) {
      this.selectRowList = rows;
      if (rows.length == 0) {
        return;
      }
      console.log(rows);
      let currentRow = rows[rows.length - 1];
      this.currentRow = currentRow;
      this.ioTaskNo = currentRow.ioTaskNo;
      let equipCode = currentRow.equipCode;
      let whNo = currentRow.whNo;
      await this.getFunctionTypes(equipCode, whNo);
      console.log("this.types" + this.types);
      let functions = [];
      this.types.forEach(row => {
        functions.splice(0, 0, row.FUNCTION_TYPE);
      });
      console.log(functions);
      //功能类型，01自动化区、02货架区、03平置区、04料棚区、05堆场区
      //
      if (functions.includes("01") && functions.length == 1) {
        this.type = "auto";
        //自动设备工单
        this.currentTabView(2);
        // this.$router.push("/business/inbound/autorder/" + this.ioTaskNo);
        this.showTab1 = false;
        this.showTab2 = false;
        this.showTable1 = false;
        this.showTable2 = true;
      } else if (functions.includes("01") && functions.length > 1) {
        this.type = "mix";
        //混合类型
        this.currentTabView(1);
        // this.$router.push("/business/inbound/manualorder/" + this.ioTaskNo);
        this.showTab1 = true;
        this.showTab2 = true;
        this.showTable1 = true;
        this.showTable2 = false;
      } else {
        this.type = "manual";
        //人工工单
        this.currentTabView(1);
        // this.$router.push("/business/inbound/manualorder/" + this.ioTaskNo);
        this.showTab2 = false;
        this.showTab1 = false;
        this.showTable1 = true;
        this.showTable2 = false;
      }

      if (rows) {
        rows.forEach(row => {
          this.$refs.ioTaskTable.toggleRowSelection(row, true);
          this.$refs.ioTaskTable.setCurrentRow(row);
        });
      } else {
        this.$refs.ioTaskTable.clearSelection();
      }
    },
    async getFunctionTypes(equipCode, whNo) {
      await this.axios
        .get("/wmsbusiness/iotask/getFunctionTypes", {
          params: {
            equipCode: equipCode,
            whNo: whNo
          }
        })
        .then(res => {
          console.log("getFunctionTypes");
          res.data.forEach(row => {
            if (row.FUNCTION_TYPE == "01") {
              row.disabled = true;
            }
          });
          this.types = res.data;
        })
        .catch(err => {
          // this.loading = false; //取消加载动画
          this.$notify.error({
            title: "错误",
            message: "获取库区类型失败"
          });
        });
    },
    handleDetails(index, row) {
      //可以拿到这一行详情的下标和数据，
      this.$refs.ioTaskTable.toggleRowExpansion(row);
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
      this.getFirstStatus();
    },
    handleSizeChange(val) {
      this.currentPageSize = val;
      this.getFirstStatus();
    },
    handleCurrentTableChange(val) {
      this.$refs.ioTaskTable.toggleRowSelection(val, true);
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
     * 开始执行入库任务
     */
    async startTask() {
      let rows = this.selectRowList;
      this.loading = true;
      for (var i = 0; i < rows.length; i++) {
        await this.startOneTask(rows[i]);
      }
      await this.loadData();
    },
    async startOneTask(val) {
      console.log(val.ioTaskNo);
      //只可以执行未执行任务
      if (val.status != "01") {
        this.$notify({
          title: "错误",
          message: val.ioTaskNo + "入库任务状态错误",
          type: "error",
          duration: 0
        });
        return;
      }
      await this.axios
        .post("/wmsbusiness/iotask/runInboundTask", val)
        .then(res => {
          console.log(res.data);
          if (res.data == 0) {
            this.$notify({
              title: "重要",
              message: val.ioTaskNo + "入库任务，库存容量无法满足",
              type: "warning",
              duration: 0
            });
          } else if (res.data == 1) {
            this.$notify({
              title: "成功",
              message: val.ioTaskNo + "入库任务启动成功",
              type: "success"
            });
          } else if (res.data == 3) {
            this.$notify({
              title: "错误",
              message: val.ioTaskNo + "入库任务状态错误",
              type: "error",
              duration: 0
            });
          } else {
            let s = res.data.split(",");
            this.$notify({
              title: "重要",
              message: val.ioTaskNo + "入库任务需要人工入库,数量为" + s[1],
              type: "warning",
              duration: 0
            });
          }
          //刷新子组件，人工不用刷新
          if (this.showTable2 == true) {
            this.$refs.auto.initIoOrderTable();
          }
        })
        .catch(err => {
          this.$notify.error({
            title: "错误",
            message: "任务启动失败"
          });
        });
      // this.loading = false; //取消加载动画
    },
    /**
     * 用来默认加载表格数据，搜索表单搜索数据等操作
     */
    async loadData() {
      var urlAPI = "/wmsbusiness/iotask/queryIotaskPages";
      let reqData = {
        current: this.currentPage,
        size: this.currentPageSize,
        inTaskNo: this.inTaskNo,
        batchNumber: this.batchNumber,
        equipCode: this.equipCode,
        beginDate: this.creatDate[0],
        endDate: this.creatDate[1],
        allEq: {
          status: this.taskStatus,
          ioWhSortCode: this.ioWhSortCode,
          whNo: this.whNo,
          //入库0  出库1
          ioFlag: "01"
        }
      };
      await this.axios
        .post(urlAPI, reqData)
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
        (this.equipCode = ""),
        (this.batchNumber = ""),
        (this.whNo = ""),
        (this.creatDate = "");
    }
  }
};
</script>
<style lang="scss">
</style>