import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Cal, { getCalApi } from "@calcom/embed-react";

interface ViewProductContentProps {
  product: any
}

export default function ViewProductContent ({
  product
}: ViewProductContentProps) {
  const linkUrl = product.call_link ? new URL(product.call_link) : null

  const editor = useEditor({
    editable: false,
    extensions: [
      StarterKit,
    ],
    content: product.rich_content,
    editorProps: {
      attributes: {
        class: 'w-full grow overflow-y-auto',
      },
    }
  })

  useEffect(() => {
    if (linkUrl && linkUrl.host === 'cal.com') {
      async function loadCal () {
        const cal = await getCalApi({});
        cal("ui", {"styles":{"branding":{"brandColor":"#000000"}},"hideEventTypeDetails":false,"layout":"month_view"});
      }
      loadCal()
    }
	}, [])

  return (
    <div className='flex flex-col gap-4 w-full grow'>
      {product.native_type === 'calls' && (
        <div className='grow border border-black rounded-md'>
          {linkUrl && linkUrl.host === 'cal.com' && (
            <Cal
              calLink={`${linkUrl.pathname}`}
              style={{ minHeight: "900px" }}
              config={{layout: 'month_view'}}
            />
          )}
          {linkUrl && linkUrl.host === 'calendly.com' && (
            <>
              <iframe
                src={product.call_link}
                width="100%"
                height="900px"
                frameBorder="0"
              />
              <script src="https://assets.calendly.com/assets/external/widget.js"></script>
            </>
          )}
        </div>
      )}
      <EditorContent
        className="flex w-full grow"
        editor={editor}
      />
    </div>
  )
}

// load data from server-rendered HTML
const productDataNode = document.getElementById('view-product-content-data')
if (productDataNode) {
  const product = JSON.parse(productDataNode.getAttribute('data-product')!);
  const domNode = document.getElementById('view-product-content-react');
  const root = createRoot(domNode);
  root.render(<ViewProductContent product={product} />);
}