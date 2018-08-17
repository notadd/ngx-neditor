export interface ScriptModel {
  name: string;
  src: string;
  loaded: boolean;
}

export const ScriptStore: Array<ScriptModel> = [
  { name: 'config', src: './assets/node_modules/@notadd/neditor/neditor.config.js', loaded: false },
  { name: 'neditor', src: './assets/node_modules/@notadd/neditor/neditor.all.min.js', loaded: false },
  { name: 'jquery', src: './assets/node_modules/@notadd/neditor/third-party/jquery-1.10.2.min.js', loaded: false },
  { name: 'service', src: './assets/node_modules/@notadd/neditor/neditor.service.js', loaded: false },
];
