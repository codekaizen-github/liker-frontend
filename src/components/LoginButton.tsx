import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import React from 'react';
import { useDispatch } from 'react-redux';
import { setToken } from '../state/slices/authSlice';

const LoginButton: React.FC = () => {
    const dispatch = useDispatch();

    const handleSuccess = (response: CredentialResponse) => {
        console.log('Success:', response);
        if (response.credential) {
            dispatch(setToken(response.credential));
        }
    };

    const handleFailure = () => {
        console.error('Failure:');
    };

    return <GoogleLogin onSuccess={handleSuccess} onError={handleFailure} />;
};

export default LoginButton;
