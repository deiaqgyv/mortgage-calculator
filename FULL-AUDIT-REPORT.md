# MortgageBreezy SEO + GEO 审计报告

审计日期：2026-09-10

目标站点：https://www.mortgagebreezy.com

范围：线上 13 个 sitemap URL、robots.txt、sitemap.xml、llms.txt、本地 Next.js 源码、实时可见 SERP 样本与竞品页面。

## 1. 结论摘要

综合 SEO 健康度：**70/100**。站点已具备可抓取、SSR、canonical、hreflang、结构化数据、地区化计算和官方来源等良好基础，但当前还不是“有竞争力的金融搜索资产”。最大限制不是标签数量，而是：

1. 搜索资产与品牌权威几乎从零开始；未接入本项目的 GSC 数据，公开搜索样本中也未稳定识别到品牌结果。
2. YMYL 信任不足：没有可验证的实名作者、合格审核者、作者页、编辑政策、纠错与利益冲突机制。
3. 6 篇英文指南仅约 366–788 个抓取词，主体通常只有 2–5 段，缺公式、可复核案例、逐条来源与深度国家规则。
4. 所有地区页顶层 `<html lang>` 都错误输出 `en-US`；非英文页面还把 methodology、privacy、legal 内链回英文版本。
5. 计算器响应 `private, no-cache, no-store`，Vercel 每次 MISS；实测 TTFB 约 0.69–1.62 秒，且首屏加载约 328 KB 压缩 JavaScript，存在 LCP/INP 风险。
6. 关键词架构仍以“一个大计算器 + 薄指南”为主，尚未形成 amortization、extra payment、affordability、refinance 等独立工具入口。

## 2. 分类评分

| 类别 | 分数 | 判断 |
|---|---:|---|
| 技术 SEO | 74 | 可抓取与索引基础合格；语言、缓存、重定向和性能需修复 |
| 内容与 E-E-A-T | 58 | 功能真实，但金融 YMYL 权威证明和内容深度不足 |
| On-page | 76 | Title、description、H1、canonical 基本完整；页面任务仍不够细分 |
| Schema | 72 | 类型覆盖较全，但实体薄、复合类型关系不够规范 |
| 性能 | 62 | 无真实 CrUX；TTFB、无缓存和客户端边界构成风险 |
| GEO / AI 搜索 | 71 | SSR、llms.txt、来源日期是优势；可引用性和外部实体信号不足 |
| 综合 | **70** | 基础可用，权威、内容资产与搜索分工尚未成型 |

说明：PageSpeed Insights 公共接口本次返回 quota exceeded，因此性能分数是响应、资源与实现风险评分，不是 Lighthouse/CrUX 实测分。

## 3. 现有页面与功能资产

- 7 个地区计算器：美国、英国、加拿大英语/法语、德国、法国、西班牙。
- 美国：本金利息、税、保险、PMI、HOA、洪水险、贷款类型、额外还款。
- 英国：repayment/interest-only、overpayment、SDLT/LBTT/LTT。
- 加拿大：半年度复利、monthly/biweekly/accelerated-biweekly、省级转让或登记费用。
- 德国/法国/西班牙：当地税费或州/地区差异。
- 输出：总利息、还清时间、场景对比、摊销表、CSV、PDF、分享链接。
- 6 篇英文内容页：amortization、extra payments、affordability、methodology、legal、privacy。

这些“地区税费 + 额外还款 + 可复核摊销”是本站真正的差异化，不应把产品定位退化为普通月供计算器。

## 4. 已通过的 SEO 基础

- robots.txt、sitemap.xml、llms.txt 均为 200。
- sitemap 内 13 个 URL 均返回 200。
- 7 个计算器都有 self-canonical。
- HTML 和 sitemap 均有互惠 hreflang：en-US、en-GB、en-CA、fr-CA、de-DE、fr-FR、es-ES、x-default。
- 原始 HTML 已包含 title、description、H1、正文、默认结果、FAQ 与链接；核心信息不依赖 Google 执行 JS。
- 分享参数 URL 为 noindex,follow，并 canonical 回标准页面。
- 现有 JSON-LD 覆盖 SoftwareApplication/WebPage、FAQPage、BreadcrumbList、Organization、Article。
- 计算数据标注 effective date、review date、适用范围、包含与排除项。

## 5. 关键问题

### P0：国际页面语言信号冲突

fr-CA、de-DE、fr-FR、es-ES 等页面的顶层 HTML 都是 `<html lang="en-US">`。虽然 `<main>` 有动态语言，搜索引擎和辅助技术首先读取的是根元素。这与 hreflang、正文语言和 JSON-LD `inLanguage` 冲突。

### P0：YMYL 作者与审核体系缺失

页面用 “MortgageBreezy Editorial Team” 作为组织作者，但无独立 URL、实名、资质、审核者或联系方式。金融计算属于 YMYL；仅有免责声明不能替代内容责任与专业审核。

### P0：关键词与页面任务没有拆开

实时 SERP 显示核心 calculator 查询几乎由 Tool/Interactive 页面主导。当前 `/amortization` 和 `/extra-payments` 是文字指南，不是完整独立工具，因此无法充分满足强工具意图。

### P1：内容不可充分引用

优点是已有 Short answer、FAQ、公式说明和官方税务来源。缺点是多数答案太短、营销式 H2 较多，缺 134–167 词左右的自包含证据段、带输入/结果的示例和逐条引用。GEO 模型容易理解，但缺乏值得引用的独特结论。

### P1：缓存与前端性能

计算器标准页完全禁用缓存，Vercel MISS。页面引用约 11 个 JS chunk、合计约 328 KB；完整摊销表可能一次渲染数百行。建议静态化默认页面，只让交互部分客户端运行，并对大表分页或虚拟化。

### P1：多语言链不完整

非英文计算器的 methodology、privacy、legal 链接硬编码到 en-US。非英文文章路由虽然 noindex，但仍返回 200 和英文正文。翻译完成前应不生成这些路由，或返回 404；完成后再进入 sitemap 与 hreflang 集群。

### P1：Schema 实体过薄

应将 SoftwareApplication 与 WebPage 拆成带 `@id` 的独立节点，并通过 `mainEntity` / `isPartOf` 关联；Organization 补真实 logo、description、contactPoint、sameAs；文章补真实 Person 作者与 reviewedBy。不能虚构资质、评分或评论。

### P2：品牌与 AI 外部信号薄弱

品牌精确词及 Reddit、YouTube、LinkedIn、Wikipedia 组合搜索未稳定识别到本品牌实体，且存在同名 Breezy 品牌混淆。llms.txt 有效，但 llms.txt 本身不是排名通行证；外部权威提及和统一实体资料更重要。

## 6. 实时 SERP 与竞品启示

当前结果页形成强共识：用户先要工具，再要解释。代表性页面包括：

- [Bankrate Amortization Calculator](https://www.bankrate.com/mortgages/amortization-calculator/)：逐期本金/利息、公式和边界说明。
- [Redfin Mortgage Calculator](https://www.redfin.com/mortgage-calculator)：PITI、PMI、HOA 和完整月供。
- [MoneyHelper UK](https://www.moneyhelper.org.uk/en/homes/buying-a-home/mortgage-repayment-calculator)：repayment/interest-only 与英国金融语境。
- [CMHC Canada calculators](https://www.cmhc-schl.gc.ca/consumers/home-buying/calculators)：保险、affordability、GDS/TDS 工具集。
- [Moneysmart Australia](https://moneysmart.gov.au/home-loans/mortgage-calculator)：还款频率、提前还款与官方数据。
- [Sparkasse Baufinanzierungsrechner](https://www.sparkasse.de/rechner/baufinanzierungsrechner.html)：Monatsrate、Restschuld、Zinsbindung、Tilgung。

结论：MortgageBreezy 不应正面只抢 `mortgage calculator`。可行路线是“国家规则长尾 + 专项计算器 + 可验证证据”。

## 7. 关键词—页面映射

| 优先级 | 目标页面 | 主关键词簇 | 页面任务 |
|---|---|---|---|
| P0 | `/en-us/mortgage-calculator` | mortgage calculator with taxes and insurance; PMI; HOA; extra payments | 美国完整住房月供 hub |
| P0 | `/en-us/mortgage-calculator/amortization-calculator` | amortization calculator; mortgage amortization schedule | 独立交互工具 + 全表 + 公式 |
| P0 | `/en-us/mortgage-calculator/extra-payment-calculator` | extra mortgage payment calculator; payoff calculator | 月度/年度/一次性额外还款 |
| P0 | `/en-us/mortgage-calculator/affordability-calculator` | how much house can I afford; mortgage affordability | 收入、债务、首付、DTI 场景 |
| P1 | `/en-gb/mortgage-calculator` | UK mortgage repayment calculator; mortgage overpayment calculator | 英国还款与 overpayment hub |
| P1 | UK 专项工具 | stamp duty calculator; SDLT; LBTT; LTT | 分法域税费计算器 |
| P1 | `/en-ca/mortgage-calculator` | mortgage calculator Canada; accelerated biweekly | 加拿大半年度复利 hub |
| P1 | Canada 专项工具 | CMHC insurance calculator; GDS TDS calculator | 保险与 affordability |
| P1 | Germany 专项工具 | Baufinanzierungsrechner; Tilgungsrechner; Restschuld Rechner | 德国贷款术语与州规则 |
| P2 | 美国情景页 | $200k/$300k mortgage payment; payment at 5/6/7 percent | 小规模、高质量、预计算示例页 |

不要一次上线大量“金额 × 利率 × 国家”模板页。每页必须有独特表格、假设、比较场景、来源、更新时间与内部链接，否则会形成薄页和索引膨胀。

## 8. GEO 方案

GEO Readiness：**71/100**。

1. 每个工具页在首屏后放 40–80 词直接答案：需要输入什么、输出什么、包含/不包含什么。
2. 每页制作 3–5 个自包含回答块：先用 40–60 词给结论，再给公式、条件、示例和官方来源。
3. H2 改成真实问题，例如 “How are extra payments applied?”、“Does this include PMI?”、“How does Canadian mortgage interest compound?”。
4. 增加静态 HTML 示例表，给出明确输入与结果；图形必须同时有文本摘要，保证 AI 无需操作界面也能引用。
5. 建立 `/about/`、`/editorial-policy/`、`/authors/.../`、`/sources/`；所有署名、审核和资质必须真实可验证。
6. 完善 llms.txt：作者/审核机制、数据版本、官方来源目录、更新日期和许可。RSL 许可是否开放训练需先做商业决策，不应机械部署。
7. 建立一致的 LinkedIn/YouTube 品牌实体；发布带字幕的国家规则演示。第三方社区只做透明、有价值的解释，禁止自发垃圾链接。

## 9. 数据限制

- 当前项目没有 MortgageBreezy 的 GSC/GA4 周报数据，因此不能声称精确自然流量、CTR、平均排名或关键词月搜索量。
- `site:` 与品牌词搜索只能判断“公开可见性很弱”，不能替代 Search Console 的索引覆盖与查询报告。
- 实时 WebSearch 用于判断 SERP 页型和竞品功能，不等同于指定国家、城市、设备的 Google 前 10 精确排名。
- 下一轮必须导入 GSC：过去 28/90 天 queries、pages、countries、devices、index coverage；有真实 impressions 后再调整关键词优先级。
