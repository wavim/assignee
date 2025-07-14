import { getI18n } from "../I18n/I18n";

import enDictionary from "../../locales/Footer/en.json";

const I18n = getI18n("Footer", enDictionary);

export default I18n.I18n;

export const useI18n = I18n.useI18n;
