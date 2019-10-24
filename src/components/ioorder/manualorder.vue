<template>
  <section>
    <el-row class="excel nopt">
      <el-button
        :disabled="this.currentRow.status != '02' ?true :false"
        class="mainButton"
        @click="initButton"
      >手动录入</el-button>
      <!-- <el-button class="mainButton" @click="completeInbound">完成入库</el-button> -->
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
        <!-- <el-table-column type="selection" fixed="left" width="60"></el-table-column> -->
        <el-table-column prop="ioOrderNo" label="入库工单号" fixed="left" width="200"></el-table-column>
        <el-table-column prop="ioTaskNo" label="入库任务号" width="200"></el-table-column>
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
        <el-table-column prop="beginTime" label="工单开始时间" width="400"></el-table-column>
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
        <span class="h_title">入库工单明细</span>
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
          <!-- <el-table-column prop="inStoreCode" label="入库工单编码"></el-table-column>
          <el-table-column prop="contNum" label="箱条码/垛号"></el-table-column>-->
          <el-table-column prop="boxBarCode" label="箱条码" width="80"></el-table-column>
          <el-table-column prop="barCode" label="表条码" width="200"></el-table-column>
          <el-table-column prop="equipCodeDesc" label="设备码描述" width="500"></el-table-column>
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
      <!-- <span slot="footer" class="dialog-footer" style="display:flex;justify-content:flex-end;">
        <el-button class="defaultButton" @click="centerDialogVisible = false">确定</el-button>
      </span>-->
    </el-dialog>

    <el-dialog title :visible.sync="orderDialogVisible" width="50%" center>
      <header class="header">
        <span class="h_title">手动录入</span>
      </header>
      <el-divider class="divider"></el-divider>
      <!-- <el-row style="margin: 0;" class="tableCont out bor_ff bk_ff">
        <el-row class="tabCont">
          <div>
            <div
              class="tab_item"
              style="cursor: pointer;"
              :class="{'active':tabNum == 1}"
              @click="currentTabView(1)"
            >扫描条形码</div>
          </div>
          <div>
            <div
              class="tab_item"
              style="cursor: pointer;"
              :class="{'active':tabNum == 2}"
              @click="currentTabView(2)"
            >扫描箱条码</div>
          </div>
        </el-row>
        <router-view></router-view> 
      </el-row>-->

      <!-- 扫描条形码表格 -->
      <el-row class="pl20 pr20 pt15" v-if="showTabFlag == 1">
        <el-col :span="24">
          <el-form :inline="true" :data="orderFormData">
            <el-row>
              <el-col :span="6">
                <el-select
                  filterable
                  clearable
                  v-model="orderFormData.whaNo"
                  @change="initStores()"
                  placeholder="库区"
                >
                  <el-option
                    v-for="(item,index) in types"
                    :key="index"
                    :label="item.WA_NAME"
                    :value="item.WHA_NO"
                    :disabled="item.FUNCTION_TYPE =='01'? true : false"
                  ></el-option>
                </el-select>
              </el-col>

              <el-col :span="6">
                <el-select filterable clearable v-model="orderFormData.store" placeholder="储位编号">
                  <el-option
                    v-for="(item,index) in stores"
                    :key="index"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-col>

              <el-col :span="6">
                <el-formItem>
                  <el-input v-model="orderFormData.count" placeholder="数量" ref="barinput"></el-input>
                </el-formItem>
              </el-col>
              <el-col :span="6">
                <el-button class="mainButton" @click="insertCount">插入</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
        <el-col :span="24">
          <el-table
            :data="orderBarCodeTable"
            fit
            height="300"
            header-cell-class-name="tableHeaderStyle"
            header-row-class-name="tableRowStyle"
            border
          >
            <el-table-column type="index" width="70" label="序号"></el-table-column>
            <el-table-column prop="whLocNo" label="储位编号"></el-table-column>
            <el-table-column prop="orderQty" label="数量"></el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="info"
                  icon="el-icon-delete"
                  @click="handleDelete1(scope.$index, scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <!-- 扫描箱条码表格 -->
      <!-- <el-row class="pl20 pr20 pt15" v-if="showTabFlag == 2">
        <el-col :span="24">
          <el-form :inline="true" :data="otherFormData">
            <el-row>
              <el-col :span="6">
                <el-formItem>
                  <el-input v-model="otherFormData.container" placeholder="扫描箱条码"></el-input>
                </el-formItem>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
        <el-col :span="24">
          <el-table
            :data="orderConTable"
            fit
            height="300"
            header-cell-class-name="tableHeaderStyle"
            header-row-class-name="tableRowStyle"
            border
          >
            <el-table-column type="index" width="70" label="序号"></el-table-column>
            <el-table-column prop="storeId" label="储位编号"></el-table-column>
            <el-table-column prop="count" label="数量"></el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="info"
                  icon="el-icon-delete"
                  @click="handleDelete2(scope.$index, scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>-->
      <span slot="footer" class="dialog-footer" style="display:flex;justify-content:flex-end;">
        <el-button class="mainButton" @click="orderDialogSave">保存</el-button>
        <el-button class="defaultButton" @click="orderDialogCancel">取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
export default {
  props: { iotaskno: String, currentRow: Object, types: Array },
  data() {
    return {
      stores: [], //储位编号
      // currentRow: "", //当前选中的行
      selectRowList: [], //所有选中的行
      //入库任务号
      // ioTaskNo: "",
      //入库工单数据
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
      //输入框
      orderFormData: {
        whaNo: "", //库区选项
        store: "", //储位号
        count: ""
      },
      //扫描箱条码输入框
      otherFormData: {
        container: ""
      },
      //扫描条形码
      orderBarCodeTable: [],
      //扫描箱条码
      orderConTable: [],

      //工单明细
      detailsTable: [],
      barCode: "",
      container: ""
    };
  },
  computed: {
    //监控 条形码输入框 表条码
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
    //   return this.otherFormData.container;
    // }
  },
  created() {
    console.log("manual created");
    console.log("this.currentRow.status" + this.currentRow.status);
  },
  mounted() {
    // this.ioTaskNo = this.$route.params.id;
    console.log("manual mounted");
    this.initIoOrderTable();
    // this.$emit("test", this.currentPage);
  },
  watch: {
    //监控出入库任务变化
    // $route() {
    //   console.log("manualorder route监控");
    //   this.ioTaskNo = this.$route.params.id;
    //   console.log(this.$route);
    //   this.initIoOrderTable();
    // },
    iotaskno: {
      handler: function(val, oldVal) {
        console.log("this.currentRow.status" + this.currentRow.status);
        this.initIoOrderTable();
      }
      // immediate: true
    },

    //监控条形码输入框 表条码
    // getBarCode(val) {
    //   if (this.orderFormData.container.length == 4) {
    //     if (val.length == 3) {
    //       this.orderBarCodeTable.splice(0, 0, {
    //         barCode: val,
    //         boxBarCode: this.orderFormData.container
    //       });
    //       this.orderFormData.barCode = "";
    //     } else if (val.length > 3) {
    //       this.orderFormData.barCode = "";
    //     }
    //   } else {
    //     this.orderFormData.container = "";
    //     this.orderFormData.barCode = "";
    //   }
    // },
    /**
     *监控条形码输入框 箱条码
     */
    getContainer(val) {
      // if (val.length == 4) {
      //   this.orderFormData.container = val;
      //   this.$refs.barinput.focus();
      // } else if (val.length > 4) {
      //   this.orderFormData.barCode = "";
      //   this.orderFormData.container = "";
      // }
    }
    /**
     * 监控条形码输入框 箱条码
     */
    // getAnotherContainer(val) {
    //   console.log("getAnotherContainer " + val);
    // }
  },
  methods: {
    //按钮设置
    initButton() {
      this.orderDialogVisible = true;
    },
    //初始化储位号
    initStores() {
      this.axios
        .get("/wmsbusiness/iotask/getInboundLocs", {
          params: {
            whNo: this.currentRow.whNo,
            whaNo: this.orderFormData.whaNo
          }
        })
        .then(res => {
          console.log("getInboundLocs");
          this.stores = res.data;
        })
        .catch(err => {
          this.loading = false; //取消加载动画
          this.$notify.error({
            title: "错误",
            message: "获取储位编号失败"
          });
        });
    },
    //完成入库
    // async completeInbound() {
    //   this.loading = true;
    //   await this.axios
    //     .get("/wmsbusiness/ioordermanage/completeOrder", {
    //       params: {
    //         iotaskno: this.iotaskno
    //       }
    //     })
    //     .then(res => {
    //       if (res.data == true) {
    //         this.$alert("已经完成入库任务", "成功", {
    //           confirmButtonText: "确定",
    //           type: "success",
    //           center: true
    //         });
    //       } else {
    //         this.$alert("剩余未完成的工单任务", "失败", {
    //           confirmButtonText: "确定",
    //           type: "warning",
    //           center: true
    //         });
    //       }
    //     })
    //     .catch(err => {
    //       this.$notify.error({
    //         title: "错误",
    //         message: "操作失败"
    //       });
    //     });
    //   this.loading = false; //取消加载动画
    // },
    insertCount() {
      //当前输入的数量
      let counts = parseInt(this.orderFormData.count);
      //判断储位号是否已经使用
      let result = this.orderBarCodeTable.map(function(item) {
        //累加合计任务数量
        counts += parseInt(item.orderQty);
        return item.whLocNo;
      });
      console.log(result);
      console.log(counts);
      if (counts > this.currentRow.taskQty - this.currentRow.finishQty) {
        this.$alert("当前任务总数超过任务限制", "警告", {
          confirmButtonText: "确定",
          type: "warning",
          center: true
        });
        return;
      }
      if (result.includes(this.orderFormData.store)) {
        this.$alert("重复使用储位", "警告", {
          confirmButtonText: "确定",
          type: "warning",
          center: true
        });
        return;
      }
      this.orderBarCodeTable.splice(0, 0, {
        //库区编号
        whaNo: this.orderFormData.whaNo,
        //储位号
        whLocNo: this.orderFormData.store,
        //数量
        orderQty: this.orderFormData.count
      });
      //清空输入框
      this.orderFormData.store = "";
      this.orderFormData.count = "";
    },
    /**
     * 扫码入库保存，取消按钮
     */
    async orderDialogSave() {
      let reqData = this.orderBarCodeTable;
      console.log(reqData);
      if (reqData.length == 0) {
        this.$alert("至少要有一条数据插入", "警告", {
          confirmButtonText: "确定",
          type: "warning",
          center: true
        });
        return;
      }
      reqData.forEach(element => {
        element.ioTaskNo = this.iotaskno;
        element.equipCode = this.currentRow.equipCode;
        //无法找到该字段
        // element.pileNo = this.currentRow.pileNo;
        element.whNo = this.currentRow.whNo;
        element.status = "05";
        element.operator = "test Man";
        element.orderType = "02";
        element.batchNumber = this.currentRow.batchNumber;
      });
      await this.axios
        .post("/wmsbusiness/ioordermanage/saveManualOrders", reqData)
        .then(res => {
          if (res.data == true) {
            this.$alert("数据插入成功", "成功", {
              confirmButtonText: "确定",
              type: "success",
              center: true
            });
          } else {
            this.$alert("当前任务总数超过任务限制", "警告", {
              confirmButtonText: "确定",
              type: "warning",
              center: true
            });
          }
          this.initIoOrderTable();
        })
        .catch(err => {
          this.$notify.error({
            title: "错误",
            message: "数据加载失败"
          });
        });
      this.orderDialogCancel();
      await this.$emit("refreshTable");
    },
    orderDialogCancel() {
      this.orderDialogVisible = false;
      this.orderBarCodeTable = [];
      this.orderConTable = [];
      this.orderFormData = {
        whaNo: "", //库区选项
        store: "",
        count: ""
      };
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
    handleDelete1(index, row) {
      console.log(index);
      this.orderBarCodeTable.splice(index, 1);
    },
    handleDelete2(index, row) {
      console.log(index);
      this.orderConTable.splice(index, 1);
    },
    currentTabView(val) {
      //切换tab
      this.showTabFlag = val;
      this.tabNum = val;
    },
    initIoOrderTable() {
      console.log("initIoOrderTable");
      // this.ioTaskNo = this.$route.params.id;
      let reqData = {
        current: this.currentPage,
        size: this.currentPageSize,
        allEq: {
          ioTaskNo: this.iotaskno,
          orderType: "02"
        }
      };

      this.axios
        .post("/wmsbusiness/ioordermanage/queryOrderPages", reqData)
        .then(res => {
          console.log("res = " + res.data.records);
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