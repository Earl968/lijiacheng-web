<template>
    <div class="app-container">
        <el-row :gutter="23">
            <!--用户数据-->
            <el-col :span="24" :xs="24">
                <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="68px"
                         size="small"
                >
                    <el-form-item label="数据类型">
                        <el-select v-model="queryParams.dataType" clearable placeholder="类型"
                                   style="width: 210px">
                            <el-option label="预警" value="yj"/>
                            <el-option label="普通" value="pt"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="品号">
                        <el-row class="demo-autocomplete">
                            <el-col :span="12">
                                <el-input v-model="queryParams.prdNo" placeholder="品号"
                                          style="width: 210px;"
                                />
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item>
                        <el-button icon="el-icon-search" size="mini" type="primary"
                                   @click="getList(true)">搜索
                        </el-button>
                    </el-form-item>
                </el-form>

                <!-- 修改最小库存量 -->
                <el-dialog :close-on-click-modal="false" :title="prdtUpdateTitle" :visible.sync="prdtUpdateVisible"
                           width="30%">
                    <el-form ref="form" :model="prdtUpdateForm" label-width="80px">
                        <el-form-item label="最小包装量">
                            <el-input v-model="prdtUpdateForm.qty_low"/>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">立即创建</el-button>
                            <el-button @click="noSubmit">取消</el-button>
                        </el-form-item>
                    </el-form>
                </el-dialog>

                <el-table id="customTable" v-loading="prdtUpdateLoading" :data="dataList"
                          element-loading-background="rgba(217, 217, 217, 0.8)"
                          element-loading-spinner="el-icon-loading"
                          element-loading-text="正在查询数据"
                          @row-dblclick="showUpdate">
                    <el-table-column key="idx1" align="center" label="中类代号" prop="idx1"/>
                    <el-table-column key="typeName" align="center" label="中类名称" prop="typeName"/>
                    <el-table-column key="prd_no" align="center" label="品号" prop="prd_no"/>
                    <el-table-column key="name" align="center" label="品名" prop="name"/>
                    <el-table-column key="qty_low" align="center" class-name="qty_low" label="最小包装量(双击修改)"
                                     prop="qty_low"/>
                    <!--                    <el-table-column label="最小包装量" class-name="qty_low">
                                            <template slot-scope="scope">
                                                {{scope.row.qty_low}}
                                            </template>
                                        </el-table-column>-->
                    <el-table-column key="gg" align="center" label="规格" prop="gg"/>
                </el-table>

                <pagination v-show="total>0" :limit.sync="queryParams.pageSize" :page.sync="queryParams.pageNum"
                            :total="total" @pagination="getList(false)"/>
            </el-col>
        </el-row>
    </div>
</template>
<style>

</style>

<script>

import {getList, updateQtyLow} from "@/api/admin/erp/prdt";

export default {
    name: 'prdt',
    data() {
        return {
            // 遮罩层
            prdtUpdateLoading: false,
            // 显示搜索条件
            showSearch: true,
            // 数据总条数
            total: 0,
            prdtUpdateVisible: false,
            // 修改窗口弹出标题
            prdtUpdateTitle: '修改最小包装量',
            // 搜索条件
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                dataType: 'yj',
                prdNo: ''
            },
            dataList: [],
            beforeQtyLow: 0,
            prdtUpdateForm: {},
        }
    },
    created() {
        let _this = this
        _this.getList(true);
    },
    methods: {
        getList(isFirst) {
            let _this = this;
            if (isFirst) {
                _this.queryParams.pageNum = 1;
            }
            _this.prdtUpdateLoading = true;
            getList(_this.queryParams).then(resp => {
                _this.total = resp.data.total;
                _this.dataList = resp.data.list;
                _this.prdtUpdateLoading = false;
            }).catch(() => {
                _this.prdtUpdateLoading = false;
            })

        },
        showUpdate(row, column, event) {
            const targetElement = event.target;
            if (targetElement.closest('.qty_low')) {
                // 在这里添加你的双击事件处理逻辑（针对最小包装量）
                let _this = this;
                _this.prdtUpdateVisible = true;
                _this.prdtUpdateForm = row;
                _this.beforeQtyLow = row.qty_low;
                _this.prdtUpdateTitle = '修改' + row.prd_no + '最小包装量';
            }
        },
        onSubmit() {
            if (this.beforeQtyLow === this.prdtUpdateForm.qty_low) {
                this.$message({
                    type: 'info',
                    message: '数量未修改'
                });
                this.prdtUpdateVisible = false
                return;
            }
            this.$confirm('确定将' + this.prdtUpdateForm.prd_no + '的最小包装数量由' + this.beforeQtyLow +
                '改为' + this.prdtUpdateForm.qty_low, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    center: true,
                    type: 'warning'
                }
            ).then(() => {
                console.log("确认修改数量")
                updateQtyLow(this.prdtUpdateForm.prd_no, this.prdtUpdateForm.qty_low).then(resp => {
                    this.$message({
                        type: 'success',
                        message: '修改成功'
                    });
                    this.getList(false);
                }).catch(() => {
                    this.$message({
                        type: 'error',
                        message: '修改失败'
                    });
                    this.getList(false);
                })
                this.prdtUpdateVisible = false
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已撤销修改'
                });
            });
        },
        noSubmit() {
            this.$message({
                type: 'info',
                message: '已取消'
            });
            this.prdtUpdateVisible = false
        },
    },
}
</script>
