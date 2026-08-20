// ============================================
// noteDRASI
// Sistema de carpetas y subcarpetas
// PARTE 1/3
// ============================================


const STORAGE_KEY = "notedrasi_brands";


// ============================================
// ESTADO ACTUAL
// ============================================

let brands = loadBrands();

let currentFolder = null;

let currentNoteId = null;

let editingNoteId = null;


// ============================================
// CARGAR DATOS
// ============================================

function loadBrands() {

    const saved =
        localStorage.getItem(STORAGE_KEY);


    if (!saved) {

        return [];

    }


    try {

        const data =
            JSON.parse(saved);


        return normalizeFolders(data);

    }

    catch (error) {

        console.error(
            "Error al cargar noteDRASI:",
            error
        );


        return [];

    }

}


// ============================================
// NORMALIZAR CARPETAS
// ============================================

function normalizeFolders(folders) {

    if (!Array.isArray(folders)) {

        return [];

    }


    folders.forEach(
        folder => {

            if (!Array.isArray(folder.folders)) {

                folder.folders = [];

            }


            if (!Array.isArray(folder.notes)) {

                folder.notes = [];

            }


            if (!Array.isArray(folder.perfumes)) {

                folder.perfumes = [];

            }


            normalizeFolders(
                folder.folders
            );

        }
    );


    return folders;

}


// ============================================
// GUARDAR DATOS
// ============================================

function saveBrands() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(brands)
    );

}


// ============================================
// BUSCAR CARPETA POR ID
// ============================================

function findFolder(
    folders,
    id
) {

    for (
        const folder of folders
    ) {

        if (
            folder.id === id
        ) {

            return folder;

        }


        const found =
            findFolder(
                folder.folders,
                id
            );


        if (found) {

            return found;

        }

    }


    return null;

}


// ============================================
// CREAR CARPETA
// ============================================

function createFolder(
    name,
    color,
    parentFolder = null
) {

    const newFolder = {

        id: Date.now(),

        name: name,

        color:
            color ||
            "#b8ff3d",

        folders: [],

        notes: [],

        perfumes: []

    };


    if (parentFolder) {

        parentFolder.folders.push(
            newFolder
        );

    }

    else {

        brands.push(
            newFolder
        );

    }


    saveBrands();

}


// ============================================
// ELIMINAR CARPETA
// ============================================

function deleteFolder(
    id
) {

    const confirmed =
        confirm(
            "¿Eliminar esta carpeta y todo su contenido?"
        );


    if (!confirmed) {

        return;

    }


    const deleted =
        removeFolder(
            brands,
            id
        );


    if (deleted) {

        saveBrands();

        renderCurrentView();

    }

}


// ============================================
// ELIMINAR CARPETA RECURSIVAMENTE
// ============================================

function removeFolder(
    folders,
    id
) {

    const index =
        folders.findIndex(
            folder =>
                folder.id === id
        );


    if (index !== -1) {

        folders.splice(
            index,
            1
        );

        return true;

    }


    for (
        const folder of folders
    ) {

        if (
            removeFolder(
                folder.folders,
                id
            )
        ) {

            return true;

        }

    }


    return false;

}


// ============================================
// EDITAR CARPETA
// ============================================

function editFolder(
    id
) {

    const folder =
        findFolder(
            brands,
            id
        );


    if (!folder) {

        return;

    }


    const newName =
        prompt(
            "Nuevo nombre:",
            folder.name
        );


    if (
        newName &&
        newName.trim()
    ) {

        folder.name =
            newName.trim();

    }


    const newColor =
        prompt(
            "Nuevo color HEX:",
            folder.color
        );


    if (
        newColor &&
        newColor.trim()
    ) {

        folder.color =
            newColor.trim();

    }


    saveBrands();

    renderCurrentView();

}


// ============================================
// MOSTRAR CARPETAS DEL NIVEL ACTUAL
// ============================================

function renderFolders(
    folders
) {

    const container =
        document.querySelector(
            ".brand-grid"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    folders.forEach(
        folder => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "brand-card";


            card.style.borderColor =
                folder.color;


            card.innerHTML = `

                <div
                    class="brand-icon"
                >
                    📁
                </div>


                <div>

                    <div
                        class="brand-name"
                    >
                        ${escapeHTML(
                            folder.name
                        )}
                    </div>


                    <div
                        class="brand-count"
                    >
                        ${
                            folder.folders.length
                        }
                        carpetas ·
                        ${
                            folder.notes.length
                        }
                        notas
                    </div>

                </div>


                <div
                    class="brand-actions"
                >

                    <button
                        class="edit-folder"
                        type="button"
                    >
                        ✏️
                    </button>


                    <button
                        class="delete-folder"
                        type="button"
                    >
                        🗑️
                    </button>

                </div>

            `;


            card.addEventListener(
                "click",
                function() {

                    openFolder(
                        folder.id
                    );

                }
            );


            const editButton =
                card.querySelector(
                    ".edit-folder"
                );


            editButton.addEventListener(
                "click",
                function(event) {

                    event.stopPropagation();

                    editFolder(
                        folder.id
                    );

                }
            );


            const deleteButton =
                card.querySelector(
                    ".delete-folder"
                );


            deleteButton.addEventListener(
                "click",
                function(event) {

                    event.stopPropagation();

                    deleteFolder(
                        folder.id
                    );

                }
            );


            container.appendChild(
                card
            );

        }
    );

}


// ============================================
// ABRIR CARPETA
// ============================================

function openFolder(
    id
) {

    const folder =
        findFolder(
            brands,
            id
        );


    if (!folder) {

        return;

    }


    currentFolder =
        folder;


    document.querySelector(
        "#home-view"
    ).style.display =
        "none";


    document.querySelector(
        "#note-view"
    ).style.display =
        "none";


    document.querySelector(
        "#note-editor-view"
    ).style.display =
        "none";


    document.querySelector(
        "#brand-view"
    ).style.display =
        "block";


    document.querySelector(
        "#brand-title"
    ).textContent =
        folder.name;


    document.querySelector(
        "#brand-icon"
    ).style.color =
        folder.color;


    renderCurrentFolder();

}


// ============================================
// MOSTRAR CONTENIDO DE CARPETA
// ============================================

function renderCurrentFolder() {

    if (!currentFolder) {

        return;

    }


    renderFolders(
        currentFolder.folders
    );


    renderNotes();

}


// ============================================
// VOLVER
// ============================================

function goBack() {

    if (!currentFolder) {

        return;

    }


    const parent =
        findParentFolder(
            brands,
            currentFolder.id
        );


    if (parent) {

        currentFolder =
            parent;

        renderCurrentFolder();

        updateFolderHeader();

        return;

    }


    closeFolder();

}


// ============================================
// ENCONTRAR PADRE
// ============================================

function findParentFolder(
    folders,
    childId
) {

    for (
        const folder of folders
    ) {

        if (
            folder.folders.some(
                child =>
                    child.id === childId
            )
        ) {

            return folder;

        }


        const parent =
            findParentFolder(
                folder.folders,
                childId
            );


        if (parent) {

            return parent;

        }

    }


    return null;

}
// ============================================
// CERRAR CARPETA
// ============================================

function closeFolder() {

    currentFolder = null;


    document.querySelector(
        "#brand-view"
    ).style.display =
        "none";


    document.querySelector(
        "#note-view"
    ).style.display =
        "none";


    document.querySelector(
        "#note-editor-view"
    ).style.display =
        "none";


    document.querySelector(
        "#home-view"
    ).style.display =
        "block";


    renderBrands();

}


// ============================================
// ACTUALIZAR ENCABEZADO
// ============================================

function updateFolderHeader() {

    if (!currentFolder) {

        return;

    }


    const title =
        document.querySelector(
            "#brand-title"
        );


    if (title) {

        title.textContent =
            currentFolder.name;

    }


    const icon =
        document.querySelector(
            "#brand-icon"
        );


    if (icon) {

        icon.style.color =
            currentFolder.color;

    }

}


// ============================================
// RENDERIZAR VISTA ACTUAL
// ============================================

function renderCurrentView() {

    if (currentFolder) {

        renderCurrentFolder();

        updateFolderHeader();

    }

    else {

        renderBrands();

    }

}


// ============================================
// CREAR CARPETA EN EL NIVEL ACTUAL
// ============================================

function createFolderFromCurrentView() {

    const name =
        prompt(
            "Nombre de la carpeta:"
        );


    if (
        !name ||
        !name.trim()
    ) {

        return;

    }


    const color =
        prompt(
            "Color HEX de la carpeta:",
            "#b8ff3d"
        );


    createFolder(
        name.trim(),
        color,
        currentFolder
    );


    renderCurrentView();

}


// ============================================
// MOSTRAR CARPETAS PRINCIPALES
// ============================================

function renderBrands() {

    const container =
        document.querySelector(
            ".brand-grid"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    brands.forEach(
        folder => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "brand-card";


            card.style.borderColor =
                folder.color;


            card.innerHTML = `

                <div
                    class="brand-icon"
                >
                    📁
                </div>


                <div>

                    <div
                        class="brand-name"
                    >
                        ${escapeHTML(
                            folder.name
                        )}
                    </div>


                    <div
                        class="brand-count"
                    >
                        ${
                            folder.folders.length
                        }
                        carpetas ·
                        ${
                            folder.notes.length
                        }
                        notas
                    </div>

                </div>


                <div
                    class="brand-actions"
                >

                    <button
                        class="edit-folder"
                        type="button"
                    >
                        ✏️
                    </button>


                    <button
                        class="delete-folder"
                        type="button"
                    >
                        🗑️
                    </button>

                </div>

            `;


            card.addEventListener(
                "click",
                function() {

                    openFolder(
                        folder.id
                    );

                }
            );


            const editButton =
                card.querySelector(
                    ".edit-folder"
                );


            editButton.addEventListener(
                "click",
                function(event) {

                    event.stopPropagation();

                    editFolder(
                        folder.id
                    );

                }
            );


            const deleteButton =
                card.querySelector(
                    ".delete-folder"
                );


            deleteButton.addEventListener(
                "click",
                function(event) {

                    event.stopPropagation();

                    deleteFolder(
                        folder.id
                    );

                }
            );


            container.appendChild(
                card
            );

        }
    );

}


// ============================================
// MOSTRAR NOTAS
// ============================================

function renderNotes() {

    if (!currentFolder) {

        return;

    }


    const container =
        document.querySelector(
            "#note-grid"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    currentFolder.notes.forEach(
        note => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "brand-card";


            card.innerHTML = `

                <div
                    class="brand-icon"
                >
                    📝
                </div>


                <div>

                    <div
                        class="brand-name"
                    >
                        ${escapeHTML(
                            note.title
                        )}
                    </div>


                    <div
                        class="brand-count"
                    >
                        ${
                            note.content
                                ? escapeHTML(
                                    note.content.substring(
                                        0,
                                        60
                                    )
                                )
                                : "Sin contenido"
                        }
                    </div>

                </div>


                <div
                    class="brand-actions"
                >

                    <button
                        class="delete-note"
                        type="button"
                    >
                        🗑️
                    </button>

                </div>

            `;


            card.addEventListener(
                "click",
                function() {

                    openNote(
                        note.id
                    );

                }
            );


            const deleteButton =
                card.querySelector(
                    ".delete-note"
                );


            deleteButton.addEventListener(
                "click",
                function(event) {

                    event.stopPropagation();

                    deleteNote(
                        note.id
                    );

                }
            );


            container.appendChild(
                card
            );

        }
    );

}


// ============================================
// ABRIR NOTA
// ============================================

function openNote(
    id
) {

    if (!currentFolder) {

        return;

    }


    const note =
        currentFolder.notes.find(
            note =>
                note.id === id
        );


    if (!note) {

        return;

    }


    currentNoteId =
        id;


    document.querySelector(
        "#brand-view"
    ).style.display =
        "none";


    document.querySelector(
        "#note-editor-view"
    ).style.display =
        "none";


    document.querySelector(
        "#note-view"
    ).style.display =
        "block";


    const title =
        document.querySelector(
            "#note-detail-title"
        );


    const content =
        document.querySelector(
            "#note-detail-content"
        );


    if (title) {

        title.textContent =
            note.title;

    }


    if (content) {

        content.textContent =
            note.content ||
            "Esta nota está vacía.";

    }

}


// ============================================
// VOLVER DE UNA NOTA
// ============================================

function closeNote() {

    document.querySelector(
        "#note-view"
    ).style.display =
        "none";


    document.querySelector(
        "#brand-view"
    ).style.display =
        "block";


    currentNoteId =
        null;


    renderCurrentFolder();

}


// ============================================
// CREAR NOTA
// ============================================

function openNewNoteEditor() {

    if (!currentFolder) {

        return;

    }


    editingNoteId =
        null;


    document.querySelector(
        "#editor-title"
    ).textContent =
        "Nueva nota";


    document.querySelector(
        "#note-title-input"
    ).value =
        "";


    document.querySelector(
        "#note-content-input"
    ).value =
        "";


    document.querySelector(
        "#brand-view"
    ).style.display =
        "none";


    document.querySelector(
        "#note-editor-view"
    ).style.display =
        "block";


    document.querySelector(
        "#note-title-input"
    ).focus();

}


// ============================================
// EDITAR NOTA
// ============================================

function openEditNoteEditor() {

    if (!currentFolder) {

        return;

    }


    const note =
        currentFolder.notes.find(
            note =>
                note.id === currentNoteId
        );


    if (!note) {

        return;

    }


    editingNoteId =
        note.id;


    document.querySelector(
        "#editor-title"
    ).textContent =
        "Editar nota";


    document.querySelector(
        "#note-title-input"
    ).value =
        note.title;


    document.querySelector(
        "#note-content-input"
    ).value =
        note.content;


    document.querySelector(
        "#note-view"
    ).style.display =
        "none";


    document.querySelector(
        "#note-editor-view"
    ).style.display =
        "block";


    document.querySelector(
        "#note-title-input"
    ).focus();

}


// ============================================
// GUARDAR NOTA
// ============================================

function saveNoteFromEditor() {

    if (!currentFolder) {

        return;

    }


    const titleInput =
        document.querySelector(
            "#note-title-input"
        );


    const contentInput =
        document.querySelector(
            "#note-content-input"
        );


    const title =
        titleInput.value.trim();


    const content =
        contentInput.value;


    if (!title) {

        alert(
            "La nota necesita un título."
        );


        titleInput.focus();

        return;

    }


    if (
        editingNoteId !== null
    ) {

        const note =
            currentFolder.notes.find(
                note =>
                    note.id ===
                    editingNoteId
            );


        if (note) {

           note.title =
                title;

            note.content =
                content;

        }

    }

    else {

        const newNote = {

            id: Date.now(),

            title: title,

            content: content

        };


        currentFolder.notes.push(
            newNote
        );


        currentNoteId =
            newNote.id;

    }


    saveBrands();


    document.querySelector(
        "#note-editor-view"
    ).style.display =
        "none";


    document.querySelector(
        "#note-view"
    ).style.display =
        "block";


    openNote(
        currentNoteId
    );


    renderCurrentFolder();

}


// ============================================
// CANCELAR EDITOR
// ============================================

function cancelNoteEditor() {

    document.querySelector(
        "#note-editor-view"
    ).style.display =
        "none";


    document.querySelector(
        "#note-view"
    ).style.display =
        "none";


    document.querySelector(
        "#brand-view"
    ).style.display =
        "block";


    editingNoteId =
        null;


    renderCurrentFolder();

}


// ============================================
// ELIMINAR NOTA
// ============================================

function deleteNote(
    id
) {

    if (!currentFolder) {

        return;

    }


    const confirmed =
        confirm(
            "¿Eliminar esta nota?"
        );


    if (!confirmed) {

        return;

    }


    currentFolder.notes =
        currentFolder.notes.filter(
            note =>
                note.id !== id
        );


    saveBrands();


    renderCurrentFolder();


    document.querySelector(
        "#note-view"
    ).style.display =
        "none";


    document.querySelector(
        "#brand-view"
    ).style.display =
        "block";


    currentNoteId =
        null;

}


// ============================================
// ESCAPAR HTML
// ============================================

function escapeHTML(
    text
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}

// ============================================
// BOTONES
// ============================================

function setupButtons() {

    const addButtons =
        document.querySelectorAll(
            ".add-button"
        );


    if (addButtons.length > 0) {

        const addButton =
            addButtons[
                addButtons.length - 1
            ];


        addButton.addEventListener(
            "click",
            function() {

                createFolderFromCurrentView();

            }
        );

    }


    const backButton =
        document.querySelector(
            "#back-button"
        );


    if (backButton) {

        backButton.addEventListener(
            "click",
            function() {

                goBack();

            }
        );

    }


    const addNoteButton =
        document.querySelector(
            "#add-note-button"
        );


    if (addNoteButton) {

        addNoteButton.addEventListener(
            "click",
            function() {

                openNewNoteEditor();

            }
        );

    }

}


// ============================================
// BOTONES DE NOTAS
// ============================================

function setupNoteButtons() {

    const editButton =
        document.querySelector(
            "#edit-note-button"
        );


    const deleteButton =
        document.querySelector(
            "#delete-note-button"
        );


    const saveButton =
        document.querySelector(
            "#save-note-button"
        );


    if (editButton) {

        editButton.addEventListener(
            "click",
            openEditNoteEditor
        );

    }


    if (deleteButton) {

        deleteButton.addEventListener(
            "click",
            function() {

                if (currentNoteId) {

                    deleteNote(
                        currentNoteId
                    );

                }

            }
        );

    }


    if (saveButton) {

        saveButton.addEventListener(
            "click",
            saveNoteFromEditor
        );

    }

}


// ============================================
// INICIAR APP
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        renderBrands();

        setupButtons();

        setupNoteButtons();

    }
);
