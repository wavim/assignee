export {};

declare global {
	namespace Express {
		interface Request {
			uid: number;
			sid: number;
			rot: boolean;

			tid: number;
			own: boolean;
		}
	}
}
