import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';

const firebaseConfig = {
	apiKey: "AIzaSyByE1LlIzwAeoBYrW1JTPc3q8K1JvJFRak",
	authDomain: "oppenfnafw.firebaseapp.com",
	projectId: "oppenfnafw",
	storageBucket: "oppenfnafw.firebasestorage.app",
	messagingSenderId: "767318310403",
	appId: "1:767318310403:web:6f2846cb6252f1a085d836"
};

function initializeFirebase() {
	if (globalThis.firebaseApp) return globalThis.firebaseApp;
	const app = initializeApp(firebaseConfig);
	globalThis.firebaseApp = app;
	return app;
}

const firebase = {
	init: initializeFirebase,
	getApp: () => globalThis.firebaseApp || null,
	config: firebaseConfig
};

export { initializeFirebase, firebase };

