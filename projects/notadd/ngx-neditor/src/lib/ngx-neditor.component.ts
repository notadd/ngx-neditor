import {
  Component,
  Input,
  forwardRef,
  ElementRef,
  OnDestroy,
  EventEmitter,
  Output,
  OnInit,
  Optional,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  NgZone
} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {ScriptLoaderService} from './script-loader.service';
import {NeditorConfig} from './neditor.config';
import {EventTypes} from './types';

declare const window: any;
declare const UE: any;
let _hook_finished = false;

@Component({
  selector: 'ngx-neditor',
  template: `
  <textarea id="{{id}}" class="ueditor-textarea"></textarea>
  <div *ngIf="loading" class="loading" [innerHTML]="loadingTip"></div>
  `,
  preserveWhitespaces: false,
  styles: [
    `:host {line-height: initial;} :host .ueditor-textarea{display:none;}`,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxNeditorComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxNeditorComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy, ControlValueAccessor {
  private instance: any;
  private value: string;
  private inited = false;
  private events: any = {};

  private _disabled = false;

  private onTouched: () => void = () => {};
  private onChange: (value: string) => void = () => {};

  /* 取消订阅主题 */
  private ngUnsubscribe: Subject<boolean> = new Subject();

  loading = true;
  id = `_neditor-${Math.random()
    .toString(36)
    .substring(2)}`;

  @Input() loadingTip = '加载中...';
  @Input() config: any;

  @Input()
  set disabled(value: boolean) {
    this._disabled = value;
    this.setDisabled();
  }

  /** 延迟初始化 */
  @Input() delay = 50;

  @Output() readonly neOnPreReady = new EventEmitter<NgxNeditorComponent>();
  @Output() readonly neOnReady = new EventEmitter<NgxNeditorComponent>();
  @Output() readonly neOnDestroy = new EventEmitter();

  constructor(
    private sl: ScriptLoaderService,
    private el: ElementRef,
    private neConfig: NeditorConfig,
    private cd: ChangeDetectorRef,
    private zone: NgZone,
  ) {
  }

  ngOnInit() {
    this.inited = true;
  }

  ngAfterViewInit(): void {
    // 已经存在对象无须进入懒加载模式
    if (window.UE) {
      this.initDelay();
      return;
    }

    this.sl.load()
      .getChangeEmitter()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.initDelay();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.inited && changes.config) {
      this.destroy();
      this.initDelay();
    }
  }

  private initDelay() {
    setTimeout(() => this.init(), this.delay);
  }

  private init() {
    if (!window.UE) { throw new Error('neditor js文件加载失败'); }

    if (this.instance) { return; }

    // registrer hook
    if (this.neConfig.hook && !_hook_finished) {
      _hook_finished = true;
      this.neConfig.hook(UE);
    }

    this.neOnPreReady.emit(this);

    const opt = Object.assign({}, this.neConfig.options, this.config);

    this.zone.runOutsideAngular(() => {
      const ueditor = UE.getEditor(this.id, opt);
      ueditor.ready(() => {
        this.instance = ueditor;
        if (this.value) { this.instance.setContent(this.value); }
        this.neOnReady.emit(this);
      });

      ueditor.addListener('contentChange', () => {
        this.value = ueditor.getContent();

        this.zone.run(() => this.onChange(this.value));
      });
    });
    this.loading = false;
    this.cd.detectChanges();
  }

  private destroy() {
    if (this.instance) {
      this.zone.runOutsideAngular(() => {
        for (const ki of this.events) {
          this.instance.removeListener(ki, this.events[ki]);
        }
        this.instance.removeListener('ready');
        this.instance.removeListener('contentChange');
        this.instance.destroy();
        this.instance = null;
      });
    }
    this.neOnDestroy.emit();
  }

  private setDisabled() {
    if (!this.instance) { return; }
    if (this._disabled) {
      this.instance.setDisabled();
    } else {
      this.instance.setEnabled();
    }
  }

  /**
   * 获取UE实例
   *
   * @readonly
   */
  get Instance(): any {
    return this.instance;
  }

  /**
   * 添加编辑器事件
   */
  addListener(eventName: EventTypes, fn: Function): void {
    if (this.events[eventName]) { return; }
    this.events[eventName] = fn;
    this.instance.addListener(eventName, fn);
  }

  /**
   * 移除编辑器事件
   */
  removeListener(eventName: EventTypes): void {
    if (!this.events[eventName]) { return; }
    this.instance.removeListener(eventName, this.events[eventName]);
    delete this.events[eventName];
  }

  ngOnDestroy() {
    this.destroy();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  writeValue(value: string): void {
    this.value = value;
    if (this.instance) {
      this.instance.setContent(this.value);
    }
  }

  registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.setDisabled();
  }
}
