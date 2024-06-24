require "test_helper"

class ProductTest < ActiveSupport::TestCase
  def setup
    @product = Product.new(name: 'Test Product', native_type: 'digital')
  end
  
  test 'should generate a public_id before creating' do
    assert_nil @product.public_id
    @product.save
    assert_match(/\A\w{6}\z/, @product.public_id)
  end

  test 'should only allow valid native_type values' do
    assert_raises(ArgumentError) { @product.native_type = 'not-a-type' }
  end

  test 'should include variants as tiers in serialization' do
    @product.save
    @product.variants.create!(name: 'Variant 1', public_id: 'var123')
    product_json = ProductSerializer.new(@product).as_json
    assert_includes product_json.keys.map(&:to_s), 'tiers'
    assert_not_includes product_json.keys.map(&:to_s), 'variants'
  end

  test 'rich_content setter should store string values in db as string' do
    json_string = '{"key": "value"}'
    @product.rich_content = json_string
    @product.save
    assert_equal json_string, @product.reload.read_attribute(:rich_content)
  end
  test 'rich_content setter should store JSON values in db as string' do
    hash = { key: 'value' }
    json_string = hash.to_json
    @product.rich_content = json_string
    @product.save
    assert_equal json_string, @product.reload.read_attribute(:rich_content)
  end
  test 'rich_content getter should parse JSON strings' do
    json_string = '{"key": "value"}'
    @product.rich_content = json_string
    @product.save
    assert_equal({ 'key' => 'value' }, @product.reload.rich_content)
  end
  test 'rich_content should return an empty hash for nil values' do
    @product.rich_content = nil
    @product.save
    assert_equal({}, @product.reload.rich_content)
  end
  test 'rich_content should return an empty hash for empty string values' do
    @product.rich_content = ''
    @product.save
    assert_equal({}, @product.reload.rich_content)
  end
end
