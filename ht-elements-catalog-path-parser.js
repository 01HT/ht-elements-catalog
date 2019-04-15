"use strict";
async function addFilterDataInSearch(search, parameters, nameInFilter) {
  let result = "";
  let valueInFilter = parameters[nameInFilter];
  if (valueInFilter && valueInFilter.length > 0) {
    search === "" ? (result += "?") : (result += "&");
    result += `${nameInFilter}=${valueInFilter.join(",")}`;
    return result;
  }
  return "";
}

export async function getPathFromParameters(parameters) {
  try {
    let path = "";
    let pathname = "/catalog";
    let search = "";
    let categories = parameters.categories;
    if (categories && categories.length > 0) {
      pathname += `/${categories.join("/")}`;
    }
    search += await addFilterDataInSearch(search, parameters, "direction");
    search += await addFilterDataInSearch(search, parameters, "platform");
    search += await addFilterDataInSearch(search, parameters, "languages");
    search += await addFilterDataInSearch(search, parameters, "tools");
    search += await addFilterDataInSearch(search, parameters, "browsers");
    search += await addFilterDataInSearch(search, parameters, "tags");
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
    path = pathname + search;
    return path;
  } catch (error) {
    throw new Error("getPathFromParameters: " + error.message);
  }
}

export function getParametersFromPath(path) {
  try {
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
      parameters.categories = pathname.substring(1).split("/");
    // search params
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
    // attributes & tags & sort
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
        if (
          name === "direction" ||
          name === "platform" ||
          name === "languages" ||
          name === "tools" ||
          name === "browsers" ||
          name === "tags"
        ) {
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
