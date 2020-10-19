/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { TestableComponentInterface } from "@wso2is/core/models";
import _ from "lodash";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

/**
 *Interface to contain props needed for treeview component
 */
export interface TreeViewProps extends TestableComponentInterface {
    data: TreeNode[];
    depth?: number;
    deleteElement?: ReactElement;
    getStyleClassCb?: (node, depth?) => {};

    isCheckable?: (node: TreeNode, depth: number) => {};
    isDeletable?: (node: TreeNode, depth: number) => {};
    isExpandable?: (node: TreeNode, depth: number) => {};

    keywordChildren?: string;
    keywordChildrenLoading?: string;
    keywordKey?: string;
    keywordLabel?: string;

    loadingElement?: ReactElement;
    noChildrenAvailableMessage?: string;

    onCheckToggleCb?: (arrayOfNodes: TreeNode[], depth: number) => void;
    onDeleteCb?: (node: TreeNode, updatedData: any, depth: number) => {};
    onExpandToggleCb?: (node: TreeNode, depth: number) => void;
    onUpdateCb?: (updatedData: any, depth: number) => void;

    transitionEnterTimeout?: number;
    transitionExitTimeout?: number;
}

/**
 * Interface to contain Tree node data
 */
interface TreeNode {
    id: string;
    name: string;
    isExpanded: boolean;
    isChecked: boolean;
    children?: TreeNode[];
    isPartiallyChecked: boolean;
}

/**
 * A Component which will return a tree view for a given set of node data.
 * 
 * @param {TreeViewProps} props - Props to create a tree view component
 *
 * @return {React.ReactElement}
 */
export const TreeView: FunctionComponent<TreeViewProps> = (props: TreeViewProps): ReactElement => {

    const {
        data,
        [ "data-testid" ]: testId
    } = props;

    const [ treeData, setTreeData ] = useState<TreeNode[]>();
    const [ lastCheckToggledNodeIndex, setLastCheckToggledNodeIndex ] = useState<number>();

    useEffect(() => {
        setTreeData(_.cloneDeep(data));
    },[data]);

    /**
     * Util method to handle tree update function.
     * 
     * @param updatedData object with updated tree data
     */
    const handleUpdate = (updatedData: any): void => {
        const { depth, onUpdateCb } = props;
        onUpdateCb(updatedData, depth);
    };

    /**
     * Util method to handle tree node check.
     * 
     * @param node Tree node
     * @param e Event Object
     */
    const handleCheckToggle = (node: TreeNode, e: any) => {
        const { onCheckToggleCb, depth } = props;
        const data = _.cloneDeep(treeData);
        const currentNode = _.find(data, node);
        const currentNodeIndex = data.indexOf(currentNode);
        const toggledNodes = [];

        if (e.shiftKey && !_.isNil(lastCheckToggledNodeIndex)) {
            const rangeStart = Math.min(
                currentNodeIndex,
                lastCheckToggledNodeIndex
            );

            const rangeEnd = Math.max(
                currentNodeIndex,
                lastCheckToggledNodeIndex
            );

            const nodeRange = data.slice(rangeStart, rangeEnd + 1);

            nodeRange.forEach((node) => {
                node.isChecked = e.target.checked;
                toggledNodes.push(node);
            });
        } else {
            currentNode.isChecked = e.target.checked;
            toggledNodes.push(currentNode);
        }

        onCheckToggleCb(toggledNodes, depth);
        setLastCheckToggledNodeIndex(currentNodeIndex);
        handleUpdate(data);
    };

    /**
     * Util method to handle tree node delete.
     * 
     * @param node Tree node
     */
    const handleDelete = (node: any) => {
        const { onDeleteCb, depth } = props;
        const data = _.cloneDeep(treeData);

        const newData = data.filter((nodeItem) => {
            return !_.isEqual(node, nodeItem);
        });

        onDeleteCb(node, newData, depth) && handleUpdate(newData);
    };

    /**
     * Util method to handle expanding of a selected tree node.
     * 
     * @param node Expanded tree node
     */
    const handleExpandToggle = (node: TreeNode) => {
        const { onExpandToggleCb, depth } = props;
        const data = _.cloneDeep(treeData);
        const currentNode = _.find(data, node);

        currentNode.isExpanded = !currentNode.isExpanded;

        if (onExpandToggleCb) {
            onExpandToggleCb(currentNode, depth);
        }

        handleUpdate(data);
    };

    /**
     * Util method to print a checkbox for a given tree node.
     * 
     * @param node Tree node to print the check box
     */
    const printCheckbox = (node: TreeNode) => {
        const { isCheckable, keywordLabel, depth } = props;
        const nodeText = _.get(node, keywordLabel, "");

        if (isCheckable(node, depth)) {
            return (
                <label htmlFor={ node.id } className="tree-label">
                    <input
                        type="checkbox"
                        name={ node[keywordLabel] }
                        className="invisible"
                        onChange={ (e) => {
                            handleCheckToggle(node, e);
                        } }
                        checked={ !!node.isChecked }
                        id={ node.id }
                    />
                    <div className={ "checkbox " + (node.isPartiallyChecked ? "indeterminate" : "") }>
                        <svg width="17px" height="17px" viewBox="0 0 20 20">
                            <path d="M3,1 L17,1 L17,1 C18.1045695,1 19,1.8954305 19,3 L19,17 L19,17 C19,
                                18.1045695 18.1045695,19 17,19 L3,19 L3,19 C1.8954305,19 1,18.1045695 1,17 L1,3 L1,
                                3 C1,1.8954305 1.8954305,1 3,1 Z"></path>
                            <polyline className="tick" points="4 11 8 15 16 6" />
                            <polyline className="dash" points="5 10 15 10 20" />
                        </svg>
                    </div>
                    <span>{ nodeText }</span>
                </label>
            );
        }
    };

    /**
     * Util method to print a delete button for a given tree node.
     * 
     * @param node Tree node to print delete button
     */
    const printDeleteButton = (node: TreeNode) => {
        const { isDeletable, depth, deleteElement } = props;

        if (isDeletable(node, depth)) {
            return (
                <div className="delete-btn"
                    onClick={ () => {
                        handleDelete(node);
                    } }
                >
                    { deleteElement }
                </div>
            );
        }
    };

    /**
     * Util method to print the expand button of a given tree node.
     * 
     * @param node Tree node to draw the expand button
     */
    const printExpandButton = (node: TreeNode): ReactElement => {
        const className = node.isExpanded ? "" : "active";
        const { isExpandable, depth } = props;

        if (isExpandable(node, depth)) {
            return (
                <div 
                    className="tree-arrow-wrap"
                    onClick={ () => {
                        handleExpandToggle(node);
                    } }
                >
                    <span className={ `tree-arrow ${className}` }>
                        <span></span>
                        <span></span>
                    </span>
                </div>
            );
        } else {
            return (
                <div className="tree-arrow-wrap">
                    <span className="tree-arrow">
                        <span></span>
                        <span></span>
                    </span>
                </div>
            );
        }
    };

    /**
     * Util method to print a text where no children is available.
     */
    const printNoChildrenMessage = () => {
        const {
            transitionExitTimeout,
            noChildrenAvailableMessage
        } = props;
        
        const noChildrenTransitionProps = {
            classNames: "treeview-no-children-transition",
            key: "treeview-no-children",
            style: {
                transitionDuration: `${transitionExitTimeout}ms`,
                transitionDelay: `${transitionExitTimeout}ms`
            },
            timeout: {
                enter: transitionExitTimeout
            },
            exit: false
        };

        return (
            <CSSTransition { ...noChildrenTransitionProps }>
                <div className="treeview-no-children">
                    <div className="treeview-no-children-content">
                        { noChildrenAvailableMessage }
                    </div>
                </div>
            </CSSTransition>
        );
    };

    const printNodes = (nodeArray: TreeNode[]) => {
        const {
            keywordKey,
            transitionEnterTimeout,
            transitionExitTimeout,
            getStyleClassCb
        } = props;

        const nodeTransitionProps = {
            classNames: "treeview-node-transition",
            style: {
                transitionDuration: `${transitionEnterTimeout}ms`
            },
            timeout: {
                enter: transitionEnterTimeout,
                exit: transitionExitTimeout
            }
        };

        return (
            <TransitionGroup>
                { _.isEmpty(nodeArray) ? printNoChildrenMessage() : nodeArray.map((node, index) => {
                    return (
                        <CSSTransition
                            { ...nodeTransitionProps }
                            key={ node[keywordKey] || index }
                        >
                            <div
                                className={ "treeview-node" + getStyleClassCb(node) }
                            >
                                <div className={ `treeview-node-content ${!node.children 
                                    || node.children.length == 0 ? "no-child" : ""}` }>
                                    { node.children && node.children.length != 0 ? printExpandButton(node) : "" }
                                    { printCheckbox(node) }
                                    { printDeleteButton(node) }
                                </div>
                                { printChildren(node) }
                            </div>
                        </CSSTransition>
                    );
                }) }
            </TransitionGroup>
        );
    };

    const printChildren = (node: any) => {
        if (!node.isExpanded) {
            return null;
        }

        const { keywordChildren, keywordChildrenLoading, depth } = props;
        const isChildrenLoading = _.get(node, keywordChildrenLoading, false);
        let childrenElement;

        if (isChildrenLoading) {
            childrenElement = _.get(props, "loadingElement");
        } else {
            childrenElement = (
                <TreeView
                    { ...props }
                    data={ node[keywordChildren] || [] }
                    depth={ depth + 1 }
                    onUpdateCb={ onChildrenUpdateCb.bind(this) }
                />
            );
        }

        return (
            <div className="treeview-children-container">
                { childrenElement }
            </div>
        );

        function onChildrenUpdateCb(updatedData) {
            const data = _.cloneDeep(treeData);
            const currentNode = _.find(data, node);

            currentNode[keywordChildren] = updatedData;
            handleUpdate(data);
        }
    };

    return (
        <div className="treeview" data-testid={ testId }>
            { printNodes(treeData) }
        </div>
    )
};

TreeView.defaultProps = {
    "data-testid": "treeview",
    depth: 0,
    deleteElement: <div>(X)</div>,
    keywordChildren: "children",
    keywordChildrenLoading: "isChildrenLoading",
    keywordLabel: "name",
    keywordKey: "id",
    loadingElement: <div>loading...</div>,
    noChildrenAvailableMessage: "No data found",
    transitionEnterTimeout: 1200,
    transitionExitTimeout: 1200,

    getStyleClassCb: (/* node, depth */) => { return ""; },
    isCheckable: (/* node, depth */) => { return true; },
    isDeletable: (/* node, depth */) => { return true; },
    isExpandable: (/* node, depth */) => { return true; }
};
