import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import store from './state/store';
import { Provider } from 'react-redux';
import OAuthProvider from './OAuthProvider';

const root = createRoot(document.getElementById('root')!);

root.render(
    <React.StrictMode>
        <OAuthProvider>
            <Provider store={store}>
                <App />
            </Provider>
        </OAuthProvider>
    </React.StrictMode>
);
