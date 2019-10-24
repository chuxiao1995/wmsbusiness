<template>
  <el-dialog
    title="提示"
    :visible.sync="vis"
    width="30%"
    center>
    <span>{{testData}}</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="closeDialog">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    centerDialogVisible:{
      type: Boolean
    },
    testData:{
      default: ''
    }
  },
  data () {
    return {
      vis: false
    }
  },
  methods: {
    closeDialog(){
      alert(this.testData)
      this.$emit('close',false)//子向父组件传值  
    }
  },
  watch: {
    //从父组件绑定的值规定在子组件中不要更改，用监听变化的方式 用另一个变量接收
    centerDialogVisible(val){
        this.vis = val
    }
  },
}
</script>

