// ============================================
// noteDRASI
// Carpetas + notas + editor
// ============================================


const STORAGE_KEY = "notedrasi_brands";


let brands = loadBrands();

let currentBrandId = null;

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


        data.forEach(
            brand => {

                if (!Array.isArray(brand.notes)) {

                    brand.notes = [];

                }

                if (!Array.isArray(brand.perfumes)) {

                    brand.perfumes = [];

                }

            }
        );


        return data;

    } catch (error) {

        console.error(
            "Error al cargar:",
            error
        );


        return [];

    }

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
// CREAR CARPETA
// ============================================

function createBrand(name, color) {

    const brand = {

        id: Date.now(),

        name: name,

        color: color || "#b8ff3d",

        perfumes: [],

        notes: []

    };


    brands.push(brand);

    saveBrands();

    renderBrands();

}


// ============================================
// MOSTRAR CARPETAS
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
        function(brand) {


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "brand-card";


            card.style.borderColor =
                brand.color;


            card.innerHTML = `

                <div class="brand-icon">
                    📁
                </div>


                <div>

                    <div class="brand-name">
                        ${escapeHTML(brand.name)}
                    </div>


                    <div class="brand-count">
                        ${brand.notes.length}
                        notas
                    </div>

                </div>


                <div class="brand-actions">

                    <button
                        class="edit-brand"
                        type="button"
                    >
                        ✏️
                    </button>


                    <button
                        class="delete-brand"
                        type="button"
                    >
                        🗑️
                    </button>

                </div>

            `;


            card.addEventListener(
                "click",
                function() {

                    openBrand(
                        brand.id
                    );

                }
            );


            const editButton =
                card.querySelector(
                    ".edit-brand"
                );


            editButton.addEventListener(
                "click",
                function(event) {

                    event.stopPropagation();

                    editBrand(
                        brand.id
                    );

                }
            );


            const deleteButton =
                card.querySelector(
                    ".delete-brand"
                );


            deleteButton.addEventListener(
                "click",
                function(event) {

                    event.stopPropagation();

                    deleteBrand(
                        brand.id
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

function openBrand(id) {

    const brand =
        brands.find(
            brand => brand.id === id
        );


    if (!brand) {

        return;

    }


    currentBrandId = id;


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
        brand.name;


    document.querySelector(
        "#brand-icon"
    ).style.color =
        brand.color;


    renderNotes();

}


// ============================================
// VOLVER AL INICIO
// ============================================

function closeBrand() {

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


    currentBrandId = null;

}


// ============================================
// EDITAR CARPETA
// ============================================

function editBrand(id) {

    const brand =
        brands.find(
            brand => brand.id === id
        );


    if (!brand) {

        return;

    }


    const newName =
        prompt(
            "Nuevo nombre:",
            brand.name
        );


    if (newName) {

        brand.name =
            newName;

    }


    const newColor =
        prompt(
            "Nuevo color HEX:",
            brand.color
        );


    if (newColor) {

        brand.color =
            newColor;

    }


    saveBrands();

    renderBrands();

}


// ============================================
// ELIMINAR CARPETA
// ============================================

function deleteBrand(id) {

    const brand =
        brands.find(
            brand => brand.id === id
        );


    if (!brand) {

        return;

    }


    const confirmed =
        confirm(
            "¿Eliminar la carpeta " +
            brand.name +
            "?"
        );


    if (!confirmed) {

        return;

    }


    brands =
        brands.filter(
            brand => brand.id !== id
        );


    saveBrands();

    renderBrands();

}


// ============================================
// MOSTRAR NOTAS
// ============================================

function renderNotes() {

    const brand =
        brands.find(
            brand => brand.id === currentBrandId
        );


    if (!brand) {

        return;

    }


    const container =
        document.querySelector(
            "#note-grid"
        );


    const count =
        document.querySelector(
            "#brand-perfume-count"
        );


    container.innerHTML = "";


    count.textContent =
        brand.notes.length +
        " notas";


    if (
        brand.notes.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📝
                </div>

                <div class="empty-title">
                    Todavía no hay notas
                </div>

                <div class="empty-text">
                    Tocá + para crear tu primera nota.
                </div>

            </div>

        `;


        return;

    }


    brand.notes.forEach(
        function(note) {


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
                        ${escapeHTML(note.title)}
                    </div>


                    <div class="brand-count">
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


                <div class="brand-actions">

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

function openNote(id) {

    const brand =
        brands.find(
            brand => brand.id === currentBrandId
        );


    if (!brand) {

        return;

    }


    const note =
        brand.notes.find(
            note => note.id === id
        );


    if (!note) {

        return;

    }


    currentNoteId = id;


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


    document.querySelector(
        "#note-detail-title"
    ).textContent =
        note.title;


    document.querySelector(
        "#note-detail-content"
    ).textContent =
        note.content ||
        "Esta nota está vacía.";

}


// ============================================
// VOLVER DE NOTA
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


    currentNoteId = null;

}


// ============================================
// ABRIR EDITOR PARA CREAR
// ============================================

function openNewNoteEditor() {

    editingNoteId = null;


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
// ABRIR EDITOR PARA EDITAR
// ============================================

function openEditNoteEditor() {

    const brand =
        brands.find(
            brand => brand.id === currentBrandId
        );


    if (!brand) {

        return;

    }


    const note =
        brand.notes.find(
            note => note.id === currentNoteId
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

    const brand =
        brands.find(
            brand => brand.id === currentBrandId
        );


    if (!brand) {

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


    if (editingNoteId !== null) {

        const note =
            brand.notes.find(
                note =>
                    note.id === editingNoteId
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


        brand.notes.push(
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


    renderNotes();

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


    editingNoteId = null;

}


// ============================================
// ELIMINAR NOTA
// ============================================

function deleteNote(id) {

    const brand =
        brands.find(
            brand => brand.id === currentBrandId
        );


    if (!brand) {

        return;

    }


    const confirmed =
        confirm(
            "¿Eliminar esta nota?"
        );


    if (!confirmed) {

        return;

    }


    brand.notes =
        brand.notes.filter(
            note => note.id !== id
        );


    saveBrands();

    renderNotes();


    document.querySelector(
        "#note-view"
    ).style.display =
        "none";


    document.querySelector(
        "#brand-view"
    ).style.display =
        "block";


    currentNoteId = null;

}


// ============================================
// ESCAPAR HTML
// ============================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


// ============================================
// BOTÓN AGREGAR CARPETA
// ============================================

function setupAddButton() {

    const buttons =
        document.querySelectorAll(
            ".add-button"
        );


    const button =
        buttons[buttons.length - 1];


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        function() {

            const name =
                prompt(
                    "Nombre de la carpeta:"
                );


            if (!name) {

                return;

            }


            const color =
                prompt(
                    "Color HEX de la carpeta:",
                    "#b8ff3d"
                );


            createBrand(
                name,
                color ||
                "#b8ff3d"
            );

        }
    );

}


// ============================================
// BOTÓN AGREGAR NOTA
// ============================================

function setupAddNoteButton() {

    const button =
        document.querySelector(
            "#add-note-button"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        function() {

            openNewNoteEditor();

        }
    );

}


// ============================================
// BOTONES VOLVER
// ============================================

function setupBackButtons() {

    const brandBack =
        document.querySelector(
            "#back-button"
        );


    const noteBack =
        document.querySelector(
            "#note-back-button"
        );


    const cancelButton =
        document.querySelector(
            "#cancel-note-button"
        );


    const cancelEditor =
        document.querySelector(
            "#cancel-editor-button"
        );


    if (brandBack) {

        brandBack.addEventListener(
            "click",
            function() {

                closeBrand();

            }
        );

    }


    if (noteBack) {

        noteBack.addEventListener(
            "click",
            function() {

                closeNote();

            }
        );

    }


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            function() {

                cancelNoteEditor();

            }
        );

    }


    if (cancelEditor) {

        cancelEditor.addEventListener(
            "click",
            function() {

                cancelNoteEditor();

            }
        );

    }

}


// ============================================
// ACCIONES DE NOTA
// ============================================

function setupNoteActions() {

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
            function() {

                openEditNoteEditor();

            }
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
            function() {

                saveNoteFromEditor();

            }
        );

    }

}


// ============================================
// INICIAR
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        renderBrands();

        setupAddButton();

        setupAddNoteButton();

        setupBackButtons();

        setupNoteActions();

    }
);

   
