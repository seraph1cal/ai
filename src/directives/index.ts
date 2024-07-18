import { App, Directive } from 'vue';
import auth from './modules/auth';
import copy from './modules/copy';
import draggable from './modules/draggable';
import debounce from './modules/debounce';
import throttle from './modules/throttle';

const directivesList: { [key: string]: Directive } = {
  auth,
  copy,
  draggable,
  debounce,
  throttle
};

const directives = {
  install: function (app: App<Element>) {
    Object.keys(directivesList).forEach(key => {
      app.directive(key, directivesList[key]);
    });
  }
};

export default directives;
