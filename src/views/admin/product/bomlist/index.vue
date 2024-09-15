<template>
    <div class="app-container">
        <el-row :gutter="23">
            <!--用户数据-->
            <el-col :span="24" :xs="24">
                <!-- 查询条件 -->
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="料号">
                        <el-input v-model="partno" placeholder="料号"></el-input>
                    </el-form-item>
                    <el-form-item label="客户">
                        <el-select v-model="custName" filterable placeholder="请选择">
                            <el-option v-for="item in custNames" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onQuery">查询</el-button>
                        <el-button type="primary" @click="Onclear">清空</el-button>
                    </el-form-item>
                </el-form>
                <!-- 导出按钮 -->
                <el-button @click="exportTable">导出表格</el-button>
                <!-- BOM表格信息 -->
                <el-table :data="bomDateTable" border v-loading="tableLoading" element-loading-text="正在查询数据"
                    element-loading-spinner="el-icon-loading" element-loading-background="rgba(217, 217, 217, 0.8)">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-table :data="props.row.lowLevel" style="width: 100%;margin-bottom: 20px;"
                                :row-key="getRowKey" border default-expand-all
                                :tree-props="{children: 'lowLevel', hasChildren: 'hasChildren'}"
                                :row-class-name="rowClassName">
                                <el-table-column label="子件料号" prop="prdNo"></el-table-column>
                                <el-table-column label="子件名称" prop="spc"></el-table-column>
                                <el-table-column label="用量" prop="qty"></el-table-column>
                            </el-table>
                            <!-- <expandColmun :items="props.row.lowLevel"></expandColmun> -->
                        </template>
                    </el-table-column>
                    <el-table-column label="客户" prop="custName"> </el-table-column>
                    <el-table-column label="品号" prop="orderNo"></el-table-column>
                    <el-table-column label="货品规格" prop="orderDesc">
                        <template slot-scope="scope">
                            <div class="ellipsis" :title="scope.row.orderDesc">{{ scope.row.orderDesc }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="品名" prop="orderName"> </el-table-column>
                    <el-table-column label="电源板料号" prop="pPcbaNo"></el-table-column>
                    <el-table-column label="电源板名称" prop="pPcbsDesc">
                        <template slot-scope="scope">
                            <div class="ellipsis" :title="scope.row.pPcbsDesc">{{ scope.row.pPcbsDesc }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="光源板料号" prop="lPcbsNo"></el-table-column>
                    <el-table-column label="光源板型号" prop="lPcbaDesc">
                        <template slot-scope="scope">
                            <div class="ellipsis" :title="scope.row.lPcbaDesc">{{ scope.row.lPcbaDesc }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="子件料号" prop="subItem">
                        <template slot-scope="scope">
                            <div class="ellipsis" :title="scope.row.subItem"
                                @dblclick="handleRowDblClick(scope.row.subItem)">{{ scope.row.subItem }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="子件名称" prop="subName">
                        <template slot-scope="scope">
                            <div class="ellipsis" :title="scope.row.subName">{{ scope.row.subName }}</div>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 录入工时信息 -->
                <el-dialog title="工时录入" :visible.sync="manHourEnterVisible">
                    <el-form  v-for="productManHour in productManHours" :key="productManHour.id" class="demo-form-inline">
                        <el-col :span="12">
                            <el-form-item label="子件料号">
                                <el-input v-model="productManHour.partno" placeholder="料号" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="工时">
                                <el-input v-model="productManHour.manhour" placeholder="工时"></el-input>
                            </el-form-item>
                       </el-col>
                        <el-col :span="24">
                            <el-form-item label="子件名称" prop="desc">
                                <el-input type="textarea" v-model="productManHour.partname"  :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <hr/>
                    </el-form>

                    <span slot="footer" class="dialog-footer">
                        <el-button @click="manHourEnterVisible = false">取 消</el-button>
                        <el-button type="primary" @click="modifyManHour()">确 定</el-button>
                    </span>
                </el-dialog>
            </el-col>
        </el-row>
    </div>
</template>

<style>
    .demo-table-expand {
        font-size: 0;
    }

    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }

    .expandable-row {
        background-color: lightblue !important;
        /* 可展开行的颜色 */
    }

    .el-table .cell {
        white-space: pre-wrap;
        /* 保留空白符序列，但是正常地进行换行 */
    }

    .ellipsis {
        white-space: nowrap;
        /* 防止文本换行 */
        overflow: hidden;
        /* 隐藏溢出的内容 */
        text-overflow: ellipsis;
        /* 显示省略号 */
    }
</style>

<script>
    import {
        Icon,
        Loading
    } from "element-ui";
    import {
        GetBomQuery,
        DownLoadBom,
        getCustNames,
        GetManHoursByPartno,
        ModifyManHours
    } from "@/api/admin/product/bomlist"

    export default {
        data() {
            return {
                //表格数据
                bomDateTable: [],
                partno: '',
                //表格加载动画
                tableLoading: false,
                //项目路径
                projectUrl: '',
                //查询条件-客户名称
                custName: '',
                //客户名称列表
                custNames: [],
                //弹出层--工时录入
                manHourEnterVisible: false,
                //控制隐藏列
                formHidden:true,
                //表单数据
                productManHours: []
            }
        },
        created() {
            this.projectUrl = process.env.VUE_APP_API_BASE_URL;
            this.loadCustName();
        },
        methods: {
            //查询BOM数据
            loadBomDate(params) {
                this.tableLoading = true;
                GetBomQuery(params)
                    .then(response => {
                        if (response.data != null) {
                            this.bomDateTable = response.data;
                        } else {
                            this.$message.error("未查询到对应BOM信息！！");
                        }
                        this.tableLoading = false;
                    })
                    .catch(() => {
                        this.tableLoading = false;
                    })
            },
            //加载客户信息
            loadCustName() {
                getCustNames().then(response => {
                    this.custNames = response.data;
                })
            },
            //点击查询按钮
            onQuery() {
                this.bomDateTable = []
                if (this.partno && this.partno.trim()) {
                    // 字符串不为空
                    this.loadBomDate({
                        parNo: this.partno
                    });
                } else if (this.custName && this.custName.trim()) {
                    this.loadBomDate({
                        custName: this.custName
                    });
                } else {
                    this.$message.error("请输入料号或者客户名称！！");
                }
            },
            //清空查询条件
            Onclear() {
                this.custName = '';
                this.partno = '';
            },
            //组合下层节点条件
            getRowKey(row) {
                return `${row.bomNo}-${row.prdNo}-${row.idNo}`;
            },
            //半成品条目显示指定颜色
            rowClassName({row}) {
                // 检查行是否有子节点，如果有，则应用一个类名
                if (row.lowLevel.length > 0) {
                    return 'expandable-row';
                }
                return '';
            },
            //导出按钮
            exportTable() {
                window.location.href = this.projectUrl
                    + '/admin/erp/bomlist/downLoadBoms?parNo='
                    + this.partno +'&custName='
                    + this.custName;
            },
            //双击录入工时信息
            handleRowDblClick(partno) {
                const partNos = partno.split('\r\n');
                GetManHoursByPartno(partNos)
                    .then(response => {
                        if (response.data != null) {
                            this.productManHours = response.data;
                            console.log(this.productManHours);
                            this.manHourEnterVisible=true;
                        }
                    })
            },
            //修改工时
            modifyManHour(){
                // console.log(this.productManHours);
                ModifyManHours(this.productManHours)
                    .then(response => {
                        if (response.code==200) {
                            this.onQuery();
                        }
                        this.manHourEnterVisible = false
                    })
                    .catch(() => {
                        this.manHourEnterVisible = false;
                    })
            }
        }
    }
</script>
