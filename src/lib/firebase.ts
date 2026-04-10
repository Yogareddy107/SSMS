import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Test connection to Firestore
async function testConnection() {
  try {
    // Try to fetch a dummy doc to verify connection
    await getDocFromServer(doc(db, '_connection_test_', 'ping'));
    console.log("Firestore connection verified.");
  } catch (error: any) {
    const errInfo = {
      code: error?.code,
      message: error?.message,
      operation: 'connection_test',
      timestamp: new Date().toISOString()
    };
    
    if (error?.code === 'unavailable' || error?.message?.includes('the client is offline')) {
      console.error("CRITICAL: Could not reach Cloud Firestore backend.", JSON.stringify(errInfo));
    } else {
      // Other errors (like permission denied) are fine for a connection test
      console.log("Firestore reachable (test returned expected error):", error.code);
    }
  }
}

testConnection();
