import { getDatabaseConnection } from "../../../lib/sqlConnector";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const databaseConnection = await getDatabaseConnection();
    if (!databaseConnection)
      throw new Error("Failed to connect to the database.");
    const [schools] = await databaseConnection.query("SELECT * FROM schools");

    return NextResponse.json(schools, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const addSchoolFormData = await request.json();
    const insertQuery = `INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUE ("${
      addSchoolFormData.schoolName
    }", "${addSchoolFormData.schoolAddress}", "${
      addSchoolFormData.schoolCity
    }", "${addSchoolFormData.schoolState}", ${
      addSchoolFormData.contactNumber
    }, "${request.headers.get("Image-File-Name")}", "${
      addSchoolFormData.emailId
    }")`;
    const databaseConnection = await getDatabaseConnection();
    if (!databaseConnection)
      throw new Error("Failed to connect to the database.");
    await databaseConnection.query(insertQuery);

    return NextResponse.json(
      { message: "Details added to the database successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
