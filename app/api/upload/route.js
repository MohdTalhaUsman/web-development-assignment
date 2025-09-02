import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
const path = require("path");
const fs = require("fs");

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

      try {
        const filesSync = fs.readdirSync("/tmp");
        console.log("Directory content before write (sync):", filesSync);
      } catch (err) {
        console.error("Error reading directory synchronously:", err);
      }

      await writeFile(
        // `./public/schoolImages/${request.headers.get("File-Name")}`,
        `/tmp/${request.headers.get("File-Name")}`,
        // `${process.cwd()}/schoolImages/${request.headers.get("File-Name")}`,
        //   `${path.resolve("public/schoolImages")}/${request.headers.get(
        //     "File-Name"
        //   )}`,
        chunks
      );

      try {
        const filesSync = fs.readdirSync("/tmp");
        console.log("Directory content after write (sync):", filesSync);
      } catch (err) {
        console.error("Error reading directory synchronously:", err);
      }
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
