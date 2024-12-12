<template>
    <div class="app-container">
        <el-row :gutter="24">
            <el-col :span="24" :xs="24">

                <el-row :gutter="24">
                    <el-col :span="24" :xs="24" ref="elElement">
                        <el-upload class="upload-demo el-col-6" drag v-show="uploadShow" :action="uploadUrl"
                            :on-success="handleSuccess" multiple name="file" :show-file-list="false">
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        </el-upload>
                        <el-button type="primary" @click="showUpload">{{ uploadsButtonText }}</el-button>
                    </el-col>
                </el-row>


                 <el-tabs type="border-card" v-model="activeTabName">
                    <el-tab-pane
                      v-for="tab in tabsData"
                      :key="tab.label"
                      :label="tab.label"
                      :name="tab.label"
                      >
                      <el-table :data="tab.content" border style="width: 100%" :cell-style="cellStyle" :row-style="rowStyle"  :height="tableHeight">
                          <el-table-column label="上层节点号" prop="upNode" width="100"></el-table-column>
                          <el-table-column label="母件规格" prop="upSpc"></el-table-column>
                          <el-table-column label="材料代号" prop="downNode" width="100"></el-table-column>
                          <el-table-column label="材料规格" prop="downSpc"></el-table-column>
                          <el-table-column label="材料单位" prop="unit" width="60"></el-table-column>
                          <el-table-column label="组装位置" prop="location" width="100"></el-table-column>
                          <el-table-column label="BOM用量" prop="qty" width="60"></el-table-column>
                          <el-table-column label="基数" prop="qtyBas" width="50"></el-table-column>
                          <el-table-column label="替代品" prop="replace" width="150"></el-table-column>
                          <el-table-column label="停用日期" prop="stopDate" width="100"></el-table-column>
                          <el-table-column label="ERP规格" prop="erpSpc"></el-table-column>
                          <el-table-column label="单价" prop="price" width="80"></el-table-column>
                      </el-table>
                    </el-tab-pane>
                  </el-tabs>



            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                screenHeight: window.innerHeight - 220,
                uploadShow: true,
                uploadsButtonText: '隐藏上传选择框',
                tableHeight: 600,
                tabsData: [],
                activeTabName: '',
                projectUrl: '',
                uploadUrl: '',
            };
        },
        created() {
            this.projectUrl = process.env.VUE_APP_API_BASE_URL;
            this.uploadUrl = this.projectUrl + '/admin/product/craftCheck/upload';
            //this.showUpload();
        },
        mounted() {
            window.addEventListener('resize', this.handleResize);
        },
        updated() {
            const element = this.$refs.elElement.$el.offsetHeight; //.offsetHeight;
            this.tableHeight = this.screenHeight - element;
        },
        beforeDestroy() {
            // 组件销毁前移除事件监听器
            window.removeEventListener('resize', this.handleResize);
        },
        methods: {
            handleSuccess(response, file, fileList) {
                const tabsData = [];
                for (const key in response.data) {
                    if (response.data.hasOwnProperty(key)) {
                      tabsData.push({ label: key, content: response.data[key] });
                    }
                }
                this.tabsData = tabsData;
                if (this.tabsData.length > 0) {
                    this.activeTabName = this.tabsData[0].label;
                }
            },
            isEmpty(str) {
                return (!str || str.trim().length === 0);
            },
            showUpload() {
                if (this.uploadShow) {
                    this.uploadShow = false;
                    this.uploadsButtonText = "隐藏上传选择框"
                } else {
                    this.uploadShow = true;
                    this.uploadsButtonText = "显示上传选择框"
                }
            },
            handleResize() {
                this.screenHeight = window.innerHeight;
            },
            rowStyle({
                row,
                rowIndex
            }) {
                console.log(row);
                if (row.isExists) {
                    return {
                        background: '#F56C6C'
                    };
                }
            },
            cellStyle({
                row,
                column,
                rowIndex,
                columnIndex
            }) {
                const property = column.property;
                if (!this.isEmpty(row.downNode)) {
                    if (property == "downSpc" && row.downSpc != row.erpSpc) {
                        return {
                            background: '#F56C6C'
                        };
                    }

                    if (property == "replace" && !this.isEmpty(row.replace)) {
                        if (row.downNode.substring(0, 12) != row.replace.substring(0, 12)) {
                            return {
                                background: '#F56C6C'
                            };
                        }
                    }
                }
                if (property == "price" && !this.isEmpty(row.price)) {
                    return {
                        background: '#F56C6C'
                    };
                }

                if (property == "stopDate" && !this.isEmpty(row.stopDate)) {
                    return {
                        background: '#F56C6C'
                    };
                }

                if (property == "qty" && !this.isEmpty(row.location)) {
                    const arr = row.location.split(',');
                    if (row.qty != arr.length) {
                        return {
                            background: '#F56C6C'
                        };
                    }
                }
            },
        }
    };
</script>

<style>
</style>
