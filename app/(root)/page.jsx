"use client";

import { useEffect, useState } from "react";
import SchoolCard from "../components/SchoolCard";

export default function Home() {
  const [schoolsArray, setSchoolsArray] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const fetchResponse = await fetch("/api/schools/");

        if (!fetchResponse.ok)
          throw new Error("Failed to fetch data from the database.");
        const schoolsData = await fetchResponse.json();
        setSchoolsArray(schoolsData);
      } catch (error) {
        console.log(error.message);
      }
    })();
  }, []);

  return (
    <>
      <div className="p-[4em]">
        <ul className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 gap-x-[64px]  gap-y-[32px] justify-items-center">
          {schoolsArray.map((schoolObject) => (
            <SchoolCard key={schoolObject.id} schoolObject={schoolObject} />
          ))}
        </ul>
      </div>
    </>
  );
}
