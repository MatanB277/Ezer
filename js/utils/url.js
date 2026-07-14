const getUrlParameter = (name) => {
  const url = new URL(window.location.href);

  return url.searchParams.get(name) || "";
};

const setUrlParameter = (name, value) => {
  const url = new URL(window.location.href);

  if (value) {
    url.searchParams.set(name, value);
  } else {
    url.searchParams.delete(name);
  }

  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
};
