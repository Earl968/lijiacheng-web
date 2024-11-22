<template>
    <div class="app-container">
        <el-row :gutter="24">
            <el-col :span="24" :xs="24">
                <el-upload class="upload-demo el-col-21" drag :action="uploadUrl" :on-success="handleSuccess" multiple
                    name="file" :show-file-list="false">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>

                <div class="el-col el-col-3 el-col-xs-3 grid-content bg-purple-dark"
                    style="padding-left: 6px; padding-right: 6px; background:#F56C6C">
                    <div class="demo-color-box" >整行红色代表ERP中没有</div>
                    <div class="demo-color-box" >单个单元格红色代表此栏位比对错误</div>
                </div>

                <div class="el-col el-col-3 el-col-xs-3 grid-content bg-purple-dark"
                    style="padding-left: 6px; padding-right: 6px;  background:#E6A23C; margin-top: 10px;">
                    <div class="demo-color-box">ERP中存在此数据但表格中没有</div>
                </div>



                <el-table :data="tableData" border style="width: 100%" :cell-style="cellStyle">
                    <el-table-column label="上层节点号" prop="key"></el-table-column>
                    <el-table-column label="母件规格" prop="upSpc"></el-table-column>
                    <el-table-column label="材料代号" prop="downPrdNo"></el-table-column>
                    <el-table-column label="材料规格" prop="downSpc"></el-table-column>
                    <el-table-column label="材料单位" prop="unit"></el-table-column>
                    <el-table-column label="组装位置" prop="useinNo"></el-table-column>
                    <el-table-column label="BOM用量" prop="qty"></el-table-column>
                    <el-table-column label="基数" prop="qtyBas"></el-table-column>
                    <el-table-column label="替代品" prop="prdNoChg"></el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                tableData: [],
                projectUrl: '',
                uploadUrl: '',
                editProp: []
            };
        },
        created() {
            this.projectUrl = process.env.VUE_APP_API_BASE_URL;
            this.uploadUrl = this.projectUrl + '/admin/product/bomCheck/upload'
        },
        methods: {
            handleSuccess(response, file, fileList) {
                this.tableData = response.data;
            },
            cellStyle({
                row,
                column,
                rowIndex,
                columnIndex
            }) {
                if (!row.task) {
                    return {
                        background: '#F56C6C'
                    };
                }
                this.editProp = row.discrepancyProperty;

                const property = column.property
                if (!row.taskResult && this.editProp.includes(property)) {
                    return {
                        background: '#F56C6C'
                    };
                }

                if (!row.isAdmin) {
                    return {
                        background: '#E6A23C'
                    };
                }
            },
        }
    };
</script>

<style>
      .el-row {
        margin-bottom: 20px;
        &:last-child {
          margin-bottom: 0;
        }
      }
      .el-col {
        border-radius: 4px;
      }

      .grid-content {
        border-radius: 4px;
        min-height: 36px;
        padding: 0.625rem;
        color: aliceblue;
      }
      .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
      }
</style>
