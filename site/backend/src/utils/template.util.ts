export namespace TemplateUtils {
	export function fill(template: string, substitutes: { [key: string]: any }): string {
		for (const [key, value] of Object.entries(substitutes)) {
			template = template.replace(`{{${key}}}`, String(value));
		}
		return template;
	}
}
