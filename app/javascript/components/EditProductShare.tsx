import React from 'react'

interface EditProductShareProps {

}

export default function EditProductShare ({

}: EditProductShareProps) {
  return (
    <div className="px-16 flex w-full h-full border-t border-black">
      <form className="py-12 pr-16 flex flex-col gap-12 w-2/3 border-r border-black">
        <section className="flex flex-col gap-4">
          <p>(Sharing content.)</p>
        </section>
      </form>
      
      <aside className="py-12 flex flex-col w-1/3 bg-white">
        <h2>Preview</h2>
      </aside>
    </div>
  )
}