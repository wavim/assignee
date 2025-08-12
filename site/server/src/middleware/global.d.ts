export { };

declare global {
	namespace Express {
		interface Request {
			uid: number;
			rot: boolean;

			tid: number;
			own: boolean;
		}
	}
}
