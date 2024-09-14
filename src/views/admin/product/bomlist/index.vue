<template>
    <div class="app-container">
        <el-row :gutter="23">
            <!--用户数据-->
            <el-col :span="24" :xs="24">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="料号">
                        <el-input v-model="partno" placeholder="料号"></el-input>
                    </el-form-item>
                    <el-form-item label="客户">
                        <el-input v-model="custName" placeholder="客户"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onQuery">查询</el-button>
                    </el-form-item>
                </el-form>

                <el-button @click="exportTable">导出表格</el-button>
                <el-table :data="bomDateTable" border v-loading="tableLoading" element-loading-text="正在查询数据"
                    element-loading-spinner="el-icon-loading" element-loading-background="rgba(217, 217, 217, 0.8)">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-table :data="props.row.lowLevel" style="width: 100%;margin-bottom: 20px;"
                                :row-key="getRowKey" border default-expand-all
                                :tree-props="{children: 'lowLevel', hasChildren: 'hasChildren'}"
                                :row-class-name="rowClassName">
                                <el-table-column label="子件料号" prop="prdNo"></el-table-column>
                                <el-table-column label="子件名称" prop="spc"></el-table-column>
                            </el-table>
                            <!-- <expandColmun :items="props.row.lowLevel"></expandColmun> -->
                        </template>
                    </el-table-column>
                    <el-table-column label="客户" prop="custName"> </el-table-column>
                    <el-table-column label="品号" prop="orderNo"></el-table-column>
                    <el-table-column label="货品规格" prop="orderDesc">
                        <template slot-scope="scope">
                            <div class="ellipsis" :title="scope.row.orderDesc">{{ scope.row.orderDesc }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="品名" prop="orderName"> </el-table-column>
                    <el-table-column label="电源板料号" prop="pPcbaNo"></el-table-column>
                    <el-table-column label="电源板名称" prop="pPcbsDesc">
                        <template slot-scope="scope">
                            <div class="ellipsis" :title="scope.row.pPcbsDesc">{{ scope.row.pPcbsDesc }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="光源板料号" prop="lPcbsNo"></el-table-column>
                    <el-table-column label="光源板型号" prop="lPcbaDesc">
                        <template slot-scope="scope">
                            <div class="ellipsis" :title="scope.row.lPcbaDesc">{{ scope.row.lPcbaDesc }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="子件料号" prop="subItem">
                        <template slot-scope="scope">
                            <div class="ellipsis" :title="scope.row.subItem">{{ scope.row.subItem }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="子件名称" prop="subName">
                        <template slot-scope="scope">
                            <div class="ellipsis" :title="scope.row.subName">{{ scope.row.subName }}</div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </div>
</template>

<style>
    .demo-table-expand {
        font-size: 0;
    }

    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }

    .expandable-row {
        background-color: lightblue !important;
        /* 可展开行的颜色 */
    }

    .el-table .cell {
        white-space: pre-wrap;
        /* 保留空白符序列，但是正常地进行换行 */
    }

    .ellipsis {
        white-space: nowrap;
        /* 防止文本换行 */
        overflow: hidden;
        /* 隐藏溢出的内容 */
        text-overflow: ellipsis;
        /* 显示省略号 */
    }
</style>

<script>
    import {
        Icon,
        Loading
    } from "element-ui";
    import {
        GetBomQuery,
        DownLoadBom
    } from "@/api/admin/product/bomlist"

    export default {
        data() {
            return {
                bomDateTable: [],
                partno: '',
                custName: '',
                tableLoading: false,
                projectUrl: '',
            }
        },
        created() {
             this.projectUrl = process.env.VUE_APP_API_BASE_URL;
        },
        methods: {
            loadBomDate(params) {
                this.tableLoading = true;
                GetBomQuery(params)
                    .then(response => {
                        if (response.data != null) {
                            this.bomDateTable = response.data;
                        } else {
                            this.$message.error("未查询到对应BOM信息！！");
                        }
                        this.tableLoading = false;
                    })
                    .catch(() => {
                        this.tableLoading = false;
                    })
            },
            onQuery() {
                this.bomDateTable = []
                if (this.partno && this.partno.trim()) {
                    // 字符串不为空
                    this.loadBomDate({
                        parNo: this.partno
                    });
                } else if (this.custName && this.custName.trim()) {
                    this.loadBomDate({
                        custName: this.custName
                    });
                } else {
                    this.$message.error("请输入料号或者客户名称！！");
                }
            },
            getRowKey(row) {
                return `${row.bomNo}-${row.prdNo}-${row.idNo}`;
            },
            rowClassName({
                row
            }) {
                // 检查行是否有子节点，如果有，则应用一个类名
                if (row.lowLevel.length > 0) {
                    return 'expandable-row';
                }
                return '';
            },
            exportTable() {
                 window.location.href = this.projectUrl + '/admin/erp/bomlist/downLoadBoms?parNo='+this.partno+'&custName='+this.custName;
                // DownLoadBom({
                //         parNo: this.partno,
                //         custName: this.custName
                //     })
                //     .then(response => {
                //         console.log(response);
                //     })
                //     .catch(() => {
                //         this.$message({showIcon: true,ype: 'error',message: '资料下载失败,请重新下载!'});
                //     })
            }
        }
    }
</script>
