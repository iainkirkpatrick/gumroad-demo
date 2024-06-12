import React, { useState, useCallback } from 'react'
import { createRoot } from 'react-dom/client'

import { useCSRF } from '../hooks/useCSRF';

interface CheckoutPageProps {
  cart: any;
}

function CheckoutPage({
  cart
}: CheckoutPageProps) {
  const [editableCart, setEditableCart] = useState(cart);
  const [purchases, setPurchases] = useState([]);
  
  const [csrfToken] = useCSRF();

  const handleRemoveItem = useCallback((productPublicId) => {
    return fetch(`/carts/1`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify({
        cart: {
          product_public_id: productPublicId,
          add_product: false,
          redirect_after_update: false
        }
      })
    })
    .then(res => res.json())
    .then(res => {
      setEditableCart({ ...editableCart, cart_items: editableCart.cart_items.filter(ci => ci.product.public_id !== productPublicId) })
    })
  }, [csrfToken]);

  const handlePay = useCallback(() => {
    return fetch(`/purchases`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify({
        purchase: {
          product_public_ids: editableCart.cart_items.map(ci => ci.product.public_id) 
        } 
      })
    })
    .then(res => res.json())
    .then(res => {
      setPurchases(res)
    })
  }, [csrfToken]);

  const total = editableCart.cart_items.reduce((acc, curr) => {
    if (curr.variant_id) {
      return acc + parseInt(curr.product.variants.find(v => v.id === curr.variant_id).price)
    } else {
      return acc + parseInt(curr.product.price_range)
    }
  }, 0);

  console.log({ editableCart })

  if (purchases.length > 0) {
    return (
      <Success
        editableCart={editableCart}
        purchases={purchases}
      />
    )
  } else {
    return (
      <div className="py-16 flex gap-16">
        <div className="flex flex-col grow border border-black rounded-md bg-white">
          {editableCart && editableCart.cart_items.map((cartItem: any, i: number) => {
            // if coffee, render a border and description or placeholder message
            if (cartItem.product.native_type === 'coffee') {
              return (
                <div key={cartItem.product.public_id} className='p-4 flex flex-col gap-4 border-b border-black'>
                  <p>{cartItem.product.thanks_message || 'Thank you for supporting my work!'}</p>
                  <div className="flex flex-col grow border border-black rounded-md bg-white">
                    <CartItem
                      cartItem={cartItem}
                      handleRemoveItem={handleRemoveItem}
                      updateCartItem={(newCartItem) => setEditableCart({ ...editableCart, cart_items: editableCart.cart_items.map(ci => ci.product.public_id === cartItem.product.public_id ? newCartItem : ci) })}
                    />
                  </div>
                </div>
              )
            } else {
              return (
                <CartItem
                  key={cartItem.product.public_id}
                  cartItem={cartItem}
                  handleRemoveItem={handleRemoveItem}
                  updateCartItem={cartItem.product.variants.length > 0 ? (newCartItem) => setEditableCart({ ...editableCart, cart_items: editableCart.cart_items.map(ci => ci.product.public_id === cartItem.product.public_id ? newCartItem : ci) }) : undefined}
                />
              )
            }
          })}
          <div className='p-4 flex items-center justify-between'>
            <p className='text-xl'>Total</p>
            <p className='text-xl'>${total}</p>
          </div>
        </div>
        <div className="flex flex-col min-w-96 border border-black rounded-md bg-white">
          <div className="p-4 flex flex-col border-b border-black">
            <p>DEMO!</p>
          </div>
          <div className="p-4 flex flex-col">
            <button
              className="px-4 py-3 bg-black text-white rounded-md"
              onClick={() => handlePay()}
            >Pay</button>
          </div>
        </div>
      </div>
    )
  }
}


interface CartItemProps {
  cartItem: any;
  handleRemoveItem: (publicId: string) => void;
  updateCartItem?: (cartItem: any) => void;
}

function CartItem ({
  cartItem,
  handleRemoveItem,
  updateCartItem
}: CartItemProps) {
  const [isConfigureOpen, setIsConfigureOpen] = useState(false);

  const selectedVariant = cartItem.product.variants.find(v => v.id === cartItem.variant_id);

  return (
    <div className="flex border-b border-black">
      <img className="w-32 h-32" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBmaWxsPSIjRkY5MEU4IiBkPSJNMCAwaDIwMHYyMDBIMHoiLz48cGF0aCBkPSJNNDMuOTggMTYxLjc1aDk0LjYxN3YtLjk1bC4wMDQuOTVjMy41NDItLjAxNCA2Ljk3OC0xLjI5MyA5Ljg1MS0zLjYzNyAyLjg3LTIuMzQzIDUuMDQyLTUuNjM2IDYuMjQ3LTkuNDI1bC4wMDEtLjAwNCAxNy40MS01NS40NTFhMjIuOTE2IDIyLjkxNiAwIDAgMCAuOTAyLTkuMzQ5Yy0uMzQ4LTMuMTUzLTEuMzQxLTYuMTctMi45MDUtOC43OTMtMS41NjQtMi42MjMtMy42NTYtNC43ODItNi4xMDgtNi4yNzktMi40NTQtMS40OTgtNS4xOTItMi4yODYtNy45OC0yLjI4NmgtMS41MDdjLS4xODMtNC45MjQtMS45MzUtOS42MjQtNC45NTYtMTMuMTU4LTMuMTk2LTMuNzM5LTcuNTY0LTUuODc4LTEyLjE1OC01Ljg4M0g5My4wNzNjLTMuMjY2LTQuNzg3LTcuOTg0LTguMDA3LTEzLjI0Ny04Ljk0OWwtLjA4My0uMDE1aC0uMDU4YTE4LjM5OCAxOC4zOTggMCAwIDAtMy4xMzgtLjI3MUg2MC4yNzFjLTMuMjY0IDAtNi40NzYuODgxLTkuMzg1IDIuNTY1LTIuNzY3IDEuNjAyLTUuMTg1IDMuODg3LTcuMDkzIDYuNjgtNC41MjYuMDYzLTguODIgMi4xOTQtMTEuOTcyIDUuODgzLTMuMTkyIDMuNzM0LTQuOTY3IDguNzctNC45NzIgMTMuOTk3djc0LjQ5MWMuMDA1IDUuMjI3IDEuNzggMTAuMjYzIDQuOTcyIDEzLjk5OSAzLjE5NSAzLjczOSA3LjU2MyA1Ljg3OSAxMi4xNTggNS44ODZaIiBmaWxsPSIjRkY5MEU4IiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS45Ii8+PHBhdGggZD0iTTE1OC41NiA4MS4wNzZhMy42MyAzLjYzIDAgMCAxIDEuOTA0LjU0NWMuNTg4LjM2IDEuMDkzLjg4IDEuNDczIDEuNTE4LjM3OS42MzguNjIxIDEuMzc0LjcwNiAyLjE0NWE1LjYyNiA1LjYyNiAwIDAgMS0uMjIxIDIuMjg1bC0xOC4wMyA1Ny41NjZjLS4yOTIuOTI3LS44MTkgMS43MjgtMS41MSAyLjI5My0uNjkxLjU2Ni0xLjUxMy44NjktMi4zNTYuODY5aC0xLjI2NGMuNTQxIDAgMS4wNzctLjEyNSAxLjU3Ni0uMzY4LjUtLjI0My45NTMtLjU5OSAxLjMzNS0xLjA0Ny4zODMtLjQ0OS42ODYtLjk4Mi44OTItMS41NjhhNS41NDYgNS41NDYgMCAwIDAgLjMxMi0xLjg1VjgxLjA3NmgxNS4xODNabS00Mi40MjkgMjcuMDhhLjExNi4xMTYgMCAwIDEgMCAuMDg2bC02LjQxNCAxMS4zNzhhLjEwMi4xMDIgMCAwIDEtLjA1MS4wNDcuMDkxLjA5MSAwIDAgMS0uMDQuMDEuMDk1LjA5NSAwIDAgMS0uMDQtLjAxbC0yMS41NjMtMTIuNjczLTQuMDczIDE3LjE0YS4xMDQuMTA0IDAgMCAxLS4wMy4wNTYuMTAzLjEwMyAwIDAgMS0uMDU4LjAyNi4wOTcuMDk3IDAgMCAxLS4wNi0uMDEuMS4xIDAgMCAxLS4wNDUtLjA0MmwtMjIuMzY4LTM5LjQ0YS4xMDUuMTA1IDAgMCAxIC4wMzYtLjE0Ni4wOTguMDk4IDAgMCAxIC4wNTMtLjAxM2w0NC41OTItLjEwNGEuMTA0LjEwNCAwIDAgMSAuMS4wNjYuMTEuMTEgMCAwIDEtLjAyNS4xMTlsLTExLjgzIDExLjI3IDIxLjc3OCAxMi4xNzVjLjAyLjAxNy4wMzMuMDM5LjAzOC4wNjVaIiBmaWxsPSIjMDAwIi8+PHBhdGggZD0iTTEzOS4yODMgMTQ4LjI5N2MuNTQxIDAgMS4wNzctLjEyNSAxLjU3Ni0uMzY4LjUtLjI0My45NTMtLjU5OSAxLjMzNi0xLjA0Ny4zODItLjQ0OS42ODUtLjk4Mi44OTEtMS41NjhhNS41NDYgNS41NDYgMCAwIDAgLjMxMi0xLjg1VjY2LjEzN2E1LjUzNiA1LjUzNiAwIDAgMC0uMzEyLTEuODQ4IDQuOTQ1IDQuOTQ1IDAgMCAwLS44OTItMS41NjcgNC4xMzYgNC4xMzYgMCAwIDAtMS4zMzUtMS4wNDcgMy41OTIgMy41OTIgMCAwIDAtMS41NzYtLjM2Nkg4NC40NDljMC0yLjI4Ni0uNjk2LTQuNDk3LTEuOTYtNi4yMzUtMS4yNjYtMS43MzktMy4wMTktMi44OS00Ljk0My0zLjI0OGE3LjIzIDcuMjMgMCAwIDAtMS4yNjQtLjExNEg1OS40MzZjLTIuMTY5IDAtNC4yNSAxLjAxMS01Ljc4MyAyLjgxMS0xLjUzNCAxLjgtMi4zOTYgNC4yNDEtMi4zOTYgNi43ODZoLTguNjcxYTMuNTkgMy41OSAwIDAgMC0xLjU3Ni4zNjZjLS41LjI0My0uOTUzLjU5OC0xLjMzNSAxLjA0N2E0Ljk1MiA0Ljk1MiAwIDAgMC0uODkyIDEuNTY3IDUuNTU3IDUuNTU3IDAgMCAwLS4zMTIgMS44NDh2NzcuMzI3YzAgLjYzNS4xMDUgMS4yNjMuMzEyIDEuODVhNC45NiA0Ljk2IDAgMCAwIC44OTIgMS41NjhjLjM4Mi40NDguODM2LjgwNCAxLjMzNSAxLjA0Ny41LjI0MyAxLjAzNS4zNjggMS41NzYuMzY4aDEuNzgxIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS45IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMTQzLjM5OCA4MS4wNzZoMTUuMTYyYTMuNjMgMy42MyAwIDAgMSAxLjkwNC41NDVjLjU4OC4zNiAxLjA5My44OCAxLjQ3MyAxLjUxOC4zNzkuNjM4LjYyMSAxLjM3NC43MDYgMi4xNDVhNS42MjYgNS42MjYgMCAwIDEtLjIyMSAyLjI4NWwtMTguMDMgNTcuNTY2Yy0uMjkyLjkyNy0uODE5IDEuNzI4LTEuNTEgMi4yOTMtLjY5MS41NjYtMS41MTMuODY5LTIuMzU2Ljg2OUg0NC4zNjciIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxLjkiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0xMDkuNjY2IDExOS42NjdhLjA5MS4wOTEgMCAwIDEtLjA0LjAxLjA5NS4wOTUgMCAwIDEtLjA0LS4wMWwtMjEuNTYzLTEyLjY3My00LjA3MyAxNy4xNGEuMTA0LjEwNCAwIDAgMS0uMDMuMDU2LjEwMy4xMDMgMCAwIDEtLjA1OC4wMjYuMDk3LjA5NyAwIDAgMS0uMDYtLjAxLjEuMSAwIDAgMS0uMDQ1LS4wNDJsLTIyLjM2OC0zOS40NGEuMTA1LjEwNSAwIDAgMSAuMDM2LS4xNDYuMDk4LjA5OCAwIDAgMSAuMDUzLS4wMTNsNDQuNTkyLS4xMDRhLjEwNC4xMDQgMCAwIDEgLjEuMDY2LjExLjExIDAgMCAxLS4wMjUuMTE5bC0xMS44MyAxMS4yNyAyMS43NzggMTIuMTc1YS4xMTEuMTExIDAgMCAxIC4wNTEuMDY1Yy4wMS4wMjcuMDEuMDU4IDAgLjA4NmwtNi40MjcgMTEuMzc4YS4xMDIuMTAyIDAgMCAxLS4wNTEuMDQ3WiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEuOSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+" />
      <div className="p-4 flex justify-between w-full">
        <div className="flex flex-col justify-between">
          <p className="font-bold">{cartItem.product.name}</p>
          <div className='flex gap-4'>
            <p className="text-sm"><span className="font-bold">Qty: </span>1</p>
            {selectedVariant.name && <p className="text-sm"><span className="font-bold">Variant: </span>{selectedVariant.name}</p>}
          </div>
        </div>
        <div className="flex flex-col items-end justify-between">
          {cartItem.variant_id ? (
            <p>${selectedVariant.price}</p>
          ) : (
            <p>${cartItem.product.price_range}</p>
          )}
          <div className='flex gap-4'>
            {cartItem.product.variants && updateCartItem && (
              <div className="relative">
                <button
                  className="text-sm underline"
                  onClick={() => setIsConfigureOpen(!isConfigureOpen)}
                >Configure</button>
                {isConfigureOpen && (
                  <div className='p-4 absolute top-full flex flex-col gap-4 min-w-96 border border-black rounded-md bg-white shadow-md'>
                    {cartItem.product.variants.map(variant => (
                      <button className={`p-4 flex flex-col items-start gap-2 border border-black rounded-md ${selectedVariant.id === variant.id ? 'bg-gray-200 shadow-md' : ''}`}>
                        <p className='text-sm'>${variant.price}</p>
                        <p className='font-bold'>{variant.name}</p>
                      </button>
                    ))}
                    <button
                      className='px-4 py-3 w-full border border-black rounded-md bg-[#FF90E8]'
                      onClick={() => updateCartItem({ ...cartItem, variant_id: selectedVariant.id })}
                    >Save changes</button>
                  </div>
                )}
              </div>
            )}
            <button
              type="submit"
              className="text-sm underline"
              onClick={() => handleRemoveItem(cartItem.product.publicId)}
            >Remove</button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface SuccessProps {
  editableCart: any;
  purchases: any;
}

function Success ({
  editableCart,
  purchases
}: SuccessProps) {
  return (
    <div className="py-16 flex flex-col items-center">
      <div className="flex flex-col bg-white border border-black rounded-md min-w-96">
        <div className='p-4 flex flex-col items-center border-b border-black'>
          <p className='font-bold'>Checkout</p>
        </div>
        <div className='p-8 flex flex-col items-center border-b border-black'>
          <p className='text-2xl'>Your purchase was successful!</p>
        </div>
        {editableCart && editableCart.cart_items.map((cartItem: any, i: number) => (
          <div className={`p-4 flex flex-col items-center gap-4 ${i !== editableCart.cart_items.length - 1 ? 'border-b border-black' : ''}`}>
            <div className='flex justify-between w-full'>
              <p className='font-bold'>{cartItem.product.name}</p>
              <p>${cartItem.variant_id ? cartItem.product.variants.find(v => v.id === cartItem.variant_id).price : cartItem.product.price_range}</p>
            </div>
            <a
              target='_blank'
              className='px-4 py-3 flex flex-col items-center w-full border border-black rounded-md bg-[#FF90E8]' 
              href={`/d/${purchases.find(p => p.product_id === cartItem.product.id).public_id}`}
            >View content</a>
          </div>
        ))}
      </div>
    </div>
  )
}

// load data from server-rendered HTML
const checkoutDataNode = document.getElementById('checkout-page-data')
if (checkoutDataNode) {
  const cart = JSON.parse(checkoutDataNode.getAttribute('data-checkout')!);
  const domNode = document.getElementById('checkout-page-react');
  const root = createRoot(domNode);
  root.render(<CheckoutPage cart={cart} />);
}