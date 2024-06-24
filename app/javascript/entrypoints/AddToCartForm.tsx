import React, { useState, useEffect, useCallback } from 'react'
import { createRoot } from 'react-dom/client'

import { ProductT } from '../types/Product';
import { CartT } from '../types/Cart';

import { useCSRF } from '../hooks/useCSRF';

interface AddToCartFormProps {
  product: ProductT
  cart: CartT
}

export default function AddToCartForm ({
  product,
  cart
}: AddToCartFormProps) {
  const [editableCart, setEditableCart] = useState(cart);

  const [csrfToken] = useCSRF();

  const handleSave = useCallback(() => {
    return fetch(`/carts/${cart.public_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify({
        cart: {
          product_public_id: editableCart.product_public_id || product.public_id,
          add_product: true,
          redirect_after_update: true,
          ...((editableCart.variant_id || product.tiers?.length) ? { variant_id: editableCart.variant_id || product.tiers?.[0].public_id } : {})
        }
      })
    })
    .then(res => res.json())
    .then(res => {
      if (res.redirect_url) {
        window.location.href = res.redirect_url;
      }
    })
  }, [csrfToken, editableCart]);

  // if product has tiers / variants, select the first one on load
  useEffect(() => {
    if (product.tiers && product.tiers.length > 0) {
      setEditableCart({ ...editableCart, variant_id: product.tiers[0].public_id });
    }
  }, [])

  return (
    <div className="p-6 flex flex-col gap-4 max-w-96">
      <ul className='flex flex-col gap-4 w-full'>
      {product.tiers && product.tiers.map((tier) => (
        <li key={tier.public_id} className="w-full">
          <button
            className={`p-4 flex flex-col items-start gap-2 w-full border border-black rounded-md ${editableCart.variant_id === tier.public_id ? 'bg-gray-200 shadow-md' : ''}`}
            onClick={() => setEditableCart({ ...editableCart, variant_id: tier.public_id })}
          >
            <p className='text-sm'>${tier.price}</p>
            <p className='font-bold'>{tier.name}</p>
            <p className='text-sm'>{tier.description}</p>
          </button>
        </li>
      ))}
      </ul>
      <button
        type="submit"
        className="px-4 py-3 min-w-72 border border-black rounded-md bg-[#FF90E8]"
        onClick={handleSave}
      >
        Add to cart
      </button>
    </div>
  )
}

// load data from server-rendered HTML
const dataNode = document.getElementById('add-to-cart-form-data')
if (dataNode) {
  const product = JSON.parse(dataNode.getAttribute('data-product')!);
  const cart = JSON.parse(dataNode.getAttribute('data-cart')!);
  const domNode = document.getElementById('add-to-cart-form-react');
  const root = createRoot(domNode);
  root.render(<AddToCartForm product={product} cart={cart} />);
}