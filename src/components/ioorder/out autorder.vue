<template>
  <section>
    <el-row class="excel nopt">
      <el-button
        :disabled="this.currentRow.status != '02' ?true :false"
        class="mainButton"
        @click="orderSend"
      >工单下发</el-button>
      <!-- <el-button class="mainButton" @click="completeOrder">直接出库</el-button> -->
      <el-button class="mainButton" icon="el-icon-upload2" style="float:right">Excel</el-button>
    </el-row>
    <el-row>
      <el-table
        :data="tableData"
        ref="orderTable"
        @selection-change="toggleSelection"
        @row-click="handleCurrentRow"
        highlight-current-row
        height="400"
        fit
        show-overflow-tooltip
        header-cell-class-name="tableHeaderStyle"
        header-row-class-name="tableRowStyle"
        border
      >
        <!--   @current-change="handleCurrentChange" -->
        <el-table-column type="index" :index="indexMethod" label="序号" fixed="left" width="70"></el-table-column>
        <el-table-column type="selection" fixed="left" width="60"></el-table-column>
        <el-table-column prop="ioOrderNo" label="出库工单号" fixed="left" width="200"></el-table-column>
        <el-table-column prop="ioTaskNo" label="出库任务号" width="200"></el-table-column>
        <el-table-column prop="statusValue" label="工单状态" width="130">
          <template scope="scope">
            <span v-if="scope.row.statusValue=='未执行'" style="color:red">{{ scope.row.statusValue }}</span>
            <span v-else style="color:#000000">{{ scope.row.statusValue }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="batchNumber" label="批次号" width="110"></el-table-column>
        <el-table-column prop="equipCode" label="物料码" width="220" show-overflow-tooltip></el-table-column>
        <el-table-column prop="equipCodeDesc" label="物料码描述" width="500" show-overflow-tooltip></el-table-column>
        <el-table-column prop="orderQty" label="数量" width="100"></el-table-column>
        <el-table-column prop="whaNo" label="库区" width="100"></el-table-column>
        <el-table-column prop="whLocNo" label="储位编号" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="beginTime" label="工单执行时间" width="400"></el-table-column>
        <!-- <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              class="optBtn-info"
              @click="handleDetails(scope.$index, scope.row)"
            >工单明细</el-button>
          </template>
        </el-table-column>-->
      </el-table>
    </el-row>

    <el-row type="flex" justify="end" style="padding-bottom:20px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="currentPageSize"
        layout="prev, pager, next,sizes,jumper,total"
        :total="totalSize"
      ></el-pagination>
    </el-row>

    <el-dialog title :visible.sync="centerDialogVisible" width="50%" center>
      <header class="header">
        <span class="h_title">出库工单明细</span>
      </header>
      <el-divider class="divider"></el-divider>
      <el-row class="pl20 pr20 pt15">
        <el-table
          :data="detailsTable"
          fit
          height="370"
          header-cell-class-name="tableHeaderStyle"
          header-row-class-name="tableRowStyle"
          border
        >
          <el-table-column type="index" :index="indexMethodDetailsTable" width="70" label="序号"></el-table-column>
          <!-- <el-table-column prop="inStoreCode" label="出库工单编码"></el-table-column>
          <el-table-column prop="contNum" label="箱条码/垛号"></el-table-column>-->
          <el-table-column prop="boxBarCode" label="箱条码"></el-table-column>
          <el-table-column prop="barCode" label="表条码"></el-table-column>
          <el-table-column prop="equipDesc" label="设备码描述"></el-table-column>
        </el-table>
      </el-row>
      <el-row type="flex" justify="end" style="padding-bottom:20px;">
        <el-pagination
          @size-change="handleSizeChangeDetailsTable"
          @current-change="handleCurrentChangeDetailsTable"
          :current-page.sync="currentPageDetailsTable"
          :page-size="currentPageSizeDetailsTable"
          layout="prev, pager, next,sizes,jumper,total"
          :total="totalSizeDetailsTable"
        ></el-pagination>
      </el-row>
    </el-dialog>
  </section>
</template>
<script>
export default {
  props: { iotaskno: String, currentRow: Object},
  data() {
    return {
      orderIds: [],
      selectRowList: [], //所有选中的行
      // ioTaskNo: "",
      //出库工单数据
      tableData: [],
      currentPage: 1,
      currentPageSize: 10,
      totalSize: 0,
      //工单明细的数据
      currentPageDetailsTable: 1,
      currentPageSizeDetailsTable: 10,
      totalSizeDetailsTable: 0,

      centerDialogVisible: false,
      orderDialogVisible: false,
      //当前选中的一行工单
      orderData: null,
      showTabFlag: 1,
      tabNum: 1,
      //扫描条形码输入框
      orderFormData: {
        barCode: "",
        container: ""
      },
      //扫描箱条码输入框
      otherFormData: {
        container: ""
      },
      //扫描条形码
      orderBarCodeTable: [
        {
          boxBarCode: "TP0002",
          barCode: "41378498489722"
        }
      ],
      //扫描箱条码
      orderConTable: [
        {
          boxBarCode: "TP0001",
          barCode: "41378498489799"
        }
      ],

      //工单明细
      detailsTable: [],
      barCode: "",
      container: ""
    };
  },
  computed: {
    // //监控 条形码输入框 表条码
    // getBarCode() {
    //   console.log(this.orderFormData.barCode);
    //   return this.orderFormData.barCode;
    // },
    // //监控 条形码输入框 箱条码
    // getContainer() {
    //   console.log(this.orderFormData.container);
    //   return this.orderFormData.container;
    // },
    // //监控箱条码输入框 箱条码
    // getAnotherContainer() {
    //   console.log(this.otherFormData.container);
    //   return this.orderFormData.container;
    // }
  },
  mounted() {
    // this.ioTaskNo = this.$route.params.id;
    console.log("auto mounted");
    this.initIoOrderTable();
    // console.log(this.data1);
    // this.$emit("test", this.currentPage);
  },
  watch: {
    //监控出入库任务变化
    // $route() {
    //   console.log("auto route监控");
    //   this.ioTaskNo = this.$route.params.id;
    //   console.log(this.$route);
    //   this.initIoOrderTable();
    // },
    iotaskno() {
      console.log(this.iotaskno);
      this.initIoOrderTable();
    },

    //监控条形码输入框 表条码
    getBarCode(val) {
      if (this.orderFormData.container.length == 4) {
        if (val.length == 3) {
          this.orderBarCodeTable.splice(0, 0, {
            barCode: val,
            boxBarCode: this.orderFormData.container
          });
          this.orderFormData.barCode = "";
        } else if (val.length > 3) {
          this.orderFormData.barCode = "";
        }
      } else {
        this.orderFormData.container = "";
        this.orderFormData.barCode = "";
      }
    },
    /**
     *监控条形码输入框 箱条码
     */
    getContainer(val) {
      if (val.length == 4) {
        this.orderFormData.container = val;
        this.$refs.barinput.focus();
      } else if (val.length > 4) {
        this.orderFormData.barCode = "";
        this.orderFormData.container = "";
      }
    },
    /**
     * 监控条形码输入框 箱条码
     */
    getAnotherContainer(val) {
      console.log("getAnotherContainer " + val);
    }
  },
  methods: {
    orderSend() {
      this.orderIds = [];
      this.selectRowList.forEach(row => {
        this.orderIds.splice(0, 0, row.ioOrderNo);
      });
      alert("当前选中的任务: " + JSON.stringify(this.orderIds));
    },
    completeOrder() {
      this.orderIds = [];
      this.selectRowList.forEach(row => {
        this.orderIds.splice(0, 0, row.ioOrderNo);
      });
      alert("当前选中的任务: " + JSON.stringify(this.orderIds));
    },
    //一行被点击触发事件
    handleCurrentRow(row) {
      console.log("handleCurrentRow");
      console.log(row);
      //当前点击行已经被选中了
      if (this.selectRowList.includes(row)) {
        this.$refs.orderTable.toggleRowSelection(row, false);
        return;
      }
      this.$refs.orderTable.toggleRowSelection(row, true);
    },
    toggleSelection(rows) {
      this.selectRowList = rows;
      if (rows.length == 0) {
        return;
      }
      let currentRow = rows[rows.length - 1];

      if (rows) {
        rows.forEach(row => {
          this.$refs.orderTable.toggleRowSelection(row, true);
          this.$refs.orderTable.setCurrentRow(row);
        });
      } else {
        this.$refs.orderTable.clearSelection();
      }
    },

    /**
     * 自定义序号
     */
    indexMethod(index) {
      return (this.currentPage - 1) * this.currentPageSize + index + 1;
    },
    indexMethodDetailsTable(index) {
      return (
        (this.currentPageDetailsTable - 1) * this.currentPageSizeDetailsTable +
        index +
        1
      );
    },
    /**
     * 删除1
     */
    currentTabView(val) {
      //切换tab
      this.showTabFlag = val;
      this.tabNum = val;
    },
    initIoOrderTable() {
      console.log("initIoOrderTable");
      let reqData = {
        current: this.currentPage,
        size: this.currentPageSize,
        allEq: {
          // ioTaskNo: 233234
          ioTaskNo: this.iotaskno,
          orderType: "01"
        }
      };

      this.axios
        .post("/wmsbusiness/ioordermanage/queryOrderPages", reqData)
        .then(res => {
          // console.log("res = " + res.data.records);
          this.tableData = res.data.records;
          this.totalSize = res.data.total;
        })
        .catch(err => {
          console.log(err);
        });
    },

    queryDetailsTable(val) {
      console.log("queryDetailsTable");
      console.log(val);
      let reqData = {
        current: this.currentPageDetailsTable,
        size: this.currentPageSizeDetailsTable,
        allEq: {
          ioOrderNo: val
        }
      };

      this.axios
        .post("/wmsbusiness/ioordermanage/queryActIoDetPages", reqData)
        .then(res => {
          this.detailsTable = res.data.records;
          this.totalSizeDetailsTable = res.data.total;
        })
        .catch(err => {
          console.log(err);
        });
    },

    handleCurrentChange(val) {
      console.log("handleCurrentChange");
      console.log(val);
      this.currentPage = val;
      this.initIoOrderTable();
    },
    handleSizeChange(val) {
      console.log("handleSizeChange");
      console.log(val);
      this.currentPageSize = val;
      this.initIoOrderTable();
    },
    //点击工单明细
    handleDetails(index, row) {
      console.log("handleDetails");
      console.log(index);
      console.log(row);
      this.centerDialogVisible = true;
      this.orderData = row;
      console.log(row);
      this.queryDetailsTable(this.orderData.ioOrderNo);
    },

    // 工单明细分页功能
    handleCurrentChangeDetailsTable(val) {
      console.log("handleCurrentChangeDetailsTableDetailsTable");
      console.log(val);
      this.currentPageDetailsTable = val;
      this.queryDetailsTable(this.orderData.ioOrderNo);
    },
    handleSizeChangeDetailsTable(val) {
      console.log("handleSizeChangeDetailsTableDetailsTable");
      console.log(val);
      this.currentPageSizeDetailsTable = val;
      this.queryDetailsTable(this.orderData.ioOrderNo);
    }
  }
};
</script>

<style lang="scss">
</style>