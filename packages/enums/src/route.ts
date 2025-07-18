/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
export enum APIRoutePrefix {
	Users = "/users",
	Auth = "/auth",
	Categories = "/categories",
}

export enum APIUserRoute {
	GetById = `/:id`,
	Current = `/@me`,
}

export enum APICurrentUserRoute {
	Get = `/`,
	Modify = `/`,
}

export enum APIAuthRoute {
	Register = "/register",
	Login = "/login",
	RefreshToken = "/refresh",
	Logout = "/logout",
}

export enum APIRoute {
	GetCurrentUser = `${APIRoutePrefix.Users}${APIUserRoute.Current}${APICurrentUserRoute.Get}`,
	ModifyCurrentUser = `${APIRoutePrefix.Users}${APIUserRoute.Current}${APICurrentUserRoute.Modify}`,
	GetUserById = `${APIRoutePrefix.Users}${APIUserRoute.GetById}`,
	Register = `${APIRoutePrefix.Auth}${APIAuthRoute.Register}`,
	Login = `${APIRoutePrefix.Auth}${APIAuthRoute.Login}`,
	RefreshToken = `${APIRoutePrefix.Auth}${APIAuthRoute.RefreshToken}`,
	Logout = `${APIRoutePrefix.Auth}${APIAuthRoute.Logout}`,
}
