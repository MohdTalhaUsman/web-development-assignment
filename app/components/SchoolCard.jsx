"use client";

import React from "react";

function SchoolCard({ schoolObject }) {
  const { address, city, image, name } = schoolObject;
  return (
    <li
      className="w-[24em] h-[auto] rounded-[3em] bg-[rgba(217, 217, 217, 0.58)] border-[1px] border-white backdrop-blur-sm px-[1.6em]
    py-[1.6em] shadow-[var(--school-card-shadow)] transition duration-300 ease-in-out hover:scale-110"
    >
      <article>
        <div className="rounded-[3em] h-auto w-full aspect-[1/1] overflow-hidden">
          <img
            className="object-cover w-full h-full"
            // src={`${process.env.NEXT_PUBLIC_SCHOOL_IMAGES_DIR}${image}`}
            src={`/tmp/${image}`}
            // src={`${image}`}
            alt={`${name} picture.`}
          />
        </div>
        <div className="px-[0.8em] py-[0.8em] space-y-[0.4em]">
          <h2 className="text-[var(--heading-1-color)] text-[1.5em] font-sans font-bold">
            {name}
          </h2>
          <h3 className="text-[var(--heading-3-color)] text-[1.4em] font-semibold">
            {city}
          </h3>
          <div className="flex items-start">
            <svg
              className="w-[1.6em] pt-[0.1em] mr-[0.4em]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#000000"
            >
              <path d="M12 20.8995L16.9497 15.9497C19.6834 13.2161 19.6834 8.78392 16.9497 6.05025C14.2161 3.31658 9.78392 3.31658 7.05025 6.05025C4.31658 8.78392 4.31658 13.2161 7.05025 15.9497L12 20.8995ZM12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364L12 23.7279ZM12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13ZM12 15C9.79086 15 8 13.2091 8 11C8 8.79086 9.79086 7 12 7C14.2091 7 16 8.79086 16 11C16 13.2091 14.2091 15 12 15Z" />
            </svg>
            <p className="text-[1.2em] w-[100%] h-[3em] break-normal  overflow-hidden">
              {address}
            </p>
          </div>
        </div>
      </article>
    </li>
  );
}

export default SchoolCard;
