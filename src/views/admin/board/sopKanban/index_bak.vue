<template>
    <div class="app-container">
        <el-row :gutter="23">
            <el-col :span="24" :xs="24">
                <!--上传按钮-->
                <el-button type="text" @click="uploadDialog = true">点击上传</el-button>

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
                    <el-table-column prop="sopname" label="文件名称" width="180">
                        <template slot-scope="scope">
                            <el-link type="warning"
                                @click.native="openPlay(scope.row)">{{ scope.row.sopname }}</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="uploadbyname" label="上传人" width="180"></el-table-column>
                    <el-table-column prop="uploadbytime" label="上传时间"></el-table-column>
                    <el-table-column label="操作" width="180">
                        <template slot-scope="scope">
                            <el-button type="danger" icon="el-icon-delete" @click="deleteEsop(scope.row)"
                                circle></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--上传信息-->
                <el-dialog title="上传文件" :visible.sync="uploadDialog" width="30%" center>
                    <span>
                        <el-upload class="upload-demo" drag :action="uploadUrl" multiple
                            :on-success="handleAvatarSuccess">
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        </el-upload>
                    </span>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="uploadDialog = false">取 消</el-button>
                    </span>
                </el-dialog>
                <!--上传成功-->
                <el-dialog class="apply-dialog" :visible.sync="successDialog" width="30%" :lock-scroll="false"
                    :close-on-click-modal="false" :append-to-body="true" center>
                    <div style="padding:10px;display: flex;justify-content: center;">
                        <div class="loader"></div>
                    </div>
                    <div class="font-36">上传成功</div>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="fileInserll()">确定</el-button>
                    </span>
                </el-dialog>
            </el-col>
        </el-row>
    </div>
</template>

<style>
    .upload-demo {
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
    }
</style>

<script>
    import {
        GetEsopData,
        insertEsop,
        GetEsopDataByName,
        RemoveEsopDataByName
    } from "@/api/admin/board/sopKanban"

    export default {
        name: "sopKanban",
        data() {
            return {
                tableData: [],
                uploadUrl: process.env.VUE_APP_BASE_API + "/Video/upload",
                uploadDialog: false,
                successDialog: false,
                queryText: "",
                sop: {
                    sopname: "",
                    uploadlocation: ""
                },
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
                        this.tableData = response.data.list;
                    } else {
                        console.log("无文件上传数据！");
                    }
                })
            },
            //上传文件
            handleAvatarSuccess(response, file, fileList) {
                // 如果上传成功
                if (response.code == 200) {
                    this.sop.sopname = response.data.fileName;
                    this.sop.uploadlocation = response.data.url;
                    this.uploadDialog = false;
                    this.successDialog = true;
                } else {
                    this.$message.error("文件上传失败:" + response.msg);
                }
            },
            //新增数据
            fileInserll() {
                insertEsop(this.sop).then(response => {
                    this.successDialog = false;
                    if (response.code == 200) {
                        this.loadEsopData();
                        this.$message.success("新增成功");
                    } else {
                        this.$message.error("失败:" + response.msg);
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                })
            },
            //取消上传文件
            handleClose(done) {
                this.$confirm('确认关闭？').then(_ => {
                    done();
                }).catch(_ => {});
            },
            //需要展示内容
            openPlay(row) {
                // 这里假设你的Vue应用运行在当前域名的根路径下
                const url = "http://localhost:8088/index?url=" + row.uploadlocation;
                window.open(url, '_blank');
            },
            //单条查询
            onSubmit() {
                console.log(this.queryText);
                if (this.queryText === "") {
                    this.loadEsopData();
                    return;
                }
                GetEsopDataByName({
                    id: this.queryText
                }).then(response => {
                    if (response.data != null) {
                        this.tableData = [response.data];
                    } else {
                        console.log("无文件上传数据！");
                    }
                })
            },
            //删除数据
            deleteEsop(row) {
                this.$confirm('删除数据?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'
                }).then(() => {
                    RemoveEsopDataByName({id:row.sopname}).then(response => {
                        if (response.data != null) {
                            this.loadEsopData();
                            this.$message({type: 'success',message: '删除成功!'});
                        }
                    })
                }).catch(() => {
                    this.$message({type: 'info',message: '已取消'});
                });
            }
        }
    }
</script>
