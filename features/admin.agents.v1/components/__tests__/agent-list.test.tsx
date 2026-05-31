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
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent } from "react";
import { Mock, beforeEach, describe, expect, it, vi } from "vitest";
import AgentList from "../agent-list";
import type {} from "@testing-library/jest-dom/vitest";

const deleteAgentMock: Mock = vi.hoisted(() => vi.fn());
const historyPushMock: Mock = vi.hoisted(() => vi.fn());

interface AgentListItemInterface {
    id: string;
    name: string;
    "urn:scim:wso2:agent:schema"?: {
        DisplayName?: string;
    };
}

interface DataTableActionInterface {
    "data-testid": string;
    onClick: (_event: SyntheticEvent, _agent: AgentListItemInterface) => void;
    popupText: (_agent: AgentListItemInterface) => string;
}

interface DataTablePropsInterface {
    actions: DataTableActionInterface[];
    data: AgentListItemInterface[];
    onRowClick: (_event: SyntheticEvent, _agent: AgentListItemInterface) => void;
    placeholders?: ReactNode;
    "data-testid": string;
}

interface ButtonPropsInterface {
    children: ReactNode;
    onClick?: () => void;
    "data-testid"?: string;
}

interface ConfirmationModalPropsInterface {
    children: ReactNode;
    onPrimaryActionClick: () => void;
    onSecondaryActionClick: () => void;
    open: boolean;
    "data-testid": string;
}

interface ConfirmationModalComponentInterface extends FunctionComponent<ConfirmationModalPropsInterface> {
    Content: FunctionComponent<{ children: ReactNode }>;
    Header: FunctionComponent<{ children: ReactNode }>;
    Message: FunctionComponent<{ children: ReactNode }>;
}

vi.mock("../../api/agents", () => ({
    deleteAgent: deleteAgentMock
}));

vi.mock("@wso2is/admin.core.v1/configs/ui", () => ({
    getEmptyPlaceholderIllustrations: () => ({
        newList: "new-list.svg"
    })
}));

vi.mock("@wso2is/admin.core.v1/constants/app-constants", () => ({
    AppConstants: {
        getPaths: () => new Map<string, string>([
            [ "AGENT_EDIT", "/agents/:id" ]
        ])
    }
}));

vi.mock("@wso2is/admin.core.v1/helpers/history", () => ({
    history: {
        push: historyPushMock
    }
}));

vi.mock("@wso2is/react-components", () => {
    const DataTable = ({
        actions,
        data,
        onRowClick,
        placeholders,
        "data-testid": componentId
    }: DataTablePropsInterface): ReactElement => (
        <div data-componentid={ componentId }>
            { placeholders }
            { data?.map((agent: AgentListItemInterface) => (
                <div key={ agent.id }>
                    <button
                        type="button"
                        data-componentid={ `${componentId}-${agent.id}-row` }
                        onClick={ (event: SyntheticEvent) => onRowClick(event, agent) }
                    >
                        { agent["urn:scim:wso2:agent:schema"]?.DisplayName }
                    </button>
                    { actions.map((action: DataTableActionInterface) => (
                        <button
                            key={ action["data-testid"] }
                            type="button"
                            data-componentid={ action["data-testid"] }
                            onClick={ (event: SyntheticEvent) => action.onClick(event, agent) }
                        >
                            { action.popupText(agent) }
                        </button>
                    )) }
                </div>
            )) }
        </div>
    );

    const ConfirmationModal: ConfirmationModalComponentInterface = ({
        children,
        onPrimaryActionClick,
        onSecondaryActionClick,
        open,
        "data-testid": componentId
    }: ConfirmationModalPropsInterface): ReactElement | null => {
        if (!open) {
            return null;
        }

        return (
            <div data-componentid={ componentId }>
                { children }
                <button type="button" onClick={ onPrimaryActionClick }>Confirm</button>
                <button type="button" onClick={ onSecondaryActionClick }>Cancel</button>
            </div>
        );
    };

    ConfirmationModal.Header = ({ children }: { children: ReactNode }): ReactElement => <h2>{ children }</h2>;
    ConfirmationModal.Message = ({ children }: { children: ReactNode }): ReactElement => <div>{ children }</div>;
    ConfirmationModal.Content = ({ children }: { children: ReactNode }): ReactElement => <div>{ children }</div>;

    return {
        AnimatedAvatar: ({ name }: { name: string }): ReactElement => <span>{ name }</span>,
        AppAvatar: ({ image }: { image: ReactNode }): ReactElement => <span>{ image }</span>,
        ConfirmationModal,
        DataTable,
        EmptyPlaceholder: ({
            action,
            "data-testid": componentId
        }: {
            action: ReactNode;
            "data-testid": string;
        }): ReactElement => (
            <div data-componentid={ componentId }>
                { action }
            </div>
        ),
        PrimaryButton: ({ children, onClick, "data-testid": componentId }: ButtonPropsInterface): ReactElement => (
            <button
                type="button"
                data-componentid={ componentId }
                onClick={ onClick }
            >
                { children }
            </button>
        )
    };
});

describe("AgentList", () => {
    beforeEach(() => {
        deleteAgentMock.mockReset();
        historyPushMock.mockReset();
    });

    it("renders the empty placeholder and starts the add-agent flow", () => {
        const setShowAgentAddWizard: Mock = vi.fn();

        render(
            <AgentList
                advancedSearch={ null }
                isLoading={ false }
                list={ [] }
                mutateAgentList={ vi.fn() }
                setShowAgentAddWizard={ setShowAgentAddWizard }
                data-componentid="agent-list"
            />
        );

        fireEvent.click(screen.getByTestId("agent-list-empty-placeholder-add-agent-button"));

        expect(screen.getByTestId("agent-list-empty-placeholder")).toBeInTheDocument();
        expect(setShowAgentAddWizard).toHaveBeenCalledTimes(1);
    });

    it("navigates to the edit page when an agent row is selected", () => {
        render(
            <AgentList
                advancedSearch={ null }
                isLoading={ false }
                list={ [
                    {
                        id: "agent-id",
                        name: "Build Agent",
                        "urn:scim:wso2:agent:schema": {
                            DisplayName: "Build Agent"
                        }
                    }
                ] }
                mutateAgentList={ vi.fn() }
                setShowAgentAddWizard={ vi.fn() }
                data-componentid="agent-list"
            />
        );

        fireEvent.click(screen.getByTestId("agent-list-agent-id-row"));

        expect(historyPushMock).toHaveBeenCalledWith("/agents/agent-id");
    });

    it("deletes an agent after confirmation and refreshes the list", async () => {
        const mutateAgentList: Mock = vi.fn();

        deleteAgentMock.mockResolvedValueOnce({});

        render(
            <AgentList
                advancedSearch={ null }
                isLoading={ false }
                list={ [
                    {
                        id: "agent-id",
                        name: "Build Agent",
                        "urn:scim:wso2:agent:schema": {
                            DisplayName: "Build Agent"
                        }
                    }
                ] }
                mutateAgentList={ mutateAgentList }
                setShowAgentAddWizard={ vi.fn() }
                data-componentid="agent-list"
            />
        );

        fireEvent.click(screen.getByTestId("agent-list-item-delete-button"));
        fireEvent.click(screen.getByText("Confirm"));

        await waitFor(() => {
            expect(deleteAgentMock).toHaveBeenCalledWith("agent-id");
        });
        expect(mutateAgentList).toHaveBeenCalledTimes(1);
    });
});
