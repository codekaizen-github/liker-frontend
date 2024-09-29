import { GoogleOAuthProvider } from '@react-oauth/google';
import React, { ReactNode } from 'react';

const clientId =
    '267903358821-1scorll67brb4ie8nhbus5k8ii85sjj0.apps.googleusercontent.com';

interface OAuthProviderProps {
    children: ReactNode;
}

const OAuthProvider: React.FC<OAuthProviderProps> = ({ children }) => {
    return (
        <GoogleOAuthProvider clientId={clientId}>
            {children}
        </GoogleOAuthProvider>
    );
};

export default OAuthProvider;
