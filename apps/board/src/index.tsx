/* @refresh reload */

import { render } from 'solid-js/web';
import { initializeEnvironment } from './utils/env-checker';
import App from './App';
import './index.css';

// Validate environment before rendering
try {
	initializeEnvironment();
	const root = document.getElementById('root');
	if (!root) throw new Error('Root element not found');
	render(() => <App />, root);
} catch (error) {
	console.error('Failed to initialize application:', error);
	// Error is already displayed by initializeEnvironment in dev mode
}
