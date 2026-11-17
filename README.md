# 五组手动分流

一套共享分流规则，供 Shadowrocket 和使用 Mihomo 的 Clash Party / Clash Verge Rev 使用。覆盖五个服务的主站及已知图片、上传、登录、支付、语音、视频和消息依赖，各设备独立选择节点。

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
  LICENSE-GPL-2.0
  LICENSE-v2fly-MIT
shadowrocket/routing.sgmodule
shadowrocket/routing-lite.sgmodule
mihomo/override.js
README.md
LICENSE
```

`.list` 使用两种客户端共同支持的 `DOMAIN`、`DOMAIN-SUFFIX`、`DOMAIN-KEYWORD`、`IP-CIDR` 和 `IP-ASN`，不带策略名；两种客户端引用同一文件。仓库只存公开规则和配置逻辑，节点、订阅地址、密码、Token 留在客户端。

## 覆盖范围与来源

2026-11-17 从原来的 32 条起步规则扩充为 **1090 条**。合并 blackmatrix7 和 v2fly/domain-list-community 的对应服务清单，并补充 OpenAI 官方网络说明及语音 IP。规则数量不等于功能数量：一个域名后缀可以覆盖大量子域名，完整功能也可能依赖第三方身份验证、文件存储、CDN 或 IP 连接。

| 规则集 | 原数量 → 当前数量 | 此次补充重点 |
| --- | --- | --- |
| GPT | 6 → 463 | 图片/文件存储、异步任务、验证登录、支付、语音；含官方 411 条语音 IP |
| Instagram | 3 → 74 | 图片 CDN、私信短链、视频及相关服务域名 |
| X / Twitter | 6 → 33 | 图片/视频 CDN、直播、登录、短链和 IP |
| TikTok | 11 → 52 | `ibyteimg.com` 图片、私信贴纸、直播、上传、区域 CDN、Shop |
| Facebook | 6 → 468 | 图片/视频、登录、消息/Messenger、CDN 和 Meta IP/ASN |

来源快照：

- [blackmatrix7/ios_rule_script](https://github.com/blackmatrix7/ios_rule_script/tree/0b6897dc17e0c513d25449c935a9694818e32f0c/rule/Shadowrocket)，提交 `0b6897dc17e0c513d25449c935a9694818e32f0c`。
- [v2fly/domain-list-community](https://github.com/v2fly/domain-list-community/tree/41504eae2a11f305fe88cfc605cf6c105a80bf5a/data)，提交 `41504eae2a11f305fe88cfc605cf6c105a80bf5a`；Facebook 另合并其 Messenger 清单。
- [OpenAI 官方网络说明](https://help.openai.com/en/articles/9247338-network-recommendations-for-chatgpt-errors-on-web-and-apps)与[语音 IP 数据](https://openai.com/chatgpt-voice.json)，后者的源数据时间为 `2026-11-16T01:33:53.175979+00:00`。

去重时保留域名后缀覆盖范围，移除已被同一集合后缀完整覆盖的重复域名。GPT 的异步任务主机正则转为两个客户端都支持的 `chatgpt-async-webps-prod-` 关键词匹配，未加入整个 Azure 域名。

## 覆盖优先的取舍

- GPT 保留上游的 Auth0、Stripe、Sentry 等共享依赖，并补全官方列出的 WorkOS、Cloudflare 验证等地址。这些域名被其他软件使用时也会命中美国组。`ibyteimg.com` 在参考清单中属于字节系依赖，放入 TikTok 台湾组；GPT 的图片/文件域名包含 `oaiusercontent.com`、`oaistatic.com` 及 Azure 存储和异步处理地址。
- 未采用 OpenAI 上游的 `IP-ASN,20473`：它覆盖 [Vultr 的网络](https://docs.vultr.com/vultr-ip-space)，会把无关云服务器一起划入 GPT。改用 OpenAI 官方发布的语音 IP 明细，并保留上游两条单 IP 规则。
- TikTok 排除 CapCut、Trae、MarsCode、TikTok Music 的独立域名；X 排除独立的 `grok.com`；GPT 排除独立的 `sora.com`、`crixet.com`；Facebook 排除 WhatsApp、Oculus、Workplace 的独立域名。保留完成目标软件功能所用的共享依赖，因此这些其他软件访问共享域名时仍可能命中。
- `USER-AGENT` 和 `PROCESS-NAME` 没有放入共享文件：两种客户端及不同操作系统的支持不一致。TikTok 使用域名和关键词匹配。广告/统计标记在导入时仅作为来源标注，不生成拦截规则。
- Instagram 的重复专属域名归入 Instagram 组并优先匹配；共享的 `fbcdn.net`、`fbsbx.com`、Meta IP 和 AS32934 归入 Facebook 香港组。仅凭共享域名或 IP 无法可靠区分具体 App，其他 Meta 服务访问相同资源也会命中该组。ASN 匹配依赖客户端的 ASN 数据库。

这些是已知依赖的扩充清单，无法保证未来所有功能或所有客户端版本永远不遗漏。此仓库保存的是上述来源的快照，**客户端刷新本仓库不等于实时合并上游变化**；上游新增域名、语音 IP 变更后仍需更新本仓库。

## 可复制的实施计划

```text
1. 使用 JIAQI23333/proxy-routing-rules Public 仓库，默认分支 main；原创配置采用 MIT，派生规则遵循各来源许可证。
2. 维护五份 rules/*.list，共享给所有设备；只包含 GPT、Instagram、X、TikTok、Facebook。
3. Shadowrocket：先建立表中的五个 select 策略组，加入对应地区的本地节点，再导入并启用 routing.sgmodule。
4. Clash Party：导入 override.js 为 JavaScript 覆写，绑定正在使用的订阅并重新应用。
5. Clash Verge Rev：把同一份 override.js 全文粘贴到当前订阅的扩展脚本，保存并重新应用。
6. 在每台设备的五个组中手动选择实际节点；GPT 美国，Instagram/X/Facebook 香港，TikTok 台湾。
7. 开启按规则分流，检查五份规则下载成功，再通过连接日志验证命中的组及实际出口。
8. 以后增删域名只改对应 .list；切换节点只操作客户端策略组；修改映射时更新模块和 JS。
```

## Shadowrocket

### iOS 访问异常时的精简版对照

如果模块能导入、五个组已建立并选好节点，但启用后 GPT 等网站或图片无法访问，可使用[域名精简版模块](https://raw.githubusercontent.com/JIAQI23333/proxy-routing-rules/main/shadowrocket/routing-lite.sgmodule)做对照。它共 **91 条**内置规则：GPT 30、Instagram 7、X 11、TikTok 30、Facebook 13。

精简版保留主站、图片/文件、登录、视频/直播和语音相关域名，去掉 IP、ASN、历史域名和宽泛的第三方根域名。全部规则直接写在模块中，使用时不再下载五份远程规则集，也不依赖本模块触发 ASN 数据库查询。它不覆盖仅通过 IP 连接的语音等流量，这部分仍由主配置处理。

1. 保持原先选择的节点；**关闭原来的「五组手动分流」模块**，避免两个版本同时生效。
2. 导入下方地址，启用「五组手动分流·域名精简版」：

   ```text
   https://raw.githubusercontent.com/JIAQI23333/proxy-routing-rules/main/shadowrocket/routing-lite.sgmodule
   ```

3. 全局路由设为「配置」，使用/编译当前配置后重新连接，重开 GPT，依次测试文字、图片上传和图片生成。
4. 如果仍失败，再关闭精简版，用**同一个节点和之前能用的规则**测试。两边都失败时，应检查节点对该服务的可用性、DNS及主配置；只有开启某模块才失败时，记录失败请求的域名、命中规则和策略组后进一步定位。

模块仍引用上表的五个本机策略组，不会自动创建它们。此精简版用于隔离排查，不能把测试结果直接解释为“规则条数太多”：两版还同时改变了匹配范围、IP/ASN 和远程下载依赖。已检查内置规则格式、五组映射、关键域名匹配，并通过 Mihomo v1.19.34 语法校验；尚未在真实 iOS 上确认能解决访问问题。

精简版的规则内置于模块，后续更新需要**更新模块并重新应用配置**。刷新 `rules/*.list` 不会改变已经下载的精简模块。

### 共享规则集完整版

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

除首页外，按实际使用功能逐项验收：

| 服务 | 建议测试 |
| --- | --- |
| GPT | 登录、文字对话、上传图片/文件、生成并下载图片、语音对话 |
| Instagram | 动态图片、Reels、Story、私信附件、上传 |
| X | 登录、图片、视频、发帖附件、私信、Spaces |
| TikTok | 视频播放、图片帖、私信贴纸、上传、直播、Shop（账号可用时） |
| Facebook | 登录、动态图片、Reels、上传、Messenger 附件和通话 |

语音、直播和通话还要求所选节点及客户端能承载相应流量；例如 OpenAI 官方语音说明使用 UDP 3478。IP 条目保留 `no-resolve`，不会为了匹配规则主动解析每个域名。流量是否实际进入客户端、DNS、UDP 支持和节点服务可用性仍需检查。

TikTok 的分流只决定命中流量的代理出口，不修改账号地区、SIM、定位或内容推荐地区。仍只有表内五个策略组，不按 iOS / macOS / Windows 复制规则。

维护原则：增删域名改 `.list`；换节点在本机组内选择；改分流映射同步修改模块和 JS；不用时禁用模块/取消覆写关联并重新应用原配置。

2026-11-17 已用 Mihomo v1.19.34 验证全部 1090 条规则加载，并通过关键图片/文件、登录验证、语音、CDN、私信和直播域名的匹配检查；同时核对了官方 411 条语音 IP、分组映射、原配置保留及脚本重复应用。规则能加载和命中并不能代替真实账号下的功能测试。尚未在真实 Shadowrocket / Clash 客户端及实际代理出口上完成端到端测试，设备导入后仍须按上述步骤验收。

## 格式与域名参考

- [Mihomo 规则集合格式](https://wiki.metacubex.one/config/rule-providers/)与[代理组配置](https://wiki.metacubex.one/config/proxy-groups/)：`classical` + `text`、`select`、`include-all`、`filter`。
- [Clash Party 官方脚本执行实现](https://github.com/mihomo-party-org/clash-party/blob/main/src/main/core/factory.ts)与[Clash Verge Rev 自定义脚本](https://www.clashverge.dev/guide/script.html)：共用 `main(config)` 入口。
- [Shadowrocket 社区维护手册](https://github.com/LOWERTOP/Shadowrocket/wiki)：策略组、模块、规则资源更新。
- [OpenAI 网络域名说明](https://help.openai.com/en/articles/9247338-network-recommendations-for-chatgpt-errors-on-web-and-apps)：GPT 依赖和语音连接要求。
- [blackmatrix7 服务规则](https://github.com/blackmatrix7/ios_rule_script/tree/master/rule/Clash)及 [v2fly 服务域名](https://github.com/v2fly/domain-list-community/tree/master/data)：扩充来源，精确版本见上文和文件头。

原创客户端配置和说明采用 [MIT License](LICENSE)。`rules/*.list` 及内置这些规则选集的 `shadowrocket/routing-lite.sgmodule` 包含改编的第三方规则，按 [GPL v2](rules/LICENSE-GPL-2.0) 提供；其中 v2fly 内容保留其 [MIT 版权与许可声明](rules/LICENSE-v2fly-MIT)。规则文件均注明来源、上游版本和修改日期。
