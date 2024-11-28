<template>
    <div class="app-container">
        <el-row :gutter="24">
            <el-col :span="24" :xs="24">
                <el-upload class="upload-demo el-col-21" drag :action="uploadUrl" :on-success="handleSuccess" multiple
                    name="file" :show-file-list="false">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>

                <el-table :data="tableData" border style="width: 100%" :cell-style="cellStyle"  height="700">
                    <el-table-column label="上层节点号" prop="upNode"  width="130"></el-table-column>
                    <el-table-column label="母件规格" prop="upSpc" width="500"></el-table-column>
                    <el-table-column label="材料代号" prop="downNode"  width="130"></el-table-column>
                    <el-table-column label="材料规格" prop="downSpc" width="500"></el-table-column>
                    <el-table-column label="材料单位" prop="unit"></el-table-column>
                    <el-table-column label="组装位置" prop="location"></el-table-column>
                    <el-table-column label="BOM用量" prop="qty"></el-table-column>
                    <el-table-column label="基数" prop="qtyBas"></el-table-column>
                    <el-table-column label="替代品" prop="replace"></el-table-column>
                    <el-table-column label="停用日期" prop="stopDate"></el-table-column>
                    <el-table-column label="ERP规格" prop="erpSpc" width="500"></el-table-column>
                    <el-table-column label="单价" prop="price"></el-table-column>
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
            };
        },
        created() {
            this.projectUrl = process.env.VUE_APP_API_BASE_URL;
            this.uploadUrl = this.projectUrl + '/admin/product/craftCheck/upload'
        },
        methods: {
            handleSuccess(response, file, fileList) {
                this.tableData = response.data;
            },
            isEmpty(str) {
              return (!str || str.trim().length === 0);
            },
            cellStyle({
                row,
                column,
                rowIndex,
                columnIndex
            }) {
                const property = column.property;
                if(!this.isEmpty(row.downNode)){
                    if(property=="downSpc" && row.downSpc != row.erpSpc){
                        return { background: '#F56C6C' };
                    }

                    if(property=="replace" && !this.isEmpty(row.replace)){
                        if(row.downNode.substring(0, 12) != row.replace.substring(0, 12)){
                            return { background: '#F56C6C' };
                        }
                    }
                }
                if(property=="price" && !this.isEmpty(row.price)){
                     return { background: '#F56C6C' };
                }

                if(property=="stopDate" && !this.isEmpty(row.stopDate)){
                     return { background: '#F56C6C' };
                }

                if(property=="qty" && !this.isEmpty(row.location)){
                    const arr = row.location.split(',');
                    if(row.qty!=arr.length){
                        return { background: '#F56C6C' };
                    }
                }
            },
        }
    };
</script>

<style>
</style>
