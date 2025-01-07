<template>
    <div class="app-container">
        <el-row :gutter="24" >
            <el-col :span="24" :xs="24">
                <el-select v-model="value" multiple filterable allow-create default-first-option clearable
                    placeholder="请选择需要的仓库"  width="300" >
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary" @click="download" :loading="downloadStyle">{{ downloadText }}<i class="el-icon-bottom el-icon--right"></i></el-button>
            </el-col>

        </el-row>
    </div>

</template>

<script>
    export default {
        data() {
            return {
                options: [{
                        value: 'B01',
                        label: 'B01-总装半成品仓库'
                    },
                    {
                        value: 'B02',
                        label: 'B02-电源现场仓'
                    },
                    {
                        value: 'B03',
                        label: 'B03-组装辅料仓'
                    },
                    {
                        value: 'T01',
                        label: 'T01-停用订单仓库'
                    },
                    {
                        value: 'W01',
                        label: 'W01-综合仓库'
                    },
                    {
                        value: 'X01',
                        label: 'X01-SMT现场仓'
                    },
                    {
                        value: 'X02',
                        label: 'X02-插件现场仓'
                    },
                    {
                        value: 'X03',
                        label: 'X03-SMT辅料仓库'
                    },
                    {
                        value: 'X04',
                        label: 'X04-插件辅料仓'
                    },
                    {
                        value: 'Y01',
                        label: 'Y01-电子仓库'
                    },
                    {
                        value: 'Y02',
                        label: 'Y02-结构仓库'
                    },
                    {
                        value: 'Y03',
                        label: 'Y03-包材仓库'
                    },
                    {
                        value: 'Y06',
                        label: 'Y06-整灯仓库'
                    },
                ],
                value: [],
                downloadStyle: false,
                downloadText: '下载'
            }
        },
        created() {
             this.projectUrl = process.env.VUE_APP_API_BASE_URL;
        },
         methods: {
             download(){
                if(this.value.length===0){
                    this.$message.error("请选择对应仓库！！");
                    return;
                }
                this.downloadStyle= true;
                this.downloadText= '正在下载';
                fetch(this.projectUrl + '/admin/erp/Store/download?wh=' + this.value)
                .then(response => response.blob())
                .then(blob => {
                  const link = document.createElement('a');
                  link.href = URL.createObjectURL(blob);
                  link.download = '下载文件.xlsx'; // 设置下载文件的名称
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);

                  this.downloadStyle = false;
                  this.downloadText= '下载';
                })
                .catch(error => {
                    this.downloadStyle= true;
                    this.downloadText= '正在下载';
                    this.$message.error("下载出错,请联系管理员!");
                    console.error('Error downloading file:', error);
                });


             }
         }
    }

</script>

<style>
</style>
