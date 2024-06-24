import React, { useEffect, useState } from 'react'
import { useEditor, EditorContent, JSONContent } from '@tiptap/react'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'

import { ProductT } from '../types/Product'
import { TierT } from '../types/Tier'

import { CallsWidget } from './CallsWidget'

interface EditProductContentProps {
  product: ProductT;
  updateProduct: (details: Partial<ProductT>) => void;
}

export default function EditProductContent ({
  product,
  updateProduct
}: EditProductContentProps) {
  const [selectedTierId, setSelectedTierId] = useState(product.tiers && product.tiers.length > 0 && product.tiers[0].public_id)
  const selectedTier = product.tiers?.find((tier) => tier.public_id === selectedTierId)

  return (
    <div className="flex flex-col grow w-full bg-white border-t border-black">
      <Navbar
        product={product}
        selectedTier={selectedTier}
        setSelectedTierId={setSelectedTierId}
      />
      <div
        className='py-6 lg:py-8 px-4 lg:px-16 flex grow gap-16 w-full'
      >
        <div className="hidden lg:flex flex-col gap-4">
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
          <EditorWrapper
            placeholder={product.native_type === 'commissions' ? 'Let the customer know how to contact you and organise the delivery of the commissioned work.' : 'Enter the content you want to sell. Upload your files or start typing.'}
            content={selectedTier ? selectedTier.rich_content : product.rich_content}
            updateContent={(newContent: JSONContent) => {
              if (selectedTier) {
                updateProduct({
                  tiers: product.tiers?.map((tier) => tier.public_id === selectedTier.public_id ? { ...tier, rich_content: newContent } : tier)
                })
              } else {
                updateProduct({
                  rich_content: newContent
                })
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}


interface NavbarProps {
  product: ProductT;
  selectedTier: TierT | undefined
  setSelectedTierId: (id: string) => void
}

function Navbar ({
  product,
  selectedTier,
  setSelectedTierId
}: NavbarProps) {
  const [isTierSelectorOpen, setIsTierSelectorOpen] = useState(false)

  return (
    <div className='p-2 flex flex-wrap items-center justify-between gap-2 w-full border-b border-t border-black z-10'>
      <div className="flex items-center gap-1">
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
      {selectedTier && (
        <div className="relative flex items-center gap-1">
          <button
            className="px-2 py-1 flex flex-col items-center justify-center border border-black rounded-md"
            onClick={() => setIsTierSelectorOpen(!isTierSelectorOpen)}
          >
            {`Editing: ${selectedTier.name}`}
          </button>
          {isTierSelectorOpen && (
            <ul className='p-4 absolute top-full right-auto left-0 lg:right-0 lg:left-auto flex flex-col gap-4 min-w-48 border border-black rounded-md bg-white shadow-md'>
              {product.tiers?.map(tier => (
                <li key={tier.public_id} className="w-full">
                  <button
                    className={`p-4 w-full border border-black rounded-md ${selectedTier.public_id === tier.public_id ? 'bg-gray-200 shadow-md' : ''}`}
                    onClick={() => {
                      setSelectedTierId(tier.public_id)
                      setIsTierSelectorOpen(false)
                    }}
                  >
                    {tier.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

// wrapper required so that correct product / tier content is updated when selection changes
interface EditorWrapperProps {
  placeholder: string
  content: JSONContent | undefined
  updateContent: (content: JSONContent) => void
}

function EditorWrapper ({
  placeholder,
  content,
  updateContent
}: EditorWrapperProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'w-full grow overflow-y-auto',
      },
    }
  })

  // update product / tier content when editor content changes
  // and reset the editor content when the content from parent changes (i.e. selected tier changes)
  // N.B. we need to re-establish the update event listener when content changes (i.e. selected tier changes) - otherwise tiptap continues to update the previous content
  useEffect(() => {
    if (editor) {
      editor.commands.setContent(content || '')
      const onUpdate = () => updateContent(editor.getJSON())
      editor.on('update', onUpdate)

      return () => {
        editor.off('update', onUpdate)
      } 
    }
  }, [editor, content])

  return (
    <EditorContent
      className="flex w-full grow"
      editor={editor}
    />
  )
}
