<template>
    <div class="app-container">
        <el-row :gutter="23">
            <el-col :span="24" :xs="24">
                <el-button v-if="showUpload" type="text" @click="uploadDialog = true">点击上传</el-button>

                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="文件名称">
                        <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="queryText">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="24" :xs="24">
                <section>
                   <div class="max-w-5xl mx-auto px-8">
                       <div class="card-wraper">
                           <div class="background" id="background"></div>
                           <a href="javascript:void(0)" @click="openPlay(item)" v-for="item in cardData" class="card relative group block p-2 h-full w-full">
                               <el-card class="card-main">
                                   <h3>{{ item.sopname }}</h3>
                                   <img src="@/assets/images/file-pdf.png" class="img">
                                   <p>{{ item.uploadbyname }}</p>
                                   <div class="bottom clearfix">
                                     <time class="time">{{ formatDate(new Date(item.uploadbytime), 'YYYY-MM-DD HH:mm:ss') }}</time>
                                     <el-button type="text" class="button" @click.stop="deleteEsop(item)">删除</el-button>
                                   </div>
                               </el-card>
                           </a>
                        </div>
                   </div>
                </section>
            </el-col>
            <el-col :span="24" :xs="24">
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



<style scoped src="@/style/demo.css"></style>
<!-- <style scoped src="@/style/main.css"></style> -->

<script>
    import {
        GetEsopData,
        insertEsop,
        GetEsopDataByName,
        RemoveEsopDataByName,
        indexDOMContentLoaded,
        checkUserKey
    } from "@/api/admin/board/sopKanban"

    export default {
        name: "newindex",
        data() {
           return {
               cardData: [],
               uploadUrl: process.env.VUE_APP_BASE_API + "/Video/upload",
               uploadDialog: false,
               successDialog: false,
               showUpload: false,
               queryText: "",
               sop: {
                   sopname: "",
                   uploadlocation: ""
               },
           }
        },
        updated() {
            indexDOMContentLoaded();
        },
        created() {
            this.showUploadFun();
            this.loadEsopData();
        },
        methods: {
            //是否显示上传按钮
            showUploadFun(){
                checkUserKey().then(response => {
                    if (response.code === 200) {
                        this.showUpload = true;
                    }
                })
            },
            //加载数据
            loadEsopData() {
                GetEsopData().then(response => {
                    if (response.data != null) {
                        this.cardData = response.data.list;
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
                const url = "http://192.168.16.203:9093/index?url=" + row.uploadlocation;
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
                        this.cardData = [response.data];
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
                //event.preventDefault();
                //console.log(111);
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




