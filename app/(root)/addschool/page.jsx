"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import {
  indianCities,
  indianStatesAndUTs,
  validImageFormats,
  emailValidationRegex,
  turnHttpUrlToBlob,
} from "@/helper";

export default function Home() {
  const { register, handleSubmit } = useForm();

  const [selectedImageObject, setSelectedImageObject] = useState({});
  const [imageUrl, setImageUrl] = useState("");
  const [isSchoolAddressValid, setIsSchoolAddressValid] = useState(null);
  const [isContactNumberValid, setIsContactNumberValid] = useState(null);
  const [isEmailIdValid, setIsEmailIdValid] = useState(null);
  const [isSchoolNameValid, setIsSchoolNameValid] = useState(null);
  const [isSchoolCityValid, setIsSchoolCityValid] = useState(null);
  const [isSchoolStateValid, setIsSchoolStateValid] = useState(null);
  const fileInput = useRef(null);

  const isImageUrlValid = isValidImageFormat(imageUrl);

  const pageRouter = useRouter();

  function handleDragOverImageContainer(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }

  function handleDragLeaveImageContainer(event) {
    event.preventDefault();
  }

  function handleDropOverImageContainer(event) {
    event.preventDefault();
    const selectedFile = event.dataTransfer.files[0];
    setSelectedFileAsSelectedImageObject(selectedFile);
  }

  function handleContactNumberChange(value) {
    setIsContactNumberValid(value.length > 9);
    return value.length > 9;
  }

  function handleEmailIdChange(value) {
    setIsEmailIdValid(emailValidationRegex.test(value));
    return emailValidationRegex.test(value);
  }

  function handleFileSelect(event) {
    const selectedFile = event.target.files[0];
    setSelectedFileAsSelectedImageObject(selectedFile);
  }

  async function handleFormSubmit(formData) {
    if (!selectedImageObject.url) return;

    const selectedImageUrl = selectedImageObject.url.startsWith("http")
      ? await turnHttpUrlToBlob(selectedImageObject.url)
      : selectedImageObject.url;

    const imageFileName = `${formData.schoolName.replaceAll(
      " ",
      "_"
    )}${selectedImageObject.imageName.slice(
      selectedImageObject.imageName.lastIndexOf(".")
    )}`.toLowerCase();

    const fetchBlobResponse = await fetch(selectedImageUrl);

    if (!fetchBlobResponse.ok) {
      throw new Error(`Failed to fetch image: ${fetchBlobResponse.statusText}`);
    }

    const imageBlob = await fetchBlobResponse.blob();

    const uploadBlobResponse = await fetch("/api/upload/", {
      method: "POST",
      body: imageBlob,
      headers: {
        "Content-Type": imageBlob.type,
        "File-Name": imageFileName,
      },
    });

    if (!uploadBlobResponse.ok) {
      throw new Error(`Failed to save image: ${uploadBlobResponse.statusText}`);
    }

    const databaseWriteResponse = await fetch("/api/schools/", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Image-File-Name": imageFileName,
      },
    });

    if (!databaseWriteResponse.ok) {
      throw new Error(
        `Failed to add details to database: ${databaseWriteResponse.statusText}`
      );
    }

    pageRouter.push("/");
  }

  function handleImageUrlChange(event) {
    event.preventDefault();
    setImageUrl(event.target.value);
  }

  function handleSchoolNameChange(value) {
    setIsSchoolNameValid(value.length > 3);
    return value.length > 3;
  }

  function handleResetButtonClick(event) {
    setSelectedImageObject({});
  }

  function handleSchoolAddressChange(value) {
    setIsSchoolAddressValid(value.length > 3);
    return value.length > 3;
  }

  function handleSchoolCityChange(value) {
    setIsSchoolCityValid(value !== "");
    return value !== "";
  }

  function handleSchoolStateChange(value) {
    setIsSchoolStateValid(value !== "");
    return value !== "";
  }

  function handleUrlUpload() {
    const imageFileName = imageUrl.slice(imageUrl.lastIndexOf("/") + 1);
    if (imageFileName !== "" && isValidImageFormat(imageFileName)) {
      setSelectedImageObject({
        imageName: imageFileName,
        url: imageUrl,
      });
    }
  }

  function isValidImageFormat(imageFileName) {
    return validImageFormats.includes(
      imageFileName.slice(imageFileName.lastIndexOf(".") + 1)
    );
  }

  function selectFile(event) {
    fileInput.current.click();
  }

  function setSelectedFileAsSelectedImageObject(selectedFile) {
    if (!selectedFile || !selectedFile.type.includes("image")) return;
    if (
      !selectedImageObject.imageName ||
      selectedImageObject.imageName !== selectedFile.name
    ) {
      setSelectedImageObject({
        imageName: selectedFile.name,
        url: URL.createObjectURL(selectedFile),
      });
    }
    setImageUrl("");
  }

  return (
    <div className="p-[4em] flex justify-center">
      <form
        noValidate
        onSubmit={handleSubmit(handleFormSubmit)}
        className="form w-[88em] sm:grid-cols-2 grid grid-cols-1 gap-x-[3.2em] gap-y-[3.2em] p-[4.8em] rounded-[3em] bg-[rgba(217, 217, 217, 0.58)] border-[4px] border-white backdrop-blur-sm  shadow-[var(--school-card-shadow)]"
      >
        <p className="flex items-center pl-[1.1em] text-[var(--heading-1-color)] text-[2.8em] font-sans font-bold relative title grid-cols-[2]">
          Add School Details
        </p>
        <div className=" col-span-full">
          <div
            onDragOver={handleDragOverImageContainer}
            onDrop={handleDropOverImageContainer}
            onDragLeave={handleDragLeaveImageContainer}
            className="bg-white h-auto w-full aspect-[1280/720] rounded-[3em]  border-[4px] border-dashed border-[var(--heading-1-color)] shadow-[var(--school-card-shadow)] relative overflow-hidden"
          >
            <div className="flex w-full h-full justify-center items-center absolute z-1">
              <p className="text-[var(--theme-color-4)] text-[2.4em]">
                Drop Your Image Here.
              </p>
            </div>
            {selectedImageObject.url && (
              <img
                className="bg-black absolute z-2 object-contain w-full h-full"
                src={selectedImageObject.url}
                alt=""
              />
            )}
          </div>
          <div className="flex justify-between pt-[3.2em]">
            <input
              className={`${
                imageUrl !== ""
                  ? !isImageUrlValid
                    ? "border-[#ff0000]"
                    : "border-[#00ff00]"
                  : "border-[#ffffff]"
              } text-lg px-[1em] max-h-[2.65em] border-[3px]  rounded-[3em] bg-[#e8e8e8] w-[70%] shadow-[var(--school-card-shadow)] focus:outline-none`}
              type="url"
              value={imageUrl}
              onChange={handleImageUrlChange}
              placeholder="Paste school image URL."
              required=""
            ></input>
            <div className="space-x-[0.8em] pt-[0.2em]">
              <button
                disabled={imageUrl === "" || !isImageUrlValid ? true : false}
                type="button"
                onClick={handleUrlUpload}
                className={`${
                  imageUrl !== "" && isImageUrlValid
                    ? "text-white border-[var(--theme-color-6)] bg-[var(--theme-color-12)] cursor-pointer hover:text-[var(--link-active-color)] active:text-[var(--link-active-color)] shadow-[var(--school-card-shadow)]"
                    : "text-gray-100 bg-gray-300 border-gray-200 cursor-not-allowed"
                }  rounded-[1em] px-[1.2em] py-[0.6em] text-center border-[2px] text-[1.5em] font-sans font-extrabold`}
              >
                UPLOAD
              </button>
              <button
                type="button"
                onClick={selectFile}
                className="text-white border-[var(--theme-color-6)] bg-[var(--theme-color-2)] rounded-[1em] px-[1.2em] py-[0.6em] text-center border-[2px] text-[1.5em] font-sans font-extrabold hover:text-[var(--link-active-color)] active:text-[var(--link-active-color)] shadow-[var(--link-active-shadow)]"
              >
                <input
                  type="file"
                  ref={fileInput}
                  onChange={handleFileSelect}
                  className="hidden"
                />
                BROWSE
              </button>
            </div>
          </div>
        </div>

        <input
          className={`${
            isSchoolNameValid !== null
              ? !isSchoolNameValid
                ? "border-[#ff0000]"
                : "border-[#00ff00]"
              : "border-[#ffffff]"
          } text-lg px-[1em] py-[0.4em]  border-[3px] rounded-[3em] bg-[#e8e8e8] w-[100%]   shadow-[var(--school-card-shadow)]  focus:outline-none`}
          type="text"
          {...register("schoolName", {
            required: true,
            validate: handleSchoolNameChange,
          })}
          placeholder="School Name"
        ></input>
        <input
          className={`${
            isSchoolAddressValid !== null
              ? !isSchoolAddressValid
                ? "border-[#ff0000]"
                : "border-[#00ff00]"
              : "border-[#ffffff]"
          } text-lg px-[1em] py-[0.4em]  border-[3px] rounded-[3em] bg-[#e8e8e8] w-[100%]   shadow-[var(--school-card-shadow)]  focus:outline-none`}
          type="text"
          {...register("schoolAddress", {
            required: true,
            validate: handleSchoolAddressChange,
          })}
          placeholder="School Address"
        ></input>
        <select
          {...register("schoolCity", {
            required: true,
            validate: handleSchoolCityChange,
          })}
          defaultValue=""
          className={`${
            isSchoolCityValid !== null
              ? !isSchoolCityValid
                ? "border-[#ff0000]"
                : "border-[#00ff00]"
              : "border-[#ffffff]"
          } text-lg px-[1em] py-[0.4em]  border-[3px] rounded-[3em] bg-[#e8e8e8] w-[100%]   shadow-[var(--school-card-shadow)]  focus:outline-none`}
        >
          <option value="" disabled hidden>
            Select School City
          </option>
          {indianCities.map((cityName, index) => (
            <option key={index} value={cityName}>
              {cityName}
            </option>
          ))}
        </select>
        <select
          {...register("schoolState", {
            required: true,
            validate: handleSchoolStateChange,
          })}
          defaultValue=""
          className={`${
            isSchoolStateValid !== null
              ? !isSchoolStateValid
                ? "border-[#ff0000]"
                : "border-[#00ff00]"
              : "border-[#ffffff]"
          } text-lg px-[1em] py-[0.4em]  border-[3px] rounded-[3em] bg-[#e8e8e8] w-[100%]   shadow-[var(--school-card-shadow)]  focus:outline-none`}
        >
          <option value="" disabled hidden>
            Select School State
          </option>
          {indianStatesAndUTs.map((stateName, index) => (
            <option key={index} value={stateName}>
              {stateName}
            </option>
          ))}
        </select>
        <input
          onKeyDown={(keyDownEvent) => {
            if (["+", "-", ".", "e", "E"].includes(keyDownEvent.key)) {
              keyDownEvent.preventDefault();
              return;
            }
          }}
          className={`${
            isContactNumberValid !== null
              ? !isContactNumberValid
                ? "border-[#ff0000]"
                : "border-[#00ff00]"
              : "border-[#ffffff]"
          } text-lg px-[1em] py-[0.4em]  border-[3px] rounded-[3em] bg-[#e8e8e8] w-[100%]   shadow-[var(--school-card-shadow)]  focus:outline-none`}
          type="number"
          {...register("contactNumber", {
            required: true,
            validate: handleContactNumberChange,
          })}
          placeholder="Contact Number"
        ></input>
        <input
          className={`${
            isEmailIdValid !== null
              ? !isEmailIdValid
                ? "border-[#ff0000]"
                : "border-[#00ff00]"
              : "border-[#ffffff]"
          } text-lg px-[1em] py-[0.4em]  border-[3px] rounded-[3em] bg-[#e8e8e8] w-[100%]   shadow-[var(--school-card-shadow)]  focus:outline-none`}
          {...register("emailId", {
            required: true,
            validate: handleEmailIdChange,
          })}
          type="email"
          placeholder="Email ID"
        ></input>
        <button
          type="submit"
          className={`${
            true
              ? " bg-[var(--heading-1-color)] text-white cursor-pointer hover:bg-[#99a7ffaa] active:bg-[#99a7ffaa]"
              : "text-gray-100 bg-gray-300 cursor-not-allowed"
          } text-[1.8em] p-[0.5em] rounded-[0.5em] font-sans font-bold`}
        >
          Add New School
        </button>
        <button
          type="reset"
          onClick={handleResetButtonClick}
          className="text-[1.8em] p-[0.5em] rounded-[0.5em] bg-[var(--heading-1-color)] text-white font-sans font-bold hover:bg-[#99a7ffaa] active:bg-[#99a7ffaa]"
        >
          Reset
        </button>
      </form>
    </div>
  );
}
