/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RuntimeConfigProvider from '../providers/runtime-config-provider';
import useRuntimeConfig from '../hooks/use-runtime-config';
import { RuntimeConfigInterface } from '../models/runtime-config';

// Mock component that uses the runtime config
const TestComponent: React.FC = () => {
    const { getRuntimeConfig, getAllRuntimeConfig } = useRuntimeConfig<RuntimeConfigInterface>();
    
    const updateLevel = getRuntimeConfig('updates.updateLevel');
    const allConfig = getAllRuntimeConfig();
    
    return (
        <div>
            <span data-testid="update-level">{updateLevel as string}</span>
            <span data-testid="all-config">{JSON.stringify(allConfig)}</span>
        </div>
    );
};

describe('RuntimeConfigProvider', () => {
    beforeEach(() => {
        // Clear window object
        delete (window as any).__WSO2IS_RUNTIME_CONFIG__;
    });

    it('should provide initial runtime config', () => {
        const initialConfig: RuntimeConfigInterface = {
            updates: {
                updateLevel: 'BETA'
            }
        };

        render(
            <RuntimeConfigProvider<RuntimeConfigInterface>
                initialRuntimeConfig={initialConfig}
            >
                <TestComponent />
            </RuntimeConfigProvider>
        );

        expect(screen.getByTestId('update-level')).toHaveTextContent('BETA');
    });

    it('should read from window.__WSO2IS_RUNTIME_CONFIG__', () => {
        (window as any).__WSO2IS_RUNTIME_CONFIG__ = {
            updates: {
                updateLevel: 'STABLE'
            }
        };

        render(
            <RuntimeConfigProvider<RuntimeConfigInterface>>
                <TestComponent />
            </RuntimeConfigProvider>
        );

        expect(screen.getByTestId('update-level')).toHaveTextContent('STABLE');
    });

    it('should throw error when used outside provider', () => {
        // Suppress console.error for this test
        const originalError = console.error;
        console.error = jest.fn();

        expect(() => {
            render(<TestComponent />);
        }).toThrow('useRuntimeConfig must be used within a RuntimeConfigProvider');

        console.error = originalError;
    });
});
