import { getI18n } from "../../components/I18n/I18n";

import enDictionary from "../../locales/Header/en.json";

const I18n = getI18n("Header", enDictionary);

export default I18n.I18n;

export const useI18n = I18n.useI18n;
