<template>
    <div class="app-container">
        <el-row :gutter="24">
            <el-col :span="24" :xs="24">

                <excel-upload-parser @data-parsed="updateTableData"></excel-upload-parser>

                <el-row style="margin-bottom: 5px;">
                  <el-button plain @click="exportToExcel">下载内容</el-button>
                  <el-button type="primary" plain @click="download">下载模板</el-button>
                </el-row>

                <el-table :data="tableData" border style="width: 100%" ref="table"
                    v-loading="tableLoading" element-loading-text="正在查询数据"
                    element-loading-spinner="el-icon-loading" element-loading-background="rgba(217, 217, 217, 0.8)">
                    <el-table-column label="订单号" prop="订单号"></el-table-column>
                    <el-table-column label="客户名称" prop="客户名称"></el-table-column>
                    <el-table-column label="成品编码" prop="成品编码"></el-table-column>
                    <el-table-column label="规格型号" prop="规格型号">
                        <template slot-scope="scope">
                            <div class="ellipsis" :title="scope.row.规格型号">{{ scope.row.规格型号 }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="订单数量" prop="订单数量"></el-table-column>
                    <el-table-column label="生产数量" prop="生产数量"></el-table-column>
                    <el-table-column label="物料号" prop="物料号"></el-table-column>
                    <el-table-column label="线板" prop="线板">
                        <template slot-scope="scope">
                            <div class="ellipsis" :title="scope.row.线板">{{ scope.row.线板 }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="组别" prop="组别"></el-table-column>
                    <el-table-column label="上线日期" prop="上线日期"></el-table-column>
                    <el-table-column label="完成日期" prop="完成日期"></el-table-column>
                    <el-table-column label="后段需求时间" prop="后段需求时间"></el-table-column>
                    <el-table-column label="制令单号" prop="制令单号"></el-table-column>
                    <el-table-column label="备注" prop="备注"></el-table-column>
                </el-table>
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
</style>

<script>
    import ExcelUploadParser from '@/components/ExcelUploadParser';
    import * as XLSX from 'xlsx';
    import { listPlans } from "@/api/admin/produce/plan";

    export default {
        components: {
            ExcelUploadParser
        },
        data() {
            return {
                tableData: [],
                projectUrl: '',
                tableLoading: false,
            };

        },
        created() {
            this.projectUrl = process.env.VUE_APP_API_BASE_URL;
        },
        methods: {
            updateTableData(data) {
                this.tableLoading = true;
                listPlans(data)
                    .then(response => {
                        if (response.data != null) {
                            this.tableData = response.data;
                        } else {
                            this.$message.error("未查询到对应BOM信息！！");
                        }
                        this.tableLoading = false;
                    })
                    .catch(() => {
                        this.tableLoading = false;
                    })
            },
            download(){
                window.location.href = this.projectUrl + '/admin/erp/production/downLoad?fileName=production.xlsx'
            },
            exportToExcel() {
                 this.$nextTick(() => {
                    const table = this.$refs.table.$el.querySelector('.el-table__body-wrapper table');
                    if (table) {
                        // 创建一个临时的div来容纳整个表格（包括表头）
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = table.outerHTML;

                        // 将表格转换为工作簿对象
                        const wb = XLSX.utils.table_to_book(tempDiv);
                        // 获取工作表
                        const ws = wb.Sheets[wb.SheetNames[0]];
                        // 设置表头
                        const columnNames = this.tableData[0] ? Object.keys(this.tableData[0]) : [];

                          // 设置第一行为表格的列名数据
                        columnNames.forEach((columnName, index) => {
                            console.log(index,columnName)
                            ws[XLSX.utils.encode_cell({ c: index, r: 0 })] = { v: columnName, t: 's' };
                        });

                        // 导出Excel文件
                        XLSX.writeFile(wb, 'table_data.xlsx');
                    } else {
                     console.error('Table element not found');
                    }
                 });
            },
        }
    };
</script>
