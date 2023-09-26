const passive = { passive: true };
const rwdStyle = window.getComputedStyle(document.documentElement);
const rwdMin = parseFloat(rwdStyle.getPropertyValue("--rl"));
const rwdMax = parseFloat(rwdStyle.getPropertyValue("--rh"));
const rwdrange = rwdMax - rwdMin;
const rwd=()=>document.documentElement.style.setProperty("--r",Math.min(1,Math.max(0,parseFloat(window.getComputedStyle(document.documentElement,"::before").getPropertyValue("width"))-rwdMin)/rwdrange).toString());
rwd();
window.addEventListener("resize",rwd,passive);

const settingsData = {
    border_width: "",
    theme: "",
    contrast: "",
    data: "",
};
const loadedSettingsData = JSON.parse(sessionStorage.getItem("settings") ?? localStorage.getItem("settings") ?? "{}");
for (const settingKey of Object.keys(settingsData)) {
    if (loadedSettingsData[settingKey]) {
        settingsData[settingKey] = loadedSettingsData[settingKey];
    }
}

const Settings = () => {
    window["so"].addEventListener("click", clickEvent => {
        window["sd"].showModal();
        document.body.classList.add("so");
        window["sd"].children[0].scrollTo(0, 0);
    });
    window["sc"].addEventListener("click", clickEvent => {
        window["sd"].close();
        document.body.classList.remove("so");
    });

    SettingsUpdateForm();
    window["sout"].textContent = sessionStorage.getItem("settings") ?? localStorage.getItem("settings") ?? "";

    for (const settingKey of Object.keys(settingsData)) {
        if (window["sf"].elements[settingKey][0]) {
            for (let nodeIndex = 0; nodeIndex < window["sf"].elements[settingKey].length; nodeIndex++) {
                window["sf"].elements[settingKey][nodeIndex].addEventListener("change", OnSettingsChange);
            }
        } else {
            window["sf"].elements[settingKey].addEventListener("change", OnSettingsChange);
        }
    }

    window["sdel"].addEventListener("click", (clickEvent) => {
        localStorage.removeItem("settings");
        sessionStorage.removeItem("settings");

        for (const settingKey of Object.keys(settingsData)) {
            settingsData[settingKey] = "";
        }

        window["sout"].textContent = "";
        SettingsUpdateForm();
        SettingsApply();
    });

    window["sf"].addEventListener("submit", submitEvent => submitEvent.preventDefault());
};

const SettingsApply = () => {
    document.documentElement.classList.toggle("csd", settingsData.theme == "dark");
    document.documentElement.classList.toggle("csl", settingsData.theme == "light");
    document.documentElement.classList.toggle("csch", settingsData.contrast == "more");
    document.documentElement.classList.toggle("cscl", settingsData.contrast == "less");
    document.body.style.setProperty("--bw", `var(--b${settingsData.border_width || "1"})`);
};

const SettingsUpdateForm = () => {
    for (const settingKey of Object.keys(settingsData)) {
        if (window["sf"].elements[settingKey][0]) {
            for (let nodeIndex = 0; nodeIndex < window["sf"].elements[settingKey].length; nodeIndex++) {
                window["sf"].elements[settingKey][nodeIndex].checked =
                    window["sf"].elements[settingKey][nodeIndex].value == settingsData[settingKey];
            }

        } else {
            window["sf"].elements[settingKey].value = settingsData[settingKey];
        }
    }
};

const OnSettingsChange = (changeEvent) => {
    localStorage.removeItem("settings");
    sessionStorage.removeItem("settings");

    settingsData[changeEvent.target.name] = changeEvent.target.value ?? "";

    if (settingsData.data) {
        const saveData = {};

        for (const [settingKey, settingValue] of Object.entries(settingsData)) {
            if (settingValue) {
                saveData[settingKey] = settingValue;
            }
        }

        if (Object.keys(saveData).length) {
            if (settingsData.data == "local_storage") {
                localStorage.setItem("settings", JSON.stringify(saveData));

            } else {
                sessionStorage.setItem("settings", JSON.stringify(saveData));
            }
        }
    }

    SettingsApply();

    window["sout"].textContent = sessionStorage.getItem("settings") ?? localStorage.getItem("settings") ?? "";
};

const ScrollbarWidth = () => {
    const probe = document.createElement("div");
    probe.style.setProperty("overflow", "scroll");
    probe.style.setProperty("position", "absolute");
    probe.style.setProperty("left", "-300vw");
    document.body.appendChild(probe);
    document.documentElement.style.setProperty("--sw", probe.offsetWidth.toString());
    document.body.removeChild(probe);
};

const UpdateBodyHasScrollbar = () => {
    document.body.classList.toggle("sw", window.innerWidth > document.documentElement.clientWidth);
};

const CSSVars = () => {
    ScrollbarWidth();
    UpdateBodyHasScrollbar();
    window.addEventListener("resize", ScrollbarWidth, passive);
    window.addEventListener("resize", UpdateBodyHasScrollbar, passive);
};

const ViewTransitions = () => {
    if (!("startViewTransition" in document)) {
        return;
    }

    let hashIndex = location.href.lastIndexOf("#");
    let lastLink = hashIndex == -1 ? location.href : location.href.slice(0, hashIndex);

    const linksQuery = "a:not([href='#content']):not([href^='mailto']):not(.nvt)";

    let tempHrefPrevious = null;
    let tempHref = null;
    let tempAbortController = null;

    const UpdateView = async (href, pushState = false) => {
        document.body.classList.add("is-loading");
        try {
            const viewTransition = document.startViewTransition(async () => {
                tempHref = href;
                tempAbortController = new AbortController();

                let request = fetch(tempHref, { signal: tempAbortController.signal });

                if (pushState) {
                    history.pushState(null, "", href);
                }

                const header = document.querySelector("#h");
                const content = document.querySelector("#content");
                const footer = document.querySelector("#f");
                const tempNode = document.createElement("div");

                request = await request;

                if (!request.ok) {
                    document.title = "404";
                    content.innerHTML = "<h1>404</h1>";

                    throw new Error("404");
                }

                tempNode.innerHTML = await request.text();

                tempHref = null;
                tempAbortController = null;

                header.replaceWith(tempNode.querySelector("#h"));
                content.replaceWith(tempNode.querySelector("#content"));
                footer.replaceWith(tempNode.querySelector("#f"));
                document.title = tempNode.querySelector("title").textContent;
            });

            await viewTransition.updateCallbackDone;

            if (pushState) {
                window.scrollTo(0, 0);
            }
            UpdateBodyHasScrollbar();
            if (typeof OptionalSyntaxHighlighting != "undefined") {
                OptionalSyntaxHighlighting();
            }

            mouseEffectsNodes = new Map();
            setTimeout(MouseEffects, 0);

            document.querySelectorAll(linksQuery)
                .forEach(link => link.addEventListener("click", HandleNavigationLinkClicked));

            tempHrefPrevious = location.href;
            document.documentElement.dispatchEvent(new CustomEvent("viewchange"));

        } catch (error) {
            console.debug(error);
        }

        document.body.classList.remove("is-loading");
    };

    const HandleNavigationLinkClicked = (clickEvent) => {
        if ((clickEvent.target.host ?? location.host) != location.host) {
            return;
        }

        const hashIndex = clickEvent.target.href.lastIndexOf("#");
        const newLink = hashIndex == -1 ? clickEvent.target.href : clickEvent.target.href.slice(0, hashIndex);

        if (lastLink == newLink) {
            return;
        }

        lastLink = newLink;

        clickEvent.preventDefault();

        tempHrefPrevious = location.href;

        UpdateView(clickEvent.target.href, true);
    };

    const HandleNavigationPopstate = (popstateEvent) => {
        const hashIndex = location.href.lastIndexOf("#");
        const newLink = hashIndex == -1 ? location.href : location.href.slice(0, hashIndex);

        if (lastLink == newLink) {
            return;
        }

        lastLink = newLink;

        popstateEvent.preventDefault();

        if (tempHref !== null) {
            tempAbortController.abort();
            tempHref = null;

            if (tempHrefPrevious == location.href) {
                return;
            }
        }

        UpdateView(location.href);
    };

    document.querySelectorAll(linksQuery).forEach(link => link.addEventListener("click", HandleNavigationLinkClicked));

    window.addEventListener("popstate", HandleNavigationPopstate);
};

document.addEventListener("readystatechange", _ => {
    if (document.readyState != "complete") {
        return;
    }

    ViewTransitions();
    UpdateBodyHasScrollbar();
    Settings();
    MouseEffects();
    let syntaxHighlightingLoaded;
    var OptionalSyntaxHighlighting = () => {
        if (!navigator.connection?.saveData) {
            if (syntaxHighlightingLoaded) {
                hljs.highlightAll();
                return;
            }

            if (!document.querySelector("pre code")) {
                return;
            }

            const script = document.createElement("script");
            script.src = "//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js";
            document.head.appendChild(script);

            script.addEventListener("load", () => {
                syntaxHighlightingLoaded = true;
                hljs.highlightAll();
            });

            const styles = document.createElement("link");
            styles.rel = "stylesheet";
            styles.href = "/hljs.css";
            document.head.appendChild(styles);
        }
    };

    if (!navigator.connection?.saveData) {
        document.documentElement.addEventListener("viewchange", OptionalSyntaxHighlighting);
        OptionalSyntaxHighlighting();
    }
});
let mouseEffectsNodes = new Map();
// const mouseEffectsNodes = new Set();
const topName = "--mpxt";
const leftName = "--mpxl";
const meSetClass = "mset";
const meStylesAttr = "style";
let meNode;
let mePos;
let meRect;
let meLeft;
let meTop;
const MoveMouseEffects = (e) => {
    // for (meNode of mouseEffectsNodes) {
    //     meRect = meNode.getBoundingClientRect();
    //     meTop = e.clientY - meRect.top;
    //     if (meTop > window.innerHeight || meTop < -window.innerHeight) {
    //         continue;
    //     }
    //     meLeft = e.clientX - meRect.left;
    //     meNode.setAttribute(meStylesAttr, `${topName}:${meTop}px;${leftName}:${meLeft}px`);
    //     meNode.classList.add(meSetClass);
    // }

    for (meNode of mouseEffectsNodes) {
        if (meNode[1][0] > window.innerHeight || meNode[1][0] < -window.innerHeight) {
            continue;
        }
        meNode[0].setAttribute(meStylesAttr, `${topName}:${e.clientY - meNode[1][0]}px;${leftName}:${e.clientX - meNode[1][1]}px`);
        meNode[0].classList.add(meSetClass);
    }
};
const ScrollMouseEffects = (e) => {
    let tempRect;
    for (const node of mouseEffectsNodes) {
        tempRect = node[0].getBoundingClientRect();
        node[1][0] = Math.round(tempRect.top);
        node[1][1] = Math.round(tempRect.left);
    }
}
const MouseEffects = () => {
    if ("ontouchstart" in document.documentElement) {
        return;
    }
    let tempRect;
    for (const node of document.querySelectorAll(".m, button, pre code")) {
        tempRect = node.getBoundingClientRect();
        mouseEffectsNodes.set(node, [Math.round(tempRect.top), Math.round(tempRect.left)]);
    }

    addEventListener("mousemove", MoveMouseEffects, passive);
    addEventListener("scroll", ScrollMouseEffects, passive);
    addEventListener("resize", ScrollMouseEffects, passive);
};
