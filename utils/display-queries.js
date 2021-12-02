export const shouldDisplayArticle = (view) => {
  switch (view) {
    case "episodes":
      return true;
    case "discuss":
      return false;
    case "watch":
      return false;
    default:
      return true;
  }
};

export const shouldDisplayDiscussions = (view) => {
  switch (view) {
    case "episodes":
      return false;
    case "discuss":
      return true;
    default:
      return false;
  }
};

export const shouldDisplayVideo = (view) => {
  switch (view) {
    case "episodes":
      return true;
    case "discuss":
      return true;
    case "watch":
      return true;
    default:
      return true;
  }
};
