// Clash Party / Clash Verge Rev: paste the entire file into a JavaScript override.
// Nodes stay in your local subscription. Region filters only inspect node names.
function main(config) {
  var base = "https://raw.githubusercontent.com/JIAQI23333/proxy-routing-rules/main/rules/";
  var regions = {
    hk: { name: "香港手动", filter: "(?i)(香港|🇭🇰|hong[ _-]?kong|(^|[^a-z])hk([^a-z]|$))" },
    tw: { name: "台湾手动", filter: "(?i)(台湾|台灣|臺灣|台北|臺北|🇹🇼|taiwan|taipei|(^|[^a-z])tw([^a-z]|$))" },
    us: { name: "美国手动", filter: "(?i)(美国|美國|🇺🇸|united[ _-]?states|(^|[^a-z])(us|usa)([^a-z]|$))" }
  };
  var gptGroup = {
    name: "美国自动",
    type: "url-test",
    "include-all": true,
    filter: regions.us.filter,
    url: "https://www.gstatic.com/generate_204",
    interval: 300,
    tolerance: 50,
    "expected-status": 204,
    "empty-fallback": "REJECT"
  };
  // Gemini and YouTube exceptions must precede the general Google suffixes.
  var routes = [
    { id: "instagram-x-youtube-facebook-gemini", group: regions.hk.name },
    { id: "google", group: regions.us.name },
    { id: "gpt", group: gptGroup.name },
    { id: "tiktok", group: regions.tw.name }
  ];
  var newGroups = Object.keys(regions).map(function (id) {
    var region = regions[id];
    return {
      name: region.name,
      type: "select",
      // Keep the selector usable without matching nodes, without falling back to DIRECT.
      proxies: ["REJECT"],
      "include-all": true,
      filter: region.filter
    };
  });
  newGroups.push(gptGroup);
  // Drop selectors created by the previous version when reapplying to an already patched config.
  var groupNames = newGroups.map(function (group) { return group.name; }).concat([
    "GPT-美国手动", "Instagram-香港手动", "X-香港手动", "TikTok-台湾手动", "Facebook-香港手动"
  ]);
  var retiredProviders = ["prr-instagram", "prr-x", "prr-facebook"];
  var providerNames = routes.map(function (route) { return "prr-" + route.id; }).concat(retiredProviders);
  var providers = config["rule-providers"] || {};
  retiredProviders.forEach(function (name) { delete providers[name]; });
  var groups = (config["proxy-groups"] || []).filter(function (group) {
    return groupNames.indexOf(group.name) === -1;
  });
  var rules = (config.rules || []).filter(function (rule) {
    var parts = rule.split(",");
    return !(parts[0].trim() === "RULE-SET" &&
      providerNames.indexOf((parts[1] || "").trim()) !== -1);
  });

  var newRules = routes.map(function (route) {
    var provider = "prr-" + route.id;
    providers[provider] = {
      type: "http",
      behavior: "classical",
      format: "text",
      url: base + route.id + ".list",
      path: "./ruleset/proxy-routing-rules/" + route.id + ".list",
      interval: 86400
    };
    return "RULE-SET," + provider + "," + route.group;
  });

  // Replace only this project's entries, so applying the script twice is safe.
  config["rule-providers"] = providers;
  config["proxy-groups"] = newGroups.concat(groups);
  config.rules = newRules.concat(rules);
  return config;
}
