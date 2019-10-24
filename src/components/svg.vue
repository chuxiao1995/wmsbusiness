<template>
  <div class="goodsArea">
    <div class="goodsLocation"
      v-for="(item,index) in goodsList"
      :key="index"
      >
      <div class="goodsNum"
        v-for="(gItem,gIndex) in item.gpNum"
        :key="gIndex"
        :style="{height:gItem.height+'px',width:gItem.width+'px'}"
        >
        {{gItem.num}}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      goodsList: [
        {
          column: 6,
          row: 1,
          gpNum:[
            {num:'a1',width:60,height:30},
            {num:'a2',width:20,height:30},
            {num:'a3',width:40,height:30},
            {num:'a4',width:40,height:30},
            {num:'a5',width:20,height:30},
            {num:'a6',width:60,height:30},
            {num:'a6',width:60,height:30},
            {num:'a6',width:60,height:30},
            {num:'a6',width:60,height:30},
            {num:'a6',width:60,height:30},
            {num:'a6',width:60,height:30},
            {num:'a6',width:60,height:30},
            {num:'a6',width:60,height:30},
            {num:'a6',width:60,height:30},
          ]
        },
        {
          column:6,
          row: 2,
          gpNum:[
            {num:'b1',width:60,height:30},
            {num:'b2',width:60,height:30},
            {num:'b3',width:60,height:30},
            {num:'b4',width:60,height:30},
            {num:'b5',width:60,height:30},
            {num:'b6',width:60,height:30},
            {num:'b7',width:60,height:30},
            {num:'b8',width:60,height:30},
            {num:'b9',width:60,height:30},
            {num:'b10',width:60,height:30},
            {num:'b11',width:60,height:30},
            {num:'b12',width:60,height:30},
          ]
        }
      ]
    }
  },
  methods: {
    getAlign(position){
      return position == 'bottom' ? 'flex-end' : 'flex-start'
    }
  }
}
</script>
<style lang="scss" scoped>
  .goodsArea{
    box-sizing: border-box;
    outline: 1px solid #ee8262;
    .goodsLocation{
      display: inline-block;
      width: 60px;
      padding: 10px 15px 15px 15px;
      .goodsNum{
        display: inline-block;
        outline: 1px rgb(75, 175, 175) solid;
      }
    }
  }
</style>