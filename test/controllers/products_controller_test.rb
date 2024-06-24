require "test_helper"

# N.B. adding headers of root domain manually seems to be necessary for empty subdomain route constraint
class ProductsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @digital_product = products(:one)
    @coffee_product = products(:two)
  end

  test "should get index and have products grouped by category" do
    get products_url
    assert_response :success

    assert_select 'h2', 'Products'
    assert_select 'a', 'Test Product'
    assert_select 'h2', 'Services' 
    assert_select 'a', 'Coffee Product'
    assert_select 'a', 'Calls Product'
  end

  test "should update a product correctly, and not return id" do
    url = "/products/#{@coffee_product.public_id}"
    patch url, params: { product: { name: 'Updated Coffee Product' } }, as: :json, headers: { "HTTP_HOST" => "example.com" }
    assert_response :success
    json_response = JSON.parse(response.body)
    assert_nil json_response['id']
  end

  test "should update a product with rich_content correctly" do
    url = "/products/#{@coffee_product.public_id}"
    expected_rich_content = {
      "content" => [
        {
          "content" => [
            { "text" => "testing", "type" => "text" }
          ],
          "type" => "paragraph"
        }
      ],
      "type" => "doc"
    }
    patch url, params: { product: { name: 'Updated Coffee Product', rich_content: expected_rich_content } }, as: :json, headers: { "HTTP_HOST" => "example.com" }

    assert_response :success
    json_response = JSON.parse(response.body)
    assert_equal expected_rich_content, json_response['rich_content']
  end

  test "should update a product with an updated variant correctly" do
    url = "/products/#{@coffee_product.public_id}"
    patch url, params: { product: { name: 'Updated Coffee Product', tiers: [{ public_id: 'var789', name: 'Another tier', price: 100 }] } }, as: :json, headers: { "HTTP_HOST" => "example.com" }
    
    assert_response :success
    json_response = JSON.parse(response.body)
    assert_equal 'Updated Coffee Product', json_response['name']
    assert_equal 3, json_response['tiers'].count
    assert_equal 'Another tier', json_response['tiers'][2]['name']
  end

  # N.B. can't test tier data rendering as it's React without SSR
  test "should show product correctly when using subdomain" do
    get "http://test-user.example.com/l/#{@coffee_product.public_id}"
    assert_response :success
    assert_select 'h1', 'Coffee Product'
  end
end
