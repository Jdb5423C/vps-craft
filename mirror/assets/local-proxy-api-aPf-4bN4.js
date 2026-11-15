import{A as e,B as t,T as n,U as r,k as i,q as a,w as o}from"./vendor-vue-B-WzrGXX.js";import{t as s}from"./StandardArticleLayout-BFhFpHN2.js";var c={__name:`local-proxy-api`,setup(c){return(c,l)=>{let u=r(`RouterLink`);return t(),n(s,{slug:`local-proxy-api`,checkId:`local_proxy_api`,indexNumber:11,titleZH:`本地代理端口(7890/10808)探测风险检测：网页如何偷偷扫描你的Clash/v2rayN本地端口？`,titleEN:`Local Proxy Core RESTful API Leak: How Sites Probe Clash & Sing-box on 127.0.0.1`,summaryZH:`深度揭秘恶意网页与安全探针如何利用前端 fetch/WebSocket 静默扫描 localhost 的 9090、7890 等端口。若本地 Clash/Mihomo 外部控制接口未设置 Secret 密钥，任何网页都能一键读取你的真实代理节点列表（如“香港专线”、“沪美中继”）与流量明细，成为无可辩驳的铁证。`,summaryEN:`Unveil how JavaScript probes local ports (9090, 7890) to detect unauthenticated Clash/Sing-box REST APIs. Learn why an empty secret allows websites to read proxy node names and configurations directly.`,penaltyZH:`-25 分`,penaltyEN:`-25 pts`,riskLevel:`critical`,categoryZH:`网络与真实路由`,categoryEN:`Network & Routing`,keywords:[`Clash API泄露`,`9090端口`,`Sing-box内核`,`外部控制密钥`,`本地端口扫描`,`Claude封号`]},{default:a(()=>[l[3]||=o(`h2`,null,`一、 细思极恐的安全黑洞：任何网页都能访问你的 127.0.0.1`,-1),l[4]||=o(`p`,null,` 在国内的技术圈中，Clash（以及其衍生版 Clash Meta / Mihomo、Clash Verge Rev）、Sing-box、Surge 是几乎每个出海开发者电脑上的标配工具。 `,-1),l[5]||=o(`p`,null,[i(` 为了向用户提供精美的图形化界面（GUI）或 Web 控制台（Dashboard），这些代理内核在后台启动时，都会默认在本地回环网络开启一个 `),o(`strong`,null,`外部控制 RESTful API 服务`),i(`，通常监听在 `),o(`code`,null,`http://127.0.0.1:9090`),i(` 或 `),o(`code`,null,`http://localhost:9090`),i(`。 `)],-1),l[6]||=o(`p`,null,[i(` 然而，令人震惊的现实是：`),o(`strong`,null,`超过 80% 的国内开发者的本地代理内核 API，处于完全无密码（Secret 为空）的“裸奔”状态！`)],-1),l[7]||=o(`p`,null,` 这意味着什么？这意味着任何一个被你打开的普通网页（无论是恶意的第三方钓鱼站，还是 Anthropic / Cloudflare 的反欺诈检测探针），都可以在后台静默执行几行 JavaScript 代码，直接与你电脑上的代理内核促膝长谈！ `,-1),l[8]||=o(`h2`,null,`二、 攻击场景复现：网页是如何读取你的全部代理机密的？`,-1),l[9]||=o(`p`,null,` 不需要任何黑客工具，只需要在浏览器开发者控制台（Console）中粘贴如下代码： `,-1),l[10]||=o(`pre`,null,[o(`code`,null,`// 探测本地 Clash/Mihomo 代理内核的配置与节点信息
async function probeLocalProxyAPI() {
  const ports = [9090, 9091, 7890];
  
  for (const port of ports) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000);

      const res = await fetch(\`http://127.0.0.1:\${port}/version\`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        console.warn(\`[高危警告] 发现本地未授权代理内核，端口: \${port}\`, data);

        // 进一步读取节点列表！
        const proxiesRes = await fetch(\`http://127.0.0.1:\${port}/proxies\`);
        const proxiesData = await proxiesRes.json();
        console.log("你的全部代理节点明细:", proxiesData);
        return { isLeaking: true, port, data };
      }
    } catch (e) {
      // 端口未开启或已被密码拦截
    }
  }
  return { isLeaking: false };
}`)],-1),l[11]||=o(`div`,{class:`tech-card`},[o(`h3`,null,`裸奔 API 返回的致命数据样本`),o(`p`,null,` 如果你的 9090 端口没有设置访问口令，上述代码会直接吐出包含以下内容的 JSON 报文： `),o(`pre`,null,[o(`code`,null,`{
  "version": "Mihomo v1.18.5",
  "proxies": {
    "🇺🇸 美国专线-01": { "type": "vmess", "history": [...] },
    "🇭🇰 香港 CN2 游戏加速": { "type": "shadowsocks", "history": [...] },
    "深港 IPLC 专线": { "type": "hysteria2", "history": [...] }
  }
}`)]),o(`p`,null,[o(`strong`,null,`风控系统的定性：`),i(` 节点名称中包含了大量的中文汉字（如“专线”、“中继”、“IPLC”）、特定的机场协议特征。`),o(`strong`,null,`这不仅证明了你 100% 在使用翻墙代理，而且直接把你的机场节点命名和代理服务商直接送到了风控模型的数据库中！`)])],-1),l[12]||=o(`h2`,null,`三、 私有网络访问规范（PNA）为何没能完全挡住？`,-1),l[13]||=o(`p`,null,[i(` 有些资深工程师可能会反驳：“Chrome 不是在推行 `),o(`strong`,null,`Private Network Access (PNA)`),i(` 策略吗？公网网页不是不能随意向 `),o(`code`,null,`127.0.0.1`),i(` 发送请求吗？” `)],-1),l[14]||=o(`p`,null,` 现实情况比想象中严峻得多： `,-1),l[15]||=o(`ol`,null,[o(`li`,null,[o(`strong`,null,`PNA 规范推进极其缓慢：`),i(` 截至 2026 年，出于对企业内网老旧系统兼容性的考量，Chrome 依然只对部分复杂跨域请求进行了预检阻断，对无 CORS 标头的简单请求仅打印 Warning 警告，并未在所有平台实行一刀切丢弃。`)]),o(`li`,null,[o(`strong`,null,`WebSocket (WS) 穿透：`),i(` 很多内核的日志监听接口使用 `),o(`code`,null,`ws://127.0.0.1:9090/traffic`),i(`，WebSocket 的握手建立机制在很多浏览器版本中不受同源策略（Same-Origin Policy）约束。`)]),o(`li`,null,[o(`strong`,null,`TCP 端口时延指纹探测（Timing Attack）：`),i(` 即便浏览器拦截了 HTTP 响应的 Body 内容，网页脚本通过监听 `),o(`code`,null,`fetch()`),i(` 报错的耗时（Connection Refused 是 1ms，而 200 OK 后被 CORS 拦截是 15ms），也能以 99% 的置信度推算出本地 9090 或 7890 端口上正运行着一个活跃的 HTTP 监听服务！`)])],-1),l[16]||=o(`h2`,null,`四、 常见误区与自欺欺人做法`,-1),l[17]||=o(`table`,null,[o(`thead`,null,[o(`tr`,null,[o(`th`,null,`常见做法`),o(`th`,null,`实际底层表现`),o(`th`,null,`能否规避风险？`)])]),o(`tbody`,null,[o(`tr`,null,[o(`td`,null,`以为把代理客户端窗口最小化就安全了`),o(`td`,null,`客户端图形界面最小化，后台核心守护进程依然在监听 9090 端口`),o(`td`,null,[o(`strong`,null,`完全无效`),i(`，网页探测的是端口，不是看你有没有打开界面。`)])]),o(`tr`,null,[o(`td`,null,`仅在浏览器里使用隐身模式访问`),o(`td`,null,[i(`隐身模式完全可以正常访问 `),o(`code`,null,`127.0.0.1`),i(` 上的本地服务`)]),o(`td`,null,[o(`strong`,null,`完全无效`),i(`。`)])]),o(`tr`,null,[o(`td`,null,`更改了 7890 混合代理端口，但忘了改 9090 API 端口`),o(`td`,null,`反欺诈探针会遍历常见的一组端口（9090, 9091, 10808, 10809, 2011）`),o(`td`,null,[o(`strong`,null,`依然会被嗅探`),i(`。`)])])])],-1),l[18]||=o(`h2`,null,`五、 终极整改与防护方案`,-1),l[19]||=o(`p`,null,[i(` 为了杜绝本地代理内核 API 被任意网页探测，必须采取`),o(`strong`,null,`“强密码鉴权”`),i(`或`),o(`strong`,null,`“完全禁用外部控制”`),i(`： `)],-1),l[20]||=o(`h3`,null,[i(`方案 1：在 Clash / Mihomo 配置中强制设置 `),o(`code`,null,`secret`),i(` 访问密钥（强烈推荐）`)],-1),l[21]||=o(`p`,null,[i(` 打开你的 Clash / Mihomo 配置文件（或者在客户端的“设置 -> 外部控制”中），找到 `),o(`code`,null,`secret`),i(` 字段，填入一个高强度的随机口令： `)],-1),l[22]||=o(`pre`,null,[o(`code`,null,`# 外部控制设置
external-controller: 127.0.0.1:9090
# 核心：必须设置复杂密钥！严禁为空！
secret: "c8e1a7b9-claude-safe-token-2026"`)],-1),l[23]||=o(`p`,null,[i(` 设置密码后，任何未带 `),o(`code`,null,`Authorization: Bearer <secret>`),i(` 标头的 HTTP 请求都会直接被内核返回 `),o(`code`,null,`401 Unauthorized`),i(`，网页端脚本无法窃取任何节点信息或配置。 `)],-1),l[24]||=o(`h3`,null,`方案 2：如果不需要 Web 面板，直接关闭外部控制接口`,-1),l[25]||=o(`p`,null,` 如果你使用的是不需要 Web Dashboard 的轻量配置，可以直接将外部控制接口注释或置空： `,-1),l[26]||=o(`pre`,null,[o(`code`,null,`# 关闭外部控制监听
# external-controller: 127.0.0.1:9090`)],-1),l[27]||=o(`h3`,null,`方案 3：开启 Chrome 严格私有网络访问拦截`,-1),l[28]||=o(`p`,null,[i(` 在 Chrome 地址栏访问：`),o(`code`,null,`chrome://flags/#block-insecure-private-network-requests`),i(`，将其设置为 `),o(`strong`,null,`Enabled`),i(`，强制浏览器全面封杀任何公网页面向本地局域网发起的未经授权的通信。 `)],-1),l[29]||=o(`h2`,null,`六、 总结`,-1),l[30]||=o(`p`,null,` 本地代理内核 API 泄露是国内开发者群体中典型的“灯下黑”。它不仅能扣除高达 25 分的风控分，更可能直接泄露敏感的机场订阅与网络拓扑。 `,-1),o(`p`,null,[l[1]||=i(` 请立即访问我们的 `,-1),e(u,{to:`/tools/ip?tab=claude`},{default:a(()=>[...l[0]||=[i(`Claude Code 专项检测工具`,-1)]]),_:1}),l[2]||=i(`，观察你的 9090/7890 端口是否亮起红灯。如果处于泄露状态，请务必花 30 秒为你的代理客户端设置一个强口令，彻底封死这个隐秘后门！ `,-1)])]),_:1})}}};export{c as default};