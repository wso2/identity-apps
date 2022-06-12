package org.wso2.carbon.identity.application.authentication.endpoint.taglibs.layout.controller.compiler.executors;

import org.wso2.carbon.identity.application.authentication.endpoint.taglibs.layout.controller.compiler.identifiers.ComponentIdentifier;
import org.wso2.carbon.identity.application.authentication.endpoint.taglibs.layout.controller.compiler.identifiers.ConditionIdentifier;
import org.wso2.carbon.identity.application.authentication.endpoint.taglibs.layout.controller.compiler.identifiers.DataIdentifier;
import org.wso2.carbon.identity.application.authentication.endpoint.taglibs.layout.controller.compiler.identifiers.DefaultIdentifier;
import org.wso2.carbon.identity.application.authentication.endpoint.taglibs.layout.controller.compiler.identifiers.NoIdentifier;
import org.wso2.carbon.identity.application.authentication.endpoint.taglibs.layout.controller.compiler.identifiers.NotConditionIdentifier;

/**
 * Executor class interface
 */
public interface Executor {

    /**
     * Check whether the compiled layout execution can continue or not
     *
     * @return Whether the compiled layout execution can continue or not
     */
    public boolean continueExecution();

    /**
     * Get the current executing index of the compiled layout
     *
     * @return current executing index
     */
    public int getCurrentExecutionIndex();

    /**
     * Execute the provided default identifier
     *
     * @param identifier Default identifier (Set of identifiers)
     */
    public void execute(DefaultIdentifier identifier);

    /**
     * Execute the provided component identifier
     *
     * @param identifier Component identifier
     */
    public void execute(ComponentIdentifier identifier);

    /**
     * Execute the provided data identifier
     *
     * @param identifier Data identifier
     */
    public void execute(DataIdentifier identifier);

    /**
     * Execute the provided condition identifier
     *
     * @param identifier Condition identifier
     */
    public void execute(ConditionIdentifier identifier);

    /**
     * Execute the provided not condition identifier
     *
     * @param identifier Not condition identifier
     */
    public void execute(NotConditionIdentifier identifier);

    /**
     * Execute the provided no identifier
     *
     * @param identifier No identifier
     */
    public void execute(NoIdentifier identifier);

}
