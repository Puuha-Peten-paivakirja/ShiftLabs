import { initializeApp } from 'firebase/app'
import { getFirestore, setDoc, doc } from 'firebase/firestore'
import { getAuth, createUserWithEmailAndPassword  } from 'firebase/auth'

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_APP_ID
}

initializeApp(firebaseConfig)

const firestore = getFirestore()

const USERS = 'users' // This is a collection in Firestore

export { firestore, getAuth, createUserWithEmailAndPassword, USERS, setDoc, doc }
