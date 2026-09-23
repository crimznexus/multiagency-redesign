import { createFileRoute } from '@tanstack/react-router'
import { summariseApplication, validateApplication } from '~/lib/application'
import { handleFormPost } from '~/server/form-post'

/** POST /api/apply: an application to join the network. See `handleFormPost` for the protocol. */
export const Route = createFileRoute('/api/apply')({
  server: {
    handlers: {
      POST: ({ request }) =>
        handleFormPost(request, {
          type: 'application',
          page: '/apply',
          validate: validateApplication,
          summarise: summariseApplication,
        }),
    },
  },
})
