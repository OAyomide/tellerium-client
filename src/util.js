import firebase, { storage } from 'firebase'
import { v4 as uuid } from 'uuid'
const firebaseConfig = {
  apiKey: "AIzaSyCdJY8bOitOoUj3TfoSuLi6awr32633Pb8",
  authDomain: "brandbox-dev.firebaseapp.com",
  databaseURL: "https://brandbox-dev.firebaseio.com",
  projectId: "brandbox-dev",
  storageBucket: "brandbox-dev.appspot.com",
  messagingSenderId: "337866394560",
  appId: "1:337866394560:web:908d3d43c084a84d46d625",
  measurementId: "G-D4DQ386V6V"
}

const fbClient = firebase.initializeApp(firebaseConfig)
const fbStorage = fbClient.storage()

export async function UploadImagesToFirebase(images) {
  try {
    const uploadedURL = []
    for (let image of images) {
      const randomRef = uuid()
      let fetchBlobURL = await (await fetch(image)).blob()
      await storage(fbClient).ref(randomRef).put(fetchBlobURL)
      const url = await storage(fbClient).ref(randomRef).getDownloadURL()
      console.log(`Download URL`, url)
      uploadedURL.push(url)
    }

    return uploadedURL
  } catch (error) {
    console.log(`Error uploading image`)
    console.log(error)
  }
}