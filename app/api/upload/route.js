import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
const path = require("path");
const fs = require("fs");

export async function GET(request) {
  try {
    const fileReadResponse = await readFile(
      `${process.env.NEXT_PUBLIC_SCHOOL_IMAGES_DIR}${request.headers.get(
        "File-Name"
      )}`
    );

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

      if (!fs.existsSync(process.env.NEXT_PUBLIC_SCHOOL_IMAGES_DIR))
        fs.mkdirSync(process.env.NEXT_PUBLIC_SCHOOL_IMAGES_DIR, {
          recursive: true,
        });

      await writeFile(
        `${process.env.NEXT_PUBLIC_SCHOOL_IMAGES_DIR}${request.headers.get(
          "File-Name"
        )}`,
        chunks
      );
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
