import './styles/style.scss';
import { performAction } from './js/app';

// Moved from app.js
document.getElementById('get-info').addEventListener('click', performAction);

if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker
			.register('/service-worker.js')
			.then((registration) => {
				console.log('SW registered: ', registration);
			})
			.catch((registrationError) => {
				console.log('SW registration failed: ', registrationError);
			});
	});
}
