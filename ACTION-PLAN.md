# MortgageBreezy 90 天 SEO + GEO 执行方案

## 0–7 天：先修错误信号

1. 动态输出每个 locale 的根 `<html lang>`。
2. 修复所有本地化页面的 methodology、privacy、legal 内链。
3. 统一 canonical 主机并将 HTTP/apex 直接一跳到最终 URL。
4. 标准地区页静态化或设置 revalidate，使 Vercel CDN 可命中。
5. 翻译未完成的文章路由不生成或返回 404；完成后才加入 sitemap/hreflang。
6. 配置 GSC、GA4 与 Bing Webmaster Tools；提交 sitemap，并建立 MortgageBreezy 周报数据目录。

验收：13 个 sitemap URL 仍为 200；根 lang、canonical、hreflang 一致；标准页出现 CDN HIT；GSC 能看到 sitemap 与索引状态。

## 8–30 天：建立可排名的 P0 工具集

1. 将英文 amortization、extra payments、affordability 从薄指南升级为独立交互工具，而不是仅改 title。
2. Extra payment 支持 recurring monthly、annual、one-time lump sum、start/end date。
3. Affordability 支持 income、debt、down payment、DTI，并明确它不是贷款资格判断。
4. 每页增加公式、可复核示例表、限制、来源、last reviewed 和内部链接。
5. 建立真实作者、审核者、编辑政策、纠错政策和联系入口。
6. 拆分并关联 WebPage、SoftwareApplication、Organization、Person/Article Schema。

验收：每个工具都有独立搜索任务、独立 URL、SSR 输入/默认结果、3–5 个引用块、真实署名与来源。

## 31–60 天：做深三个市场

### 美国

- 围绕 PITI + PMI + HOA + flood insurance 做完整月供入口。
- 拆 FHA、VA、USDA、15 vs 30 year；只有功能与规则足够独立时才建 URL。

### 英国

- 建 mortgage overpayment calculator。
- 将 SDLT、LBTT、LTT 按法域拆清；补 repayment vs interest-only、fees、early repayment charge 边界。

### 加拿大

- 建 accelerated biweekly 对比页。
- 补 CMHC insurance、GDS/TDS affordability；引用 FCAC/CMHC 官方来源。

验收：每个市场至少有 1 个 hub + 2 个真正独立的专项工具；本地术语、规则、来源、FAQ 均不是机械翻译。

## 61–90 天：扩大主题权威与 GEO 信号

1. 上线 refinance break-even / rate change calculator。
2. 试点 10–20 个金额/利率情景页，使用严格质量门，不批量铺量。
3. 建立公开数据/示例库和变更日志，使本站产生可被引用的第一方资产。
4. 上线带字幕的国家工具演示，并统一品牌资料和 sameAs。
5. 发布更新 URL 时向 IndexNow 提交；持续监测 GSC 的 queries、CTR、country、page cannibalization。

## 每周 KPI

| 阶段 | 核心指标 |
|---|---|
| 技术 | 有效索引页、lang/canonical/hreflang 错误、TTFB、CWV 通过率 |
| 内容 | 获得 impressions 的页面数、Top 20 查询数、非品牌点击、长尾覆盖 |
| SXO | SERP CTR、工具完成率、结果分享/下载率、回访率 |
| GEO | AI 引用/提及、品牌实体检出、被引用页面、外部来源域数量 |

## 决策规则

- 先依据 GSC impressions 选择扩写页面，不凭主观月搜索量批量生产。
- 同一查询若两个 URL 同时获得曝光，合并意图或明确页面分工。
- 任何金融规则变化都更新 reviewed date、来源和 changelog。
- 不虚构作者、资质、统计、评价、用户数量或第三方背书。
- 30 天后仍无曝光的模板页不继续复制，应先检查索引、意图和质量。
