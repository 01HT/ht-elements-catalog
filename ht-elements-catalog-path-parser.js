"use strict";
export function getPathFromParameters(parameters) {
  try {
    let path = "";
    let pathname = "/catalog";
    //
    let search = "";
    // categories
    let categories = parameters.categories;
    if (categories) {
      pathname += `/${categories}`;
    }
    // &platform
    let platform = parameters.platform;
    if (platform) {
      search === "" ? (search += "?") : (search += "&");
      search += `platform=${platform}`;
    }
    // &browsers
    let browsers = parameters.browsers;
    if (browsers && browsers.length > 0) {
      search === "" ? (search += "?") : (search += "&");
      search += `browsers=${browsers.join(",")}`;
    }
    // &tools
    let tools = parameters.tools;
    if (tools && tools.length > 0) {
      search === "" ? (search += "?") : (search += "&");
      search += `tools=${tools.join(",")}`;
    }
    // &tags
    let tags = parameters.tags;
    if (tags && tags.length > 0) {
      search === "" ? (search += "?") : (search += "&");
      search += `tags=${tags.join(",")}`;
    }
    // &sort
    let sort = parameters.sort;
    if (sort) {
      search === "" ? (search += "?") : (search += "&");
      search += `sort=${sort}`;
    }
    // &search
    let searchText = parameters.search;
    if (searchText && searchText !== "") {
      search === "" ? (search += "?") : (search += "&");
      search += `search=${searchText}`;
    }
    // Generate path
    path = pathname + search;
    return path;
  } catch (error) {
    throw new Error("getPathFromParameters: " + error.message);
  }
}

export function getParametersFromPath(path) {
  try {
    // let parameters = {
    //   categories: "wordpress/corporate",
    //   tags: ["business", "portfolio"],
    //   platform: "webtutor",
    //   sort: "sales"
    //   search: "go";
    // };
    // parse path
    path = path.replace("/catalog", "");
    let pathname = path;
    let search = "";
    const questionMarkIndex = path.indexOf("?");
    if (questionMarkIndex !== -1) {
      pathname = path.slice(0, questionMarkIndex);
      search = path.slice(questionMarkIndex);
    }

    let parameters = {};
    // categories
    if (pathname !== "" && pathname !== "/")
      parameters.categories = pathname.substring(1);
    // tags
    // sort
    // search
    const searchParameters = getParametersFromSearch(search);
    parameters = Object.assign(parameters, searchParameters);
    return parameters;
  } catch (error) {
    console.log("getParametersFromPath: " + error.message);
  }
}

function getParametersFromSearch(search) {
  try {
    const parsed = {};
    if (search === "") return parsed;
    // search
    const searchIndex = search.indexOf("search=");
    if (searchIndex !== -1) {
      const splittedSearch = search.split("search=");
      parsed.search = splittedSearch[1];
      // Remove search part
      search = splittedSearch[0];
    }
    // tags
    // sort
    if (search !== "?") {
      // Remove first "?"
      search = search.substring(1);
      // Remove last & if exist (if was parameter search=)
      if (searchIndex !== -1) search = search.substring(0, search.length - 1);
      const params = search.split("&");
      for (const param of params) {
        const nameValue = param.split("=");
        const name = nameValue[0];
        const value = nameValue[1];
        if (name === "tags" || name === "browsers" || name === "tools") {
          parsed[name] = value.split(",");
        } else {
          parsed[name] = value;
        }
      }
    }
    return parsed;
  } catch (error) {
    throw new Error("getParametersFromSearch: " + error.message);
  }
}
