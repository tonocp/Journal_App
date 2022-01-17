import cloudinary from "cloudinary";
import axios from "axios";

import uploadImage from "@/modules/daybook/helpers/uploadImage";

cloudinary.config({
  cloud_name: "tcp-cloudinary",
  api_key: "412269426567324",
  api_secret: "89YMmTmqsQFf7tNP1ZITro6mYWA",
});

describe("Pruebas en el uploadImage", () => {
  test("Debe de cargar un archivo y retornar el url", async (done) => {
    const { data } = await axios.get(
      "https://res.cloudinary.com/tcp-cloudinary/image/upload/v1639722910/samples/bike.jpg",
      {
        responseType: "arraybuffer",
      }
    );

    const file = new File([data], "foto.jpg");

    const url = await uploadImage(file);

    expect(typeof url).toBe("string");

    const segments = url.split("/");
    const imageId = segments[segments.length - 1].replace(".jpg", "");
    cloudinary.v2.api.delete_resources(imageId, {}, () => {
      done();
    });
  });
});
