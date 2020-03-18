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

import React, { FunctionComponent, ReactElement, useState, useEffect } from "react";
import _ from "lodash";
import { TransitionGroup, CSSTransition } from "react-transition-group";

interface TreeViewProps {
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

interface TreeNode {
    id: number;
    name: string;
    isExpanded: boolean;
    isChecked: boolean;
    children: TreeNode[];
}

export const TreeView: FunctionComponent<TreeViewProps> = (props: TreeViewProps): ReactElement => {

    const [ treeData, setTreeData ] = useState<TreeNode[]>();
    const [ lastCheckToggledNodeIndex, setLastCheckToggledNodeIndex ] = useState<number>();

    const {
        data
    } = props;

    useEffect(() => {
        setTreeData(_.cloneDeep(data));
    },[data]);

    const handleUpdate = (updatedData: any): void => {
        const { depth, onUpdateCb } = props;
        onUpdateCb(updatedData, depth);
    }

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
    }

    const handleDelete = (node: any) => {
        const { onDeleteCb, depth } = props;
        const data = _.cloneDeep(treeData);

        const newData = data.filter((nodeItem) => {
            return !_.isEqual(node, nodeItem);
        });

        onDeleteCb(node, newData, depth) && handleUpdate(newData);
    }

    const handleExpandToggle = (node: TreeNode) => {
        const { onExpandToggleCb, depth } = props;
        const data = _.cloneDeep(treeData);
        const currentNode = _.find(data, node);

        currentNode.isExpanded = !currentNode.isExpanded;

        if (onExpandToggleCb) {
            onExpandToggleCb(currentNode, depth);
        }

        handleUpdate(data);
    }

    const printCheckbox = (node: TreeNode) => {
        const { isCheckable, keywordLabel, depth } = props;
        const nodeText = _.get(node, keywordLabel, "");

        if (isCheckable(node, depth)) {
            return (
                <label htmlFor={node.name} className="tree-label">
                    <input
                        type="checkbox"
                        name={node[keywordLabel]}
                        className="invisible"
                        onClick={(e) => {
                            handleCheckToggle(node, e);
                        }}
                        checked={!!node.isChecked}
                        id={node.name}
                    />
                    <div className="checkbox">
                        <svg width="17px" height="17px" viewBox="0 0 20 20">
                            <path d="M3,1 L17,1 L17,1 C18.1045695,1 19,1.8954305 19,3 L19,17 L19,17 C19,
                                18.1045695 18.1045695,19 17,19 L3,19 L3,19 C1.8954305,19 1,18.1045695 1,17 L1,3 L1,
                                3 C1,1.8954305 1.8954305,1 3,1 Z"></path>
                            <polyline points="4 11 8 15 16 6"></polyline>
                        </svg>
                    </div>
                    <span>{nodeText}</span>
                </label>
            );
        }
    }

    const printDeleteButton = (node: TreeNode) => {
        const { isDeletable, depth, deleteElement } = props;

        if (isDeletable(node, depth)) {
            return (
                <div className="delete-btn"
                    onClick={() => {
                        handleDelete(node);
                    }}
                >
                    {deleteElement}
                </div>
            );
        }
    }

    const printExpandButton = (node: TreeNode): ReactElement => {
        const className = node.isExpanded
            ? ""
            : "active";
        const { isExpandable, depth } = props;

        if (isExpandable(node, depth)) {
            return (
                <div 
                    className="wrap"
                    onClick={() => {
                        handleExpandToggle(node);
                    }}
                >
                    <span className={`arrow ${className}`}>
                        <span></span>
                        <span></span>
                    </span>
                </div>
            );
        } else {
            return (
                <div className="wrap">
                    <span className="arrow">
                        <span></span>
                        <span></span>
                    </span>
                </div>
            );
        }
    }

    const printNoChildrenMessage = () => {
        const {
            transitionExitTimeout,
            noChildrenAvailableMessage
        } = props;

        const noChildrenTransitionProps = {
            classNames: "super-treeview-no-children-transition",
            key: "super-treeview-no-children",
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
            <CSSTransition {...noChildrenTransitionProps}>
                <div className="super-treeview-no-children">
                    <div className="super-treeview-no-children-content">
                        {noChildrenAvailableMessage}
                    </div>
                </div>
            </CSSTransition>
        );
    }

    const printNodes = (nodeArray: TreeNode[]) => {
        const {
            keywordKey,
            transitionEnterTimeout,
            transitionExitTimeout,
            getStyleClassCb
        } = props;

        const nodeTransitionProps = {
            classNames: "super-treeview-node-transition",
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
                {_.isEmpty(nodeArray)
                    ? printNoChildrenMessage()
                    : nodeArray.map((node, index) => {
                          return (
                              <CSSTransition
                                  {...nodeTransitionProps}
                                  key={node[keywordKey] || index}
                              >
                                  <div
                                      className={
                                          "super-treeview-node" + getStyleClassCb(node)
                                      }
                                  >
                                      <div className={`super-treeview-node-content ${!node.children 
                                            || node.children.length == 0 ? "no-child" : ""}`}>
                                          {node.children && node.children.length != 0 ? printExpandButton(node) : ""}
                                          {printCheckbox(node)}
                                          {printDeleteButton(node)}
                                      </div>
                                      { printChildren(node) }
                                  </div>
                              </CSSTransition>
                          );
                      })}
            </TransitionGroup>
        );
    }

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
                    {...props}
                    data={node[keywordChildren] || []}
                    depth={depth + 1}
                    onUpdateCb={onChildrenUpdateCb.bind(this)}
                />
            );
        }

        return (
            <div className="super-treeview-children-container">
                { childrenElement }
            </div>
        );

        function onChildrenUpdateCb(updatedData) {
            const data = _.cloneDeep(treeData);
            const currentNode = _.find(data, node);

            currentNode[keywordChildren] = updatedData;
            handleUpdate(data);
        }
    }

    return (
        //TODO: The extra container will be removed when styling is fixed.
        <div className="tree-vew">
            <div className="super-treeview">
                {printNodes(treeData)}
            </div>
        </div>
    )
}

TreeView.defaultProps = {
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
    isExpandable: (/* node, depth */) => { return true; },
}
