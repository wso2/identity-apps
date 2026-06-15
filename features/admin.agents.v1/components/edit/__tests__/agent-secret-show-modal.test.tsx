/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { fireEvent, render, screen, waitFor } from "@wso2is/unit-testing/utils";
import React, { FunctionComponent, ReactElement, ReactNode } from "react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { AgentSecretShowModal } from "../agent-secret-show-modal";
import type {} from "@testing-library/jest-dom/vitest";

const generatePasswordMock: Mock = vi.hoisted(() => vi.fn());
const getConfigurationMock: Mock = vi.hoisted(() => vi.fn());
const updateAgentPasswordMock: Mock = vi.hoisted(() => vi.fn());

interface CopyInputFieldPropsInterface {
    secret?: boolean;
    value: string;
    "data-componentid"?: string;
}

interface ButtonPropsInterface {
    children: ReactNode;
    disabled?: boolean;
    loading?: boolean;
    onClick?: () => void;
    "data-componentid"?: string;
    "data-testid"?: string;
}

interface ModalPropsInterface {
    children: ReactNode;
    open: boolean;
    "data-componentid"?: string;
    "data-testid"?: string;
}

interface ModalComponentInterface extends FunctionComponent<ModalPropsInterface> {
    Actions: FunctionComponent<{ children: ReactNode }>;
    Content: FunctionComponent<{ children: ReactNode }>;
    Header: FunctionComponent<{ children: ReactNode }>;
}

vi.mock("@wso2is/admin.validation.v1/api/validation-config", () => ({
    useValidationConfigData: () => ({
        data: {}
    })
}));

vi.mock("@wso2is/admin.users.v1/utils/generate-password.utils", () => ({
    generatePassword: generatePasswordMock,
    getConfiguration: getConfigurationMock
}));

vi.mock("../../../api/agents", () => ({
    updateAgentPassword: updateAgentPasswordMock
}));

vi.mock("@wso2is/react-components", () => ({
    CopyInputField: ({ secret, value, "data-componentid": componentId }: CopyInputFieldPropsInterface): ReactElement => (
        <input
            readOnly
            aria-label={ secret ? "secret-input" : "copy-input" }
            data-componentid={ componentId }
            value={ value }
        />
    ),
    PrimaryButton: ({
        children,
        disabled,
        onClick,
        "data-componentid": componentId
    }: ButtonPropsInterface): ReactElement => (
        <button
            type="button"
            data-componentid={ componentId }
            disabled={ disabled }
            onClick={ onClick }
        >
            { children }
        </button>
    )
}));

vi.mock("semantic-ui-react", () => {
    const Modal: ModalComponentInterface = ({
        children,
        open,
        "data-componentid": componentId,
        "data-testid": testId
    }: ModalPropsInterface): ReactElement | null => {
        if (!open) {
            return null;
        }

        return (
            <div data-componentid={ componentId } data-testid={ testId }>
                { children }
            </div>
        );
    };

    Modal.Header = ({ children }: { children: ReactNode }): ReactElement => <h2>{ children }</h2>;
    Modal.Content = ({ children }: { children: ReactNode }): ReactElement => <div>{ children }</div>;
    Modal.Actions = ({ children }: { children: ReactNode }): ReactElement => <div>{ children }</div>;

    return {
        Button: ({ children, onClick, "data-testid": testId }: ButtonPropsInterface): ReactElement => (
            <button type="button" data-testid={ testId } onClick={ onClick }>
                { children }
            </button>
        ),
        Icon: (): ReactElement => <span />,
        Message: ({ children }: { children: ReactNode }): ReactElement => <div>{ children }</div>,
        Modal
    };
});

vi.mock("i18next", () => ({
    t: (key: string): string => key
}));

describe("AgentSecretShowModal", () => {
    beforeEach(() => {
        generatePasswordMock.mockReset();
        getConfigurationMock.mockReset();
        updateAgentPasswordMock.mockReset();

        generatePasswordMock.mockReturnValue("GeneratedSecret#123");
        getConfigurationMock.mockReturnValue({
            minLowerCaseCharacters: "1",
            minNumbers: "1",
            minSpecialCharacters: "1",
            minUniqueCharacters: "1",
            minUpperCaseCharacters: "1"
        });
    });

    it("shows the generated agent secret after regeneration succeeds", async () => {
        updateAgentPasswordMock.mockResolvedValueOnce({});

        render(
            <AgentSecretShowModal
                agentId="agent-id"
                isForSecretRegeneration
                isOpen
                onClose={ vi.fn() }
                title="Regenerate Agent Secret"
                data-componentid="agent-secret-show-modal"
            />
        );

        fireEvent.click(screen.getByTestId("agent-secret-show-modal-proceed-btn"));

        await waitFor(() => {
            expect(updateAgentPasswordMock).toHaveBeenCalledWith("agent-id", "GeneratedSecret#123");
        });

        expect(screen.getByTestId("agent-secret-readonly-input")).toHaveValue("GeneratedSecret#123");
    });

    it("renders the initial credentials view and closes with Done", () => {
        const onClose: Mock = vi.fn();

        render(
            <AgentSecretShowModal
                agentId="agent-id"
                agentSecret="InitialSecret#123"
                isOpen
                onClose={ onClose }
                title="Agent Secret"
                data-componentid="agent-secret-show-modal"
            />
        );

        expect(screen.getByTestId("agent-id-readonly-input")).toHaveValue("agent-id");
        expect(screen.getByTestId("agent-secret-readonly-input")).toHaveValue("InitialSecret#123");

        fireEvent.click(screen.getByText("Done"));

        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
