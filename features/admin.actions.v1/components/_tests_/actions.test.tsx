import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { useCheckFeatureStatus } from "@wso2is/access-control";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { useTranslation } from "react-i18next";
import useGetActionTypes from "../../api/use-get-action-types";
import useGetActionsByType from "../../api/use-get-actions-by-type";
import { ActionsConstants } from "../../constants/actions-constants";
import ActionTypesListingPage from "../../pages/actions";

vi.mock("../../api/use-get-action-types");
vi.mock("../../api/use-get-actions-by-type");
vi.mock("@wso2is/access-control", () => ({...vi.importActual("@wso2is/access-control"),useCheckFeatureStatus: vi.fn()}));
vi.mock("@wso2is/admin.organizations.v1/hooks/use-get-organization-type", () => ({useGetCurrentOrganizationType: vi.fn()}));
vi.mock("react-i18next", () => ({useTranslation: vi.fn()}));
vi.mock("@wso2is/react-components", () => ({
    DocumentationLink: ({ children }: { children: React.ReactNode }) => <div>{ children }</div>,
    GenericIcon: ({ children }: { children: React.ReactNode }) => <div>{ children }</div>,
    PageLayout: ({ children }: { children: React.ReactNode }) => <div>{ children }</div>,
    useDocumentation: () => ({ getLink: () => "https://example.com" })}));

const mockedUseGetActionTypes = vi.mocked(useGetActionTypes);
const mockedUseGetActionsByType = vi.mocked(useGetActionsByType);
const mockedUseCheckFeatureStatus = vi.mocked(useCheckFeatureStatus);
const mockedUseGetCurrentOrganizationType = vi.mocked(useGetCurrentOrganizationType);
const mockedUseTranslation = vi.mocked(useTranslation);

const mockTranslation = (key: string): string => {
    if (key.includes("status.active")) { return "Active"; }
    if (key.includes("status.inactive")) {return "Inactive";}
    if (key.includes("status.configured")) {return "Configured";}
    if (key.includes("status.notConfigured")) {return "Not Configured";}
    return key; };

describe("ActionTypesListingPage", () => { beforeEach((): void => {
        mockedUseCheckFeatureStatus.mockReturnValue("ENABLED" as never);
        mockedUseGetCurrentOrganizationType.mockReturnValue({isSubOrganization: false} as never);
        mockedUseTranslation.mockReturnValue({ t: mockTranslation } as never);
        mockedUseGetActionTypes.mockReturnValue({ data: [{count: 1,type: "preIssueAccessToken"}], error: undefined, isLoading: false, mutate: vi.fn()} as never);
        mockedUseGetActionsByType.mockReturnValue({ data: []} as never);});

    it("renders the configured and active status tags when the action is active", () => {
        mockedUseGetActionsByType.mockReturnValue({data: [{ status: ActionsConstants.ACTIVE_STATUS }]} as never);
        render(<ActionTypesListingPage />);
        expect(screen.getByText("Configured")).toBeTruthy();
        expect(screen.getByText("Active")).toBeTruthy();
    });

    it("renders the inactive status tag when the action is inactive", () => {
        mockedUseGetActionsByType.mockReturnValue({data: [{status: "inactive"}]} as never);
        render(<ActionTypesListingPage />);
        expect(screen.getByText("Configured")).toBeTruthy();
        expect(screen.getByText("Inactive")).toBeTruthy();
    });
});