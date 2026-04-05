# www.markforged.tw 全站頁面驗證報告
- 檢查時間：2026-04-05 Asia/Taipei
- 檢查方式：逐頁 HTTP 驗證 + HTML 標題/H1 + 本地資源存在性 + 站內連結檢查 + 內容異常規則掃描
- 站點根目錄：`/tmp/markforged-tw-backup`
## 驗證總表
| 頁面 | HTTP | Title | H1 | 主要結論 |
|---|---:|---|---|---|
| `about.html` | 200 | 關於我們 | Markforged 台灣 | 製造革命的推動者 | 正常 |
| `aerospace.html` | 200 | 航太與國防解決方案 | Markforged 台灣 | 航太與國防 | 正常 |
| `automotive.html` | 200 | 汽車製造解決方案 | Markforged 台灣 | 汽車製造 | 正常 |
| `cases/index.html` | 200 | 客戶案例 | Markforged 台灣 | 全球頂尖企業 選擇 Markforged | 正常 |
| `cases.html` | 200 | 客戶案例 | Markforged 台灣 | 全球頂尖企業 選擇 Markforged | 正常 |
| `contact/index.html` | 200 | 聯絡我們 | Markforged 台灣 | 讓我們開始 合作 | 正常 |
| `contact.html` | 200 | 聯絡我們 | Markforged 台灣 | 讓我們開始 合作 | 正常 |
| `cpg.html` | 200 | 消費品製造解決方案 | Markforged 台灣 | 消費品製造 | 正常 |
| `defense.html` | 200 | 國防與政府解決方案 | Markforged 台灣 | 國防與政府 | 正常 |
| `education.html` | 200 | 教育與研究解決方案 | Markforged 台灣 | 教育與研究 | 正常 |
| `electronics.html` | 200 | 電子製造解決方案 | Markforged 台灣 | 電子製造 | 正常 |
| `energy.html` | 200 | 能源產業解決方案 | Markforged 台灣 | 能源產業 | 正常 |
| `food.html` | 200 | 食品飲料解決方案 | Markforged 台灣 | 食品飲料 | 正常 |
| `fx10/index.html` | 200 | FX10 – 複合材料 + 金屬一體工業機 | Markforged 台灣 | FX10 | 正常 |
| `fx10.html` | 200 | FX10 – 複合材料 + 金屬一體工業機 | Markforged 台灣 | FX10 | 正常 |
| `fx20/index.html` | 200 | FX20 – 大型高溫工業 3D 列印機 | Markforged 台灣 | FX20 | 正常 |
| `fx20.html` | 200 | FX20 – 大型高溫工業 3D 列印機 | Markforged 台灣 | FX20 | 正常 |
| `index.html` | 200 | 工業級 3D 列印解決方案 | Markforged 台灣 | 重新定義 工業製造 的未來 | 正常 |
| `industrial.html` | 200 | 工業設備解決方案 | Markforged 台灣 | 工業設備 | 正常 |
| `materials.html` | 200 | 材料總覽 | Markforged 台灣 | Markforged 材料平台 | materials 模板語句未清理 |
| `medical.html` | 200 | 醫療解決方案 | Markforged 台灣 | 醫療 | 正常 |
| `packaging.html` | 200 | 包裝機械解決方案 | Markforged 台灣 | 包裝機械 | 正常 |
| `product-dev.html` | 200 | 產品開發解決方案 | Markforged 台灣 | 產品開發 | 正常 |
| `products/index.html` | 200 | 產品總覽 | Markforged 台灣 | Markforged 產品系列 | 正常 |
| `products.html` | 200 | 產品總覽 | Markforged 台灣 | Markforged 產品系列 | 正常 |
| `px100/index.html` | 200 | PX100 – 高速金屬噴印系統 | Markforged 台灣 | PX100 | 正常 |
| `px100.html` | 200 | PX100 – 高速金屬噴印系統 | Markforged 台灣 | PX100 | 正常 |
| `solutions/index.html` | 200 | 產業解決方案 | Markforged 台灣 | 全產業 製造賦能 | 正常 |
| `solutions.html` | 200 | 產業解決方案 | Markforged 台灣 | 全產業 製造賦能 | 正常 |
| `thanks.html` | 200 | 已收到您的詢問 | Markforged 台灣 | 我們已收到您的 詢問 | body too short / suspicious |
| `x7fe.html` | 200 | X7 Field Edition | Markforged 台灣 | X7 Field Edition | 正常 |

## 詳細紀錄
### about.html
- URL: `https://www.markforged.tw/about.html`
- HTTP: `200`
- Body Length: `15310`
- Title: `關於我們 | Markforged 台灣`
- H1: `製造革命的推動者`
- 問題: 無明顯異常

### aerospace.html
- URL: `https://www.markforged.tw/aerospace.html`
- HTTP: `200`
- Body Length: `3541`
- Title: `航太與國防解決方案 | Markforged 台灣`
- H1: `航太與國防`
- 問題: 無明顯異常

### automotive.html
- URL: `https://www.markforged.tw/automotive.html`
- HTTP: `200`
- Body Length: `3480`
- Title: `汽車製造解決方案 | Markforged 台灣`
- H1: `汽車製造`
- 問題: 無明顯異常

### cases/index.html
- URL: `https://www.markforged.tw/cases/index.html`
- HTTP: `200`
- Body Length: `17877`
- Title: `客戶案例 | Markforged 台灣`
- H1: `全球頂尖企業 選擇 Markforged`
- 問題: 無明顯異常

### cases.html
- URL: `https://www.markforged.tw/cases.html`
- HTTP: `200`
- Body Length: `17877`
- Title: `客戶案例 | Markforged 台灣`
- H1: `全球頂尖企業 選擇 Markforged`
- 問題: 無明顯異常

### contact/index.html
- URL: `https://www.markforged.tw/contact/index.html`
- HTTP: `200`
- Body Length: `10284`
- Title: `聯絡我們 | Markforged 台灣`
- H1: `讓我們開始 合作`
- 問題: 無明顯異常

### contact.html
- URL: `https://www.markforged.tw/contact.html`
- HTTP: `200`
- Body Length: `10284`
- Title: `聯絡我們 | Markforged 台灣`
- H1: `讓我們開始 合作`
- 問題: 無明顯異常

### cpg.html
- URL: `https://www.markforged.tw/cpg.html`
- HTTP: `200`
- Body Length: `3442`
- Title: `消費品製造解決方案 | Markforged 台灣`
- H1: `消費品製造`
- 問題: 無明顯異常

### defense.html
- URL: `https://www.markforged.tw/defense.html`
- HTTP: `200`
- Body Length: `3487`
- Title: `國防與政府解決方案 | Markforged 台灣`
- H1: `國防與政府`
- 問題: 無明顯異常

### education.html
- URL: `https://www.markforged.tw/education.html`
- HTTP: `200`
- Body Length: `3482`
- Title: `教育與研究解決方案 | Markforged 台灣`
- H1: `教育與研究`
- 問題: 無明顯異常

### electronics.html
- URL: `https://www.markforged.tw/electronics.html`
- HTTP: `200`
- Body Length: `3478`
- Title: `電子製造解決方案 | Markforged 台灣`
- H1: `電子製造`
- 問題: 無明顯異常

### energy.html
- URL: `https://www.markforged.tw/energy.html`
- HTTP: `200`
- Body Length: `3438`
- Title: `能源產業解決方案 | Markforged 台灣`
- H1: `能源產業`
- 問題: 無明顯異常

### food.html
- URL: `https://www.markforged.tw/food.html`
- HTTP: `200`
- Body Length: `3435`
- Title: `食品飲料解決方案 | Markforged 台灣`
- H1: `食品飲料`
- 問題: 無明顯異常

### fx10/index.html
- URL: `https://www.markforged.tw/fx10/index.html`
- HTTP: `200`
- Body Length: `12933`
- Title: `FX10 – 複合材料 + 金屬一體工業機 | Markforged 台灣`
- H1: `FX10`
- 問題: 無明顯異常

### fx10.html
- URL: `https://www.markforged.tw/fx10.html`
- HTTP: `200`
- Body Length: `12933`
- Title: `FX10 – 複合材料 + 金屬一體工業機 | Markforged 台灣`
- H1: `FX10`
- 問題: 無明顯異常

### fx20/index.html
- URL: `https://www.markforged.tw/fx20/index.html`
- HTTP: `200`
- Body Length: `13516`
- Title: `FX20 – 大型高溫工業 3D 列印機 | Markforged 台灣`
- H1: `FX20`
- 問題: 無明顯異常

### fx20.html
- URL: `https://www.markforged.tw/fx20.html`
- HTTP: `200`
- Body Length: `13516`
- Title: `FX20 – 大型高溫工業 3D 列印機 | Markforged 台灣`
- H1: `FX20`
- 問題: 無明顯異常

### index.html
- URL: `https://www.markforged.tw/`
- HTTP: `200`
- Body Length: `25711`
- Title: `工業級 3D 列印解決方案 | Markforged 台灣`
- H1: `重新定義 工業製造 的未來`
- 問題: 無明顯異常

### industrial.html
- URL: `https://www.markforged.tw/industrial.html`
- HTTP: `200`
- Body Length: `3493`
- Title: `工業設備解決方案 | Markforged 台灣`
- H1: `工業設備`
- 問題: 無明顯異常

### materials.html
- URL: `https://www.markforged.tw/materials.html`
- HTTP: `200`
- Body Length: `3653`
- Title: `材料總覽 | Markforged 台灣`
- H1: `Markforged 材料平台`
- 問題:
  - materials 模板語句未清理

### medical.html
- URL: `https://www.markforged.tw/medical.html`
- HTTP: `200`
- Body Length: `3440`
- Title: `醫療解決方案 | Markforged 台灣`
- H1: `醫療`
- 問題: 無明顯異常

### packaging.html
- URL: `https://www.markforged.tw/packaging.html`
- HTTP: `200`
- Body Length: `3463`
- Title: `包裝機械解決方案 | Markforged 台灣`
- H1: `包裝機械`
- 問題: 無明顯異常

### product-dev.html
- URL: `https://www.markforged.tw/product-dev.html`
- HTTP: `200`
- Body Length: `3470`
- Title: `產品開發解決方案 | Markforged 台灣`
- H1: `產品開發`
- 問題: 無明顯異常

### products/index.html
- URL: `https://www.markforged.tw/products/index.html`
- HTTP: `200`
- Body Length: `10915`
- Title: `產品總覽 | Markforged 台灣`
- H1: `Markforged 產品系列`
- 問題: 無明顯異常

### products.html
- URL: `https://www.markforged.tw/products.html`
- HTTP: `200`
- Body Length: `10915`
- Title: `產品總覽 | Markforged 台灣`
- H1: `Markforged 產品系列`
- 問題: 無明顯異常

### px100/index.html
- URL: `https://www.markforged.tw/px100/index.html`
- HTTP: `200`
- Body Length: `13303`
- Title: `PX100 – 高速金屬噴印系統 | Markforged 台灣`
- H1: `PX100`
- 問題: 無明顯異常

### px100.html
- URL: `https://www.markforged.tw/px100.html`
- HTTP: `200`
- Body Length: `13303`
- Title: `PX100 – 高速金屬噴印系統 | Markforged 台灣`
- H1: `PX100`
- 問題: 無明顯異常

### solutions/index.html
- URL: `https://www.markforged.tw/solutions/index.html`
- HTTP: `200`
- Body Length: `8905`
- Title: `產業解決方案 | Markforged 台灣`
- H1: `全產業 製造賦能`
- 問題: 無明顯異常

### solutions.html
- URL: `https://www.markforged.tw/solutions.html`
- HTTP: `200`
- Body Length: `8905`
- Title: `產業解決方案 | Markforged 台灣`
- H1: `全產業 製造賦能`
- 問題: 無明顯異常

### thanks.html
- URL: `https://www.markforged.tw/thanks.html`
- HTTP: `200`
- Body Length: `865`
- Title: `已收到您的詢問 | Markforged 台灣`
- H1: `我們已收到您的 詢問`
- 問題:
  - body too short / suspicious

### x7fe.html
- URL: `https://www.markforged.tw/x7fe.html`
- HTTP: `200`
- Body Length: `3791`
- Title: `X7 Field Edition | Markforged 台灣`
- H1: `X7 Field Edition`
- 問題: 無明顯異常

## 結論摘要
- 總頁數：`31`
- 無明顯異常頁數：`29`
- 需修正頁數：`2`
- 需優先修正：
  - `materials.html`：materials 模板語句未清理
  - `thanks.html`：body too short / suspicious
