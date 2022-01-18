import axios from "axios";
import createVuexStore from "../../../mock-data/mock-store";

describe("Vuex: Pruebas en el auth-module", () => {
  // BÁSICAS =======================================================================

  test("Debe tener este estado inicial", () => {
    const store = createVuexStore({
      status: "authenticating", // 'authenticated', 'not-authenticated', 'authenticating'
      user: null,
      idToken: null,
      refreshToken: null,
    });
    const { status, user, idToken, refreshToken } = store.state.auth;

    expect(status).toBe("authenticating");
    expect(user).toBe(null);
    expect(idToken).toBe(null);
    expect(refreshToken).toBe(null);
  });

  // MUTATIONS =======================================================================

  test("Mutation: loginUser", () => {
    const store = createVuexStore({
      status: "authenticating", // 'authenticated', 'not-authenticated', 'authenticating'
      user: null,
      idToken: null,
      refreshToken: null,
    });

    const payload = {
      user: { name: "Felipe", email: "felipe@mail.com" },
      idToken: "ABC-123",
      refreshToken: "XYZ-123",
    };

    store.commit("auth/loginUser", payload);

    const { status, user, idToken, refreshToken } = store.state.auth;

    expect(status).toBe("authenticated");
    expect(user).toEqual({ name: "Felipe", email: "felipe@mail.com" });
    expect(idToken).toBe("ABC-123");
    expect(refreshToken).toBe("XYZ-123");
  });

  test("Mutation: logout", () => {
    localStorage.setItem("idToken", "ABC-123");
    localStorage.setItem("refreshToken", "XYZ-123");

    const store = createVuexStore({
      status: "authenticated", // 'authenticated', 'not-authenticated', 'authenticating'
      user: { name: "Felipe", email: "felipe@mail.com" },
      idToken: "ABC-123",
      refreshToken: "XYZ-123",
    });

    store.commit("auth/logout");

    const { status, user, idToken, refreshToken } = store.state.auth;

    expect(status).toBe("not-authenticated");
    expect(user).toBeFalsy();
    expect(idToken).toBeFalsy();
    expect(refreshToken).toBeFalsy();
    expect(localStorage.getItem("idToken")).toBeFalsy();
    expect(localStorage.getItem("refreshToken")).toBeFalsy();
  });

  // GETTERS =======================================================================

  test("Getters: username & currentState", () => {
    const store = createVuexStore({
      status: "authenticated", // 'authenticated', 'not-authenticated', 'authenticating'
      user: { name: "Felipe", email: "felipe@mail.com" },
      idToken: "ABC-123",
      refreshToken: "XYZ-123",
    });

    expect(store.getters["auth/username"]).toBe("Felipe");
    expect(store.getters["auth/currentState"]).toBe("authenticated");
  });

  // ACTIONS =======================================================================

  test("Actions: createUser - Error usuario ya existe", async () => {
    const store = createVuexStore({
      status: "not-authenticated", // 'authenticated', 'not-authenticated', 'authenticating'
      user: null,
      idToken: null,
      refreshToken: null,
    });

    const newUser = { name: "Test User", email: "test1@test.com", password: "123456" };

    const resp = await store.dispatch("auth/createUser", newUser);
    const { status, user, idToken, refreshToken } = store.state.auth;

    expect(resp).toEqual({ ok: false, message: "EMAIL_EXISTS" });
    expect(status).toBe("not-authenticated");
    expect(user).toBeFalsy();
    expect(idToken).toBeFalsy();
    expect(refreshToken).toBeFalsy();
  });

  test("Actions: createUser & signInUser - Crea el usuario ", async () => {
    const store = createVuexStore({
      status: "not-authenticated", // 'authenticated', 'not-authenticated', 'authenticating'
      user: null,
      idToken: null,
      refreshToken: null,
    });

    const newUser = { name: "Test User", email: "test2@test.com", password: "123456" };

    // SignIn
    await store.dispatch("auth/signInUser", newUser);
    const { idToken } = store.state.auth;

    // Borrar el usuario
    await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=AIzaSyDsZbIqzsNTy7PMDyhN3FZ5rdDdm-yDutI`,
      { idToken }
    );

    // Crear el usuario
    const resp = await store.dispatch("auth/createUser", newUser);

    expect(resp).toEqual({ ok: true });

    const { status, user, idToken: token, refreshToken } = store.state.auth;

    expect(status).toBe("authenticated");
    expect(user).toMatchObject({ name: "Test User", email: "test2@test.com" });
    expect(typeof token).toBe("string");
    expect(typeof refreshToken).toBe("string");
  });

  test("Actions: checkAuthentication - Correcto", async () => {
    const store = createVuexStore({
      status: "not-authenticated", // 'authenticated', 'not-authenticated', 'authenticating'
      user: null,
      idToken: null,
      refreshToken: null,
    });

    // SignIn
    await store.dispatch("auth/signInUser", { email: "test1@test.com", password: "123456" });
    const { idToken } = store.state.auth;
    store.commit("auth/logout");

    localStorage.setItem("idToken", idToken);
    const checkResp = await store.dispatch("auth/checkAuthentication");
    const { status, user, idToken: token } = store.state.auth;

    expect(checkResp).toEqual({ ok: true });
    expect(status).toBe("authenticated");
    expect(user).toMatchObject({ name: "test1", email: "test1@test.com" });
    expect(typeof token).toBe("string");
  });

  test("Actions: checkAuthentication - Incorrecto", async () => {
    const store = createVuexStore({
      status: "authenticating", // 'authenticated', 'not-authenticated', 'authenticating'
      user: null,
      idToken: null,
      refreshToken: null,
    });

    localStorage.removeItem("idToken");

    const checkResp = await store.dispatch("auth/checkAuthentication");

    expect(checkResp).toEqual({ ok: false, message: "No hay token" });
    expect(store.state.auth.user).toBeFalsy();
    expect(store.state.auth.idToken).toBeFalsy();
    expect(store.state.auth.status).toBe("not-authenticated");

    localStorage.setItem("idToken", "ABC-123");

    const checkResp2 = await store.dispatch("auth/checkAuthentication");

    expect(checkResp2).toEqual({ ok: false, message: "INVALID_ID_TOKEN" });
    expect(store.state.auth.user).toBeFalsy();
    expect(store.state.auth.idToken).toBeFalsy();
    expect(store.state.auth.status).toBe("not-authenticated");
  });
});
