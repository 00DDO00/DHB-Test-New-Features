import { DATA_CRYPT_SECRET_KEY } from "../config";
import { env } from "../contexts/AuthPkceContext";
import { decryptData } from "./crypt";
import { getToken } from "./saveToken";

export const getUserFromStorage = () => {
  const savedUser = getToken("user", env);
  let user;
  if (savedUser?.toString()?.charAt(0) === "{") {
    user = JSON.parse(savedUser || "{}");
  } else {
    user = savedUser ? decryptData(savedUser, DATA_CRYPT_SECRET_KEY) : null;
  }
  return user;
};

export const getCustomerFromStorage = () => {
  const savedCustomer = getToken("customerType", env);
  let customer;
  if (savedCustomer?.toString()?.charAt(0) === "{") {
    customer = JSON.parse(savedCustomer || "{}");
  } else {
    customer = savedCustomer
      ? decryptData(savedCustomer, DATA_CRYPT_SECRET_KEY)
      : null;
  }
  return customer;
};
