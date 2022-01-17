import daybookRouter from "@/modules/daybook/router";

describe("Pruebas en el router module del Daybook", () => {
  test("El router debe tener esta configuración", async () => {
    expect(daybookRouter).toMatchObject({
      name: "daybook",
      component: expect.any(Function),
      children: [
        { path: "", name: "no-entry", component: expect.any(Function) },
        {
          path: ":id",
          name: "entry",
          component: expect.any(Function),
          props: expect.any(Function),
        },
      ],
    });

    const promiseRoutes = [];
    daybookRouter.children.forEach((child) => promiseRoutes.push(child.component()));

    const routes = (await Promise.all(promiseRoutes)).map((r) => r.default.name);
    expect(routes).toContain("EntryView");
    expect(routes).toContain("NoEntrySelected");
  });

  test("Debe retornar el id de la ruta", () => {
    const route = {
      params: {
        id: "ABC-123",
      },
    };

    const entryRoute = daybookRouter.children.find((route) => route.name === "entry");
    expect(entryRoute.props(route)).toEqual({ id: "ABC-123" });
  });
});
