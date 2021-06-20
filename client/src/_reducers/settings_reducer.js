import { SET_GENERAL_CONFIG } from "../_actions/types";
export default function (settings = defaultSettings, action) {
  switch (action.type) {
    case SET_GENERAL_CONFIG:
      return {
        ...settings,
        general_config: action.payload,
      };

    default:
      return settings;
  }
}

const defaultSettings = {
  general_config: { language: "en", direction: "ltr" },
  user_config: {},
  card_config: {},
};
