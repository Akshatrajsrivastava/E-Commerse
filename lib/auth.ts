import { jwtVerify } from 'jose';

export const verifyToken = async (token: string) => {
    try {
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(process.env.JWT_SECRET!)
        );
        return payload;
    } catch (error) {
        return null;
    }
};

export const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        if (decoded && decoded.exp) {
            return Date.now() >= decoded.exp * 1000;
        }
        return true;
    } catch {
        return true;
    }
};