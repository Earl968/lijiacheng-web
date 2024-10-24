<template>
    <div class="app-container">
        <el-row :gutter="24">
            <el-col :span="24" :xs="24">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="订单号">
                        <el-input v-model="OredeNO" placeholder="订单号"></el-input>
                    </el-form-item>
                    <el-form-item label="成品编码">
                        <el-input v-model="prdNumber" placeholder="成品编码"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="OnQuery">查询</el-button>
                        <el-button type="primary" @click="Onclear">清空</el-button>
                    </el-form-item>
                </el-form>

                <div class="table-container">
                    <el-table :data="OrderAnalysis" border v-loading="tableLoading" @row-click="OnDetail" element-loading-text="正在查询数据"
                        element-loading-spinner="el-icon-loading" element-loading-background="rgba(217, 217, 217, 0.8)">
                        <el-table-column label="订单批号" prop="orderBatchNumber" width="120"> </el-table-column>
                        <el-table-column label="物料编码" prop="materialCode" width="130"> </el-table-column>
                        <el-table-column label="物料规格" prop="materialSpecification">
                            <template slot-scope="scope">
                                <div class="item__nowrap" :title="scope.row.materialSpecification">
                                    {{ scope.row.materialSpecification }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="客户名称" prop="customerName"></el-table-column>
                        <el-table-column label="订单数量" prop="orderQuantity"></el-table-column>
                        <el-table-column label="汇率" prop="exchangeRate"></el-table-column>
                        <el-table-column label="税率" prop="taxRate"></el-table-column>
                        <el-table-column label="单价(原币)" prop="unitPriceOriginalCurrency"></el-table-column>
                        <el-table-column label="单价(折本币)" prop="unitPriceConvertedCurrency"></el-table-column>
                        <el-table-column label="备注" prop="remarks"> </el-table-column>
                    </el-table>
                </div>
                <!-- 新增订单 -->
                <el-dialog :visible.sync="showCoseDetail" width="80%" :close-on-click-modal="false">
                    <!-- 动态组件 -->
                    <child-component :is="dialogDetail" :key="dialogKey"
                        :parentCostData="order"></child-component>
                </el-dialog>

            </el-col>
        </el-row>
    </div>
</template>

<style scoped>

    .item__nowrap {
        white-space: nowrap;
        /* 防止文本换行 */
        overflow: hidden;
        /* 隐藏溢出的内容 */
        text-overflow: ellipsis;
        /* 显示省略号 */
    }

</style>

<script>
    import { Icon, Loading } from "element-ui";

    import { getAnalysis,getAnalysisByprdNo } from "@/api/admin/product/orderAnalysis"

    import detail from './detail.vue'


    export default {
        data() {
            return {
                //订单号
                OredeNO: '',
                //成品编码
                prdNumber: '',
                //表格数据
                OrderAnalysis: [],
                //表格加载动画
                tableLoading: false,
                //弹窗控制
                showCoseDetail: false,
                //弹窗组件
                dialogDetail: null,
                //点击的订单批号
                order: {},
                dialogKey: 0,
            }
        },
        methods: {
            //清空输入选项
            Onclear(){
                this.OredeNO='';
                this.prdNumber='';
            },
            //选择行号之后点击查询，查询订单信息
            OnQuery() {
                if(this.OredeNO.length > 0){
                    this.tableLoading=true;
                    getAnalysis({ order: this.OredeNO })
                        .then(response => {
                            this.OrderAnalysis = response.data;
                            this.tableLoading=false;
                        })
                        .catch(() => {
                            this.tableLoading = false;
                        })
                    return;
                }

                if(this.prdNumber.length > 0){
                    this.tableLoading=true;
                    getAnalysisByprdNo({ prdNo: this.prdNumber })
                        .then(response => {
                            this.OrderAnalysis = response.data;
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
                this.order = row;
                this.dialogDetail = detail;
                this.showCoseDetail = true;
                this.dialogKey++;
            },

        }
    }
</script>
