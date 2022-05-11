import { google } from "googleapis";

export let oAuth2Client;

export const changeOAuth2ClientValue = (credentials) => {
  oAuth2Client = new google.auth.OAuth2(credentials.installed.client_id, credentials.installed.client_secret, credentials.installed.redirect_uris[0])
}