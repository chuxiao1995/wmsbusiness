<template>
  <article class="container">
    <section class="details">
      <el-row style="width:60%;">
        <el-col :span="4">
          <label class="green b">任务编码：</label>
          <span>{{info.taskNum}}</span>
        </el-col>
        <el-col :span="4">
          <label class="green b">工单数：</label>
          <span>{{info.workOdd}}</span>
        </el-col>
        <el-col :span="4">
          <label class="green b">已完成工单数：</label>
          <span>{{info.finWorkOdd}}</span>
        </el-col>
        <el-col :span="4">
          <label class="green b">未完成工单数：</label>
          <span>{{info.unfinWorkOdd}}</span>
        </el-col>
        <el-row style="width:60%;margin-top:40px;">
          <label class="green b">总体工单完成数：</label>
          <el-progress :percentage="percentage" :color="customColor"></el-progress>
        </el-row>
      </el-row>
      <el-row class="select">
        <input type="text" class="selectCont" placeholder="货位号/箱条码">
        <button class="selectBtn">
          <svg class="icon" style="color:#fff;font-size:25px;" aria-hidden="true">
              <use xlink:href="#icon-fangdajing"></use>
          </svg>
        </button>
      </el-row>
    </section>
    <el-divider class="divider"></el-divider>
    <section class="view">
      <aside class="leftTip">
        <section>
          <div class="color blue"></div>
          <span>分配</span>
        </section>
        <section>
          <div class="color green"></div>
          <span>完成</span>
        </section>
        <section>
          <div class="color orange"></div>
          <span>有货</span>
        </section>
        <section>
          <div class="color blank"></div>
          <span>无货</span>
        </section>
        <section>
          <div class="color dis">
            <svg class="icon" style="color:#fff;font-size:25px;" aria-hidden="true">
                <use xlink:href="#icon-ai55"></use>
            </svg>
          </div>
          <span>停用</span>
        </section>
        <section>
          <div class="color lock">
            <svg class="icon" style="color:#fff;font-size:20px;" aria-hidden="true">
                <use xlink:href="#icon-suoding"></use>
            </svg>
          </div>
          <span>锁定</span>
        </section>
      </aside>
      <section class="goodsView">
        <div class="leftView">
          <div class="numCont">
            <div 
              v-for="(column,columnIndex) in column_count+1"
              :key="columnIndex"
              >
              <template v-if="columnIndex == 0">
                <div class="place">
                  
                </div>
              </template>
              <template v-else>
                <div class="word">
                  {{columnIndex < 10 ? '0'+columnIndex:columnIndex}}
                </div>
              </template>
            </div>
          </div>
          <section 
            class="gridCont"
            v-for="(item,index) in lyary_count"
            :key="index"
            >
            <div>
              <div class="word">
                {{Math.abs(index-lyary_count)< 10 ? '0'+Math.abs(index-lyary_count):Math.abs(index-lyary_count)}}
              </div>
            </div>
            <div
              v-for="(childItem,childIndex) in goodsArr.slice(index*column_count+1,column_count*(index+1)+1)"
              :key="childIndex"
              @click="openDialog(childItem.status)"
            >
              <template v-if="childItem.status == 1">
                <div class="lattice distribution"></div>
              </template>
              <template v-else-if="childItem.status == 2">
                <div class="lattice finish"></div> 
              </template>
              <template v-else-if="childItem.status == 3">
                <div class="lattice instock"></div>
              </template>
              <template v-else-if="childItem.status == 4">
                <div class="lattice blank"></div>
              </template>
              <template v-else-if="childItem.status == 5">
                <div class="lattice dis">
                  <svg class="icon" style="color:#fff;font-size:25px;" aria-hidden="true">
                      <use xlink:href="#icon-ai55"></use>
                  </svg>
                </div>
              </template>
              <template v-else>
                <div class="lattice lock">
                  <svg class="icon" style="color:#fff;font-size:20px;" aria-hidden="true">
                      <use xlink:href="#icon-suoding"></use>
                  </svg>
                </div>
              </template>
            </div>
          </section>
        </div>
        <div class="rightView">

        </div>
      </section>
    </section>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      >
      <span>{{this.status}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </article>
</template>
<script>
export default {
  data () {
    return {
      percentage: 100,
      customColor: 'rgb(36, 153, 153)',
      info:{
        taskNum: '032487689',
        workOdd: '112',
        finWorkOdd: '100',
        unfinWorkOdd: '12',
      },
      dialogVisible: false,
      status: '',
      goodsArr: [],
      lyary_count: 12,
      column_count: 64,
    }
  },
  mounted() {
    this.makeData()
  },
  methods: {
    makeData(){
      for(let i = 0;i<this.column_count*this.column_count;i++){
        let obj = {
          status: ~~(Math.random()*(7-1) + 1)
        }
        this.goodsArr.push(obj)
      }
    },
    openDialog(status){
      this.dialogVisible = true
      this.status = status
    }
  },
}
</script>
<style lang="scss" scope>
  .details{
    color: #666;
    padding: 20px 0 0 15px;
    display: flex;
    .select{
      width: 30%;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      .selectCont{
        height: 28px;
        width: 250px;
      }
      .selectBtn{
        height: 34px;
        width: 50px;
        border: 0;
        background-color: rgb(36, 153, 153);
      }
    }
  }
  .view{
    display: flex;
    height: calc(100% - 130px);
    .leftTip{
      padding: 0 15px;
      width: 120px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
        .color{
          width: 60px;
          height: 25px;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          vertical-align: middle;
          margin: 15px 0;
          &.blue{
            background-color: rgb(36, 101, 199);
          }
          &.green{
            background-color: rgb(36, 153, 153);
          }
          &.orange{
            background-color: #ee8262;
          }
          &.blank{
            background-color: #fff;
            outline: #ee8262 1px solid;
          }
          &.dis,&.lock{
            background-color: rgb(235, 178, 161);
          }
        }
        span{
          font-size: 13px;
          color: #666;
          padding: 0 10px;
          text-align: center;
        }
    }
    .goodsView{
      width: calc(100% - 280px);
      height: 100%;
      .leftView{
        overflow: auto;
        .numCont{
          display: flex;
          flex-wrap: nowrap;
          .place{
            width: 60px;
            height: 25px;
            margin: 0 5px;
          }
          .word{
            width: 58px;
            height: 25px;
            border: 1px #999 solid;
            text-align: center;
            margin: 0 5px;
          }
        }
        .gridCont{
          display: flex;
          flex-wrap: nowrap;
          .word{
            width: 58px;
            height: 25px;
            border: 1px #999 solid;
            text-align: center;
            margin: 5px 5px;
          }
          .lattice{
            width: 60px;
            height: 25px;
            margin: 5px 5px;
            cursor: pointer;
            &.distribution{
              background-color: rgb(36, 101, 199);
            }
            &.finish{
              background-color: rgb(36, 153, 153);
            }
            &.instock{
              background-color: #ee8262;
            } 
            &.blank{
              width: 58px;
              background-color: #fff;
              border: #ee8262 1px solid;
            }
            &.dis,&.lock{
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: rgb(235, 178, 161);
            } 
          }
          
        }
      }
      
    }
  }
</style>