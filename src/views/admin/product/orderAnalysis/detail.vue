<template>
    <div class="app-container">
        <el-row :gutter="24" style="margin-top: 10px;">
            <el-col :span="24" :xs="24">
                <el-table :data="SubcomponentCost" border height="800"
                    element-loading-text="正在查询数据" element-loading-spinner="el-icon-loading" v-loading="tableLoading"
                    element-loading-background="rgba(217, 217, 217, 0.8)">

                    <el-table-column label="半成品编码" prop="semiFinishedProductCode" width="120"></el-table-column>

                    <el-table-column label="半成品名称" prop="semiFinishedProductName"  width="150">
                        <template slot-scope="scope">
                            <div class="item__nowrap" :title="scope.row.semiFinishedProductName">{{ scope.row.semiFinishedProductName }}</div>
                        </template>
                    </el-table-column>

                    <el-table-column label="子件编码" prop="subcomponentCode" width="120"></el-table-column>

                    <el-table-column label="子件名称" prop="subcomponentName" width="150">
                        <template slot-scope="scope">
                            <div class="item__nowrap" :title="scope.row.subcomponentName">{{ scope.row.subcomponentName }}</div>
                        </template>
                    </el-table-column>

                    <el-table-column label="单位" prop="unit"></el-table-column>

                    <el-table-column label="标准用量" prop="standardUsage"></el-table-column>

                    <el-table-column label="损耗率" prop="lossRate"></el-table-column>

                    <el-table-column label="实际用量" prop="actualUsage"></el-table-column>

                    <el-table-column label="位号" prop="positionNumber">
                        <template slot-scope="scope">
                            <div class="item__nowrap" :title="scope.row.positionNumber">{{ scope.row.positionNumber }}</div>
                        </template>
                    </el-table-column>

                    <el-table-column label="单价" prop="unitPrice">
                        <template slot-scope="scope">
                            <div class="item__nowrap" :title="scope.row.unitPrice">{{ scope.row.unitPrice }}</div>
                        </template>
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
    import { getAnalysisDetail } from "@/api/admin/product/orderAnalysis"

    export default {
        name: 'detail',
        props: {
            parentCostData: {
                type: Object,
                default: () => ""
            },
        },
        data() {
            return {
                order: {},
                //订单成本明细-和子件成本明细表格显示
                SubcomponentCost: [],
                tableLoading: false,
            }
        },
        created(){
            this.order=this.parentCostData;
            this.QueryDetail();
        },
        methods: {
            //查询表格数据
            QueryDetail(){
                this.tableLoading=true;
                getAnalysisDetail(this.order)
                    .then(response => {
                            this.SubcomponentCost= response.data;
                            this.tableLoading=false;
                    })
                    .catch(() => {
                        this.tableLoading = false;
                    });
            },
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
