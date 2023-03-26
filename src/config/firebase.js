import { initializeApp } from "firebase/app";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
} from "firebase/storage";
import { v4 as uuidV4 } from "uuid";

const firebaseConfig = {
  apiKey: "AIzaSyApzMh1uaD1viwx8FyJNHcRNsyQMM1kHF0",
  authDomain: "social-app-483f0.firebaseapp.com",
  projectId: "social-app-483f0",
  storageBucket: "social-app-483f0.appspot.com",
  messagingSenderId: "1025122762384",
  appId: "1:1025122762384:web:3d20d220d6d0fafe8f2215",
  measurementId: "G-FKE1003G2S",
};

const firebaseApp = initializeApp(firebaseConfig);

const firebaseStorage = getStorage(firebaseApp);

const cutString = (url) => {
  const index = url.lastIndexOf("/") + 1;
  const fileName = url.substr(index);
  return fileName;
};

export const postImg = async (image) => {
  const uuid = uuidV4();
  const metadata = {
    contentType: "image/jpeg",
  };
  const fileExtension = image.name.split(".").pop();
  const storageRef = ref(
    firebaseStorage,
    "images/" + `${uuid}.${fileExtension}`
  );

  const uploadTask = await uploadBytesResumable(storageRef, image, metadata);
  const urlImage = await getDownloadURL(uploadTask.ref);
  return urlImage;
};

export const postFile = async (file) => {
  const metadata = {
    contentType: file.type,
  };
  const storageRef = ref(
    firebaseStorage,
    `${cutString(file.type)}/` + `${file.name}`
  );
  const uploadTask = await uploadBytesResumable(storageRef, file, metadata);
  const urlFile = await getDownloadURL(uploadTask.ref);
  return { urlFile: urlFile, fileName: file.name };
};

export const nameByDate = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const name = `${month}-${day}-${year} ${hour}:${minute}:${second}`;
  return name;
};

export const postAudio = async (audio) => {
  const metadata = {
    contentType: file.type,
  };
  const audioExtension = audio.name.split(".").pop();
  const storageRef = ref(firebaseStorage, "audio/" + audio.name);
  const uploadTask = await uploadBytesResumable(storageRef, audio, metadata);
  const audioFile = await getDownloadURL(uploadTask.ref);
  return { urlAudio: audioFile, audioName: audio.name };
};
