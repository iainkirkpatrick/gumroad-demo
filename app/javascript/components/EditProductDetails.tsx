import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface EditProductDetailsProps {
  product: any
  updateProduct: (details: any) => void;
}

export default function EditProductDetails ({
  product,
  updateProduct
}: EditProductDetailsProps) {
  console.log({ product })

  return (
    <div className="flex w-full h-full border-t border-black">
      <form className="py-12 px-16 flex flex-col gap-12 w-2/3 border-r border-black">
        <section className="flex flex-col gap-4">
          <div className='flex flex-col gap-1'>
            <label>Name</label>
            <input
              className="py-2 px-4 border border-black rounded-md"
              placeholder="Name"
              value={product.name}
              onChange={(e) => updateProduct({ name: e.target.value })}
            />
          </div>
          <div className='flex flex-col gap-1'>
            <label>Description</label>
            <textarea
              className="py-2 px-4 border border-black rounded-md resize-none"
              placeholder="Description"
              value={product.description}
              onChange={(e) => updateProduct({ description: e.target.value })}
            />
          </div>
          {product.native_type === 'coffee' && (
            <div className='flex flex-col gap-1'>
              <label>Thanks message</label>
              <textarea
                className="py-2 px-4 border border-black rounded-md resize-none"
                placeholder="Enter a thanks message to be displayed when this product is bundled with another product."
                value={product.thanks_message}
                onChange={(e) => updateProduct({ thanks_message: e.target.value })}
              />
            </div>
          )}
        </section>
        
        {product.native_type !== 'coffee' && (
          <section className='pt-12 flex flex-col gap-4 border-t-black border-t-2'>
            <h2 className="text-2xl">Pricing</h2>
            <div className='flex flex-col gap-1'>
              <label>Amount</label>
              <input
                className="py-2 px-4 border border-black rounded-md"
                placeholder="Name"
                value={product.price_range}
                onChange={(e) => updateProduct({ price_range: e.target.value })}
              />
            </div>
          </section>
        )}


        {product.native_type === 'coffee' && (
          <section className='pt-12 flex flex-col gap-4 border-t-black border-t-2'>
            <h2 className="text-2xl">Tiers</h2>
            {product.tiers && product.tiers.map((tier: any) => (
              <Tier
                key={tier.public_id}
                tier={tier}
                updateTier={(updatedTier: any) => updateProduct({ tiers: product.tiers.map((t: any) => t.public_id === tier.public_id ? { ...t, ...updatedTier } : t) })}
              />
            ))}
            <button
              className="px-4 flex flex-col items-center justify-center h-12 bg-black text-white rounded-md"
              onClick={(e) => {
                e.preventDefault()
                updateProduct({ tiers: [...(product.tiers || []), { public_id: uuidv4(), name: 'Untitled', price: '' }] })
              }}
            >Add tier</button>
          </section>
        )}
      </form>
      
      <aside className="py-12 pl-8 pr-16 flex flex-col w-1/3 bg-white">
        <h2 className='text-2xl'>Preview (not implemented)</h2>
      </aside>
    </div>
  )
}

interface TierProps {
  tier: any
  updateTier: (details: any) => void;
}

function Tier ({
  tier,
  updateTier
}: TierProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="py-4 px-6 flex flex-col gap-4 border border-black bg-white rounded-md">
      <div className="flex items-center justify-between">
        <h3 className="text-xl">{tier.name}</h3>
        <div className="flex items-center gap-2">
          <button
            className="px-4 flex flex-col items-center justify-center h-12 border border-black rounded-md"
            onClick={(e) => {
              e.preventDefault()
              setIsOpen(!isOpen)
            }}
          >
            <span
              className="icon-outline-chevron-down"
            ></span>
          </button>
          <button
            className="px-4 flex flex-col items-center justify-center h-12 border border-black rounded-md"
          >
            <span
              className="icon-trash2"
            ></span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label>Name</label>
            <input
              className="py-2 px-4 border border-black rounded-md"
              placeholder="Name"
              value={tier.name}
              onChange={(e) => updateTier({ name: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label>Price</label>
            <input
              className="py-2 px-4 border border-black rounded-md"
              placeholder="Price"
              value={tier.price}
              onChange={(e) => updateTier({ price: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  )
}