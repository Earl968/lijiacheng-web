<template>
    <div class="app-container">


        <el-row :gutter="24">
            <el-col :span="24" :xs="24">
                <!-- 查询条件 -->
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="料号">
                        <el-input v-model="partno" placeholder="料号"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onQuery">查询</el-button>
                        <el-button type="primary" @click="OnTotal" :disabled="tableLoading">添加,修改材料合计</el-button>
                    </el-form-item>
                </el-form>

                <el-card class="box-card" v-show="!tableLoading">

                    <el-row :gutter="24" class="top-output">
                        <el-col :span="8" :xs="8">
                            <span>订单号+行号：{{ quotationOrder.order }} -> {{ quotationOrder.number }}</span>
                        </el-col>
                        <el-col :span="12" :xs="12">
                            <span>订单数量：{{ quotationOrder.qty }}</span>
                        </el-col>
                        <el-col :span="4" :xs="4">
                            <span>汇率：{{ quotationOrder.exchangeRate }}</span>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24" class="top-output">
                        <el-col :span="8" :xs="8">
                            <span>母件编号：{{ quotationOrder.productNo }}</span>
                        </el-col>
                        <el-col :span="12" :xs="12">
                            <span>母件名称：{{ quotationOrder.productName }}</span>
                        </el-col>
                        <el-col :span="4" :xs="4">
                            <span>税率：0.13</span>
                        </el-col>
                    </el-row>

                </el-card>

                <el-table :data="quotationOrder.quotationPartno" border v-loading="tableLoading"
                    element-loading-text="正在查询数据" element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(217, 217, 217, 0.8)" :row-class-name="tableRowClassName">
                    <el-table-column label="半成品编码" prop="productNoHalf" width="130"> </el-table-column>
                    <el-table-column label="半成品名称" prop="productNameHalf">
                        <template slot-scope="scope">
                            <div class="ellipsis" :title="scope.row.productNameHalf">{{ scope.row.productNameHalf }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="子件编码" prop="materialNo" width="130"></el-table-column>
                    <el-table-column label="子件名称" prop="materialName">
                        <template slot-scope="scope">
                            <div class="ellipsis" :title="scope.row.materialName">{{ scope.row.materialName }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="单位" prop="unit"></el-table-column>
                    <el-table-column label="标准用量" prop="dosage"></el-table-column>
                    <el-table-column label="损耗率" prop="loss"></el-table-column>
                    <el-table-column label="实际用量" prop="realityDosage"></el-table-column>
                    <el-table-column label="位号" prop="location">
                        <template slot-scope="scope">
                            <div class="ellipsis" :title="scope.row.location">{{ scope.row.location }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="单价" prop="prive"></el-table-column>
                    <el-table-column label="金额" prop="money"></el-table-column>
                    <el-table-column label="供应商" prop="supplier">
                        <template slot-scope="scope">
                            <div class="ellipsis" :title="scope.row.supplier">{{ scope.row.supplier }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="最高价" prop="maxPrive"></el-table-column>
                    <el-table-column label="最高价供应商" prop="maxSupplier">
                        <template slot-scope="scope">
                            <div class="ellipsis" :title="scope.row.maxSupplier">{{ scope.row.maxSupplier }}</div>
                        </template>
                    </el-table-column>
                </el-table>

                <!--材料记录-->
                <el-dialog title="工时录入" :visible.sync="EnterVisible">
                    <el-form :model="orderCost" class="demo-form-inline" >
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span>人工成本</span>
                            </div>
                            <div class="text item">
                                <el-col :span="12">
                                    <el-form-item label="电源加工">
                                        <el-input v-model="orderCost.powerProcessing" placeholder="电源加工"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="接线盒组装">
                                        <el-input v-model="orderCost.junctionBoxAssembly" placeholder="接线盒组装"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="开关加工">
                                        <el-input v-model="orderCost.switchProcessing" placeholder="开关加工"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="光源加工">
                                        <el-input v-model="orderCost.lightSourceProcessing" placeholder="光源加工"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="总装+包装">
                                        <el-input v-model="orderCost.finalAssemblyPackaging" placeholder="总装+包装"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="印字">
                                        <el-input v-model="orderCost.printing" placeholder="印字"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item label="人工成本小计" prop="desc">
                                        <el-input type="textarea" v-model="orderCost.laborCostSubtotal"  placeholder="人工成本小计"></el-input>
                                    </el-form-item>
                                </el-col>
                            </div>
                        </el-card>

                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span>其他成本</span>
                            </div>
                            <div class="text item">
                                <el-col :span="12">
                                    <el-form-item label="泰国成本">
                                        <el-input v-model="orderCost.thailandCost" placeholder="泰国成本"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="制造费用">
                                        <el-input v-model="orderCost.manufacturingExpenses" placeholder="制造费用"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="车间行政工资">
                                        <el-input v-model="orderCost.workshopAdminSalary" placeholder="车间行政工资"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="管理工资">
                                        <el-input v-model="orderCost.managementSalary" placeholder="管理工资"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="运费">
                                        <el-input v-model="orderCost.freight" placeholder="运费"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="销管财费用">
                                        <el-input v-model="orderCost.salesAdminFinancialExpenses" placeholder="销管财费用"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item label="其他成本小计" prop="desc">
                                        <el-input type="textarea" v-model="orderCost.otherCostSubtotal"  placeholder="其他成本小计"></el-input>
                                    </el-form-item>
                                </el-col>
                            </div>
                        </el-card>

                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span>合计</span>
                            </div>
                            <div class="text item">
                                <el-col :span="12">
                                    <el-form-item label="成本合计">
                                        <el-input v-model="orderCost.totalCost" placeholder="成本合计"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="折美元">
                                        <el-input v-model="orderCost.convertedToUsd" placeholder="折美元"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="售价">
                                        <el-input v-model="orderCost.sellingPrice" placeholder="售价"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="营业利润">
                                        <el-input v-model="orderCost.operatingProfit" placeholder="营业利润"></el-input>
                                    </el-form-item>
                                </el-col>
                            </div>
                        </el-card>

                    </el-form>

                    <span slot="footer" class="dialog-footer">
                        <el-button @click="EnterVisible = false">取 消</el-button>
                        <el-button type="primary" @click="modifyOrderCost()">确 定</el-button>
                    </span>
                </el-dialog>

            </el-col>
        </el-row>
    </div>
</template>

<style>
    .ellipsis {
        white-space: nowrap;
        /* 防止文本换行 */
        overflow: hidden;
        /* 隐藏溢出的内容 */
        text-overflow: ellipsis;
        /* 显示省略号 */
    }

    .el-table .success-row {
        background: yellow;
    }

    .el-card__body {
        padding: 0px;
    }

    .top-output {
        padding: 10px 15px;
    }

    body {
        margin: 0;
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        ;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        color: #212529;
        background-color: #f3f2f7;
    }

    .text {
        font-size: 14px;
    }

    .item {
        padding: 18px 15px;
    }
</style>

<script>
    import {
        Icon,
        Loading
    } from "element-ui";

    import {
        GetQuotationOrder,
        GetOrderCostById,
        updateOrderCost
    } from "@/api/admin/product/quotation"

    export default {
        data() {
            return {
                //表格数据
                quotationOrder: [],
                orderCostNumber: "",
                partno: '',
                orderCost: {},
                EnterVisible: false,
                //表格加载动画
                tableLoading: false,
            }
        },
        created() {
            this.loadBomDate();
        },
        methods: {
            //查询BOM数据
            loadBomDate(params) {
                this.tableLoading = true;
                //加载表格数据
                GetQuotationOrder()
                    .then(response => {
                        if (response.data != null) {
                            this.quotationOrder = response.data;
                            this.orderCostNumber = this.quotationOrder.order + "-" + this.quotationOrder.number;

                            // this.bomDateTable = response.data.quotationPartno;
                        } else {
                            this.$message.error("未查询到对应BOM信息！！");
                        }
                        this.tableLoading = false;

                    })
                    .catch(() => {
                        this.tableLoading = false;
                    })

            },
            //点击查询按钮
            onQuery() {
                this.GetQuotationOrder();
            },
            //清空查询条件
            OnTotal() {
                GetOrderCostById({ id: this.orderCostNumber } )
                    .then(response => {
                        if (response.data != null) {
                            this.orderCost=response.data;
                        } else {
                            this.$message.error("未查询到对应BOM信息！！");
                        }
                    });
                this.EnterVisible = true;
            },
            modifyOrderCost(){
                updateOrderCost(this.orderCost)
                    .then(response => {
                        if (response.code==200) {
                            this.onQuery();
                        }
                        this.EnterVisible = false
                    })
                    .catch(() => {
                        this.EnterVisible = false;
                    })
            },
            tableRowClassName({row}) {
                if (row.bomNo === '') {
                    return 'success-row';
                }
            },
        }
    }
</script>
