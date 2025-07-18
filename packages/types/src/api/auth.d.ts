export interface APILoginBody {
	email: string;
	password: string;
}

export interface APIRegisterBody {
	email: string;
	password: string;
}

export interface APILoginResponse {
	accessToken: string;
}

export interface APIRefreshTokenResponse {
	accessToken: string;
}
