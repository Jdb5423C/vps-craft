import{A as e,B as t,T as n,U as r,k as i,q as a,w as o}from"./vendor-vue-B-WzrGXX.js";import{t as s}from"./StandardArticleLayout-BFhFpHN2.js";var c={__name:`taskbar-geometry`,setup(c){return(c,l)=>{let u=r(`RouterLink`);return t(),n(s,{slug:`taskbar-geometry`,checkId:`taskbar_geometry`,indexNumber:10,titleZH:`屏幕分辨率与任务栏几何特征(availHeight)检测：揭秘高阶反欺诈系统如何识别虚拟机与远程桌面`,titleEN:`Screen Geometry & Taskbar Height Mismatch: How Canvas Dimensions Bust Fake OS`,summaryZH:`剖析 window.screen.width/height 与 availWidth/availHeight 的物理差值关系。揭秘当用户在 Windows 电脑上伪造 macOS User-Agent 时，系统任务栏保留的 40px 专属高度差如何成为风控戳穿操作系统造假的如山铁证。`,summaryEN:`Explore screen geometry metrics, availHeight, and OS-specific taskbar signatures. Learn how crude OS spoofing (e.g. faking macOS on Windows) leaves telltale 40px taskbar deltas that anti-bot bots instantly catch.`,penaltyZH:`-10 分`,penaltyEN:`-10 pts`,riskLevel:`medium`,categoryZH:`客户端与指纹测绘`,categoryEN:`Fingerprinting & OS`,keywords:[`屏幕指纹`,`availHeight`,`任务栏高度差`,`操作系统伪装`,`Claude防封`,`指纹对抗`]},{default:a(()=>[l[3]||=o(`h2`,null,`一、 细思极恐的细节：几行像素差就能暴露你的真实操作系统？`,-1),l[4]||=o(`p`,null,[i(` 在很多开发者的防封配置中，修改浏览器的 `),o(`code`,null,`User-Agent（UA）`),i(` 是家常便饭。比如很多在 Windows 笔记本前工作的程序员，喜欢在浏览器扩展里把自己的 UA 改成： `)],-1),l[5]||=o(`pre`,null,[o(`code`,null,`Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36`)],-1),l[6]||=o(`p`,null,` 他们以为这样一来，服务端就会完全相信自己是一台运行在加利福尼亚的经典 16 英寸 MacBook Pro。 `,-1),l[7]||=o(`p`,null,[i(` 然而在前端反欺诈实验室的眼里，这种只改 UA 的粗糙伪装，不仅毫无用处，甚至滑稽得就像“把自行车贴上了法拉利的标志”。因为现代前端规范不仅提供了屏幕总分辨率，还提供了被操作系统底层任务栏/菜单栏占用后的`),o(`strong`,null,`物理可用空间（Available Geometry）`),i(`。 `)],-1),l[8]||=o(`p`,null,[i(` 正是通过对比 `),o(`code`,null,`screen.height`),i(` 与 `),o(`code`,null,`screen.availHeight`),i(` 之间的几何差值，风控脚本可以在 `),o(`strong`,null,`1 毫秒内精准断定：这是一台披着苹果皮的 Windows 电脑！`)],-1),l[9]||=o(`h2`,null,`二、 物理规律：Windows 与 macOS 的任务栏高度密码`,-1),l[10]||=o(`p`,null,` 为了理解这个检测维度的严密性，我们必须了解各大操作系统在多显示器与桌面渲染管理上的原生几何特征： `,-1),l[11]||=o(`div`,{class:`tech-card`},[o(`h3`,null,`两大桌面操作系统的原生几何特征对比`),o(`table`,null,[o(`thead`,null,[o(`tr`,null,[o(`th`,null,`操作系统`),o(`th`,null,`默认占用区域`),o(`th`,null,`物理像素扣减规则（100% 缩放比例下）`)])]),o(`tbody`,null,[o(`tr`,null,[o(`td`,null,[o(`strong`,null,`Windows 10 / 11`)]),o(`td`,null,`底部常驻任务栏（Taskbar）`),o(`td`,null,[i(`任务栏标准高度为 `),o(`strong`,null,`40px`),i(`（Win11 为 48px）。因此，`),o(`code`,null,`screen.height - screen.availHeight === 40`),i(`（或 48）。`)])]),o(`tr`,null,[o(`td`,null,[o(`strong`,null,`macOS (Apple Mac)`)]),o(`td`,null,`顶部菜单栏（Menubar） + 底部程序坞（Dock）`),o(`td`,null,[i(`macOS 顶部菜单栏固定高度为 `),o(`strong`,null,`24px 或 25px`),i(`（刘海屏 MacBook 为 44px）。底部 Dock 默认允许窗口贴合覆盖或具有动态浮动尺寸。`),o(`code`,null,`screen.availHeight`),i(` 几乎绝不会等于 `),o(`code`,null,`height - 40`),i(`！`)])]),o(`tr`,null,[o(`td`,null,[o(`strong`,null,`全屏沉浸模式（F11）`)]),o(`td`,null,`全屏无遮挡`),o(`td`,null,[o(`code`,null,`screen.availHeight === screen.height`),i(`（高度差为 0）。但在正常窗口状态下此现象极度罕见。`)])])])])],-1),l[12]||=o(`h2`,null,`三、 欺诈判定实录：前端检测脚本是如何抓包的？`,-1),l[13]||=o(`p`,null,` 反欺诈检测探针会执行如下跨维度几何逻辑检验： `,-1),l[14]||=o(`pre`,null,[o(`code`,null,`function auditTaskbarGeometry() {
  const { width, height, availWidth, availHeight } = window.screen;
  const userAgent = navigator.userAgent;
  const platform = navigator.platform || "";

  const heightDiff = height - availHeight;
  const widthDiff = width - availWidth;

  const claimsMacOS = /Macintosh|Mac OS X/i.test(userAgent) || platform.startsWith("Mac");
  const claimsWindows = /Windows NT/i.test(userAgent) || platform.startsWith("Win");

  // 1. 穿帮场景 1：声称是 Mac，但任务栏扣减尺寸完全符合 Windows 标准
  if (claimsMacOS && heightDiff === 40) {
    return {
      isFraud: true,
      reason: "声称为 macOS，但可用高度差为 40px，系 Windows 任务栏专属物理特征！",
      penalty: 10
    };
  }

  // 2. 穿帮场景 2：声称是 Windows，但高度差为 24px (macOS 菜单栏)
  if (claimsWindows && heightDiff === 24) {
    return {
      isFraud: true,
      reason: "声称为 Windows，但可用高度差为 24px，系 macOS 菜单栏专属物理特征！",
      penalty: 10
    };
  }

  // 3. 穿帮场景 3：非全屏状态下 availHeight 等于 height，且无 Dock 扣减
  if (!window.screenTop && heightDiff === 0 && !claimsWindows) {
    // 可能是劣质无头浏览器或防指纹沙盒简单 mock 了全量宽高
    return {
      isFraud: true,
      reason: "屏幕尺寸未体现操作系统任务栏扣减，判定为虚假沙盒模拟环境",
      penalty: 10
    };
  }

  return { isFraud: false, penalty: 0 };
}`)],-1),l[15]||=o(`h2`,null,`四、 劣质指纹伪装的“三大死亡翻车法”`,-1),l[16]||=o(`table`,null,[o(`thead`,null,[o(`tr`,null,[o(`th`,null,`翻车手法`),o(`th`,null,`实际底层数据`),o(`th`,null,`风控系统的反制结论`)])]),o(`tbody`,null,[o(`tr`,null,[o(`td`,null,`仅用插件修改 User-Agent 为 Mac`),o(`td`,null,[i(`UA 显示 Mac，但 `),o(`code`,null,`screen.availHeight`),i(` 依然遵循 Windows 的 40px 扣减，且 WebGL 显卡依然是 `),o(`code`,null,`Direct3D 11 / NVIDIA Geforce`)]),o(`td`,null,[o(`strong`,null,`特征矛盾（Feature Conflict）`),i(`。直接判定为人工恶意伪造环境，风控权重急剧飙升。`)])]),o(`tr`,null,[o(`td`,null,[i(`使用粗制滥造的脚本强行把 `),o(`code`,null,`availHeight`),i(` 设为和 `),o(`code`,null,`height`),i(` 一样`)]),o(`td`,null,[o(`code`,null,`availHeight === height`),i(` 且 `),o(`code`,null,`availWidth === width`)]),o(`td`,null,[i(`真实桌面系统只有在 F11 全屏状态下才出现此数值。如果同时检测到窗口外框尺寸（`),o(`code`,null,`outerHeight`),i(`）明显小于 `),o(`code`,null,`height`),i(`，说明窗口根本没全屏，判定为`),o(`strong`,null,`虚假模拟沙盒`),i(`。`)])]),o(`tr`,null,[o(`td`,null,`伪造移动端 iPhone UA，但在桌面端运行`),o(`td`,null,[i(`UA 声明为 iPhone 15，但 `),o(`code`,null,`screen.orientation`),i(`、触摸点 `),o(`code`,null,`navigator.maxTouchPoints === 0`),i(` 且窗口尺寸为 1920x1080`)]),o(`td`,null,`低级黑产探测脚本，直接触发 Cloudflare WAF 验证码拦截。`)])])],-1),l[17]||=o(`h2`,null,`五、 科学合规与指纹防护方案`,-1),l[18]||=o(`p`,null,` 如何避免在屏幕几何学与任务栏差值上被风控系统抓住小辫子？ `,-1),l[19]||=o(`h3`,null,`1. 顺应物理真实：不要盲目篡改操作系统类型`,-1),l[20]||=o(`p`,null,[i(` 在没有使用高度专业指纹对抗内核的前提下，`),o(`strong`,null,`“在什么系统上就报什么系统”`),i(` 是最明智的选择： `)],-1),l[21]||=o(`ul`,null,[o(`li`,null,[i(`如果你使用的是 Windows 11 电脑，你的 User-Agent 保持 `),o(`code`,null,`Windows NT 10.0; Win64; x64`),i(` 没有任何问题。Anthropic 和 Claude 对合规的 Windows 用户完全没有任何歧视。`)]),o(`li`,null,`盲目跨系统将 Windows 篡改成 macOS，只会制造出 20 多个无法自圆其说的交叉指纹漏洞（比如字体、显卡渲染器 ANGLE、任务栏高度、换行符等）。`)],-1),l[22]||=o(`h3`,null,`2. 使用完整内核级虚拟化的指纹浏览器`,-1),l[23]||=o(`p`,null,` 如果因多账号防关联确实需要虚拟不同操作系统： `,-1),l[24]||=o(`ul`,null,[o(`li`,null,[i(`使用 `),o(`strong`,null,`AdsPower、Multilogin`),i(` 等商业指纹浏览器。`)]),o(`li`,null,`在配置虚拟环境时，检查其“屏幕分辨率与窗口几何”配置项，确保勾选“真实物理扣减（Simulate Natural Taskbar）”。高质量的指纹浏览器会在底层 C++ 层面联动修改 WebGL、渲染管线与任务栏高度差，避免前端逻辑穿帮。`)],-1),l[25]||=o(`h2`,null,`六、 总结`,-1),l[26]||=o(`p`,null,` 反欺诈是一门追求“全链路特征自洽（Holistic Consistency）”的科学。任何单点的修补，都会在其他相互关联的维度上留下破绽。 `,-1),o(`p`,null,[l[1]||=i(` 请进入我们的 `,-1),e(u,{to:`/tools/ip?tab=claude`},{default:a(()=>[...l[0]||=[i(`Claude Code 专项检测工具`,-1)]]),_:1}),l[2]||=i(` 查看屏幕几何学检测项。保持环境真实，远离粗糙篡改，才能在 Claude 风控的大网下长久保持高纯净度评分！ `,-1)])]),_:1})}}};export{c as default};