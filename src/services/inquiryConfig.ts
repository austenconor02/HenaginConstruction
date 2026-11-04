import { firebaseWebApp } from '../content/firebaseWebApp'

export interface InquiryConfig {
  enabled: boolean
  apiKey: string
  authDomain: string
  projectId: string
  appId: string
  region: string
  appCheckSiteKey: string
}
export function readInquiryConfig(
  env: Record<string, string | boolean | undefined>,
): InquiryConfig {
  return {
    enabled: env.VITE_INQUIRY_SUBMISSION_ENABLED === 'true',
    apiKey: String(env.VITE_FIREBASE_API_KEY ?? firebaseWebApp.apiKey).trim(),
    authDomain: String(env.VITE_FIREBASE_AUTH_DOMAIN ?? firebaseWebApp.authDomain).trim(),
    projectId: String(env.VITE_FIREBASE_PROJECT_ID ?? firebaseWebApp.projectId).trim(),
    appId: String(env.VITE_FIREBASE_APP_ID ?? firebaseWebApp.appId).trim(),
    region: String(env.VITE_FIREBASE_FUNCTIONS_REGION || 'us-central1').trim(),
    appCheckSiteKey: String(env.VITE_RECAPTCHA_ENTERPRISE_SITE_KEY || '').trim(),
  }
}
export function canSubmitInquiries(config: InquiryConfig): boolean {
  return (
    config.enabled &&
    [
      config.apiKey,
      config.authDomain,
      config.projectId,
      config.appId,
      config.region,
      config.appCheckSiteKey,
    ].every(Boolean)
  )
}
