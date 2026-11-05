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
import { FunctionLibraryInterface } from "../../models/function-library";
import FunctionLibrariesList from "../function-libraries-list";
import type {} from "@testing-library/jest-dom/vitest";

const deleteFunctionLibraryMock: Mock = vi.hoisted(() => vi.fn());
const historyPushMock: Mock = vi.hoisted(() => vi.fn());
const permissions: { granted: boolean } = vi.hoisted(() => ({ granted: true }));

interface DataTableActionInterface {
    "data-componentid": string;
    hidden?: () => boolean;
    onClick: (event: SyntheticEvent, item: FunctionLibraryInterface) => void;
    popupText: () => string;
}

interface DataTablePropsInterface {
    actions: DataTableActionInterface[];
    data: FunctionLibraryInterface[];
    onRowClick: (event: SyntheticEvent, item: FunctionLibraryInterface) => void;
    placeholders?: ReactNode;
    "data-componentid": string;
}

interface ConfirmationModalPropsInterface {
    children: ReactNode;
    onPrimaryActionClick: () => void;
    onSecondaryActionClick: () => void;
    open: boolean;
    "data-componentid": string;
}

interface ConfirmationModalComponentInterface extends FunctionComponent<ConfirmationModalPropsInterface> {
    Content: FunctionComponent<{ children: ReactNode }>;
    Header: FunctionComponent<{ children: ReactNode }>;
    Message: FunctionComponent<{ children: ReactNode }>;
}

vi.mock("../../api/function-library", () => ({
    deleteFunctionLibrary: deleteFunctionLibraryMock
}));

vi.mock("@wso2is/access-control", async (importOriginal: () => Promise<Record<string, unknown>>) => ({
    ...(await importOriginal()),
    Show: ({ children }: { children: ReactNode }): ReactElement => (
        <>{ permissions.granted ? children : null }</>
    ),
    useRequiredScopes: (): boolean => permissions.granted
}));

vi.mock("@wso2is/admin.core.v1/configs/ui", () => ({
    getEmptyPlaceholderIllustrations: () => ({
        newList: "new-list.svg"
    })
}));

vi.mock("@wso2is/admin.core.v1/constants/app-constants", () => ({
    AppConstants: {
        getPaths: () => new Map<string, string>([
            [ "FUNCTION_LIBRARY_EDIT", "/function-libraries/:id" ]
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
        "data-componentid": componentId
    }: DataTablePropsInterface): ReactElement => (
        <div data-componentid={ componentId }>
            { data.length === 0 && placeholders }
            { data.map((item: FunctionLibraryInterface) => (
                <div key={ item.name }>
                    <button
                        type="button"
                        data-componentid={ `${ componentId }-${ item.name }-row` }
                        onClick={ (event: SyntheticEvent) => onRowClick(event, item) }
                    >
                        { item.name }
                    </button>
                    { actions
                        .filter((action: DataTableActionInterface) => !action.hidden?.())
                        .map((action: DataTableActionInterface) => (
                            <button
                                key={ action["data-componentid"] }
                                type="button"
                                data-componentid={ `${ action["data-componentid"] }-${ item.name }` }
                                onClick={ (event: SyntheticEvent) => action.onClick(event, item) }
                            >
                                { action.popupText() }
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
        "data-componentid": componentId
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
        ConfirmationModal,
        DataTable,
        EmptyPlaceholder: ({
            action,
            "data-componentid": componentId
        }: {
            action: ReactNode;
            "data-componentid": string;
        }): ReactElement => (
            <div data-componentid={ componentId }>
                { action }
            </div>
        ),
        ListLayout: ({ children }: { children: ReactNode }): ReactElement => <div>{ children }</div>,
        PrimaryButton: ({
            children,
            onClick,
            "data-componentid": componentId
        }: {
            children: ReactNode;
            onClick?: () => void;
            "data-componentid"?: string;
        }): ReactElement => (
            <button type="button" data-componentid={ componentId } onClick={ onClick }>
                { children }
            </button>
        )
    };
});

const LIBRARIES: FunctionLibraryInterface[] = [
    { description: "Age utilities", id: "YWdlLWJhc2VkLmpz", name: "age-based.js" },
    { description: "Created in the legacy console", id: "bGVnYWN5IGxpYi5qcw", name: "legacy lib.js" }
];

const renderList = (
    functionLibraryList: FunctionLibraryInterface[],
    onFunctionLibraryDelete: () => void = vi.fn(),
    onAddNewFunctionLibrary: () => void = vi.fn()
): void => {
    render(
        <FunctionLibrariesList
            functionLibraryList={ functionLibraryList }
            isLoading={ false }
            listItemLimit={ 10 }
            activePage={ 1 }
            totalListSize={ functionLibraryList.length }
            onPageChange={ vi.fn() }
            onItemsPerPageDropdownChange={ vi.fn() }
            onFunctionLibraryDelete={ onFunctionLibraryDelete }
            onAddNewFunctionLibrary={ onAddNewFunctionLibrary }
            data-componentid="function-libraries-list"
        />
    );
};

describe("FunctionLibrariesList", () => {
    beforeEach(() => {
        deleteFunctionLibraryMock.mockReset();
        historyPushMock.mockReset();
        permissions.granted = true;
    });

    it("renders the empty placeholder and starts the create flow", () => {
        const onAddNewFunctionLibrary: Mock = vi.fn();

        renderList([], vi.fn(), onAddNewFunctionLibrary);

        expect(screen.getByTestId("function-libraries-list-empty-placeholder")).toBeInTheDocument();

        fireEvent.click(screen.getByTestId("function-libraries-list-empty-placeholder-add-button"));

        expect(onAddNewFunctionLibrary).toHaveBeenCalledTimes(1);
    });

    it("hides the create and delete actions without the required scopes", () => {
        permissions.granted = false;

        renderList([]);

        expect(
            screen.queryByTestId("function-libraries-list-empty-placeholder-add-button")
        ).not.toBeInTheDocument();
    });

    it("hides the delete action without the delete scope", () => {
        permissions.granted = false;

        renderList(LIBRARIES);

        expect(
            screen.queryByTestId("function-libraries-list-item-delete-button-age-based.js")
        ).not.toBeInTheDocument();
        expect(
            screen.getByTestId("function-libraries-list-item-edit-button-age-based.js")
        ).toBeInTheDocument();
    });

    it("navigates to the edit page using the library id", () => {
        renderList(LIBRARIES);

        fireEvent.click(screen.getByTestId("function-libraries-list-table-legacy lib.js-row"));

        expect(historyPushMock).toHaveBeenCalledWith("/function-libraries/bGVnYWN5IGxpYi5qcw");
    });

    it("deletes a library after confirmation and refreshes the list", async () => {
        const onFunctionLibraryDelete: Mock = vi.fn();

        deleteFunctionLibraryMock.mockResolvedValueOnce({});

        renderList(LIBRARIES, onFunctionLibraryDelete);

        fireEvent.click(screen.getByTestId("function-libraries-list-item-delete-button-age-based.js"));
        fireEvent.click(screen.getByText("Confirm"));

        await waitFor(() => {
            expect(deleteFunctionLibraryMock).toHaveBeenCalledWith("YWdlLWJhc2VkLmpz");
            expect(onFunctionLibraryDelete).toHaveBeenCalledTimes(1);
        });
    });

    it("does not refresh the list when the delete request fails", async () => {
        const onFunctionLibraryDelete: Mock = vi.fn();

        deleteFunctionLibraryMock.mockRejectedValueOnce({
            response: {
                data: {
                    description: "Failed to delete."
                }
            }
        });

        renderList(LIBRARIES, onFunctionLibraryDelete);

        fireEvent.click(screen.getByTestId("function-libraries-list-item-delete-button-age-based.js"));
        fireEvent.click(screen.getByText("Confirm"));

        await waitFor(() => {
            expect(deleteFunctionLibraryMock).toHaveBeenCalledTimes(1);
        });
        expect(onFunctionLibraryDelete).not.toHaveBeenCalled();
    });
});
