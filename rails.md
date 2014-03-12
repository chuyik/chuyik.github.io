# Rails Learning Notes
## rails commands
- rails new `demo`
- rails s
- rails g controller `welcome`
- rails g scaffold `person` `name:string bio:text birthday:date`
- rails g model `event name:string description:text is_public:boolean capacity:integer`
- rails g migration `add_status_to_events`

        class AddStatusToEvents < ActiveRecord::Migration
          def change
            add_column :events, :status, :string
          end
        end

- rails c (console)

## bundle commands
- bundle install
    > _run it when Gemfile changed_

- bundle exec rake db:create
    > _create db_

- bundle exec rake db:migrate
    > create or modify table, index, etc.

## rails routes
- #match ':controller(/:action(/:id(.:format)))', via: [:get, :post]
- get "`welcome`/`say`" => "`welcome`#`say`"

## rails helper
<%= link_to '`Hello!`', `welcome_say`\_path %>

<%= link_to '`Show`', :controller => '`events`', :action => '`show`', :id => `event` %>

<%= simple_format(@event.description) %>
> convert \n to &lt;br/>

## rails crud
    # create
    @event = Event.new(params[:event])
    event = Event.new( :name => "another ruby course", :capacity => 30)
    event.save
    event.id

    # read
    @events = Event.all
    event = Event.where( :capacity => 20 ).first
    events = Event.where( ["capacity >= ?", 20 ] ).limit(3).order("id desc")

    # update
    e = Event.find(params[:id])
    e.update_attributes( :name => 'abc', :is_public => false )

    # delete
    e.destroy

## rails validation
    class Event < ActiveRecord::Base
        validates_presence_of :name
    end

## debug
get messages from object
    Event.new.errors.full_messages

## rails log
- tail -f log/development.log

## rails skeleton
| file | usage |
|:-----:|:---:|
| app/       | 放Controllers、Models和Views檔案，接下來的內容主要都在這個目錄。 |
| config/    | 應用程式設定檔、路由規則、資料庫設定等等 |
| db/        | 資料庫的結構綱要 |
| doc/       | 用來放你的文件 |
| lib/       | 放一些自定的Module和類別檔案 |
| log/       | 應用程式的Log記錄檔 |
| public/    | 唯一可以在網路上看到的目錄，這是你的圖檔、JavaScript、CSS和其他靜態檔案擺放的地方 |
| script/    | 放rails這個指令和放其他的script指令 |
| test/      | 單元測試、fixtures及整合測試等程式 |
| tmp/       | 暫時性的檔案 |
| vendor/    | 用來放第三方程式碼外掛的目錄 |
| config.ru  | 用來啟動應用程式的Rack伺服器設定檔 |
| Gemfile    | 設定Rails應用程式會使用哪些Gems套件 |
| README     | 專案說明：你可以用來告訴其他人你的應用程式是做什麼用的，如何使用等等。 |
| Rakefile   | 用來載入可以被命令列執行的一些Rake任務 |

## gem
gem "kaminari"
    
    <%= paginate @events %>

----------------------
## tips
- invalid multibyte char (US-ASCII)
    
    >    \# encoding: utf-8