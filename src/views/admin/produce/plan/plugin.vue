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
                    <el-table-column label="订单号"  prop="订单号"></el-table-column>
                    <el-table-column label="电源板料号" prop="电源板料号"></el-table-column>
                    <el-table-column label="成品编码" prop="成品编码"></el-table-column>
                    <el-table-column label="规格型号" prop="规格型号">
                        <template slot-scope="scope">
                            <div class="ellipsis" :title="scope.row.规格型号">{{ scope.row.规格型号 }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="订单数量" prop="订单数量"></el-table-column>
                    <el-table-column label="生产数量" prop="生产数量"></el-table-column>
                    <el-table-column label="上线日期" prop="上线日期"></el-table-column>
                    <el-table-column label="制令单号" prop="制令单号"></el-table-column>
                    <el-table-column label="后段需求时间" prop="后段需求时间"></el-table-column>
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
    import { pluginsPlans } from "@/api/admin/produce/plan";

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
                pluginsPlans(data)
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
                window.location.href = this.projectUrl + '/admin/erp/production/downLoad?fileName=plugin.xlsx'
            },
            exportToExcel() {
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
        }
    };
</script>
