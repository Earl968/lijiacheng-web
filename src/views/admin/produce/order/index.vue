<template>
    <div class="app-container">
        <el-row :gutter="23">
            <!--用户数据-->
            <el-col :span="24" :xs="24">
                <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                    label-width="68px">
                    <el-form-item label="订单类型" prop="status">
                        <el-select v-model="queryParams.orderType" placeholder="订单类型" style="width: 210px">
                            <el-option v-for="order in orderType" :key="order.value" :label="order.name"
                                :value="order.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="客户名称" prop="status">
                        <el-row class="demo-autocomplete">
                            <el-col :span="12">
                                <el-autocomplete class="inline-input" v-model="queryParams.customerName"
                                    ref="autocompleteInput" :fetch-suggestions="customerNameSearch"
                                    placeholder="请输入或选择客户" style="width: 210px;" clearable @input="handleInput"
                                    @select="customerNameSelect" />
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="mini"
                            @click="handleQuery()">搜索</el-button>
                    </el-form-item>
                </el-form>
                <!-- 产品变动表格 -->
                <el-dialog :visible.sync="productUpdateVisible" :title="productUpdateTitle" width="70%">
                    <el-table :data="productUpdateData" stripe style="width: 100%">
                        <!-- 表格列定义 -->
                        <el-table-column prop="OLD_BOM_NO" label="原始BOM" />
                        <el-table-column prop="BOM_NO" label="新BOM" />
                        <el-table-column prop="reason" label="更改原因" />
                        <el-table-column prop="ecDd" label="终审日期" />
                        <el-table-column prop="validDd" label="生效日期" />
                    </el-table>
                </el-dialog>
                <!-- 价格表格 -->
                <el-dialog :visible.sync="priceUpdateVisible" :title="priceUpdateTitle" width="50%">
                    <div v-for="(product, index) in priceUpdateData" :key="index">
                        <el-table :data="product.detail" stripe style="width: 100%" :key="`table-${index}`"
                            class="priceTable" border>
                            <el-table-column :label="product.name">
                                <el-table-column prop="orderDate" label="日期" />
                                <el-table-column prop="prdNo" label="货品代号" />
                                <el-table-column prop="price" label="价格" />
                            </el-table-column>
                        </el-table>
                    </div>
                </el-dialog>
                <!-- 资料表格 -->
                <el-dialog :visible.sync="informationVisible" :title="informationTitle" width="70%">
                    <el-table :data="informationData" stripe style="width: 100%">
                        <!-- 表格列定义 -->
                        <el-table-column prop="originalFilename" label="资料名称" />
                        <el-table-column prop="uploadUser" label="上传人" />
                        <el-table-column prop="reason" label="操作">
                            <template slot-scope="scope">
                                <el-link v-if="isShowFile(scope.row.originalFilename)" type="success"
                                    @click="downloadInform(scope.row)">查看</el-link>
                                <el-link v-else type="success" @click="downloadInform(scope.row)">下载</el-link>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-dialog>

                <!-- @selection-change="handleSelectionChange" -->
                <el-table id="orderDateTable" v-loading="tableLoading" element-loading-text="正在查询数据"
                    element-loading-spinner="el-icon-loading" element-loading-background="rgba(217, 217, 217, 0.8)"
                    :data="orderList" :row-class-name="tableRowClassName">

                    <el-table-column label="客户名称" align="center" key="customerName" prop="customerName" />
                    <el-table-column label="订单编号" align="center" key="orderNo" prop="orderNo" />
                    <!-- <el-table-column label="项目状态" align="center" key="projectStatus" prop="projectStatus" /> -->
                    <el-table-column label="订单状态" align="center" key="orderStatusStr" prop="orderStatusStr" />
                    <el-table-column label="样品情况" align="center" key="sampleStatus" prop="sampleStatus">
                        <template slot-scope="scope">
                            <el-link type="warning" @click="showSample(scope.row,'样品情况')"
                                v-if="scope.row.sampleStatus==null||scope.row.sampleStatus==''">样品情况</el-link>
                            <el-link type="success" disabled v-else>样品已处理<br />
                                经办人:{{scope.row.sampleStatusUser}}
                            </el-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="价格波动" align="center" key="orderDetailNum" prop="orderDetailNum">
                        <template slot-scope="scope" v-if="scope.row.orderDetailNum > 0">
                            <el-link type="info" @click="showPriceUpdate(scope.row)">价格数据</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="产品变动" align="center" key="productUpdate" prop="productUpdate">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="showProductUpdate(scope.row)">产品变动</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="客户投诉" align="center" key="customerComplaints" prop="customerComplaints">
                        <template slot-scope="scope">
                            <el-link type="warning" @click="showCustomerComplaints(scope.row,'客户投诉')"
                                v-if="scope.row.customerComplaints==null">客户投诉</el-link>
                            <el-link type="success" disabled v-else>投诉已处理<br />
                                经办人:{{scope.row.customerComplaintsUser}}
                            </el-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="订单时间" align="center" key="orderTime" prop="orderTime" />
                    <el-table-column label="生产资料" align="center" key="productInformation" prop="productInformation">
                        <template slot-scope="scope">
                            <el-upload class="upload-demo" multiple :limit="3" :action="uploadUrl"
                                :before-upload="handleBeforeUpload"
                                :on-success="handleUploadSuccess.bind(this, scope.row)" :on-error="handleUploadError"
                                :show-file-list="showUploadFileList">
                                <el-button size="small" type="primary">点击上传</el-button>
                            </el-upload>
                        </template>
                    </el-table-column>

                    <el-table-column label="资料下载" align="center">
                        <template slot-scope="scope">
                            <el-link v-if="showDownload(scope.row)" type="primary"
                                @click="showDownloadTable(scope.row)">查看</el-link>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum"
                    :limit.sync="queryParams.pageSize" @pagination="getList" /> -->
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
<!-- 要求后期跟单在处理的客户项目状态，
订单状态，
样品情况，
价格波动，
产品变动，
客户投诉，
产品对应的资料信息等，
可以在系统或者小程序中建立《客户资料库》 -->
<script>
    import {
        Icon,
        Loading
    } from "element-ui";
    import {
        listOrder,
        getProductUpdate,
        getPriceUpdate,
        getInformation,
        customerComplaints,
        uploadSuccess,
        sample
    } from "@/api/admin/produce/order"
    import {
        getUserProfile
    } from "@/api/system/user";

    export default {
        name: "order",
        data() {
            return {
                // 是否显示文件上传列表
                showUploadFileList: false,
                uploadUrl: process.env.VUE_APP_BASE_API + "/common/order/information", // 上传的订单资料服务器地址
                // 遮罩层
                tableLoading: false,
                oldType: '',
                // 订单类型下拉框
                orderType: [{
                    name: '大货订单',
                    value: 'old_order',
                    default: true
                }, {
                    name: '新订单',
                    value: 'new_order'
                }],
                // 上传文件大小限制(MB)
                fileSize: {
                    type: Number,
                    default: 300,
                },
                // 总条数
                // total: 4,
                // 显示搜索条件
                showSearch: true,
                // 查询参数
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                    orderType: 'old_order',
                    customerName: ''
                },
                //样品数据
                sampleData: {},
                //确认上传投诉数据
                customerComplaintsData: {},
                orderInformUploadSuccessReq: {},
                // 模拟订单数据
                orderList: [],
                orderNos: [],
                visible: false,
                user: {},

                productUpdateVisible: false, // 产品变动 控制弹出层显示的标志
                productUpdateTitle: '',
                productUpdateData: [],
                priceUpdateVisible: false, // 价格数据 控制弹出层显示的标志
                priceUpdateTitle: '',
                priceUpdateData: [],
                informationVisible: false, // 资料下载 控制弹出层显示的标志
                informationTitle: '',
                informationData: [],

                customerNameList: [], //客户名称集合
                projectUrl: '', // 项目根路径
            }
        },
        created() {
            var _this = this;
            _this.getList(true);
            _this.getUser();
            _this.projectUrl = process.env.VUE_APP_API_BASE_URL;
        },
        methods: {
            handleInput() {
                // 当输入内容变化时， 这里包括用户输入和清除按钮被点击
                // 通过检查v - model绑定的值是否为空来判断清除按钮是否被点击
                if (!this.queryParams.customerName) {
                    // 利用$nextTick确保DOM已经更新后再操作
                    this.$nextTick(() => {
                        // 将焦点移出输入框
                        document.activeElement.blur();

                        console.log("已清空")
                    });
                }
            },
            /** 查询订单列表列表 */
            getList(isCreate) {
                var _this = this;
                _this.tableLoading = true;
                let boo = _this.queryParams.orderType != _this.oldType;
                if (boo) {
                    _this.queryParams.customerName = '';
                    _this.oldType = _this.queryParams.orderType;
                }
                listOrder(_this.queryParams).then(response => {
                    if (response.data != null) {
                        _this.orderList = response.data;
                        // TODO 此时暂时不使用分页
                        // this.total = respon.data;
                        if (boo) {
                            _this.getCustomerNameList(_this.orderList);
                        }
                    } else {
                        console.log("订单数据为空");
                    }
                    _this.tableLoading = false;
                }).catch(() => {
                    _this.tableLoading = false;
                })
            },

            getUser() {
                getUserProfile().then(response => {
                    this.user = response.data;
                    this.roleGroup = response.roleGroup;
                    this.postGroup = response.postGroup;
                });
            },
            /** 搜索按钮操作 */
            handleQuery() {
                this.queryParams.pageNum = 1;
                this.getList(false);
            },
            /*输入名称更改*/
            customerNameSearch(str, cb) {
                var _this = this;
                console.log("输入的字符串为:" + str);
                var list = _this.customerNameList;
                var result = str ? list.filter(_this.createFilter(str)) : list;
                // 调用 callback 返回建议列表的数据
                cb(result);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            customerNameSelect(item) {
                var _this = this;
                _this.queryParams.customerName = item.value;
            },
            async getCustomerNameList(data) {
                var _this = this;
                let mySet = [...new Set(data.map(obj => obj.customerName))]
                let myListData = mySet.map(lab => {
                    let liData = {};
                    liData.value = lab;
                    liData.lable = lab;
                    return liData
                });
                // _this.customerNameList = data.map(obj => obj.customerName);
                _this.customerNameList = myListData;
            },

            /**
             * @param {Object} row
             * @param {Object} from
             * 客户投诉
             */
            showSample(row, from) {
                var _this = this;
                _this.$confirm('样品情况是否已确认?', '样品确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _this.sampleData.orderNo = row.orderNo;
                    _this.sampleData.orderType = row.orderType;
                    sample(_this.sampleData).then(res => {
                        if (res.code === 200) {
                            row.sampleStatus = '已上传';
                            row.sampleStatusUser = _this.user.userName;
                            _this.$message({
                                showIcon: true,
                                type: 'success',
                                message: '样品已确认!'
                            });
                        } else {
                            _this.$message({
                                showIcon: true,
                                type: 'error',
                                message: res.message
                            });
                        }
                    }).catch(() => {
                        _this.$message({
                            showIcon: true,
                            type: 'error',
                            message: '确认失败!,请重新点击'
                        });
                    });
                }).catch((exception) => {
                    console.log(JSON.stringify(exception));
                    _this.$message({
                        showIcon: true,
                        type: 'warning',
                        message: '已取消'
                    });
                });
            },

            // 客户投诉
            showCustomerComplaints(row, from) {
                var _this = this;
                _this.$confirm('是否已上传客户投诉?', '投诉资料确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _this.customerComplaintsData.orderNo = row.orderNo;
                    _this.customerComplaintsData.orderType = row.orderType;
                    customerComplaints(_this.customerComplaintsData).then(res => {
                        if (res.code === 200) {
                            row.customerComplaints = '已上传';
                            row.customerComplaintsUser = _this.user.userName;
                            _this.$message({
                                showIcon: true,
                                type: 'success',
                                message: '客户投诉已确认!'
                            });
                        } else {
                            _this.$message({
                                showIcon: true,
                                type: 'error',
                                message: res.message
                            });
                        }
                    }).catch(() => {
                        _this.$message({
                            showIcon: true,
                            type: 'error',
                            message: '确认失败!,请重新点击'
                        });
                    });
                }).catch((exception) => {
                    console.log(JSON.stringify(exception));
                    _this.$message({
                        showIcon: true,
                        type: 'warning',
                        message: '已取消'
                    });
                });
            },
            // 展示配方变化
            showProductUpdate(row) {
                var _this = this;
                _this.tableLoading = true
                var orderNo = row.orderNo;
                _this.productUpdateTitle = '订单' + orderNo + '产品变化';
                // 拿出订单号去查询相应的配方变化
                _this.customerComplaintsData.orderNo = orderNo;
                _this.customerComplaintsData.orderType = row.orderType;
                getProductUpdate(this.customerComplaintsData).then(res => {
                    _this.productUpdateData = res.data;
                    _this.productUpdateVisible = true;
                    _this.tableLoading = false;
                }).catch(() => {
                    console.log("配方变化查询失败==========================================>")
                    _this.tableLoading = false;
                });
            },
            // 展示价格变化
            showPriceUpdate(row) {
                var _this = this;
                _this.tableLoading = true
                const orderNo = row.orderNo;
                _this.priceUpdateTitle = '订单' + orderNo + '价格变化';
                getPriceUpdate(orderNo).then(res => {
                    _this.priceUpdateData = res.data;
                    _this.priceUpdateVisible = true;
                    _this.tableLoading = false;
                }).catch(() => {
                    console.log("价格波动查询失败==========================================>")
                    _this.tableLoading = false;
                });
            },
            // 上传前校检格式和大小
            handleBeforeUpload(file) {
                // 校检文件大小
                if (this.fileSize) {
                    const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
                    const isLt = fileSizeMB < this.fileSize.default;
                    if (!isLt) {
                        this.$message.error(`上传文件大小为${fileSizeMB}MB,不能超过 ${this.fileSize.default} MB!`);
                        return false;
                    }
                }
                //打开遮罩
                this.tableLoading = true;
                return true;
            },
            handleUploadSuccess(row, response, file, fileList) {
                //关闭遮罩
                this.tableLoading = false;
                // 如果上传成功
                if (response.code == 200) {
                    // 返回的文件地址
                    this.orderInformUploadSuccessReq.orderNo = row.orderNo;
                    this.orderInformUploadSuccessReq.orderType = row.orderType;
                    this.orderInformUploadSuccessReq.informationUrl = JSON.stringify(response.data);
                    if (row.informationDetailCount === null || row.informationDetailCount === undefined) {
                        row.informationDetailCount = 1;
                    } else {
                        row.informationDetailCount++;
                    }
                    console.log("文件数量" + row.informationDetailCount);
                    uploadSuccess(this.orderInformUploadSuccessReq).then(res => {
                        this.$message({
                            showIcon: true,
                            type: 'success',
                            message: '上传成功!'
                        });
                    }).catch(() => {
                        this.$message({
                            showIcon: true,
                            type: 'error',
                            message: '资料上传失败,请重新上传!'
                        });
                    });
                } else {
                    this.$message.error("文件上传失败:" + response.msg);
                }
            },
            handleUploadError() {
                //关闭遮罩
                this.tableLoading = false;
                this.$message.error("文件上传失败");
            },
            // 根据订单状态获取表格样式
            tableRowClassName({
                row,
                rowIndex
            }) {
                if (row.orderStatus === 'ready') {
                    return 'success-row';
                }
            },
            showDownload(row) {
                return row.informationDetailCount > 0;
            },
            showDownloadTable(row) {
                var _this = this;
                _this.tableLoading = true
                const orderNo = row.orderNo;
                const orderType = row.orderType;
                _this.informationTitle = '订单' + orderNo + '的资料列表';
                getInformation(orderNo, orderType).then(res => {
                    _this.informationData = res.data;
                    _this.informationVisible = true;
                    _this.tableLoading = false;
                }).catch(() => {
                    console.log("订单资料查询失败==========================================>")
                    _this.tableLoading = false;
                });
            },
            downloadInform(row) {
                var _this = this;
                console.log("下载" + JSON.stringify(row));
                const fileName = row.originalFilename;
                const isShow = this.isShowFile(fileName);
                if (isShow) {
                    // 图片跳转另一个标签页打开测试
                    // window.open(row.url, '_blank');
                    window.open(_this.projectUrl + row.fileName, '_blank')
                } else {
                    // 非图片直接下载
                    // window.location.href = row.url
                    window.location.href = _this.projectUrl + row.fileName;
                }
            },
            isShowFile(fileName) {
                const type = [
                    ".jpeg", ".jpg", ".png", ".svg", ".gif", // 图片
                    ".html", ".htm", ".css", ".js", ".txt", //文本
                    ".pdf"
                ];
                const fileType = fileName.slice((fileName.lastIndexOf('.') - 2 >>> 0) + 2).toLowerCase();

                return type.includes(fileType);
            }
        }
    }
</script>
