import React, { useState, useEffect } from 'react'
import Cal, { getCalApi } from "@calcom/embed-react";

interface CallsWidgetProps {
  product: any
  updateProduct: (details: any) => void;
}

export function CallsWidget ({
  product,
  updateProduct
}: CallsWidgetProps) {
  const [calendlyMeetingLink, setCalendlyMeetingLink] = useState(product.call_link || '')
  const [meetingLinkUrl, setMeetingLinkUrl] = useState(null)
  const [shouldLoadCalendly, setShouldLoadCalendly] = useState(!!product.call_link)

  // handle potentially invalid urls as user types etc
  useEffect(() => {
    if (calendlyMeetingLink) {
      try {
        const link = new URL(calendlyMeetingLink)
        setMeetingLinkUrl(link)
      } catch (error) {
        setMeetingLinkUrl(null)
      }
    }
  }, [calendlyMeetingLink])

  useEffect(() => {
    if (meetingLinkUrl && meetingLinkUrl.host === 'cal.com' && shouldLoadCalendly) {
      async function loadCal () {
        const cal = await getCalApi({});
        cal("ui", {"styles":{"branding":{"brandColor":"#000000"}},"hideEventTypeDetails":false,"layout":"month_view"});
      }
      loadCal()
    }
	}, [meetingLinkUrl, shouldLoadCalendly])

  if (shouldLoadCalendly) {
    return (
      <div className='relative grow border border-black rounded-md'>
        <button
          className='py-2 px-4 absolute top-2 right-2 flex items-center gap-2 border border-black rounded-md bg-black text-white z-10'
          onClick={() => setShouldLoadCalendly(false)}
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
              src={calendlyMeetingLink}
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
        <label className="text-sm">i.e. https://calendly.com/iain-oxlc/test-gumroad-meeting</label>
        <div className="flex items-center gap-2">
          <input
            className='p-3 w-full border border-black rounded-md'
            placeholder='Enter Calendly or Cal.com meeting link'
            value={calendlyMeetingLink}
            onChange={(e) => setCalendlyMeetingLink(e.target.value)}
          />
          <button
            className='py-3 min-w-48 bg-black text-white p-2 rounded-md'
            onClick={() => {
              updateProduct({
                call_link: calendlyMeetingLink,
              })
              setShouldLoadCalendly(true)
            }}
          >
            Add calendar
          </button>
        </div>
      </div>
    )
  }
}