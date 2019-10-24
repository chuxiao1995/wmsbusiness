<template>
  <el-dialog :visible.sync="vis" width="60%" @close="closeDialog" @opened="loadData" center>
    <section class="container">
      <section class="main">
        <header class="header">
          <span class="h_title">任务明细</span>
        </header>
        <el-divider class="divider"></el-divider>
        <el-row class="tableCont notftr bor_ff bk_ff">
          <el-table
            v-loading="loading"
            ref="myTables1"
            :data="tableData"
            height="340"
            header-cell-class-name="tableHeaderStyle"
            header-row-class-name="tableRowStyle"
            border
          >
            <el-table-column type="index" :index="indexMethod" label="序号" width="80"></el-table-column>
            <el-table-column prop="ioTaskNo" label="入库任务号" width="150"></el-table-column>
            <el-table-column prop="barCode" label="设备条形码" width="150"></el-table-column>
            <el-table-column prop="equipCode" label="物料码" width="150"></el-table-column>
            <el-table-column prop="equipDesc" label="物料码描述" min-width="100%"></el-table-column>
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
      </section>
    </section>
  </el-dialog>
</template>

<script>
export default {
  props: {
    centerDialogVisible: {
      type: Boolean
    },
    testData: {
      default: ""
    }
  },
  data() {
    return {
      currentPage: 1, //默认当前页1
      currentPageSize: 10, //默认每页显示条数10
      totalNum: 0, //表格总条数
      vis: false,
      loading: true, //表格动画
      tableData: []
    };
  },

  methods: {
    closeDialog() {
      this.$emit("close", false); //子向父组件传值
    },
    indexMethod(index) {
      console.log("indexMethod");
      return (this.currentPage - 1) * this.currentPageSize + index + 1;
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
      var urlAPI = "/wmsbusiness/iodet/getwiodetbytaskno";
      this.axios
        .get(urlAPI, {
          params: {
            taskNO: this.testData.ioTaskNo,
            currentPage: this.currentPage,
            currentPageSize: this.currentPageSize
          }
        })
        .then(res => {
          this.tableData = []; //清空表格的数据
          this.loading = false; //取消加载动画
          this.totalNum = res.data.total;
          console.log(res.data);
          console.log(res.data.records);
          let obj = null;
          if (res.data.records.length > 0) {
            for (let i = 0; i < res.data.records.length; i++) {
              obj = {
                ioTaskNo: res.data.records[i].ioTaskNo,
                barCode: res.data.records[i].barCode,
                equipCode: this.testData.equipCode,
                equipDesc: this.testData.equipCodeDesc
              };
              this.tableData.push(obj);
            }
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
    centerDialogVisible(val) {
      this.vis = val;
    }
  }
};
</script>

<style lang="scss">
</style>