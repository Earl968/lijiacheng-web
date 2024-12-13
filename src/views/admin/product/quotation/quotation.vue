<template>
    <div class="app-container">
        <el-row :gutter="24">
            <el-col :span="24" :xs="24">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="订单号">
                        <el-input v-model="OredeNO" @blur="OnQueryItms" placeholder="订单号"></el-input>
                    </el-form-item>
                    <el-form-item label="行号">
                        <el-select v-model="itmNo" placeholder="行号">
                            <el-option v-for="item in itms" :key="item" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="查询日期范围">
                        <div class="block">
                            <el-date-picker v-model="selectDate" type="daterange" align="right" unlink-panels
                                range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                :picker-options="pickerOptions"
                                value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="OnQueryOrderView">查询</el-button>
                        <el-button type="primary" @click="Onclear">清空</el-button>
                    </el-form-item>
                </el-form>

                <div class="table-container">
                    <el-button plain class="table-toolbar-button" @click="exportToExcel" v-if="isDownLoad">下载内容</el-button>
                    <el-table :data="OrderCostOverview" ref="table" :cell-style="cellStyle"
                        height="780"
                        border v-loading="tableLoading"
                        @row-dblclick="OnDetail"
                        element-loading-text="正在查询数据"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(217, 217, 217, 0.8)"
                        @cell-mouse-enter="handleCellEnter"
                        @cell-mouse-leave="handleCellLeave"
                        @cell-click="handleCellClick">

                        <el-table-column label="订单批号" prop="orderBatchNumber" width="120"> </el-table-column>
                        <el-table-column label="物料编码" prop="materialCode" width="120"> </el-table-column>
                        <el-table-column label="物料规格" prop="materialSpecification">
                            <template slot-scope="scope">
                                <div class="item__nowrap" :title="scope.row.materialSpecification">
                                    {{ scope.row.materialSpecification }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="增加日期" prop="additionDate">
                            <template slot-scope="scope">
                                <div class="item__nowrap" :title="formatDate(scope.row.additionDate)">{{ formatDate(scope.row.additionDate) }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作日期" prop="editDate">
                            <template slot-scope="scope">
                                <div class="item__nowrap" :title="formatDate(scope.row.editDate)">{{ formatDate(scope.row.editDate) }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="客户名称" prop="customerName"></el-table-column>
                        <el-table-column label="订单数量" prop="orderQuantity"></el-table-column>
                        <el-table-column label="汇率" prop="exchangeRate"></el-table-column>
                        <el-table-column label="税率" prop="taxRate"></el-table-column>
                        <el-table-column label="材料小记" prop="materialSubtotal"></el-table-column>
                        <el-table-column label="人工小记" prop="laborSubtotal"></el-table-column>
                        <el-table-column label="其他小记" prop="otherSubtotal"></el-table-column>
                        <el-table-column label="单价(原币)" prop="unitPriceOriginalCurrency"></el-table-column>
                        <el-table-column label="单价(折本币)" prop="unitPriceConvertedCurrency"></el-table-column>
                        <el-table-column label="折美元" prop="convertedToUsd"></el-table-column>
                        <el-table-column label="售价" prop="sellingPrice"></el-table-column>
                        <el-table-column label="成本合计(折本币)" prop="totalCostConvertedCurrency"></el-table-column>
                        <el-table-column label="净利润(折本币)" prop="netProfitConvertedCurrency"></el-table-column>
                        <el-table-column label="备注" prop="remarks">
                            <div class="item" slot-scope="scope">
                                <el-input class="item__input" type="textarea" v-model="scope.row.remarks"
                                    placeholder="请输入内容"
                                    @blur="handleBlur(scope.row)"
                                    @keyup.enter.native.prevent="handleEnter(scope.row)"></el-input>
                                <div class="item__txt item__nowrap" :title="scope.row.remarks">{{ scope.row.remarks }}</div>
                            </div>
                        </el-table-column>

                        <el-table-column label="操作" align="center" class-name="small-padding fixed-width"  >
                           <template slot-scope="scope" v-if="scope.row.orderBatchNumber !== ''">
                               <el-button size="mini" type="text" icon="el-icon-delete"  @click="removeOrder(scope.row)" >删除 </el-button>
                           </template>
                        </el-table-column>
                    </el-table>
                </div>
                <!-- 新增订单 -->
                <el-dialog :visible.sync="showCoseDetail" width="80%" :close-on-click-modal="false" @close="clearChild">
                    <!-- 动态组件 -->
                    <child-component :is="dialogDetail"
                        :parentCostData="orderItm"
                        @form-submitted="handleSubmit"
                        :key="dialogKey" ></child-component>
                </el-dialog>

            </el-col>
        </el-row>
    </div>
</template>

<style scoped>

  .table-container {
        position: relative;
    }

    .table-toolbar-button {
        position: absolute;
        top: -60px;
        right: 10px;
    }

    .item__nowrap {
        white-space: nowrap;
        /* 防止文本换行 */
        overflow: hidden;
        /* 隐藏溢出的内容 */
        text-overflow: ellipsis;
        /* 显示省略号 */
    }

    .item{
        .item__input{
          display: none;

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
          /* width: 100px; */
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

<script>
    import {
        Icon,
        Loading
    } from "element-ui";

    import {
        getOrderNumber,
        getOrderCostOverview,
        getSubcomponentCost,
        getOverviewList,
        modifyOverviewEdate,
        modifyOverviewRemarks,
        removeOrderCostOverview
    } from "@/api/admin/product/quotation"

    import detail from './detail.vue'

    import ExcelUploadParser from '@/components/ExcelUploadParser';
    import * as XLSX from 'xlsx';

    export default {
        components: {
            ExcelUploadParser
        },
        data() {
            return {
                //订单号
                OredeNO: '',
                //行号
                itmNo: '',
                //订单行号清单
                itms: [],
                //表格数据
                OrderCostOverview: [],
                //表格加载动画
                tableLoading: false,
                //订单成本明细-和子件成本明细表格显示
                SubcomponentCost: [],
                //控制明细表格显示
                showCoseDetail: false,
                //弹窗组件
                dialogDetail: null,
                //点击的订单批号
                orderItm: '',
                //日期选择范围
                pickerOptions: {},
                //日期选择值
                selectDate: '',
                //需要编辑的数属性
                editProp: [ 'remarks'],
                 // 保存进入编辑的cell
                clickCellMap: {},
                //是否提交修改时间
                ifModiby:false,
                //是否可以下载
                isDownLoad:false,
                dialogKey: 0,
            }
        },
        created(){
            const formatDate = (date) => {
               return date.toISOString().split('T')[0];
             };

            this.pickerOptions = {
              shortcuts: [{
                text: '最近一周',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                  picker.$emit('pick', [formatDate(start), formatDate(end)]);
                }
              }, {
                text: '最近一个月',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                  picker.$emit('pick', [formatDate(start), formatDate(end)]);
                }
              }, {
                text: '最近三个月',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                  picker.$emit('pick', [formatDate(start), formatDate(end)]);
                }
              }]
            }
        },
        methods: {
            //订单输入完失去焦点后查询对应订单行号
            OnQueryItms() {
                if (this.OredeNO.length <= 0) {
                    return;
                }
                getOrderNumber({
                        order: this.OredeNO
                    })
                    .then(response => {
                        this.itms = response.data;
                    })
            },
            //设置表格颜色
            tableRowClassName({row}){
                if (row.isedit===1) {
                    return 'success';
                }
            },
            cellStyle({ row, column, rowIndex, columnIndex }) {
                if (row.isedit===1) {
                    return {
                        height:'30px',
                        background: '#9de973',
                        padding: '0px 0px'
                    };
                }
              // 例如，设置日期列的单元格背景颜色
                return {
                    height:'30px',
                    padding: '0px 0px' };
            },
            //清空输入选项
            Onclear(){
                this.OredeNO='';
                this.itmNo='';
                this.selectDate='';
            },
            //选择行号之后点击查询，查询订单信息
            OnQueryOrderView() {

                if(this.OredeNO.length > 0 && this.itmNo.length > 0){
                    this.tableLoading=true;
                    getOrderCostOverview({
                            order: this.OredeNO,
                            itm: this.itmNo
                        })
                        .then(response => {
                            this.OrderCostOverview = [response.data];
                            this.isDownLoad=true;
                            this.tableLoading=false;
                        })
                        .catch(() => {
                            this.tableLoading = false;
                        })
                    return;
                }

                if(this.selectDate.length>0){
                    this.tableLoading=true;
                    getOverviewList({
                            startDate: this.selectDate[0],
                            endDate: this.selectDate[1]
                        })
                        .then(response => {
                            this.OrderCostOverview = response.data;
                            this.isDownLoad=true;
                            this.tableLoading=false;
                        })
                        .catch(() => {
                            this.tableLoading = false;
                        })
                    return;
                }
            },
            //订单成本明细-和子件成本明细表格显示
            OnDetail(row, event) {
                this.orderItm = row.orderBatchNumber;
                if(row.isedit===1){
                    this.dialogDetail = detail;
                    this.dialogKey++;
                    this.showCoseDetail = true;
                    return;
                }
                modifyOverviewEdate({orderItm: this.orderItm})
                    .then(response => {
                        this.dialogDetail = detail;
                        this.dialogKey++;
                        this.showCoseDetail = true;
                    })
            },
            //关闭详细编辑状态之后重新加载数据
            clearChild() {
                if(this.ifModiby){
                    modifyOverviewEdate({orderItm: this.orderItm})
                        .then(response => {
                            //日期已经更新
                            this.ifModiby=false;
                        })
                }
                this.OnQueryOrderView();
            },
            //触发提交事件，当子界面有提交数据后更新日期
            handleSubmit(){
                this.ifModiby=true;
            },

            //鼠标移入
            handleCellEnter (row, column, cell, event) {
              const property = column.property
              if (this.editProp.includes(property)) {
                cell.querySelector('.item__txt').classList.add('item__txt--hover')
              }
            },
            /** 鼠标移出cell */
            handleCellLeave (row, column, cell, event) {
              const property = column.property
              if (this.editProp.includes(property)) {
                cell.querySelector('.item__txt').classList.remove('item__txt--hover')
              }
            },
            /** 点击cell */
            handleCellClick (row, column, cell, event) {
              const property = column.property
              if (this.editProp.includes(property)) {
                // 保存cell
                this.saveCellClick(row, cell)
                cell.querySelector('.item__txt').style.display = 'none'
                cell.querySelector('.item__input').style.display = 'block'
                cell.querySelector('.el-textarea__inner').focus()
              }
            },
            //文本框光标离开事件
            handleBlur(row){
               if (!this.isEnterPressed) { // 如果不是因为回车而失去焦点，则执行相应操作
                 this.save(row);
               }
               // 重置标志变量
               this.isEnterPressed = false;
            },
            //文本框回车事件
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
              const id = row.orderBatchNumber;
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
              if(row.remarks==undefined ||row.remarks==null ){
                  const id = row.orderBatchNumber
                  // 取消本行所有cell的编辑状态
                  this.clickCellMap[id].forEach(cell => {
                    this.cancelEditable(cell)
                  })
                  this.clickCellMap[id] = []
                  return;
              }
              row.remarks = row.remarks.replace(/[\r\n]+/g, '');
              //修改数据
              modifyOverviewRemarks({
                  orderItm: row.orderBatchNumber,
                  remarks: row.remarks
                }).then(response => {
                    const id = row.orderBatchNumber
                    // 取消本行所有cell的编辑状态
                    this.clickCellMap[id].forEach(cell => {
                      this.cancelEditable(cell)
                    })
                    this.clickCellMap[id] = []
                });
            },
            //格式化日期
            formatDate(cellValue) {
                if (!cellValue) return '';
                const date = new Date(cellValue);
                const year = date.getFullYear();
                const month = ('0' + (date.getMonth() + 1)).slice(-2);
                const day = ('0' + date.getDate()).slice(-2);
                return `${year}-${month}-${day}`;
            },
            //下载数据
            exportToExcel(){
                this.$nextTick(() => {

                   const table = this.$refs.table.$el.querySelector('.el-table__body-wrapper table');
                   if (table) {
                        // 创建新的table元素
                       var print_table_dom = document.createElement('table')
                       // copy一份thead
                       var print_table_dom_thead = this.$refs.table.$el.querySelector('.el-table__header-wrapper table').cloneNode(true)
                       // copy一份tbody
                       var print_table_body = this.$refs.table.$el.querySelector('.el-table__body-wrapper table').cloneNode(true)
                       // 将thead和tbody添加到 目标table中
                       print_table_dom.appendChild(print_table_dom_thead)
                       print_table_dom.appendChild(print_table_body)
                       // 生成 book
                       const new_sheet = XLSX.utils.table_to_book(print_table_dom)
                       // 导出excel
                       XLSX.writeFile(new_sheet, '数据导出.xlsx')
                   } else {
                       console.error('表格没有数据！');
                   }
                });
            },
            //删除以保存的本地数据
            removeOrder(row){
                 this.$confirm('确认删除?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
                 .then(() => {
                      removeOrderCostOverview({orderNumber:row.orderBatchNumber}).then(response => {
                            if(response.code==200){
                                this.$message({ type: 'success', message: '删除成功!' });
                            }
                      });
                 }).catch(() => { this.$message({ type: 'info', message: '已取消删除' }); });


            }
        }
    }
</script>
