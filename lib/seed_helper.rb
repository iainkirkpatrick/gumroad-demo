module SeedHelper
  def self.create_products_and_variants
    # create a product of each kind
    Product.create!(native_type: "digital", name: "Digital Product", description: 'This is a digital product.', price_range: '10', rich_content: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content for this digital product."}]}]}', is_published: true)
    
    coffee = Product.create!(native_type: "coffee", name: "Coffee Product", description: 'This is a coffee product.', rich_content: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Thank you for supporting my work!"}]}]}', thanks_message: 'Thanks for supporting my work!', is_published: true)
    
    commissions = Product.create!(native_type: "commissions", name: "Commissions Product", description: 'This is a commissions product.', rich_content: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Get in touch at commissions@iainkirkpatrick.com"}]}]}', price_range: '500', is_published: true)
    
    Product.create!(native_type: "calls", name: "Calls Product", description: 'This is a calls product.', price_range: '200', rich_content: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Please book a meeting using the calendar above!"}]}]}', call_link: 'https://calendly.com/iain-oxlc/test-gumroad-meeting', is_published: true)
    
    coffee.variants.create!([
      { product_id: coffee.id, public_id: 'cof001', name: "Coffee", price: 5, description: 'This is a coffee variant.' },
      { product_id: coffee.id, public_id: 'cof002', name: "Cocktail", price: 10, description: 'This is a cocktail variant.' },
      { product_id: coffee.id, public_id: 'cof003', name: "Pizza", price: 15, description: 'This is a pizza variant.' }
    ])
    
    commissions.variants.create!([
      { product_id: commissions.id, public_id: 'com001', name: "Small Canvas", price: 500, description: "This is the small canvas tier", rich_content: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content for small canvas."}]}]}' },
      { product_id: commissions.id, public_id: 'com002', name: "Large Canvas", price: 1000, description: "This is the large canvas tier", rich_content: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content for large canvas."}]}]}' }
    ])
    
    # create a cart
    Cart.create!(public_id: 'cart001')
  end
end
