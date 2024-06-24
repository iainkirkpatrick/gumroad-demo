import React, { useState, useEffect } from 'react'
import Cal, { getCalApi } from "@calcom/embed-react";

import { ProductT } from '../types/Product';

import { useToast } from '../hooks/useToast';

import { validateCallLink } from '../utils/validateCallLink'

interface CallsWidgetProps {
  product: ProductT
  updateProduct: (details: Partial<ProductT>) => void;
}

export function CallsWidget ({
  product,
  updateProduct
}: CallsWidgetProps) {
  const [callLink, setCallLink] = useState(product.call_link || '')
  const [meetingLinkUrl, setMeetingLinkUrl] = useState(null)
  const [shouldLoadCallEmbed, setShouldLoadCallEmbed] = useState(!!product.call_link)

  const { addToast } = useToast()

  // handle potentially invalid urls as user types etc
  useEffect(() => {
    if (callLink) {
      try {
        const link = new URL(callLink)
        setMeetingLinkUrl(link)
      } catch (error) {
        setMeetingLinkUrl(null)
      }
    }
  }, [callLink])

  useEffect(() => {
    if (meetingLinkUrl && meetingLinkUrl.host === 'cal.com' && shouldLoadCallEmbed) {
      async function loadCal () {
        const cal = await getCalApi({});
        cal("ui", {"styles":{"branding":{"brandColor":"#000000"}},"hideEventTypeDetails":false,"layout":"month_view"});
      }
      loadCal()
    }
	}, [meetingLinkUrl, shouldLoadCallEmbed])

  if (shouldLoadCallEmbed) {
    return (
      <div className='relative grow border border-black rounded-md'>
        <button
          className='py-2 px-4 absolute top-2 right-2 flex items-center gap-2 border border-black rounded-md bg-black text-white z-10'
          onClick={() => setShouldLoadCallEmbed(false)}
        >
          Edit
          <span className="icon-pencil"></span>
        </button>
        {meetingLinkUrl && meetingLinkUrl.host === 'cal.com' && (
          <Cal
            calLink={`${meetingLinkUrl.pathname}`}
            style={{ minHeight: "900px" }}
            config={{layout: 'month_view'}}
          />
        )}
        {meetingLinkUrl && meetingLinkUrl.host === 'calendly.com' && (
          <>
            <iframe
              id="iframe-calendar"
              src={callLink}
              width="100%"
              height="900px"
              frameBorder="0"
            />
            <script src="https://assets.calendly.com/assets/external/widget.js"></script>
          </>
        )}
      </div>
    )
  } else {
    return (
      <div className="p-4 flex flex-col gap-1 border border-black rounded-md">
        <label className="text-sm">Add your calendar link - e.g. https://calendly.com/iain-oxlc/test-gumroad-meeting</label>
        <form className="flex items-center gap-2">
          <input
            name="product[call_link]"
            className='p-3 w-full border border-black rounded-md'
            placeholder='Enter Calendly or Cal.com meeting link'
            value={callLink}
            onChange={(e) => setCallLink(e.target.value)}
          />
          <button
            data-testid="button-addCalendar"
            className='py-3 min-w-48 bg-black text-white p-2 rounded-md'
            onClick={(e) => {
              e.preventDefault()
              try {
                validateCallLink(callLink)

                updateProduct({
                  call_link: callLink,
                })
                setShouldLoadCallEmbed(true)
              } catch (error) {
                addToast(error.message)
              }
            }}
          >
            Add calendar
          </button>
        </form>
      </div>
    )
  }
}