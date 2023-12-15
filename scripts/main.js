export default class Simple {

  static getSelected() {
  	const controlled = canvas.tokens.controlled
  	if (controlled.length < 1) {
  		ui.notifications.error('No objects are selected');
  		throw "No objects selected";
  	}
  	if (controlled.length > 1) {
  		ui.notifications.warn('More than one object is selected. Only one object will be used.');
  	}
    return controlled[0];
  }
} 

Hooks.on('ready', () => {
  window.Simple = Simple;
});

Hooks.on('canvasReady', (canvas) => {
  if (!window.hasOwnProperty('Simple')) {
    window.Simple = Simple;
  }
});
