export function getInitialValuesRegister() {
  return {
    firstName: "Santhosh",
    lastName: "Dahal",
    email: `santhoshdahal936+${Math.floor(Math.random() * 10000)}@gmail.com`,
    password: "YourStrongAdminPassword123!",
    confirmPassword: "YourStrongAdminPassword123!",
    phoneNumber: "+9779762982101",
  };
}

export function getInitialValuesLogin() {
  return {
    email: "santhoshdahal936@gmail.com",
    password: "YourStrongAdminPassword123!",
  };
}
