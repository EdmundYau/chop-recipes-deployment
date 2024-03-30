import { useRef, useState } from "react";
import EditIcon from "./EditIcon";
import PhotoModal from "./PhotoModal";
import axios from 'axios';
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { useUser } from "../contexts/UserContent";
import React, { useEffect } from 'react';

// const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const BACKEND_URL = "https://chop-recipes-back-end.vercel.app"

const ProfilePicture = ({photo, profileID}) => {
  const avatarUrl = useRef(
    {photo}
  );
  const [picture, setPicture] = useState(photo);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setPicture(photo);
  }, [photo]);
  
  const force_refresh = () => {
    window.location.href = "/user/" + userID;
};
const updateAvatar = async (imgSrc) => {
    try {
        // Assuming imgSrc is a base64-encoded string
        let trimmedimgSrc = imgSrc.substring(22); // Remove base64 prefix if present

        // Convert the base64 string to a Blob object
        const byteCharacters = atob(trimmedimgSrc);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });

        // Generate unique file name
        const uniqueFileName = `${Date.now()}-avatar.jpg`;

        // Upload the file to Firebase Storage
        const storageRef = firebase.storage().ref();
        const fileRef = storageRef.child(uniqueFileName);

        const snapshot = await fileRef.put(blob);

        // Get the download URL of the uploaded image
        const downloadURL = await snapshot.ref.getDownloadURL();

        // Update avatar URL in the database (MongoDB)
        await updateAvatarDB(downloadURL);

        // Log that updateAvatarDB is being called
        console.log('updateAvatarDB called');

        // Assuming setPicture is defined elsewhere
        setPicture(downloadURL);

        // Force refresh
        force_refresh();
    } catch (error) {
        console.error('Error in updateAvatar:', error);
    }
};


const { userID } = useUser();

const updateAvatarDB = async (downloadURL) => {
    console.log("calling update photo image:");
    try {
        const response = await axios.post(
            BACKEND_URL + "/api/updatePhoto/" + userID,
            { downloadURL }
        );
        console.error("uploaded that to the db");
        // You may handle the response here if needed
    } catch (error) {
        console.error("Error update photo image:", error);
    }
};

  return (
    <div className="flex flex-col items-center pt-12">
      <div className="relative">
        <img
          src={picture}
          alt="Avatar"
          className="w-[150px] h-[150px] rounded-full border-2 border-gray-400"
        />
        <button
          className="absolute -bottom-3 left-0 right-0 m-auto w-fit p-[.35rem] rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-600"
          title="Change photo"
          hidden={userID !== profileID}
          onClick={() => setModalOpen(true)}
        >
          <EditIcon />
        </button>
      </div>
      {modalOpen && (
        <PhotoModal
          updateAvatar={updateAvatar}
          closeModal={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProfilePicture;
