/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
export enum APIRoutePrefix {
	Users = "/users",
	Auth = "/auth",
	Categories = "/categories",
	Incomes = "/incomes",
}

export enum APIUsersRoute {
	GetById = `/:userId`,
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
	WithId = "/:categoryId",
}

export enum APICategoryRoute {
	Get = "/",
	Modify = "/",
	Delete = "/",
}

export enum APIIncomesRoute {
	Get = "/",
	Create = "/",
	WithId = "/:incomeId",
}

export enum APIIncomeRoute {
	Get = "/",
	Modify = "/",
	Delete = "/",
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
	GetCategory = `${APIRoutePrefix.Categories}${APICategoriesRoute.WithId}${APICategoryRoute.Get}`,
	ModifyCategory = `${APIRoutePrefix.Categories}${APICategoriesRoute.WithId}${APICategoryRoute.Modify}`,
	DeleteCategory = `${APIRoutePrefix.Categories}${APICategoriesRoute.WithId}${APICategoryRoute.Delete}`,

	GetIncomes = `${APIRoutePrefix.Incomes}${APIIncomesRoute.Get}`,
	CreateIncome = `${APIRoutePrefix.Incomes}${APIIncomesRoute.Create}`,
	GetIncome = `${APIRoutePrefix.Incomes}${APIIncomesRoute.WithId}${APIIncomeRoute.Get}`,
	ModifyIncome = `${APIRoutePrefix.Incomes}${APIIncomesRoute.WithId}${APIIncomeRoute.Modify}`,
	DeleteIncome = `${APIRoutePrefix.Incomes}${APIIncomesRoute.WithId}${APIIncomeRoute.Delete}`,
}
