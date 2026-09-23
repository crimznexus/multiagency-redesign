import { createFileRoute } from '@tanstack/react-router'
import { summariseInquiry, validateInquiry } from '~/lib/inquiry'
import { handleFormPost } from '~/server/form-post'

/** POST /api/contact: a hire-us inquiry. See `handleFormPost` for the protocol. */
export const Route = createFileRoute('/api/contact')({
  server: {
    handlers: {
      POST: ({ request }) =>
        handleFormPost(request, {
          type: 'inquiry',
          page: '/contact',
          validate: validateInquiry,
          summarise: summariseInquiry,
        }),
    },
  },
})
