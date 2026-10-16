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

import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import LinearProgress from "@oxygen-ui/react/LinearProgress";
import Typography from "@oxygen-ui/react/Typography";
import useGlobalVariables from "@wso2is/admin.core.v1/hooks/use-global-variables";
import useGetOrganizations from "@wso2is/admin.organizations.v1/api/use-get-organizations";
import {
    OrganizationInterface,
    OrganizationLinkInterface,
    OrganizationListInterface
} from "@wso2is/admin.organizations.v1/models/organizations";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import isEmpty from "lodash-es/isEmpty";
import React, {
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    SyntheticEvent,
    useEffect,
    useRef,
    useState
} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { CustomTreeItem } from "./custom-tree-item";
import "./selective-org-subscription.scss";
import { OrgTreeViewItemInterface } from "../models/selective-org-subscription";
import { dedupeTree, getChildrenOfOrganization, updateTreeWithChildren } from "../utils/org-tree-utils";

/**
 * Number of top level organizations fetched per page.
 */
const TOP_LEVEL_PAGE_SIZE: number = 15;

/**
 * Scroll container ID, referenced by the infinite scroll target.
 */
const SCROLL_CONTAINER_ID: string = "selective-org-subscription-scroll-panel";

/**
 * Suffix of the stand-in child given to a node whose children have not been fetched yet.
 */
const PLACEHOLDER_ITEM_ID_SUFFIX: string = "-temp-child";

/**
 * Whether a tree item is a placeholder rather than a real organization.
 *
 * A placeholder is visible for as long as its parent's children are in flight, and stays for
 * good when that request fails or reports no children, so it is reachable rather than
 * theoretical. It carries no organization, so it must never reach the selection.
 */
const isPlaceholderItemId = (itemId: string): boolean => Boolean(itemId?.endsWith(PLACEHOLDER_ITEM_ID_SUFFIX));

interface SelectiveOrgSubscriptionPropsInterface extends IdentifiableComponentInterface {
    /**
     * IDs of the organizations that are currently selected.
     */
    selectedOrgIds: string[];
    /**
     * Called with the full new selection whenever the user ticks or unticks an organization.
     */
    onChange: (orgIds: string[]) => void;
    /**
     * Renders the tree read-only and dimmed.
     */
    disabled?: boolean;
    /**
     * Expand the top level nodes once the first page has loaded.
     *
     * Costs one request per top level organization, so it is opt-in.
     */
    autoExpandFirstLevel?: boolean;
    /**
     * Organizations to expand on load, on top of {@link autoExpandFirstLevel}.
     *
     * Intended for the parents of the current selection, so a saved selection is visible
     * without hunting for it. Supply them parents-first: a node can only be expanded once its
     * own parent has been expanded and its children are in the tree.
     */
    autoExpandOrgIds?: string[];
    /**
     * Label shown on the expand/collapse control while everything is collapsed. The control is
     * only rendered when a label is supplied, so that this component carries no feature specific
     * i18n keys.
     */
    expandAllLabel?: string;
    /**
     * Label shown on the same control once anything is expanded.
     */
    collapseAllLabel?: string;
    /**
     * Alert message shown when the organization list cannot be fetched. The strings are
     * supplied by the consumer so that this component carries no feature specific i18n keys.
     */
    fetchErrorMessage?: string;
    /**
     * Alert description shown alongside {@link fetchErrorMessage}.
     */
    fetchErrorDescription?: string;
    /**
     * Text rendered in place of the tree when the organization has no child organizations.
     */
    emptyPlaceholderText?: string;
}

/**
 * Tree nodes for a fetched page, with the flat map entries they imply.
 */
interface BuiltOrganizationTreeInterface {
    nodes: OrgTreeViewItemInterface[];
    organizations: Record<string, OrganizationInterface>;
}

/**
 * Organization tree picker for selecting an explicit subset of child organizations.
 *
 * Selection does not cascade: ticking an organization subscribes only that organization,
 * never its descendants. Child organizations are fetched lazily when a node is expanded,
 * and the top level is paged in as the user scrolls.
 *
 * Because children are fetched one parent at a time, expanding several nodes at once is
 * sequenced through a queue rather than issued in parallel.
 */
const SelectiveOrgSubscription: FunctionComponent<SelectiveOrgSubscriptionPropsInterface> = ({
    selectedOrgIds,
    onChange,
    disabled = false,
    autoExpandFirstLevel = false,
    autoExpandOrgIds,
    expandAllLabel,
    collapseAllLabel,
    fetchErrorMessage,
    fetchErrorDescription,
    emptyPlaceholderText,
    ["data-componentid"]: componentId = "selective-org-subscription"
}: SelectiveOrgSubscriptionPropsInterface): ReactElement => {

    const dispatch: Dispatch = useDispatch();
    const { isOrganizationManagementEnabled } = useGlobalVariables();

    const [ organizationTree, setOrganizationTree ] = useState<OrgTreeViewItemInterface[]>([]);
    const [ flatOrganizationMap, setFlatOrganizationMap ] = useState<Record<string, OrganizationInterface>>({});
    const [ expandedItems, setExpandedItems ] = useState<string[]>([]);
    const [ expandedOrgId, setExpandedOrgId ] = useState<string>();
    const [ afterCursor, setAfterCursor ] = useState<string>();
    const [ nextPageLink, setNextPageLink ] = useState<string>();
    const [ isNextPageAvailable, setIsNextPageAvailable ] = useState<boolean>(false);
    const [ expansionQueue, setExpansionQueue ] = useState<string[]>([]);
    const [ isExpandingAll, setIsExpandingAll ] = useState<boolean>(false);

    const inFlightExpansionRef: MutableRefObject<string> = useRef<string>(null);
    const hasSeededExpansionRef: MutableRefObject<boolean> = useRef<boolean>(false);

    // Top level organizations, paged in via the `after` cursor.
    const {
        data: topLevelOrganizations,
        isLoading: isTopLevelOrganizationsLoading,
        error: topLevelOrganizationsFetchRequestError
    } = useGetOrganizations<OrganizationListInterface>(
        isOrganizationManagementEnabled,
        null,
        TOP_LEVEL_PAGE_SIZE,
        !isEmpty(afterCursor) ? afterCursor : null,
        null,
        false,
        false
    );

    // Children of the organization that was last expanded.
    const {
        data: childOrganizations,
        error: childOrganizationsFetchRequestError
    } = useGetOrganizations<OrganizationListInterface>(
        isOrganizationManagementEnabled && !isEmpty(expandedOrgId),
        `parentId eq '${ expandedOrgId }'`,
        null,
        null,
        null,
        false,
        false
    );

    /**
     * Turn a flat page of organizations into tree nodes and their flat map entries.
     *
     * A node that reports `hasChildren` is given a placeholder child so that the tree view
     * renders an expand affordance before the real children have been fetched.
     *
     * Pure: the caller merges the entries. Recording them here would mean writing state from
     * inside a `setOrganizationTree` updater, and reading the current map from the closure to
     * do it -- two pages landing in one batch would then both build on the same stale map and
     * the second would drop the first's entries, leaving organizations that expand-all never
     * walks into.
     */
    const buildChildTree = (
        data: OrganizationInterface[],
        parentOrgId?: string
    ): BuiltOrganizationTreeInterface => {
        const nodes: OrgTreeViewItemInterface[] = [];
        const organizations: Record<string, OrganizationInterface> = {};

        data.forEach((item: OrganizationInterface) => {
            nodes.push({
                children: item.hasChildren
                    ? [ {
                        children: [],
                        id: `${ item.id }${ PLACEHOLDER_ITEM_ID_SUFFIX }`,
                        label: "Loading..."
                    } ]
                    : [],
                id: item.id,
                label: item.name,
                parentId: item.parentId ?? parentOrgId
            });

            organizations[item.id] = {
                hasChildren: item.hasChildren,
                id: item.id,
                name: item.name,
                parentId: item.parentId ?? parentOrgId,
                ref: item.ref,
                status: item.status
            };
        });

        return { nodes, organizations };
    };

    /**
     * Merge newly built entries into the flat map, leaving any organization already recorded as
     * it is -- the existing entry carries whatever a later page would only repeat.
     */
    const mergeOrganizationsIntoFlatMap = (organizations: Record<string, OrganizationInterface>): void => {
        setFlatOrganizationMap((prev: Record<string, OrganizationInterface>) => ({ ...organizations, ...prev }));
    };

    /**
     * Collapse every descendant of the given organization, so that a re-expand refetches
     * rather than showing a stale subtree.
     */
    const collapseChildNodes = (parentId: string): void => {
        const children: string[] = getChildrenOfOrganization(parentId, flatOrganizationMap);

        children.forEach((childId: string) => {
            setExpandedItems((prev: string[]) => prev.filter((id: string) => id !== childId));
            collapseChildNodes(childId);
        });
    };

    /**
     * Advance the top level cursor to the next page.
     */
    const loadMoreOrganizations = (): void => {
        const cursorFragments: string[] = nextPageLink?.split("after=") ?? [];

        if (cursorFragments.length < 2) {
            setIsNextPageAvailable(false);

            return;
        }

        setAfterCursor(cursorFragments[1]);
    };

    /**
     * Queue an expansion, ignoring nodes that are already expanded or already queued.
     */
    const queueExpansions = (orgIds: string[]): void => {
        setExpansionQueue((prev: string[]) => {
            const additions: string[] = orgIds.filter(
                (id: string) => !prev.includes(id) && !expandedItems.includes(id)
            );

            return additions.length === 0 ? prev : [ ...prev, ...additions ];
        });
    };

    const handleExpandAll = (): void => {
        setIsExpandingAll(true);
    };

    /**
     * One control rather than two: with everything collapsed the only useful action is to expand,
     * and with anything open the only useful action is to collapse. Collapsing mid-run also aborts
     * an expand-all that is still walking the tree.
     */
    const handleToggleAll = (): void => {
        if (expandedItems.length > 0) {
            handleCollapseAll();
        } else {
            handleExpandAll();
        }
    };

    const handleCollapseAll = (): void => {
        setIsExpandingAll(false);
        setExpansionQueue([]);
        inFlightExpansionRef.current = null;
        setExpandedItems([]);
    };

    // Merge each newly fetched page of top level organizations into the tree.
    useEffect(() => {
        if (!(topLevelOrganizations?.organizations?.length > 0)) {
            return;
        }

        const { nodes, organizations }: BuiltOrganizationTreeInterface =
            buildChildTree(topLevelOrganizations.organizations);

        mergeOrganizationsIntoFlatMap(organizations);

        setOrganizationTree((prev: OrgTreeViewItemInterface[]) => {
            if (prev.length === 0) {
                return nodes;
            }

            // Deduped against the whole tree, not just the roots: an organization already spliced
            // in as someone's child can arrive again on a later page of the top level listing.
            return dedupeTree([ ...prev, ...nodes ]);
        });

        const nextLink: OrganizationLinkInterface | undefined = topLevelOrganizations.links?.find(
            (link: OrganizationLinkInterface) => link.rel === "next"
        );

        if (nextLink?.href) {
            setNextPageLink(nextLink.href);
            setIsNextPageAvailable(true);
        } else {
            setIsNextPageAvailable(false);
        }
    }, [ topLevelOrganizations ]);

    /**
     * Splice lazily fetched children into the node they belong to.
     *
     * The parent is taken from the response rather than from `expandedOrgId`. The effect only
     * depends on the response, so with expansions running back to back the state can already have
     * moved on by the time one resolves — splicing against it would file a node's children under a
     * sibling, putting the same organization in the tree twice.
     */
    useEffect(() => {
        if (!(childOrganizations?.organizations?.length > 0)) {
            return;
        }

        const parentOrgId: string = childOrganizations.organizations[0]?.parentId ?? expandedOrgId;

        if (isEmpty(parentOrgId)) {
            return;
        }

        const { nodes, organizations }: BuiltOrganizationTreeInterface =
            buildChildTree(childOrganizations.organizations, parentOrgId);

        mergeOrganizationsIntoFlatMap(organizations);

        setOrganizationTree((prev: OrgTreeViewItemInterface[]) => dedupeTree(
            updateTreeWithChildren(prev, parentOrgId, nodes)
        ));
    }, [ childOrganizations ]);

    /**
     * Seed the initial expansion once the first page of the tree exists.
     *
     * The hinted organizations are appended after the top level ones so that a parent is
     * always expanded before any of its descendants is attempted.
     */
    useEffect(() => {
        if (hasSeededExpansionRef.current || !(organizationTree.length > 0)) {
            return;
        }

        hasSeededExpansionRef.current = true;

        const seeds: string[] = [];

        if (autoExpandFirstLevel) {
            organizationTree.forEach((node: OrgTreeViewItemInterface) => {
                if (flatOrganizationMap[node.id]?.hasChildren) {
                    seeds.push(node.id);
                }
            });
        }

        autoExpandOrgIds?.forEach((orgId: string) => {
            if (!seeds.includes(orgId)) {
                seeds.push(orgId);
            }
        });

        if (seeds.length > 0) {
            setExpansionQueue(seeds);
        }
    }, [ organizationTree ]);

    // Start the next queued expansion once the previous one has settled.
    useEffect(() => {
        if (inFlightExpansionRef.current || expansionQueue.length === 0) {
            return;
        }

        const next: string = expansionQueue[0];

        inFlightExpansionRef.current = next;
        setExpandedOrgId(next);
        setExpandedItems((prev: string[]) => prev.includes(next) ? prev : [ ...prev, next ]);
    }, [ expansionQueue ]);

    /**
     * Release the queue once the in-flight request settles.
     *
     * Keyed on the response rather than on its contents: a node whose children come back empty
     * must still release the queue, or everything behind it stalls. A failed request releases it
     * too -- the hook does not retry, so holding the slot would strand every expansion behind it
     * for the rest of the session. The error is reported separately.
     *
     * The settled response is matched against `expandedOrgId` so that the slot is only released
     * by the request it actually belongs to. `expansionQueue` is a dependency because re-expanding
     * the organization that was last expanded leaves the request key unchanged: the cached
     * response never re-renders, and only the queue moving signals that there is a slot to free.
     */
    useEffect(() => {
        const inFlightOrgId: string = inFlightExpansionRef.current;

        if (!inFlightOrgId || inFlightOrgId !== expandedOrgId) {
            return;
        }

        const hasSettled: boolean =
            childOrganizations !== undefined || childOrganizationsFetchRequestError !== undefined;

        if (!hasSettled) {
            return;
        }

        inFlightExpansionRef.current = null;
        setExpansionQueue((prev: string[]) => prev.slice(1));
    }, [ childOrganizations, childOrganizationsFetchRequestError, expandedOrgId, expansionQueue ]);

    /**
     * Drive expand-all one layer at a time.
     *
     * Newly fetched children enter the flat map, so re-running this queues the next layer down
     * until nothing expandable is left — at which point the run ends on its own.
     */
    useEffect(() => {
        if (!isExpandingAll) {
            return;
        }

        const expandable: string[] = Object.keys(flatOrganizationMap).filter(
            (orgId: string) => flatOrganizationMap[orgId]?.hasChildren
                && !expandedItems.includes(orgId)
                && !expansionQueue.includes(orgId)
        );

        if (expandable.length > 0) {
            queueExpansions(expandable);
        } else if (expansionQueue.length === 0) {
            setIsExpandingAll(false);
        }
    }, [ isExpandingAll, flatOrganizationMap, expandedItems, expansionQueue ]);

    useEffect(() => {
        if (!topLevelOrganizationsFetchRequestError && !childOrganizationsFetchRequestError) {
            return;
        }

        if (!fetchErrorMessage && !fetchErrorDescription) {
            return;
        }

        dispatch(addAlert({
            description: fetchErrorDescription,
            level: AlertLevels.ERROR,
            message: fetchErrorMessage
        }));
    }, [ topLevelOrganizationsFetchRequestError, childOrganizationsFetchRequestError ]);

    const hasOrganizations: boolean = organizationTree.length > 0;

    if (!isTopLevelOrganizationsLoading && !hasOrganizations) {
        return (
            <Box className="selective-org-subscription-container" data-componentid={ `${ componentId }-empty` }>
                <Typography variant="body2" color="text.secondary">
                    { emptyPlaceholderText }
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            className={ `selective-org-subscription-container${ disabled ? " disabled" : "" }` }
            data-componentid={ componentId }
        >
            { (expandAllLabel || collapseAllLabel) && (
                <Box className="selective-org-subscription-toolbar">
                    <Button
                        size="small"
                        variant="text"
                        onClick={ handleToggleAll }
                        disabled={ disabled }
                        data-componentid={ `${ componentId }-toggle-all` }
                    >
                        { expandedItems.length > 0 ? collapseAllLabel : expandAllLabel }
                    </Button>
                </Box>
            ) }
            <Box className="selective-org-subscription-scroll-panel" id={ SCROLL_CONTAINER_ID }>
                <InfiniteScroll
                    dataLength={ organizationTree.length }
                    next={ loadMoreOrganizations }
                    hasMore={ isNextPageAvailable }
                    loader={ <LinearProgress /> }
                    scrollableTarget={ SCROLL_CONTAINER_ID }
                >
                    <RichTreeView
                        data-componentid={ `${ componentId }-tree-view` }
                        items={ organizationTree }
                        expandedItems={ expandedItems }
                        expansionTrigger="iconContainer"
                        onItemExpansionToggle={ (
                            _event: SyntheticEvent,
                            itemId: string,
                            expanded: boolean
                        ) => {
                            // A manual expansion takes over the single child request, so any
                            // queued run is abandoned rather than left to resolve against the
                            // wrong node.
                            setIsExpandingAll(false);
                            setExpansionQueue([]);
                            inFlightExpansionRef.current = null;

                            if (expanded) {
                                setExpandedOrgId(itemId);
                                setExpandedItems((prev: string[]) => [ ...prev, itemId ]);
                            } else {
                                setExpandedItems((prev: string[]) => prev.filter((id: string) => id !== itemId));
                                collapseChildNodes(itemId);
                            }
                        } }
                        onSelectedItemsChange={ (_event: SyntheticEvent, itemIds: string[]) => {
                            if (disabled) {
                                return;
                            }

                            onChange((itemIds ?? []).filter(
                                (itemId: string) => !isPlaceholderItemId(itemId)
                            ));
                        } }
                        selectedItems={ selectedOrgIds }
                        isItemDisabled={ (item: OrgTreeViewItemInterface) => isPlaceholderItemId(item.id) }
                        checkboxSelection
                        multiSelect
                        disableSelection={ disabled }
                        selectionPropagation={ {
                            descendants: false,
                            parents: false
                        } }
                        slots={ {
                            item: CustomTreeItem
                        } }
                    />
                </InfiniteScroll>
            </Box>
        </Box>
    );
};

export default SelectiveOrgSubscription;
