import { useEffect } from "react";

const usePageTitle = (title: string, includeAppName = true) => {
  useEffect(() => {
    const appName = "Organisey";
    document.title = includeAppName ? `${title} | ${appName}` : title;
  }, [title, includeAppName]);
};

export default usePageTitle;
