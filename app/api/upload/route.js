import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
const path = require("path");
const fs = require("fs");

export async function GET(request) {
  try {
    const fileReadResponse = await readFile(
      `/tmp/schoolImages/${request.headers.get("File-Name")}`
    );

    // const imageBlob = new Blob(fileReadResponse);
    // console.log("fileReadResponse");
    // console.log(imageBlob);

    // const fileReader = new FileReader();

    // const file = await fileReader.readFile(
    //   './tmp/${request.headers.get("File-Name")}'
    // );

    // console.log("file");
    // console.log(file);

    return new NextResponse(fileReadResponse, {
      status: 200,
      message: "Image read successfully!",
    });
  } catch (error) {
    console.log(error.message);

    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}

export async function POST(request) {
  try {
    if (request.body) {
      const reader = request.body.getReader();
      const chunks = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

      // console.log(
      //   `${path.resolve("public/schoolImages")}/${request.headers.get(
      //     "File-Name"
      //   )}`
      // );
      // console.log(`${process.cwd()}/${request.headers.get("File-Name")}`);

      // try {
      //   const filesSync = fs.readdirSync("/tmp");
      //   console.log("Directory content before write (sync):", filesSync);
      // } catch (err) {
      //   console.error("Error reading directory synchronously:", err);
      // }

      if (!fs.existsSync("/tmp/schoolImages/"))
        fs.mkdirSync("/tmp/schoolImages/", { recursive: true });

      await writeFile(
        // `./public/schoolImages/${request.headers.get("File-Name")}`,
        `/tmp/schoolImages/${request.headers.get("File-Name")}`,
        // `${process.cwd()}/schoolImages/${request.headers.get("File-Name")}`,
        //   `${path.resolve("public/schoolImages")}/${request.headers.get(
        //     "File-Name"
        //   )}`,
        chunks
      );

      // try {
      //   const filesSync = fs.readdirSync("/tmp");
      //   console.log("Directory content after write (sync):", filesSync);
      // } catch (err) {
      //   console.error("Error reading directory synchronously:", err);
      // }
    } else {
      res.status(400).send("No blob data received.");
    }

    return NextResponse.json(
      { message: "Image uploaded successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error.message);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
