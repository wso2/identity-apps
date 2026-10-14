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

import { TreeViewBaseItem } from "@mui/x-tree-view/models";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import Box from "@oxygen-ui/react/Box";
import Checkbox from "@oxygen-ui/react/Checkbox";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import Code from "@oxygen-ui/react/Code";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Grid from "@oxygen-ui/react/Grid";
import LinearProgress from "@oxygen-ui/react/LinearProgress";
import Typography from "@oxygen-ui/react/Typography";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { getOrganizations } from "@wso2is/admin.organizations.v1/api/organization";
import {
    OrganizationInterface,
    OrganizationLinkInterface,
    OrganizationListInterface
} from "@wso2is/admin.organizations.v1/models";
import { CustomTreeItem } from "@wso2is/common.ui.shared-access.v1/components/custom-tree-item";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmptyPlaceholder } from "@wso2is/react-components";
import React, {
    ChangeEvent,
    Dispatch,
    FunctionComponent,
    ReactElement,
    SetStateAction,
    SyntheticEvent,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch } from "react-redux";
import { Dispatch as ReduxDispatch } from "redux";
import { ChildOrgReach } from "../models/organization-management";
import "./organization-selection.scss";

/**
 * Number of organizations in one page of the top level.
 */
const TOP_LEVEL_PAGE_SIZE: number = 15;

/**
 * Number of child organizations in one request.
 */
const CHILDREN_PAGE_SIZE: number = 100;

/**
 * Suffix of the ID of the placeholder item of an organization whose children are not loaded.
 */
const PLACEHOLDER_SUFFIX: string = "#loading";

interface OrganizationNode {
    id: string;
    name: string;
    parentId?: string;
    hasChildren: boolean;
}

interface OrganizationSelectionPropsInterface extends IdentifiableComponentInterface {
    /**
     * The selected organizations, with their reach.
     */
    selected: Record<string, ChildOrgReach>;
    /**
     * Called with the new selection.
     */
    onChange: Dispatch<SetStateAction<Record<string, ChildOrgReach>>>;
    /**
     * Whether the organizations below the child organizations can be opened and selected. A check
     * also checks the parent organizations, and an uncheck also unchecks the child organizations.
     * Without it, only the child organizations of the current organization show.
     */
    isTree: boolean;
    /**
     * Label of the checkbox that includes the existing and future child organizations.
     */
    includeChildOrganizationsLabel: string;
    /**
     * Whether the selection is read-only.
     */
    readOnly?: boolean;
}

/**
 * Selection of organizations, with the layout of the organization selection of the shared access
 * of applications and users. The left panel shows the organizations of the identity provider as a
 * tree with checkboxes. The right panel shows the settings of the organization that the user
 * clicks: whether the selection includes its existing and future child organizations.
 */
const OrganizationSelection: FunctionComponent<OrganizationSelectionPropsInterface> = ({
    selected,
    onChange,
    isTree,
    includeChildOrganizationsLabel,
    readOnly = false,
    ["data-componentid"]: componentId = "cds-organization-selection"
}: OrganizationSelectionPropsInterface): ReactElement => {

    const { t } = useTranslation();
    const dispatch: ReduxDispatch = useDispatch();

    const [ nodes, setNodes ] = useState<Record<string, OrganizationNode>>({});
    const [ topLevelIds, setTopLevelIds ] = useState<string[]>([]);
    const [ childIds, setChildIds ] = useState<Record<string, string[]>>({});
    const [ expandedItems, setExpandedItems ] = useState<string[]>([]);
    const [ nextPageCursor, setNextPageCursor ] = useState<string>(null);
    const [ isTopLevelLoading, setIsTopLevelLoading ] = useState<boolean>(true);
    const [ focusedId, setFocusedId ] = useState<string>(null);
    const loadingChildren: React.MutableRefObject<Set<string>> = useRef<Set<string>>(new Set<string>());

    const scrollTargetId: string = `${ componentId }-scroll-container`;

    const showFetchError = (): void => {
        dispatch(addAlert({
            description: t("customerDataService:organizationSelection.notifications.fetch.error.description"),
            level: AlertLevels.ERROR,
            message: t("customerDataService:organizationSelection.notifications.fetch.error.message")
        }));
    };

    const cursorOf = (list: OrganizationListInterface): string => {
        const next: OrganizationLinkInterface = list?.links?.find(
            (link: OrganizationLinkInterface) => link.rel === "next");
        const fragments: string[] = next?.href?.split("after=") ?? [];

        return fragments.length > 1 ? decodeURIComponent(fragments[1].split("&")[0]) : null;
    };

    const addNodes = (orgs: OrganizationInterface[], parentId?: string): void => {
        setNodes((previous: Record<string, OrganizationNode>) => {
            const next: Record<string, OrganizationNode> = { ...previous };

            orgs.forEach((org: OrganizationInterface) => {
                next[org.id] = {
                    hasChildren: isTree && Boolean(org.hasChildren),
                    id: org.id,
                    name: org.name,
                    parentId
                };
            });

            return next;
        });
    };

    const loadTopLevel = (after: string): void => {
        getOrganizations(null, TOP_LEVEL_PAGE_SIZE, after, null, false)
            .then((list: OrganizationListInterface) => {
                const orgs: OrganizationInterface[] = list?.organizations ?? [];

                addNodes(orgs);
                setTopLevelIds((previous: string[]) => [
                    ...previous,
                    ...orgs.map((org: OrganizationInterface) => org.id)
                        .filter((id: string) => !previous.includes(id))
                ]);
                setFocusedId((previous: string) => previous
                    ?? orgs.find((org: OrganizationInterface) => org.id in selected)?.id
                    ?? orgs[0]?.id
                    ?? null);
                setNextPageCursor(cursorOf(list));
            })
            .catch(() => {
                setNextPageCursor(null);
                showFetchError();
            })
            .finally(() => setIsTopLevelLoading(false));
    };

    const loadChildren = async (parentId: string): Promise<void> => {
        if (loadingChildren.current.has(parentId) || childIds[parentId]) return;
        loadingChildren.current.add(parentId);

        try {
            const orgs: OrganizationInterface[] = [];
            let after: string = null;

            do {
                const list: OrganizationListInterface = await getOrganizations(
                    `parentId eq '${ parentId }'`, CHILDREN_PAGE_SIZE, after, null, false);

                orgs.push(...(list?.organizations ?? []));
                after = cursorOf(list);
            } while (after);
            addNodes(orgs, parentId);
            setChildIds((previous: Record<string, string[]>) => ({
                ...previous,
                [ parentId ]: orgs.map((org: OrganizationInterface) => org.id)
            }));
        } catch {
            showFetchError();
        } finally {
            loadingChildren.current.delete(parentId);
        }
    };

    useEffect(() => {
        loadTopLevel(null);
    }, []);

    // An organization that is selected without its child organizations can have selected child
    // organizations, so its children are loaded and shown.
    useEffect(() => {
        if (!isTree) return;

        Object.values(nodes).forEach((node: OrganizationNode) => {
            if (selected[node.id] === "org" && node.hasChildren && !childIds[node.id]) {
                loadChildren(node.id);
                setExpandedItems((previous: string[]) =>
                    previous.includes(node.id) ? previous : [ ...previous, node.id ]);
            }
        });
    }, [ nodes, selected, childIds ]);

    const ancestorIdsOf = (id: string): string[] => {
        const result: string[] = [];

        for (let parent: string = nodes[id]?.parentId; parent && result.length < 64;
            parent = nodes[parent]?.parentId) {
            result.push(parent);
        }

        return result;
    };

    const descendantIdsOf = (id: string): string[] => {
        const result: string[] = [];
        const visit = (parent: string): void => {
            (childIds[parent] ?? []).forEach((child: string) => {
                result.push(child);
                visit(child);
            });
        };

        visit(id);

        return result;
    };

    // An organization is covered when a parent organization is selected with its child organizations.
    const isCovered = (id: string): boolean =>
        ancestorIdsOf(id).some((ancestor: string) => selected[ancestor] === "subtree");

    const toggleOrganization = (id: string, isChecked: boolean): void => {
        const next: Record<string, ChildOrgReach> = { ...selected };

        if (isChecked) {
            next[id] = next[id] ?? "subtree";
            if (isTree) {
                ancestorIdsOf(id).forEach((ancestor: string) => { next[ancestor] = next[ancestor] ?? "org"; });
            }
        } else {
            delete next[id];
            descendantIdsOf(id).forEach((child: string) => { delete next[child]; });
        }
        onChange(next);
    };

    const toggleChildOrganizations = (id: string, isIncluded: boolean): void => {
        const next: Record<string, ChildOrgReach> = { ...selected, [ id ]: isIncluded ? "subtree" : "org" };

        // The child organizations are covered now, so they are not selected on their own.
        if (isIncluded) {
            descendantIdsOf(id).forEach((child: string) => { delete next[child]; });
        }
        onChange(next);
    };

    const treeItems: TreeViewBaseItem[] = useMemo((): TreeViewBaseItem[] => {
        const build = (id: string): TreeViewBaseItem => {
            const node: OrganizationNode = nodes[id];
            let children: TreeViewBaseItem[] = [];

            if (childIds[id]) {
                children = childIds[id].filter((child: string) => nodes[child]).map(build);
            } else if (node.hasChildren) {
                children = [ {
                    children: [],
                    id: `${ id }${ PLACEHOLDER_SUFFIX }`,
                    label: t("customerDataService:organizationSelection.loading")
                } ];
            }

            return { children, id, label: node.name };
        };

        return topLevelIds.filter((id: string) => nodes[id]).map(build);
    }, [ nodes, topLevelIds, childIds ]);

    const checkedItems: string[] = useMemo(
        (): string[] => Object.keys(nodes).filter((id: string) => id in selected || isCovered(id)),
        [ nodes, selected ]
    );

    const isPlaceholder = (id: string): boolean => id.endsWith(PLACEHOLDER_SUFFIX);

    const renderSettings = (): ReactElement => {
        const node: OrganizationNode = focusedId ? nodes[focusedId] : undefined;

        if (!node) {
            return (
                <Box className="cds-organization-selection-empty-settings">
                    <Typography variant="h6">
                        { t("customerDataService:organizationSelection.emptyTitle") }
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        { t("customerDataService:organizationSelection.emptyDescription") }
                    </Typography>
                </Box>
            );
        }

        const covered: boolean = isCovered(node.id);

        return (
            <Box data-componentid={ `${ componentId }-settings` }>
                <Typography variant="body1" className="mb-3">
                    { t("customerDataService:organizationSelection.settingsFor") }{ " " }
                    <Code>{ node.name }</Code>
                </Typography>
                { covered && (
                    <Typography variant="body2" color="text.secondary">
                        { t("customerDataService:organizationSelection.covered") }
                    </Typography>
                ) }
                { !covered && !(node.id in selected) && (
                    <Typography variant="body2" color="text.secondary">
                        { t("customerDataService:organizationSelection.notSelected") }
                    </Typography>
                ) }
                { !covered && node.id in selected && (
                    <FormControlLabel
                        control={ <Checkbox /> }
                        label={ includeChildOrganizationsLabel }
                        checked={ selected[node.id] === "subtree" }
                        disabled={ readOnly }
                        onChange={ (_event: ChangeEvent<HTMLInputElement>, checked: boolean) =>
                            toggleChildOrganizations(node.id, checked) }
                        data-componentid={ `${ componentId }-include-child-organizations` }
                    />
                ) }
            </Box>
        );
    };

    if (isTopLevelLoading) {
        return (
            <Grid container className="cds-organization-selection" justifyContent="center" padding={ 2 }>
                <CircularProgress size={ 30 } />
            </Grid>
        );
    }

    if (topLevelIds.length === 0) {
        return (
            <Grid container className="cds-organization-selection" data-componentid={ `${ componentId }-no-orgs` }>
                <Grid xs={ 12 } padding={ 1 }>
                    <EmptyPlaceholder
                        className="p-0"
                        image={ getEmptyPlaceholderIllustrations().emptyList }
                        imageSize="mini"
                        subtitle={ [ t("customerDataService:organizationSelection.noOrganizations") ] }
                    />
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid container className="cds-organization-selection" data-componentid={ componentId }>
            <Grid
                xs={ 12 }
                md={ 4 }
                lg={ 3 }
                padding={ 1 }
                className="cds-organization-selection-left-panel"
                id={ scrollTargetId }
            >
                <InfiniteScroll
                    dataLength={ topLevelIds.length }
                    next={ () => loadTopLevel(nextPageCursor) }
                    hasMore={ Boolean(nextPageCursor) }
                    loader={ <LinearProgress /> }
                    scrollableTarget={ scrollTargetId }
                >
                    <RichTreeView
                        data-componentid={ `${ componentId }-tree-view` }
                        items={ treeItems }
                        expandedItems={ expandedItems }
                        expansionTrigger="iconContainer"
                        onItemExpansionToggle={ (_event: SyntheticEvent, itemId: string, isExpanded: boolean) => {
                            if (isExpanded) {
                                loadChildren(itemId);
                                setExpandedItems((previous: string[]) => [ ...previous, itemId ]);
                            } else {
                                setExpandedItems((previous: string[]) =>
                                    previous.filter((id: string) => id !== itemId));
                            }
                        } }
                        onItemSelectionToggle={ (_event: SyntheticEvent, itemId: string, isSelected: boolean) => {
                            if (readOnly || isPlaceholder(itemId) || isCovered(itemId)) return;
                            toggleOrganization(itemId, isSelected);
                            setFocusedId(itemId);
                        } }
                        onItemClick={ (_event: SyntheticEvent, itemId: string) => {
                            if (!isPlaceholder(itemId)) setFocusedId(itemId);
                        } }
                        isItemDisabled={ (item: TreeViewBaseItem) => isPlaceholder(item.id) }
                        selectedItems={ checkedItems }
                        checkboxSelection
                        multiSelect
                        selectionPropagation={ { descendants: false, parents: false } }
                        slots={ { item: CustomTreeItem } }
                    />
                </InfiniteScroll>
            </Grid>
            <Grid
                xs={ 12 }
                md={ 8 }
                lg={ 9 }
                paddingX={ 2 }
                paddingY={ 1 }
                className="cds-organization-selection-right-panel"
            >
                { renderSettings() }
            </Grid>
        </Grid>
    );
};

export default OrganizationSelection;
