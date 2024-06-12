import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { v4 as uuidv4 } from 'uuid'

import { useCSRF } from '../hooks/useCSRF'

interface ProductButtonProps {
  title: string
  content: string
  onClick?: (e: React.MouseEvent) => void
  isSelected: boolean
}

function ProductButton ({
  title,
  content,
  onClick,
  isSelected
}: ProductButtonProps) {
  return (
    <button
      className={`p-4 flex flex-col items-start border border-black rounded-md ${isSelected ? 'bg-white' : ''}`}
      style={isSelected ? { boxShadow: "4px 4px" } : {}}
      onClick={onClick ? onClick : (e) => e.preventDefault()}
    >
      <h4 className='font-bold text-left'>{title}</h4>
      <p className="text-sm text-left">{content}</p>
    </button>
  )
}

function NewProductForm() {
  const [productType, setProductType] = useState('digital')

  const [csrfToken] = useCSRF();

  return (
    <form
      id="new-product-form"
      className='flex flex-col gap-8'
      action="/products"
      method="POST"
    >
      {/* CSRF */}
      <input type="hidden" name="authenticity_token" value={csrfToken} />
      <div className='flex flex-col gap-1'>
        <label>Name</label>
        <input
          name="product[name]"
          className="py-2 px-4 border border-black rounded-md"
          placeholder='Name of product'
        />
      </div>

      {/* hidden input for product type selection */}
      <input type="hidden" name="product[native_type]" value={productType} />
      <div className='flex flex-col gap-1'>
        <label className="font-bold">Products</label>
        <div className='grid grid-cols-3 gap-4'>
          <ProductButton
            title='Digital product'
            content="Any set of files to download or stream."
            onClick={(e) => {
              e.preventDefault()
              setProductType('digital')
            }}
            isSelected={productType === 'digital'}
          />
          <ProductButton
            title='Course or tutorial'
            content="Sell a single lesson or teach a whole cohort of students."
            isSelected={productType === 'course'}
          />
          <ProductButton
            title='E-book'
            content="Sell a single lesson or teach a whole cohort of students."
            isSelected={productType === 'ebook'}
          />
          <ProductButton
            title='Membership'
            content="Start a membership business around your fans."
            isSelected={productType === 'membership'}
          />
          <ProductButton
            title='Physical good'
            content="Sell anything that requires shipping something."
            isSelected={productType === 'course'}
          />
          <ProductButton
            title='Bundle'
            content="Sell two or more existing products for a new price"
            isSelected={productType === 'ebook'}
          />
        </div>
      </div>
      <div className='flex flex-col gap-1'>
        <label className="font-bold">Services</label>
        <div className='grid grid-cols-3 gap-2'>
          <ProductButton
            title='Coffee'
            content="Boost your support and accept tips from customers."
            onClick={(e) => {
              e.preventDefault()
              setProductType('coffee')
            }}
            isSelected={productType === 'coffee'}
          />
          <ProductButton
            title='Commissions'
            content="Sell unique tailored work or services to your customers."
            onClick={(e) => {
              e.preventDefault()
              setProductType('commissions')
            }}
            isSelected={productType === 'commissions'}
          />
          <ProductButton
            title='Calls'
            content="Offer scheduled calls with your customers."
            onClick={(e) => {
              e.preventDefault()
              setProductType('calls')
            }}
            isSelected={productType === 'calls'}
          />
        </div>
      </div>

      {productType === 'coffee' || productType === 'commissions' ? (
        <div className='flex flex-col gap-1'>
          <label>Price</label>
          <input
            name="product[tiers][0][price]"
            className="py-2 px-4 border border-black rounded-md"
            placeholder='Price your product'
          />
          {/* hidden input for generated tier public_id */}
          <input type="hidden" name="product[tiers][0][public_id]" value={uuidv4()} />
          {/* hidden input for generated tier name */}
          <input type="hidden" name="product[tiers][0][name]" value="Untitled" />
        </div>
      ) : (
        <div className='flex flex-col gap-1'>
          <label>Price</label>
          <input
            name="product[price_range]"
            className="py-2 px-4 border border-black rounded-md"
            placeholder={productType === 'commissions' ? 'Price your initial deposit' : 'Price your product'}
          />
        </div>
      )}
    </form>
  )
}

const domNode = document.getElementById('new-product-form-react');
const root = createRoot(domNode);
root.render(<NewProductForm />);