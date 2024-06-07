import React, { useState, useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'

import CalendlyWidget from './CalendlyWidget'

interface EditProductContentProps {
  product: any;
  updateProduct: (details: any) => void;
}

export default function EditProductContent ({
  product,
  updateProduct
}: EditProductContentProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Enter the content you want to sell. Upload your files or start typing.',
      }),
      CalendlyWidget
    ],
    content: product.rich_content,
    editorProps: {
      attributes: {
        class: 'w-full grow overflow-y-auto',
      },
    }
  })

  // update product content when editor content changes
  useEffect(() => {
    if (editor) {
      const onUpdate = () => {
        updateProduct({
          rich_content: editor.getJSON()
        })
      }
      editor.on('update', onUpdate)

      return () => {
        editor.off('update', onUpdate)
      } 
    }
  }, [editor])

  const [showCalendlyMenu, setShowCalendlyMenu] = useState(false)
  const [calendlyMeetingLink, setCalendlyMeetingLink] = useState('')
  const calendarMenuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside (e) {
      if (calendarMenuRef.current && !calendarMenuRef.current.contains(e.target)) {
        setShowCalendlyMenu(false)
      }
    }

    if (calendarMenuRef.current && showCalendlyMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [calendarMenuRef.current, showCalendlyMenu])

  return (
    <div className="flex flex-col grow w-full bg-white border-t border-black">
      <div className='p-2 flex items-center gap-1 w-full border-b border-t border-black'>
        <button className="flex flex-col items-center justify-center w-8 h-8">
          <span className="icon-bold"></span>
        </button>
        <button className="flex flex-col items-center justify-center w-8 h-8">
          <span className="icon-italic"></span>
        </button>
        <button className="flex flex-col items-center justify-center w-8 h-8">
          <span className="icon-underline"></span>
        </button>
        <button className="flex flex-col items-center justify-center w-8 h-8">
          <span className="icon-headings"></span>
        </button>
        <button className="flex flex-col items-center justify-center w-8 h-8">
          <span className="icon-code"></span>
        </button>
        <button className="flex flex-col items-center justify-center w-8 h-8">
          <span className="icon-unordered-list"></span>
        </button>
        <button className="flex flex-col items-center justify-center w-8 h-8">
          <span className="icon-ordered-list"></span>
        </button>
        <button className="flex flex-col items-center justify-center w-8 h-8">
          <span className="icon-horizontal-rule"></span>
        </button>
        <button className="flex flex-col items-center justify-center w-8 h-8">
          <span className="icon-quote"></span>
        </button>
        <button className="flex flex-col items-center justify-center w-8 h-8">
          <span className="icon-link"></span>
        </button>

        <div className="ml-4 pr-4 border-l border-black h-4 w-1"></div>

        <button className="flex flex-col items-center justify-center w-8 h-8">
          <span className="icon-image"></span>
        </button>
        <button className="flex flex-col items-center justify-center w-8 h-8">
          <span className="icon-button"></span>
        </button>
        <button className="flex flex-col items-center justify-center w-8 h-8">
          <span className="icon-upload-fill"></span>
        </button>
        <button className="flex flex-col items-center justify-center w-8 h-8">
          <span className="icon-outline-dots-circle-horizontal"></span>
        </button>

        <div className="ml-4 pr-4 border-l border-black h-4 w-1"></div>

        <button className="flex flex-col items-center justify-center w-8 h-8">
          <span className="icon-file-earmark-plus"></span>
        </button>
        <div className="relative">
          <button className="flex flex-col items-center justify-center w-8 h-8"
            onClick={() => setShowCalendlyMenu(!showCalendlyMenu)}
          >
            <span className="icon-calendar"></span>
          </button>
          {editor && showCalendlyMenu && (
            <div
              ref={calendarMenuRef}
              className='p-4 absolute top-full left-0 flex flex-col gap-4 bg-white border border-black rounded-md shadow-md z-10'
            >
              {/* <div className="flex flex-col gap-1">
                <label className="text-sm">Your personal Calendly address - i.e. <span className="text-slate-300">https://calendly.com/</span><span className="font-bold">iain-oxlc</span></label>
                <input
                  className='px-3 py-3 border border-black rounded-md'
                  placeholder='Enter Calendly user'
                  value={calendlyUser}
                  onChange={(e) => setCalendlyUser(e.target.value)}
                />
              </div>
              <input
                className='px-3 py-3 border border-black rounded-md'
                placeholder='Enter Calendly meeting name'
                value={calendlyMeeting}
                onChange={(e) => setCalendlyMeeting(e.target.value)}
              /> */}
              <div className="flex flex-col gap-1">
                <label className="text-sm">Calendly meeting link - e.g. https://calendly.com/iain-oxlc/test-gumroad-meeting</label>
                <input
                  className='px-3 py-3 border border-black rounded-md'
                  placeholder='Enter Calendly meeting link'
                  value={calendlyMeetingLink}
                  onChange={(e) => setCalendlyMeetingLink(e.target.value)}
                />
              </div>
              <button
                className='py-4 bg-black text-white p-2 rounded-md'
                onClick={() => {
                  if (!!calendlyMeetingLink) {
                    const calendlyMeetingUrl = new URL(calendlyMeetingLink)
                    const calendlyUser = calendlyMeetingUrl.pathname.split('/')[1]
                    const calendlyMeeting = calendlyMeetingUrl.pathname.split('/')[2]
                    editor.chain().focus().setCalendlyWidget(calendlyUser, calendlyMeeting).run()
                    setShowCalendlyMenu(false)
                  }
                }}
              >
                Add calendar
              </button>
            </div>
          )}
        </div>
      </div>
      <div
        className='py-8 px-16 flex grow gap-16 w-full h-0'
      >
        <div className="flex flex-col gap-4">
          <div className="p-4 flex flex-col gap-4 border border-black rounded-md">
            <label>Liked it? Give it a rating:</label>
            <textarea
              placeholder="Want to leave a written review?"
            />
            <button className="py-4 px-4 bg-black text-white rounded-md">Post review</button>
          </div>
        </div>
        <form
          id="edit-product-content-form"
          className='flex w-full grow'
        >
          <EditorContent
            className="flex w-full grow"
            editor={editor}
          />
        </form>
      </div>
    </div>
  )
}