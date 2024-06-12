import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'

import CalendlyWidget from './CalendlyWidget'
import { CallsWidget } from './CallsWidget'

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

  return (
    <div className="flex flex-col grow w-full bg-white border-t border-black">
      <Navbar />
      <div
        className='py-8 px-16 flex grow gap-16 w-full'
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
        <div className='flex flex-col gap-4 w-full grow'>
          {product.native_type === 'calls' && (
            <CallsWidget
              product={product}
              updateProduct={updateProduct}
            />
          )}
          <EditorContent
            className="flex w-full grow"
            editor={editor}
          />
        </div>
      </div>
    </div>
  )
}


interface NavbarProps {
}

function Navbar ({
}: NavbarProps) {
  return (
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
    </div>
  )
}

