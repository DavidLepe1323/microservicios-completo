export const getToken = (): string | null => localStorage.getItem("token");

export const isAuthenticated = (): boolean => !!getToken();

export const logout = (): void => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};
