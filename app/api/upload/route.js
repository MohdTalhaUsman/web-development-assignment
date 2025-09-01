import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";

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

      console.log(`${process.cwd()}/${request.headers.get("File-Name")}`);

      await writeFile(
        // `./public/schoolImages/${request.headers.get("File-Name")}`,
        `${process.cwd()}/public/schoolImages/${request.headers.get(
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
