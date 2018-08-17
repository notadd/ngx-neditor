import { Injectable } from '@angular/core';
import { Observable, Observer, Subject, of } from 'rxjs';
import { filter, concatAll } from 'rxjs/operators';

import { ScriptStore, ScriptModel } from './script.store';

@Injectable()
export class ScriptLoaderService {
  private loaded = false;
  private emitter: Subject<boolean> = new Subject<boolean>();
  private scripts: Array<ScriptModel> = ScriptStore;

  getChangeEmitter() {
    return this.emitter.asObservable();
  }

  public load() {
    if (this.loaded) { return this; }

    this.loaded = true;

    const observables: Observable<ScriptModel>[] = [];

    this.scripts.forEach(script => observables.push(this.loadScript(script)));

    of(...observables).pipe(concatAll()).subscribe({
      complete: () => {
        this.emitter.next(true);
      }
    });

    return this;
  }

  public loadScript(script: ScriptModel): Observable<ScriptModel> {
    return new Observable<ScriptModel>((observer: Observer<ScriptModel>) => {
      const existingScript = this.scripts.find(s => s.name === script.name);

      // Complete if already loaded
      if (existingScript && existingScript.loaded) {
        observer.next(existingScript);
        observer.complete();
      } else {
        // Load the script
        const scriptElement = document.createElement('script');
        scriptElement.type = 'text/javascript';
        scriptElement.src = script.src;

        scriptElement.onload = () => {
          script.loaded = true;
          observer.next(script);
          observer.complete();
        };

        scriptElement.onerror = (error: any) => {
          observer.error('Couldn\'t load script ' + script.src);
        };

        document.getElementsByTagName('body')[0].appendChild(scriptElement);
      }
    });
  }
}
