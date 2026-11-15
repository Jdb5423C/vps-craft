# VPS-Craft 静态镜像 (vps-craft.com offline mirror)

抓取时间: 2026-11-13（北京时间）
源站: https://vps-craft.com/ （Vue SSG 预渲染站点，Netlify 托管，Cloudflare CDN）

## 目录结构

```
vps-craft-mirror/
├── README.md              本文件
├── start-server.bat       一键本地启动（python -m http.server 8090）
├── mirror/                ===== 静态站根目录 =====
│   ├── index.html         首页（VPS 优惠大盘）
│   ├── <path>/index.html  每个原站 URL 对应一个目录 + index.html
│   │   ├── provider/<商>/index.html   厂商档案（57 家，含 sitemap 全部 56 家）
│   │   ├── deal/<id>/index.html       套餐详情页（1709 个，与首页宣称的 1703+ 一致）
│   │   ├── compare/…                  横向对比（168 篇）
│   │   ├── docs/…                     深度测评文档（80 篇）
│   │   ├── guides/…                   分类指南（18 篇）
│   │   ├── news/…(29) tools/…(17) region/… line/… tier/… campaign/… event/…
│   │   └── budget/monthly-cheap/page/N …  列表分页（服务端分页已整链抓取）
│   ├── assets/            JS / CSS 构建产物（Vite hash 文件名，141 个）
│   ├── fonts/ images/ og/ doc-images/ provider-favicons/ icons/   图片与字体
│   ├── rss.xml atom.xml sitemap.xml robots.txt manifest.webmanifest favicon.svg
```

## 使用方法

### 方式一：本地 HTTP 服务（推荐，功能最完整）
双击 `start-server.bat`（或在 mirror 目录运行 `python -m http.server 8090`），
浏览器打开 http://127.0.0.1:8090/ 。页面内所有站内链接均已验证可达；
Vue 构建产物同步在本地，列表筛选/搜索/表格排序等交互可用。

### 方式二：直接双击 HTML（file:// 离线快照）
每个页面都带完整预渲染 HTML，`file://` 打开即为静态快照，
站内链接已改写为相对路径可直接跳转；仅 JS 动态渲染部分不执行（ES module 在 file:// 下被 CORS 拦截）。

## 链接改写规则
- `https://vps-craft.com/x` 和根路径 `/x` → 相对本地文件路径（仅当本地存在该文件时改写）；
- `href="/go/<id>"`（厂商购买跳转，Cloudflare 对爬虫 403，且目标本就是外站）→ 保持绝对线上地址
  `https://vps-craft.com/go/<id>`，联网时点击仍然有效，共 542 个；
- `<script>` / `<style>` 块内部的 URL 不改写（JSON-LD 结构化数据与 `__INITIAL_STATE__` 保留原始绝对 URL，保证数据保真）；
- 外部域名（厂商官网、GitHub 等）保持原样。

## 已知限制（离线快照的固有行为）
1. 「库存检查 / 神车监控 / 实时测速」等运行时 API 调用需要联网且依赖源站后端，离线不可用；
2. 购买按钮指向 /go/ 联盟跳转（见上），属外部页面；
3. 个别工具页（如 IP 检测、traceroute）本身是实时探测工具，静态化后仅剩 UI；
4. 抓取时源站价格/库存以当日快照为准，此后更新不会同步；
5. 站内存在 124 个原站本身就是死链的链接（如 compare 页"相关阅读"里的裸 slug `/xxx-2026`、`/provider/cloudcone`），
   线上服务器同样返回 404，镜像保持 1:1 未做修正；另有 101 张 `doc-images/*/coupon-verify.png` 类图片在线上即 404；
6. 厂商/套餐列表的页内翻页、筛选为 Vue 客户端行为（`/provider/xxx/page/2` 在线上不存在）；
   `budget|region|tier…` 等大盘列表的服务端分页已全链抓取。

## 统计
- 页面: 3297 个 HTML（deal 详情 1709、provider 57、compare 168、docs 80、news 29、guides 18、tools 17，其余为大盘/活动/指南列表及分页）
- 静态资源文件: 397 个成功下载（JS/CSS 141、图片/字体/图标等；101 个线上 404 的资源除外）；mirror 内文件总数 3694
- 总大小: 477 MB
- 校验: 除上述原站自带死链外，站内链接全部解析到本地文件；核心页面（首页/deal/compare/provider/分页/JS 资源）经 http://127.0.0.1:8090 冒烟测试 200 OK
- 明细: verify_missing.json（124 个与线上一致的死链）、asset_failures.json（101 个线上 404 图片）、go_links.json（542 个购买跳转）、crawl_errors.json

## 合规说明
镜像仅供个人离线浏览/存档。robots.txt 对通用 UA 为 Allow: /，且声明
Content-Signal: ai-train=no（禁止用于 AI 训练）；本站为部分厂商的联盟推广伙伴，
文案与数据版权归 VPS DevCraft Studio 所有，请勿线上公开分发副本。
