import axios from "axios";

const authApi = axios.create({
  baseURL: "https://identitytoolkit.googleapis.com/v1/accounts",
  params: {
    key: "AIzaSyDsZbIqzsNTy7PMDyhN3FZ5rdDdm-yDutI",
  },
});

export default authApi;
