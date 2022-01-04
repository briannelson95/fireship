import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'

const firebaseConfig = {
    apiKey: "AIzaSyCdhtPEj4nSOOHsQH68p_GZnam6UyfuO94",
    authDomain: "firenext-15597.firebaseapp.com",
    projectId: "firenext-15597",
    storageBucket: "firenext-15597.appspot.com",
    messagingSenderId: "870785924580",
    appId: "1:870785924580:web:304ef62e1b379ceadd1bf1",
    measurementId: "G-L764SC5TJZ"
}

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

export const auth = firebase.auth()
export const firestore = firebase.firestore()
export const storage = firebase.storage()