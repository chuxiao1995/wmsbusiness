<template>
  <div style="padding: 20px 0 15px 15px;box-sizing: border-box;" class="container">
    <el-row type="flex">
      <el-col :span="3" class="bor_ff bk_ff bxs">
        <div style="padding: 15px;">
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
          <my-tree @getdata="getData" :treeList="data"></my-tree>
        </div>
      </el-col>
      <el-col :span="21" style="display:flex;justify-content:center;align-items:center;">
        {{selectTree}}
      </el-col>
    </el-row>
  </div>
</template>
<script>
import myTree from './myTree'
export default {
  components: {
    myTree
  },
  data() {
    return {
      filterText: '',
      selectTree: '',
      data: [{
        id: 1,
        label: '一级 1',
        type: 1,
        children: [{
          id: 4,
          label: '二级 1-1',
          type: 1,
          children: [{
            id: 9,
            label: '三级 1-1-1',
            type: 2
          }, {
            id: 10,
            label: '三级 1-1-2',
            type: 2
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        type: 1,
        children: [{
          id: 5,
          label: '二级 2-1',
          type: 2
        }, {
          id: 6,
          label: '二级 2-2',
          type: 2
        }]
      }, {
        id: 3,
        label: '一级 3',
        type: 1,
        children: [{
          id: 7,
          label: '二级 3-1',
          type: 2
        }, {
          id: 8,
          label: '二级 3-2',
          type: 2
        }]
      }],
      copy: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    };
  },
  mounted () {
    this.copy = this.data //在请求数据的时候做这一步操作
  },
  watch: {
    filterText(val) {
     this.data = this.deal(this.copy,node => node.label.indexOf(val) != -1)
     console.log(this.data)
    }
  },
  methods: {
    deal(nodes, predicate) {
    // 如果已经没有节点了，结束递归
      if (!(nodes && nodes.length)) {
          return;
      }
      const newChildren = [];
      for (const node of nodes) {
        const subs = this.deal(node.children, predicate);
        // 以下两个条件任何一个成立，当前节点都应该加入到新子节点集中
        // 1. 子孙节点中存在符合条件的，即 subs 数组中有值
        // 2. 自己本身符合条件
        if ((subs && subs.length) || predicate(node)) {
            node.children = subs;
            newChildren.push(node);
        }
      }
      return newChildren.length ? newChildren : void 0;
    },
    getData(data){
      console.log(data)
      this.selectTree = data.label
    }
  }
}
</script>

<style lang="scss">
  .el-tree{
    .el-tree-node__content{
      &:hover{
        background-color: #7AC5CD;
      }
    }
  }
</style>