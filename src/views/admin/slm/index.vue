<template>
    <el-row :gutter="23">
        <el-col :span="24" :xs="24">
            <el-form ref="queryForm" :inline="true" :model="queryParams" label-width="68px"
                     size="small"
            >
                <el-form-item label="仓库">
                    <el-select v-model="queryParams.storeId" clearable placeholder="仓库"
                               style="width: 210px">
                        <el-option label="合肥仓" value="S20241204001"/>
                        <el-option label="美国仓" value="S20241204002"/>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-date-picker
                        v-model="queryParams.month"
                        format="yyyy-MM"
                        placeholder="选择月份"
                        type="month"
                        value-format="yyyy-MM"
                        @change="handleMonthChange">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button icon="el-icon-search" size="mini" type="primary"
                               @click="getData">搜索
                    </el-button>
                </el-form-item>
                <el-form-item>
                    <el-button icon="el-icon-document-add" size="mini"
                               @click="showUpdate">出入库操作
                    </el-button>
                </el-form-item>
            </el-form>

            <el-dialog :close-on-click-modal="false" :visible.sync="slmUpdateVisible" title="出入库操作"
                       width="60%">
                <el-form ref="form" :model="slmUpdateForm" label-width="80px"
                         size="mini">
                    <!--出入库类型-->
                    <el-form-item label="操作">
                        <el-select v-model="slmUpdateForm.operationType" clearable placeholder="出入库类型"
                                   @change="changeOperationType">
                            <el-option label="入库" value="INBOUND"/>
                            <el-option label="出库" value="OUTBOUND"/>
                            <el-option label="调拨" value="TRANSFER"/>
                        </el-select>
                    </el-form-item>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="日期">
                                <el-input v-model="slmUpdateForm.date" disabled/>
                            </el-form-item>
                        </el-col>
                        <el-col
                            v-if="slmUpdateForm.operationType==='OUTBOUND'||slmUpdateForm.operationType==='TRANSFER'"
                            :span="6">
                            <el-form-item label="出库单位">
                                <el-select v-model="slmUpdateForm.outboundCode" clearable
                                           @change="changeBound('OUTBOUND')">
                                    <el-option label="合肥仓" value="S20241204001"/>
                                    <el-option label="美国仓" value="S20241204002"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col v-if="slmUpdateForm.operationType==='INBOUND'||slmUpdateForm.operationType==='TRANSFER'"
                                :span="6">
                            <el-form-item label="入库单位">
                                <el-select v-model="slmUpdateForm.inboundCode" clearable
                                           @change="changeBound('INBOUND')">
                                    <el-option label="合肥仓" value="S20241204001"/>
                                    <el-option label="美国仓" value="S20241204002"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="流水号">
                                <el-input v-model="slmUpdateForm.documentNo" disabled/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="币种">
                                <el-select v-model="slmUpdateForm.currency">
                                    <el-option label="人民币" value="CNY"/>
                                    <el-option label="美元" value="USD"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="汇率">
                                <el-input v-model="slmUpdateForm.exchangeRate" disabled/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="3">
                            <el-button icon="el-icon-document-add"
                                       @click="addDetail">新增明细
                            </el-button>
                        </el-col>
                    </el-row>
                    <!-- 表头 -->
                    <el-row v-if="slmUpdateForm.details.length>0">
                        <el-col :span="4" class="detail-title">
                            <span>批号</span>
                        </el-col>
                        <el-col :span="4" class="detail-title">
                            <span>物料号</span>
                        </el-col>
                        <el-col :span="4" class="detail-title">
                            <span>货品名称-规格型号</span>
                        </el-col>
                        <el-col :span="2" class="detail-title">
                            <span>数量</span>
                        </el-col>
                        <el-col :span="2" class="detail-title">
                            <span>单价（含税）</span>
                        </el-col>
                        <el-col :span="2" class="detail-title">
                            <span>单价（不含税）</span>
                        </el-col>
                        <el-col :span="3" class="detail-title">
                            <span>金额（含税）</span>
                        </el-col>
                        <el-col :span="3" class="detail-title">
                            <span>金额（不含税）</span>
                        </el-col>
                    </el-row>
                    <el-row v-for="detail in slmUpdateForm.details" :key="detail.id">
                        <el-col :span="4">
                            <!--批号-->
                            <el-input v-model="detail.batchNo" :disabled="slmUpdateForm.operationType==='INBOUND'"
                                      @input="getBatch(detail)"/>
                        </el-col>
                        <el-col :span="4">
                            <!--物料号-->
                            <el-input v-model="detail.productNo" @input="getBatch(detail)"/>
                        </el-col>
                        <el-col :span="4">
                            <!--货品名称-规格型号-->
                            <el-input v-model.trim="detail.productName"
                                      :disabled="slmUpdateForm.operationType!=='INBOUND'"/>
                        </el-col>
                        <el-col :span="2">
                            <!--数量-->
                            <el-input v-model="detail.productNum"
                                      :placeholder="detail.maxNum===undefined?'':'/' + detail.maxNum"
                                      @input="validateProductNum(detail)"/>
                        </el-col>
                        <el-col :span="2">
                            <!--单价（含税）-->
                            <el-input v-model="detail.priceInTax" :disabled="slmUpdateForm.operationType!=='INBOUND'"/>
                        </el-col>
                        <el-col :span="2">
                            <!--单价（不含税）-->
                            <el-input v-model="detail.priceEnTax" :disabled="slmUpdateForm.operationType!=='INBOUND'"/>
                        </el-col>
                        <el-col :span="3">
                            <!--金额（含税）-->
                            <el-input v-model="detail.priceInTax*detail.productNum" disabled/>
                        </el-col>
                        <el-col :span="3">
                            <!--金额（不含税）-->
                            <el-input v-model="detail.priceEnTax*detail.productNum" disabled/>
                        </el-col>
                    </el-row>
                    <el-form-item label="备注">
                        <el-input v-model="slmUpdateForm.remark"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">立即创建</el-button>
                        <el-button @click="noSubmit">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>

            <el-table
                v-loading="slmLoading"
                :data="dataList"
                element-loading-background="rgba(217, 217, 217, 0.8)"
                element-loading-spinner="el-icon-loading"
                element-loading-text="正在查询数据">
                <el-table-column align="center" class-name="small-padding fixed-width" label="进销存">
                    <el-table-column
                        label="物料号"
                        prop="product_no"
                        width="150">
                    </el-table-column>
                    <el-table-column
                        label="货品名称"
                        prop="product_name"
                        width="150">
                    </el-table-column>
                    <el-table-column label="期初">
                        <el-table-column label="数量"
                                         prop="balance_num_begin"/>
                        <el-table-column label="单价"
                                         prop="balance_begin_unit_price_in"/>
                        <el-table-column label="金额"
                                         prop="balance_begin_price_in"/>
                    </el-table-column>
                    <el-table-column label="本期入库">
                        <el-table-column label="数量"
                                         prop="inbound_num"/>
                        <el-table-column label="单价"
                                         prop="inbound_unit_price_in"/>
                        <el-table-column label="金额"
                                         prop="inbound_price_in"/>
                    </el-table-column>
                    <el-table-column label="本期出库">
                        <el-table-column label="数量"
                                         prop="outbound_num"/>
                        <el-table-column label="单价"
                                         prop="outbound_unit_price_in"/>
                        <el-table-column label="金额"
                                         prop="outbound_price_in"/>
                    </el-table-column>
                    <el-table-column label="本期调拨入库">
                        <el-table-column label="数量"
                                         prop="transfer_inbound_num"/>
                        <el-table-column label="单价"
                                         prop="transfer_inbound_price_in"/>
                        <el-table-column label="金额"
                                         prop="transfer_inbound_unit_price_in"/>
                    </el-table-column>
                    <el-table-column label="本期调拨出库">
                        <el-table-column label="数量"
                                         prop="transfer_outbound_num"/>
                        <el-table-column label="单价"
                                         prop="transfer_outbound_price_in"/>
                        <el-table-column label="金额"
                                         prop="transfer_outbound_unit_price_in"/>
                    </el-table-column>
                    <el-table-column label="期末结存">
                        <el-table-column label="数量"
                                         prop="balance_num_end"/>
                        <el-table-column label="单价"
                                         prop="balance_end_price_in"/>
                        <el-table-column label="金额"
                                         prop="balance_end_unit_price_in"/>
                    </el-table-column>
                </el-table-column>


            </el-table>
        </el-col>
    </el-row>
</template>

<style lang="scss" scoped>
.detail-title {
    text-align: center;
}
</style>
<script>
import {getBatchDetail, getExchangeRate, stockControl, summary} from "@/api/admin/slm/slm"
import {Message} from "element-ui";

export default {
    name: "slm",
    data() {
        return {
            slmLoading: false,
            slmUpdateVisible: false,
            date: '',
            queryParams: {
                storeId: "S20241204001",
                month: "2024-12",
            },
            storeList: [
                {
                    code: 'S20241204001',
                    name: '合肥仓',
                    type: 'STORE'
                }, {
                    code: 'S20241204002',
                    name: '美国仓',
                    type: 'STORE'
                }
            ],
            dataList: [],
            addBatchNo: '',
            exchangeRate: 0,
            slmUpdateForm: {
                // operationType: 'INBOUND',
                // currency: 'USD',
                // exchangeRate: 0,
                details: [],
            },
        }
    },
    created() {
        let _this = this
        _this.getData();
    },
    methods: {
        getExchangeRateAndNo() {
            let _this = this;
            _this.getDate();
            // 获取汇率,流水号,批次号
            getExchangeRate().then(resp => {
                let data = resp.data;
                _this.slmUpdateForm = {
                    exchangeRate: data.exchangeRate,
                    documentNo: data.documentNo,
                    date: _this.date,
                    batchNo: data.batchNo,
                    details: [],
                    currency: 'USD'
                }
                _this.addBatchNo = data.batchNo;
            })
        },
        getDate() {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始计数，所以要加1，并用padStart补零
            const day = String(now.getDate()).padStart(2, '0'); // 用padStart补零
            this.slmUpdateForm.date = `${year}-${month}-${day}`;
            this.date = `${year}-${month}-${day}`;
        },
        getData() {
            let _this = this;
            _this.slmLoading = true;
            summary(_this.queryParams).then(resp => {
                _this.dataList = resp.data;
                _this.slmLoading = false;
            }).catch(() => {
                _this.slmLoading = false;
            })
        },
        showUpdate() {
            let _this = this;
            _this.slmUpdateVisible = true;
            _this.getExchangeRateAndNo();
        },
        onSubmit() {
            let _this = this;
            // TODO 数据校验
            // 校验关键信息是否填写
            let putForm = _this.slmUpdateForm;
            let checkDetails = putForm.details;
            console.log(JSON.stringify(checkDetails))
            if (putForm.operationType === undefined) {
                Message.error("请选择操作类型");
                return;
            }
            if ((putForm.operationType === 'INBOUND' || putForm.operationType === 'TRANSFER') && putForm.inboundCode === undefined) {
                Message.error("请选择入库对象");
                return;
            }
            if ((putForm.operationType === 'OUTBOUND' || putForm.operationType === 'TRANSFER') && putForm.outboundCode === undefined) {
                Message.error("请选择出库对象");
                return;
            }
            if (putForm.operationType === 'TRANSFER' && putForm.outboundCode === putForm.inboundCode) {
                Message.error("调拨对象选择相同");
                return;
            }
            if (checkDetails === undefined || checkDetails.length <= 0) {
                Message.error("请增加明细");
                return;
            }

            console.log("开始循环");
            for (let i = 0; i < checkDetails.length; i++) {
                let detail = checkDetails[i];
                console.log("第" + (i + 1) + "条数据:" + JSON.stringify(detail));
                if ((putForm.operationType === 'OUTBOUND' || putForm.operationType === 'TRANSFER')
                    && (detail.productNo === undefined || detail.productNo === '')) {
                    Message.error("第" + (i + 1) + "条数据的商品号未填写");
                    return;
                }
                if (detail.batchNo === undefined || detail.batchNo === '' ||
                    detail.productName === undefined || detail.productName === ''
                    || detail.productNum === undefined
                    || detail.priceInTax === undefined
                    || detail.priceEnTax === undefined) {
                    Message.error("第" + (i + 1) + "条数据的基本信息未完善");
                    return;
                }
                if(detail.productNum === 0){
                    Message.error("第" + (i + 1) + "条商品数量未填写");
                    return;
                }
            }
            console.log("结束循环");
            stockControl(_this.slmUpdateForm).then(res => {
                if (!res.status) {
                    Message.error(res.msg)
                } else {
                    _this.slmUpdateVisible = false;
                    _this.getData();
                }
                console.log(JSON.stringify(res))
            }).catch(() => {
                console.log("出入库异常");
            });
        },
        noSubmit() {
            let _this = this;
            _this.slmUpdateVisible = false;
        },
        handleMonthChange(value) {
            console.log('选中的月份:', value);
        },
        addDetail() {
            let _this = this;
            if (_this.slmUpdateForm.operationType === undefined || _this.slmUpdateForm.operationType === '') {
                return Message.error("请选择单据类型");
            } else if ((_this.slmUpdateForm.operationType === 'INBOUND' && (_this.slmUpdateForm.inboundCode === undefined || _this.slmUpdateForm.inboundCode === ''))) {
                return Message.error("请选择入库对象");
            } else if ((_this.slmUpdateForm.operationType === 'OUTBOUND' && (_this.slmUpdateForm.outboundCode === undefined || _this.slmUpdateForm.outboundCode === ''))) {
                return Message.error("请选择出库对象");
            } else if ((_this.slmUpdateForm.operationType === 'TRANSFER'
                && (_this.slmUpdateForm.inboundCode === undefined || _this.slmUpdateForm.inboundCode === ''
                    || _this.slmUpdateForm.outboundCode === undefined || _this.slmUpdateForm.outboundCode === ''))) {
                return Message.error("请选择调拨对象");
            }
            // 此处需要根据不同的操作类型生成不同的值
            _this.slmUpdateForm.details.push({
                batchNo: _this.slmUpdateForm.batchNo,
                documentNo: _this.slmUpdateForm.documentNo,
                currency: _this.slmUpdateForm.currency,
                exchangeRate: _this.slmUpdateForm.exchangeRate,
                no: _this.slmUpdateForm.details.length,
            })
        },
        changeOperationType() {
            let _this = this;
            _this.slmUpdateForm.details = [];
            if (_this.slmUpdateForm.operationType === 'INBOUND') {
                _this.slmUpdateForm.batchNo = _this.addBatchNo;
            } else {
                _this.slmUpdateForm.batchNo = '';
            }
        },
        changeBound(type) {
            // 修改仓库的时候填入对应的仓库信息
            let data;
            if (type === 'INBOUND') {
                if (this.slmUpdateForm.inboundCode === undefined || this.slmUpdateForm.inboundCode === '') {
                    return;
                }
                for (let i = 0; i < this.storeList.length; i++) {
                    if (this.slmUpdateForm.inboundCode === this.storeList[i].code) {
                        data = this.storeList[i];
                        break;
                    }
                }
                this.slmUpdateForm.inboundName = data.name;
                this.slmUpdateForm.inboundType = data.type;
            } else if (type === 'OUTBOUND') {
                if (this.slmUpdateForm.outboundCode === undefined || this.slmUpdateForm.outboundCode === '') {
                    return;
                }
                for (let i = 0; i < this.storeList.length; i++) {
                    if (this.slmUpdateForm.outboundCode === this.storeList[i].code) {
                        data = this.storeList[i];
                        break;
                    }
                }
                this.slmUpdateForm.outboundName = data.name;
                this.slmUpdateForm.outboundType = data.type;
            }
            // TODO 此处暂时做清除详情,后续是否清除再说
            this.slmUpdateForm.details = [];
        },
        getBatch(detail) {
            let _this = this;
            if (_this.slmUpdateForm.operationType !== 'INBOUND') {
                if (_this.slmUpdateForm.outboundCode === undefined || _this.slmUpdateForm.outboundCode === '') {
                    Message.error("请选择出库方");
                    return;
                }
                if (
                    detail.productNo !== undefined && detail.productNo !== '' &&
                    detail.batchNo !== undefined && detail.batchNo !== ''
                ) {
                    console.log("查询批次" + JSON.stringify(detail))
                    getBatchDetail(_this.slmUpdateForm.outboundCode, detail.productNo, detail.batchNo).then(res => {
                        console.log(JSON.stringify(res))
                        if (res.status) {
                            let data = res.data;
                            console.log("开始赋值")
                            _this.$set(detail, 'productName', data.productName);
                            _this.$set(detail, 'priceInTax', data.priceInTax);
                            _this.$set(detail, 'priceEnTax', data.priceEnTax);
                            _this.$set(detail, 'maxNum', data.batchNum - data.usedNum);
                        }
                    }).catch(() => {
                        console.log("查询批次异常-解除赋值");
                        _this.$set(detail, 'productName', '');
                        _this.$set(detail, 'priceInTax', '');
                        _this.$set(detail, 'priceEnTax', '');
                        _this.$set(detail, 'maxNum', 0);
                    });
                }
            }
        },
        validateProductNum(detail) {
            // 将输入值转换为数字，并确保它不超过 maxNum
            const num = Number(detail.productNum);
            if (!isNaN(num) && num > detail.maxNum) {
                detail.productNum = detail.maxNum; // 如果超过，则设置为 maxNum
                // 你也可以在这里添加提示用户的逻辑，比如显示一个消息
            } else if (isNaN(num)) {
                detail.productNum = 0; // 如果输入的不是数字，则重置为 0
                // 同样，你可以添加处理非法输入的逻辑
            }
        }
    }
}
</script>
