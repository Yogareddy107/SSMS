import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

export class FirebaseErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Firebase Error Caught:', error, errorInfo);
    
    // Check if it's a Firestore connection error
    try {
      const parsedError = JSON.parse(error.message);
      if (parsedError.error && parsedError.error.includes('unavailable')) {
        this.setState({ errorInfo: 'Firestore backend is currently unreachable. This might be due to provisioning or network issues.' });
      }
    } catch (e) {
      // Not a JSON error message
    }
  }

  private handleReset = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10 text-rose-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Connection Issue</h2>
              <p className="text-slate-500 text-sm">
                {this.state.errorInfo || "We're having trouble connecting to the database. Please try again in a few moments."}
              </p>
            </div>
            {this.state.error && (
              <div className="bg-slate-50 rounded-xl p-3 text-left overflow-auto max-h-32">
                <code className="text-[10px] text-slate-600 break-all">
                  {this.state.error.message}
                </code>
              </div>
            )}
            <Button 
              onClick={this.handleReset}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 rounded-xl font-bold shadow-lg shadow-indigo-100"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Connection
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
