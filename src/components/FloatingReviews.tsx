import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, Quote, X } from 'lucide-react'
import type { Review } from '../types/content'
import { FacebookIcon } from './FacebookIcon'
import '../styles/reviews.css'

export function FloatingReviews({ reviews }: { reviews: Review[] }) {
  const published = useMemo(
    () =>
      reviews
        .filter((review) => review.published && review.author.trim() && review.text.trim())
        .sort((left, right) => Number(Boolean(right.featured)) - Number(Boolean(left.featured))),
    [reviews],
  )
  const [index, setIndex] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [estimateVisible, setEstimateVisible] = useState(false)
  const panel = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement | null>(null)
  const headingId = useId()
  const review = published[index % published.length]

  useEffect(() => {
    const estimate = document.getElementById('estimate')
    if (!estimate) return
    // Keep estimate fields, the submit button and the on-screen keyboard clear.
    const observer = new IntersectionObserver(([entry]) => setEstimateVisible(entry.isIntersecting))
    observer.observe(estimate)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!expanded) return
    const element = panel.current
    if (!element) return
    const overflow = document.body.style.overflow
    element.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      element.close()
      document.body.style.overflow = overflow
      trigger.current?.focus({ preventScroll: true })
    }
  }, [expanded])

  if (!review || dismissed || (estimateVisible && !expanded)) return null

  const sourceUrl =
    review.sourceUrl && /^https?:\/\//i.test(review.sourceUrl) ? review.sourceUrl : undefined
  const recommendation = review.source === 'facebook'

  function move(direction: number) {
    setIndex((previous) => (previous + direction + published.length) % published.length)
  }

  return (
    <aside
      className={`floating-reviews ${collapsed ? 'is-collapsed' : ''}`}
      aria-label="Customer recommendations"
    >
      <div className="floating-reviews-preview">
        <div className="review-preview-header">
          <span>
            <Quote size={18} aria-hidden="true" /> From our customers
          </span>
          <div className="review-window-controls">
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              aria-label="Minimize customer review"
            >
              <ChevronDown size={19} />
            </button>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Dismiss customer reviews"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="review-preview-content">
          <p className="review-author">{review.author}</p>
          <p className="review-source">
            {recommendation ? 'Recommends Henagin Home Improvement' : 'Customer review'}
          </p>
          <blockquote className="review-preview-quote">&ldquo;{review.text}&rdquo;</blockquote>
          <button
            type="button"
            className="review-read-button"
            onClick={(event) => {
              trigger.current = event.currentTarget
              setExpanded(true)
            }}
            aria-haspopup="dialog"
          >
            Read full review <ArrowUpRight size={17} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="floating-reviews-chip">
        <button
          type="button"
          className="review-chip-open"
          onClick={(event) => {
            trigger.current = event.currentTarget
            setExpanded(true)
          }}
          aria-haspopup="dialog"
        >
          <Quote size={20} aria-hidden="true" />
          <span>
            <strong>Customer {published.length === 1 ? 'review' : 'reviews'}</strong>
            <span>{review.author}</span>
          </span>
        </button>
        <button
          type="button"
          className="review-chip-dismiss"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss customer reviews"
        >
          <X size={17} />
        </button>
      </div>

      {expanded && (
        <dialog
          ref={panel}
          className="review-dialog"
          aria-labelledby={headingId}
          onCancel={(event) => {
            event.preventDefault()
            setExpanded(false)
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) setExpanded(false)
          }}
        >
          <div className="review-dialog-content">
            <div className="review-dialog-header">
              <span>
                <Quote size={20} aria-hidden="true" /> From our customers
              </span>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                aria-label="Close customer review"
                autoFocus
              >
                <X size={22} />
              </button>
            </div>
            <figure className="review-full-content">
              <figcaption>
                <h2 id={headingId} className="review-author">
                  {review.author}
                </h2>
                <p className="review-source">
                  {recommendation ? 'Recommends Henagin Home Improvement' : 'Customer review'}
                </p>
              </figcaption>
              <blockquote>&ldquo;{review.text}&rdquo;</blockquote>
              {sourceUrl && (
                <a
                  className="review-source-link"
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {recommendation && <FacebookIcon />}
                  {recommendation ? 'Visit our Facebook page' : 'View review source'}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              )}
            </figure>
            {published.length > 1 && (
              <div className="review-pagination" aria-label="Browse customer reviews">
                <button type="button" onClick={() => move(-1)} aria-label="Previous review">
                  <ChevronLeft size={20} />
                </button>
                <span aria-live="polite">
                  {(index % published.length) + 1} of {published.length}
                </span>
                <button type="button" onClick={() => move(1)} aria-label="Next review">
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </dialog>
      )}
    </aside>
  )
}
