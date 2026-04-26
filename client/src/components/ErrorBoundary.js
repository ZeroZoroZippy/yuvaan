import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });

        // Log error to analytics service in production
        if (process.env.NODE_ENV === 'production') {
            try {
                console.error('Error caught by boundary:', error, errorInfo);
                // Could send to error reporting service here
            } catch (e) {
                console.error('Failed to log error:', e);
            }
        }
    }

    handleRefresh = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#45372B] flex items-center justify-center px-4">
                    <div className="max-w-md w-full text-center">
                        <div className="mb-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-[#A8977A] mb-2" style={{ fontFamily: 'var(--font-sans)' }}>
                                Oops! Something went wrong
                            </h1>
                            <p className="text-[#A8977A]/70 mb-6" style={{ fontFamily: 'var(--font-sans)' }}>
                                We're sorry, but something unexpected happened. Please try refreshing the page.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={this.handleRefresh}
                                className="w-full bg-[#A8977A] text-[#45372B] py-3 px-6 rounded-lg hover:bg-[#9a8a6d] transition-colors duration-300 font-medium"
                                style={{ fontFamily: 'var(--font-sans)' }}
                            >
                                Refresh Page
                            </button>
                            
                            <button
                                onClick={() => window.location.href = '/'}
                                className="w-full border border-[#A8977A]/30 text-[#A8977A] py-3 px-6 rounded-lg hover:bg-[#A8977A]/10 transition-colors duration-300"
                                style={{ fontFamily: 'var(--font-sans)' }}
                            >
                                Go to Homepage
                            </button>
                        </div>

                        {process.env.NODE_ENV === 'development' && (
                            <details className="mt-8 text-left">
                                <summary className="text-[#A8977A] cursor-pointer mb-2">
                                    Development Error Details
                                </summary>
                                <div className="bg-black/20 p-4 rounded text-xs text-[#A8977A]/70 overflow-auto">
                                    <pre>{this.state.error && this.state.error.toString()}</pre>
                                    <pre>{this.state.errorInfo.componentStack}</pre>
                                </div>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
