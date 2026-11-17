// Clash Party / Clash Verge Rev: paste the entire file into a JavaScript override.
// Nodes stay in your local subscription. Region filters only inspect node names.
function main(config) {
  var base = "https://raw.githubusercontent.com/JIAQI23333/proxy-routing-rules/main/rules/";
  var us = "(?i)(美国|美國|🇺🇸|united[ _-]?states|(^|[^a-z])(us|usa)([^a-z]|$))";
  var hk = "(?i)(香港|🇭🇰|hong[ _-]?kong|(^|[^a-z])hk([^a-z]|$))";
  var tw = "(?i)(台湾|台灣|臺灣|台北|臺北|🇹🇼|taiwan|taipei|(^|[^a-z])tw([^a-z]|$))";
  var routes = [
    { id: "gpt", group: "GPT-美国手动", filter: us },
    { id: "instagram", group: "Instagram-香港手动", filter: hk },
    { id: "x", group: "X-香港手动", filter: hk },
    { id: "tiktok", group: "TikTok-台湾手动", filter: tw },
    { id: "facebook", group: "Facebook-香港手动", filter: hk }
  ];
  var groupNames = routes.map(function (route) { return route.group; });
  var providerNames = routes.map(function (route) { return "prr-" + route.id; });
  var providers = config["rule-providers"] || {};
  var groups = (config["proxy-groups"] || []).filter(function (group) {
    return groupNames.indexOf(group.name) === -1;
  });
  var rules = (config.rules || []).filter(function (rule) {
    var parts = rule.split(",");
    return !(parts[0].trim() === "RULE-SET" &&
      providerNames.indexOf((parts[1] || "").trim()) !== -1);
  });

  var newGroups = [];
  var newRules = [];
  routes.forEach(function (route) {
    var provider = "prr-" + route.id;
    providers[provider] = {
      type: "http",
      behavior: "classical",
      format: "text",
      url: base + route.id + ".list",
      path: "./ruleset/proxy-routing-rules/" + route.id + ".list",
      interval: 86400
    };
    newGroups.push({
      name: route.group,
      type: "select",
      // REJECT remains available even when no regional node matches.
      // On first use, select a real regional node in each of the five groups.
      proxies: ["REJECT"],
      "include-all": true,
      filter: route.filter
    });
    newRules.push("RULE-SET," + provider + "," + route.group);
  });

  // Replace only this project's entries, so applying the script twice is safe.
  config["rule-providers"] = providers;
  config["proxy-groups"] = newGroups.concat(groups);
  config.rules = newRules.concat(rules);
  return config;
}
