# 个人分流规则

> 本仓库暂时只为我自己的设备、订阅和使用习惯优化维护。

Shadowrocket（小火箭）、Clash Party 和 Clash Verge Rev 共用同一套分流规则，各设备独立选择节点。

| 策略组名称（两端一致） | 服务 |
| --- | --- |
| `香港-影音社交` | YouTube、X / Twitter、Facebook、Instagram |
| `香港-GitHub` | GitHub |
| `台湾-Google` | Antigravity、Gemini 网页与 App、Google 通用服务、Google One、Google Payments 和其他 Google AI |
| `台湾-TikTok` | TikTok |
| `美国-GPT` | GPT / ChatGPT 和 OpenAI API |

Clash 的五个组各自默认测速选节点，也可以在各组手动固定。小火箭使用同名策略组，在客户端设置选节点方式。

## 文件

```text
rules/
  github.list
  google.list
  gpt.list
  instagram-x-youtube-facebook.list
  tiktok.list
licenses/
  LICENSE-MIT
  LICENSE-GPL-2.0
  LICENSE-v2fly-MIT
shadowrocket/routing.sgmodule
mihomo/override.js
README.md
```

`.list` 使用两种客户端共同支持的 `DOMAIN`、`DOMAIN-SUFFIX`、`DOMAIN-KEYWORD`、`IP-CIDR`、`IP-CIDR6` 和 `IP-ASN`。客户端配置负责把每份清单指向相应的地区组。仓库只存公开规则和配置逻辑，节点、订阅地址、密码和 Token 留在客户端。

## 覆盖范围与来源

### GitHub

`github.list` 单独指向 `香港-GitHub`。覆盖 GitHub 网站、Git 的 HTTPS 和 SSH 主机、API、Raw、Release、LFS、Actions、Packages、容器镜像、Pages、Codespaces 和 GitHub Copilot。GitHub 使用的共享云和第三方服务按各自的域名匹配。GitHub 规则排在社交和 GPT 的域名关键词前。 [GitHub 网络域名说明](https://docs.github.com/en/actions/reference/runners/self-hosted-runners) · [GitHub Copilot 域名说明](https://docs.github.com/en/copilot/reference/copilot-allowlist-reference)

### Google、Gemini 和 Antigravity

Gemini 网页、iOS App、登录、上传和开发者 API 按 Google 清单走 `台湾-Google`。AI Studio、NotebookLM、Flow、Flow Music、Vertex AI，以及搜索、Gmail、Drive、Google Play、Google One 和 Meet 也走该组。 [Google Gemini 防火墙说明](https://knowledge.workspace.google.com/admin/generative-ai/gemini-app/gemini-app-firewall-settings) · [Google AI Studio](https://aistudio.google.com/docs)

Antigravity 的网站、Google OAuth、模型 API（如 `businessaicode.googleapis.com`、`cloudcode-pa.googleapis.com`）和安装包下载都匹配同一台湾组。桌面 App、CLI 和 IDE 的更新域名按完整主机名匹配。 [Antigravity 网络端点](https://antigravity.google/docs/enterprise/#network-allowlists-and-mtls-endpoints) · [Google Cloud 部署说明](https://docs.cloud.google.com/docs/security/compliance/deploy-antigravity-us-public-sector)

YouTube 播放、图片和 API 域名优先匹配 `香港-影音社交`。其他服务请求共享媒体域名 `googlevideo.com` 或 `ggpht.com` 时，也会走影音社交组。Google 共用登录、字体和存储走台湾，Meet 的实时媒体另有官方 IP 规则。 [Google Workspace 网络说明](https://knowledge.workspace.google.com/admin/security/firewall-and-proxy-settings) · [Meet 媒体网络要求](https://knowledge.workspace.google.com/admin/meet/prepare-your-network-for-meet-meetings-and-live-streams)

### Gemini 订阅付款

- Gemini 网页的升级入口及转到 Google One 或 Google Payments 的结账请求均走 `台湾-Google`。付款页引入的第三方域名各按自身规则匹配。 [Google 的 Gemini 订阅说明](https://support.google.com/gemini/answer/14517446?co=GENIE.Platform%3DiOS)
- iOS 显示 Apple 内购确认时，Apple 商店和扣款请求沿用设备原有的 Apple 分流。若 App 打开 Google 网页结账，则采用上一条的域名分流。已有 Google One 订阅通常由最初的购买渠道管理。 [Google One 的 iOS 升级说明](https://support.google.com/googleone/answer/16476811?co=GENIE.Platform%3DiOS) · [Apple 账户付款方式](https://support.apple.com/111741)
- 代理改变请求的出口 IP。Google 付款资料的国家或地区以及 Apple 商店地区由各自的账户资料决定。Google 可能对异常登录或付款要求额外验证，使用与实际账单地区相符的付款方式。 [Google 付款资料](https://support.google.com/paymentscenter/answer/9028746) · [Google 付款验证说明](https://support.google.com/paymentscenter/answer/7644078)

### ChatGPT 与社交服务

2026-11-17 从原来的 32 条起步规则扩充为 1090 条。合并 blackmatrix7 和 v2fly/domain-list-community 的对应服务清单，并补充 OpenAI 官方网络说明及语音 IP。

| 服务 | 起步 → 2026-11-17 扩充 | 当时补充重点 |
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

- GPT 保留 Auth0、Stripe、Sentry、WorkOS、Cloudflare 验证等共享依赖。这些域名被其他软件使用时也会命中 `美国-GPT`。GPT 的图片和文件域名包含 `oaiusercontent.com`、`oaistatic.com` 及 Azure 存储和异步处理地址。字节系的 `ibyteimg.com` 由 TikTok 清单匹配。
- 未采用 OpenAI 上游的 `IP-ASN,20473`：它覆盖 [Vultr 的网络](https://docs.vultr.com/vultr-ip-space)，会把无关云服务器一起划入 GPT。改用 OpenAI 官方发布的语音 IP 明细，并保留上游两条单 IP 规则。
- TikTok 排除 CapCut、Trae、MarsCode、TikTok Music 的独立域名；X 排除独立的 `grok.com`；GPT 排除独立的 `sora.com`、`crixet.com`；Facebook 排除 WhatsApp、Oculus、Workplace 的独立域名。保留完成目标软件功能所用的共享依赖，因此这些其他软件访问共享域名时仍可能命中。
- `USER-AGENT` 和 `PROCESS-NAME` 没有放入共享文件：两种客户端及不同操作系统的支持不一致。TikTok 使用域名和关键词匹配。广告/统计标记在导入时仅作为来源标注，不生成拦截规则。
- Instagram 和 Facebook 共享的 `fbcdn.net`、`fbsbx.com`、Meta IP 和 AS32934 都在香港合并清单。其他 Meta 服务访问相同资源时也会命中。ASN 匹配依赖客户端的 ASN 数据库。

这些是已知依赖的扩充清单，无法保证未来所有功能或所有客户端版本永远不遗漏。此仓库保存的是上述来源的快照，**客户端刷新本仓库不等于实时合并上游变化**；上游新增域名、语音 IP 变更后仍需更新本仓库。

## 可复制的实施计划

```text
1. 使用 JIAQI23333/proxy-routing-rules 公开仓库的 main 分支。
2. 维护五份 rules/*.list，供两个客户端共用。
3. Shadowrocket 按表建立或重命名五个组，核对候选节点地区，再更新并启用 routing.sgmodule。
4. Clash Party 导入 override.js 为 JavaScript 覆写，绑定当前订阅并重新应用。
5. Clash Verge Rev 将同一份 override.js 全文粘贴到当前订阅的扩展脚本，保存并重新应用。
6. 确认 Clash 五个组默认选中自动测速，五份清单均已下载，再从连接日志核对出口。
7. 更新服务域名时修改对应的 .list，保留 YouTube 优先于 Google 通用规则的顺序。
```

## Shadowrocket

1. 备份当前配置。在「配置 → 当前配置的 ⓘ → 代理分组」按表建立或重命名五个组。旧的 `美国手动` 对应 `台湾-Google`，改名后把候选节点换成台湾节点。需要手选的组使用 `select`，需要自动测速的组使用 `url-test`。
2. 在「配置 → 模块 → +」导入以下地址并启用。已导入同一地址时直接更新模块。升级前关闭设备上以前下载的精简版。

   ```text
   https://raw.githubusercontent.com/JIAQI23333/proxy-routing-rules/main/shadowrocket/routing.sgmodule
   ```

3. 使用或编译当前配置，确认五份规则均已下载。将全局路由设为「配置」，检查各组当前节点后重新连接。
4. 自定义规则或其他模块如果引用了旧组名或旧影音社交清单，请同步更新。已有其他模块匹配相同域名时，按连接日志调整模块顺序。

域名规则变化后，在「规则集 URL」刷新资源，并使用/编译配置；模块文件变化后，先更新模块再重新应用。仅刷新模块不等于所有规则资源都已重新加载。

## Clash Party / Clash Verge Rev

共用脚本地址：

```text
https://raw.githubusercontent.com/JIAQI23333/proxy-routing-rules/main/mihomo/override.js
```

- **Clash Party**：在「覆写」导入这个远程 JS；也可以新建 JavaScript 覆写并粘贴全文。把覆写关联到正在使用的订阅，保存后重新应用订阅。
- **Clash Verge Rev**：右键当前订阅，打开「扩展脚本」，粘贴脚本全文并保存、重新应用。已有脚本时先备份并合并逻辑，文件中保留一个 `main(config)` 入口。

切换到「规则」模式。五个 `select` 组默认选中各自的「自动测速」子组。点选具体节点后，该组固定使用所选节点，切回「自动测速」即可恢复自动。支持 `hidden` 的客户端会在顶层隐藏测速子组，子组仍可在各组内选择。 [Mihomo 策略组参数](https://wiki.metacubex.one/en/config/proxy-groups/)

手动和自动候选都按节点名称中的地区名、英文缩写或旗帜筛选。使用 `proxy-providers` 时由提供者负责自己的健康检查。没有匹配节点的自动子组使用 `REJECT`。连接日志可核对实际出口。

脚本把本项目的五条 `RULE-SET` 放到原规则前面，重新应用时替换本项目的旧组和旧规则。自定义规则或组若引用了旧的独立社交规则集或旧组名，请同步更新。其他覆写若之后又重写规则或代理组，需调整执行顺序。

Mihomo 每 `86400` 秒更新五份 `.list`，也可在客户端手动更新规则集合。升级时，Party 需要更新远程覆写或重新粘贴，Verge Rev 需要重新粘贴并保存。

### 查看组内服务与选择自动组

服务对应关系见本页顶部的表。客户端支持查看规则集时，`prr-instagram-x-youtube-facebook` 对应 `香港-影音社交`，`prr-github` 对应 `香港-GitHub`。组内条目均可用于选节点。 [Mihomo 策略组参数](https://wiki.metacubex.one/en/config/proxy-groups/)

`url-test` 是 Mihomo 内置的测速策略，订阅 YAML 本身即可配置。这里的 JavaScript 将策略组加入现有订阅。如果一个手动 `select` 组把自动组列在 `proxies` 里，点击这个组就会委托它持续测速选择实际节点。直接在自动组里指定某个实际节点时，支持固定选择的客户端可能会固定该节点。 [Mihomo 自动测速组](https://wiki.metacubex.one/en/config/proxy-groups/url-test/) · [Mihomo 节点选择接口](https://wiki.metacubex.one/en/api/)

## 验收与维护

访问 `github.com`、`gemini.google.com`、`aistudio.google.com`、`chatgpt.com`、`instagram.com`、`x.com`、`tiktok.com` 和 `facebook.com`，在连接日志中确认命中的组及选中的节点。测试前断开旧连接，确保客户端接管被测流量。

除首页外，按实际使用功能逐项验收：

| 服务 | 建议测试 |
| --- | --- |
| Gemini 网页与 iOS App | 在连接日志分别检查首页、登录、对话、上传图片、Gemini Live 以及打开升级页面的分流 |
| Google 与 YouTube | 核对 Antigravity 登录、模型调用、检查更新，以及 AI Studio、Flow、NotebookLM、Google One 的台湾出口和 YouTube 的香港出口 |
| GPT | 登录、文字对话、上传图片/文件、生成并下载图片、语音对话 |
| GitHub | 打开仓库、拉取代码、下载 Raw 和 Release 文件，核对 `香港-GitHub` 组的节点 |
| Instagram | 动态图片、Reels、Story、私信附件、上传 |
| X | 登录、图片、视频、发帖附件、私信、Spaces |
| TikTok | 视频播放、图片帖、私信贴纸、上传、直播、Shop（账号可用时） |
| Facebook | 登录、动态图片、Reels、上传、Messenger 附件和通话 |

语音、直播和通话还要求所选节点及客户端能承载相应流量。IP 条目使用 `no-resolve`，在目的 IP 已知时参与匹配。必要时检查节点的 UDP 支持。

TikTok 的出口由 `台湾-TikTok` 选择，账号地区、SIM 和定位由客户端和设备各自管理。

增删域名时编辑对应的 `.list`。修改分流映射时同步更新 Shadowrocket 模块和 Clash 脚本。停用时在客户端关闭模块或取消覆写关联，再重新应用原配置。

Mihomo v1.19.34 已加载五份清单共 1354 条规则，并通过 54 项本机匹配检查。另用模拟节点验证了五组的默认自动选择、Google 组的手动固定和恢复自动。iOS 实机以 Shadowrocket 的连接日志为准。

## 格式与域名参考

- [Mihomo 规则集合格式](https://wiki.metacubex.one/config/rule-providers/)与[代理组配置](https://wiki.metacubex.one/config/proxy-groups/)：`classical` + `text`、`select`、`include-all`、`filter`。
- [Clash Party 官方脚本执行实现](https://github.com/mihomo-party-org/clash-party/blob/main/src/main/core/factory.ts)与[Clash Verge Rev 自定义脚本](https://www.clashverge.dev/guide/script.html)：共用 `main(config)` 入口。
- [Shadowrocket 社区维护手册](https://github.com/LOWERTOP/Shadowrocket/wiki)：策略组、模块、规则资源更新。
- [OpenAI 网络域名说明](https://help.openai.com/en/articles/9247338-network-recommendations-for-chatgpt-errors-on-web-and-apps)：GPT 依赖和语音连接要求。
- [blackmatrix7 服务规则](https://github.com/blackmatrix7/ios_rule_script/tree/master/rule/Clash)及 [v2fly 服务域名](https://github.com/v2fly/domain-list-community/tree/master/data)：扩充来源，精确版本见上文和文件头。

原创客户端配置、说明、Google 和 GitHub 清单采用 MIT。改编的第三方规则按 GPL v2 提供，v2fly 内容保留其 MIT 版权和许可声明。许可文件集中在 `licenses/`，规则来源见各清单文件头。 [MIT License](licenses/LICENSE-MIT) · [GPL v2](licenses/LICENSE-GPL-2.0) · [v2fly MIT 许可](licenses/LICENSE-v2fly-MIT)
