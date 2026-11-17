# 五组手动分流

一套共享域名规则，供 Shadowrocket 和使用 Mihomo 的 Clash Party / Clash Verge Rev 使用。各设备独立选择节点。

| 服务 | 策略组名称（须完全一致） | 手动选择的节点地区 |
| --- | --- | --- |
| GPT / ChatGPT | `GPT-美国手动` | 美国 |
| Instagram | `Instagram-香港手动` | 香港 |
| X / Twitter | `X-香港手动` | 香港 |
| TikTok | `TikTok-台湾手动` | 台湾 |
| Facebook | `Facebook-香港手动` | 香港 |

三组香港策略相互独立，可以选择同一节点，也可以分别选择不同香港节点。所有组均为 `select` 手动选择类型。

## 文件

```text
rules/
  gpt.list
  instagram.list
  x.list
  tiktok.list
  facebook.list
shadowrocket/routing.sgmodule
mihomo/override.js
README.md
LICENSE
```

`.list` 只写 `DOMAIN`、`DOMAIN-SUFFIX` 匹配项，不带策略名；两种客户端引用同一文件。仓库只存公开规则和配置逻辑，节点、订阅地址、密码、Token 留在客户端。

## 可复制的实施计划

```text
1. 在 JIAQI23333 账号下建立 Public 仓库 proxy-routing-rules，默认分支 main，使用 MIT 许可证。
2. 维护五份 rules/*.list，共享给所有设备；只包含 GPT、Instagram、X、TikTok、Facebook。
3. Shadowrocket：先建立表中的五个 select 策略组，加入对应地区的本地节点，再导入并启用 routing.sgmodule。
4. Clash Party：导入 override.js 为 JavaScript 覆写，绑定正在使用的订阅并重新应用。
5. Clash Verge Rev：把同一份 override.js 全文粘贴到当前订阅的扩展脚本，保存并重新应用。
6. 在每台设备的五个组中手动选择实际节点；GPT 美国，Instagram/X/Facebook 香港，TikTok 台湾。
7. 开启按规则分流，检查五份规则下载成功，再通过连接日志验证命中的组及实际出口。
8. 以后增删域名只改对应 .list；切换节点只操作客户端策略组；修改映射时更新模块和 JS。
```

## Shadowrocket

1. 备份当前配置。在「配置 → 当前配置的 ⓘ → 代理分组」建立上表五个组，类型全部选择 `select`；从本机已有订阅中加入对应地区的节点。不要把自动测速组作为候选。
2. 在「配置 → 模块 → +」导入以下地址并启用。模块引用本机策略组，不负责创建组：

   ```text
   https://raw.githubusercontent.com/JIAQI23333/proxy-routing-rules/main/shadowrocket/routing.sgmodule
   ```

3. 使用/编译当前配置，确认五份规则下载成功。全局路由选择「配置」，在五个组中分别选好节点后重新连接。
4. 如已有其他模块匹配相同域名，调整模块顺序并通过日志核对，避免被更靠前的规则截获。

域名规则变化后，在「规则集 URL」刷新资源，并使用/编译配置；模块文件变化后，先更新模块再重新应用。仅刷新模块不等于所有规则资源都已重新加载。

## Clash Party / Clash Verge Rev

共用脚本地址：

```text
https://raw.githubusercontent.com/JIAQI23333/proxy-routing-rules/main/mihomo/override.js
```

- **Clash Party**：在「覆写」导入这个远程 JS；也可以新建 JavaScript 覆写并粘贴全文。把覆写关联到正在使用的订阅，保存后重新应用订阅。
- **Clash Verge Rev**：右键当前订阅，打开「扩展脚本」，粘贴脚本全文并保存、重新应用。已有脚本时先备份并合并逻辑，文件中保留一个 `main(config)` 入口。

切换到「规则」模式，打开五个新增策略组，**首次使用须将 `REJECT` 改为实际节点**。脚本按节点名称中的国家名、英文地区缩写或旗帜筛选，支持订阅直接提供的节点及 `proxy-providers`。若组里只有 `REJECT`，先确认订阅有该地区节点、集合已加载，再修改脚本顶部对应的 `us` / `hk` / `tw` 正则。

名称筛选不能验证真实出口地区。`REJECT` 用于未选择节点或没有匹配节点的情况，不自动改走直连或其他地区。切换到实际节点后，该组保持手动选择。

脚本把本项目五条 `RULE-SET` 放到原规则前面，保留其他规则、组和节点配置。五个表内组名、`prr-*` 的五个规则集合名称由本项目管理；再次执行会替换这些条目，不会重复追加。其他覆写若之后又重写规则或代理组，需调整执行顺序。

Mihomo 对五份 `.list` 按 `86400` 秒周期更新，也可在客户端手动更新规则集合。**规则集合更新不会自动更新 JS 文件本身**：JS 修改后，Party 更新远程覆写或重新粘贴；Verge Rev 重新粘贴保存。不要把 JS 地址填进 YAML 订阅地址栏。

## 验收与维护

依次访问 `chatgpt.com`、`instagram.com`、`x.com`、`tiktok.com`、`facebook.com`，在连接日志中确认对应组及选中节点。测试前断开旧连接；仅看到页面打开，不能证明出口正确。客户端须实际接管被测流量。

这是核心域名起步清单，不是完整服务域名数据库。登录、上传、语音、直播以及第三方验证可能使用额外域名或 IP，发现遗漏后按连接日志补充。共享 CDN 无法仅凭域名判断由哪个 App 发起：例如 `fbcdn.net` 统一归 Facebook 香港组，Instagram 访问它时也遵循该规则。

TikTok 的分流只决定命中流量的代理出口，不修改账号地区、SIM、定位或内容推荐地区。当前范围不包含抖音、CapCut、Trae、Grok 等额外服务，也不按 iOS / macOS / Windows 复制规则。

维护原则：增删域名改 `.list`；换节点在本机组内选择；改分流映射同步修改模块和 JS；不用时禁用模块/取消覆写关联并重新应用原配置。

2026-11-17 已通过脚本语法、重复应用、原配置保留及 32 条域名规则检查，并用 Mihomo v1.19.34 在本机模拟节点验证五份规则加载与地区候选筛选。尚未在真实 Shadowrocket / Clash 客户端及实际代理出口上完成端到端测试，设备导入后仍须按上述步骤验收。

## 格式与域名参考

- [Mihomo 规则集合格式](https://wiki.metacubex.one/config/rule-providers/)与[代理组配置](https://wiki.metacubex.one/config/proxy-groups/)：`classical` + `text`、`select`、`include-all`、`filter`。
- [Clash Party 官方脚本执行实现](https://github.com/mihomo-party-org/clash-party/blob/main/src/main/core/factory.ts)与[Clash Verge Rev 自定义脚本](https://www.clashverge.dev/guide/script.html)：共用 `main(config)` 入口。
- [Shadowrocket 社区维护手册](https://github.com/LOWERTOP/Shadowrocket/wiki)：策略组、模块、规则资源更新。
- [OpenAI 网络域名说明](https://help.openai.com/en/articles/9247338-network-recommendations-for-chatgpt-errors-on-web-and-apps)：GPT 核心域名参考；通用第三方服务域名未整体纳入。
- [blackmatrix7 服务规则](https://github.com/blackmatrix7/ios_rule_script/tree/master/rule/Clash)：交叉核对社交平台核心域名；未订阅或整包引入上游规则。

MIT License，见 [LICENSE](LICENSE)。
