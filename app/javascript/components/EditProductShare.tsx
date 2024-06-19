import React from 'react'

interface EditProductShareProps {

}

export default function EditProductShare ({

}: EditProductShareProps) {
  return (
    <div className="flex w-full h-full border-t border-black">
      <form className="py-6 lg:py-12 px-4 lg:px-16 flex flex-col gap-12 w-full lg:w-2/3 border-r border-black">
        <section className="flex flex-col gap-4">
          <p>(Sharing content.)</p>
        </section>
      </form>
      
      <aside className="hidden lg:flex py-12 pl-8 pr-16 flex-col w-1/3 bg-white">
        <h2 className='text-2xl'>Preview (not implemented)</h2>
      </aside>
    </div>
  )
}