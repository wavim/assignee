export const config = {
	provider: process.env.DB_PROVIDER ?? "mysql",
	user: process.env.DB_USER ?? "root",
	password: process.env.DB_PASSWORD ?? "123",
	host: process.env.DB_HOST ?? "localhost",
	port: process.env.DB_PORT ?? "3306",
	name: process.env.DB_NAME ?? "test",
};
