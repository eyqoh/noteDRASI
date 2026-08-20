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

   
