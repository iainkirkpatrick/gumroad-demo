import React, { useState, useEffect, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import pick from 'lodash/pick'

import { ProductT } from '../types/Product';

import EditProductDetails from '../components/EditProductDetails';
import EditProductContent from '../components/EditProductContent';
import EditProductShare from '../components/EditProductShare';

import { useCSRF } from '../hooks/useCSRF';

import { toProductWithTiers } from '../utils/toProductWithTiers';
import { ToastProvider, useToast } from '../hooks/useToast';

interface EditProductPageProps {
  product: ProductT;
}

function EditProductPage({
  product
}: EditProductPageProps) {
  const [editedProduct, setEditedProduct] = useState(product);

  const [activePane, setActivePane] = useState(window.location.hash || '#');
  
  const [csrfToken] = useCSRF();
  const { addToast, toasts } = useToast()

  useEffect(() => {
    const handleHashChange = () => {
      setActivePane(window.location.hash || '#');
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleSave = useCallback((vals = {}) => {
    return fetch(`/products/${product.public_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify({
        product: pick({ ...editedProduct, ...vals }, ['name', 'description', 'price_range', 'rich_content', 'is_published', 'tiers', 'call_link'])
      })
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(err => {
          // N.B. deliberately simple error handling, see toasts for UI
          throw new Error(Object.values(err).join(', '))
        })
      } else {
        return res.json()
      }
    })
  }, [csrfToken, editedProduct, product.public_id]);

  const hash = window.location.hash;

  return (
    <ToastProvider>
      <header className="relative py-6 lg:py-12 px-4 lg:px-16 flex flex-col gap-4 w-full" data-controller="edit-product-form">
        <Toaster />
        <div className="flex justify-between w-full">
          <h1 className="hidden lg:inline text-[40px]">{editedProduct.name}</h1>
          <div className="flex gap-4 w-full lg:w-auto">
            {editedProduct.is_published ? (
              <>
                <button
                  className="px-4 flex flex-col items-center justify-center w-full lg:w-auto h-12 border border-black rounded-md bg-transparent"
                  onClick={() => {
                    handleSave({ is_published: false })
                    .then(res => {
                      setEditedProduct(toProductWithTiers(res))
                    })
                    .catch(err => {
                      addToast(err.message)
                    })
                  }}
                >Unpublish</button>
                <button
                  type="submit"
                  className="px-4 flex flex-col items-center justify-center w-full lg:w-auto h-12 border border-black rounded-md text-white bg-black"
                  onClick={() => {
                    handleSave()
                    .then((res) => {
                      window.location.hash = '#content';
                    })
                    .catch(err => {
                      addToast(err.message)
                    })
                  }}
                >Save changes</button>
              </>
            ) : activePane === '#' ? (
              <button
                type="submit"
                className="px-4 flex flex-col items-center justify-center w-full lg:w-auto h-12 border border-black rounded-md text-white bg-black"
                onClick={() => {
                  handleSave()
                  .then((res) => {
                    window.location.hash = '#content';
                  })
                  .catch(err => {
                    addToast(err.message)
                  })
                }}
              >Save and continue</button>
            ) : activePane === '#content' ? (
              <>
                <button
                  type="submit"
                  className="px-4 flex flex-col items-center justify-center w-full lg:w-auto h-12 border border-black rounded-md text-white bg-black"
                  onClick={() => {
                    handleSave()
                    .catch(err => {
                      addToast(err.message)
                    })
                  }}
                >Save changes</button>
                <button
                  type="submit"
                  className="px-4 flex flex-col items-center justify-center w-full lg:w-auto h-12 border border-black rounded-md bg-[#FF90E8]"
                  onClick={() => {

                    handleSave({ is_published: true })
                    .then((res) => {
                      setEditedProduct(toProductWithTiers(res))
                      window.location.hash = '#share';
                    })
                    .catch(err => {
                      addToast(err.message)
                    })
                  }}
                >Publish and continue</button>
              </>
            ) : null}
          </div>
        </div>
        <div className="flex gap-4 w-full">
          <a
            className={`py-2 px-4 ${!hash || hash === '#' ? 'border border-black rounded-full bg-white': ''}`}
            href="#"
          >Product</a>  
          <a
            className={`py-2 px-4 ${hash === '#content' ? 'border border-black rounded-full bg-white': ''}`}
            href="#content"
          >Content</a>  
          <a
            className={`py-2 px-4 ${hash === '#share' ? 'border border-black rounded-full bg-white': ''}`}
            href="#share"
          >Share</a>  
        </div>

      </header>
      {activePane === '#' ? (
        <EditProductDetails
          product={editedProduct}
          updateProduct={(updatedProduct) => setEditedProduct((currentProduct) => ({ ...currentProduct, ...updatedProduct }))}
        />
      ) : activePane === '#content' ? (
        <EditProductContent
          product={editedProduct}
          updateProduct={(updatedProduct) => setEditedProduct((currentProduct) => ({ ...currentProduct, ...updatedProduct }))}
        />
      ) : activePane === '#share' ? (
        <EditProductShare />
      ) : null}
    </ToastProvider>
  )
}

function Toaster () {
  const { toasts } = useToast()

  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 p-4 flex flex-col">
      {toasts.map((toast) => (
        <div className="px-4 py-2 border border-black rounded-md bg-white">
          {toast}
        </div>
      ))}
    </div>
  )
}

// load data from server-rendered HTML
const productDataNode = document.getElementById('edit-product-page-data')
if (productDataNode) {
  const product = JSON.parse(productDataNode.getAttribute('data-product')!);
  const domNode = document.getElementById('edit-product-form-react');
  const root = createRoot(domNode);
  root.render(<EditProductPage product={product} />);
}