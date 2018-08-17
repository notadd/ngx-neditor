import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxNeditorComponent } from './ngx-neditor.component';

import { ScriptLoaderService } from './script-loader.service';
import { NeditorConfig } from './neditor.config';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [ ScriptLoaderService, NeditorConfig ],
  declarations: [NgxNeditorComponent],
  exports: [NgxNeditorComponent]
})
export class NgxNeditorModule { }
