import type { EstimateDraft } from '../types/content'

/** Build an email-app draft. This does not send mail or attach/upload files. */
export function estimateEmailUrl(
  recipient: string,
  draft: EstimateDraft,
  projectType: string,
  photoNames: readonly string[] = [],
): string {
  const contactLabels = { phone: 'Phone call', text: 'Text message', email: 'Email' }
  const lines = [
    'Hello Henagin Home Improvement,',
    "I'd like a free estimate for my project.",
    '',
    `Name: ${draft.name.trim()}`,
    `Phone: ${draft.phone.trim() || 'Not provided'}`,
    `Email: ${draft.email.trim() || 'Not provided'}`,
    `Preferred contact: ${contactLabels[draft.contactMethod]}`,
    `City or ZIP code: ${draft.location.trim() || 'Not provided'}`,
    `Project type: ${projectType}`,
    '',
    'Project details:',
    draft.description.trim(),
    '',
    ...(photoNames.length
      ? [
          'Photos selected (attach manually before sending):',
          ...photoNames.map((name) => `- ${name}`),
        ]
      : ['No photos selected.']),
    '',
    'The website has not sent this request or attached any photos. Please review this draft, attach any photos in your email app, and send it when ready.',
  ]
  const subject = `Henagin Home Improvement estimate request: ${projectType || 'Project'}`
  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\r\n'))}`
}
