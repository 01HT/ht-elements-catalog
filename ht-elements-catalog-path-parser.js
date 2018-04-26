"use strict";
export function getPathFromParameters(parameters) {
  try {
    let path = "";
    let pathname = "/catalog/all";
    //
    let search = "";
    // &tags
    let tags = parameters.tags;
    if (tags && tags.length > 0) {
      search === "" ? (search += "?") : (search += "&");
      search += `tags=${tags.join(",")}`;
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
    console.log("getPathFromParameters: " + error.message);
  }
}

export function getParametersFromPath(path) {
  try {
    // let parameters = {
    //   categories: "wordpress/corporate",
    //   tags: ["business", "portfolio"],
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
    //
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
        if (name === "tags") {
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
