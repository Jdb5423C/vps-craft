import{$ as e,A as t,B as n,C as r,D as i,E as a,T as o,V as s,b as c,c as ee,k as l,nt as u,q as d,t as f,w as p}from"./vendor-vue-B-WzrGXX.js";import{Ft as te,Nt as ne,Y as m}from"./app-BIFejNv7.js";import{t as re}from"./useLiveData-C0x_K5g9.js";import{n as h}from"./seoDescription-r63zjDeC.js";import{i as g}from"./facetMeta-DaGQkhR8.js";import"./facets-Dk0Bt9qe.js";import{d as ie,i as ae,u as oe}from"./jsonld-W6tG0nNL.js";import{t as _}from"./site-DBx-gcAg.js";import{t as se}from"./Breadcrumbs-BllvPQYU.js";import"./seoDescriptions-35wP5Gw3.js";import{t as v}from"./DealCard-BllQyVXU.js";var y={zh:`
<p class="region-lead">「免费 VPS」是主机行业里误导最严重的一个词。搜索引擎前两页列出的所谓「15 家永久免费云主机」，配置写得像入门款独立服务器，脚注里却写着「试用 60 天」「空闲休眠」「出站 1GB」。<strong>2026 年秋天，能一直开机、能 SSH 进去、账单可以长期保持 0 元的 Linux 虚拟机，实际只有两家</strong>：Oracle Cloud Always Free 和 Google Cloud 免费套餐里的那台 e2-micro。这个页面把它们、限时试用、会休眠的 PaaS 三类分开讲清楚。</p>

<h2>一、先分清三件事：永久免费、限时试用、会休眠的应用平台</h2>
<p>这三类的差别不是「免费多久」，而是<strong>你能不能把它当成一台真服务器用</strong>：</p>
<table class="region-table">
  <thead>
    <tr><th>类型</th><th>代表</th><th>能长期 0 元吗</th><th>有 root 吗</th><th>适合做什么</th></tr>
  </thead>
  <tbody>
    <tr><td>真·永久免费 VPS</td><td>Oracle Always Free、GCP e2-micro</td><td>能</td><td>有</td><td>常驻服务、Docker、监控、练手</td></tr>
    <tr><td>大厂试用额度</td><td>AWS Free Plan、Azure、GCP 试用金、DigitalOcean、Vultr</td><td>不能（30–180 天）</td><td>有</td><td>短期验证、迁移演练</td></tr>
    <tr><td>会休眠的 PaaS</td><td>Render、Koyeb、Railway、Hugging Face Spaces</td><td>能，但会睡眠</td><td>没有</td><td>静态站、Demo、Webhook</td></tr>
    <tr><td>带 SSH 的共享主机</td><td>serv00、alwaysdata</td><td>能</td><td>没有（共享）</td><td>小脚本、跳板、学习</td></tr>
  </tbody>
</table>
<p>表格分类依据 Vuncloud 2026 年 9 月对 16 家「免费档」的横向核对，以及 klymentiev.com 2026 年 6 月的独立复核。两份资料在结论上一致：<strong>真正能长期开机的不超过两家</strong>。</p>

<h2>二、Oracle Cloud Always Free：目前唯一「规格能打」的永久免费机</h2>
<p>Oracle 的 Always Free 至今仍是公有云市场里最慷慨的一档真·永久免费资源——没有到期日，也不需要持续扣费。2026 年的配额如下（据 Vuncloud 2026-09 与本站 2026-08 的核对）：</p>
<table class="region-table">
  <thead>
    <tr><th>资源</th><th>额度</th><th>说明</th></tr>
  </thead>
  <tbody>
    <tr><td>ARM 计算（Ampere A1）</td><td>2 OCPU + 12GB 内存</td><td>可拆成一台 2 核 12G，或两台各 1 核 6G</td></tr>
    <tr><td>AMD 微型实例</td><td>最多 2 台（1/8 OCPU + 1GB）</td><td>可突发到整核，适合 DNS / 监控 / 定时任务</td></tr>
    <tr><td>块存储</td><td>合计 200GB</td><td>另含 5 个卷的备份额度</td></tr>
    <tr><td>对象存储</td><td>20GB</td><td>标准 / 低频 / 归档共享</td></tr>
    <tr><td>出站流量</td><td>10TB / 月</td><td>超出约 $0.09/GB；同级流量在 AWS 上要接近 $900/月</td></tr>
    <tr><td>负载均衡</td><td>1 个 10Mbps + 1 个灵活型</td><td>2 个虚拟云网络</td></tr>
  </tbody>
</table>
<p><strong>2026 年最重要的变化</strong>：免费 ARM 额度已从早年的 4 OCPU / 24GB 正式砍半到 <strong>2 OCPU / 12GB</strong>（约 2026-06-15 起对新账户生效）。纯 Always Free 账户只能拿 2C12G；升级成 Pay As You Go 才保留旧的 4C24G。网上流传的「4 核 24G 教程」属于历史红利，新号强行开会产生扣费账单。</p>
<p>除了配额，还有三个现实问题：<strong>注册像抽卡</strong>（能不能注册成功、能不能抢到 ARM 实例都是概率事件）、<strong>容量不足</strong>（热门区域常年 Out of capacity）、<strong>闲置回收</strong>（长期低负载的免费实例可能被停）。所以正确的定位是：<a href="/compare/oracle-cloud-always-free-2026">Oracle 永久免费完整指南</a> 里那句——<strong>把它当副驾、当练手环境、当备份节点，别当生产主力</strong>。</p>

<h2>三、Google Cloud e2-micro：第二台真·永久免费机，但有硬限制</h2>
<p>GCP 的免费档是一台 e2-micro：<strong>共享 2 vCPU（可突发）、1GB 内存、30GB 标准盘</strong>，永久免费，但只能开在 <code>us-west1</code>、<code>us-central1</code>、<code>us-east1</code> 三个美国区域。</p>
<p>它最容易被忽略的限制是<strong>出站流量只有约 1GB/月</strong>（中国大陆、澳大利亚等区域除外）。1GB 是什么概念：一个 1.5MB 的页面，月访问 600 次左右就打满了。所以 e2-micro 的正确用法是<strong>只做内网服务、定时任务、CI runner、DNS</strong>，不要拿它对外提供网页。申请流程见 <a href="/compare/tutorial-google-e2-micro">GCP 免费 e2-micro 手把手申请</a>。</p>

<h2>四、这些「免费 VPS」其实不是永久免费</h2>
<ul>
  <li><strong>AWS Free Plan</strong>：额度制，最多 $200、最长 6 个月，到期关户。不是常开机器。详见 <a href="/compare/aws-free-tier-2026">AWS 免费套餐全攻略</a>。</li>
  <li><strong>Azure 免费账户</strong>：B1s 等 12 个月小时包 + $200/30 天信用额度，30 天内不升级 PAYG 就停。</li>
  <li><strong>GCP 试用金</strong>：约 $300 / 90 天，试用会过期。</li>
  <li><strong>DigitalOcean</strong>：约 $200 / 60 天，没有永久计算档，最便宜 Droplet 约 $4/月。</li>
  <li><strong>Vultr</strong>：约 $250 / 30 天促销，促销随时变，到期按量计费。</li>
  <li><strong>国内轻量「0 元体验」</strong>：多数 7–30 天，过期转付费，且常有新客与地域限制。</li>
</ul>
<p>这些不是「骗」，但它们的正确叫法是<strong>试用金</strong>。如果你打算长期跑一个服务，用完额度就得迁移——迁移成本往往比直接买一台 $10/年的机器更高。</p>

<h2>五、会休眠的「免费云」：不是 VPS</h2>
<p>Render、Koyeb、Railway、Hugging Face Spaces 这类平台经常被归进「免费 VPS」，但它们本质是 PaaS 容器：</p>
<ul>
  <li><strong>Render Free</strong>：0.1 CPU / 512MB，无持久盘，750 实例小时/月，空闲约 15 分钟休眠，免费 Postgres 30 天过期；</li>
  <li><strong>Koyeb Free</strong>：0.1 vCPU / 512MB / 2GB SSD，每组织 1 台，空闲 1 小时缩到零，仅 FRA 或 WASH 区域；</li>
  <li><strong>Railway Free</strong>：最多 1 vCPU / 0.5GB，卷最大 500MB，超额度即停；</li>
  <li><strong>Hugging Face Spaces（CPU Basic）</strong>：2 vCPU / 16GB，约 50GB 临时盘，空闲约 48 小时休眠，不是通用 VPS。</li>
</ul>
<p>冷启动按分钟计，这对 Webhook、Telegram Bot、监控探针这类需要秒级响应的场景是致命的。真要用，就把它当「静态站 + 偶尔触发的函数」，别当服务器。</p>

<h2>六、免费 VPS 的五个坑（每一个都有人踩过）</h2>
<ol>
  <li><strong>把试用金当永久免费</strong>。第 181 天机器被关，数据没备份，这是最常见的翻车方式。</li>
  <li><strong>忘了出站流量要钱</strong>。GCP e2-micro 只有约 1GB/月，Oracle 是 10TB/月，两者差 1 万倍。跑之前先算清楚。</li>
  <li><strong>ARM 架构不兼容</strong>。Oracle 免费机是 Ampere A1（ARM64），x86 的二进制、部分 Docker 镜像、某些商业面板跑不了。部署前确认有 arm64 构建。</li>
  <li><strong>闲置被回收</strong>。Oracle 会停长期低负载的免费实例，重要数据必须异地备份。</li>
  <li><strong>IP 信誉不干净</strong>。免费档的公网 IP 被滥用得多，注册第三方服务、发邮件、跑电商容易被风控。上线前先跑一遍 <a href="/tools/ip">IP 纯净度检测</a>，看诈骗分与黑名单。</li>
</ol>

<h2>七、如果免费档不够用：$10/年 这一档其实更省心</h2>
<p>免费机的先天短板是：IP 可能变、可能被回收、线路不受你控制、新账户规格被砍。真要做正经业务，<strong>一年花几十块买台年付机，总成本往往低于「免费机 + 迁移 + 排障」的时间成本</strong>。</p>
<p>本站收录的年付 $15 以内套餐有 100 多款，覆盖 DediRock、RackNerd、CloudCone、ColoCrossing、HostDare、MassiveGRID、Virtono、WebHorizon 等厂商。选购时只需盯三件事：<strong>续费价是否同价</strong>、<strong>是否含独立 IPv4</strong>、<strong>流量是单向还是双向计费</strong>。三条都确认过，再比价格。</p>
<p>想先看全量比价，可以回到 <a href="/tier/entry">入门级年付 VPS（$30 以内）</a> 或 <a href="/budget/yearly-cheap">年付 $15 以内</a> 两个筛选页；想要部署方案，看 <a href="/use-case/web">建站 VPS 配置指南</a>。</p>

<h2>八、这个页面下面列的是什么</h2>
<p>下面列出两类套餐：<strong>标注为免费档的（Oracle ARM / Oracle AMD 微型 / REG.RU 前 3 个月免费）</strong>，以及<strong>年付价在 $15 以内、可独立购买的入门款</strong>。免费档的库存与可开区域随时变化（Oracle 热门区域常年 Out of capacity），年付款则受促销批次影响，<strong>最终以下单页实时显示为准</strong>。</p>

<ul class="region-sources">
  <li>Vuncloud，《2026 免费 VPS 排行榜：15+ 家永久免费 VPS / 免费云主机配置、流量、价格和限制对比》，2026-09-18</li>
  <li>Dmytro Klymentiev，《Free VPS in 2026: 6 Real Options (Oracle, GCP, AWS)》，2026-06-30</li>
  <li>Oracle Cloud 官方 Always Free 文档（ARM 配额、块存储、出站流量），2026-11 复核</li>
  <li>Google Cloud 官方 Free Tier 文档（e2-micro 区域与出站限制），2026-11 复核</li>
  <li>本站《Oracle Cloud 永久免费白嫖指南》，2026-08-15</li>
  <li>本站《2026 AWS 免费套餐（Free Tier）白嫖全攻略》，2026</li>
</ul>
<p class="region-disclaimer">本站不提供云主机托管服务，与页面内出现的商家为推广合作关系（购买链接含推广 ID）。免费额度、区域可用性、试用期限均由厂商单方面调整且不另行通知，请以官方文档与账单页面为准。文中第三方测评数据版权归原作者所有。</p>
`,en:`
<p class="region-lead">"Free VPS" is the most misleading phrase in the hosting industry. The top two pages of search results promise "15 permanently free cloud servers" with specs that look like entry-level dedicated boxes, then bury "60-day trial", "sleeps when idle" and "1GB egress" in the footnotes. <strong>As of autumn 2026, only two providers offer a Linux VM you can leave running, SSH into, and keep at a $0 bill indefinitely</strong>: Oracle Cloud Always Free and the single e2-micro in Google Cloud's free tier. This page separates those two from time-limited trials and sleeping PaaS platforms.</p>

<h2>1. Three different things: free forever, free trial, sleeping app platform</h2>
<table class="region-table">
  <thead>
    <tr><th>Type</th><th>Examples</th><th>Free forever?</th><th>Root access?</th><th>Good for</th></tr>
  </thead>
  <tbody>
    <tr><td>True free-forever VPS</td><td>Oracle Always Free, GCP e2-micro</td><td>Yes</td><td>Yes</td><td>Always-on services, Docker, monitoring, labs</td></tr>
    <tr><td>Vendor trial credits</td><td>AWS Free Plan, Azure, GCP trial, DigitalOcean, Vultr</td><td>No (30–180 days)</td><td>Yes</td><td>Short validation, migration drills</td></tr>
    <tr><td>Sleeping PaaS</td><td>Render, Koyeb, Railway, Hugging Face Spaces</td><td>Yes, but sleeps</td><td>No</td><td>Static sites, demos, webhooks</td></tr>
    <tr><td>Shared hosting with SSH</td><td>serv00, alwaysdata</td><td>Yes</td><td>No (shared)</td><td>Small scripts, jump hosts, learning</td></tr>
  </tbody>
</table>
<p>Classification follows Vuncloud's September 2026 cross-check of 16 "free tiers" and klymentiev.com's independent June 2026 review. Both reach the same conclusion: <strong>no more than two options stay on permanently</strong>.</p>

<h2>2. Oracle Cloud Always Free: the only free-forever box with usable specs</h2>
<table class="region-table">
  <thead>
    <tr><th>Resource</th><th>Allowance</th><th>Notes</th></tr>
  </thead>
  <tbody>
    <tr><td>Arm compute (Ampere A1)</td><td>2 OCPU + 12GB RAM</td><td>One 2c/12g, or two 1c/6g</td></tr>
    <tr><td>AMD micro instances</td><td>Up to 2 (1/8 OCPU + 1GB)</td><td>Burstable; ideal for DNS, monitoring, cron</td></tr>
    <tr><td>Block storage</td><td>200GB total</td><td>Plus 5 volume backups</td></tr>
    <tr><td>Object storage</td><td>20GB</td><td>Shared across tiers</td></tr>
    <tr><td>Egress</td><td>10TB/month</td><td>~$0.09/GB beyond; comparable AWS egress approaches $900/month</td></tr>
    <tr><td>Load balancing</td><td>1× 10Mbps + 1 flexible</td><td>2 VCNs</td></tr>
  </tbody>
</table>
<p><strong>The 2026 change that matters</strong>: the free Arm allowance was cut from 4 OCPU / 24GB to <strong>2 OCPU / 12GB</strong> around 2026-06-15 for new accounts. Pure Always Free accounts get 2c/12g; only Pay As You Go accounts keep 4c/24g. The "4-core 24GB tutorial" circulating online is a legacy benefit — forcing it on a new account generates a bill.</p>
<p>Three practical problems remain: <strong>registration is a lottery</strong>, <strong>capacity is often unavailable</strong> (hot regions report Out of capacity for months), and <strong>idle instances get reclaimed</strong>. The right framing is the one in <a href="/compare/oracle-cloud-always-free-2026">our Oracle guide</a>: <strong>a second box, a lab, a backup node — never your production primary</strong>.</p>

<h2>3. Google Cloud e2-micro: the second free-forever box, with hard limits</h2>
<p>GCP's free tier is one e2-micro: <strong>shared 2 vCPU (burstable), 1GB RAM, 30GB standard disk</strong>, free indefinitely, but only in <code>us-west1</code>, <code>us-central1</code> or <code>us-east1</code>.</p>
<p>The most overlooked limit is <strong>egress of roughly 1GB/month</strong>. For scale: a 1.5MB page viewed 600 times exhausts it. So the correct use is <strong>internal services, cron, CI runners, DNS</strong> — never a public website. Setup walkthrough: <a href="/compare/tutorial-google-e2-micro">GCP free e2-micro step by step</a>.</p>

<h2>4. These "free VPS" offers are not free forever</h2>
<ul>
  <li><strong>AWS Free Plan</strong>: credit-based, up to $200 for up to 6 months, then the account is closed. Not an always-on box. See <a href="/compare/aws-free-tier-2026">our AWS Free Tier guide</a>.</li>
  <li><strong>Azure free account</strong>: 12 months of B1s hours plus $200/30 days; suspended after 30 days unless you upgrade to PAYG.</li>
  <li><strong>GCP trial credit</strong>: about $300 for 90 days, and it expires.</li>
  <li><strong>DigitalOcean</strong>: about $200 for 60 days; no permanent compute tier, cheapest Droplet ~$4/month.</li>
  <li><strong>Vultr</strong>: about $250 for 30 days, promo terms change, metered afterwards.</li>
</ul>
<p>None of these are scams, but the honest name is <strong>trial credit</strong>. If you intend to run a service long-term, you will migrate when the credit runs out — and the migration usually costs more than a $10/year box.</p>

<h2>5. Sleeping "free clouds" are not VPS</h2>
<ul>
  <li><strong>Render Free</strong>: 0.1 CPU / 512MB, no persistent disk, 750 instance-hours/month, sleeps after ~15 minutes idle, free Postgres expires in 30 days.</li>
  <li><strong>Koyeb Free</strong>: 0.1 vCPU / 512MB / 2GB SSD, one service per org, scales to zero after an hour idle, FRA or WASH only.</li>
  <li><strong>Railway Free</strong>: up to 1 vCPU / 0.5GB, volumes capped at 500MB, stops when the allowance is spent.</li>
  <li><strong>Hugging Face Spaces (CPU Basic)</strong>: 2 vCPU / 16GB, ~50GB ephemeral disk, sleeps after ~48 hours idle — not a general-purpose VPS.</li>
</ul>
<p>Cold starts are measured in minutes, which is fatal for webhooks, Telegram bots and monitoring probes. Treat them as static hosting with occasional functions, not as servers.</p>

<h2>6. Five traps that catch everyone</h2>
<ol>
  <li><strong>Mistaking trial credit for permanent free.</strong> Day 181 arrives, the box is gone, and there is no backup.</li>
  <li><strong>Forgetting egress costs money.</strong> GCP gives ~1GB/month; Oracle gives 10TB. That is a 10,000× difference.</li>
  <li><strong>ARM incompatibility.</strong> Oracle's free box is Ampere A1 (arm64); x86 binaries, some Docker images and certain commercial panels will not run. Verify arm64 builds first.</li>
  <li><strong>Idle reclamation.</strong> Oracle stops long-idle free instances. Back up off-site.</li>
  <li><strong>Dirty IP reputation.</strong> Free-tier public IPs see heavy abuse; signing up for third-party services, sending mail or running stores will trip risk controls. Run an <a href="/tools/ip">IP purity check</a> first.</li>
</ol>

<h2>7. When free is not enough: the $10/year tier is less work</h2>
<p>The structural weaknesses of free tiers are: IPs change, instances get reclaimed, routing is out of your control, and new accounts get smaller allowances. For anything real, <strong>a few dollars a year for an annual plan usually costs less than the time spent migrating and debugging a free box</strong>.</p>
<p>Our catalogue has over a hundred yearly plans under $15 across DediRock, RackNerd, CloudCone, ColoCrossing, HostDare, MassiveGRID, Virtono and WebHorizon. Check three things before comparing price: <strong>renewal parity</strong>, <strong>whether a dedicated IPv4 is included</strong>, and <strong>whether transfer is metered unidirectionally or bidirectionally</strong>.</p>
<p>Browse <a href="/tier/entry">entry-level yearly VPS (under $30)</a> or <a href="/budget/yearly-cheap">yearly under $15</a>; for deployment, see the <a href="/use-case/web">website VPS sizing guide</a>.</p>

<h2>8. What the plans below cover</h2>
<p>Two groups: <strong>plans tagged as free tier</strong> (Oracle ARM, Oracle AMD micro, REG.RU's first 3 months), and <strong>independently purchasable entry plans at $15/year or less</strong>. Free-tier capacity and region availability change constantly (Oracle's hot regions are perpetually out of capacity); annual pricing depends on promo batches. <strong>The order page is authoritative.</strong></p>

<ul class="region-sources">
  <li>Vuncloud, "2026 free VPS ranking: 15+ permanently free VPS / cloud hosts compared", 2026-09-18</li>
  <li>Dmytro Klymentiev, "Free VPS in 2026: 6 Real Options (Oracle, GCP, AWS)", 2026-06-30</li>
  <li>Oracle Cloud official Always Free documentation (Arm allowance, block storage, egress), verified 2026-11</li>
  <li>Google Cloud official Free Tier documentation (e2-micro regions and egress), verified 2026-11</li>
  <li>VPS-Craft, "Oracle Cloud Always Free guide", 2026-08-15</li>
  <li>VPS-Craft, "2026 AWS Free Tier guide", 2026</li>
</ul>
<p class="region-disclaimer">We do not sell cloud hosting and are an affiliate of the providers listed (buy links carry our referral ID). Free allowances, region availability and trial periods are changed unilaterally without notice — the official documentation and invoice prevail. Third-party benchmark data remains the property of its authors.</p>
`},ce=[{qZH:`2026 年还有真正永久免费的 VPS 吗？`,aZH:`有，但只剩两家：Oracle Cloud Always Free（ARM 2 OCPU + 12GB 内存、200GB 块存储、10TB/月出站）和 Google Cloud 免费套餐里的 e2-micro（共享 2 vCPU、1GB 内存、30GB 盘）。其余标着「永久免费」的多数是 30–180 天的试用额度，或者会休眠的 PaaS 容器。`,qEN:`Are there any genuinely free-forever VPS in 2026?`,aEN:`Yes, but only two: Oracle Cloud Always Free (Arm 2 OCPU + 12GB RAM, 200GB block storage, 10TB/month egress) and the single e2-micro in Google Cloud's free tier (shared 2 vCPU, 1GB RAM, 30GB disk). Everything else marketed as "free forever" is usually a 30–180 day trial credit or a sleeping PaaS container.`},{qZH:`Oracle 免费 ARM 现在是 2 核还是 4 核？`,aZH:`新账户是 2 OCPU + 12GB 内存（约 2026-06-15 起生效），只有升级成 Pay As You Go 的付费账户才保留旧的 4 OCPU + 24GB。网上传播的 4C24G 教程属于早期历史红利，新号强行开机会产生扣费账单。`,qEN:`Is Oracle's free Arm allowance 2 or 4 cores now?`,aEN:`New accounts get 2 OCPU + 12GB (effective around 2026-06-15). Only accounts upgraded to Pay As You Go retain the legacy 4 OCPU + 24GB. The 4c/24g tutorials circulating online are a legacy benefit; forcing it on a new account generates a bill.`},{qZH:`免费 VPS 能用来建站吗？`,aZH:`能，但要挑。Oracle 的 ARM 机配 10TB/月出站流量，跑个人博客、反向代理、Vaultwarden 完全够；GCP e2-micro 只有约 1GB/月出站，只适合内网服务。两者的共同短板是 IP 可能变、可能被回收、线路不受控，所以商业站建议用一台年付 $10 左右的机器兜底，免费机只做学习或备线。`,qEN:`Can I host a website on a free VPS?`,aEN:`Yes, with caveats. Oracle's Arm box with 10TB/month egress comfortably runs a personal blog, reverse proxy or Vaultwarden. GCP's e2-micro gets about 1GB/month egress — internal services only. Both share the same weaknesses: IPs change, instances get reclaimed, and routing is out of your control, so commercial sites should keep a ~$10/year box as the primary and use free tiers for labs or failover.`},{qZH:`免费 VPS 会不会突然扣费？`,aZH:`免费档本身不扣费，风险来自三处：手滑创建了付费（PAYG）机型、超出免费额度的块存储或出站流量、以及试用金到期后未及时降级。避免方式很简单——在控制台设一个预算告警，并每月核对一次账单页。`,qEN:`Will a free VPS suddenly charge me?`,aEN:`The free tier itself does not charge. Risk comes from three places: accidentally provisioning a paid (PAYG) shape, exceeding free block-storage or egress allowances, and failing to downgrade when trial credit expires. Set a budget alert in the console and review the billing page monthly.`},{qZH:`免费机被回收了怎么办？`,aZH:`只能重建，所以关键在于「能重建」：把系统配置写成 Docker Compose 或 Ansible 脚本，数据用 restic / rclone 定时同步到对象存储（Cloudflare R2 有 10GB 免费额度，Backblaze B2 约 $6/TB/月）。做到这两点，机器被回收的损失就是二十分钟。`,qEN:`What if my free instance gets reclaimed?`,aEN:`You rebuild it — which is why reproducibility is the real deliverable. Codify the setup in Docker Compose or Ansible, and sync data to object storage with restic or rclone (Cloudflare R2 offers 10GB free, Backblaze B2 is about $6/TB/month). With those two in place, reclamation costs twenty minutes.`}],le={class:`app-container`},ue={class:`fv-hero glass-panel`},de={class:`fv-badge`},b={class:`fv-title`},x={class:`fv-sub`},S={class:`fv-stats`},C={class:`fv-stat`},w={class:`fv-stat-num`},T={class:`fv-stat-label`},E={class:`fv-stat`},D={class:`fv-stat-num`},O={class:`fv-stat-label`},k={class:`fv-stat`},A={class:`fv-stat-num`},j={class:`fv-stat-label`},M={class:`fv-stat`},N={class:`fv-stat-num`},P={class:`fv-stat-label`},F={key:0,class:`fv-block glass-panel`},I={class:`fv-block-title`},L={class:`fv-block-sub`},R={class:`fv-grid`},z={class:`fv-body glass-panel`},B=[`innerHTML`],V={key:1,class:`fv-block glass-panel`},H={class:`fv-block-title`},fe={class:`fv-block-sub`},pe={class:`fv-grid`},me={class:`fv-more`},he={class:`fv-related glass-panel`},ge={class:`fv-related-title`},_e={class:`fv-chips`},ve={class:`fv-related-title`,style:{"margin-top":`20px`}},ye={class:`fv-chips`},be={key:2,class:`fv-faq glass-panel`},xe={class:`fv-faq-title`},Se={class:`fv-faq-list`},Ce={class:`fv-faq-q`},we={class:`fv-faq-a`},Te={class:`fv-source glass-panel`},Ee={class:`fv-source-title`},De={class:`fv-source-text`},U=`/free-vps`,W=ne({__name:`FreeVpsPage`,setup(ne){re({stock:!0});let{deals:W,total:Oe}=te(),G=(e,t)=>g(e)-g(t),K=r(()=>W.value.filter(e=>e.isFree||!(e.price>0)).sort(G)),q=r(()=>W.value.filter(e=>e.billing===`year`&&e.price>0&&e.price<15&&!e.isAddon).sort(G)),ke=r(()=>K.value.length),Ae=r(()=>Oe.value||K.value.length+q.value.length),je=r(()=>new Set([...K.value,...q.value].map(e=>e.providerId)).size),J=r(()=>{let e=q.value.filter(e=>e.price>0);return e.length?g(e[0]):null}),Y=[{to:`/compare/oracle-cloud-always-free-2026`,zh:`Oracle 永久免费白嫖指南`,en:`Oracle Always Free guide`},{to:`/compare/arm-vps-ampere-guide-2026`,zh:`ARM 架构 VPS 值不值得上`,en:`Is Arm VPS worth it?`},{to:`/compare/aws-free-tier-2026`,zh:`AWS 免费套餐全攻略`,en:`AWS Free Tier guide`},{to:`/compare/tutorial-google-e2-micro`,zh:`GCP 免费 e2-micro 申请`,en:`GCP free e2-micro setup`},{to:`/compare/cloudflare-free-stack-2026`,zh:`Cloudflare 免费全家桶`,en:`Cloudflare free stack`},{to:`/compare/cloudflare-tunnel-selfhost-2026`,zh:`Cloudflare Tunnel 自建`,en:`Cloudflare Tunnel self-hosting`},{to:`/compare/free-static-hosting-stack-2026`,zh:`纯 Serverless 免费边缘栈`,en:`Serverless free edge stack`},{to:`/compare/free-vps-static-site-2026`,zh:`免费 VPS + CDN 动静分离`,en:`Free VPS + CDN split`},{to:`/compare/github-pages-cloudflare-blog-2026`,zh:`GitHub Pages 免费建博客`,en:`GitHub Pages blog`}],Me=[{to:`/tier/entry`,zh:`入门级年付 VPS（$30 以内）`,en:`Entry yearly VPS (under $30)`},{to:`/budget/yearly-cheap`,zh:`年付 $15 以内 VPS`,en:`Yearly VPS under $15`},{to:`/use-case/web`,zh:`建站 VPS 配置指南`,en:`Website VPS sizing`},{to:`/provider/oraclecloud`,zh:`Oracle Cloud 套餐页`,en:`Oracle Cloud plans`},{to:`/tools/ip`,zh:`IP 纯净度检测`,en:`IP purity check`}],X=r(()=>ce.map(e=>({q:m.value===`zh`?e.qZH:e.qEN,a:m.value===`zh`?e.aZH:e.aEN}))),Z=r(()=>m.value===`zh`?`2026永久免费VPS与免费云服务器申请汇总：甲骨文ARM/AWS/谷歌云与免信用卡白嫖指南 | VPS-Craft`:`Free VPS & Forever-Free Cloud Servers 2026: Oracle ARM, AWS, GCP & Credit-Card-Free Guide | VPS-Craft`),Q=r(()=>m.value===`zh`?h(`2026最新永久免费VPS与免费云服务器申请全攻略！全网深度实测甲骨文云Oracle ARM(2核12G/10TB流量)、AWS EC2一年免费、谷歌云e2-micro及免信用卡试用。`,[`盘点8大实测可用免费主机配置与额度限制，揭秘超额扣费反薅与封号风控避坑指南`,`附年付15美元以内超便宜入门备选方案`]):h(`Comprehensive 2026 guide to truly free VPS and cloud servers: tested Oracle Cloud Always Free (4-core 24G Arm), AWS Free Tier, GCP e2-micro, and credit-card-free trials.`,[`Compare configurations, traffic quotas, billing pitfalls, and reliable budget alternatives under $15/year.`],{min:150,max:160,separator:` `})),Ne=r(()=>m.value===`zh`?y.zh:y.en),$=r(()=>[{name:m.value===`zh`?`首页`:`Home`,to:`/`},{name:m.value===`zh`?`免费 VPS`:`Free VPS`,to:U}]),Pe=r(()=>({"@context":`https://schema.org`,"@type":`ItemList`,name:Z.value,itemListElement:[...K.value,...q.value.slice(0,12)].map((e,t)=>({"@type":`ListItem`,position:t+1,name:m.value===`zh`?e.nameZH:e.nameEN,url:`${_}/deal/${e.id}`}))})),Fe=r(()=>X.value.length?{"@context":`https://schema.org`,"@type":`FAQPage`,mainEntity:X.value.map(e=>({"@type":`Question`,name:e.q,acceptedAnswer:{"@type":`Answer`,text:e.a}}))}:null),Ie=r(()=>ae($.value));return ee(r(()=>({title:Z.value,meta:[{name:`description`,content:Q.value},{property:`og:title`,content:Z.value},{property:`og:description`,content:Q.value},{property:`og:type`,content:`website`},{property:`og:url`,content:`${_}${U}`},{property:`og:image`,content:`${_}/og/default.png`},{property:`og:image:alt`,content:m.value===`zh`?`免费 VPS 2026 全对比`:`Free VPS 2026 compared`}],link:[{rel:`canonical`,href:`${_}${U}`},...oe(U)],script:ie(...[Pe.value,Ie.value,Fe.value].filter(Boolean))}))),(r,ee)=>(n(),i(`main`,le,[t(se,{items:$.value},null,8,[`items`]),p(`section`,ue,[p(`div`,de,`🆓 `+u(e(m)===`zh`?`免费 VPS 专题`:`Free VPS Hub`),1),p(`h1`,b,u(e(m)===`zh`?`免费 VPS：真正永久免费的只有两家`:`Free VPS: Only Two Are Genuinely Free Forever`),1),p(`p`,x,u(e(m)===`zh`?`2026 年秋天，能一直开机、能 SSH 进去、账单可以长期保持 0 元的 Linux 虚拟机只剩 Oracle Cloud Always Free 与 Google Cloud e2-micro。下面把「永久免费 / 限时试用 / 会休眠的 PaaS」三类拆开对比，并附年付 $15 以内的入门款清单。`:`As of autumn 2026, only Oracle Cloud Always Free and Google Cloud e2-micro give you a Linux VM that stays on, accepts SSH and keeps a $0 bill. Below we separate free-forever from trial credits and sleeping PaaS, then list budget plans under $15/year.`),1),p(`div`,S,[p(`div`,C,[p(`span`,w,u(ke.value),1),p(`span`,T,u(e(m)===`zh`?`款免费档`:`Free plans`),1)]),p(`div`,E,[p(`span`,D,u(Ae.value),1),p(`span`,O,u(e(m)===`zh`?`款免费/低价`:`Free & budget`),1)]),p(`div`,k,[p(`span`,A,u(je.value),1),p(`span`,j,u(e(m)===`zh`?`家厂商`:`Providers`),1)]),p(`div`,M,[p(`span`,N,`$`+u(J.value==null?`—`:J.value.toFixed(2)),1),p(`span`,P,u(e(m)===`zh`?`最低年付`:`Lowest /yr`),1)])])]),K.value.length?(n(),i(`section`,F,[p(`h2`,I,`🆓 `+u(e(m)===`zh`?`当前收录的免费档套餐`:`Free-Tier Plans We Track`),1),p(`p`,L,u(e(m)===`zh`?`免费档的库存与可开区域随时变化（Oracle 热门区域常年 Out of capacity），下单前请以官方控制台为准。`:`Free-tier capacity and region availability change constantly (Oracle hot regions are often out of capacity). The official console is authoritative.`),1),p(`div`,R,[(n(!0),i(c,null,s(K.value,e=>(n(),o(v,{key:e.id,plan:e,pick:!0},null,8,[`plan`]))),128))])])):a(``,!0),p(`section`,z,[p(`div`,{class:`fv-body-content`,innerHTML:Ne.value},null,8,B)]),q.value.length?(n(),i(`section`,V,[p(`h2`,H,` 💰 `+u(e(m)===`zh`?`近免费：年付 $15 以内入门款`:`Nearly Free: Yearly Plans Under $15`),1),p(`p`,fe,u(e(m)===`zh`?`按年付折算价升序展示前 ${q.value.length} 款。免费档不够用时，这一档通常比「免费机 + 迁移 + 排障」更省心。`:`The cheapest ${q.value.length} plans, sorted by annualised price ascending. When free tiers are not enough, this band usually beats "free box plus migration plus debugging".`),1),p(`div`,pe,[(n(!0),i(c,null,s(q.value,e=>(n(),o(v,{key:e.id,plan:e},null,8,[`plan`]))),128))]),p(`p`,me,[t(e(f),{to:`/budget/yearly-cheap`},{default:d(()=>[l(u(e(m)===`zh`?`查看全部年付 $15 以内套餐 →`:`See all plans under $15/yr →`),1)]),_:1})])])):a(``,!0),p(`section`,he,[p(`h3`,ge,`📖 `+u(e(m)===`zh`?`免费 VPS 主题文章`:`Free VPS Guides`),1),p(`div`,_e,[(n(),i(c,null,s(Y,n=>t(e(f),{key:n.to,to:n.to,class:`fv-chip`},{default:d(()=>[l(u(e(m)===`zh`?n.zh:n.en),1)]),_:2},1032,[`to`])),64))]),p(`h3`,ve,` 🔗 `+u(e(m)===`zh`?`相关筛选与工具`:`Related Filters & Tools`),1),p(`div`,ye,[(n(),i(c,null,s(Me,n=>t(e(f),{key:n.to,to:n.to,class:`fv-chip fv-chip--alt`},{default:d(()=>[l(u(e(m)===`zh`?n.zh:n.en),1)]),_:2},1032,[`to`])),64))])]),X.value.length?(n(),i(`section`,be,[p(`h3`,xe,`❓ `+u(e(m)===`zh`?`常见问题`:`Frequently Asked Questions`),1),p(`div`,Se,[(n(!0),i(c,null,s(X.value,(e,t)=>(n(),i(`details`,{class:`fv-faq-item`,key:t},[p(`summary`,Ce,u(e.q),1),p(`p`,we,u(e.a),1)]))),128))])])):a(``,!0),p(`section`,Te,[p(`h3`,Ee,`📌 `+u(e(m)===`zh`?`数据来源与说明`:`Source & Notes`),1),p(`p`,De,u(e(m)===`zh`?`本页免费额度与限制整理自 Oracle / Google Cloud 官方文档与 Vuncloud（2026-09）、klymentiev.com（2026-06）的公开核对；套餐价格与库存来自各厂商官方页面，并自动携带本站专属推广 ID。厂商可随时单方面调整免费额度与试用期限，请以官方文档与账单页为准。`:`Free allowances and limits are compiled from Oracle / Google Cloud official documentation and public cross-checks by Vuncloud (2026-09) and klymentiev.com (2026-06). Plan prices and stock come from provider pages and carry our affiliate ID. Vendors may change allowances and trial terms unilaterally; official documentation and invoices prevail.`),1)])]))}},[[`__scopeId`,`data-v-621cc433`]]);export{W as default};