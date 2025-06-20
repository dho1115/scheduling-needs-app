import { Component } from 'react';

class ErrorBoundary extends Component {
   constructor(props) {
      super(props);
      this.state = { hasError: false }
   }

   static getDerivedStateFromError(error, info) {
      return { hasError: true };
   }

   componentDidCatch(error, errorInfo) {
      console.error({ error, errorInfo });
   }

   render() {
      if (this.state.hasError) {
         return this.props.fallback
      }
      return this.props.children
   }
}

export default ErrorBoundary;
