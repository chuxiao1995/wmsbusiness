<template>
  <el-dialog :visible.sync="vis" width="60%" @close="closeDialog" @opened="loadData">
    <section class="container">
      <header class="header">
        <span class="h_img"></span>
        <span class="h_title">任务详情</span>
      </header>
      <section class="main">
        <el-col>
          <el-form ref="form" :model="form" label-width="100px">
            <el-row>
              <el-col :span="6">
                <el-form-item label="出入库任务号">
                  <el-input v-model="form.ioTaskNo" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="设备类别">
                  <el-input v-model="form.equipCateg" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="接线方式">
                  <el-input v-model="form.wiringMode" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="设备规格">
                  <el-input v-model="form.ioTaskNo" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="类别">
                  <el-input v-model="form.typeCode" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="电压">
                  <el-input v-model="form.voltCode" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="电流">
                  <el-input v-model="form.ratedCurrent" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="芯片厂家">
                  <el-input v-model="form.chipManufacturer" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="费率类型">
                  <el-input v-model="form.ioTaskNo" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="额定电流变比">
                  <el-input v-model="form.rcRatioCode" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="电价标识">
                  <el-input v-model="form.ioTaskNo" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="准确度等级">
                  <el-input v-model="form.ioTaskNo" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="型号">
                  <el-input v-model="form.modelCode" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="电压变比">
                  <el-input v-model="form.voltRatioCode" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="批次号">
                  <el-input v-model="form.batchNumber" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </section>
      <section class="main">
        <header class="header">
          <span class="h_img"></span>
          <span class="h_title">设备码匹配列表</span>
        </header>
        <el-row class="tableCont notftr bor_ff bk_ff">
          <el-table
            v-loading="loading"
            ref="myTables1"
            :data="tableData"
            height="375"
            header-cell-class-name="tableHeaderStyle"
            header-row-class-name="tableRowStyle"
            border
            @row-click="showRow"
          >
            <el-table-column type="index" :index="indexMethod" label="序号" width="80"></el-table-column>
            <el-table-column
              label="选择"
              fixed="left"
              width="60"
              header-align="center"
              align="center"
            >
              <template scope="scope">
                <el-radio class="radio" v-model="radio" :label="scope.$index">&nbsp;</el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="equipCode" label="物料码" width="150"></el-table-column>
            <el-table-column prop="equipDesc" show-overflow-tooltip label="物料码描述" min-width="100%"></el-table-column>
            <el-table-column prop="sortCode" label="类别" min-width="100%"></el-table-column>
            <el-table-column prop="typeCode" label="类型" min-width="100%"></el-table-column>
            <el-table-column prop="modelCode" label="型号" min-width="100%"></el-table-column>
            <el-table-column prop="wiringMode" label="接线方式" min-width="100%"></el-table-column>
            <el-table-column prop="manufacturerUnit" label="制造单位" min-width="100%"></el-table-column>
            <el-table-column prop="commProtCode" label="通讯规约" min-width="100%"></el-table-column>
            <el-table-column prop="chipManufacturer" label="芯片厂家" min-width="100%"></el-table-column>
            <el-table-column prop="collMode" label="采集方式" min-width="100%"></el-table-column>
            <el-table-column prop="commMode" label="通讯方式" min-width="100%"></el-table-column>
            <el-table-column prop="coltCode" label="电压" min-width="100%"></el-table-column>
            <el-table-column prop="ratedCurrent" label="标定电流" min-width="100%"></el-table-column>
            <el-table-column prop="apPreLevelCode" label="有功准确等级" min-width="100%"></el-table-column>
            <el-table-column prop="rpPreLevelCode" label="无功准确等级" min-width="100%"></el-table-column>
            <el-table-column prop="rvCode" label="额定电流" min-width="100%"></el-table-column>
          </el-table>
        </el-row>
        <el-row type="flex" justify="end">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="currentPageSize"
            layout="prev, pager, next,sizes,jumper,total"
            :total="totalNum"
          ></el-pagination>
        </el-row>
        <!-- <div class="dialog-footer-button"> -->
        <span slot="footer" class="flex end">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="closeDialog">确 定</el-button>
        </span>
        <!-- </div> -->
      </section>
    </section>
  </el-dialog>
</template>
<script>
export default {
  props: {
    editDialogVisible: {
      type: Boolean
    },
    testData: {
      default: []
    }
  },
  data() {
    return {
      loading: true, //表格动画
      radio: "",
      selected: {},
      currentPage: 1, //默认当前页1
      currentPageSize: 10, //默认每页显示条数10
      totalNum: 0, //表格总条数
      vis: false,
      loading: false, //表格动画
      tableData: [],
      form: {
        ioTaskNo: "",
        equipCateg: "",
        wiringMode: "",
        ioTaskNo: "", //待确定
        typeCode: "",
        voltCode: "",
        ratedCurrent: "",
        chipManufacturer: "",
        ioTaskNo: "", //待确定
        rcRatioCode: "",
        ioTaskNo: 1, //待确定
        ioTaskNo: 1, //待确定
        modelCode: "",
        voltRatioCode: "",
        batchNumber: ""
      }
    };
  },

  methods: {
    //单选逻辑
    showRow(row) {
      //赋值给radio
      this.radio = this.tableData.indexOf(row);
      this.selected = row;
    },
    indexMethod(index) {
      console.log("indexMethod");
      return (this.currentPage - 1) * this.currentPageSize + index + 1;
    },
    closeDialog() {
      this.$emit("close", false); //子向父组件传值
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.loadData();
    },
    handleSizeChange(val) {
      this.currentPageSize = val;
      this.loadData();
    },
    loadData() {
      this.form = this.testData;
      var urlAPI = "/wmsbusiness/syscode/getequipcodebycondition";
      this.axios
        .get(urlAPI, {
          params: {
            currentPage: this.currentPage,
            currentPageSize: this.currentPageSize
          }
        })
        .then(res => {
          this.loading = false; //取消加载动画
          this.tableData = []; //清空表格的数据
          this.totalNum = res.data.total;
          console.log(res.data);
          console.log(res.data.records);
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
    }
  },
  watch: {
    //从父组件绑定的值规定在子组件中不要更改，用监听变化的方式 用另一个变量接收
    editDialogVisible(val) {
      this.vis = val;
    }
  }
};
</script>
<style lang="scss">
</style>