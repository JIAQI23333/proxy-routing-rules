# 三地手动分流

Shadowrocket（小火箭）、Clash Party 和 Clash Verge Rev 共用同一套分流规则，各设备独立选择节点。

| 策略组名称（须完全一致） | 服务 |
| --- | --- |
| `香港手动` | Instagram、X / Twitter、Facebook |
| `台湾手动` | TikTok |
| `美国手动` | ChatGPT、Gemini 及其他 Google 服务 |

三个组均为 `select` 手动选择类型。同一地区的服务共用该组选中的节点。以后新增服务时沿用相应地区的组名。

## 文件

```text
rules/
  google.list
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

`.list` 使用两种客户端共同支持的 `DOMAIN`、`DOMAIN-SUFFIX`、`DOMAIN-KEYWORD`、`IP-CIDR`、`IP-CIDR6` 和 `IP-ASN`。客户端配置负责把每份清单指向相应的地区组。仓库只存公开规则和配置逻辑，节点、订阅地址、密码和 Token 留在客户端。

## 覆盖范围与来源

### Google 与 Gemini

2026-11-20 加入 245 条 Google 规则，将下列服务、登录和媒体依赖统一指向 `美国手动`。

| 功能 | 覆盖的入口与依赖 |
| --- | --- |
| Gemini 对话、实时语音和摄像头 | Gemini 网站、Google 账号、Gemini Live API |
| AI Studio、Gemini API、Vertex AI | `aistudio.google.com`、`generativelanguage.googleapis.com`、各区域的 `aiplatform.googleapis.com` API 主机 |
| 图片、视频、语音和音乐 | Nano Banana、Imagen、Gemini Omni、Veo、Gemini TTS 和 Lyria 经 Gemini、AI Studio、Google Flow、Flow Music 或相应 API 使用 |
| NotebookLM、Google Vids 和 Google Labs | 音频摘要、视频摘要、AI 旁白、Project Genie 和其他 Labs 入口 |
| Google 常用服务 | 搜索及其地区域名、Gmail、Drive、Docs、Maps、Photos、Google Play、YouTube 和 Meet |

Gemini 和其他 Google AI 模型共用网站、API 和文件域名。只要新模型沿用这些入口，就会匹配现有规则。规则覆盖 `google.com`、`googleapis.com`、`googleusercontent.com`、`gstatic.com` 等后缀。其他网站调用 Google 登录、字体、统计或存储资源时，这些请求也会走美国组。Meet 的媒体连接另按官方公布的媒体 IP 匹配。 [Google AI Studio](https://aistudio.google.com/docs) · [Google DeepMind 模型](https://deepmind.google/models/) · [Google Labs](https://labs.google/) · [Google Workspace 网络说明](https://knowledge.workspace.google.com/admin/security/firewall-and-proxy-settings) · [Meet 媒体网络要求](https://knowledge.workspace.google.com/admin/meet/prepare-your-network-for-meet-meetings-and-live-streams)

### ChatGPT 与社交服务

2026-11-17 从原来的 32 条起步规则扩充为 1090 条。合并 blackmatrix7 和 v2fly/domain-list-community 的对应服务清单，并补充 OpenAI 官方网络说明及语音 IP。

| 规则集 | 原数量 → 当前数量 | 此次补充重点 |
| --- | --- | --- |
| GPT | 6 → 463 | 图片/文件存储、异步任务、验证登录、支付、语音；含官方 411 条语音 IP |
| Instagram | 3 → 74 | 图片 CDN、私信短链、视频及相关服务域名 |
| X / Twitter | 6 → 33 | 图片/视频 CDN、直播、登录、短链和 IP |
| TikTok | 11 → 52 | `ibyteimg.com` 图片、私信贴纸、直播、上传、区域 CDN、Shop |
| Facebook | 6 → 468 | 图片/视频、登录、消息/Messenger、CDN 和 Meta IP/ASN |

扩充时使用了以下来源快照。

- [blackmatrix7/ios_rule_script](https://github.com/blackmatrix7/ios_rule_script/tree/0b6897dc17e0c513d25449c935a9694818e32f0c/rule/Shadowrocket)，提交 `0b6897dc17e0c513d25449c935a9694818e32f0c`。
- [v2fly/domain-list-community](https://github.com/v2fly/domain-list-community/tree/41504eae2a11f305fe88cfc605cf6c105a80bf5a/data)，提交 `41504eae2a11f305fe88cfc605cf6c105a80bf5a`；Facebook 另合并其 Messenger 清单。
- [OpenAI 官方网络说明](https://help.openai.com/en/articles/9247338-network-recommendations-for-chatgpt-errors-on-web-and-apps)与[语音 IP 数据](https://openai.com/chatgpt-voice.json)，后者的源数据时间为 `2026-11-16T01:33:53.175979+00:00`。

去重时保留域名后缀覆盖范围，移除已被同一集合后缀完整覆盖的重复域名。GPT 的异步任务主机正则转为两个客户端都支持的 `chatgpt-async-webps-prod-` 关键词匹配，未加入整个 Azure 域名。

## 覆盖优先的取舍

- GPT 保留上游的 Auth0、Stripe、Sentry 等共享依赖，并补全官方列出的 WorkOS、Cloudflare 验证等地址。这些域名被其他软件使用时也会命中美国组。`ibyteimg.com` 在参考清单中属于字节系依赖，放入 TikTok 台湾组；GPT 的图片/文件域名包含 `oaiusercontent.com`、`oaistatic.com` 及 Azure 存储和异步处理地址。
- 未采用 OpenAI 上游的 `IP-ASN,20473`：它覆盖 [Vultr 的网络](https://docs.vultr.com/vultr-ip-space)，会把无关云服务器一起划入 GPT。改用 OpenAI 官方发布的语音 IP 明细，并保留上游两条单 IP 规则。
- TikTok 排除 CapCut、Trae、MarsCode、TikTok Music 的独立域名；X 排除独立的 `grok.com`；GPT 排除独立的 `sora.com`、`crixet.com`；Facebook 排除 WhatsApp、Oculus、Workplace 的独立域名。保留完成目标软件功能所用的共享依赖，因此这些其他软件访问共享域名时仍可能命中。
- `USER-AGENT` 和 `PROCESS-NAME` 没有放入共享文件：两种客户端及不同操作系统的支持不一致。TikTok 使用域名和关键词匹配。广告/统计标记在导入时仅作为来源标注，不生成拦截规则。
- Instagram 专属域名归入 Instagram 清单。共享的 `fbcdn.net`、`fbsbx.com`、Meta IP 和 AS32934 归入 Facebook 清单，两份清单都指向 `香港手动`。其他 Meta 服务访问相同资源也会命中该组。ASN 匹配依赖客户端的 ASN 数据库。

这些是已知依赖的扩充清单，无法保证未来所有功能或所有客户端版本永远不遗漏。此仓库保存的是上述来源的快照，**客户端刷新本仓库不等于实时合并上游变化**；上游新增域名、语音 IP 变更后仍需更新本仓库。

## 可复制的实施计划

```text
1. 使用 JIAQI23333/proxy-routing-rules 公开仓库的 main 分支。
2. 维护六份 rules/*.list，供两个客户端共用。
3. Shadowrocket 建立三个地区 select 策略组，加入对应地区的节点，再导入并启用 routing.sgmodule。
4. Clash Party 导入 override.js 为 JavaScript 覆写，绑定当前订阅并重新应用。
5. Clash Verge Rev 将同一份 override.js 全文粘贴到当前订阅的扩展脚本，保存并重新应用。
6. 在三个组里分别选择实际节点，确认六份规则已下载，再通过连接日志核对规则和出口。
7. 更新服务域名时修改对应的 .list，新增服务沿用三个地区组。
```

## Shadowrocket

### iOS 访问异常时的精简版对照

三个组均已选好节点且网站或图片仍无法访问时，可用域名精简版模块做对照。精简版共 122 条内置规则，包含 Google 31 条、GPT 30 条、Instagram 7 条、X 11 条、TikTok 30 条和 Facebook 13 条。

精简版将主站、登录、图片和文件、视频和语音相关域名直接写入模块。Google 条目覆盖 Gemini、AI Studio、NotebookLM、Flow 和 Flow Music 的核心域名。更多地区域名及仅通过 IP 连接的语音或视频流量由完整版处理。

1. 在三个地区组里保持相同的节点选择，关闭「三地手动分流」完整版模块。
2. 导入下面的模块地址，启用「三地手动分流·域名精简版」。

   ```text
   https://raw.githubusercontent.com/JIAQI23333/proxy-routing-rules/main/shadowrocket/routing-lite.sgmodule
   ```

3. 将全局路由设为「配置」，使用或编译当前配置后重新连接。重新打开受影响的服务，测试同一项功能。
4. 两个版本都失败时检查节点可用性、DNS 和主配置。只有启用其中一个模块时失败，可记录请求的域名、命中规则和策略组以定位差异。

精简版和完整版共用上表三个本机策略组。精简版内置域名规则，上传新版本后需要更新模块并重新应用配置。

### 共享规则集完整版

1. 备份当前配置。在「配置 → 当前配置的 ⓘ → 代理分组」建立上表三个 `select` 组，从本机订阅中加入对应地区的节点。升级时，可以把每个地区的一组重命名为对应的新名称并合并候选节点。
2. 在「配置 → 模块 → +」导入以下地址并启用。已导入旧模块时直接更新，模块引用本机已建立的策略组。

   ```text
   https://raw.githubusercontent.com/JIAQI23333/proxy-routing-rules/main/shadowrocket/routing.sgmodule
   ```

3. 使用或编译当前配置，确认六份规则均已下载。将全局路由设为「配置」，在三个组里分别选好节点后重新连接。
4. 升级后，检查自定义规则或其他模块中的旧组名，改为相应的地区组后移除多余的旧组。已有其他模块匹配相同域名时，按连接日志调整模块顺序。

域名规则变化后，在「规则集 URL」刷新资源，并使用/编译配置；模块文件变化后，先更新模块再重新应用。仅刷新模块不等于所有规则资源都已重新加载。

## Clash Party / Clash Verge Rev

共用脚本地址：

```text
https://raw.githubusercontent.com/JIAQI23333/proxy-routing-rules/main/mihomo/override.js
```

- **Clash Party**：在「覆写」导入这个远程 JS；也可以新建 JavaScript 覆写并粘贴全文。把覆写关联到正在使用的订阅，保存后重新应用订阅。
- **Clash Verge Rev**：右键当前订阅，打开「扩展脚本」，粘贴脚本全文并保存、重新应用。已有脚本时先备份并合并逻辑，文件中保留一个 `main(config)` 入口。

切换到「规则」模式，打开三个地区策略组，**升级后首次使用须分别将 `REJECT` 改为实际节点**。脚本按节点名称中的国家名、英文地区缩写或旗帜筛选，支持订阅直接提供的节点及 `proxy-providers`。若组里只有 `REJECT`，先确认订阅有对应地区的节点，再检查脚本中 `regions` 的筛选表达式。

名称筛选不能验证真实出口地区。`REJECT` 用于未选择节点或没有匹配节点的情况，不自动改走直连或其他地区。切换到实际节点后，该组保持手动选择。

脚本把本项目的六条 `RULE-SET` 放到原规则前面，重新应用时替换本项目的旧组和旧规则，并保留订阅提供的其他规则、组和节点配置。自定义规则或代理组若手动引用了旧组名，请在原配置中改为对应地区的名称。其他覆写若之后又重写规则或代理组，需调整执行顺序。

Mihomo 每 `86400` 秒更新六份 `.list`，也可在客户端手动更新规则集合。JS 修改后，Party 需要更新远程覆写或重新粘贴，Verge Rev 需要重新粘贴并保存。JS 地址用于覆写或扩展脚本。

## 验收与维护

访问 `gemini.google.com`、`aistudio.google.com`、`chatgpt.com`、`instagram.com`、`x.com`、`tiktok.com` 和 `facebook.com`，在连接日志中确认命中的组及选中的节点。测试前断开旧连接，确保客户端接管被测流量。

除首页外，按实际使用功能逐项验收：

| 服务 | 建议测试 |
| --- | --- |
| Google 与 Gemini | 登录、上传文件或图片、Gemini Live 语音、Flow 视频生成与下载、Flow Music 音乐生成、NotebookLM 音频摘要、YouTube 播放 |
| GPT | 登录、文字对话、上传图片/文件、生成并下载图片、语音对话 |
| Instagram | 动态图片、Reels、Story、私信附件、上传 |
| X | 登录、图片、视频、发帖附件、私信、Spaces |
| TikTok | 视频播放、图片帖、私信贴纸、上传、直播、Shop（账号可用时） |
| Facebook | 登录、动态图片、Reels、上传、Messenger 附件和通话 |

语音、直播和通话还要求所选节点及客户端能承载相应流量。IP 条目使用 `no-resolve`，在目的 IP 已知时参与匹配。必要时检查节点的 UDP 支持。

TikTok 的出口由 `台湾手动` 选择，账号地区、SIM 和定位由客户端和设备各自管理。

增删域名时编辑对应的 `.list`，核心域名变化时同步更新精简版。修改分流映射时同步更新 Shadowrocket 模块和 Clash 脚本，沿用表内三个地区组名。停用时在客户端关闭模块或取消覆写关联，再重新应用原配置。

2026-11-20 使用 Mihomo v1.19.34 验证加载六份清单共 1335 条规则，并通过 54 项本机路由匹配检查，包含 Google AI、Meet IPv4 / IPv6 和原有服务。另核对了两份客户端配置的规则映射、Clash 旧组升级、重复应用和订阅地区节点筛选。Shadowrocket 实机导入与实际节点出口待设备侧验收。

## 格式与域名参考

- [Mihomo 规则集合格式](https://wiki.metacubex.one/config/rule-providers/)与[代理组配置](https://wiki.metacubex.one/config/proxy-groups/)：`classical` + `text`、`select`、`include-all`、`filter`。
- [Clash Party 官方脚本执行实现](https://github.com/mihomo-party-org/clash-party/blob/main/src/main/core/factory.ts)与[Clash Verge Rev 自定义脚本](https://www.clashverge.dev/guide/script.html)：共用 `main(config)` 入口。
- [Shadowrocket 社区维护手册](https://github.com/LOWERTOP/Shadowrocket/wiki)：策略组、模块、规则资源更新。
- [OpenAI 网络域名说明](https://help.openai.com/en/articles/9247338-network-recommendations-for-chatgpt-errors-on-web-and-apps)：GPT 依赖和语音连接要求。
- [blackmatrix7 服务规则](https://github.com/blackmatrix7/ios_rule_script/tree/master/rule/Clash)及 [v2fly 服务域名](https://github.com/v2fly/domain-list-community/tree/master/data)：扩充来源，精确版本见上文和文件头。

原创客户端配置、说明和 Google 清单采用 MIT。改编的第三方规则及内置这些规则选集的 `shadowrocket/routing-lite.sgmodule` 按 GPL v2 提供，其中 v2fly 内容保留其 MIT 版权与许可声明。来源及修改日期见各清单文件头。 [MIT License](LICENSE) · [GPL v2](rules/LICENSE-GPL-2.0) · [v2fly MIT 许可](rules/LICENSE-v2fly-MIT)
