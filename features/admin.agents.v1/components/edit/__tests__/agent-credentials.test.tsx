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

import { fireEvent, render, screen } from "@testing-library/react";
import React, { ReactElement, ReactNode } from "react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import AgentCredentials from "../agent-credentials";
import type {} from "@testing-library/jest-dom/vitest";

const modalPropsMock: Mock = vi.hoisted(() => vi.fn());

interface ButtonPropsInterface {
    children: ReactNode;
    onClick?: () => void;
    "data-componentid"?: string;
}

interface CopyInputFieldPropsInterface {
    value: string;
}

interface AgentSecretShowModalPropsInterface {
    agentId: string;
    isOpen: boolean;
    onClose: () => void;
    title?: string;
}

vi.mock("@wso2is/react-components", () => ({
    Button: ({ children, onClick, "data-componentid": componentId }: ButtonPropsInterface): ReactElement => (
        <button type="button" data-componentid={ componentId } onClick={ onClick }>
            { children }
        </button>
    ),
    CopyInputField: ({ value }: CopyInputFieldPropsInterface): ReactElement => (
        <input readOnly value={ value } aria-label="copy-input" />
    ),
    EmphasizedSegment: ({ children }: { children: ReactNode }): ReactElement => <section>{ children }</section>,
    Message: ({ children }: { children: ReactNode }): ReactElement => <div>{ children }</div>
}));

vi.mock("../agent-secret-show-modal", () => ({
    AgentSecretShowModal: (props: AgentSecretShowModalPropsInterface): ReactElement | null => {
        modalPropsMock(props);

        if (!props.isOpen) {
            return null;
        }

        return (
            <div data-componentid="mock-agent-secret-show-modal">
                { props.title }
            </div>
        );
    }
}));

describe("AgentCredentials", () => {
    beforeEach(() => {
        modalPropsMock.mockClear();
    });

    it("renders the agent id and opens the regeneration modal", () => {
        render(
            <AgentCredentials
                agentId="agent-id"
                data-componentid="agent-credentials"
            />
        );

        expect(screen.getByDisplayValue("agent-id")).toBeInTheDocument();
        expect(screen.queryByTestId("mock-agent-secret-show-modal")).not.toBeInTheDocument();

        fireEvent.click(screen.getByTestId("agent-credentials-agent-secret-regenerate-button"));

        expect(screen.getByTestId("mock-agent-secret-show-modal")).toHaveTextContent("Regenerate Agent Secret");
        expect(modalPropsMock).toHaveBeenLastCalledWith(expect.objectContaining({
            agentId: "agent-id",
            isForSecretRegeneration: true,
            isOpen: true
        }));
    });
});
