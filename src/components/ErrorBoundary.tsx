import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="flex flex-col items-center justify-center h-screen bg-solarized-base3 text-solarized-base03 p-8">
                    <h1 className="text-2xl font-bold mb-4 text-solarized-red">Something went wrong.</h1>
                    <pre className="bg-solarized-base2 p-4 rounded text-sm overflow-auto max-w-full">
                        {this.state.error?.message}
                    </pre>
                    <button
                        className="mt-4 px-4 py-2 bg-solarized-blue text-white rounded hover:bg-opacity-90 transition-colors"
                        onClick={() => window.location.reload()}
                    >
                        Reload Application
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
