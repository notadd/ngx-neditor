import { Component, ViewChild, OnInit } from '@angular/core';

import { NgxNeditorComponent } from '../../projects/notadd/ngx-neditor/src/public_api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  config: any = {
    initialFrameHeight: 500
  };

  constructor() {

  }

  ngOnInit() {
  }
}
