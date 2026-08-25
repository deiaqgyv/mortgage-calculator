# 六国抵押贷款计算器：调研与产品需求规划

> 适用市场：美国、英国、加拿大、德国、法国、西班牙  
> 文档状态：研究基线 / 开发前 PRD  
> 研究日期：2026-08-25  
> 重要边界：本产品输出估算结果，不构成贷款报价、授信决定、税务意见、法律意见或财务建议。

## 1. 产品决策摘要

产品应采用“统一现金流计算内核 + 国家规则插件 + 地区税费数据集”的架构，不能用同一套美国公式仅替换语言和币种。

六国可以共用：

- 固定利率等额本息现金流引擎；
- 逐期本金、利息、余额计算；
- 额外还款事件模型；
- 多方案比较、CSV/PDF、分享链接；
- 结果解释、精度、舍入和可追溯机制。

必须逐国实现：

- 名义利率到每期利率的换算；
- 固定、浮动、混合利率和利率重设方式；
- 贷款期限与利率锁定期的区别；
- 提前还款权限、合同限额及可能费用；
- 贷款保险、借款人保险、房屋保险的不同性质；
- 交易税、持有税、一次性费用和月度住房成本；
- 地区层级规则，例如美国州/县、加拿大省/市、德国州、法国省、西班牙自治区、英国四个法域。

### 1.1 MVP 范围

首版应支持：

1. 自住住宅；
2. 固定利率、全额摊还贷款；
3. 月付；加拿大额外支持标准/加速双周和周付；
4. 一次性、每月、每年额外还款；
5. 固定利率方案比较；
6. 逐期摊销表；
7. 可选的国家税费与保险估算；
8. CSV/PDF、版本化分享链接；
9. 六个国家级本地化页面。

以下进入 V1.1，而不是混入 MVP：

- 美国 ARM、FHA、VA、USDA 的完整费用规则；
- 英国 interest-only、fixed deal 到期后转 SVR；
- 加拿大固定期限续约、变量固定付款与 trigger rate；
- 德国 Zinsbindung 到期后的 Anschlussfinanzierung；
- 法国多贷款平滑、PTZ、借款人保险精细计费；
- 西班牙 Euribor 浮动及混合利率重设情景。

## 2. 统一术语与金额分类

界面和导出必须把以下金额分开，禁止全部称为“月供”：

| 层级 | 定义 | 典型项目 |
|---|---|---|
| 贷款还款额 | 偿还贷款合同的周期付款 | 本金、利息 |
| 贷款相关成本 | 获得或维持贷款而产生 | PMI、CMHC 保费、借款人保险、贷款费用 |
| 持有成本 | 即使没有贷款也可能发生 | 房产税、房屋保险、HOA/物业费 |
| 交易成本 | 买房时的一次性支出 | 印花税、转让税、公证、登记、评估 |
| 总月度住房成本 | 贷款还款额加可月化的持有/保险成本 | PITI 或当地等价视图 |
| 购房所需现金 | 首付加不可融资交易成本 | 首付、税、公证、登记等 |

所有结果必须同时显示：

- 每期本金与利息；
- 首期总住房成本估算；
- 贷款总利息；
- 贷款总支付；
- 一次性购房成本；
- 预计购房所需现金；
- 偿清日期；
- 假设、未包含项与规则生效日期。

## 3. 统一计算内核

### 3.1 固定利率等额本息

对于本金 `P`、每期利率 `i`、总期数 `n`：

```text
payment = P × i × (1 + i)^n / ((1 + i)^n - 1)
```

当 `i = 0`：

```text
payment = P / n
```

第 `k` 期：

```text
interest_k  = opening_balance_k × periodic_rate_k
principal_k = scheduled_payment_k - interest_k
balance_k   = opening_balance_k - principal_k - extra_payment_k
```

末期付款应自动调整，避免因逐期舍入产生负余额或尾差。

### 3.2 利率换算接口

计算内核不得假定 `annual_rate / 12`。国家插件必须提供：

```ts
interface RateConvention {
  quotedRateType: 'nominal' | 'effective';
  compoundingPerYear: number | 'contractual';
  paymentFrequency: number;
  dayCount?: '30/360' | 'actual/365' | 'actual/actual' | 'equal-months';
  periodicRate(annualRate: Decimal): Decimal;
}
```

通用换算：

```text
名义年率 j，每年复利 m 次、每年付款 f 次：
i_f = (1 + j/m)^(m/f) - 1

有效年率 e：
i_f = (1 + e)^(1/f) - 1
```

### 3.3 精度与舍入

- 内部计算至少使用十进制定点或 20 位有效精度，禁止用二进制浮点直接累计货币现金流；
- 内部余额保留至少 8 位小数；
- UI 金额按币种最小单位显示；
- 默认每期展示值舍入到分，但余额计算策略必须可配置为“未舍入内部值”或“合同逐期舍入”；
- CSV 包含未舍入计算值和展示值两个可选层级；
- PDF 展示舍入值，并注明可能与贷款机构因日计息、付款日期和逐期舍入产生差异。

### 3.4 额外还款事件

支持：

- 一次性额外还款；
- 每期固定额外还款；
- 每年固定日期额外还款；
- 多个不规则还款事件；
- 保持原付款、缩短期限；
- 保持原期限、重算付款；
- 先收费用或先冲本金的合同选项。

事件执行顺序必须可配置，默认：

```text
期初余额 → 本期利息 → 正常付款 → 提前还款费用 → 额外本金 → 新余额
```

结果必须展示：

- 节省利息；
- 缩短月份；
- 新偿清日期；
- 提前还款费用；
- 净节省（节省利息减费用）；
- 费用是否为用户输入、法定上限估算或未计算。

### 3.5 多方案比较

至少比较 3 个方案，最多 5 个。比较维度：

- 贷款金额、首付、LTV；
- 利率及利率口径；
- 贷款期、固定期/重设期；
- 每期本金利息；
- 首期总住房成本；
- 总利息、总贷款支付；
- 保险/贷款费用；
- 交易税费；
- 5 年、10 年、固定期结束时的剩余本金；
- 额外还款净节省；
- 假设差异警告。

禁止将 APR/APRC/TAEG/TAE 与合同名义利率混作同一字段。比较时必须标注不同指标是否可比。

## 4. 六国规则矩阵

| 国家 | 默认贷款模型 | 关键差异 | MVP 必需地区字段 |
|---|---|---|---|
| 美国 | 固定利率月付等额本息 | PITI、PMI、州县房产税、HOA | 州、ZIP/县可选 |
| 英国 | repayment mortgage | repayment/interest-only、deal period、四法域交易税 | England/NI、Scotland、Wales |
| 加拿大 | 固定利率、term + amortization | 半年复利换算、付款频率、违约保险、省级税费 | 省/地区、市可选 |
| 德国 | Annuitätendarlehen | Sollzins、初始还款率、Zinsbindung、Restschuld | Bundesland |
| 法国 | 固定利率 amortissable | assurance emprunteur、TAEG/TAEA、IRA、DMTO | département、房屋新旧 |
| 西班牙 | sistema francés | 固定/浮动/混合、Euribor、提前还款上限、地区税 | comunidad autónoma、房屋新旧 |

## 5. 美国（en-US）

### 5.1 计算口径

- 默认固定年利率按月换算：`i = nominalAnnualRate / 12`；
- 支持 10/15/20/30 年和自定义期限；
- 结果区分 Principal & Interest 与 Total Monthly Payment；
- 总月度住房成本默认结构：本金 + 利息 + 房贷保险（如适用）+ 房产税 + 房屋保险；HOA 单列并计入预算视图；
- 税和保险若通过 escrow 支付，仍标为持有成本，不计入“贷款利息”。

美国消费者金融保护局将典型总月付描述为本金、利息、房贷保险以及税费/房屋保险 escrow；HOA 通常另付。产品文案应遵循该区分。

### 5.2 输入

- Home price；
- Down payment：金额或百分比联动；
- Loan amount；
- Interest rate；
- Loan term；
- Start date；
- Annual property tax：金额或房价百分比；
- Annual homeowners insurance；
- Monthly HOA；
- PMI：年率、月金额或关闭；
- 可选 ZIP/County，用于后续税率数据；
- Extra payments。

### 5.3 税费与保险

- 房产税是州/县/市级数据，不能提供一个“美国默认法定税率”；
- 房屋保险是市场报价，不是全国固定费率；
- 常规贷款首付低于 20% 时通常可能需要 PMI，但取消条件及费率依贷款合同和法规；MVP 只做用户输入/估算，不自动承诺取消日期；
- FHA/VA/USDA 不得复用 PMI 模型，应在产品专项模块中实现；
- Closing costs 作为用户输入或范围估算，不作为精确法定结果；
- 房贷利息和 property tax 的所得税处理不进入基础月供结果，应另做税务情景工具并要求纳税身份信息。

### 5.4 提前还款

- 基础工具支持无费用额外还款；
- 增加“合同是否存在 prepayment penalty”开关和自定义费用；
- 不默认声称所有美国房贷均可免费提前还款；
- PMI 自动取消/申请取消应为独立规则模块，不能仅以余额低于房价 80% 直接下结论。

### 5.5 结果免责声明要点

> Estimate only. Taxes, insurance, mortgage insurance, HOA dues, escrow adjustments, lender rounding, payment dates and loan-specific terms may change the actual payment. This is not a loan offer or financial, tax or legal advice.

## 6. 英国（en-GB）

### 6.1 计算口径

- 默认产品名使用 Mortgage Repayment Calculator；
- 必须选择 Repayment 或 Interest-only；
- Repayment 使用等额本息估算；
- Interest-only 的周期付款只覆盖利息，期末本金保持未偿；必须醒目标注还款载体未计入；
- 将 Mortgage term 与 Initial/fixed deal period 分开；
- V1.1 支持 deal 期结束后进入用户输入的 follow-on/SVR rate；
- 利率日计息、月计息和贷方舍入可能不同，国家插件保留 `interestAccrualMethod` 配置。

### 6.2 输入

- Property value、deposit、mortgage amount；
- Repayment / interest-only；
- Interest rate；
- Mortgage term；
- Initial deal period；
- Follow-on rate（V1.1）；
- Property location：England、Northern Ireland、Scotland、Wales；
- First-time buyer；
- Additional property；
- UK resident for transaction-tax purposes；
- Buildings insurance、service charge/ground rent（用户输入）；
- Overpayments、ERC 条款。

### 6.3 交易税

不能建立单一 `UK stamp duty` 公式：

- England 与 Northern Ireland：SDLT；
- Scotland：LBTT；
- Wales：LTT。

SDLT 必须支持边际税档、首次购房者、额外住宅、非英国居民等状态。税率表必须存为生效日期版本，不能写死在业务代码。苏格兰和威尔士使用各自独立数据集。

Council Tax、building insurance、service charge 不应自动从成交价推导为精确值；允许用户输入或使用带来源/日期的区间估算。

### 6.4 提前还款

- 支持每年免费 overpayment allowance 的合同输入；
- 支持按超出额度金额百分比、剩余 deal 月份阶梯或自定义 ERC；
- 不把常见的“每年 10%”作为法律规定；它只能是可编辑示例；
- 对 interest-only，额外还款默认减少本金，并重新计算后续利息。

### 6.5 免责声明要点

> This is an illustrative estimate, not a mortgage offer. Lenders may calculate interest daily and apply product-specific fees, overpayment limits and early repayment charges. Property transaction tax depends on the UK jurisdiction and buyer circumstances.

## 7. 加拿大（en-CA / fr-CA）

### 7.1 计算口径

加拿大是六国中最不能复用 `年利率÷12` 的市场。

固定利率常见报价需支持“名义年率、每半年复利且非预付”的换算。对于报价年率 `j` 和每年付款 `f` 次：

```text
periodic_rate = (1 + j / 2)^(2 / f) - 1
```

变量利率的复利方式可能依合同不同，必须允许选择或披露合同口径，不得一律套用半年复利。

必须区分：

- Amortization period：完全偿还所需年限；
- Mortgage term：当前利率和合同条件生效期；
- Renewal：term 到期后的续约情景。

### 7.2 付款频率

支持：

- Monthly；
- Semi-monthly；
- Biweekly；
- Weekly；
- Accelerated biweekly；
- Accelerated weekly。

加速双周默认金额为月供一半，每年 26 次，相当于一年支付 13 个月供；标准双周为月供 × 12 / 26。两者不得混淆。

### 7.3 输入

- Purchase price、down payment；
- Province/territory、municipality（可选）；
- Fixed/variable；
- Quoted rate、compounding convention；
- Term、amortization；
- Payment frequency；
- First-time buyer/new build 状态；
- Mortgage default insurance；
- Property tax、home insurance、condo fees；
- Prepayment privilege 和 penalty。

### 7.4 首付与违约保险

规则必须数据化并带生效日期。当前官方基线包括：

- 购房价不超过 CAD 500,000：最低首付 5%；
- CAD 500,000 至 1.5 million：前 500,000 的 5% 加超出部分的 10%；
- CAD 1.5 million 及以上：最低 20%；
- 首付低于 20% 时通常需要 mortgage loan/default insurance；
- 保费通常可以加入贷款本金，省级销售税若适用则不能并入贷款；
- Ontario、Manitoba、Quebec 对保险保费的省级销售税需要独立处理。

CMHC 产品条件会变化，而且其他保险商可能不同。MVP 使用 CMHC 选项或“自定义保费”，不能把 CMHC 费率称为加拿大唯一法定费率。

### 7.5 税费

- Land transfer/property transfer tax 多为省级或市级，Toronto 等城市可能叠加市级税；
- 新房可能涉及 GST/HST 及 rebate；
- Property tax 依城市和评估值；
- 基础模块只在有完整地区数据时自动计算，否则要求用户输入；
- 结果将 land transfer tax 与年度 property tax 分开。

### 7.6 提前还款

- 输入合同允许的 regular payment increase；
- 输入年度 lump-sum privilege、计算基数和重置日；
- 超过 privilege 后的 penalty 由合同定义；
- 支持 closed/open mortgage；
- IRD 或三个月利息等处罚模型放入 V1.1，并明确只是合同估算。

### 7.7 免责声明要点

英文和法文版本必须等价。明确实际付款受复利方式、term、payment frequency、保险商规则、省税、付款日和贷款合同影响。

## 8. 德国（de-DE）

### 8.1 计算口径

默认产品为 `Annuitätendarlehen`：固定年金还款，但在利率固定期结束时通常仍有 `Restschuld`。

核心输入必须包含：

- Kaufpreis；
- Eigenkapital；
- Darlehensbetrag；
- Sollzins p.a.；
- anfänglicher Tilgungssatz p.a.；
- monatliche Rate（可反向求值）；
- Sollzinsbindung；
- Gesamtlaufzeit/目标偿清期；
- Bundesland；
- Sondertilgung。

常见初始估算：

```text
initial_monthly_payment ≈ principal × (nominal_interest_rate + initial_repayment_rate) / 12
```

正式摊销表仍使用逐月余额计算。必须在利率固定期节点输出剩余债务，不应假设固定利率自动延续至完全偿清。

### 8.2 购房附加成本

- Grunderwerbsteuer 按 Bundesland 配置，数据带生效日期；
- Notar 与 Grundbuch 费用可用可编辑估算，不作为精确报价；
- Maklerprovision 取决于交易和地区，应用户输入；
- 年度 Grundsteuer 受市镇及 2025 后改革影响，不可只按房价全国推算；
- 建筑/房屋保险允许用户输入。

### 8.3 提前还款

- `Sondertilgungsrecht` 是合同字段：年度百分比/金额、基数、日期；
- 无合同权利的提前结清可能产生 `Vorfälligkeitsentschädigung`；
- 法定解约权、固定期和合同日期会影响费用，不在 MVP 自动给出法律结论；
- 费用估算必须标记“简化模型”，并提示银行的正式结算可能不同；
- 多方案比较重点显示 Zinsbindung 结束时 Restschuld 与 Anschlussfinanzierung 压力情景。

### 8.4 免责声明要点

> Unverbindliche Beispielrechnung. Die tatsächliche Rate, Restschuld, Erwerbsnebenkosten und Vorfälligkeitsentschädigung richten sich nach Vertrag, Zahlungszeitpunkt, Bundesland, Gemeinde und Kreditinstitut. Keine Finanz-, Steuer- oder Rechtsberatung.

## 9. 法国（fr-FR）

### 9.1 计算口径

默认 `prêt amortissable à taux fixe`，月度等额本息。必须区分：

- taux débiteur / taux nominal；
- TAEG：包含适用利息和贷款相关费用的比较指标；
- TAEA：借款人保险年度有效成本指标；
- mensualité hors assurance；
- mensualité assurance comprise。

输入：

- Prix du bien、apport、capital emprunté；
- Durée、taux nominal；
- Date de début；
- Assurance emprunteur：按初始本金、剩余本金或月固定额；
- Frais de dossier、garantie、courtage；
- Département、ancien/neuf；
- Taxe foncière（用户输入）；
- Remboursement anticipé。

### 9.2 保险与费用

- 借款人保险通常由贷款人要求，但借款人可以在满足保障等价条件下选择保险；
- 保险计费基数可能是初始本金或剩余本金，必须支持两种模型；
- TAEG 的完整精确计算需要纳入取得贷款所必需且已知的费用；基础工具如果缺少必要费用，只能显示“估算 TAEG”或不显示；
- 保证费用、申请费、评估等不能全部混进利息；
- taxe foncière 为持有成本，不能计入贷款利息。

### 9.3 购房税费

- `frais d’acquisition / frais de notaire` 包含税费和公证相关费用；
- 旧房 DMTO 受 département 和生效日期影响；2025 起部分地区可在期限内提高税率；首次购房者可能适用不同处理；
- 新房和旧房规则不同，必须要求用户选择房屋类型；
- MVP 应使用官方/公证体系数据源或明确的可编辑估算，不使用全国固定百分比冒充精确值。

### 9.4 提前还款

- 允许全部或部分提前还款；
- 合同可限制不超过/等于初始贷款 10% 的小额部分提前还款，结清余额除外；
- 固定利率 IRA 上限应取以下两者较低值：六个月利息与提前还款前剩余本金的 3%；
- 某些因工作地点变化、被迫失业或死亡导致出售的情况可能豁免；
- 工具只根据用户声明估算，不判断法律资格；
- 部分提前还款支持缩短期限或降低月付。

### 9.5 免责声明要点

明确保险、担保、TAEG、DMTO、合同条款及提前还款豁免需由贷款机构、公证人或专业人士确认。

## 10. 西班牙（es-ES）

### 10.1 计算口径

默认采用 `sistema francés`：在利率不变时月供恒定，利息按当期未偿本金计算。支持：

- Tipo fijo；
- Tipo variable：参考指数 + diferencial，按合同周期重设；
- Tipo mixto：初始固定期 + 后续浮动期。

Banco de España 的官方模拟器也明确采用法国式摊销，并假设月付、各月天数相同；产品必须把这些简化写入“计算假设”。

输入：

- Precio、entrada、capital；
- TIN、TAE（只作展示/比较，不作为同一输入）；
- Plazo；
- Fijo/variable/mixto；
- Euríbor/其他指数、diferencial、revisión semestral/anual；
- Comunidad autónoma；
- Vivienda nueva/usada；
- Residencia habitual/segunda vivienda；
- Seguros y productos vinculados；
- Amortización anticipada。

### 10.2 税费与保险

- 新房通常涉及 IVA，并可能涉及 AJD；二手房通常涉及 ITP；具体税率、减免和情形依自治区；
- 购房公证、登记、估值等费用单独展示；
- 房贷设立相关费用的承担方式与购房交易本身费用不能混为一谈；
- IBI、社区费和房屋保险作为持有成本；
- 绑定产品对利率的折扣应作为方案条件，不把保险保费藏在低利率方案中。

### 10.3 提前还款

对于 2019-06-16 后适用规则的住宅房贷，自然人借款场景的法定最高补偿按产品和时间区分，工具需版本化：

- 固定利率：前 10 年最高 2%，之后最高 1.5%；
- 浮动利率：合同选择前三年最高 0.25% 或前五年最高 0.15%，之后 0%；
- 浮动转固定的特定 novación/subrogación：前三年最高 0.05%，之后 0%；
- 实际收费还受合同及贷款人经济损失限制，不能一律按上限收费；
- 旧合同使用不同规则，必须询问合同日期。

### 10.4 免责声明要点

> Simulación orientativa. La cuota real puede variar por el método pactado, fechas, redondeos, revisiones del índice, bonificaciones, seguros, impuestos autonómicos y condiciones contractuales. No constituye una oferta ni asesoramiento financiero, fiscal o jurídico.

## 11. 摊销表需求

每期字段：

```text
periodNumber
paymentDate
openingBalance
annualRate
periodicRate
scheduledPayment
interest
principal
extraPayment
prepaymentFee
insurance
propertyTaxEscrowOrEquivalent
otherHousingCost
totalCashOutflow
closingBalance
rateResetMarker
contractTermEndMarker
```

交互要求：

- 月/年汇总切换；
- 本金、利息、余额图；
- 额外还款和利率重设标记；
- 固定期结束/续约节点；
- 筛选、分页和无障碍表格标题；
- 表内显示值与导出值一致；
- 任何假设变化都使结果和导出失效并重新计算。

## 12. CSV、PDF 与分享链接

### 12.1 CSV

- UTF-8 with BOM 可选，兼容 Excel；
- 机器字段名固定使用英文，另附本地化标题行可选；
- 小数点默认使用 `.`，避免本地格式造成机器解析错误；
- 元数据区包含国家、locale、货币、规则版本、计算时间、公式版本、输入和免责声明版本；
- 禁止使用 CSV 公式可执行前缀，导出前对 `= + - @` 开头的用户文本进行转义。

### 12.2 PDF

- 服务器生成，保证字体、分页和图表稳定；
- 首页为输入、核心结果和重要免责声明；
- 后续为年度摘要、完整月表、公式和来源；
- 显示“Generated on”和规则数据的“Effective date”；
- PDF 不作为贷款报价，不使用银行式“approved/eligible”措辞。

### 12.3 分享链接

分享链接只保存计算输入，不保存姓名、收入证明、信用分数等敏感信息。建议：

```text
/en-us/mortgage-calculator/s/{opaque_id}
```

要求：

- 使用不可枚举的随机 ID；
- 存储 schemaVersion、calculationEngineVersion、countryRuleVersion；
- 默认 90 天过期，可由用户永久保存时明确提示；
- 允许删除；
- 分享页默认 `noindex,follow`，canonical 指向主计算器；
- 打开旧链接时按原规则重放，并提示当前规则是否已更新；
- 不把全部输入编码在可被日志和分析工具采集的 query string 中。

## 13. URL、语言与 hreflang

建议单域名子目录：

```text
/en-us/mortgage-calculator/
/en-gb/mortgage-repayment-calculator/
/en-ca/mortgage-calculator/
/fr-ca/calculateur-hypothecaire/
/de-de/baufinanzierungsrechner/
/fr-fr/simulateur-pret-immobilier/
/es-es/calculadora-hipoteca/
```

规则：

- `en-US`、`en-GB`、`en-CA` 不是重复翻译，而是不同规则产品；
- 加拿大英语/法语内容和计算规则等价，可组成强 hreflang 对；
- 六国通用月供页若意图等价，可互相声明 hreflang；国家专属税费页、FHA、SDLT、CMHC、Sondertilgung 等页面不应强行互链为 alternate；
- 每组包含 self-reference、完整双向 return tags 和一个 `x-default`；
- canonical 必须自指且与 hreflang URL 完全一致；
- 大规模页面优先在 XML sitemap 集中维护 hreflang；
- `x-default` 建议指向国家/语言选择器，而不是武断指向美国页；
- 不基于 IP 强制跳转；只建议市场，并保留用户选择；
- HTML `lang`、货币、数字、日期和术语随 locale 改变。

英国内部四个税务法域不需要四种 hreflang；它们属于同一语言下的地区选择或独立税务工具页。

## 14. 结构化数据

### 14.1 推荐组合

主工具页：

- `WebApplication` 或 `SoftwareApplication`；
- `WebPage`；
- `BreadcrumbList`；
- `Organization`/`WebSite` 放在站点层级；
- 解释文章使用 `Article`，并提供真实作者、审核者和更新时间。

`SoftwareApplication` 建议字段：

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Mortgage Calculator",
  "url": "https://example.com/en-us/mortgage-calculator/",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Any",
  "inLanguage": "en-US",
  "isAccessibleForFree": true,
  "description": "Estimate mortgage principal and interest, total interest and an amortization schedule.",
  "publisher": {
    "@type": "Organization",
    "name": "Example"
  }
}
```

只使用页面上真实可见、可验证的属性。没有真实评分时禁止添加 `aggregateRating` 或虚构 `review`。

### 14.2 FAQPage 边界

- 页面可以有高质量 FAQ；
- 普通金融工具网站不应预期获得 Google FAQ 富结果；
- 如使用 `FAQPage`，内容必须与页面可见 FAQ 完全一致；
- 不把 FAQ schema 作为上线验收的 SEO KPI；
- JSON-LD 应出现在服务端初始 HTML 中。

## 15. 国家规则数据模型

法律、税率和产品门槛不得写死在组件中。建议：

```ts
interface CountryRuleSet {
  country: 'US' | 'GB' | 'CA' | 'DE' | 'FR' | 'ES';
  locale: string;
  currency: 'USD' | 'GBP' | 'CAD' | 'EUR';
  version: string;
  effectiveFrom: string;
  effectiveTo?: string;
  reviewedAt: string;
  sources: SourceRef[];
  rateConventions: RateConvention[];
  paymentFrequencies: PaymentFrequencyRule[];
  transactionTaxes: JurisdictionTaxTable[];
  recurringTaxes: RecurringCostRule[];
  insuranceRules: InsuranceRule[];
  prepaymentRules: PrepaymentRule[];
  roundingPolicy: RoundingPolicy;
  disclaimerVersion: string;
}
```

每条可变规则必须有：

- 法域；
- 生效/终止日期；
- 来源 URL；
- 来源发布日期或最后核验日期；
- 规则类型：法定、官方指引、市场惯例、产品假设；
- 自动计算或要求用户输入；
- 审核负责人；
- 下次复核日期。

## 16. 数据维护和准确性机制

“完整准确”不能靠一次性调研保证，必须建立持续维护：

1. 税率、门槛、保险费率和提前还款上限全部版本化；
2. 每月自动检查官方来源的内容变更；
3. 每季度人工复核六国规则；
4. 财政预算、税法或监管更新后触发即时复核；
5. 页面显示规则有效日期和最近审核日期；
6. 分享结果锁定原规则版本；
7. 旧版本保留可重放能力；
8. 计算内核和规则数据分别测试；
9. 每国至少选择一家监管/政府计算器做回归对照；
10. 对无法精确获取的地方税、保险报价明确要求用户输入，不伪造全国平均值。

## 17. 验收标准

### 17.1 数学验收

- 零利率、一期、超长贷款、小额本金和高利率不报错；
- 无额外还款时，最终余额在一个最小货币单位内归零；
- 提前还款不允许超过可偿还余额；
- 加拿大每种付款频率使用正确的等效周期利率；
- 利率重设后以重设时余额和剩余期数重算；
- 每期 `opening - principal - extra = closing`；
- 总本金等于初始本金，允许末期舍入调整；
- 总利息等于逐期利息之和；
- CSV、PDF、UI 核心结果一致。

### 17.2 国家规则验收

- 英国必须先选择税务法域，不能默认把 Scotland/Wales 当 SDLT；
- 加拿大 term 与 amortization 分字段；
- 德国必须显示 Zinsbindung 结束时 Restschuld；
- 法国保险前后月供分开展示；
- 西班牙提前还款规则要求合同日期和利率类型；
- 美国税率没有地区数据时显示用户输入，不显示“官方默认税率”。

### 17.3 SEO 与合规验收

- 所有可索引页自 canonical；
- hreflang 组全双向、含 self 和 x-default；
- 分享页 noindex；
- JSON-LD 与可见内容一致；
- 每页有方法说明、来源、最近审核日期、作者/审核者和更正入口；
- 不出现“保证准确”“一定获批”“最佳贷款”等无证据承诺；
- 同意前不把计算输入发送给广告或分析第三方；
- 隐私政策说明分享存储和删除机制。

## 18. 分期路线图

### Phase 0：规则与计算基线（2–3 周）

- Decimal 现金流内核；
- 规则数据 schema；
- 六国固定利率月付基准测试；
- 国家术语表；
- 来源登记和更新流程。

### Phase 1：MVP（5–7 周）

- 六国固定利率计算器；
- 加拿大多付款频率；
- 德国固定期剩余债务；
- 六国基础税费/保险输入；
- 摊销表、比较、CSV/PDF、分享；
- 国家级 URL、canonical、基础 hreflang 和 schema。

### Phase 2：本地深度（4–6 周）

- 美国 PMI/ARM 专项；
- 英国 deal/SVR 与三法域交易税；
- 加拿大 CMHC、省级/市级税和续约；
- 德国 Sondertilgung/Anschlussfinanzierung；
- 法国 assurance/TAEG/IRA；
- 西班牙 Euribor、混合利率、自治区税。

### Phase 3：SEO 工具矩阵

- affordability、extra payment、refinance/remortgage；
- rent vs buy；
- stamp duty/transfer tax/notary cost；
- 国家专项贷款类型；
- 有编辑审核的解释内容和案例，不批量生成薄页面。

## 19. 官方/权威来源登记

以下来源用于本版需求基线。动态规则上线前仍需再次核验。

### 美国

- CFPB：总月付组成与 escrow  
  https://www.consumerfinance.gov/ask-cfpb/on-a-mortgage-whats-the-difference-between-my-principal-and-interest-payment-and-my-total-monthly-payment-en-1941/
- CFPB：贷款成本  
  https://www.consumerfinance.gov/ask-cfpb/what-costs-come-with-taking-out-a-mortgage-en-153/
- CFPB：固定利率月供说明  
  https://www.consumerfinance.gov/ask-cfpb/how-do-mortgage-lenders-calculate-monthly-payments-en-1965/
- IRS Publication 530：房主税务信息  
  https://www.irs.gov/publications/p530

### 英国

- GOV.UK：SDLT 总览与法域区分  
  https://www.gov.uk/stamp-duty-land-tax
- GOV.UK：住宅 SDLT 税率  
  https://www.gov.uk/stamp-duty-land-tax/residential-property-rates
- Scottish Government：LBTT  
  https://www.gov.scot/policies/taxes/land-and-buildings-transaction-tax/
- Welsh Revenue Authority：LTT 税档  
  https://www.gov.wales/land-transaction-tax-rates-and-bands
- MoneyHelper：repayment/interest-only calculator  
  https://www.moneyhelper.org.uk/en/homes/buying-a-home/mortgage-repayment-calculator
- FCA：interest-only mortgage 研究  
  https://www.fca.org.uk/publications/research-notes/interest-only-mortgages-analysis-fca-mortgage-data-and-consumer-research

### 加拿大

- FCAC：最低首付和 mortgage loan insurance  
  https://www.canada.ca/en/financial-consumer-agency/services/mortgages/down-payment.html
- FCAC：付款频率和 property tax  
  https://www.canada.ca/en/financial-consumer-agency/services/mortgages/choose-mortgage.html
- FCAC：额外还款和 prepayment privilege  
  https://www.canada.ca/en/financial-consumer-agency/services/mortgages/pay-mortgage-faster.html
- Canada Interest Act  
  https://laws-lois.justice.gc.ca/eng/acts/i-15/index.html
- CMHC：mortgage loan insurance premium calculator  
  https://www.cmhc-schl.gc.ca/consumers/home-buying/calculators/mortgage-loan-insurance-premium-calculator

### 德国

- Bundesministerium der Finanzen：Grunderwerbsteuer  
  https://www.bundesfinanzministerium.de/Content/DE/Downloads/Broschueren_Bestellservice/steuern-von-a-z.pdf
- Verbraucherzentrale：融资模型  
  https://www.verbraucherzentrale.de/wissen/geld-versicherungen/bau-und-immobilienfinanzierung/immobilienfinanzierung-diese-modelle-gibt-es-und-das-sollten-sie-beachten-5801
- Verbraucherzentrale：购房预算和费用  
  https://www.verbraucherzentrale.de/wissen/geld-versicherungen/bau-und-immobilienfinanzierung/immobilienfinanzierung-so-berechnen-sie-was-sie-sich-leisten-koennen-5822
- Bundesministerium der Justiz：BGB  
  https://www.gesetze-im-internet.de/bgb/

### 法国

- Ministère de l'Économie：提前还款和 IRA  
  https://www.economie.gouv.fr/particuliers/emprunter-et-sassurer/rembourser-son-credit-immobilier-avant-le-terme-comment-ca
- ANIL：贷款合同、保险、TAEG、摊销表  
  https://www.anil.org/votre-besoin/acheter/financement/contrat-de-credit-immobilier/
- Service-Public：公证费/DMTO 变动  
  https://www.service-public.fr/particuliers/actualites/A18183?lang=fr
- Service-Public：taxe foncière  
  https://www.service-public.fr/particuliers/vosdroits/F59

### 西班牙

- Banco de España：月供与法国式摊销  
  https://clientebancario.bde.es/pcb/es/menu-horizontal/productosservici/financiacion/hipotecas/guia-textual/primerospasoscon/Cuota_hipotecaria.html
- Banco de España：官方模拟器及简化假设  
  https://clientebancario.bde.es/pcb/es/menu-horizontal/podemosayudarte/simuladores/simulador_prestamo_hipotecario_personal.html
- Banco de España：固定、浮动、混合利率  
  https://clientebancario.bde.es/pcb/es/blog/hipoteca-a-tipo-fijo--variable--mixto%E2%80%A6cuesta-decidir.html
- Banco de España：官方参考利率/Euribor  
  https://clientebancario.bde.es/pcb/es/menu-horizontal/productosservici/relacionados/tiposinteres/guia-textual/tiposinteresrefe/tipo_referencia_oficial_mercado_hipotecario.html
- Banco de España：2019 后提前还款最高补偿  
  https://clientebancario.bde.es/pcb/es/menu-horizontal/podemosayudarte/comisiones/comisionesproductosbancarios/compensacion-o-comision-por-reembolso-o-amortizacion-anticipada-total-o-parcial.html
- 西班牙政府行政门户：新房 IVA、二手房 ITP 与自治区权限  
  https://administracion.gob.es/pag_Home/va/Tu-espacio-europeo/derechos-obligaciones/ciudadanos/residencia/compraventa-bienes-inmuebles/impuestos

## 20. 尚需专项法务/数据确认的事项

这些内容不能仅依靠通用 PRD 直接上线为“精确自动计算”：

- 美国所有州/县的 property tax、PMI 自动取消及 FHA/VA/USDA；
- 英国三套交易税中的复杂 relief、leasehold、多人/多套住宅交易及历史生效规则；
- 加拿大各省和城市 transfer tax、保险商全费率、变量利率合同差异；
- 德国各州实时 Grunderwerbsteuer、经纪费分摊、Vorfälligkeitsentschädigung 个案；
- 法国各 département 最新 DMTO、首次购房者例外和精确 TAEG；
- 西班牙 17 个自治区的 ITP/AJD/减免以及旧合同提前还款规则。

上线策略应是：有经过复核的规则才自动计算；没有完整数据时让用户输入，并明确不确定性。不能为了页面看起来“完整”而填入未经证实的全国平均值。
