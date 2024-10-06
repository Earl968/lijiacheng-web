<template>
    <div class="app-container">
        <el-row :gutter="23">
            <!--用户数据-->
            <el-col :span="24" :xs="24">
                <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="68px"
                         size="small"
                >
                    <el-form-item label="关键词">
                        <el-row class="demo-autocomplete">
                            <el-col :span="12">
                                <el-input v-model="queryParams.customText" placeholder="输入客户号或客户名"
                                          style="width: 210px;"
                                />
                            </el-col>
                        </el-row>
                    </el-form-item>

                    <el-form-item label="客户等级">
                        <el-select v-model="queryParams.customLevel" clearable placeholder="客户等级"
                                   style="width: 210px">
                            <el-option v-for="level in customLevels" :key="level.dbLevel" :label="level.level"
                                       :value="level.dbLevel"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="客户地区">
                        <el-select v-model="queryParams.customArea" clearable placeholder="客户地区"
                                   style="width: 210px">
                            <el-option v-for="area in customAreas" :key="area.dbCode" :label="area.area"
                                       :value="area.dbCode"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button icon="el-icon-search" size="mini" type="primary"
                                   @click="getCustomerList(true)">搜索
                        </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button icon="el-icon-search" size="mini" type="primary"
                                   @click="addCustom">新增
                        </el-button>
                    </el-form-item>
                </el-form>

                <!-- 新增订单 -->
                <el-dialog :title="addCustomTitle" :visible.sync="addCustomVisible" width="55%"
                           :close-on-click-modal="false"
                           @close="clearChild">
                    <!-- 动态组件 -->
                    <child-component :is="addCustomCom"
                                     :parentCustomAreas="customAreas"
                                     :parentCustomBanks="customBanks"
                                     :parentCustomLevels="customLevels"
                                     @form-cancel="handleSubmit"
                                     @form-submitted="handleSubmit"></child-component>
                </el-dialog>

                <el-table id="customTable" v-loading="customTableLoading" :data="customList"
                          element-loading-background="rgba(217, 217, 217, 0.8)"
                          element-loading-spinner="el-icon-loading"
                          element-loading-text="正在查询数据">
                    <el-table-column key="cusNo" align="center" label="编号" prop="cusNo"/>
                    <el-table-column key="snm" align="center" label="简称" prop="snm"/>
                    <el-table-column key="objId" align="center" label="客户类别" prop="objId">
                        <template slot-scope="scope">{{ getCustomType(scope.row.objId) }}</template>
                    </el-table-column>
                    <el-table-column key="cusAre" align="center" label="区域" prop="cusAre">
                        <template slot-scope="scope">{{ getCustomArea(scope.row.cusAre) }}</template>
                    </el-table-column>
                    <el-table-column key="bosNm" align="center" label="负责人员" prop="bosNm"/>
                    <el-table-column key="cntMan1" align="center" label="联络人1" prop="cntMan1"/>
                    <el-table-column key="cntMan2" align="center" label="联络人2" prop="cntMan2"/>
                    <el-table-column key="accMan" align="center" label="会计" prop="accMan"/>
                    <el-table-column key="tel1" align="center" label="电话1" prop="tel1"/>
                    <el-table-column key="tel2" align="center" label="电话2" prop="tel2"/>
                    <el-table-column key="uniNo" align="center" label="统一编码" prop="uniNo"/>
                    <el-table-column key="cusLevel" align="center" label="客户等级" prop="cusLevel">
                        <template slot-scope="scope">{{ getCustomLevel(scope.row.cusLevel) }}</template>
                    </el-table-column>
                    <el-table-column key="fax" align="center" label="传真机" prop="fax"/>
                    <el-table-column key="nszgFlag" align="center" label="纳税资格" prop="nszgFlag"/>
                    <el-table-column key="nsrCode" align="center" label="纳税人识别号" prop="nsrCode"/>
                    <el-table-column key="bizDsc" align="center" label="行业别" prop="bizDsc"/>
                    <el-table-column key="invId" align="center" label="发票类型" prop="invId"/>
                    <el-table-column key="fpName" align="center" label="发票名称" prop="fpName"/>
                    <el-table-column key="adr1" align="center" label="发票地址" prop="adr1"/>
                    <el-table-column key="adr2" align="center" label="公司地址" prop="adr2"/>
                    <el-table-column key="zip" align="center" label="邮政编码" prop="zip"/>
                    <el-table-column key="strDd" align="center" label="起始往来" prop="strDd"/>
                    <el-table-column key="rtoTax" align="center" label="客户税率" prop="rtoTax"/>
                    <el-table-column key="dep1" align="center" label="集团分公司" prop="dep1"/>
                    <el-table-column key="chkKd" align="center" label="是否快递商" prop="chkKd"/>
                    <el-table-column key="dep" align="center" label="单部门" prop="dep"/>
                    <el-table-column key="deproNo" align="center" label="部门群组" prop="deproNo"/>
                    <el-table-column key="rem" align="center" label="备注" prop="rem"/>
                </el-table>

                <pagination v-show="total>0" :limit.sync="queryParams.pageSize" :page.sync="queryParams.pageNum"
                            :total="total" @pagination="getCustomerList(false)"/>
            </el-col>
        </el-row>
    </div>
</template>
<style>

</style>

<script>
import {getArea, getBanks, getCustom, getLevel} from '@/api/admin/erp/custom'
import addForm from './add.vue'

export default {
    name: 'custom',
    data() {
        return {
            // 是否显示文件上传列表
            showUploadFileList: false,
            // 遮罩层
            customTableLoading: false,
            // 显示搜索条件
            showSearch: true,
            // 数据总条数
            total: 0,
            addCustomVisible: false,
            // 新增窗口弹出标题
            addCustomTitle: '新增客户',
            // 新增窗口调用组件
            addCustomCom: null,
            // 搜索条件
            queryParams: {
                customText: '',
                customLevel: '',
                customArea: '',
                pageNum: 1,
                pageSize: 10,
            },
            customLevels: [{
                code: "",
                level: "",
                dbLevel: ""
            }],
            customAreas: [{
                code: "",
                area: "",
                dbCode: ""
            }],
            customBanks: [{}],
            customList: [],
        }
    },
    created() {
        let _this = this
        _this.getCustomLevels();
        _this.getCustomAreas();
        _this.getCustomerList(true);
        _this.getCustomBanks();
    },
    methods: {
        getCustomLevels() {
            let _this = this
            getLevel().then(resp => {
                _this.customLevels = resp.data;
                console.log(JSON.stringify(_this.customLevels));
            })
        },
        getCustomLevel(level) {
            let _this = this
            for (let i = 0; i < _this.customLevels.length; i++) {
                if (_this.customLevels[i].dbLevel == level) {
                    return _this.customLevels[i].level;
                }
            }
            return level;
        },
        getCustomAreas() {
            let _this = this
            getArea().then(resp => {
                _this.customAreas = resp.data;
                console.log(JSON.stringify(_this.customAreas));
            })
        },
        getCustomArea(area) {
            let _this = this
            for (let i = 0; i < _this.customAreas.length; i++) {
                if (_this.customAreas[i].dbCode == area) {
                    return _this.customAreas[i].area;
                }
            }
            return area;
        },
        getCustomBanks() {
            let _this = this
            getBanks().then(resp => {
                _this.customBanks = resp.data;
                console.log(JSON.stringify(_this.customBanks));
            })
        },
        getCustomerList(isFirst) {
            let _this = this;
            if (isFirst) {
                _this.queryParams.pageNum = 1;
            }
            _this.customTableLoading = true;
            getCustom(_this.queryParams).then(resp => {
                // console.log(JSON.stringify(resp));
                _this.total = resp.data.total;
                _this.customList = resp.data.list;
                _this.customTableLoading = false;
            }).catch(() => {
                _this.customTableLoading = false;
            })

        },
        getCustomType(type) {
            if (type == '1') {
                return '客户';
            } else if (type == '2') {
                return '厂商';
            } else if (type == '3') {
                return '客户/厂商';
            } else if (type == '4') {
                return '会员客户';
            }
        },
        handleSubmit() {
            console.log("提交数据了")
            let _this = this;
            _this.addCustomVisible = false;
            _this.clearChild();
        },
        addCustom() {
            let _this = this;
            _this.addCustomVisible = true;
            _this.addCustomCom = addForm;
        },
        clearChild() {
            let _this = this;
            _this.addCustomCom = null;
        },
    },
}
</script>
