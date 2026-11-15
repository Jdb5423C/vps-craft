import{A as e,B as t,T as n,U as r,k as i,q as a,w as o}from"./vendor-vue-B-WzrGXX.js";import{t as s}from"./StandardArticleLayout-BFhFpHN2.js";var c={__name:`http3-udp`,setup(c){return(c,l)=>{let u=r(`RouterLink`);return t(),n(s,{slug:`http3-udp`,checkId:`http3_udp`,indexNumber:13,titleZH:`HTTP/3(QUIC UDP 443)连通性检测：排查运营商UDP阻断导致v2rayN/网页间歇性断流`,titleEN:`HTTP/3 QUIC Handshake Failure & UDP Blocking: How Proxy UDP Inefficiency Betrays Region`,summaryZH:`深度解析 HTTP/3 (QUIC) 基于 UDP 443 端口的传输机制与 alt-svc 协商通道。揭秘国内运营商对 UDP 的严重 QoS 限速/丢包、以及多数普通代理软件不支持 UDP 转发，导致浏览器频繁 QUIC 握手失败并回退 HTTP/2 的特征是如何被风控捕获的。`,summaryEN:`Deep dive into HTTP/3 QUIC over UDP port 443 and alt-svc negotiation. Learn how domestic ISP UDP QoS degradation and incomplete proxy UDP tunneling force suspicious HTTP/2 fallbacks.`,penaltyZH:`-10 分`,penaltyEN:`-10 pts`,riskLevel:`medium`,categoryZH:`网络与真实路由`,categoryEN:`Network & Routing`,keywords:[`HTTP/3`,`QUIC协议`,`UDP阻断`,`alt-svc`,`QoS丢包`,`Claude防封`,`网络协议栈`]},{default:a(()=>[l[3]||=o(`h2`,null,`一、 传输层革命：为什么整个现代 Web 正在向 UDP 迁移？`,-1),l[4]||=o(`p`,null,[i(` 在过去二十多年里，万维网的传输层一直建立在可靠但相对笨重的 `),o(`strong`,null,`TCP 协议`),i(` 之上。无论是 HTTP/1.1 还是 HTTP/2，数据传输都必须经历严苛的 TCP 三次握手与 TLS 加密协商（累计 2~3 个 RTT 延迟），且面临严重的“队头阻塞（Head-of-Line Blocking）”问题。 `)],-1),l[5]||=o(`p`,null,[i(` 为了解决这一痛点，Google 与 IETF 联合推出了下一代传输协议 —— `),o(`strong`,null,`HTTP/3 与 QUIC`),i(`。 `)],-1),l[6]||=o(`p`,null,[i(` HTTP/3 彻底抛弃了传统的 TCP 协议栈，改由 `),o(`strong`,null,`无连接的 UDP 协议（端口 443）`),i(` 作为底层基座，实现了 0-RTT 极速握手重连与多路复用连接迁移。作为全球最大的云基础设施提供商，`),o(`strong`,null,`Cloudflare（包括由其承载的 Claude.ai 与 Anthropic API）全网默认开启并强烈优先推荐 HTTP/3`),i(`。 `)],-1),l[7]||=o(`h2`,null,`二、 冰火两重天：欧美纯净网络 vs 国内网络环境的 UDP 鸿沟`,-1),l[8]||=o(`p`,null,` 在欧美成熟的基础电信网络中，UDP 443 流量畅通无阻，丢包率极低，HTTP/3 的建连成功率高达 95% 以上。 `,-1),l[9]||=o(`p`,null,` 然而在我国的特定网络环境下，UDP 协议却面临着截然不同的宿命： `,-1),l[10]||=o(`ol`,null,[o(`li`,null,[o(`strong`,null,`运营商严格的 QoS 限速与丢包：`),i(` 为了防范基于 UDP 的放大 DDoS 攻击以及打击 P2P 盗版下载，国内各省电信、联通、移动的宽带机房长期对 UDP 实施严厉的 `),o(`strong`,null,`QoS（服务质量）降级策略`),i(`。在晚高峰时段，跨省或跨境的 UDP 丢包率甚至超过 40%！`)]),o(`li`,null,[o(`strong`,null,`劣质代理工具的“UDP 阉割”：`),i(` 很多国内开发者使用的基础代理插件或免费机场，为了节省服务器资源，`),o(`strong`,null,`直接在服务端彻底关闭了 UDP 转发能力`),i(`，或者只转发 TCP 流量。`)])],-1),l[11]||=o(`div`,{class:`tech-card`},[o(`h3`,null,`风控探针眼中的“QUIC 回退异常（QUIC Fallback Anomaly）”`),o(`p`,null,` 当浏览器第一次访问 Claude.ai 时，Cloudflare 会在 HTTP/2 的响应头中返回： `),o(`pre`,null,[o(`code`,null,`alt-svc: h3=":443"; ma=86400, h3-29=":443"; ma=86400`)]),o(`p`,null,[i(` 这告诉浏览器：`),o(`em`,null,`“我支持 HTTP/3，后续请求请立即通过 UDP 443 端口直连！”`)]),o(`p`,null,[i(` 此时，如果一个真实身在美国纽约的合法用户发起请求，浏览器会平滑切换至 `),o(`strong`,null,`h3（HTTP/3）`),i(`。 `)]),o(`p`,null,[i(` 但如果是一个国内用户，由于代理未配置 UDP 或本地 UDP 被阻断，浏览器向 UDP 443 发起的 QUIC 握手包会`),o(`strong`,null,`犹如泥牛入海，全部超时超时（Handshake Timeout）`),i(`。在重试若干次后，浏览器被迫无奈回退（Fallback）至低效的 HTTP/2 over TCP。 `)]),o(`p`,null,[o(`strong`,null,`风控裁定：`),i(` 该客户端虽声称在美国，但其 UDP 443 链路出现持续性阻断与高阶异常丢包，特征与中国境内的网络封锁环境高度拟合。扣除 10 分！ `)])],-1),l[12]||=o(`h2`,null,`三、 前端如何探测 HTTP/3 握手状态与协议支持？`,-1),l[13]||=o(`p`,null,[i(` 现代浏览器的 `),o(`code`,null,`PerformanceResourceTiming`),i(` 规范允许前端脚本无感读取网络加载协议： `)],-1),l[14]||=o(`pre`,null,[o(`code`,null,`async function auditHTTP3Support() {
  const testUrl = "https://cloudflare-quic.com/test-payload";
  
  try {
    const start = performance.now();
    await fetch(testUrl, { mode: "cors", cache: "no-store" });
    const duration = performance.now() - start;

    // 获取该资源的物理网络时序详情
    const entries = performance.getEntriesByName(testUrl);
    if (entries.length > 0) {
      const entry = entries[entries.length - 1];
      const protocol = entry.nextHopProtocol; // 如 'h3', 'h2', 'http/1.1'

      console.log("握手协议:", protocol, "耗时:", duration);

      if (protocol === "h3") {
        return { isHTTP3Success: true, protocol, penalty: 0 };
      } else {
        // 未能升级为 h3，降级至 h2
        return {
          isHTTP3Success: false,
          protocol,
          penalty: 10,
          reason: "客户端未能成功建立 HTTP/3 (QUIC) 握手，存在 UDP 转发阻断或 QoS 降级"
        };
      }
    }
  } catch (e) {
    return { isHTTP3Success: false, penalty: 10, reason: "网络阻断" };
  }
}`)],-1),l[15]||=o(`h2`,null,`四、 常见误区与避坑指南`,-1),l[16]||=o(`table`,null,[o(`thead`,null,[o(`tr`,null,[o(`th`,null,`常见做法`),o(`th`,null,`实际底层表现`),o(`th`,null,`能否改善 HTTP/3 握手？`)])]),o(`tbody`,null,[o(`tr`,null,[o(`td`,null,[i(`在 Chrome `),o(`code`,null,`chrome://flags`),i(` 中直接禁用 QUIC`)]),o(`td`,null,`导致浏览器永远使用 HTTP/2，但真实欧美 Chrome 默认 100% 开启 QUIC`),o(`td`,null,[o(`strong`,null,`不能`),i(`，人为禁用 QUIC 会制造出反常指纹。`)])]),o(`tr`,null,[o(`td`,null,[i(`仅在代理客户端写 `),o(`code`,null,`port: 7890`),i(`，未勾选 `),o(`code`,null,`udp: true`)]),o(`td`,null,`代理内核丢弃所有客户端发出的 UDP 报文，UDP 443 握手全部超时死掉`),o(`td`,null,[o(`strong`,null,`必然失败`),i(`。`)])])])],-1),l[17]||=o(`h2`,null,`五、 终极整改与优化方案`,-1),l[18]||=o(`p`,null,` 为了让你的出海环境拥有与海外本土居民完全一致的 HTTP/3 QUIC 传输体验，请执行以下配置： `,-1),l[19]||=o(`h3`,null,`1. 确保代理节点与机场支持 UDP 完整转发`,-1),l[20]||=o(`p`,null,` 检查你的代理订阅节点： `,-1),l[21]||=o(`ul`,null,[o(`li`,null,[i(`在 Clash 配置文件中，找到对应的节点定义或全局配置，确保包含 `),o(`code`,null,`udp: true`),i(`：`)])],-1),l[22]||=o(`pre`,null,[o(`code`,null,`proxies:
  - name: "🇺🇸 US-Premium-Node"
    type: hysteria2 # 或 vmess / trojan
    server: example.com
    port: 443
    udp: true # 核心：必须显式启用 UDP 转发！`)],-1),l[23]||=o(`h3`,null,`2. 开启客户端 TUN 模式以接管 UDP 443`,-1),l[24]||=o(`p`,null,[i(` 传统的系统代理（System Proxy）无法捕获 Chrome 原生发出的 UDP 443 流量。开启 `),o(`strong`,null,`Clash Verge Rev、Surge 或 Sing-box 的 TUN 模式`),i(`，TUN 虚拟网卡会将所有的 UDP 数据报文无缝封装并穿透海外节点，使浏览器能够与 Cloudflare 边缘秒速完成 QUIC 握手！ `)],-1),l[25]||=o(`h3`,null,`3. 选用现代低延迟抗丢包协议（如 Hysteria 2 / TUIC）`,-1),l[26]||=o(`p`,null,` 如果本地宽带 UDP QoS 极其严重，建议采用基于 UDP 双向拥塞控制算法的现代协议（如 Hysteria 2），利用其 Brutal 拥塞控制在有丢包的网络中维持高达 99% 的 QUIC 通信成功率。 `,-1),l[27]||=o(`h2`,null,`六、 总结`,-1),l[28]||=o(`p`,null,` HTTP/3 QUIC 已经成为现代高端 Web 架构的默认标配。无法正常握手 HTTP/3，往往是代理配置存在短板的最直观体现。 `,-1),o(`p`,null,[l[1]||=i(` 请进入我们的 `,-1),e(u,{to:`/tools/ip?tab=claude`},{default:a(()=>[...l[0]||=[i(`Claude Code 专项检测工具`,-1)]]),_:1}),l[2]||=i(` 查看 HTTP/3 握手测试。若该项被扣分，请立即检查代理客户端的 UDP 配置与 TUN 模式开关！ `,-1)])]),_:1})}}};export{c as default};