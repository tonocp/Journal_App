import { createStore } from "vuex";
import journal from "@/modules/daybook/store/journal";
import { journalState } from "../../../../mock-data/test-journal-state";

import authApi from "@/api/authApi";

const createVuexStore = (initialState) =>
  createStore({
    modules: {
      journal: {
        ...journal,
        state: {
          ...initialState,
        },
      },
    },
  });

describe("VUEX - Pruebas en el Journal Module", () => {
  beforeAll(async () => {
    const { data } = await authApi.post(":signInWithPassword", {
      email: "test1@test.com",
      password: "123456",
      returnSecureToken: true,
    });

    localStorage.setItem("idToken", data.idToken);
  });

  // BÁSICAS =======================================================================

  test("Debe tener este estado inicial", () => {
    const store = createVuexStore(journalState);
    const { isLoading, entries } = store.state.journal;

    expect(isLoading).toBeFalsy();
    expect(entries).toEqual(journalState.entries);
  });

  // MUTATIONS =======================================================================

  test("Mutation: setEntries", () => {
    const store = createVuexStore({ isLoading: true, entries: [] });

    store.commit("journal/setEntries", journalState.entries);
    expect(store.state.journal.entries.length).toBe(2);

    store.commit("journal/setEntries", journalState.entries);
    expect(store.state.journal.entries.length).toBe(4);

    expect(store.state.journal.isLoading).toBeFalsy();
  });

  test("Mutation: updateEntry", () => {
    const store = createVuexStore(journalState);
    const updatedEntry = {
      id: "-Mr2XS8HZ41T8-mAxch7",
      date: 1639663113422,
      text: "Hola mundo desde pruebas",
    };

    store.commit("journal/updateEntry", updatedEntry);

    const storeEntries = store.state.journal.entries;

    expect(storeEntries.length).toBe(2);
    expect(storeEntries.find((e) => e.id === updatedEntry.id)).toEqual(updatedEntry);
  });

  test("Mutation: addEntry & deleteEntry", () => {
    const store = createVuexStore(journalState);

    store.commit("journal/addEntry", { id: "ABC-123", text: "Hola Pruebas" });

    expect(store.state.journal.entries.length).toBe(3);
    expect(store.state.journal.entries.find((e) => e.id === "ABC-123")).toBeTruthy();

    store.commit("journal/deleteEntry", "ABC-123");
    expect(store.state.journal.entries.length).toBe(2);
    expect(store.state.journal.entries.find((e) => e.id === "ABC-123")).toBeFalsy();
  });

  // GETTERS =======================================================================

  test("Getters: getEntriesByTerm getEntryById", () => {
    const store = createVuexStore(journalState);

    const [entry1, entry2] = journalState.entries;

    expect(store.getters["journal/getEntriesByTerm"]("").length).toBe(2);
    expect(store.getters["journal/getEntriesByTerm"]("2").length).toBe(1);
    expect(store.getters["journal/getEntriesByTerm"]("2")).toEqual([entry2]);

    expect(store.getters["journal/getEntryById"](entry1.id)).toEqual(entry1);
  });

  // ACTIONS =======================================================================

  test("Actions: loadEntries", async () => {
    const store = createVuexStore({ isLoading: true, entries: [] });

    await store.dispatch("journal/loadEntries");

    expect(store.state.journal.entries.length).toBe(2);
  });

  test("Actions: updateEntry", async () => {
    const store = createVuexStore(journalState);

    const updatedEntry = {
      id: "-Mr2XS8HZ41T8-mAxch7",
      date: 1639663113422,
      text: "Hola mundo desde pruebas",
      otroCampo: true,
      otroMas: { a: 1 },
    };

    await store.dispatch("journal/updateEntry", updatedEntry);

    expect(store.state.journal.entries.length).toBe(2);
    expect(store.state.journal.entries.find((e) => e.id === updatedEntry.id)).toEqual({
      id: "-Mr2XS8HZ41T8-mAxch7",
      date: 1639663113422,
      text: "Hola mundo desde pruebas",
    });
  });

  test("Actions: createEntry & deleteEntry", async () => {
    const store = createVuexStore(journalState);
    const newEntry = {
      date: 1639663113422,
      text: "Nueva entrada desde Pruebas",
    };

    const id = await store.dispatch("journal/createEntry", newEntry);
    expect(typeof id).toBe("string");
    expect(store.state.journal.entries.find((e) => e.id === id)).toBeTruthy();

    await store.dispatch("journal/deleteEntry", id);
    expect(store.state.journal.entries.find((e) => e.id === id)).toBeFalsy();
  });
});
