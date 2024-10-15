export interface JwtPayload {
	sub: string;
	role: 'user' | 'vendor';
}