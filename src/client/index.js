import './styles/style.css';
import { performAction } from './js/app';

// Moved from app.js
document.getElementById('main-form').addEventListener('submit', performAction);

// if ('serviceWorker' in navigator) {
// 	window.addEventListener('load', () => {
// 		navigator.serviceWorker
// 			.register('/service-worker.js')
// 			.then((registration) => {
// 				console.log('SW registered: ', registration);
// 			})
// 			.catch((registrationError) => {
// 				console.log('SW registration failed: ', registrationError);
// 			});
// 	});
// }
