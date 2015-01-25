[Adobe Brackets](http://brackets.io/ "Brackets - A modern, open source code editor that understands web design.") 是一个现代的 Web 开发编辑器，拥有着众多插件和粉丝。
Brackets 虽说由 Adobe 开发，但它却是开源且免费的。其开发语言为 JavaScript，因此迭代非常迅速。
虽说 Brackets 插件众多，却有一款至今找不着，所以便有了今天这篇文章。
<!-- more -->

## 从 Sublime 到 Brackets
之前我一直在用 [Sublime Text](http://www.sublimetext.com/)，它有着更多优秀的插件。但其实 Sublime 本身可定制的地方并不多，这很大程度上影响了插件功能的拓展。其次它并不针对于 Web 开发，所以当起 Web IDE 的角色来，还是比 Brackets 更逊色一些。要说最糟糕的是，Sublime 的更新已几乎停滞，与 Brackets 的「每月至少一个新特性」形成鲜明的对比。
因此我这次把 Brackets 从软件堆里拿出来，再对它审视了一番。发现插件比以前更丰富了，而且有些功能还蛮赞的。
只可惜 Brackets 的 Snippets 功能不如 Sublime 的强大，所以我写了一个插件来增强它（叫 `Brackets Snippets`，源码在 [Github](https://github.com/chuyik/brackets-snippets)）。
而下面的入门教程，主要是基于这个插件（代码结构基本一致）。

## 写一个简单插件
我们先从一个简单的插件入手，了解一些基本信息。

### 本地创建一些文件
首先打开 Brackets，点击菜单的 `Help > Show Extensions Folder`，打开插件所在的目录。进入 `user` 子目录，创建一个新文件夹，叫 `hello-my-world`，然后创建两个文件，分别名为 `main.js` 和 `package.json`。注意文件名是固定的。 

`main.js`: 插件启动时运行的代码文件
`package.json`: 插件的元信息

 最终文件结构如下：
<pre class="tree">
├── hello-my-world/
│   ├── main.js
│   ├── package.json
</pre>

### package.json 基本结构
这个文件保存的是插件的元信息，包括插件名称、描述、作者信息、协议等。
内容如下： 

```json
{
  "name": "hello-my-world",
  "title": "Hello My World",
  "description": "My first brackets extension, impressive!",
  "homepage": "https://github.com/yourname/yourproject",
  "version": "1.0.0",
  "author": "Your Name <your@email> (http://your.url)",
  "license": "MIT",
  "engines": {
  "brackets": ">=0.24.0"
  }
}
```

其中必填的字段为 `name` 和 `version`，详细规则见 [Extension package format](https://github.com/adobe/brackets/wiki/Extension-package-format#packagejson-format "Extension package format")。

### main.js 基本结构
这个文件在 Brackets 启动时会被自动加载，是插件运行的入口。
它的基本结构为：

```javascript
/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window, Mustache */

define(function (require, exports, module) {
  "use strict";
  var AppInit = brackets.getModule("utils/AppInit");

  // Brackets 初始化完成
  AppInit.appReady(function () {
    // Brackets 启动完毕后运行的代码
    console.log('Hello World');
    window.alert('Hello My World');
  });
});
```

> 全局变量
> 
从上面的代码可以看出，我们有几个全局变量可以使用，分别是：
`define`: 表示定义一个插件模块，来源于 [RequireJS](http://requirejs.org/ "RequireJS")
`$`: jQuery 对象，用于操纵 DOM 元素
`brackets`: 用来访问软件中的其他模块，软件运行环境（系统语言、系统平台），软件版本等信息
`window`: 浏览器全局对象
`Mustache`: 模板语言，详细可以参考 [Mustache](https://github.com/janl/mustache.js)

### 运行插件
编辑保存好 main.js 和 package.json 后，点击菜单的 `Debug > Reload With Extensions`（CMD+R / CTRL+R）来重新加载 Brackets 以运行最新的代码，如果弹出了一个 "Hello My World" 的对话框，则测试成功。

### 调试（Debug）插件
点击菜单的 `Debug > Show Developer Tools`，会弹出一个似曾相识的调试窗口。可以点击 `Sources ` 选项卡进行断点调试，也可以点击 `Console` 选项卡直接运行些代码。
值得注意的是，当你第一次打开调试窗口，请务必点击右上角的设置按钮，选中 `Disable cache (while DevTools is open)`，确保没有缓存的干扰。

## 实现一个插入皮卡丘图形的插件
了解基本的信息过后，我们可以尝试写一个插件，实现一个功能：
在文档某个位置插入皮卡丘的 ASCII 立体图。
> [ASCII 立体图](http://zh.wikipedia.org/wiki/ASCII%E7%AB%8B%E4%BD%93%E5%9B%BE)
> 
> 听到这个名字，或许会觉得陌生吧？
> 但其实这个东西在互联网上很常见啦，它是「火星文」、「颜文字」的鼻祖，主要通过字符排列引起视觉上的错觉。
> 
> 喂喂下面这些字符你看破了嘛？
> ```
>   _|_|_|  _|    _|  _|_|_|    _|_|_|_|  _|_|_|
> _|        _|    _|  _|    _|  _|        _|    _|
>   _|_|    _|    _|  _|_|_|    _|_|_|    _|_|_|
>       _|  _|    _|  _|        _|        _|    _|
> _|_|_|      _|_|    _|        _|_|_|_|  _|    _|
> 
> _|      _|    _|_|    _|_|_|    _|_|_|    _|_|
> _|_|  _|_|  _|    _|  _|    _|    _|    _|    _|
> _|  _|  _|  _|_|_|_|  _|_|_|      _|    _|    _|
> _|      _|  _|    _|  _|    _|    _|    _|    _|
> _|      _|  _|    _|  _|    _|  _|_|_|    _|_|
> ```

这部分我们另起炉灶，创建一个新的插件，叫 `ascii-pokemon`。

目录结构如下：
<pre class="tree">
├── ascii-pokemon/
│   ├── main.js
│   ├── package.json
│   ├── pikachu.txt
</pre>

### package.json
这里提供一些必要字段，其他字段可以参考前面的介绍。
```json
{
  "name": "ascii-pokemon",
  "title": "ASCII Pokemon",
  "version": "1.0.0"
}
```

### pikachu.txt
`pikachu` 是什么东西？其实就是皮卡丘的英文名字啦！
我们利用这个文件，存储皮卡丘的图形。
把下面这个复制进去（来源于[这个网站](http://www.fiikus.net/?pokedex)，有第一代的所有宠物）：
```
                                             ,-.
                                          _.|  '
                                        .'  | /
                                      ,'    |'
                                     /      /
                       _..----""---.'      /
 _.....---------...,-""                  ,'
 `-._  \                                /
     `-.+_            __           ,--. .
          `-.._     .:  ).        (`--"| \
               7    | `" |         `...'  \
               |     `--'     '+"        ,". ,""-
               |   _...        .____     | |/    '
          _.   |  .    `.  '--"   /      `./     j
         \' `-.|  '     |   `.   /        /     /
         '     `-. `---"      `-"        /     /
          \       `.                  _,'     /
           \        `                        .
            \                                j
             \                              /
              `.                           .
                +                          \
                |                           L
                |                           |
                |  _ /,                     |
                | | L)'..                   |
                | .    | `                  |
                '  \'   L                   '
                 \  \   |                  j
                  `. `__'                 /
                _,.--.---........__      /
               ---.,'---`         |   -j"
                .-'  '....__      L    |
              ""--..    _,-'       \ l||
                  ,-'  .....------. `||'
               _,'                /
             ,'                  /
            '---------+-        /
                     /         /
                   .'         /
                 .'          /
               ,'           /
             _'....----""""" mh
```

### 读取外部静态文档
如果想在代码中读取一些 `json` 或者 `txt` 文档的内容，就可以使用 `require` 方法。
由于内置的第三方依赖管理工具是 `RequireJS`，所以在读取文本的时候，要在路径前加上 `text!` 的前缀。

使用 `require` 读取静态文档内容：
```javascript
var pikachu = require('text!pikachu.txt');
```

整合前面提及的 `main.js` 基本结构后，最新的代码为：
```javascript
/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window, Mustache */

define(function (require, exports, module) {
  "use strict";

  var AppInit  = brackets.getModule('utils/AppInit'),
      pikachu  = require('text!pikachu.txt');

  AppInit.appReady(function () {
    console.log(pikachu);
  });
});
```
保存完后，打开调试窗口，重新加载一下 Brackets（CMD+R / CTRL+R），就会看到调试窗口中出现了皮卡丘可爱的身影。
只可惜如果想再召唤出皮卡丘，就只能再加载一次 Brackets。这未免太坑爹了吧？
为了可以无限使用精灵球，我们可以把「召唤」这个命令写进菜单里，这样就可以随召随到啦！
为了达到这个目的，我们来了解下 Brackets 的菜单。

### 添加菜单命令
Brackets 菜单模块叫做 `Menus`，可以通过 `brackets.getModule("command/Menus")` 获得。
菜单对象分为「菜单栏的菜单 Menu」和「右键菜单 ContextMenu」，每个对象都有一个固定的 ID。

菜单栏上可以看到有 `File/Edit/...` 等菜单对象，它们的 ID 分别是：

>- File `FILE_MENU`
- Edit `EDIT_MENU`
- Find `FIND_MENU`
- View `VIEW_MENU`
- Navigate `NAVIGATE_MENU`
- Help `HELP_MENU`

而右键菜单主要根据点击的区域而不同，这些区域和菜单对象 ID 分别是：

>- 文本编辑区域 `EDITOR_MENU`
- 行内编辑区域 `INLINE_EDITOR_MENU`（即点击 `Quick Edit` 后出现的编辑区域）
- 文件目录树区域 `PROJECT_MENU`
- 已打开的文件区域 `WORKING_SET_CONTEXT_MENU`（即「文件目录树」上方区域）
- 点击排序按钮出现的菜单 `WORKING_SET_CONFIG_MENU`（即「已打开的文件区域」右上角按钮）
- 点击分割视图按钮出现的菜单 `SPLITVIEW_MENU`（即「已打开的文件区域」右上角按钮）

若想要完成「添加自定义菜单，点击菜单时完成某个指令」的操作，需要调用以下三个方法：
> 1. [CommandManager.register(name, id, commandFn)](http://brackets.io/docs/current/modules/command/CommandManager.html#-register) 注册某个指令，以便于和菜单进行绑定。
2. [Menus.getMenu(menuId)](http://brackets.io/docs/current/modules/command/Menus.html#-getMenu) 提供上面提到的菜单 ID，获取相对应的菜单对象。
3. [menu.addMenuItem(commandID, keyBindings)](http://brackets.io/docs/current/modules/command/Menus.html#Menu-addMenuItem) 将已注册的指令 ID 添加到某个菜单对象去。

具体实现的代码：
```javascript
/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window, Mustache */

define(function (require, exports, module) {
  "use strict";

  var AppInit        = brackets.getModule('utils/AppInit'),
      CommandManager = brackets.getModule("command/CommandManager"),
      Menus          = brackets.getModule("command/Menus"),
      pikachu        = require('text!pikachu.txt');

  // 菜单点击时执行的函数
  function commandHandler () {
    console.log(pikachu);
  }

  // 命令 ID（注意要唯一）
  var COMMAND_ID = "ascii-pokemon.pikachu";
  // 注册命令（提供三个参数，分别为：用于显示的命令名称、命令 ID、回调函数）
  CommandManager.register("召唤皮卡丘", COMMAND_ID, commandHandler);

  // `Edit` 菜单对象
  var menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
  // 文本编辑区域的右键菜单对象
  var contextMenu = Menus.getContextMenu(Menus.ContextMenuIds.EDITOR_MENU);

  // 把命令添加到菜单去
  menu.addMenuItem(COMMAND_ID);
  contextMenu.addMenuItem(COMMAND_ID);

  AppInit.appReady(function () {
    // 留空
  });
});
```

保存文件之后，需要重新加载 Brackets。加载完毕后，你会发现 `Edit` 菜单和编辑区域的右键菜单多了一个中文命令。点击一下它，再看看调试窗口是否成功。
但目前为止，皮卡丘还只是活在调试窗口中耶。这样不行了啦，我们还想要把它带到 Brackets 的核心，那就是文档编辑区域。
下面我们来看看来了解一下通过操作 `Editor` 和 `Document` 的实例，实现这个目的。

### 编辑当前文档
Brackets 每个已打开的文档都是一个对象，均为 `Document` 的子类。
而每个文档所对应的编辑器，就是 `Editor`，与 `Document` 为一对一的关系。

获取 `Editor` 对象的几种方法：

> - `EditorManager.getFocusedEditor()` 返回当前获得焦点的编辑器对象
- `EditorManager.getActiveEditor()` 返回当前正在编辑的编辑器对象。和上面的方法相似，区别在于如果当前焦点被转移到了搜索栏、对话框等地方，就会返回最后一个获得焦点的编辑器对象
- `EditorManager.getCurrentFullEditor()` 返回当前打开的文本的编辑器对象，不包括行内编辑器（Inline Editor，即通过 `Quick Edit` 打开的编辑器）

获得 `Editor` 对象之后，`Document` 对象就垂手可得了：
```javascript
  var document = editor.document;
```

下面要介绍的是 `Editor` 和 `Document` 一些常用的方法。

**Editor 对象**
>- [getCursorPos()](http://brackets.io/docs/current/modules/editor/Editor.html#Editor-getCursorPos) 返回光标的位置。注意位置的格式为：`{line:number, ch:number}`，下同
- [getSelectedText()](http://brackets.io/docs/current/modules/editor/Editor.html#Editor-getSelectedText) 返回当前被选中的内容
- [setSelection(start, end)](http://brackets.io/docs/current/modules/editor/Editor.html#Editor-setSelection) 选中某个范围的内容
- [selectWordAt(position)](http://brackets.io/docs/current/modules/editor/Editor.html#Editor-selectWordAt) 选中某个位置上的单词

**Document 对象**
>- [getText()](http://brackets.io/docs/current/modules/document/Document.html#Document-getText) 返回当前文本的所有内容，包括未保存的部分
- [setText(text)](http://brackets.io/docs/current/modules/document/Document.html#Document-setText) 替换当前文本的所有内容
- [getLine(number)](http://brackets.io/docs/current/modules/document/Document.html#Document-getLine) 返回某行的文本内容
- [getRange(start, end)](http://brackets.io/docs/current/modules/document/Document.html#Document-getRange) 返回某个范围的所有内容
- [replaceRange(text, start, end)](http://brackets.io/docs/current/modules/document/Document.html#Document-replaceRange) 替换某个范围的所有内容

结合上面一些 API 提供的方法，我们实现一个功能：「在文档光标所在的位置召唤出皮卡丘」。

具体代码如下：
```javascript
var EditorManager  = brackets.getModule("editor/EditorManager");

// 菜单点击时执行的函数
function commandHandler () {
  // 获取当前打开的文本的编辑器对象
  var editor = EditorManager.getCurrentFullEditor();

  if (editor) {
    // 获取光标位置，格式为：CodeMirror.Pos {line: 16, ch: 7}
    var insertionPos = editor.getCursorPos();

    // 在光标后面插入皮卡丘图形
    editor.document.replaceRange(pikachu, insertionPos);
  }
}
```

将上面的代码与原来的合并之后，重新加载 Brackets，将光标放在文档的任意位置，点击右键「召唤皮卡丘」，是不是就出来了？
好了，目前为止我们已经获得了不错的效果，但是好像通过点击菜单的方式还是有点麻烦。
对于程序员而言，假如我们敲击咒语 `pikapika`，再按下 `Tab` 键，皮卡丘就出来了岂不是更爽？
因此接下来，让我们一起了解下 Brackets 的事件机制。

### Brackets 事件
Brackets 主要利用 jQuery 来进行事件的分发。了解 jQuery 的同学都知道其绑定事件和解绑事件的方法分别是 `$(obj).on()` 和 `$(obj).off()`，Brackets 中同样如此。

下面介绍 `Editor` 对象中支持的事件：
> - `keydown, keypress, keyup` 当任意按键按下时，会触发这几个事件。回调函数接收 `(BracketsEvent, Editor, KeyboardEvent)` 参数
- `cursorActivity` 当用户移动光标、选中的字符有变动、有修改操作，均会触发此事件。注意由于这个事件威力太猛，所以不建议监听，但可以换成 `$(editor.document).on('change', changeHandler)`
- `scroll` 当编辑器有滚动的操作触发
- `lostContent` 当文档内容丢失时触发
- `optionChange` 当因选项变动导致编辑器发生改变时触发
- `beforeDestroy` 当编辑器对象被销毁时触发

对于监听键盘敲击事件而言，我们常用 `keypress` 事件。但如果涉及到功能键（如 Tab/Ctrl/Shift）的话，则要改用 `keydown` 事件。因此这里我们选择监听后者。

具体代码如下：
```javascript
  var EditorManager = brackets.getModule("editor/EditorManager");
  
  function keyHandler (bracketsEvent, editor, keyboardEvent) {
    console.log('keycode: ', keyboardEvent.keyCode);
  }

  AppInit.appReady(function () {
    var editor = EditorManager.getCurrentFullEditor();
    $(editor).on("keydown", keyHandler);
  });
```

然而当你整合完代码后会发现，代码好像并没有执行，或者说切换另一个文档的时候，代码就失效了。
为了确保代码始终对当前文档有效，我们还要再监听 `EditorManager` 的 `activeEditorChange` 事件。

具体代码如下：
```javascript
  var EditorManager  = brackets.getModule("editor/EditorManager");
  
  function keyHandler (bracketsEvent, editor, keyboardEvent) {
    console.log('keycode: ', keyboardEvent.keyCode);
  }

  // 文档切换时重新绑定监听事件
  var activeEditorChangeHandler = function (bracketsEvent, focusedEditor, lostEditor) {
    if (lostEditor) {
      $(lostEditor).off("keydown", keyHandler);
    }

    if (focusedEditor) {
      $(focusedEditor).on("keydown", keyHandler);
    }
  };

  AppInit.appReady(function () {
    // 绑定文档切换事件
    $(EditorManager).on('activeEditorChange', activeEditorChangeHandler);
  });
```

目前我们已经了解了 `Editor` 对象的一些方法和它的监听事件。因此我们很容易地实现最后一个功能：「敲击咒语 `pikapika`，再按下 `Tab` 键，召唤出皮卡丘」。

具体实现代码：
```javascript
var KeyEvent = brackets.getModule("utils/KeyEvent");
function keyHandler (bracketsEvent, editor, keyboardEvent) {

  // 如果用户按键不是 Tab 键，返回
  if (keyboardEvent.keyCode !== KeyEvent.DOM_VK_TAB) {
    return;
  }

  // 获取当前光标位置
  var cursorPos = editor.getCursorPos();

  // 获取当前行的所有文字
  var lineStr = editor.document.getLine(cursorPos.line);

  // 咒语
  var mantra = 'pikapika';

  // 判断光标前的字符与咒语是否一致
  if (mantra === lineStr.substr(cursorPos.ch - mantra.length, cursorPos.ch)) {
    var start = {
        line: cursorPos.line,
        ch: cursorPos.ch - mantra.length
    };
    // 在光标后面插入皮卡丘图形
    editor.document.replaceRange(pikachu, start, cursorPos);
  }
}
```

整合前面提及的所有东西，**最终完整的代码**如下：
```javascript
/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window, Mustache */

define(function (require, exports, module) {
  "use strict";

  var AppInit        = brackets.getModule('utils/AppInit'),
      CommandManager = brackets.getModule("command/CommandManager"),
      EditorManager  = brackets.getModule("editor/EditorManager"),
      Menus          = brackets.getModule("command/Menus"),
      KeyEvent       = brackets.getModule("utils/KeyEvent"),
      pikachu        = require('text!pikachu.txt');

  // 菜单点击时执行的函数
  function commandHandler () {
    // 获取当前打开的文本的编辑器对象
    var editor = EditorManager.getCurrentFullEditor();

    if (editor) {
      // 获取光标位置，格式为：CodeMirror.Pos {line: 16, ch: 7}
      var insertionPos = editor.getCursorPos();

      // 在光标后面插入皮卡丘图形
      editor.document.replaceRange(pikachu, insertionPos);
    }
  }

  // 命令 ID（注意要唯一）
  var COMMAND_ID = "ascii-pokemon.pikachu";
  // 注册命令（提供三个参数，分别为：用于显示的命令名称、命令 ID、回调函数）
  CommandManager.register("召唤皮卡丘", COMMAND_ID, commandHandler);

  // `Edit` 菜单对象
  var menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
  // 文本编辑区域的右键菜单对象
  var contextMenu = Menus.getContextMenu(Menus.ContextMenuIds.EDITOR_MENU);

  // 把命令添加到菜单去
  menu.addMenuItem(COMMAND_ID);
  contextMenu.addMenuItem(COMMAND_ID);

  function keyHandler (bracketsEvent, editor, keyboardEvent) {

    // 如果用户按键不是 Tab 键，返回
    if (keyboardEvent.keyCode !== KeyEvent.DOM_VK_TAB) {
      return;
    }

    // 获取当前光标位置
    var cursorPos = editor.getCursorPos();

    // 获取当前行的所有文字
    var lineStr = editor.document.getLine(cursorPos.line);

    // 咒语
    var mantra = 'pikapika';

    // 判断光标前的字符与咒语是否一致
    if (mantra === lineStr.substr(cursorPos.ch - mantra.length, cursorPos.ch)) {
      var start = {
          line: cursorPos.line,
          ch: cursorPos.ch - mantra.length
      };
      // 在光标后面插入皮卡丘图形
      editor.document.replaceRange(pikachu, start, cursorPos);
    }
  }

  // 切换文件编辑窗口，重新绑定按键监听事件
  var activeEditorChangeHandler = function (bracketsEvent, focusedEditor, lostEditor) {
    if (lostEditor) {
      $(lostEditor).off("keydown", keyHandler);
    }

    if (focusedEditor) {
      $(focusedEditor).on("keydown", keyHandler);
    }
  };

  AppInit.appReady(function () {
    // 绑定文档切换事件
    $(EditorManager).on('activeEditorChange', activeEditorChangeHandler);
  });
});
```

好了，如果你看到了这里，说明你已经掌握了如何制作一个 Brackets 插件。
接下来，你可以尝试查看其他插件的源码，甚至是 Brackets 的源码进行学习。
下面是一些开发的相关链接，希望能给你带来更多的帮助。

## 相关链接
[Brackets API](http://brackets.io/docs/current/modules/editor/Editor.html)
[Brackets Wiki](https://github.com/adobe/brackets/wiki)
[Brackets 开发论坛](https://groups.google.com/forum/?hl=en#!forum/brackets-dev)
[CodeMirror - Brackets Editor 核心](http://codemirror.net/)

## 参考文章 Credits
[How to write extensions · adobe/brackets Wiki](https://github.com/adobe/brackets/wiki/How-to-write-extensions)
[Writing Brackets extension - part 2](http://artoale.com/tutorial/brackets/2013/10/04/writing-brackets-extension-02/)
[构建首个 Brackets 扩展 | Adobe 开发人员连接](http://www.adobe.com/cn/devnet/edge-code/articles/building-your-first-brackets-extension.html)
