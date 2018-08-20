# ngx-neditor

基于[@notadd/neditor](https://github.com/notadd/neditor)，更现代化的富文本编辑器angular组件

## How to use
### step-1

#### 安装`@notadd/ngx-neditor`
+ `npm install @notadd/ngx-neditor` 
 
#### 安装依赖
+ `mkdir -p ./src/assets/node_modules`
+ `npm install --prefix ./src/assets @notadd/neditor`
> ⚠ neditor需在assets/node_modules下安装

#### step-2

+ 添加NgxNeditorModule到你的AppModule

```typescript
  import { NgxNeditorModule } from '@notadd/ngx-neditor';

  @NgModule({
    imports: [
        ...
        NgxNeditorModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
  })
  export class AppModule { }
```

#### step-3

+ 在你的component中添加`ngx-neditor`组件

```html
<ngx-neditor [(ngModel)]="content" #neditor [config]="config"></ngx-neditor>
```

#### Neditor相关配置见[@notadd/neditor](https://github.com/notadd/neditor)

## 属性
| 名称    | 类型           | 默认值  | 描述 |
| ------- | ------------- | ----- | ----- |
| config | `Object` | - | 前端配置项说明，[见官网](http://fex.baidu.com/ueditor/#start-config) |
| loadingTip | `string` | `加载中...` | 初始化提示文本 |
| disabled | `boolean` | `false` | 是否禁用 |
| delay | `number` | `50` | 延迟初始化Neditor，单位：毫秒 |
| neOnReady | `EventEmitter<NgxNeditorComponent>` | - | 编辑器准备就绪后会触发该事件，并会传递 `NgxNeditorComponent` 当前实例对象，可用于后续操作。 |
| neOnDestroy | `EventEmitter` | - | **编辑器组件销毁**后会触发该事件 |
| ngModelChange | `EventEmitter<string>` | - | 编辑器内容发生改变时会触发该事件 |
