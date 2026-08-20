// ============================================
// noteDRASI
// Carpetas + notas
// ============================================


const STORAGE_KEY = "notedrasi_brands";


let brands = loadBrands();

let currentBrandId = null;

let currentNoteId = null;


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


        // Compatibilidad con carpetas
        // creadas anteriormente

        data.forEach(
            brand => {

                if (!Array.isArray(brand.perfumes)) {

                    brand.perfumes = [];

                }


                if (!Array.isArray(brand.notes)) {

                    brand.notes = [];

                }

            }
        );


        return data;

    } catch (error) {

        console.error(
            "Error al cargar datos:",
            error
        );


        return [];

    }

}


// ============================================
// GUARDAR
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


    const homeView =
        document.querySelector(
            "#home-view"
        );


    const brandView =
        document.querySelector(
            "#brand-view"
        );


    const brandTitle =
        document.querySelector(
            "#brand-title"
        );


    const brandCount =
        document.querySelector(
            "#brand-perfume-count"
        );


    const brandIcon =
        document.querySelector(
            "#brand-icon"
        );


    homeView.style.display =
        "none";


    brandView.style.display =
        "block";


    brandTitle.textContent =
        brand.name;


    brandIcon.style.color =
        brand.color;


    renderNotes();


    brandCount.textContent =
        brand.notes.length +
        " notas";

}


// ============================================
// VOLVER A CARPETAS
// ============================================

function closeBrand() {

    const homeView =
        document.querySelector(
            "#home-view"
        );


    const brandView =
        document.querySelector(
            "#brand-view"
        );


    const noteView =
        document.querySelector(
            "#note-view"
        );


    noteView.style.display =
        "none";


    brandView.style.display =
        "none";


    homeView.style.display =
        "block";


    currentBrandId = null;

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
                        ${brand.name}
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


            // Abrir carpeta

            card.addEventListener(
                "click",
                function() {

                    openBrand(
                        brand.id
                    );

                }
            );


            // Editar

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


            // Eliminar

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
// CREAR NOTA
// ============================================

function createNote() {

    const brand =
        brands.find(
            brand => brand.id === currentBrandId
        );


    if (!brand) {

        return;

    }


    const title =
        prompt(
            "Título de la nota:"
        );


    if (!title) {

        return;

    }


    const content =
        prompt(
            "Contenido de la nota:"
        );


    const note = {

        id: Date.now(),

        title: title,

        content: content || ""

    };


    brand.notes.push(
        note
    );


    saveBrands();

    renderNotes();

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
                        ${note.title}
                    </div>


                    <div class="brand-count">
                        ${note.content
                            ? note.content.substring(0, 60)
                            : "Sin contenido"}
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


            // Abrir nota

            card.addEventListener(
                "click",
                function() {

                    openNote(
                        note.id
                    );

                }
            );


            // Eliminar nota

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


    const brandView =
        document.querySelector(
            "#brand-view"
        );


    const noteView =
        document.querySelector(
            "#note-view"
        );


    const title =
        document.querySelector(
            "#note-detail-title"
        );


    const content =
        document.querySelector(
            "#note-detail-content"
        );


    brandView.style.display =
        "none";


    noteView.style.display =
        "block";


    title.textContent =
        note.title;


    content.textContent =
        note.content ||
        "Esta nota está vacía.";

}


// ============================================
// VOLVER DE NOTA
// ============================================

function closeNote() {

    const noteView =
        document.querySelector(
            "#note-view"
        );


    const brandView =
        document.querySelector(
            "#brand-view"
        );


    noteView.style.display =
        "none";


    brandView.style.display =
        "block";


    currentNoteId = null;

}


// ============================================
// EDITAR NOTA
// ============================================

function editNote() {

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


    const newTitle =
        prompt(
            "Título:",
            note.title
        );


    if (newTitle) {

        note.title =
            newTitle;

    }


    const newContent =
        prompt(
            "Contenido:",
            note.content
        );


    if (newContent !== null) {

        note.content =
            newContent;

    }


    saveBrands();

    openNote(
        note.id
    );

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

}


// ============================================
// BOTÓN AGREGAR CARPETA
// ============================================

function setupAddButton() {

    const button =
        document.querySelector(
            ".add-button"
        );


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

            createNote();

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

}


// ============================================
// BOTONES DE NOTA
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


    if (editButton) {

        editButton.addEventListener(
            "click",
            function() {

                editNote();

            }
        );

    }


    if (deleteButton) {

        deleteButton.addEventListener(
            "click",
            function() {


                if (!currentNoteId) {

                    return;

                }


                deleteNote(
                    currentNoteId
                );


                closeNote();

            }
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

        setupAddButton();

        setupAddNoteButton();

        setupBackButtons();

        setupNoteActions();

    }
);
