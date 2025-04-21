import { initializeApp } from 'firebase/app'
import { getFirestore, setDoc, doc, collection, addDoc, serverTimestamp, query, getDoc, where, onSnapshot, updateDoc, deleteDoc, getDocs } from 'firebase/firestore'
import { initializeAuth, getReactNativePersistence, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail, EmailAuthProvider, reauthenticateWithCredential, updatePassword, verifyBeforeUpdateEmail } from 'firebase/auth'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_APP_ID
}

const app = initializeApp(firebaseConfig)

const firestore = getFirestore(app)

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
})

const USERS = 'users' // This is a collection in Firestore
const GROUPS = 'groups'
const GROUPUSERS = 'group-users'
const USERGROUPS = 'user-groups'

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
    onAuthStateChanged,
    where,
    query,
    getDoc,
    USERGROUPS,
    onSnapshot,
    sendPasswordResetEmail,
    updateDoc,
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword,
    verifyBeforeUpdateEmail,
    deleteDoc,
    getDocs,
 }
