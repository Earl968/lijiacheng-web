<template>
    <div class="app-container">
        <el-row :gutter="23">
            <!--用户数据-->
            <el-col :span="24" :xs="24">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="线体">
                        <el-select v-model="lineValue" placeholder="线体">
                            <el-option v-for="item in lines" :key="item" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-col>

            <el-col :span="6" v-for="item in info">
                <el-card :body-style="{ padding: '0px' }" style="text-align: center;">
                    <div class="card-top">
                        <span>{{ item.position }}</span>
                    </div>
                    <img :src="item.empPhoto" class="image" style="object-fit: none;">
                    <div style="padding: 14px;">
                        <span>{{ item.empName }}</span>
                        </br>
                        <span>{{ item.empPhone }}</span>
                        <div class="bottom clearfix">

                            <el-button type="text" class="button" @click="showUpdateInfo(item)">操作按钮</el-button>
                        </div>
                    </div>
                </el-card>
            </el-col>

            <el-col :span="24" :xs="24">
                <el-dialog title="修改信息" :visible.sync="openModify" width="30%">
                    <div>
                        <el-form label-width="80px" :model="needModifyInfo">
                            <el-form-item>
                                <el-upload class="avatar-uploader" :action="uploadUrl"
                                    :show-file-list="false" :on-success="handleAvatarSuccess"
                                    :before-upload="beforeAvatarUpload">
                                    <img v-if="imageUrl" :src="imageUrl" class="avatar" style="object-fit: none;">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                                <!-- 用于显示图片略缩图的组件 -->
                            </el-form-item>
                            <el-form-item label="名字">
                                <el-input v-model="needModifyInfo.empName"></el-input>
                            </el-form-item>
                            <el-form-item label="电话">
                                <el-input v-model="needModifyInfo.empPhone"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="openModify = false">取 消</el-button>
                        <el-button type="primary" @click="modibyEmpInfo()">修改</el-button>
                    </div>
                </el-dialog>
            </el-col>
        </el-row>
    </div>
</template>
<style>
    .bottom {
        margin-top: 13px;
        line-height: 12px;
    }

    .button {
        padding: 0;
        float: right;
    }
/*
    .image {
        width: 100%;
        display: block;
    } */

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .card-top {
        margin: 5px;
        text-align: center;
        font-family: 'Arial', sans-serif;
        /* 使用Arial字体，如果不可用则使用系统默认的无衬线字体 */
        font-size: 24px;
        font-weight: bold;
    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>

<script>
    import {
        GetLines,
        GetShopEmp,
        updateShopEmp
    } from "@/api/admin/board/LjcShopEmp"

    export default {
        name: "LjcShopEmp",
        data() {
            return {
                uploadUrl: process.env.VUE_APP_BASE_API + "/admin/prm/ljcShopEmp/upload/img",
                lines: [],
                lineValue: '',
                info: [],
                needModifyInfo: {},
                openModify: false,
                imageUrl: '', // 用于存储选择的图片的URL: '',
            }
        },
        created() {
            var _this = this;
            _this.loadLines(true);
        },
        methods: {
            //获取线别信息
            loadLines() {
                var _this = this;
                GetLines().then(response => {
                    if (response.data != null) {
                        _this.lines = response.data;
                        _this.lineValue = _this.lines[0];
                        this.loadShopEmp();
                    } else {
                        console.log("未查询到对应的线体信息！");
                    }
                })
            },
            //获取用户信息
            loadShopEmp(){
                var _this = this;
                GetShopEmp({line:_this.lineValue}).then(response => {
                    if (response.data != null) {
                        _this.info = response.data;
                        console.log(response.data);
                    } else {
                        console.log("未查询到对应的照片信息");
                    }
                })
            },
            onSubmit() {
                this.loadShopEmp();
            },
            //修改用户信息
            modibyEmpInfo(){
                updateShopEmp(this.needModifyInfo).then(response => {
                    this.openModify=false;
                    if (response.code == 200) {

                        this.loadShopEmp();
                    } else {
                        console.log("未查询到对应的照片信息");
                    }
                })
            },
            //上传文件
            handleAvatarSuccess(response, file, fileList) {
                // 如果上传成功
                if (response.code == 200) {
                    this.needModifyInfo.empPhoto=response.data.fileName;
                } else {
                    this.$message.error("文件上传失败:" + response.msg);
                }
            },
            //显示修改框
            showUpdateInfo(info) {
                this.needModifyInfo = info;
                this.imageUrl = info.empPhoto;
                this.openModify = true;
            },
            //上传前图片检查
            beforeAvatarUpload(file) {
                const isJPG = (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png');
                if (!isJPG) {
                    this.$message.error('只能上传图片!');
                    return false;
                }
                // 当文件选择后，通过FileReader读取文件并显示为图片
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.imageUrl = e.target.result;
                };
                reader.readAsDataURL(file);

                return true;
            },
        }
    }
</script>
