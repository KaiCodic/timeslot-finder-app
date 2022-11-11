require "test_helper"

class RootControllerTest < ActionDispatch::IntegrationTest
  test "should get root" do
    get root_index_path
    assert_response :success
  end
end
