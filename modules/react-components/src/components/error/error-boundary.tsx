/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import PropTypes from "prop-types";
import React, { Component, ErrorInfo, PropsWithChildren, ReactNode } from "react";

/**
 * Error boundary state interface.
 */
interface ErrorBoundaryState {
    error: any;
    errorInfo: any;
}

/**
 * Error boundary props interface.
 */
interface ErrorBoundaryProps {
    fallback: React.ReactNode;
    onChunkLoadError: () => void;
    handleError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * Error boundary component to avoid JavaScript errors from breaking
 * the entire app due to an error in a specific UI part.
 * This component is an implementation of the error boundary concept
 * introduced in React 16.
 * @see {@link https://reactjs.org/docs/error-boundaries.html}
 *
 * @param props - Props injected in to the placeholder component.
 * @returns a JSX Element
 */
class ErrorBoundary extends Component<
    PropsWithChildren<ErrorBoundaryProps>,
    ErrorBoundaryState,
    ErrorBoundaryProps> {

    static propTypes = {
        children: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.node),
            PropTypes.node,
            PropTypes.func
        ]),
        fallback: PropTypes.element,
        handleError: PropTypes.func,
        onChunkLoadError: PropTypes.func
    }

    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            error: null,
            errorInfo: null
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {

        const { onChunkLoadError, handleError } = this.props;

        handleError && handleError(error, errorInfo);

        if (error.name === "ChunkLoadError") {
            onChunkLoadError && onChunkLoadError();
        }
        // Catch errors in any components below and re-render with error message
        this.setState({
            error,
            errorInfo
        });
    }

    render(): ReactNode {
        const { errorInfo } = this.state;
        const { children, fallback } = this.props;

        // If there's an error, render the fallback.
        if (errorInfo) {
            return fallback;
        }

        // Just render children
        return children;
    }
}

export { ErrorBoundary };
