export const NODE_ENV = process.env.NODE_ENV;

export const NETLESS = Object.freeze({
    APP_IDENTIFIER: process.env.NETLESS_APP_IDENTIFIER,
});

export const AGORA = Object.freeze({
    APP_ID: process.env.AGORA_APP_ID,
});

export const AGORA_OAUTH = Object.freeze({
    CLIENT_ID: process.env.AGORA_OAUTH_CLIENT_ID,
});

export const WECHAT = Object.freeze({
    APP_ID: process.env.WECHAT_APP_ID,
});

export const GITHUB = Object.freeze({
    CLIENT_ID: process.env.GITHUB_CLIENT_ID,
});

export const GOOGLE = Object.freeze({
    CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
});

export const FLAT_DOWNLOAD_URL = process.env.FLAT_DOWNLOAD_URL;

export const PRIVACY_URL_CN = "https://flat.whiteboard.agora.io/privacy.html";
export const PRIVACY_URL = "https://flat.whiteboard.agora.io/privacy.html";

export const SERVICE_URL_CN = "https://flat.whiteboard.agora.io/service.html";
export const SERVICE_URL = "https://flat.whiteboard.agora.io/service.html";

export const FLAT_WEB_BASE_URL = `https://${process.env.FLAT_WEB_DOMAIN}`;
