import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { business } from '../content/business'
import { MAX_PHOTOS, PHOTO_TYPES, photoError, validateEstimate } from '../lib/validation'
import { estimateEmailUrl } from '../lib/estimateEmail'
import { estimateGateway } from '../services/estimateGateway'
import type { ContactMethod, EstimateDraft, ServiceId } from '../types/content'

interface PhotoPreview {
  id: string
  file: File
  url: string
}

const initialDraft: EstimateDraft = {
  name: '',
  phone: '',
  email: '',
  contactMethod: 'phone',
  location: '',
  service: '',
  description: '',
}

export function EstimateForm({
  selectedService = '',
  selectionVersion = 0,
}: {
  selectedService?: ServiceId | ''
  selectionVersion?: number
} = {}) {
  const [extrasOpen, setExtrasOpen] = useState(false)
  const [projectType, setProjectType] = useState('')
  const [draft, setDraft] = useState<EstimateDraft>(initialDraft)
  const [errors, setErrors] = useState<Partial<Record<keyof EstimateDraft, string>>>({})
  const [photos, setPhotos] = useState<PhotoPreview[]>([])
  const [photoErrors, setPhotoErrors] = useState<string[]>([])
  const [notice, setNotice] = useState('')
  const [noticeKind, setNoticeKind] = useState<'info' | 'error' | 'success'>('info')
  const [phase, setPhase] = useState<'idle' | 'submitting' | 'received'>('idle')
  const [progress, setProgress] = useState('')
  const requestKey = useRef('')
  const activeRequest = useRef(false)
  const submitting = phase === 'submitting'
  const serviceSelect = useRef<HTMLSelectElement>(null)
  const emailLink = useRef<HTMLAnchorElement>(null)
  const objectUrls = useRef(new Set<string>())
  const descriptionLimit = projectType === 'built-ins' ? 4990 : 5000

  useEffect(() => {
    if (selectedService) {
      setDraft((previous) => ({ ...previous, service: selectedService }))
      setProjectType(
        selectedService === 'soffit' || selectedService === 'siding'
          ? 'fascia'
          : selectedService === 'skid-steer'
            ? 'other'
            : selectedService,
      )
      serviceSelect.current?.focus({ preventScroll: true })
    }
  }, [selectedService, selectionVersion])

  useEffect(() => {
    const urls = objectUrls.current
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
      urls.clear()
    }
  }, [])

  function update(field: keyof EstimateDraft, value: string) {
    setDraft((previous) => ({ ...previous, [field]: value }))
    setErrors((previous) => ({ ...previous, [field]: undefined }))
    setNotice('')
    setPhase('idle')
    requestKey.current = ''
  }

  function addPhotos(event: ChangeEvent<HTMLInputElement>) {
    if (submitting) return
    const incoming = [...(event.target.files ?? [])]
    const additions: PhotoPreview[] = []
    const rejected: string[] = []
    for (const file of incoming) {
      const error = photoError(file)
      if (error) {
        rejected.push(error)
        continue
      }
      if (photos.length + additions.length >= MAX_PHOTOS) {
        rejected.push(`${file.name}: you can add up to five photos.`)
        continue
      }
      const url = URL.createObjectURL(file)
      objectUrls.current.add(url)
      additions.push({ id: crypto.randomUUID(), file, url })
    }
    setPhotos((previous) => [...previous, ...additions])
    setPhotoErrors(rejected)
    setPhase('idle')
    setNotice('')
    requestKey.current = ''
    event.target.value = ''
  }

  function removePhoto(photo: PhotoPreview) {
    if (submitting) return
    URL.revokeObjectURL(photo.url)
    objectUrls.current.delete(photo.url)
    setPhotos((previous) => previous.filter((item) => item.id !== photo.id))
    setPhotoErrors([])
    setPhase('idle')
    setNotice('')
    requestKey.current = ''
  }

  function reviewDraft() {
    const validation = validateEstimate(draft)
    if (!projectType) validation.service = 'Please choose a project type.'
    if (draft.description.length > descriptionLimit) {
      validation.description = `Please keep your project description to ${descriptionLimit.toLocaleString()} characters.`
    }
    // Location is required by the live transport, optional for an email-app draft.
    if (!estimateGateway.available) delete validation.location
    setErrors(validation)
    if (Object.keys(validation).length) {
      setNotice('Please review the highlighted fields. Nothing has been sent.')
      setNoticeKind('error')
      if (validation.location || validation.contactMethod) setExtrasOpen(true)
      const first = Object.keys(validation)[0]
      requestAnimationFrame(() => document.getElementById(`estimate-${first}`)?.focus())
      return false
    }
    return true
  }

  async function submitDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (activeRequest.current || submitting || phase === 'received') return
    if (!reviewDraft()) return
    if (!estimateGateway.available) {
      setNoticeKind('info')
      setNotice(
        'Your email draft is ready. Nothing has been sent automatically. Review the draft, attach any photos, and send it when ready. If your email app did not open, use the email link above.',
      )
      emailLink.current?.click()
      return
    }
    activeRequest.current = true
    requestKey.current ||= crypto.randomUUID()
    setPhase('submitting')
    setNotice('')
    setProgress('Preparing your request…')
    try {
      const receipt = await estimateGateway.submit(
        projectType === 'built-ins'
          ? { ...draft, description: 'Built-ins: ' + draft.description }
          : draft,
        photos.map((photo) => photo.file),
        requestKey.current,
        setProgress,
      )
      setPhase('received')
      setNoticeKind('success')
      setNotice(
        `Your request ${receipt.reference} has been received. Thank you — we’ll be in touch using your preferred contact method.`,
      )
    } catch {
      setPhase('idle')
      setNoticeKind('error')
      setNotice(
        'We could not confirm your request. Your details are still here. Please retry or call/text (972) 310-3255. Retrying these same details will not create a second inquiry.',
      )
    } finally {
      activeRequest.current = false
      setProgress('')
    }
  }

  const errorProps = (field: keyof EstimateDraft) => ({
    'aria-invalid': Boolean(errors[field]),
    'aria-describedby': errors[field] ? `error-${field}` : undefined,
  })
  const fieldError = (field: keyof EstimateDraft) =>
    errors[field] && (
      <span className="field-error" id={`error-${field}`}>
        {errors[field]}
      </span>
    )

  const inputClass =
    'w-full rounded-input border border-ploy-input-border bg-ploy-input-background px-4 text-base text-ploy-text-primary placeholder:text-ploy-text-secondary/70 transition-colors focus:border-ploy-accent-primary focus:outline-none focus:ring-1 focus:ring-ploy-accent-primary'
  const labelClass = 'font-eyebrow typography-eyebrow text-base uppercase text-ploy-text-primary'
  const projectOptions: { value: string; label: string; service: ServiceId }[] = [
    { value: 'custom-builds', label: 'Custom build', service: 'custom-builds' },
    { value: 'remodeling', label: 'Remodel', service: 'remodeling' },
    { value: 'built-ins', label: 'Built-ins', service: 'custom-builds' },
    { value: 'painting', label: 'Painting', service: 'painting' },
    { value: 'flooring', label: 'Flooring', service: 'flooring' },
    { value: 'handyman', label: 'Handyman', service: 'handyman' },
    { value: 'fascia', label: 'Fascia, soffit or siding', service: 'fascia' },
    { value: 'other', label: 'Something else', service: 'other' },
  ]
  const emailUrl = estimateEmailUrl(
    business.estimateEmail,
    draft,
    projectOptions.find((option) => option.value === projectType)?.label ?? 'Project',
    photos.map((photo) => photo.file.name),
  )

  return (
    <form
      className="estimate-form grid gap-5 sm:grid-cols-2"
      onSubmit={submitDraft}
      noValidate
      aria-describedby={!estimateGateway.available ? 'form-availability' : undefined}
      aria-labelledby="estimate-heading"
      aria-busy={submitting}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="estimate-name" className={labelClass}>
          Name
        </label>
        <input
          className={inputClass + ' h-12'}
          id="estimate-name"
          name="name"
          autoComplete="name"
          required
          maxLength={100}
          disabled={submitting}
          value={draft.name}
          onChange={(e) => update('name', e.target.value)}
          {...errorProps('name')}
        />
        {fieldError('name')}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="estimate-phone" className={labelClass}>
          Phone
        </label>
        <input
          className={inputClass + ' h-12'}
          id="estimate-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required={draft.contactMethod !== 'email'}
          maxLength={30}
          disabled={submitting}
          value={draft.phone}
          onChange={(e) => update('phone', e.target.value)}
          {...errorProps('phone')}
        />
        {fieldError('phone')}
      </div>
      <div className="flex flex-col gap-2 sm:col-span-2">
        <label htmlFor="estimate-email" className={labelClass}>
          Email
        </label>
        <input
          className={inputClass + ' h-12'}
          id="estimate-email"
          name="email"
          type="email"
          autoComplete="email"
          required={draft.contactMethod === 'email'}
          maxLength={254}
          disabled={submitting}
          value={draft.email}
          onChange={(e) => update('email', e.target.value)}
          {...errorProps('email')}
        />
        {fieldError('email')}
      </div>
      <div className="flex flex-col gap-2 sm:col-span-2">
        <label htmlFor="estimate-service" className={labelClass}>
          Project type
        </label>
        <select
          className={inputClass + ' h-12'}
          id="estimate-service"
          name="service"
          required
          ref={serviceSelect}
          value={projectType}
          disabled={submitting}
          onChange={(e) => {
            setProjectType(e.target.value)
            update(
              'service',
              projectOptions.find((option) => option.value === e.target.value)?.service ?? '',
            )
          }}
          {...errorProps('service')}
        >
          <option value="" disabled>
            Choose one
          </option>
          {projectOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {fieldError('service')}
      </div>
      <div className="flex flex-col gap-2 sm:col-span-2">
        <label htmlFor="estimate-description" className={labelClass}>
          Tell us about your project
        </label>
        <textarea
          className={inputClass + ' min-h-32 py-3'}
          id="estimate-description"
          name="description"
          placeholder="What you want done, rough size, and timing"
          required
          maxLength={descriptionLimit}
          disabled={submitting}
          value={draft.description}
          onChange={(e) => update('description', e.target.value)}
          {...errorProps('description')}
        />
        {fieldError('description')}
      </div>
      <details
        className="estimate-extras sm:col-span-2"
        open={extrasOpen}
        onToggle={(event) => setExtrasOpen(event.currentTarget.open)}
      >
        <summary>Add project location and photos</summary>
        <fieldset className="estimate-extra-fields" disabled={submitting}>
          <legend className="sr-only">Additional project details</legend>
          <div className="flex flex-col gap-2">
            <label htmlFor="estimate-location" className={labelClass}>
              City or ZIP code{estimateGateway.available ? ' (required)' : ''}
            </label>
            <input
              className={inputClass + ' h-12'}
              id="estimate-location"
              name="location"
              autoComplete="address-level2"
              placeholder="Where is your project?"
              required={estimateGateway.available}
              maxLength={100}
              value={draft.location}
              onChange={(e) => update('location', e.target.value)}
              {...errorProps('location')}
            />
            {fieldError('location')}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="estimate-contactMethod" className={labelClass}>
              Preferred contact method
            </label>
            <select
              className={inputClass + ' h-12'}
              id="estimate-contactMethod"
              name="contactMethod"
              value={draft.contactMethod}
              onChange={(e) => update('contactMethod', e.target.value as ContactMethod)}
            >
              <option value="phone">Phone call</option>
              <option value="text">Text message</option>
              <option value="email">Email</option>
            </select>
          </div>
          <div className="photo-field">
            <label
              className={`photo-upload ${photos.length >= MAX_PHOTOS ? 'upload-full' : ''}`}
              htmlFor="estimate-photos"
            >
              <ImagePlus size={23} aria-hidden="true" />
              <span>
                <strong>
                  {photos.length >= MAX_PHOTOS ? 'Five photos added' : 'Choose project photos'}
                </strong>
                <span>Up to 5 photos · 10 MB each · JPG, PNG, WebP, AVIF</span>
              </span>
              <input
                type="file"
                id="estimate-photos"
                name="photos"
                accept={PHOTO_TYPES.join(',')}
                multiple
                onChange={addPhotos}
                disabled={photos.length >= MAX_PHOTOS}
                aria-describedby="photo-feedback photo-privacy"
              />
            </label>
            <p className="sr-only" id="photo-feedback" aria-live="polite">
              {photos.length} of {MAX_PHOTOS} photos selected.
            </p>
            {photos.length > 0 && (
              <ul className="photo-previews">
                {photos.map((photo) => (
                  <li key={photo.id}>
                    <img
                      src={photo.url}
                      alt={`Preview of ${photo.file.name}`}
                      onError={() =>
                        setPhotoErrors((previous) => {
                          const message = `${photo.file.name}: this image could not be displayed. Please remove it and choose another.`
                          return previous.includes(message) ? previous : [...previous, message]
                        })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(photo)}
                      aria-label={`Remove ${photo.file.name}`}
                    >
                      <X size={14} />
                    </button>
                    <span title={photo.file.name}>{photo.file.name}</span>
                  </li>
                ))}
              </ul>
            )}
            {photoErrors.length > 0 && (
              <ul className="photo-errors" role="alert">
                {photoErrors.map((error, i) => (
                  <li key={`${i}-${error}`}>{error}</li>
                ))}
              </ul>
            )}
            <p id="photo-privacy" className="photo-privacy">
              {estimateGateway.available
                ? 'Photos upload only when you send your request and are not published.'
                : 'Photos are previewed only on your device. Attach the selected files manually in your email app before sending. Refreshing or closing this page clears the form.'}
            </p>
          </div>
        </fieldset>
      </details>
      <div className="sm:col-span-2">
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-button font-button typography-button transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ploy-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-ploy-background-primary disabled:pointer-events-none disabled:opacity-50 border border-ploy-button-primary-border bg-ploy-button-primary-background text-ploy-button-primary-text hover:bg-ploy-button-primary-background/90 h-14 px-7 text-lg w-full"
          type="submit"
          disabled={submitting || phase === 'received'}
        >
          {submitting
            ? 'Sending request…'
            : phase === 'received'
              ? 'Request received'
              : estimateGateway.available
                ? 'Request my free estimate'
                : 'Email my estimate request'}
        </button>
      </div>
      {!estimateGateway.available && (
        <p id="form-availability" className="form-availability sm:col-span-2">
          Opens your email app. Review and send your request to{' '}
          <a ref={emailLink} href={emailUrl}>
            {business.estimateEmail}
          </a>
          . Attach any photos before sending. Nothing is sent automatically. You can also{' '}
          <a href={business.callUrl}>call</a> or <a href={business.textUrl}>text</a> us.
        </p>
      )}
      {progress && (
        <p className="form-notice sm:col-span-2" role="status">
          {progress}
        </p>
      )}
      {notice && (
        <p
          className="form-notice sm:col-span-2"
          data-state={noticeKind}
          role={noticeKind === 'error' ? 'alert' : 'status'}
        >
          {notice}
        </p>
      )}
    </form>
  )
}
