import useAuth from "@/modules/auth/composables/useAuth";

const mockStore = {
  dispatch: jest.fn(),
  commit: jest.fn(),
  getters: {
    "auth/currentState": "authenticated",
    "auth/username": "Felipe",
  },
};

jest.mock("vuex", () => ({
  useStore: () => mockStore,
}));

describe("Pruebas en useAuth", () => {
  beforeEach(() => jest.clearAllMocks());

  test("createUser con éxito", async () => {
    const { createUser } = useAuth();
    const newUser = { name: "Felipe", email: "felipe@mail.com" };

    mockStore.dispatch.mockReturnValue({ ok: true });

    const resp = await createUser(newUser);

    expect(mockStore.dispatch).toHaveBeenCalledWith("auth/createUser", newUser);
    expect(resp).toEqual({ ok: true });
  });

  test("createUser fallido, email ya existe", async () => {
    const { createUser } = useAuth();
    const newUser = { name: "Felipe", email: "felipe@mail.com" };

    mockStore.dispatch.mockReturnValue({ ok: false, message: "EMAIL_EXISTS" });

    const resp = await createUser(newUser);

    expect(mockStore.dispatch).toHaveBeenCalledWith("auth/createUser", newUser);
    expect(resp).toEqual({ ok: false, message: "EMAIL_EXISTS" });
  });

  test("loginUser con éxito", async () => {
    const { loginUser } = useAuth();
    const loginForm = { email: "felipe@mail.com", password: "123456" };

    mockStore.dispatch.mockReturnValue({ ok: true });

    const resp = await loginUser(loginForm);

    expect(mockStore.dispatch).toHaveBeenCalledWith("auth/signInUser", loginForm);
    expect(resp).toEqual({ ok: true });
  });

  test("loginUser con éxito", async () => {
    const { loginUser } = useAuth();
    const loginForm = { email: "felipe@mail.com", password: "123456" };

    mockStore.dispatch.mockReturnValue({ ok: false, message: "EMAIL/PASSWORD DO NOT EXIST" });

    const resp = await loginUser(loginForm);

    expect(mockStore.dispatch).toHaveBeenCalledWith("auth/signInUser", loginForm);
    expect(resp).toEqual({ ok: false, message: "EMAIL/PASSWORD DO NOT EXIST" });
  });

  test("checkStatus", async () => {
    const { checkAuthStatus } = useAuth();

    mockStore.dispatch.mockReturnValue({ ok: true });

    const resp = await checkAuthStatus();

    expect(mockStore.dispatch).toHaveBeenCalledWith("auth/checkAuthentication");
    expect(resp).toEqual({ ok: true });
  });

  test("logout", () => {
    const { logout } = useAuth();

    logout();

    expect(mockStore.commit).toHaveBeenCalledWith("auth/logout");
    expect(mockStore.commit).toHaveBeenCalledWith("journal/clearEntries");
  });

  test("authState, username", () => {
    const { authStatus, username } = useAuth();

    expect(authStatus.value).toBe("authenticated");
    expect(username.value).toBe("Felipe");
  });
});
