import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgxNeditorModule } from '../../projects/notadd/ngx-neditor/src/public_api';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgxNeditorModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
