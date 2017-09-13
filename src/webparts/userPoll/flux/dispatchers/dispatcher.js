import {Dispatcher} from 'flux';
export default window['globalDispatcher'] ? window['globalDispatcher'] : new Dispatcher();