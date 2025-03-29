import { initializeApp } from 'firebase/app'
import { getFirestore, setDoc, doc, collection, addDoc, serverTimestamp  } from 'firebase/firestore'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'

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
const auth = getAuth()

const USERS = 'users' // This is a collection in Firestore
const GROUPS = 'groups'
const GROUPUSERS = 'group-users'

export { 
    firestore, 
    auth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    USERS, 
    setDoc, 
    doc,
    collection,
    addDoc,
    GROUPS,
    GROUPUSERS,
    serverTimestamp,
 }
