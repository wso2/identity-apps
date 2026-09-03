/*
 * Copyright (c) 2026, WSO2 LLC. (http://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package org.wso2.identity.apps.accounts.includes;

import org.apache.jasper.JspC;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import javax.tools.Diagnostic;
import javax.tools.DiagnosticCollector;
import javax.tools.JavaCompiler;
import javax.tools.JavaFileObject;
import javax.tools.StandardJavaFileManager;
import javax.tools.ToolProvider;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertFalse;
import static org.testng.Assert.assertTrue;

/**
 * Integration coverage for the open redirect fix at the level the product actually assembles these
 * pages.
 * <p>
 * {@code includes/flow-utils.jsp} is not a page of its own - {@code execution-flow.jsp} pulls it in
 * with a {@code jsp:directive.include}, which is a <em>static</em> include. Jasper therefore merges
 * the two files (plus {@code localize.jsp}, {@code init-url.jsp} and
 * {@code branding-preferences.jsp}) into a single servlet whose locals all share one scope. Unit
 * tests exercise the callback logic in isolation; this class runs the real Jasper compiler over the
 * real webapp and asserts on the merged servlet, which is the only place the interaction between
 * the two files is visible.
 * <p>
 * That interaction is not hypothetical: the first cut of this fix declared a local named
 * {@code flowType}, which {@code execution-flow.jsp} already declares, and the page stopped
 * compiling. {@link #shouldNotRedeclareLocalsOfTheIncludingPage()} pins that down.
 * <p>
 * Jasper's own javac pass is deliberately not used for a pass/fail verdict. Several classes the
 * pages import ({@code AuthenticationEndpointUtil}, {@code StringEscapeUtils},
 * {@code EncodedControl}) are supplied by the product runtime rather than by this module's
 * dependencies, so the merged servlet cannot be fully compiled from here. The test compiles it
 * anyway and inspects the diagnostics for scope collisions only, ignoring unresolved symbols.
 */
public class ExecutionFlowJspIntegrationTest {

    private static final String PAGE = "execution-flow.jsp";
    private static final String GENERATED_SERVLET = "execution_002dflow_jsp.java";
    private static final String GENERATED_PACKAGE = "org.apache.jsp";

    private static final String CALLBACK_SINK_WRITE =
            "addValue(reactGlobalContext, \"application.callbackOrAccessUrl\", backToUrl)";

    /**
     * The exact expression that made the page vulnerable: the request parameter going straight to
     * the encoder and on to the sink, with nothing authorising the destination in between.
     */
    private static final String VULNERABLE_EXPRESSION =
            "IdentityManagementEndpointUtil.encodeURL(request.getParameter(\"callback\"))";

    private static final List<String> ALLOW_LIST_CHECKS = Arrays.asList(
            "checkIfSelfRegCallbackURLValid",
            "checkIfLiteRegCallbackURLValid",
            "checkIfRecoveryCallbackURLValid");

    private Path mergedServlet;
    private String mergedSource;

    @BeforeClass
    public void generateMergedServlet() throws Exception {

        Path baseDir = Paths.get(System.getProperty("basedir", System.getProperty("user.dir")));
        Path webapp = baseDir.resolve("src/main/webapp");
        Path outputDir = baseDir.resolve("target/jspc-integration-test");
        // Jasper decides staleness from the top level page alone, so an edit confined to an include
        // would silently reuse a previous run's servlet. Always start from an empty directory.
        deleteRecursively(outputDir);
        Files.createDirectories(outputDir);

        JspC jspc = new JspC();
        jspc.setUriroot(webapp.toAbsolutePath().toString());
        jspc.setOutputDir(outputDir.toAbsolutePath().toString());
        jspc.setPackage(GENERATED_PACKAGE);
        jspc.setClassPath(FlowUtilsScriptletHarness.testClassPath());
        // Generation only. See the class comment: the merged servlet cannot be fully compiled from
        // this module because some of its imports are provided by the product runtime.
        jspc.setCompile(false);
        jspc.setFailOnError(true);
        jspc.setJspFiles(webapp.resolve(PAGE).toAbsolutePath().toString());
        jspc.execute();

        mergedServlet = outputDir.resolve(GENERATED_PACKAGE.replace('.', File.separatorChar))
                .resolve(GENERATED_SERVLET);
        assertTrue(Files.isRegularFile(mergedServlet),
                "Jasper did not produce a servlet for " + PAGE + " at " + mergedServlet);
        mergedSource = new String(Files.readAllBytes(mergedServlet), StandardCharsets.UTF_8);
    }

    /**
     * The callback handling only protects anything if the include is genuinely part of the page
     * Jasper builds.
     */
    @Test
    public void shouldMergeFlowUtilsIntoTheExecutionFlowPage() {

        assertTrue(mergedSource.contains(CALLBACK_SINK_WRITE),
                "flow-utils.jsp did not end up in the servlet generated for " + PAGE + ".");
        assertEquals(occurrences(mergedSource, CALLBACK_SINK_WRITE), 1,
                "The callback sink must be written exactly once in the merged page.");
    }

    /**
     * The regression guard: whatever the code around it looks like, the raw request parameter must
     * never again be encoded straight into the sink.
     */
    @Test
    public void shouldNotEncodeTheRawCallbackParameterIntoThePage() {

        assertFalse(mergedSource.contains(VULNERABLE_EXPRESSION),
                "The merged page encodes the raw 'callback' request parameter without authorising "
                        + "the destination first. That is the open redirect this test exists for.");
    }

    /**
     * All three flow types must have an allow list to consult; dropping one would silently reopen
     * the redirect for that flow.
     */
    @Test
    public void shouldConsultAnAllowListForEveryFlowType() {

        for (String check : ALLOW_LIST_CHECKS) {
            assertTrue(mergedSource.contains(check),
                    "The merged page never calls " + check + ", so at least one flow type reflects "
                            + "the callback unchecked.");
        }
    }

    /**
     * A static include shares the including page's method scope, so a local added to
     * flow-utils.jsp that {@code execution-flow.jsp} already declares breaks the whole page.
     * Compilation is expected to report unresolved symbols here - only redeclarations are fatal.
     */
    @Test
    public void shouldNotRedeclareLocalsOfTheIncludingPage() throws IOException {

        List<String> collisions = compileAndCollectCollisions();

        assertTrue(collisions.isEmpty(),
                "The merged page redeclares locals that its including page already owns:\n"
                        + String.join("\n", collisions));
    }

    private List<String> compileAndCollectCollisions() throws IOException {

        JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
        assertTrue(compiler != null, "The tests must run on a JDK, not a JRE.");

        DiagnosticCollector<JavaFileObject> diagnostics = new DiagnosticCollector<>();
        try (StandardJavaFileManager fileManager =
                     compiler.getStandardFileManager(diagnostics, null, StandardCharsets.UTF_8)) {
            Path classes = mergedServlet.getParent().resolveSibling("classes");
            Files.createDirectories(classes);
            // The merged servlet reports a lot of unresolved symbols (see the class comment), so
            // the default error cap of 100 has to be lifted or a redeclaration further down the
            // page is never reported at all.
            List<String> options = Arrays.asList("-classpath", FlowUtilsScriptletHarness.testClassPath(),
                    "-d", classes.toString(), "-nowarn", "-proc:none", "-Xmaxerrs", "100000");
            compiler.getTask(null, fileManager, diagnostics, options, null,
                    fileManager.getJavaFileObjects(mergedServlet.toFile())).call();
        }

        List<String> collisions = new ArrayList<>();
        for (Diagnostic<? extends JavaFileObject> diagnostic : diagnostics.getDiagnostics()) {
            if (diagnostic.getKind() != Diagnostic.Kind.ERROR) {
                continue;
            }
            String code = diagnostic.getCode();
            if (code != null && code.contains("already.defined")) {
                collisions.add("line " + diagnostic.getLineNumber() + ": "
                        + diagnostic.getMessage(Locale.ENGLISH));
            }
        }
        return collisions.stream().distinct().collect(Collectors.toList());
    }

    private static void deleteRecursively(Path path) throws IOException {

        if (!Files.exists(path)) {
            return;
        }
        try (java.util.stream.Stream<Path> walk = Files.walk(path)) {
            for (Path entry : walk.sorted(java.util.Comparator.reverseOrder()).collect(Collectors.toList())) {
                Files.deleteIfExists(entry);
            }
        }
    }

    private static int occurrences(String haystack, String needle) {

        int count = 0;
        int from = haystack.indexOf(needle);
        while (from >= 0) {
            count++;
            from = haystack.indexOf(needle, from + needle.length());
        }
        return count;
    }
}
