export const checkLogin = (status, role = null) => {
  return {
    type: "CHECK_LOGIN",
    status: status,
    role: role,
  };
};
