/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
export enum APIRoutePrefix {
	Users = "/users",
	Auth = "/auth",
	Categories = "/categories",
}

export enum APIUsersRoute {
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

export enum APICategoriesRoute {
	Get = "/",
	Create = "/",
	WithId = "/:id",
}

export enum APICategoryRoute {
	Get = "/",
	Modify = "/",
}

export enum APIRoute {
	GetCurrentUser = `${APIRoutePrefix.Users}${APIUsersRoute.Current}${APICurrentUserRoute.Get}`,
	ModifyCurrentUser = `${APIRoutePrefix.Users}${APIUsersRoute.Current}${APICurrentUserRoute.Modify}`,
	GetUserById = `${APIRoutePrefix.Users}${APIUsersRoute.GetById}`,

	Register = `${APIRoutePrefix.Auth}${APIAuthRoute.Register}`,
	Login = `${APIRoutePrefix.Auth}${APIAuthRoute.Login}`,
	RefreshToken = `${APIRoutePrefix.Auth}${APIAuthRoute.RefreshToken}`,
	Logout = `${APIRoutePrefix.Auth}${APIAuthRoute.Logout}`,

	GetCategories = `${APIRoutePrefix.Categories}${APICategoriesRoute.Get}`,
	CreateCategory = `${APIRoutePrefix.Categories}${APICategoriesRoute.Create}`,
	GetCategory = `${APICategoriesRoute.WithId}${APICategoryRoute.Get}`,
	ModifyCategory = `${APICategoriesRoute.WithId}${APICategoryRoute.Modify}`,
}
