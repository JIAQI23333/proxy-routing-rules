// Clash Party / Clash Verge Rev: paste the entire file into a JavaScript override.
// Nodes stay in your local subscription. Region filters only inspect node names.
function main(config) {
  var base = "https://raw.githubusercontent.com/JIAQI23333/proxy-routing-rules/main/rules/";
  var regionFilters = {
    hk: "(?i)(香港|🇭🇰|hong[ _-]?kong|(^|[^a-z])hk([^a-z]|$))",
    tw: "(?i)(台湾|台灣|臺灣|台北|臺北|🇹🇼|taiwan|taipei|(^|[^a-z])tw([^a-z]|$))",
    us: "(?i)(美国|美國|🇺🇸|united[ _-]?states|(^|[^a-z])(us|usa)([^a-z]|$))"
  };
  // YouTube must precede general Google suffixes, and GitHub must precede service keywords.
  var routes = [
    { id: "github", group: "香港-GitHub", region: "hk" },
    { id: "instagram-x-youtube-facebook", group: "香港-影音社交", region: "hk" },
    { id: "google", group: "台湾-Google", region: "tw" },
    { id: "tiktok", group: "台湾-TikTok", region: "tw" },
    { id: "gpt", group: "美国-GPT", region: "us" }
  ];
  var newGroups = [];
  var autoGroups = [];
  routes.forEach(function (route) {
    var automatic = route.group + "-自动测速";
    var filter = regionFilters[route.region];
    newGroups.push({
      name: route.group,
      type: "select",
      proxies: [automatic],
      "default-selected": automatic,
      "include-all": true,
      filter: filter
    });
    autoGroups.push({
      name: automatic,
      type: "url-test",
      hidden: true,
      "include-all": true,
      filter: filter,
      url: "https://www.gstatic.com/generate_204",
      interval: 300,
      tolerance: 50,
      "expected-status": 204,
      "empty-fallback": "REJECT"
    });
  });
  newGroups = newGroups.concat(autoGroups);
  // Drop selectors created by the previous version when reapplying to an already patched config.
  var groupNames = newGroups.map(function (group) { return group.name; }).concat([
    "香港手动", "香港自动", "台湾手动", "美国手动", "美国自动", "GPT-美国自动",
    "GPT-美国手动", "Instagram-香港手动", "X-香港手动", "TikTok-台湾手动", "Facebook-香港手动"
  ]);
  var retiredProviders = ["prr-instagram", "prr-x", "prr-facebook", "prr-instagram-x-youtube-facebook-gemini"];
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
