document.addEventListener("DOMContentLoaded", function () {
    const yamlEditor = CodeMirror.fromTextArea(document.getElementById("yaml-editor"), {
        mode: "yaml",
        lineNumbers: true,
        theme: "default"
    });

    const graphContainer = document.getElementById("graph-container");
    const toolbox = document.getElementById("toolbox");
    const uploadInput = document.getElementById("upload-yaml");

    let blocks = [];
    let connections = [];

    function parseYAML(yamlText) {
        try {
            const doc = jsyaml.load(yamlText);
            renderGraph(doc);
        } catch (e) {
            console.error("Invalid YAML:", e);
        }
    }

    function renderGraph(yamlDoc) {
        clearGraph();

        // Example YAML parsing logic
        ["generators", "filters", "final_filters"].forEach((key) => {
            if (yamlDoc[key]) {
                yamlDoc[key].forEach((item, index) => {
                    createBlock(item.class_name, "algorithm", { x: 100, y: index * 100 });
                });
            }
        });

        // Example connections (based on YAML relationships)
        // You’d add logic here to add arrows from params like 'input_pointcloud_layer' etc.
    }

    function createBlock(name, type, position) {
        const block = document.createElement("div");
        block.className = `block ${type}-block`;
        block.textContent = name;
        block.style.left = `${position.x}px`;
        block.style.top = `${position.y}px`;

        block.addEventListener("dblclick", () => jumpToYAML(name));

        blocks.push({ name, type, element: block });
        graphContainer.appendChild(block);
        enableDrag(block);
    }

    function enableDrag(element) {
        interact(element).draggable({
            onmove(event) {
                const { target, dx, dy } = event;
                const x = (parseFloat(target.getAttribute('data-x')) || 0) + dx;
                const y = (parseFloat(target.getAttribute('data-y')) || 0) + dy;
                target.style.transform = `translate(${x}px, ${y}px)`;
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            }
        });
    }

    function clearGraph() {
        blocks.forEach((block) => {
            graphContainer.removeChild(block.element);
        });
        blocks = [];
        connections.forEach((conn) => conn.remove());
        connections = [];
    }

    function jumpToYAML(name) {
        // Locate and jump to YAML text line
    }

    uploadInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                yamlEditor.setValue(e.target.result);
                parseYAML(e.target.result);
            };
            reader.readAsText(file);
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const editorContainer = document.getElementById("editor-container");
    const graphContainer = document.getElementById("graph-container");
    const separator = document.getElementById("separator");

    let isDragging = false;

    // Mouse down on separator starts dragging
    separator.addEventListener("mousedown", (e) => {
        isDragging = true;
        document.body.style.cursor = "col-resize"; // Change cursor during drag
    });

    // Mouse move adjusts the widths
    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;

        // Calculate new width as percentage
        const containerRect = document.getElementById("container").getBoundingClientRect();
        const offsetX = e.clientX - containerRect.left;
        const editorWidthPercent = (offsetX / containerRect.width) * 100;
        const graphWidthPercent = 100 - editorWidthPercent;

        // Set the widths of the editor and graph containers
        editorContainer.style.width = `${editorWidthPercent}%`;
        graphContainer.style.width = `${graphWidthPercent}%`;
    });

    // Mouse up stops dragging
    document.addEventListener("mouseup", () => {
        isDragging = false;
        document.body.style.cursor = "default"; // Reset cursor after drag
    });
});
