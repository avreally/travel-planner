import './styles/style.scss'

// Examples of imported functions
// import { checkForName } from './js/nameChecker'
// import { handleSubmit } from './js/formHandler'

// console.log(checkForName);

alert('OK!')


if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}