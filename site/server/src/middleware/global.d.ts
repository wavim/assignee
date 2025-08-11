export {};

declare global {
	namespace Express {
		interface Request {
			uid: number;
			rot: boolean;
		}
	}
}
