export function validateCallLink (link: string) {
  let url

  try {
    url = new URL(link)
  } catch (error) {
    throw new Error('Invalid URL')
  }

  if (url.hostname !== 'cal.com' && url.hostname !== 'calendly.com') {
    throw new Error('Calendar link must be a Calendly or Cal.com meeting link')
  } else {
    return url
  }
}