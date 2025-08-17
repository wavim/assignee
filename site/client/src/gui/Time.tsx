export default (props: { name: string; minimum: Date; default: Date }) => (
	<label class="font-jakarta border-border flex cursor-pointer flex-col gap-2 rounded-xl border-1 px-4 py-3">
		<span class="text-holder text-lg">{props.name}</span>
		<input
			type="datetime-local"
			min={convert(props.minimum)}
			value={convert(props.default)}
			autocomplete="off"
			class="text-text-major cursor-pointer text-lg"
		></input>
	</label>
);

function convert(date: Date): string {
	return new Date(date.getTime() - date.getTimezoneOffset() * 60e3).toISOString().slice(0, 16);
}
