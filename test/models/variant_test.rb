require "test_helper"

class VariantTest < ActiveSupport::TestCase
  setup do
    @product = products(:one)
    @variant = @product.variants.build(public_id: 'var123', name: 'MyString', price: '23', description: 'Tier 1')
  end

  test 'should be valid with valid attributes' do
    assert @variant.valid?
  end

  test 'should require a product' do
    @variant.product = nil
    assert_not @variant.valid?
    assert_includes @variant.errors[:product], "must exist"
  end

  test 'should belong to a product' do
    assert_equal @product, @variant.product
  end  
end
