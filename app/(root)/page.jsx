"use client";

import { useEffect, useState } from "react";
import SchoolCard from "../components/SchoolCard";

export default function Home() {
  const [schoolsArray, setSchoolsArray] = useState([]);
  const [isFetchingData, setIsFetchingData] = useState(true);

  useEffect(() => {
    setIsFetchingData(true);
    (async () => {
      try {
        const fetchResponse = await fetch("/api/schools/");

        if (!fetchResponse.ok)
          throw new Error("Failed to fetch data from the database.");
        const schoolsData = await fetchResponse.json();
        setSchoolsArray(schoolsData);
      } catch (error) {
        console.log(error.message);
      } finally {
        setIsFetchingData(false);
      }
    })();
  }, []);

  return (
    <>
      <div className="p-[4em]">
        {!isFetchingData && schoolsArray.length === 0 && (
          <h2 className="text-[var(--heading-1-color)] text-[3.6em] font-sans font-bold text-center">
            No school data found.
            <br />
            <span className="text-[0.6em] font-mono font-normal text-black">
              Click Add School to add school data.
            </span>
          </h2>
        )}
        <ul className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 gap-x-[64px]  gap-y-[32px] justify-items-center">
          {schoolsArray.map((schoolObject) => (
            <SchoolCard key={schoolObject.id} schoolObject={schoolObject} />
          ))}
        </ul>
      </div>
    </>
  );
}
