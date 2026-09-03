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

import com.google.gson.JsonObject;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.URI;
import java.net.URL;
import java.net.URLClassLoader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.jar.JarFile;
import java.util.jar.Manifest;

import javax.servlet.http.HttpServletRequest;
import javax.tools.JavaCompiler;
import javax.tools.ToolProvider;

/**
 * Makes the security critical part of {@code src/main/webapp/includes/flow-utils.jsp} unit
 * testable.
 * <p>
 * {@code flow-utils.jsp} is pulled into {@code execution-flow.jsp} through a
 * {@code jsp:directive.include}, so its scriptlet is not a standalone compilation unit - it relies
 * on locals declared by the including page. There is therefore no way to invoke it directly from a
 * test, and no JSP test harness exists anywhere in identity-apps.
 * <p>
 * Rather than re-implementing the logic in the test (which would assert nothing about the file that
 * actually ships), this harness reads the JSP <em>at test time</em>, lifts out
 * <ul>
 *     <li>the {@code <%! ... %>} declaration block (which owns {@code addValue}, the method that
 *     writes the sink), and</li>
 *     <li>the scriptlet region that resolves the {@code callback} request parameter, bounded by
 *     {@link #SCRIPTLET_START_ANCHOR} and {@link #SCRIPTLET_END_ANCHOR},</li>
 * </ul>
 * splices them verbatim into a generated class, compiles that class with the JDK compiler, and
 * exposes it through {@link #resolve(HttpServletRequest, String)}. The tests therefore execute the
 * exact source that is packaged into {@code accounts.war}.
 * <p>
 * Two concessions are made, both outside the control being tested:
 * <ul>
 *     <li>The generated class supplies {@code request}, {@code tenantDomain} and
 *     {@code reactGlobalContext}, which the including page would otherwise provide.</li>
 *     <li>{@code IdentityManagementEndpointUtil.encodeURL(...)} is swapped for a local stand-in.
 *     The real utility cannot be initialised outside the Carbon OSGi runtime, and it is an output
 *     encoder, not an authorisation control - the fix under test is the allow list check that runs
 *     <em>before</em> it. The stand-in preserves the one behaviour that matters to the callers:
 *     it throws {@link java.net.MalformedURLException} for values that are not parseable URLs.</li>
 * </ul>
 * Every scriptlet is wrapped by Jasper in a {@code catch (Throwable)} block, so the generated class
 * does the same - that is what allows the JSP to call a method declaring a checked exception
 * without a try/catch of its own.
 */
final class FlowUtilsScriptletHarness {

    /**
     * System property that points the harness at a different copy of the JSP. Used to prove that
     * the suite fails against the pre-fix file.
     */
    static final String JSP_PATH_PROPERTY = "flowUtilsJspPath";

    private static final String DEFAULT_JSP_PATH = "src/main/webapp/includes/flow-utils.jsp";

    private static final String DECLARATION_OPEN = "<%!";
    private static final String DECLARATION_CLOSE = "%>";

    /**
     * The scriptlet region starts immediately after the last branding value is written, and ends
     * with the line that writes the tainted sink. Everything the fix touches lives in between.
     */
    private static final String SCRIPTLET_START_ANCHOR =
            "addValue(reactGlobalContext, \"branding.supportEmail\", supportEmail);";
    private static final String SCRIPTLET_END_ANCHOR =
            "addValue(reactGlobalContext, \"application.callbackOrAccessUrl\", backToUrl);";

    private static final String GENERATED_PACKAGE = "org.wso2.identity.apps.accounts.generated";
    private static final String GENERATED_CLASS = "FlowUtilsScriptletRunner";

    private static final String ENCODE_URL_CALL = "IdentityManagementEndpointUtil.encodeURL(";
    private static final String ENCODE_URL_STAND_IN = "encodeUrlStandIn(";

    private static volatile Method compiledRunMethod;

    private FlowUtilsScriptletHarness() {

    }

    /**
     * Runs the JSP's callback resolution scriptlet.
     *
     * @param request      Request the scriptlet reads {@code callback}, {@code flowType} and
     *                     {@code sp} from.
     * @param tenantDomain Tenant domain the including page would have resolved.
     * @return The {@code reactGlobalContext} JSON object the scriptlet populated. The value under
     *         {@code application.callbackOrAccessUrl} is the sink this issue is about.
     */
    static JsonObject resolve(HttpServletRequest request, String tenantDomain) {

        try {
            return (JsonObject) runMethod().invoke(null, request, tenantDomain);
        } catch (InvocationTargetException e) {
            Throwable cause = e.getCause();
            if (cause instanceof RuntimeException) {
                throw (RuntimeException) cause;
            }
            throw new IllegalStateException("Failed to execute the flow-utils.jsp scriptlet.", cause);
        } catch (ReflectiveOperationException e) {
            throw new IllegalStateException("Failed to invoke the compiled flow-utils.jsp scriptlet.", e);
        }
    }

    private static Method runMethod() {

        Method cached = compiledRunMethod;
        if (cached == null) {
            synchronized (FlowUtilsScriptletHarness.class) {
                cached = compiledRunMethod;
                if (cached == null) {
                    cached = compile();
                    compiledRunMethod = cached;
                }
            }
        }
        return cached;
    }

    private static Method compile() {

        Path jsp = jspPath();
        String jspSource;
        try {
            jspSource = new String(Files.readAllBytes(jsp), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new IllegalStateException("Could not read " + jsp.toAbsolutePath(), e);
        }

        String generatedSource = generateSource(extractDeclarations(jspSource, jsp),
                extractScriptlet(jspSource, jsp));

        try {
            Path root = Files.createTempDirectory("flow-utils-harness");
            Path sourceDir = root.resolve("src");
            Path classesDir = root.resolve("classes");
            Path sourceFile = sourceDir.resolve(GENERATED_PACKAGE.replace('.', File.separatorChar))
                    .resolve(GENERATED_CLASS + ".java");
            Files.createDirectories(sourceFile.getParent());
            Files.createDirectories(classesDir);
            Files.write(sourceFile, generatedSource.getBytes(StandardCharsets.UTF_8));

            JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
            if (compiler == null) {
                throw new IllegalStateException(
                        "No JDK compiler available. The tests must run on a JDK, not a JRE.");
            }
            List<String> options = Arrays.asList("-classpath", testClassPath(),
                    "-d", classesDir.toString(), "-nowarn");
            int result = compiler.run(null, null, System.err, concat(options, sourceFile.toString()));
            if (result != 0) {
                throw new IllegalStateException("Could not compile the scriptlet lifted from "
                        + jsp.toAbsolutePath() + ". Generated source:\n" + generatedSource);
            }

            URLClassLoader loader = new URLClassLoader(new URL[] { classesDir.toUri().toURL() },
                    FlowUtilsScriptletHarness.class.getClassLoader());
            Class<?> generated = loader.loadClass(GENERATED_PACKAGE + "." + GENERATED_CLASS);
            return generated.getMethod("run", HttpServletRequest.class, String.class);
        } catch (IOException | ReflectiveOperationException e) {
            throw new IllegalStateException("Could not build the flow-utils.jsp test harness.", e);
        }
    }

    private static Path jspPath() {

        String override = System.getProperty(JSP_PATH_PROPERTY);
        if (override != null && !override.trim().isEmpty()) {
            return Paths.get(override);
        }
        String baseDir = System.getProperty("basedir", System.getProperty("user.dir"));
        return Paths.get(baseDir).resolve(DEFAULT_JSP_PATH);
    }

    private static String extractDeclarations(String jspSource, Path jsp) {

        int open = jspSource.indexOf(DECLARATION_OPEN);
        if (open < 0) {
            throw new IllegalStateException("No '<%!' declaration block in " + jsp.toAbsolutePath());
        }
        int close = jspSource.indexOf(DECLARATION_CLOSE, open + DECLARATION_OPEN.length());
        if (close < 0) {
            throw new IllegalStateException("Unterminated declaration block in " + jsp.toAbsolutePath());
        }
        return jspSource.substring(open + DECLARATION_OPEN.length(), close);
    }

    private static String extractScriptlet(String jspSource, Path jsp) {

        int start = jspSource.indexOf(SCRIPTLET_START_ANCHOR);
        if (start < 0) {
            throw new IllegalStateException("Could not find the scriptlet start anchor in "
                    + jsp.toAbsolutePath() + ". Expected a line containing: " + SCRIPTLET_START_ANCHOR
                    + ". The callback handling block moved - review it against this test before "
                    + "re-anchoring, it carries the open redirect fix.");
        }
        int end = jspSource.indexOf(SCRIPTLET_END_ANCHOR, start);
        if (end < 0) {
            throw new IllegalStateException("Could not find the scriptlet end anchor in "
                    + jsp.toAbsolutePath() + ". Expected a line containing: " + SCRIPTLET_END_ANCHOR
                    + ". The sink that this issue is about moved or was renamed - review it against "
                    + "this test before re-anchoring.");
        }
        return jspSource.substring(start + SCRIPTLET_START_ANCHOR.length(),
                end + SCRIPTLET_END_ANCHOR.length());
    }

    private static String generateSource(String declarations, String scriptlet) {

        String body = scriptlet.replace(ENCODE_URL_CALL, ENCODE_URL_STAND_IN);
        return "package " + GENERATED_PACKAGE + ";\n"
                + "\n"
                + "import com.google.gson.Gson;\n"
                + "import com.google.gson.JsonObject;\n"
                + "import java.net.MalformedURLException;\n"
                + "import java.net.URL;\n"
                + "import javax.servlet.http.HttpServletRequest;\n"
                + "import org.apache.commons.lang3.StringUtils;\n"
                + "import org.owasp.encoder.Encode;\n"
                + "import org.wso2.carbon.identity.mgt.endpoint.util.client.ApplicationDataRetrievalClient;\n"
                + "import org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClient;\n"
                + "import org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClientException;\n"
                + "\n"
                + "public final class " + GENERATED_CLASS + " {\n"
                + "\n"
                + "    /* ---- lifted verbatim from the JSP's <%! ... %> declaration block ---- */\n"
                + declarations + "\n"
                + "    /* ---- end of the JSP declaration block ---- */\n"
                + "\n"
                + "    @SuppressWarnings(\"deprecation\")\n"
                + "    private static String " + ENCODE_URL_STAND_IN + "String url) throws MalformedURLException {\n"
                + "        if (url == null) {\n"
                + "            return null;\n"
                + "        }\n"
                + "        new URL(url);\n"
                + "        return url;\n"
                + "    }\n"
                + "\n"
                + "    public static JsonObject run(HttpServletRequest request, String tenantDomain) {\n"
                + "\n"
                + "        JsonObject reactGlobalContext = new JsonObject();\n"
                + "        try {\n"
                + "            /* ---- lifted verbatim from the JSP scriptlet ---- */\n"
                + body + "\n"
                + "            /* ---- end of the JSP scriptlet ---- */\n"
                + "        } catch (Throwable t) {\n"
                + "            // Jasper wraps every scriptlet in a catch (Throwable) block.\n"
                + "            throw new IllegalStateException(t);\n"
                + "        }\n"
                + "        return reactGlobalContext;\n"
                + "    }\n"
                + "}\n";
    }

    /**
     * Surefire hands the forked JVM a manifest only jar, so {@code java.class.path} can be a single
     * entry. Expand any {@code Class-Path} manifest attribute so the in-memory compilation sees the
     * same classpath the tests run with.
     */
    static String testClassPath() {

        List<String> entries = new ArrayList<>();
        for (String entry : System.getProperty("java.class.path").split(File.pathSeparator)) {
            if (entry.trim().isEmpty()) {
                continue;
            }
            entries.add(entry);
            if (!entry.endsWith(".jar")) {
                continue;
            }
            try (JarFile jar = new JarFile(entry)) {
                Manifest manifest = jar.getManifest();
                if (manifest == null) {
                    continue;
                }
                String classPath = manifest.getMainAttributes().getValue("Class-Path");
                if (classPath == null) {
                    continue;
                }
                for (String reference : classPath.split("\\s+")) {
                    if (reference.trim().isEmpty()) {
                        continue;
                    }
                    entries.add(Paths.get(URI.create(reference)).toString());
                }
            } catch (IOException | IllegalArgumentException ignored) {
                // Not a readable jar, or a relative Class-Path entry - the direct entry still stands.
            }
        }
        return String.join(File.pathSeparator, entries);
    }

    private static String[] concat(List<String> options, String sourceFile) {

        List<String> all = new ArrayList<>(options);
        all.add(sourceFile);
        return all.toArray(new String[0]);
    }
}
