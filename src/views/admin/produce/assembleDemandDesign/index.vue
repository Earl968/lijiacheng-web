<template>
    <div class="app-container">
        <el-row :gutter="24">
            <el-col :span="24" :xs="24">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="批号">
                        <el-input v-model="batnoNumber" placeholder="订单号"></el-input>
                    </el-form-item>

                    <el-form-item label="期望预交日">
                        <div class="block">
                            <el-date-picker v-model="selectDate" type="daterange" align="right" unlink-panels
                                range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                :picker-options="pickerOptions" value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="OnQueryAssembleDemandDesign">查询</el-button>
                        <el-button type="primary" @click="Onclear">清空</el-button>
                    </el-form-item>
                </el-form>

                <div class="table-container">
                    <el-button plain class="table-toolbar-button" @click="exportToExcel"
                        v-if="isDownLoad">下载内容</el-button>
                    <el-table :data="AssembleDemandDesignList" ref="table" border v-loading="tableLoading"
                        element-loading-text="正在查询数据" element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(217, 217, 217, 0.8)" @row-click="OnUpdate">

                        <el-table-column label="计划开工日期" prop="planStartDate">
                            <template slot-scope="scope"> {{ formatDate(scope.row.planStartDate) }}</template>
                        </el-table-column>
                        <el-table-column label="拉线" prop="pullLine"> </el-table-column>
                        <el-table-column label="释放状态" prop="releaseStatus"> </el-table-column>
                        <el-table-column label="评审日期" prop="reviewDate">
                            <template slot-scope="scope"> {{ formatDate(scope.row.reviewDate) }}</template>
                        </el-table-column>
                        <el-table-column label="期望预交日" prop="expectedPrepaymentDate">
                            <template slot-scope="scope"> {{ formatDate(scope.row.expectedPrepaymentDate) }}</template>
                        </el-table-column>
                        <el-table-column label="评审交期" prop="reviewDeliveryDate">
                            <template slot-scope="scope"> {{ formatDate(scope.row.reviewDeliveryDate) }}</template>
                        </el-table-column>
                        <el-table-column label="批号" prop="batchNumber" width="120"></el-table-column>
                        <el-table-column label="品号" prop="productNumber" width="120"></el-table-column>
                        <el-table-column label="货品规格" prop="productSpecification">
                            <template slot-scope="scope">
                                <div class="item__nowrap" :title="scope.row.productSpecification">{{ scope.row.productSpecification }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="单据类别名称" prop="documentCategoryName"></el-table-column>
                        <el-table-column label="受订数量" prop="orderedQuantity"></el-table-column>
                        <el-table-column label="已缴库数量" prop="storedQuantity"></el-table-column>
                        <el-table-column label="未缴库数量" prop="unstoredQuantity">
                            <template slot-scope="scope">
                                {{ scope.row.orderedQuantity - scope.row.storedQuantity }}</template>
                        </el-table-column>
                        <el-table-column label="中类名称" prop="middleCategoryName"></el-table-column>
                        <el-table-column label="制单人名称" prop="creatorName"></el-table-column>
                        <el-table-column label="客户简称" prop="customerAbbreviation">
                            <template slot-scope="scope">
                                <div class="item__nowrap" :title="scope.row.customerAbbreviation">{{ scope.row.customerAbbreviation }}</div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <!-- 修改数据 -->
                <el-dialog :visible.sync="showCoseDetail"  width="30%">
                    <el-form ref="form" :model="item" label-width="160px">
                        <el-form-item label="计划开工日期">
                            <el-date-picker v-model="item.planStartDate" type="date" placeholder="选择日期"
                                value-format="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>

                        <el-form-item label="拉线">
                            <el-select v-model="item.pullLine" placeholder="请选择">
                                <el-option label="1线、2线" value="1线、2线"></el-option>
                                <el-option label="2线" value="2线"></el-option>
                                <el-option label="3线" value="3线"></el-option>
                                <el-option label="4线" value="4线"></el-option>
                                <el-option label="5线" value="5线"></el-option>
                                <el-option label="6线" value="6线"></el-option>
                                <el-option label="7线" value="7线"></el-option>
                                <el-option label="9线" value="9线"></el-option>
                                <el-option label="10线" value="10线"></el-option>
                                <el-option label="安徽1线" value="安徽1线"></el-option>
                                <el-option label="花山1线" value="花山1线"></el-option>
                                <el-option label="嘉兴利嘉城" value="嘉兴利嘉城"></el-option>
                                <el-option label="泰国1线" value="泰国1线"></el-option>
                                <el-option label="泰国2线" value="泰国2线"></el-option>
                                <el-option label="泰国3线" value="泰国3线"></el-option>
                                <el-option label="泰国4线" value="泰国4线"></el-option>
                                <el-option label="泰国5线" value="泰国5线"></el-option>
                                <el-option label="泰国6线" value="泰国6线"></el-option>
                                <el-option label="泰国7线" value="泰国7线"></el-option>
                                <el-option label="新订单试产线" value="新订单试产线"></el-option>
                                <el-option label="鑫程" value="鑫程"></el-option>
                                <el-option label="自动化1线" value="自动化1线"></el-option>

                            </el-select>
                        </el-form-item>

                        <el-form-item label="释放状态">
                            <el-select v-model="item.releaseStatus" placeholder="请选择活动区域">
                                <el-option label="已释放" value="已释放"></el-option>
                                <el-option label="未释放" value="未释放"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">修改</el-button>
                            <el-button @click="showCoseDetail = false">>取消</el-button>
                        </el-form-item>
                    </el-form>
                </el-dialog>

            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {
        Icon,
        Loading
    } from "element-ui";

    import {
        getAssembleDemandDesigns,
        modifyAssembleDemandDesigns
    } from "@/api/admin/produce/assembleDemandDesign"


    import ExcelUploadParser from '@/components/ExcelUploadParser';
    import * as XLSX from 'xlsx';

    export default {
        components: {
            ExcelUploadParser
        },
        data() {
            return {
                //批号
                batnoNumber: '',
                //日期选择值
                selectDate: '',
                //表格数据
                AssembleDemandDesignList: [],
                //修改数据
                item: {},
                //表格加载动画
                tableLoading: false,
                //控制明细表格显示
                showCoseDetail: false,
                //日期选择范围
                pickerOptions: {},
                //是否可以下载
                isDownLoad:false,
            }
        },
        created() {
            const formatDate = (date) => {
                return date.toISOString().split('T')[0];
            };

            this.pickerOptions = {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [formatDate(start), formatDate(end)]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [formatDate(start), formatDate(end)]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [formatDate(start), formatDate(end)]);
                    }
                }]
            }
        },
        methods: {
            //清空输入选项
            Onclear() {
                this.batnoNumber = '';
                this.selectDate = '';
            },
            //选择行号之后点击查询，查询订单信息
            OnQueryAssembleDemandDesign() {
                if (this.batnoNumber.length > 0) {
                    this.tableLoading = true;
                    getAssembleDemandDesigns({
                            batchNumber: this.batnoNumber
                        })
                        .then(response => {
                            this.AssembleDemandDesignList = response.data;
                            this.isDownLoad = true;
                            this.tableLoading = false;
                        })
                        .catch(() => {
                            this.tableLoading = false;
                        })
                    return;
                }

                if (this.selectDate.length > 0) {
                    this.tableLoading = true;
                    getAssembleDemandDesigns({
                            startDate: this.selectDate[0],
                            endDate: this.selectDate[1]
                        })
                        .then(response => {
                            this.AssembleDemandDesignList = response.data;
                            this.isDownLoad = true;
                            this.tableLoading = false;
                        })
                        .catch(() => {
                            this.tableLoading = false;
                        })
                    return;
                }
            },
            OnUpdate(row, column, event){
                this.item=row;
                this.showCoseDetail=true;
            },
            onSubmit(){
                modifyAssembleDemandDesigns(this.item)
                    .then(response => {
                        this.showCoseDetail=false;
                        OnQueryAssembleDemandDesign();
                    })
            },
            //格式化日期
            formatDate(cellValue) {
                if (!cellValue) return '';
                const date = new Date(cellValue);
                const year = date.getFullYear();
                const month = ('0' + (date.getMonth() + 1)).slice(-2);
                const day = ('0' + date.getDate()).slice(-2);
                return `${year}-${month}-${day}`;
            },

            //下载数据
            exportToExcel() {
                this.$nextTick(() => {

                    const table = this.$refs.table.$el.querySelector('.el-table__body-wrapper table');
                    if (table) {
                        // 创建新的table元素
                        var print_table_dom = document.createElement('table')
                        // copy一份thead
                        var print_table_dom_thead = this.$refs.table.$el.querySelector(
                            '.el-table__header-wrapper table').cloneNode(true)
                        // copy一份tbody
                        var print_table_body = this.$refs.table.$el.querySelector(
                            '.el-table__body-wrapper table').cloneNode(true)
                        // 将thead和tbody添加到 目标table中
                        print_table_dom.appendChild(print_table_dom_thead)
                        print_table_dom.appendChild(print_table_body)
                        // 生成 book
                        const new_sheet = XLSX.utils.table_to_book(print_table_dom)
                        // 导出excel
                        XLSX.writeFile(new_sheet, '数据导出.xlsx')
                    } else {
                        console.error('表格没有数据！');
                    }
                });
            }
        }
    }
</script>

<style>
    .item__nowrap {
        white-space: nowrap;
        /* 防止文本换行 */
        overflow: hidden;
        /* 隐藏溢出的内容 */
        text-overflow: ellipsis;
        /* 显示省略号 */
    }
</style>
