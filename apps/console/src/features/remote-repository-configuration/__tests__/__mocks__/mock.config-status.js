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

module.exports = {
    failedDeployments: 3,
    lastSynchronizedTime: "2020-10-22T17:18:17.097Z",
    remoteFetchRevisionStatuses: [
        {
            deployedStatus: "FAIL",
            deployedTime: "2020-10-22T17:18:22.178Z",
            deploymentErrorReport: "/etc/environment (Is a directory)java.io.FileNotFoundException: /etc/environment (Is a directory)\n\tat java.io.FileInputStream.open0(Native Method)\n\tat java.io.FileInputStream.open(FileInputStream.java:195)\n\tat java.io.FileInputStream.<init>(FileInputStream.java:138)\n\tat java.io.FileInputStream.<init>(FileInputStream.java:93)\n\tat org.wso2.carbon.identity.remotefetch.core.impl.deployers.config.VelocityTemplatedSPDeployer.deploy(VelocityTemplatedSPDeployer.java:100)\n\tat org.wso2.carbon.identity.remotefetch.core.impl.handlers.action.ActionListenerImpl.pollDirectory(ActionListenerImpl.java:292)\n\tat org.wso2.carbon.identity.remotefetch.core.impl.handlers.action.ActionListenerImpl.execute(ActionListenerImpl.java:82)\n\tat org.wso2.carbon.identity.remotefetch.core.impl.handlers.action.polling.PollingActionListener.execute(PollingActionListener.java:51)\n\tat org.wso2.carbon.identity.remotefetch.core.executers.tasks.RemoteFetchConfigurationImmediateTask.run(RemoteFetchConfigurationImmediateTask.java:243)\n\tat java.util.concurrent.Executors$RunnableAdapter.call(Executors.java:511)\n\tat java.util.concurrent.FutureTask.run(FutureTask.java:266)\n\tat java.util.concurrent.ScheduledThreadPoolExecutor$ScheduledFutureTask.access$201(ScheduledThreadPoolExecutor.java:180)\n\tat java.util.concurrent.ScheduledThreadPoolExecutor$ScheduledFutureTask.run(ScheduledThreadPoolExecutor.java:293)\n\tat java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1149)\n\tat java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:624)\n\tat java.lang.Thread.run(Thread.java:748)\n",
            itemName: "inboundSP"
        },
        {
            deployedStatus: "FAIL",
            deployedTime: "2020-10-22T17:18:42.211Z",
            deploymentErrorReport: "/etc/environment (Is a directory)java.io.FileNotFoundException: /etc/environment (Is a directory)\n\tat java.io.FileInputStream.open0(Native Method)\n\tat java.io.FileInputStream.open(FileInputStream.java:195)\n\tat java.io.FileInputStream.<init>(FileInputStream.java:138)\n\tat java.io.FileInputStream.<init>(FileInputStream.java:93)\n\tat org.wso2.carbon.identity.remotefetch.core.impl.deployers.config.VelocityTemplatedSPDeployer.deploy(VelocityTemplatedSPDeployer.java:100)\n\tat org.wso2.carbon.identity.remotefetch.core.impl.handlers.action.ActionListenerImpl.pollDirectory(ActionListenerImpl.java:292)\n\tat org.wso2.carbon.identity.remotefetch.core.impl.handlers.action.ActionListenerImpl.execute(ActionListenerImpl.java:82)\n\tat org.wso2.carbon.identity.remotefetch.core.impl.handlers.action.polling.PollingActionListener.execute(PollingActionListener.java:51)\n\tat org.wso2.carbon.identity.remotefetch.core.executers.tasks.RemoteFetchConfigurationImmediateTask.run(RemoteFetchConfigurationImmediateTask.java:243)\n\tat java.util.concurrent.Executors$RunnableAdapter.call(Executors.java:511)\n\tat java.util.concurrent.FutureTask.run(FutureTask.java:266)\n\tat java.util.concurrent.ScheduledThreadPoolExecutor$ScheduledFutureTask.access$201(ScheduledThreadPoolExecutor.java:180)\n\tat java.util.concurrent.ScheduledThreadPoolExecutor$ScheduledFutureTask.run(ScheduledThreadPoolExecutor.java:293)\n\tat java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1149)\n\tat java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:624)\n\tat java.lang.Thread.run(Thread.java:748)\n",
            itemName: "outboundAdvancedSP"
        },
        {
            deployedStatus: "FAIL",
            deployedTime: "2020-10-22T17:18:32.182Z",
            deploymentErrorReport: "/etc/environment (Is a directory)java.io.FileNotFoundException: /etc/environment (Is a directory)\n\tat java.io.FileInputStream.open0(Native Method)\n\tat java.io.FileInputStream.open(FileInputStream.java:195)\n\tat java.io.FileInputStream.<init>(FileInputStream.java:138)\n\tat java.io.FileInputStream.<init>(FileInputStream.java:93)\n\tat org.wso2.carbon.identity.remotefetch.core.impl.deployers.config.VelocityTemplatedSPDeployer.deploy(VelocityTemplatedSPDeployer.java:100)\n\tat org.wso2.carbon.identity.remotefetch.core.impl.handlers.action.ActionListenerImpl.pollDirectory(ActionListenerImpl.java:292)\n\tat org.wso2.carbon.identity.remotefetch.core.impl.handlers.action.ActionListenerImpl.execute(ActionListenerImpl.java:82)\n\tat org.wso2.carbon.identity.remotefetch.core.impl.handlers.action.polling.PollingActionListener.execute(PollingActionListener.java:51)\n\tat org.wso2.carbon.identity.remotefetch.core.executers.tasks.RemoteFetchConfigurationImmediateTask.run(RemoteFetchConfigurationImmediateTask.java:243)\n\tat java.util.concurrent.Executors$RunnableAdapter.call(Executors.java:511)\n\tat java.util.concurrent.FutureTask.run(FutureTask.java:266)\n\tat java.util.concurrent.ScheduledThreadPoolExecutor$ScheduledFutureTask.access$201(ScheduledThreadPoolExecutor.java:180)\n\tat java.util.concurrent.ScheduledThreadPoolExecutor$ScheduledFutureTask.run(ScheduledThreadPoolExecutor.java:293)\n\tat java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1149)\n\tat java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:624)\n\tat java.lang.Thread.run(Thread.java:748)\n",
            itemName: "simpleSP"
        }
    ],
    successfulDeployments: 0
};
