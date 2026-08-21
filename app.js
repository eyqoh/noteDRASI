// ============================================
// noteDRASI
// Sistema de carpetas + notas
// ============================================

const STORAGE_KEY = "notedrasi_data";

let data = loadData();

let currentFolder = null;

let currentNote = null;


// ============================================
// DATOS
// ============================================

function loadData() {

    const saved =
        localStorage.getItem(STORAGE_KEY);

    if (!saved) {

        return {
            folders: [],
            notes: []
        };

    }

    try {

        const parsed =
            JSON.parse(saved);

        return normalizeFolder(parsed);

    } catch {

        return {
            folders: [],
            notes: []
        };

    }

}


// ============================================
// NORMALIZAR
// ============================================

function normalizeFolder(folder) {

    if (!folder.folders) {

        folder.folders = [];

    }

    if (!folder.notes) {

        folder.notes = [];

    }

    folder.folders.forEach(
        child => normalizeFolder(child)
    );

    return folder;

}


// ============================================
// GUARDAR
// ============================================

function saveData() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );

}


// ============================================
// CREAR CARPETA
// ============================================

function createFolder(
    name,
    color
) {

    const folder = {

        id: Date.now(),

        name: name,

        color:
            color ||
            "#b8ff3d",

        folders: [],

        notes: []

    };


    if (currentFolder) {

        currentFolder.folders.push(
            folder
        );

    } else {

        data.folders.push(
            folder
        );

    }


    saveData();

    render();

}


// ============================================
// BUSCAR CARPETA
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
// ENCONTRAR PADRE
// ============================================

function findParent(
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
            findParent(
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
// ABRIR CARPETA
// ============================================

function openFolder(id) {

    const folder =
        findFolder(
            data.folders,
            id
        );


    if (!folder) {

        return;

    }


    currentFolder =
        folder;


    currentNote =
        null;


    render();

}


// ============================================
// VOLVER
// ============================================

function goBack() {

    if (!currentFolder) {

        return;

    }


    const parent =
        findParent(
            data.folders,
            currentFolder.id
        );


    if (parent) {

        currentFolder =
            parent;

    } else {

        currentFolder =
            null;

    }


    currentNote =
        null;


    render();

}


// ============================================
// CREAR NOTA
// ============================================

function createNote(
    title,
    content
) {

    if (!currentFolder) {

        return;

    }


    const note = {

        id: Date.now(),

        title: title,

        content: content

    };


    currentFolder.notes.push(
        note
    );


    saveData();

    render();

}


// ============================================
// BUSCAR NOTA
// ============================================

function findNote(id) {

    if (!currentFolder) {

        return null;

    }


    return currentFolder.notes.find(
        note =>
            note.id === id
    );

}


// ============================================
// ABRIR NOTA
// ============================================

function openNote(id) {

    const note =
        findNote(id);


    if (!note) {

        return;

    }


    currentNote =
        note;


    renderNote();

}

// ============================================
// RENDER PRINCIPAL
// ============================================

function render() {

    if (currentNote) {

        renderNote();

        return;

    }


    if (currentFolder) {

        renderFolder();

        return;

    }


    renderHome();

}


// ============================================
// RENDER INICIO
// ============================================

function renderHome() {

    showView("home-view");


    const grid =
        document.querySelector(
            ".brand-grid"
        );


    if (!grid) {

        return;

    }


    grid.innerHTML = "";


    data.folders.forEach(
        folder => {

            grid.appendChild(
                createFolderCard(
                    folder
                )
            );

        }
    );

}


// ============================================
// RENDER CARPETA
// ============================================

function renderFolder() {

    showView("brand-view");

    const title =
        document.querySelector(
            "#brand-title"
        );

    if (title) {

        title.textContent =
            currentFolder.name;

    }

    const folderGrid =
        document.querySelector(
            "#folder-grid"
        );

    const noteGrid =
        document.querySelector(
            "#note-grid"
        );

    if (folderGrid) {

        folderGrid.innerHTML = "";

        currentFolder.folders.forEach(
            folder => {

                folderGrid.appendChild(
                    createFolderCard(
                        folder
                    )
                );

            }
        );

    }

    if (noteGrid) {

        noteGrid.innerHTML = "";

        currentFolder.notes.forEach(
            note => {

                noteGrid.appendChild(
                    createNoteCard(
                        note
                    )
                );

            }
        );

    }

}


// ============================================
// TARJETA DE CARPETA
// ============================================

function createFolderCard(
    folder
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "brand-card";


    card.style.borderColor =
        folder.color;


    card.innerHTML = `

        <div class="brand-icon">
            📁
        </div>

        <div class="brand-info">

            <div class="brand-name">
                ${escapeHTML(
                    folder.name
                )}
            </div>

            <div class="brand-count">
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

        <div class="brand-actions">

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


    const editButton =
        card.querySelector(
            ".edit-folder"
        );


    const deleteButton =
        card.querySelector(
            ".delete-folder"
        );


    editButton.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();


            const newName =
                prompt(
                    "Nuevo nombre:",
                    folder.name
                );


            if (
                !newName ||
                !newName.trim()
            ) {

                return;

            }


            folder.name =
                newName.trim();


            saveData();

            render();

        }
    );


    deleteButton.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();


            const confirmed =
                confirm(
                    "¿Eliminar esta carpeta?"
                );


            if (!confirmed) {

                return;

            }


            deleteFolder(
                folder.id
            );

        }
    );


    card.addEventListener(
        "click",
        event => {

            if (
                event.target.closest(
                    ".brand-actions"
                )
            ) {

                return;

            }


            openFolder(
                folder.id
            );

        }
    );


    return card;

}



// ============================================
// TARJETA DE NOTA
// ============================================

function createNoteCard(
    note
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "brand-card";


    card.innerHTML = `

        <div class="brand-icon">
            📝
        </div>

        <div>

            <div class="brand-name">
                ${escapeHTML(
                    note.title
                )}
            </div>

            <div class="brand-count">
                Nota
            </div>

        </div>

    `;


    card.addEventListener(
        "click",
        () => {

            openNote(
                note.id
            );

        }
    );


    return card;

}


// ============================================
// MOSTRAR NOTA
// ============================================

function renderNote() {

    showView(
        "note-view"
    );


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
            currentNote.title;

    }


    if (content) {

        content.textContent =
            currentNote.content ||
            "Esta nota está vacía.";

    }

}


// ============================================
// MOSTRAR VISTA
// ============================================

function showView(
    id
) {

    const views =
        document.querySelectorAll(
            "section"
        );


    views.forEach(
        view => {

            view.style.display =
                "none";

        }
    );


    const target =
        document.querySelector(
            `#${id}`
        );


    if (target) {

        target.style.display =
            "block";

    }

}


// ============================================
// CREAR DESDE EL +
// ============================================

function showCreateMenu() {

    const choice =
        prompt(
            "¿Qué querés crear?\n\n" +
            "1 - Carpeta\n" +
            "2 - Nota\n\n" +
            "Cancelá para salir."
        );


    if (choice === "1") {

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
                "Color HEX:",
                "#b8ff3d"
            );


        createFolder(
            name.trim(),
            color
        );


        return;

    }


    if (choice === "2") {

        if (!currentFolder) {

            alert(
                "Las notas se crean dentro de una carpeta."
            );

            return;

        }


        const title =
            prompt(
                "Título de la nota:"
            );


        if (
            !title ||
            !title.trim()
        ) {

            return;

        }


        const content =
            prompt(
                "Escribí el contenido:"
            );


        createNote(
            title.trim(),
            content || ""
        );

    }

}


// ============================================
// ESCAPAR HTML
// ============================================

function escapeHTML(
    text
) {

    const element =
        document.createElement(
            "div"
        );


    element.textContent =
        text;


    return element.innerHTML;

}

// ============================================
// CONFIGURAR BOTONES
// ============================================

function setupButtons() {

    const backButton =
        document.querySelector(
            "#back-button"
        );


    if (backButton) {

        backButton.addEventListener(
            "click",
            goBack
        );

    }


    const noteBackButton =
        document.querySelector(
            "#note-back-button"
        );


    if (noteBackButton) {

        noteBackButton.addEventListener(
            "click",
            () => {

                currentNote =
                    null;

                render();

            }
        );

    }


    const addButtons =
        document.querySelectorAll(
            ".add-button"
        );


    addButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                showCreateMenu
            );

        }
    );


    const deleteButton =
        document.querySelector(
            "#delete-note-button"
        );


    if (deleteButton) {

        deleteButton.addEventListener(
            "click",
            () => {

                if (
                    !currentFolder ||
                    !currentNote
                ) {

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
                            note.id !==
                            currentNote.id
                    );


                currentNote =
                    null;


                saveData();

                render();

            }
        );

    }

}


// ============================================
// INICIAR
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupButtons();

        render();

    }
);
