import { redirect } from 'next/navigation'

import { flatNavigation } from '@/config/navigation'

export default function HomePage() {
  redirect(`/docs/${flatNavigation[0].slug}`)
}
