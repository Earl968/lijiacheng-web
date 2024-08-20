<template>
    <div class="app-container">
        <el-row :gutter="23">
            <el-col :span="24" :xs="24">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="文件名称">
                        <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="queryText">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                    </el-form-item>
                </el-form>

                <!--表格信息-->
                <el-table :data="tableData" border style="width: 100%">

                    <el-table-column prop="filedes" label="备注说明"></el-table-column>
                    <el-table-column prop="filename" label="文件名称" >
                        <template slot-scope="scope">
                            <el-link type="warning"
                                @click.native="openPlay(scope.row)">{{ scope.row.filename }}</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="filepath" label="下载地址">
                          <template slot-scope="scope">
                                <el-link type="warning" :href="scope.row.downPath">查看详情</el-link>
                          </template>
                    </el-table-column>
                    <el-table-column prop="createdatetime" label="操作时间">
                        <template slot-scope="scope">
                              {{ formatDate(new Date(scope.row.createdatetime), 'YYYY-MM-DD HH:mm:ss') }}
                        </template>
                    </el-table-column>
                </el-table>


            </el-col>
        </el-row>
    </div>
</template>

<style>
    /* .upload-demo {
        text-align: center;
    }

    .loader {
        position: relative;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        border: 4px solid rgba(165, 220, 134, 0.2);
        border-left-color: #A5DC86;
        animation: animation_collect 1s linear 1 both;
    }
    .font-36{
        text-align: center;
        font-size: 36;
    }
    @keyframes animation_collect {
        0% {
            transform: rotate(270deg);
            border-left-color: #A5DC86;
        }

        25% {
            border-left-color: #A5DC86;
        }

        50% {
            border-left-color: #A5DC86;
        }

        75% {
            border-left-color: #A5DC86;
        }

        100% {
            border-left-color: rgba(165, 220, 134, 0.2);
            transform: rotate(0deg);
        }
    }

    .loader::before {
        position: absolute;
        content: '';
        top: 50%;
        left: 15px;
        border: 4px solid #A5DC86;
        border-left-width: 0;
        border-bottom-width: 0;
        transform: scaleX(-1) rotate(135deg);
        transform-origin: left top;
        animation: animation_true 0.5s 1s linear 1 both;
        opacity: 0;
    }

    @keyframes animation_true {
        0% {
            opacity: 0;
            width: 0px;
            height: 0px;
        }

        33% {
            opacity: 1;
            width: 20px;
            height: 0px;
        }

        100% {
            opacity: 1;
            width: 20px;
            height: 40px;
        }
    } */
</style>

<script>
    import {
        GetEsopData,
        GetEsopLikeByName
    } from "@/api/admin/board/sopKanban"

    export default {
        name: "sopKanban",
        data() {
            return {
                tableData: [],
                queryText: ""
            }
        },
        created() {
            var _this = this;
            this.loadEsopData();
        },
        methods: {
            //加载数据
            loadEsopData() {
                GetEsopData().then(response => {
                    if (response.data != null) {
                        console.log(response.data);
                        this.tableData = response.data;
                    } else {
                        console.log("无文件上传数据！");
                    }
                })
            },
            //播放Esop
            openPlay(row) {
                // 这里假设你的Vue应用运行在当前域名的根路径下

                window.open(row.filepath, '_blank');
            },
            //单条查询
            onSubmit() {
                if (this.queryText === "") {
                    this.loadEsopData();
                    return;
                }
                GetEsopLikeByName({
                    nameKey: this.queryText
                }).then(response => {
                    if (response.data != null) {
                        this.tableData = response.data;
                    } else {
                        console.log("无文件上传数据！");
                    }
                })
            },
            //时间转换函数
            formatDate(date, format) {
              const year = date.getFullYear();
              const month = (date.getMonth() + 1).toString().padStart(2, '0');
              const day = date.getDate().toString().padStart(2, '0');
              const hours = date.getHours().toString().padStart(2, '0');
              const minutes = date.getMinutes().toString().padStart(2, '0');
              const seconds = date.getSeconds().toString().padStart(2, '0');

              return format
                .replace('YYYY', year)
                .replace('MM', month)
                .replace('DD', day)
                .replace('HH', hours)
                .replace('mm', minutes)
                .replace('ss', seconds);
            }
        }
    }
</script>
