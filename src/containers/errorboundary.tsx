import React, { Component } from 'react';

interface IState {
  hasError: boolean;
}

class ErrorBoundary extends Component {
  state: IState = {
    hasError: false,
  };

  static getDerivedStateFromError(error: Error) {
    console.log(error);
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
    // console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
