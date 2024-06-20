<template>
    <div class="app-container">
        <el-row :gutter="23">
            <!--用户数据-->
            <el-col :span="24" :xs="24">
                <!-- @selection-change="handleSelectionChange" -->
                <el-table id="orderDateTable" v-loading="tableLoading" element-loading-text="正在查询数据"
                    element-loading-spinner="el-icon-loading" element-loading-background="rgba(217, 217, 217, 0.8)"
                    :data="auctionList">

                    <el-table-column align="center" type="index" />
                    <el-table-column label="序列号" align="center" key="serialNumber" prop="serialNumber" />
                    <el-table-column label="售货员" align="center" key="salesman" prop="salesman" />
                    <el-table-column label="顾客" align="center" key="customer" prop="customer" />
                    <el-table-column label="品牌" align="center" key="brand" prop="brand" />
                    <el-table-column label="规格" align="center" key="specifications" prop="specifications" />
                    <el-table-column label="图片" align="center" width="200">
                        <template slot-scope="scope">
                            <!-- <el-image style="width: 100px; height: 100px" :src="scope.row.picture"
                                :preview-src-list="[scope.row.picture]">
                            </el-image> -->

                            <el-image style="width: 100px; height: 100px"
                                :src="getImageByBase64(scope.row.pictureStr,scope.row.fileName)"
                                :preview-src-list="[getImageByBase64(scope.row.pictureStr,scope.row.fileName)]"
                                alt="Base64 Image">
                            </el-image>
                        </template>
                    </el-table-column>
                    <el-table-column label="描述" align="center" width="200">
                        <template slot-scope="scope">
                            <!-- <p v-html="scope.row.description
                             +scope.row.coltage
                             +scope.row.cct
                             +scope.row.watts
                             +scope.row.cri"></p> -->
                            <p v-html="combinationStr(scope.row.description,scope.row.voltage,scope
                             .row.cct,scope.row.watts,scope.row.cri)" />
                        </template>
                    </el-table-column>
                    <el-table-column label="当前状态" align="center" key="currentStatus" prop="currentStatus" />
                    <!-- <el-table-column label="测试报告" align="center" key="testReport" prop="testReport" /> -->
                    <!-- <el-table-column label="工厂分析" align="center" key="factoryAnalysis" prop="factoryAnalysis" /> -->
                    <el-table-column label="工程负责人" align="center" key="projectLeader" prop="projectLeader" />
                    <el-table-column label="备注" align="center" key="remarks" prop="remarks" />
                </el-table>

            </el-col>
        </el-row>
    </div>
</template>
<style>
    .el-table .success-row {
        background: #f0f9eb;
    }

    .el-table .success-row tr {
        background: #f0f9eb;
    }

    .priceTable {
        margin-top: 5px;
        margin-bottom: 10px;
    }
</style>

<script>
    import {
        Icon,
        Loading
    } from "element-ui";
    import {
        ref
    } from 'vue';
    import {
        getList
    } from "@/api/admin/produce/auction"

    export default {
        name: "auction",
        data() {
            return {
                auctionList: [],
                tableLoading: false,
            }
        },
        created() {
            var _this = this;
            _this.list();
        },
        methods: {
            /** 查询竞品列表 */
            list(isCreate) {
                var _this = this;
                _this.tableLoading = true;
                getList().then(response => {
                    if (response.data != null) {
                        _this.auctionList = response.data;
                    } else {
                        console.log("订单数据为空");
                    }
                    _this.tableLoading = false;
                }).catch(() => {
                    _this.tableLoading = false;
                })
            },
            // 将图片的base64字符串转换为对应的图片
            getImageByBase64(str, fileName) {
                const fileType = fileName.slice((fileName.lastIndexOf('.') + 1 >>> 0)).toLowerCase();
                let typeStr = '';
                if (fileType === 'jpeg') {
                    typeStr = 'data:image/jpeg;base64,';
                } else if (fileType === 'jpg') {
                    typeStr = 'data:image/jpg;base64,';
                } else if (fileType === 'png') {
                    typeStr = 'data:image/png;base64,';
                } else if (fileType === 'svg') {
                    typeStr = 'data:image/svg;base64,';
                } else if (fileType === 'gif') {
                    typeStr = 'data:image/gif;base64,';
                }
                return typeStr + str;
            },
            /** 组合字符 */
            combinationStr(...args) {
                return args.filter(item => item !== null && item !== undefined && item !== '').join('-');
            },
        }
    }
</script>
