<template>
    <div class="app-container">
        <el-row :gutter="23">
            <!--用户数据-->
            <el-col :span="24" :xs="24">
                <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="68px"
                         size="small"
                >
                    <!--    目前只有一个比率,暂时不需要新增    -->
                    <!-- <el-form-item>
                                            <el-button icon="el-icon-search" size="mini" type="primary"
                                                       @click="toPut('add',null)">新增
                                            </el-button>
                                        </el-form-item>-->
                    <el-form-item>
                        <el-button icon="el-icon-search" size="mini" type="primary"
                                   @click="getRateList(true)">搜索
                        </el-button>
                    </el-form-item>
                </el-form>

                <!-- 汇率表单 -->
                <el-dialog :title="putTitle" :visible.sync="rateUpdateVisible" width="50%">
                    <el-form ref="form" :model="putForm" label-width="80px">
                        <el-form-item label="分类">
                            <el-select v-model="putForm.type" :disabled="rateUpdateType===false" placeholder="请选择">
                                <el-option label="人民币兑美元" value="cny_to_usd"/>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="汇率">
                            <el-input v-model="putForm.value" @input="handleInputRateValue"/>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">立即创建</el-button>
                            <el-button @click="noSubmit">取消</el-button>
                        </el-form-item>
                    </el-form>
                </el-dialog>

                <el-table id="customTable" v-loading="rateListLoading" :data="exchangeList"
                          element-loading-background="rgba(217, 217, 217, 0.8)"
                          element-loading-spinner="el-icon-loading"
                          element-loading-text="正在查询数据">
                    <!--                    <el-table-column key="id" align="center" label="唯一标识" prop="id"/>-->
                    <el-table-column key="type" align="center" label="类型" prop="type"/>
                    <el-table-column key="value" align="center" label="汇率" prop="value"/>
                    <el-table-column key="name" align="center" label="备注" prop="name"/>
                    <el-table-column key="createTime" align="center" label="创建时间" prop="createTime"/>
                    <el-table-column align="center" label="修改">
                        <template slot-scope="scope">
                            <el-button size="small" type="primary" @click="toPut('update',scope.row)">修改</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <pagination v-show="total>0" :limit.sync="queryParams.pageSize" :page-sizes="[10,15,20]"
                            :page.sync="queryParams.pageNum"
                            :total="total" @pagination="getRateList(false)"/>
            </el-col>
        </el-row>
    </div>
</template>

<style lang="scss" scoped>

</style>
<script>
import {rateList, save} from "@/api/admin/rate/rate";

export default {
    name: "rate",
    data() {
        return {
            // 显示搜索条件
            showSearch: true,
            // 数据总条数
            total: 0,
            // 遮罩层是否显示
            rateListLoading: false,
            // 弹窗表头
            putTitle: '',
            // 汇率更改窗口显示
            rateUpdateVisible: false,
            rateUpdateType: false,
            queryParams: {
                pageNum: 1,
                pageSize: 20,
            },
            exchangeList: [
                // {
                //     id: 0,
                //     type: '',
                //     value: '',
                //     createTime: '',
                // }
            ],
            putForm: {
                id: 0,
                type: 'cny_to_usd',
                value: '',
                createTime: '',
            },
        }
    },
    created() {
        let _this = this;
        _this.getRateList(true);
    },
    methods: {
        getRateList(isFirst) {
            let _this = this;
            if (isFirst) {
                _this.queryParams.pageNum = 1;
            }
            _this.rateListLoading = true;
            rateList(_this.queryParams).then(resp => {
                _this.total = resp.data.total;
                _this.exchangeList = resp.data.list;
                _this.rateListLoading = false;
            }).catch(() => {
                _this.rateListLoading = false;
            })
        },
        toPut(type, row) {
            let _this = this;
            if (type === 'add') {
                _this.putTitle = '添加数据';
                _this.rateUpdateType = true;
                _this.putForm = {};
            } else if ('update') {
                _this.putTitle = '修改数据';
                _this.rateUpdateType = false;
                _this.putForm = row;
            }
            _this.rateUpdateVisible = true;
        },
        onSubmit() {
            let  _this = this;
            save(_this.putForm).then(res => {
                alert("维护成功");
                _this.getRateList(true);
            }).catch(() => {
                alert("维护失败");
            });
            _this.noSubmit();
        },
        noSubmit() {
            let _this = this;
            _this.rateUpdateVisible = false;
        },
        handleInputRateValue(value) {
            // console.log(value);
            // // 匹配整数或小数（可选的小数点和小数部分）
            // // const regex = /^\d*(\.\d+)?$/;
            // // this.putForm.value = value.match(regex) ? value : this.putForm.value.slice(0, -1);
            //
            // // 更新 inputValue（v-model 会自动处理）
            // this.putForm.value = value;
            // // 验证输入（可以在需要的时候进行，比如表单提交时）
            // // 这里只是演示，可以在控制台打印或显示错误消息
            // const isValid = /^\d*(\.\d+)?$/.test(this.putForm.value);
            // if (!isValid) {
            //     console.error('输入无效！');
            //     // 可以在这里显示错误消息给用户
            // }
        }
    }
}
</script>
