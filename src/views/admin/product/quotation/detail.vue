<template>
    <div class="app-container">
        <el-row :gutter="24">
            <el-col :span="24" :xs="24">
                <el-button plain @click="exportToExcel" v-if="isDownLoad">下载内容</el-button>
            </el-col>
        </el-row>
        <el-row :gutter="24" style="margin-top: 10px;">
            <el-col :span="24" :xs="24">
                <el-table :data="SubcomponentCost" border height="800"
                    element-loading-text="正在查询数据" element-loading-spinner="el-icon-loading" v-loading="tableLoading"
                    element-loading-background="rgba(217, 217, 217, 0.8)" @cell-mouse-enter="handleCellEnter"
                    @cell-mouse-leave="handleCellLeave" @cell-dblclick="handleCellClick" :cell-style="cellStyle">

                    <el-table-column v-if="false" label="dataType" prop="dataType"></el-table-column>

                    <el-table-column label="订单批号" prop="orderBatchNumber" width="130" ></el-table-column>

                    <el-table-column label="半成品编码" prop="semiFinishedProductCode" width="130"></el-table-column>

                    <el-table-column label="半成品名称" prop="semiFinishedProductName" width="150">
                        <template slot-scope="scope">
                            <div class="item__nowrap" :title="scope.row.semiFinishedProductName">{{ scope.row.semiFinishedProductName }}</div>
                        </template>
                    </el-table-column>

                    <el-table-column label="子件编码" prop="subcomponentCode" width="130"></el-table-column>

                    <el-table-column label="子件名称" prop="subcomponentName" >
                        <template slot-scope="scope">
                            <div class="item__nowrap" :title="scope.row.subcomponentName">{{ scope.row.subcomponentName }}</div>
                        </template>
                    </el-table-column>

                    <el-table-column label="单位" prop="unit"></el-table-column>

                    <el-table-column label="标准用量" prop="standardUsage" ></el-table-column>

                    <el-table-column label="损耗率" prop="lossRate"></el-table-column>

                    <el-table-column label="实际用量" prop="actualUsage"></el-table-column>

                    <el-table-column label="位号" prop="positionNumber">
                        <template slot-scope="scope">
                            <div class="item__nowrap" :title="scope.row.positionNumber">{{ scope.row.positionNumber }}</div>
                        </template>
                    </el-table-column>

                    <el-table-column label="单价" prop="unitPrice">
                        <div class="item" slot-scope="scope">
                            <el-input class="item__input" type="textarea" v-model="scope.row.unitPrice"
                                placeholder="请输入内容"
                                @blur="handleBlur(scope.row)"
                                @keyup.enter.native.prevent="handleEnter(scope.row)" ></el-input>
                            <div class="item__txt">{{scope.row.unitPrice}}</div>
                        </div>
                    </el-table-column>


                    <el-table-column label="金额" prop="amount"></el-table-column>



                    <el-table-column label="供应商" prop="supplier">
                        <template slot-scope="scope">
                            <div class="item__nowrap" :title="scope.row.supplier">{{ scope.row.supplier }}</div>
                        </template>
                    </el-table-column>

                    <el-table-column label="最高价" prop="highestPrice"></el-table-column>

                    <el-table-column label="最高价供应商" prop="highestPriceSupplier">
                        <template slot-scope="scope">
                            <div class="item__nowrap" :title="scope.row.highestPriceSupplier">{{ scope.row.highestPriceSupplier }}</div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import { getSubcomponentCost, modifySubcomponentCost, downloadSubcomponentCostDetails } from "@/api/admin/product/quotation"

    export default {
        name: 'detail',
        props: {
            parentCostData: {
                type: String,
                default: () => ""
            },
        },
        data() {
            return {
                orderItm: "",
                //订单成本明细-和子件成本明细表格显示
                SubcomponentCost: [],
                // 需要编辑的属性
                editProp: [ 'unitPrice'],
                // 保存进入编辑的cell
                clickCellMap: {},
                //标志变量 控制回车后不处触发失去焦点
                isEnterPressed: false ,
                //项目路径
                projectUrl: '',
                tableLoading: false,
                isDownLoad: false,
            }
        },
        created(){
            this.orderItm=this.parentCostData;
            this.projectUrl = process.env.VUE_APP_API_BASE_URL;
            this.QueryDetail();
        },
        methods: {
            //查询表格数据
            QueryDetail(){
                let order= this.orderItm.split('-');
                this.tableLoading=true;
                getSubcomponentCost( {order:order[0] ,itm:order[1] })
                    .then(response => {
                            this.SubcomponentCost= response.data;
                            this.tableLoading=false;
                            this.isDownLoad=true;
                    })
                    .catch(() => {
                        this.tableLoading = false;
                    });
            },
            cellStyle({ row, column, rowIndex, columnIndex }) {
                if (row.dataType==1 && row.unitPrice==0 && column.property=="unitPrice"){
                    return {
                        height:'30px  !important',
                        background: '#ff0000',
                        padding: '0px 0px'
                    };
                }
                if (this.isyellow(row.dataType)) {
                    return {
                        height:'30px  !important',
                        background: '#ffff00',
                        padding: '0px 0px'
                    };
                }
            },
            //判断数据是否能进行更改
            isyellow(str){
                if(str === 2 || str === 3 || str === 4 || str === 6){
                    return true;
                }
                return false;
            },
            //鼠标移入
            handleCellEnter (row, column, cell, event) {
              const property = column.property
              if (this.editProp.includes(property) && !this.isyellow(row.dataType)) {
                cell.querySelector('.item__txt').classList.add('item__txt--hover')
              }
            },
            /** 鼠标移出cell */
            handleCellLeave (row, column, cell, event) {
              const property = column.property
              if (this.editProp.includes(property) && !this.isyellow(row.dataType)) {
                cell.querySelector('.item__txt').classList.remove('item__txt--hover')
              }
            },
            /** 点击cell */
            handleCellClick (row, column, cell, event) {
              const property = column.property
              if (this.editProp.includes(property) && !this.isyellow(row.dataType)) {
                // 保存cell
                this.saveCellClick(row, cell)
                cell.querySelector('.item__txt').style.display = 'none'
                cell.querySelector('.item__input').style.display = 'block'
                cell.querySelector('.el-textarea__inner').focus()
              }
            },
            //输入框失去焦点--如果不是回车触发的更新数据
            handleBlur(row){
               if (!this.isEnterPressed) { // 如果不是因为回车而失去焦点，则执行相应操作
                 this.save(row);
               }
               // 重置标志变量
               this.isEnterPressed = false;
            },
             //输入框失去焦点--回车触发的并关闭失去焦点保存数据选项
            handleEnter(row){
               this.isEnterPressed = true;
               this.save (row);
            },
            /** 取消编辑状态 */
            cancelEditable (cell) {
              cell.querySelector('.item__txt').style.display = 'block'
              cell.querySelector('.item__input').style.display = 'none'
            },
            /** 保存进入编辑的cell */
            saveCellClick (row, cell) {
              const id = row.subId
              if (this.clickCellMap[id] !== undefined) {
                if (!this.clickCellMap[id].includes(cell)) {
                  this.clickCellMap[id].push(cell)
                }
              } else {
                this.clickCellMap[id] = [cell]
              }
            },

            /** 保存数据 */
            save (row) {
              if(row.unitPrice instanceof String||typeof row.unitPrice === 'string'){
                    row.unitPrice = parseFloat(row.unitPrice) //row.unitPrice.replace(/[\r\n]+/g, '');
              }
              //修改数据
              modifySubcomponentCost(row)
                  .then(response => {
                        this.QueryDetail();
                        this.$emit('form-submitted');
                  });

              const id = row.subId
              // 取消本行所有cell的编辑状态
              this.clickCellMap[id].forEach(cell => {
                this.cancelEditable(cell)
              })
              this.clickCellMap[id] = []
            },
            //下载数据
            exportToExcel(){
                window.location.href = this.projectUrl
                    + '/admin/erp/quotation/downloadSubcomponentCostDetails?orderItm='+this.orderItm
            }
        }
    }
</script>

<style scoped>
    .item__nowrap {
        white-space: nowrap;
        /* 防止文本换行 */
        overflow: hidden;
        /* 隐藏溢出的内容 */
        text-overflow: ellipsis;
        /* 显示省略号 */
    }

    .el-table .success-row {
       background: #ffff00;
    }


    .item{
        .item__input{
          display: none;
          width: 130px;
          /* 调整elementUI中样式 如果不需要调整请忽略 */
          .el-input__inner{
            height: 24px!important;
          }
          /* 调整elementUI中样式 如果不需要调整请忽略 */
          .el-input__suffix{
            i{
              font-size: 12px !important;
              line-height: 26px !important;
            }
          }
        }

        .item__txt{
          box-sizing: border-box;
          border: 1px solid transparent;
          width: 130px;
          line-height: 24px;
          padding: 0 8px;
        }

        .item__txt--hover{
          border: 1px solid #dddddd;
          border-radius: 4px;
          cursor: text;
        }
    }
</style>
