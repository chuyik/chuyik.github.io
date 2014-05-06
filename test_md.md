* Rails测试
    * 生成集成测试
    ```
    rails generate integration_test static_pages
    ```

    * 把 Capybara DSL 加入 RSpec 帮助文件
      * _spec/spec_helper.rb_
    ```
    RSpec.configure do |config|
      ...
      config.include Capybara::DSL
    end
    ```
    
    * 配置测试用例
    ```
    describe "Home page" do

      it "should have the content 'Sample App'" do
        visit '/static_pages/home' #visit: Capybara的函数
        expect(page).to have_content('Sample App') #page: Capybara的变量
      end
    end
    ```
