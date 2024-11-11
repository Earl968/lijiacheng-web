<template>
    <div class="app-container">
        <el-row :gutter="24" style="margin-top: 10px;">
            <el-col :span="14" :xs="14">

                <el-form :inline="true" class="demo-form-inline">


                    <el-form-item label="客户型号">
                        <el-input v-model="cust" placeholder="物料编码" @keyup.enter.native="custEnter"></el-input>
                    </el-form-item>

                    <el-form-item label="物料编码">
                        <el-select v-model="prdNo" filterable placeholder="请选择" clearable @blur="selectBlur" @clear="selectClear">
                            <el-option v-for="item in prdNos" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                        <!-- <el-input v-model="prdNo" placeholder="物料编码"></el-input> -->
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="OnQuery">查询</el-button>
                        <el-button type="primary" @click="Onclear">清空</el-button>
                    </el-form-item>
                </el-form>
            </el-col>

            <el-col :span="10" :xs="10">

                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="设置计算标量">
                        <el-input v-model="scalar" placeholder="计算标量"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="scalarClick">确定</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

        <el-row :gutter="24" style="margin-top: 10px;">
            <el-col :span="24" :xs="24">
                <el-table :data="financeValuation" border height="600" element-loading-text="正在查询数据"
                    element-loading-spinner="el-icon-loading" v-loading="tableLoading"
                    element-loading-background="rgba(217, 217, 217, 0.8)" :cell-style="cellStyle" @row-click="rowClick">
                    <!--   <el-table-column label="finId" prop="id"></el-table-column>
                    <el-table-column label="dataType" prop="dataType"></el-table-column> -->
                    <el-table-column label="半成品编码" prop="semiProductCode" width="120"></el-table-column>
                    <el-table-column label="半成品名称" prop="semiProductName" width="150">
                        <template slot-scope="scope">
                            <div class="item__nowrap" :title="scope.row.semiProductName">{{ scope.row.semiProductName }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="子件编码" prop="materialCode" width="120"></el-table-column>
                    <el-table-column label="子件名称" prop="materialName" width="150">
                        <template slot-scope="scope">
                            <div class="item__nowrap" :title="scope.row.materialName">{{ scope.row.materialName }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="单位" prop="unit"></el-table-column>
                    <el-table-column label="标准用量" prop="standardUsage" width="100"></el-table-column>
                    <el-table-column label="损耗率" prop="lossRate"></el-table-column>
                    <el-table-column label="实际用量" prop="actualUsage" width="100"></el-table-column>
                    <el-table-column label="位号" prop="positionNumber">
                        <template slot-scope="scope">
                            <div class="item__nowrap" :title="scope.row.positionNumber">{{ scope.row.positionNumber }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="单价¥" prop="unitPrice" width="100"></el-table-column>
                    <el-table-column label="金额¥" prop="amount" width="100"></el-table-column>
                    <el-table-column label="汇率换算(¥→$)" prop="dollar" width="100"></el-table-column>
                    <el-table-column label="泰国单价$" prop="thaiPrice" width="100"></el-table-column>
                    <el-table-column label="泰国金额$" prop="thaiAmount" width="100"></el-table-column>
                    <el-table-column label="供应商" prop="supplier">
                        <template slot-scope="scope">
                            <div class="item__nowrap" :title="scope.row.supplier">{{ scope.row.supplier }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="最高价" prop="highestPrice" width="100"></el-table-column>
                    <el-table-column label="最高价供应商" prop="highestPriceSupplier">
                        <template slot-scope="scope">
                            <div class="item__nowrap" :title="scope.row.highestPriceSupplier">
                                {{ scope.row.highestPriceSupplier }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="替代料" prop="alternativeMaterial"></el-table-column>
                </el-table>

                <el-dialog :visible.sync="showEcn" width="70%">
                    <el-table :data="ecnChangeTable" border>
                        <el-table-column label="ECN单号" prop="ecnNumber"></el-table-column>
                        <el-table-column label="BOM编号" prop="bomNumber"></el-table-column>
                        <el-table-column label="变动类型" prop="changeTypeChina"></el-table-column>
                        <el-table-column label="数量" prop="qty"></el-table-column>
                        <el-table-column label="生效时间" prop="effective"></el-table-column>
                        <el-table-column label="备注" prop="reason"></el-table-column>
                    </el-table>
                </el-dialog>

                <el-dialog :visible.sync="showMoney" width="70%">
                    <el-table :data="moneyTable" border>
                        <el-table-column label="物料编码" prop="productCode"></el-table-column>
                        <el-table-column label="价格" prop="price"></el-table-column>
                        <el-table-column label="供应商名称" prop="supplier"></el-table-column>
                        <el-table-column label="币种" prop="currency"></el-table-column>
                        <el-table-column label="开始供应时间" prop="startTime"></el-table-column>
                        <el-table-column label="截至供应时间" prop="endTime"></el-table-column>
                    </el-table>
                </el-dialog>

                <el-dialog :visible.sync="showThai" width="70%">

                    <el-row >
                       <el-col :span="8" :xs="8">
                            <el-form ref="form" :model="thai" label-width="150px">
                                <el-form-item label="成品料号">
                                    <el-input v-model="thai.productCode" :disabled="true"></el-input>
                                </el-form-item>
                                <el-form-item label="半成品料号">
                                    <el-input v-model="thai.semiProductCode" :disabled="true"></el-input>
                                </el-form-item>
                                <el-form-item label="原材料料号">
                                    <el-input v-model="thai.materialCode" :disabled="true"></el-input>
                                </el-form-item>
                                <el-form-item label="当前有效单价">
                                   <el-input v-model="thai.thaiPrice"></el-input>
                                </el-form-item>
                                <el-form-item label="当前有效金额">
                                   <el-input v-model="thai.thaiAmount"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="onUpdateThai">确认修改</el-button>
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </el-row>

                    <el-table :data="thaiTable" border>
                        <el-table-column label="泰国单价" prop="thaiUnitPrice"></el-table-column>
                        <el-table-column label="泰国金额" prop="thaiAmount"></el-table-column>
                        <el-table-column label="是否有效" prop="latestValid">
                            <template slot-scope="scope" >
                                <div v-if="scope.row.latestValid==true">有效</div>
                                <div v-else>无效</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="计算方式" prop="calculationMethod">
                            <template slot-scope="scope" >
                                <div v-if="scope.row.calculationMethod==1">系统计算</div>
                                <div v-else>手动计算</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="计算标量" prop="calculationScalar"></el-table-column>
                        <el-table-column label="计算人" prop="calculationPerson"></el-table-column>
                        <el-table-column label="计算时间" prop="calculationTime"></el-table-column>
                    </el-table>

                </el-dialog>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {
        getFinanceValuation,
        getEcn,
        getMoney,
        getThaiHis,
        getCustType,
        modifyOne,
        modifyList,
    } from "@/api/admin/finance/valuation"

    export default {
        data() {
            return {
                //物料编码
                prdNo: '',
                //客户类型的物料
                prdNos : [],
                //设置计算标量
                scalar: '',
                //客户型号
                cust: '',
                //材料泰国单价
                thai: {},
                //订单成本明细-和子件成本明细表格显示
                financeValuation: [],
                //ECN表格数据
                ecnChangeTable: [],
                //单价表格数据
                moneyTable: [],
                //材料泰国单价格数据
                thaiTable: [],
                //加载
                tableLoading: false,
                //ecn更改面板
                showEcn: false,
                //单价历史面板
                showMoney: false,
                //材料泰国单价面板
                showThai: false,
            }
        },
        methods: {
            selectBlur(e){
                this.prdNo =e.target.value;
                this.$forceUpdate();
            },
            selectClear(e){
                this.prdNo ="";
                this.$forceUpdate();
            },
            custEnter(){
                if(this.cust.length > 0){
                    getCustType( {subProNo: this.cust} ).then(response => {
                        this.prdNos = response.data;
                        this.prdNo=this.prdNos[0];
                    })
                }
            },
            //查询表格数据
            OnQuery() {
                if (this.prdNo.length > 0) {
                    this.tableLoading = true;
                    getFinanceValuation({prdId : this.prdNo})
                        .then(response => {
                            this.financeValuation = response.data;
                            this.tableLoading = false;
                        })
                        .catch(() => {
                            this.tableLoading = false;
                        });
                    return;
                }

            },
            rowClick(row, column, event) {
                //点击了半成品合计，打开ECN变更查询界面
                if (row.dataType == 2) {
                    getEcn(row).then(response => {
                        this.ecnChangeTable = response.data;
                        this.showEcn = true;
                    })
                    return;
                }
                const property = column.property
                //查询物料的历史价格
                if (property == "unitPrice") {
                    getMoney(row).then(response => {
                        this.moneyTable = response.data;
                        this.showMoney = true;
                    })
                    return;
                }
                //查询历史泰国单价
                if (property == "thaiPrice") {
                    this.thai=row;
                    getThaiHis(row).then(response => {
                        this.thaiTable = response.data;
                        this.showThai = true;
                    })
                    return;
                }
            },
            scalarClick() {
                modifyList(this.financeValuation, {
                        scalar: this.scalar
                    })
                    .then(response => {
                        this.$message({
                            showIcon: true,
                            type: 'success',
                            message: '已设置成功!'
                        });
                        this.OnQuery();
                    })
            },
            onUpdateThai(){
                modifyOne(this.thai).then(response => {
                    this.$message({
                        showIcon: true,
                        type: 'success',
                        message: '已设置成功!'
                    });
                    getThaiHis(this.thai).then(response => {
                        this.thaiTable = response.data;
                    });
                })
            },
            cellStyle({
                row,
                column,
                rowIndex,
                columnIndex
            }) {
                if (row.dataType === 2) {
                    return {
                        background: '#ffff00'
                    };
                }
            },
            Onclear() {
                this.prdNo = '';
                this.cust = '';
            }
        }
    }
</script>

<style>
    .item__nowrap {
        white-space: nowrap;
        /* 防止文本换行 */
        overflow: hidden;
        /* 隐藏溢出的内容 */
        text-overflow: ellipsis;
        /* 显示省略号 */
    }
</style>
