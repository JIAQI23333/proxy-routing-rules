# 个人分流规则

> 本仓库暂时只为我自己的设备、订阅和使用习惯优化维护。

Shadowrocket（小火箭）、Clash Party 和 Clash Verge Rev 共用同一套分流规则，各设备独立选择节点。

| 策略组名称（须完全一致） | 类型 | 服务 |
| --- | --- | --- |
| `香港手动` | `select` | Instagram、X / Twitter、YouTube、Facebook、Gemini 网页与 iOS App |
| `台湾手动` | `select` | TikTok |
| `美国手动` | `select` | Google 通用服务、Google One、Google Payments 和开发者 API |
| `GPT-美国自动` | `url-test` | GPT / ChatGPT |
| `香港自动` | `url-test` | GitHub |

手动组各自选节点。两个自动组分别从美国、香港的候选节点中测速选择。

## 文件

```text
rules/
  github.list
  google.list
  gpt.list
  instagram-x-youtube-facebook-gemini.list
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

`github.list` 单独指向 `香港自动`。覆盖 GitHub 网站、Git 的 HTTPS 和 SSH 主机、API、Raw、Release、LFS、Actions、Packages、容器镜像、Pages、Codespaces 和 GitHub Copilot。GitHub 使用的共享云和第三方服务按各自的域名匹配。规则在 GPT 的域名关键词之前匹配，GitHub 上带有 OpenAI 字样的项目或站点仍走香港自动。 [GitHub 网络域名说明](https://docs.github.com/en/actions/reference/runners/self-hosted-runners) · [GitHub Copilot 域名说明](https://docs.github.com/en/copilot/reference/copilot-allowlist-reference)

### Gemini 网页、iOS App 和 YouTube

香港合并清单优先匹配 `gemini.google.com`、`gemini.gstatic.com`、`jnn-pa.googleapis.com`、`proactivebackend-pa.googleapis.com`、Gemini 网页后端和 YouTube 的播放、图片及 API 域名。Google 共用账号、OAuth、通用 API、文件存储和静态资源仍按 `google.list` 分流。iOS App 和网页的一次操作可以同时产生两组连接。 [Google Gemini 防火墙说明](https://knowledge.workspace.google.com/admin/generative-ai/gemini-app/gemini-app-firewall-settings) · [v2fly Gemini 域名](https://github.com/v2fly/domain-list-community/blob/master/data/google-deepmind)

### Google 通用服务

搜索、Gmail、Drive、Docs、Maps、Photos、Google Play、Google One 和 Meet 走 `美国手动`。AI Studio、NotebookLM、独立的 Flow 与 Flow Music 网站、Gemini 开发者 API 和 Vertex AI 也走该组。在 Gemini App 或网页内调用模型时，按实际访问的主机名匹配。 [Google AI Studio](https://aistudio.google.com/docs) · [Google Workspace 网络说明](https://knowledge.workspace.google.com/admin/security/firewall-and-proxy-settings)

其他网站调用 Google 登录、字体、统计或存储时，相应请求也会命中 Google 清单。Meet 的实时媒体可按官方发布的媒体 IP 单独匹配。YouTube 的 `googlevideo.com` 和 `ggpht.com` 是共享媒体域名，其他服务访问这些域名时也会走香港组。 [Meet 媒体网络要求](https://knowledge.workspace.google.com/admin/meet/prepare-your-network-for-meet-meetings-and-live-streams)

### Gemini 订阅付款

- 从 Gemini 网页打开升级入口时，Gemini 页面走 `香港手动`。进入 Google One 或 Google Payments 后，`one.google.com`、`payments.google.com` 等匹配 `美国手动`。付款页引入的其他域名各按自身规则匹配。 [Google 的 Gemini 订阅说明](https://support.google.com/gemini/answer/14517446?co=GENIE.Platform%3DiOS)
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

- GPT 保留 Auth0、Stripe、Sentry、WorkOS、Cloudflare 验证等共享依赖。这些域名被其他软件使用时也会命中 `GPT-美国自动`。GPT 的图片和文件域名包含 `oaiusercontent.com`、`oaistatic.com` 及 Azure 存储和异步处理地址。字节系的 `ibyteimg.com` 由 TikTok 清单匹配。
- 未采用 OpenAI 上游的 `IP-ASN,20473`：它覆盖 [Vultr 的网络](https://docs.vultr.com/vultr-ip-space)，会把无关云服务器一起划入 GPT。改用 OpenAI 官方发布的语音 IP 明细，并保留上游两条单 IP 规则。
- TikTok 排除 CapCut、Trae、MarsCode、TikTok Music 的独立域名；X 排除独立的 `grok.com`；GPT 排除独立的 `sora.com`、`crixet.com`；Facebook 排除 WhatsApp、Oculus、Workplace 的独立域名。保留完成目标软件功能所用的共享依赖，因此这些其他软件访问共享域名时仍可能命中。
- `USER-AGENT` 和 `PROCESS-NAME` 没有放入共享文件：两种客户端及不同操作系统的支持不一致。TikTok 使用域名和关键词匹配。广告/统计标记在导入时仅作为来源标注，不生成拦截规则。
- Instagram 和 Facebook 共享的 `fbcdn.net`、`fbsbx.com`、Meta IP 和 AS32934 都在香港合并清单。其他 Meta 服务访问相同资源时也会命中。ASN 匹配依赖客户端的 ASN 数据库。

这些是已知依赖的扩充清单，无法保证未来所有功能或所有客户端版本永远不遗漏。此仓库保存的是上述来源的快照，**客户端刷新本仓库不等于实时合并上游变化**；上游新增域名、语音 IP 变更后仍需更新本仓库。

## 可复制的实施计划

```text
1. 使用 JIAQI23333/proxy-routing-rules 公开仓库的 main 分支。
2. 维护五份 rules/*.list，供两个客户端共用。
3. Shadowrocket 建立表中的三个手动组和两个自动组，再导入并启用 routing.sgmodule。
4. Clash Party 导入 override.js 为 JavaScript 覆写，绑定当前订阅并重新应用。
5. Clash Verge Rev 将同一份 override.js 全文粘贴到当前订阅的扩展脚本，保存并重新应用。
6. 在三个手动组里分别选节点，确认两个自动组已测速、五份清单均已下载，再从连接日志核对出口。
7. 更新服务域名时修改对应的 .list，保留香港清单优先于 Google 通用清单的顺序。
```

## Shadowrocket

1. 备份当前配置。在「配置 → 当前配置的 ⓘ → 代理分组」按表建立组，从本机订阅加入对应地区的节点。可把旧的 `美国自动` 改名为 `GPT-美国自动`，再新增 `香港自动`。两个自动组都使用 `url-test`，候选分别为美国节点和香港节点。
2. 在「配置 → 模块 → +」导入以下地址并启用。已导入同一地址时直接更新模块。升级前关闭设备上以前下载的精简版。

   ```text
   https://raw.githubusercontent.com/JIAQI23333/proxy-routing-rules/main/shadowrocket/routing.sgmodule
   ```

3. 使用或编译当前配置，确认五份规则均已下载。将全局路由设为「配置」，选好手动组节点后重新连接。
4. 检查自定义规则或其他模块中的旧组名和独立社交清单链接，更新为当前组名及合并清单。已有其他模块匹配相同域名时，按连接日志调整模块顺序。

域名规则变化后，在「规则集 URL」刷新资源，并使用/编译配置；模块文件变化后，先更新模块再重新应用。仅刷新模块不等于所有规则资源都已重新加载。

## Clash Party / Clash Verge Rev

共用脚本地址：

```text
https://raw.githubusercontent.com/JIAQI23333/proxy-routing-rules/main/mihomo/override.js
```

- **Clash Party**：在「覆写」导入这个远程 JS；也可以新建 JavaScript 覆写并粘贴全文。把覆写关联到正在使用的订阅，保存后重新应用订阅。
- **Clash Verge Rev**：右键当前订阅，打开「扩展脚本」，粘贴脚本全文并保存、重新应用。已有脚本时先备份并合并逻辑，文件中保留一个 `main(config)` 入口。

切换到「规则」模式，在三个手动组选择实际节点。两个自动组按节点名称中的国家名、英文地区缩写或旗帜筛选后测速。使用 `proxy-providers` 的节点时，节点提供者负责自己的健康检查。 [Mihomo 策略组参数](https://wiki.metacubex.one/en/config/proxy-groups/)

名称用于筛选候选，连接日志可核对实际出口。手动组默认 `REJECT`，选过的组沿用客户端保存的节点。自动组没有匹配节点时使用 `REJECT`。

脚本把本项目的五条 `RULE-SET` 放到原规则前面，重新应用时替换本项目的旧组和旧规则。自定义规则或组若引用了旧的独立社交规则集或旧组名，请同步更新。其他覆写若之后又重写规则或代理组，需调整执行顺序。

Mihomo 每 `86400` 秒更新五份 `.list`，也可在客户端手动更新规则集合。升级时，Party 需要更新远程覆写或重新粘贴，Verge Rev 需要重新粘贴并保存。

### 查看组内服务与选择自动组

服务对应关系见本页顶部的表。客户端支持查看规则集时，`prr-instagram-x-youtube-facebook-gemini` 对应 `香港手动`，`prr-github` 对应 `香港自动`。Clash 的组内成员是可选的代理或子组。把说明文字做成空壳成员后，选中它会改变实际出口。 [Mihomo 策略组参数](https://wiki.metacubex.one/en/config/proxy-groups/)

`url-test` 是 Mihomo 内置的测速策略，订阅 YAML 本身即可配置。这里的 JavaScript 将策略组加入现有订阅。如果一个手动 `select` 组把自动组列在 `proxies` 里，点击这个组就会委托它持续测速选择实际节点。直接在自动组里指定某个实际节点时，支持固定选择的客户端可能会固定该节点。 [Mihomo 自动测速组](https://wiki.metacubex.one/en/config/proxy-groups/url-test/) · [Mihomo 节点选择接口](https://wiki.metacubex.one/en/api/)

## 验收与维护

访问 `github.com`、`gemini.google.com`、`aistudio.google.com`、`chatgpt.com`、`instagram.com`、`x.com`、`tiktok.com` 和 `facebook.com`，在连接日志中确认命中的组及选中的节点。测试前断开旧连接，确保客户端接管被测流量。

除首页外，按实际使用功能逐项验收：

| 服务 | 建议测试 |
| --- | --- |
| Gemini 网页与 iOS App | 在连接日志分别检查首页、登录、对话、上传图片、Gemini Live 以及打开升级页面的分流 |
| Google 与 YouTube | 检查 AI Studio、Flow、NotebookLM 与 Google One 的美国手动出口，以及 YouTube 播放的香港手动出口 |
| GPT | 登录、文字对话、上传图片/文件、生成并下载图片、语音对话 |
| GitHub | 打开仓库、拉取代码、下载 Raw 和 Release 文件，核对香港自动组的节点 |
| Instagram | 动态图片、Reels、Story、私信附件、上传 |
| X | 登录、图片、视频、发帖附件、私信、Spaces |
| TikTok | 视频播放、图片帖、私信贴纸、上传、直播、Shop（账号可用时） |
| Facebook | 登录、动态图片、Reels、上传、Messenger 附件和通话 |

语音、直播和通话还要求所选节点及客户端能承载相应流量。IP 条目使用 `no-resolve`，在目的 IP 已知时参与匹配。必要时检查节点的 UDP 支持。

TikTok 的出口由 `台湾手动` 选择，账号地区、SIM 和定位由客户端和设备各自管理。

增删域名时编辑对应的 `.list`。修改分流映射时同步更新 Shadowrocket 模块和 Clash 脚本。停用时在客户端关闭模块或取消覆写关联，再重新应用原配置。

Mihomo v1.19.34 已加载五份清单共 1362 条规则，并通过 33 项本机匹配检查。另用模拟节点确认手动组选择自动子组后，子组可以继续切换节点。iOS 实机以 Shadowrocket 的连接日志为准。

## 格式与域名参考

- [Mihomo 规则集合格式](https://wiki.metacubex.one/config/rule-providers/)与[代理组配置](https://wiki.metacubex.one/config/proxy-groups/)：`classical` + `text`、`select`、`include-all`、`filter`。
- [Clash Party 官方脚本执行实现](https://github.com/mihomo-party-org/clash-party/blob/main/src/main/core/factory.ts)与[Clash Verge Rev 自定义脚本](https://www.clashverge.dev/guide/script.html)：共用 `main(config)` 入口。
- [Shadowrocket 社区维护手册](https://github.com/LOWERTOP/Shadowrocket/wiki)：策略组、模块、规则资源更新。
- [OpenAI 网络域名说明](https://help.openai.com/en/articles/9247338-network-recommendations-for-chatgpt-errors-on-web-and-apps)：GPT 依赖和语音连接要求。
- [blackmatrix7 服务规则](https://github.com/blackmatrix7/ios_rule_script/tree/master/rule/Clash)及 [v2fly 服务域名](https://github.com/v2fly/domain-list-community/tree/master/data)：扩充来源，精确版本见上文和文件头。

原创客户端配置、说明、Google 和 GitHub 清单采用 MIT。改编的第三方规则按 GPL v2 提供，v2fly 内容保留其 MIT 版权和许可声明。许可文件集中在 `licenses/`，规则来源见各清单文件头。 [MIT License](licenses/LICENSE-MIT) · [GPL v2](licenses/LICENSE-GPL-2.0) · [v2fly MIT 许可](licenses/LICENSE-v2fly-MIT)
