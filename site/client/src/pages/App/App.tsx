import { useNavigate } from "@solidjs/router";
import { logout } from "../../api/auth.api";
import Button from "../../gui/Button";
import Guard from "../../gui/Guard";

export default () => {
	const navigate = useNavigate();

	return (
		<Guard protect>
			<div>Hi!</div>
			<Button
				onclick={() => {
					void logout().then(() => {
						navigate("/", { replace: true });
					});
				}}
			>
				Logout
			</Button>
		</Guard>
	);
};
