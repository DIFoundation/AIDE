export const getAuthToken = (): string | undefined => {
  if (typeof window === "undefined") {
    return undefined;
  }
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1];
};

export const removeAuthToken = (): void => {
  if (typeof window !== "undefined") {
    document.cookie = "authToken=; Max-Age=0; path=/;";
  }
};
