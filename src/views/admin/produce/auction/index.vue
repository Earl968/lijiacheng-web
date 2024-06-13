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
                    <el-table-column label="序列号" align="center"  key="serialNumber" prop="serialNumber"/>
                    <el-table-column label="售货员" align="center" key="salesman" prop="salesman" />
                    <el-table-column label="顾客" align="center" key="customer" prop="customer" />
                    <el-table-column label="品牌" align="center" key="brand" prop="brand" />
                    <el-table-column label="规格" align="center" key="specifications" prop="specifications" />
                    <el-table-column label="图片" align="center" width="200">
                        <template slot-scope="scope" >
                              <el-image style="width: 100px; height: 100px"
                              :src="scope.row.picture"
                              :preview-src-list="[scope.row.picture]">
                              </el-image>
                        </template>
                    </el-table-column>
                    <el-table-column label="描述" align="center" width="200">
                        <template slot-scope="scope" >
                             <p v-html="scope.row.description
                             +scope.row.coltage
                             +scope.row.cct
                             +scope.row.watts
                             +scope.row.cri"></p>
                           <!--  <p v-html="combinationStr(scope.row.description,scope.row.coltage,scope
                             .row.cct,scope.row.watts,scope.row.cri)"/> -->
                        </template>
                    </el-table-column>
                    <el-table-column label="当前状态" align="center" key="currentStatus" prop="currentStatus"/>
                    <el-table-column label="测试报告" align="center" key="testReport" prop="testReport" />
                    <el-table-column label="工厂分析" align="center" key="factoryAnalysis" prop="factoryAnalysis"/>
                    <el-table-column label="工程负责人" align="center" key="projectLeader" prop="projectLeader" />
                    <el-table-column label="备注" align="center" key="remarks" prop="remarks"/>
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

    export default {
        name: "auction",
        data() {
            return {
                auctionList:[{
                    "serialNumber": 20240102 - 1,
                    "salesman": "felia",
                    "customer": "American lighting  ",
                    "brand": "American lighting  ",
                    "specifications": "1009579014 AL-TP-RGBCWIC-16",
                    "picture": "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
                    "description": "16.4 t RGBWICDYNAMIC COLOR STRIP LIGHT",
                    "coltage": "120V",
                    "cct": "/",
                    "watts": "/",
                    "cri": "/",
                    "currentStatus": "分析中",
                    "testReport": "见附件",
                    "factoryAnalysis": "竞品分析",
                    "projectLeader": "杜工/杜鸿杰",
                    "remarks": "2024.1.05童工外发外协"
                },
                {
                    "serialNumber": 20240102 - 2,
                    "salesman": "felia",
                    "customer": "American lighting  ",
                    "brand": "American lighting  ",
                    "specifications": "1009579015 AL-HSNR-RGBCWIC-16FT",
                    "picture": "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
                    "description": "16.4ft RGBWICDYNAMIC COLOR360° OUTDOORROPE LIGHT",
                    "coltage": "120V",
                    "cct": "/",
                    "watts": "/",
                    "cri": "/",
                    "currentStatus": "分析中",
                    "testReport": "见附件",
                    "factoryAnalysis": "竞品分析",
                    "projectLeader": "杜工/朱晓军",
                    "remarks": "给到杜工 2024.1.30给到邱工",
                },
                {
                    "serialNumber": 20240102 - 2,
                    "salesman": "felia",
                    "customer": "American lighting  ",
                    "brand": "American lighting  ",
                    "specifications": "1009579015 AL-HSNR-RGBCWIC-16FT",
                    "picture": "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
                    "description": "16.4ft RGBWICDYNAMIC COLOR360° OUTDOORROPE LIGHT",
                    "coltage": "120V",
                    "cct": "/",
                    "watts": "/",
                    "cri": "/",
                    "currentStatus": "分析中",
                    "testReport": "见附件",
                    "factoryAnalysis": "竞品分析",
                    "projectLeader": "杜工/朱晓军",
                    "remarks": "给到杜工 2024.1.30给到邱工",
                    },
                {
                    "serialNumber": 20240102 - 2,
                    "salesman": "felia",
                    "customer": "American lighting  ",
                    "brand": "American lighting  ",
                    "specifications": "1009579015 AL-HSNR-RGBCWIC-16FT",
                    "picture": "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
                    "description": "16.4ft RGBWICDYNAMIC COLOR360° OUTDOORROPE LIGHT",
                    "coltage": "120V",
                    "cct": "/",
                    "watts": "/",
                    "cri": "/",
                    "currentStatus": "分析中",
                    "testReport": "见附件",
                    "factoryAnalysis": "竞品分析",
                    "projectLeader": "杜工/朱晓军",
                    "remarks": "给到杜工 2024.1.30给到邱工",
                    },
                {
                    "serialNumber": 20240102 - 2,
                    "salesman": "felia",
                    "customer": "American lighting  ",
                    "brand": "American lighting  ",
                    "specifications": "1009579015 AL-HSNR-RGBCWIC-16FT",
                    "picture": "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
                    "description": "16.4ft RGBWICDYNAMIC COLOR360° OUTDOORROPE LIGHT",
                    "coltage": "120V",
                    "cct": "/",
                    "watts": "/",
                    "cri": "/",
                    "currentStatus": "分析中",
                    "testReport": "见附件",
                    "factoryAnalysis": "竞品分析",
                    "projectLeader": "杜工/朱晓军",
                    "remarks": "给到杜工 2024.1.30给到邱工",
                    },
                {
                    "serialNumber": 20240102 - 2,
                    "salesman": "felia",
                    "customer": "American lighting  ",
                    "brand": "American lighting  ",
                    "specifications": "1009579015 AL-HSNR-RGBCWIC-16FT",
                    "picture": "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
                    "description": "16.4ft RGBWICDYNAMIC COLOR360° OUTDOORROPE LIGHT",
                    "coltage": "120V",
                    "cct": "/",
                    "watts": "/",
                    "cri": "/",
                    "currentStatus": "分析中",
                    "testReport": "见附件",
                    "factoryAnalysis": "竞品分析",
                    "projectLeader": "杜工/朱晓军",
                    "remarks": "给到杜工 2024.1.30给到邱工",
                    },
                {
                    "serialNumber": 20240102 - 2,
                    "salesman": "felia",
                    "customer": "American lighting  ",
                    "brand": "American lighting  ",
                    "specifications": "1009579015 AL-HSNR-RGBCWIC-16FT",
                    "picture": "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
                    "description": "16.4ft RGBWICDYNAMIC COLOR360° OUTDOORROPE LIGHT",
                    "coltage": "120V",
                    "cct": "/",
                    "watts": "/",
                    "cri": "/",
                    "currentStatus": "分析中",
                    "testReport": "见附件",
                    "factoryAnalysis": "竞品分析",
                    "projectLeader": "杜工/朱晓军",
                    "remarks": "给到杜工 2024.1.30给到邱工",
                    },
                {
                    "serialNumber": 20240102 - 2,
                    "salesman": "felia",
                    "customer": "American lighting  ",
                    "brand": "American lighting  ",
                    "specifications": "1009579015 AL-HSNR-RGBCWIC-16FT",
                    "picture": "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
                    "description": "16.4ft RGBWICDYNAMIC COLOR360° OUTDOORROPE LIGHT",
                    "coltage": "120V",
                    "cct": "/",
                    "watts": "/",
                    "cri": "/",
                    "currentStatus": "分析中",
                    "testReport": "见附件",
                    "factoryAnalysis": "竞品分析",
                    "projectLeader": "杜工/朱晓军",
                    "remarks": "给到杜工 2024.1.30给到邱工",
                    }
                ],
                tableLoading: false,
            }
        },
        methods: {
            /** 组合字符 */
            combinationStr(description,coltage,cct,watts,cri){
                return description+"<br/>"+coltage+"<br/>"+cct+"<br/>"+watts+"<br/>"+cri
            }
        }
    }
</script>
