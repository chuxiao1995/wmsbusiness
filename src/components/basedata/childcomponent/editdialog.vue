<template>
  <el-dialog :visible.sync="vis" width="60%" @close="closeDialog" @opened="loadData">
    <section class="container">
      <header class="header">
        <span class="h_img"></span>
        <span class="h_title">物资信息</span>
      </header>
      <section class="main">
        <el-row class="tableCont notftr bor_ff bk_ff">
          <el-form ref="form" :model="form" label-width="150px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="供应商编码">
                  <el-input v-model="form.supplierCode"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="供应商组织机构代码">
                  <el-input v-model="form.supplierOrgNo"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="供应商名称">
                  <el-input v-model="form.supplierName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="供应商简称">
                  <el-input v-model="form.supplierShortName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备类别">
                  <el-input v-model="form.equipType"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="地址">
                  <el-input v-model="form.supAddress"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系人">
                  <el-input v-model="form.contact"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-row>
        <span slot="footer" class="flex end">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="saveData">确 定</el-button>
        </span>
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
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      vis: false,
      form: {
        supplierCode: "",
        supplierOrgNo: "",
        supplierName: "",
        supplierShortName: "", //待确定
        equipType: "",
        supAddress: "",
        contact: ""
      }
    };
  },
  methods: {
    loadData() {
      if (this.testData != null) {
        this.form = this.testData;
      }
    },
    closeDialog() {
      this.$emit("close", false); //子向父组件传值
    },
    saveData() {
      if (
        this.supplierShortName == "" &&
        this.supplierName == "" &&
        this.equipType == "" &&
        this.supplierCode == "" &&
        this.status == "" &&
        this.supAddress == "" &&
        this.contact
      ) {
        this.closeDialog();
      } else {
        var urlAPI = "/wmsbasedata/supplierinfo/add";
        this.axios
          .post(urlAPI, {
            supplierShortName: this.form.supplierShortName,
            supplierName: this.form.supplierName,
            equipType: this.form.equipType,
            supplierCode: this.form.supplierCode,
            status: "01",
            supplierOrgNo: this.form.supplierOrgNo,
            supAddress: this.form.supAddress,
            contact: this.form.contact
          })
          .then(res => {
            if (res.data == "suc") {
              this.closeDialog();
            } else {
              this.$notify.error({
                title: "错误",
                message: "数据添加失败"
              });
            }
          })
          .catch(err => {
            this.$notify.error({
              title: "错误",
              message: "数据添加失败"
            });
          });
      }
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
<style scoped>
</style>