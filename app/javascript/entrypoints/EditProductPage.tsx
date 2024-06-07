import React, { useState, useEffect, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import pick from 'lodash/pick'

import EditProductDetails from '../components/EditProductDetails';
import EditProductContent from '../components/EditProductContent';
import EditProductShare from '../components/EditProductShare';

import { toProductWithTiers } from '../utils/toProductWithTiers';

interface EditProductPageProps {
  product: any;
}

function EditProductPage({
  product
}: EditProductPageProps) {
  const [editedProduct, setEditedProduct] = useState(product);

  const [activePane, setActivePane] = useState(window.location.hash || '#');
  // get CSRF token
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    // N.B. would want to handle if csrf-token meta tag is missing
    const token = document.querySelector('meta[name="csrf-token"]')!.getAttribute('content');
    setCsrfToken(token);
  }, []);

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
        product: pick({ ...editedProduct, ...vals }, ['name', 'description', 'price_range', 'rich_content', 'is_published', 'tiers'])
      })
    })
  }, [csrfToken, editedProduct, product.public_id]);

  const hash = window.location.hash;

  return (
    <>
      <header className="py-12 px-16 flex flex-col gap-4 w-full" data-controller="edit-product-form">
        <div className="flex justify-between w-full">
          <h1 className="text-[40px]">{editedProduct.name}</h1>
          <div className="flex gap-4">
            {editedProduct.is_published ? (
              <>
                <button
                  className="px-4 flex flex-col items-center justify-center h-12 border border-black rounded-md bg-transparent"
                  onClick={() => {
                    handleSave({ is_published: false })
                    .then((res) => res.json())
                    .then(res => {
                      setEditedProduct(toProductWithTiers(res))
                    })
                  }}
                >Unpublish</button>
                <button
                  type="submit"
                  className="px-4 flex flex-col items-center justify-center h-12 border border-black rounded-md text-white bg-black"
                  onClick={() => {
                    handleSave()
                    .then((res) => {
                      window.location.hash = '#content';
                    })
                  }}
                >Save changes</button>
              </>
            ) : activePane === '#' ? (
              <button
                type="submit"
                className="px-4 flex flex-col items-center justify-center h-12 border border-black rounded-md text-white bg-black"
                onClick={() => {
                  handleSave()
                  .then((res) => {
                    window.location.hash = '#content';
                  })
                }}
              >Save and continue</button>
            ) : activePane === '#content' ? (
              <>
                <button
                  type="submit"
                  className="px-4 flex flex-col items-center justify-center h-12 border border-black rounded-md text-white bg-black"
                  onClick={() => {
                    handleSave()
                  }}
                >Save changes</button>
                <button
                  type="submit"
                  className="px-4 flex flex-col items-center justify-center h-12 border border-black rounded-md bg-[#FF90E8]"
                  onClick={() => {

                    handleSave({ is_published: true })
                    .then((res) => res.json())
                    .then((res) => {
                      setEditedProduct(toProductWithTiers(res))
                      window.location.hash = '#share';
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
          updateProduct={(updatedProduct) => setEditedProduct({ ...editedProduct, ...updatedProduct })}
        />
      ) : activePane === '#content' ? (
        <EditProductContent
          product={editedProduct}
          updateProduct={(updatedProduct) => setEditedProduct({ ...editedProduct, ...updatedProduct })}
        />
      ) : activePane === '#share' ? (
        <EditProductShare />
      ) : null}
    </>
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