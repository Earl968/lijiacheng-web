<template>
    <div class="app-container">
        <el-menu :default-active="addShowIndex" class="el-menu-demo" mode="horizontal"
                 @select="handleSelect">
            <el-menu-item index="1">基础</el-menu-item>
            <el-menu-item index="2">账款</el-menu-item>
            <!--            <el-menu-item index="3">交易</el-menu-item>-->
            <!--            <el-menu-item index="4">营业</el-menu-item>-->
            <!--            <el-menu-item index="5">贸易</el-menu-item>-->
            <!--            <el-menu-item index="6">海关</el-menu-item>-->
            <!--            <el-menu-item index="7">其他</el-menu-item>-->
        </el-menu>
        <!--        :inline="true"-->
        <el-form id="addForm" ref="form" :inline="addShowIndex==='1'" :model="addCustom" size="medium"
                 style="margin-top: 10px;">
            <div id="addForm1">
                <el-form-item v-show="addShowIndex==='1'" label="公司全称">
                    <el-input v-model="addCustom.name" placeholder="公司全称"/>
                </el-form-item>
                <el-form-item v-show="addShowIndex==='1'" label="公司简称">
                    <el-input v-model="addCustom.snm" placeholder="公司简称"/>
                </el-form-item>
                <el-form-item v-show="addShowIndex==='1'" label="区域">
                    <el-select v-model="addCustom.cusAre" clearable placeholder="客户地区"
                               style="width: 210px">
                        <el-option v-for="area in parentCustomAreas" :key="area.dbCode" :label="area.area"
                                   :value="area.dbCode"/>
                    </el-select>
                </el-form-item>
                <el-form-item v-show="addShowIndex==='1'" label="负责人员">
                    <el-input v-model="addCustom.bosNm" placeholder="负责人员"/>
                </el-form-item>
                <el-form-item v-show="addShowIndex==='1'" label="联络人-1">
                    <el-input v-model="addCustom.cntMan1" placeholder="联络人-1"/>
                </el-form-item>
                <el-form-item v-show="addShowIndex==='1'" label="联络人-2">
                    <el-input v-model="addCustom.cntMan2" placeholder="联络人-2"/>
                </el-form-item>
                <el-form-item v-show="addShowIndex==='1'" label="会计">
                    <el-input v-model="addCustom.accMan" placeholder="会计"/>
                </el-form-item>
                <el-form-item v-show="addShowIndex==='1'" label="电话-1">
                    <el-input v-model="addCustom.tel1" placeholder="电话-1"/>
                </el-form-item>
                <el-form-item v-show="addShowIndex==='1'" label="电话-2">
                    <el-input v-model="addCustom.tel2" placeholder="电话-2"/>
                </el-form-item>
                <el-form-item v-show="addShowIndex==='1'" label="统一编码">
                    <el-input v-model="addCustom.uniNo" placeholder="统一编码"/>
                </el-form-item>
                <el-form-item v-show="addShowIndex==='1'" label="客户等级">
                    <el-select v-model="addCustom.cusLevel" clearable placeholder="客户等级">
                        <el-option v-for="level in parentCustomLevels" :key="level.dbLevel" :label="level.level"
                                   :value="level.dbLevel"/>
                    </el-select>
                </el-form-item>
                <el-form-item v-show="addShowIndex==='1'" label="传真机">
                    <el-input v-model="addCustom.fax" placeholder="传真机"/>
                </el-form-item>
                <el-form-item v-show="addShowIndex==='1'" label="纳税资格">
                    <el-select v-model="addCustom.nszgFlag" clearable placeholder="纳税资格">
                        <el-option key="1" label="一般纳税人" value="1"/>
                        <el-option key="2" label="小规模纳税人" value="2"/>
                        <el-option key="3" label="个体户" value="3"/>
                    </el-select>
                </el-form-item>
                <el-form-item v-show="addShowIndex==='1'" label="纳税人识别号">
                    <el-input v-model="addCustom.nsrCode" placeholder="纳税人识别号"/>
                </el-form-item>
                <el-form-item v-show="addShowIndex==='1'" label="行业别">
                    <el-input v-model="addCustom.bizDsc" placeholder="行业别"/>
                </el-form-item>
                <el-form-item v-show="addShowIndex==='1'" label="发票类型">
                    <el-select v-model="addCustom.invId" clearable placeholder="发票类型">
                        <el-option key="1" label="增值税普票" value="1"/>
                        <el-option key="2" label="增值税专票" value="2"/>
                    </el-select>
                </el-form-item>
                <el-form-item v-show="addShowIndex==='1'" label="发票名称">
                    <el-input v-model="addCustom.fpName" placeholder="发票名称"/>
                </el-form-item>
                <el-form-item v-show="addShowIndex==='1'" label="发票地址">
                    <el-input v-model="addCustom.adr1" placeholder="发票地址"/>
                </el-form-item>
                <el-form-item v-show="addShowIndex==='1'" label="公司地址">
                    <el-input v-model="addCustom.adr2" placeholder="公司地址"/>
                </el-form-item>
                <el-form-item v-show="addShowIndex==='1'" label="邮政编码">
                    <el-input v-model="addCustom.zip" placeholder="邮政编码"/>
                </el-form-item>
                <el-form-item v-show="addShowIndex==='1'" label="起始往来">
                    <el-input v-model="addCustom.strDd" placeholder="起始往来"/>
                </el-form-item>
                <el-form-item v-show="addShowIndex==='1'" label="客户税率">
                    <el-input v-model="addCustom.rtoTax" placeholder="客户税率"/>
                </el-form-item>
                <el-form-item v-show="addShowIndex==='1'" label="集团分公司">
                    <el-input v-model="addCustom.dep1" placeholder="集团分公司"/>
                </el-form-item>
                <el-form-item v-show="addShowIndex==='1'" label="审核人员">
                    <el-input v-model="addCustom.chkMan" placeholder="审核人员"/>
                </el-form-item>
                <el-form-item v-show="addShowIndex==='1'" label="是否是快递商">
                    <el-input v-model="addCustom.chkKd" placeholder=""/>
                </el-form-item>
                <br v-show="addShowIndex==='1'"/>
                <el-form-item v-show="addShowIndex==='1'" inline="true" label="单部门">
                    <div style="float: left;margin-left: 5px;">
                        <el-checkbox v-model="depChecked" @change="depCheck"/>
                    </div>
                    <el-input v-model="addCustom.dep" :disabled="!depChecked"
                              placeholder="单部门" style="float: left;margin-left: 5px;width: 150px;"/>
                </el-form-item>
                <el-form-item v-show="addShowIndex==='1'" label="部门群组">
                    <el-input v-model="addCustom.deproNo" :disabled="depChecked" placeholder="部门群组"/>
                </el-form-item>

                <el-form-item v-show="addShowIndex==='1'" label="备注" style="width: 90%">
                    <el-input v-model="addCustom.rem" placeholder="备注"/>
                </el-form-item>
            </div>

            <el-form v-show="addShowIndex==='2'" :inline="true">
                <el-form-item v-show="addShowIndex==='2'" label="使用币别">
                    <el-select v-model="addCustom.cur" clearable placeholder="货币种类">
                        <el-option key="EUR" label="EUR" value="EUR"/>
                        <el-option key="HK" label="HK" value="HK"/>
                        <el-option key="USD" label="USD" value="USD"/>
                    </el-select>
                </el-form-item>

                <el-form-item v-show="addShowIndex==='2'" label="按外币冲销">
                    <el-checkbox v-model="id2TaxChecked" @change="id2TaxCheck"/>
                </el-form-item>

                <el-form-item v-show="addShowIndex==='2'" label="扣款比例">
                    <el-input v-model="addCustom.rtoKk" style="width: 50%;margin-left: 10px;"/>
                    %
                </el-form-item>

                <el-form-item v-show="addShowIndex==='2'" label="立帐方式">
                    <el-select v-model="addCustom.cls2" clearable>
                        <el-option label="单张立帐" value="1"></el-option>
                        <el-option label="不立账" value="2"></el-option>
                        <el-option label="收到发票才立账" value="3"></el-option>
                        <el-option label="POS自收银" value="4"></el-option>
                        <el-option label="POS代收银" value="5"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item v-show="addShowIndex==='2'" label="扣税类别">
                    <el-select v-model="addCustom.id1Tax" clearable>
                        <el-option label="不计税" value="1"/>
                        <el-option label="应税内含" value="2"/>
                        <el-option label="应税外加" value="3"/>
                    </el-select>
                </el-form-item>
            </el-form>

            <el-divider v-if="addShowIndex==='2'">帐务归属</el-divider>
            <el-form-item v-show="addShowIndex==='2'" class="flex-container" style="gap: 0px;">
                <el-input v-model="addCustom.masCus" placeholder="归属客户"/>
                <el-input v-model="addCustom.sal" placeholder="责任业务"/>
            </el-form-item>
            <el-form v-show="addShowIndex==='2'" :inline="true">
                <!--                <el-form-item label="信用管制" style="width: auto;"/>-->
                <!--                <br/>-->
                <el-divider v-show="addShowIndex==='2'">信用管制</el-divider>
                <el-form-item v-show="addShowIndex==='2'" label="信用额度" style="width: 40%;">
                    <el-input v-model="addCustom.limNr" placeholder="信用额度"/>
                </el-form-item>
                <el-form-item v-show="addShowIndex==='2'" style="width: 40%;">
                    <el-checkbox v-model="chkIncludeChecked" label="上下属公司共用额度" @change="chkIncludeCheck"/>
                </el-form-item>
                <el-form-item v-show="addShowIndex==='2'" label="信用管制" style="width: 40%;">
                    <el-input v-model="addCustom.crdId" placeholder="信用管制"/>
                </el-form-item>
                <el-form-item v-show="addShowIndex==='2'" label="信用检测" style="width: 40%;">
                    <el-input v-model="addCustom.chkCusIdx" placeholder="信用检测"/>
                </el-form-item>
                <el-form-item v-show="addShowIndex==='2'" label="截止往来" style="width: 40%;">
                    <el-input v-model="addCustom.endDd" placeholder="截止往来"/>
                </el-form-item>
            </el-form>
            <!--            <el-form-item label="责任业务">-->
            <!--                <el-checkbox-group v-model="addCustom.responsibilityBusiness">-->
            <!--                    <el-checkbox label="订单"></el-checkbox>-->
            <!--                    <el-checkbox label="预收款"></el-checkbox>-->
            <!--                    <el-checkbox label="不立帐销/退/折单"></el-checkbox>-->
            <!--                    <el-checkbox label="调汇其它收入单"></el-checkbox>-->
            <!--                    &lt;!&ndash; 其他checkbox选项可以添加 &ndash;&gt;-->
            <!--                </el-checkbox-group>-->
            <!--            </el-form-item>-->

            <el-divider v-if="addShowIndex==='2'">开户银行</el-divider>
            <el-form-item v-show="addShowIndex==='2'">
                <el-select v-model="addCustom.bankNo" clearable placeholder="银行代号" style="width: 210px"
                           @change="updateBank">
                    <el-option v-for="bank in parentCustomBanks" :key="bank.bnkNo" :label="bank.name"
                               :value="bank.bnkNo"/>
                </el-select>
                <el-input v-model="addCustom.bankName" :disabled="true" placeholder="银行名称"
                          style="margin-top: 5px;"/>
                <el-input v-model="addCustom.idCode" placeholder="银行账号" style="margin-top: 5px;"/>
                <el-input v-model="addCustom.codeName" placeholder="账户名称" style="margin-top: 5px;"/>
            </el-form-item>

            <el-divider v-if="addShowIndex==='2'">会计科目</el-divider>
            <el-form v-show="addShowIndex==='2'" :inline="true">
                <el-form-item label="应收账款">
                    <el-input v-model="addCustom.accNoAr" placeholder="应收账款"/>
                </el-form-item>
                <el-form-item label="应付账款">
                    <el-input v-model="addCustom.accNoAp" placeholder="应付账款"/>
                </el-form-item>
                <el-form-item label="应收票据">
                    <el-input v-model="addCustom.accNoR0" placeholder="应收票据"/>
                </el-form-item>
                <el-form-item label="应付票据">
                    <el-input v-model="addCustom.accNoP0" placeholder="应付票据"/>
                </el-form-item>
                <el-form-item label="预收账款">
                    <el-input v-model="addCustom.accNoIr" placeholder="预收账款"/>
                </el-form-item>
                <el-form-item label="预付账款">
                    <el-input v-model="addCustom.accNoIp" placeholder="预付账款"/>
                </el-form-item>
                <el-form-item label="应收其它账款">
                    <el-input v-model="addCustom.accNoAr2" placeholder="应收其它账款"/>
                </el-form-item>
                <el-form-item label="应付费用">
                    <el-input v-model="addCustom.accNoAp2" placeholder="应付费用"/>
                </el-form-item>
                <el-form-item label="暂估应付账款">
                    <el-input v-model="addCustom.accNoZp" placeholder="暂估应付账款"/>
                </el-form-item>
            </el-form>

            <!--            <el-form-item label="其他信息" v-show="addShowIndex==='2'">-->
            <!--                <el-checkbox v-model="addCustom.freezePayment">冻结付款</el-checkbox>-->
            <!--                <el-input v-model="addCustom.freezePaymentAmount" placeholder="冻结付款金额"></el-input>-->
            <!--                <el-button>检测应付账款余额</el-button>-->
            <!--            </el-form-item>-->

            <br/>
            <el-form-item label-position="right">
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import {add} from '@/api/admin/erp/custom'

export default {
    name: 'custom_add',
    props: {
        parentCustomLevels: {
            type: Array,
            default: () => []
        },
        parentCustomAreas: {
            type: Array,
            default: () => []
        },
        parentCustomBanks: {
            type: Array,
            default: () => []
        },
    },
    data() {
        return {
            // 需要新增的数据
            addCustom: {
                objId: 1,
            },
            // 是否单部门
            depChecked: false,
            //账款:是否按外币冲销
            id2TaxChecked: false,
            //账款:信用管制:上下属公司公用信用额度
            chkIncludeChecked: false,
            addShowIndex: '1',
            bankCode: '',
        }
    },
    created() {
        let _this = this;
        _this.addCustom = {};
        _this.addCustom.objId = 1;
    },
    methods: {
        onSubmit() {
            // 1.添加数据
            add(this.addCustom).then(res => {
                console.log(JSON.stringify(res))
                this.$emit('form-submitted');
            }).catch(() => {
                console.log("增加客户异常");
            });
            console.log(JSON.stringify(this.addCustom));
        },
        cancel(){
            this.$emit('form-cancel');
        },
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
            let _this = this;
            _this.addShowIndex = key;
            console.log(this.addShowIndex)
        },
        depCheck(check) {
            let _this = this;
            if (!check) {
                _this.addCustom.dep = "";
            }
        },

        id2TaxCheck(check) {
            let _this = this;
            if (check) {
                _this.addCustom.id2Tax = "T";
            } else {
                _this.addCustom.id2Tax = "F";
            }
        },
        chkIncludeCheck(check) {
            let _this = this;
            if (check) {
                _this.addCustom.chkInclude = "T";
            } else {
                _this.addCustom.chkInclude = "F";
            }
        },
        updateBank() {
            let _this = this;
            if (_this.addCustom.bankNo != undefined && _this.addCustom.bankNo != "") {
                for (let i = 0; i < _this.parentCustomBanks.length; i++) {
                    if (_this.parentCustomBanks[i].bnkNo === _this.addCustom.bankNo) {
                        _this.addCustom.bankName = _this.parentCustomBanks[i].name;
                        return;
                    }
                }
            } else {
                _this.addCustom.bankName = '';
            }
        },
    }
}
</script>
<style lang="scss" scoped>
.el-form--inline .el-form-item {
    width: 45%;
}

.flex-container {
    display: flex;
    gap: 10px; /* 设置输入框之间的间距 */
}
</style>
