class GameWindow {
  windowInstance: Window | null = null;

  open() {
    if (this.windowInstance) {
      return;
    }

    this.windowInstance = window.open(
      `${window.location.href}game`,
      '_blank'
    );

    this.bindWindowEvents();

    return this.windowInstance;
  }

  private bindWindowEvents() {
    if (this.windowInstance) {
      console.warn('bind event');
      // use DataChannel to listen to onclose event
    }
  }

  close() {
    if (this.windowInstance) {
      this.windowInstance.close();
    }

    this.windowInstance = null;
  }
}

export default new GameWindow();
