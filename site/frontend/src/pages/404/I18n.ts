import { getI18n } from "../../components/I18n/I18n";

import enDictionary from "../../locales/404/en.json";

const I18n = getI18n("404", enDictionary);

export default I18n.I18n;

export const useI18n = I18n.useI18n;
