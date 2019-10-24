<template>
    <ul class="dNav-items">
        <li class="dNav-item" v-for="(item,index) in treeList" :key="index">
            <i :class="{'vis':isNull(item.children),'el-icon-s-grid':item.type==1}" @click="isShow(item.children.length,item)"></i>
            <i :class="{'el-icon-menu':item.type==2}"></i>
            <span @click="getInfo(item)">{{item.label}}</span>
            <my-tree
              tag="ul"
              class="cli-items"
              v-if="!isNull(item.children)"
              v-show="!item.open"
              :treeList="item.children"
              @getdata="getdata"
            ></my-tree>
        </li>
    </ul>
</template>
<script>
export default {
		name: 'myTree',
		data () {
			return {
			}
		},
    props: {
			treeList: Array,
			default: []
		},
    methods: {
      isShow(len,item){
				if(len>0){
          if(typeof item.open === 'undefined'){
            this.$set(item,'open',true)
          }else{
            item.open = !item.open
          }
            // this.open = !this.open
        }
      },
      //判断数组是否为空
      isNull(arr){
        if(typeof arr == 'undefined') return true
        if(arr.length == 0) return true
        return false
      },
      //选择预览页面
      getInfo(data){
        console.log(data)
        this.$emit('getdata',data)
      },
      getdata(data){
        this.$emit('getdata',data)
      }
    }
}
</script>
<style lang="scss" scoped>
	.dNav-items{
		.dNav-item{
			padding: 10px;
			margin: 0;
			background-color: #fff;
			cursor: pointer;
      .vis{
        visibility: hidden;
      }
			i{
        color: #778899;
				font-size: 16px;
				cursor: pointer;
			}
			span{
				padding: 0 0 0 15px;
				color:#778899;
				font-size: 14px;
			}
			.cli-items{
			padding: 10px 0 10px 10px;
			li{
				cursor: pointer;
				span{
					padding: 0 0 0 10px;
				}
			}
			
			}
		}
	}
</style>
