// ============================================
// noteDRASI
// Sistema de marcas
// ============================================

const STORAGE_KEY = "notedrasi_brands";


// --------------------------------------------
// Cargar marcas
// --------------------------------------------

function loadBrands() {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
        return [];
    }

    try {
        return JSON.parse(saved);
    } catch (error) {
        console.error("Error al cargar las marcas:", error);
        return [];
    }
}


// --------------------------------------------
// Guardar marcas
// --------------------------------------------

function saveBrands() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(brands)
    );

}


// --------------------------------------------
// Datos actuales
// --------------------------------------------

let brands = loadBrands();


// --------------------------------------------
// Crear marca
// --------------------------------------------

function createBrand(name, color) {

    const brand = {

        id: Date.now(),

        name: name,

        color: color || "#b8ff3d",

        perfumes: []

    };

    brands.push(brand);

    saveBrands();

    renderBrands();

}


// --------------------------------------------
// Abrir marca
// --------------------------------------------

function openBrand(id) {

    const brand = brands.find(
        brand => brand.id === id
    );

    if (!brand) {
        return;
    }

    const brandGrid =
        document.querySelector(".brand-grid");

    const brandView =
        document.querySelector("#brand-view");

    const sectionTitle =
        document.querySelector(".section-title");

    const search =
        document.querySelector(".search");

    const brandTitle =
        document.querySelector("#brand-title");

    const brandCount =
        document.querySelector("#brand-perfume-count");

    const brandIcon =
        document.querySelector("#brand-icon");


    brandGrid.classList.add("hidden");

    sectionTitle.classList.add("hidden");

    search.classList.add("hidden");

    brandView.classList.remove("hidden");


    brandTitle.textContent =
        brand.name;

    brandCount.textContent =
        brand.perfumes.length + " perfumes";

    brandIcon.style.color =
        brand.color;

}


// --------------------------------------------
// Volver a marcas
// --------------------------------------------

function closeBrand() {

    const brandGrid =
        document.querySelector(".brand-grid");

    const brandView =
        document.querySelector("#brand-view");

    const sectionTitle =
        document.querySelector(".section-title");

    const search =
        document.querySelector(".search");


    brandView.classList.add("hidden");

    brandGrid.classList.remove("hidden");

    sectionTitle.classList.remove("hidden");

    search.classList.remove("hidden");

}


// --------------------------------------------
// Eliminar marca
// --------------------------------------------

function deleteBrand(id) {

    const brand = brands.find(
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

    brands = brands.filter(
        brand => brand.id !== id
    );

    saveBrands();

    renderBrands();

}


// --------------------------------------------
// Editar marca
// --------------------------------------------

function editBrand(id) {

    const brand = brands.find(
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
        brand.name = newName;
    }

    const newColor =
        prompt(
            "Nuevo color HEX:",
            brand.color
        );

    if (newColor) {
        brand.color = newColor;
    }

    saveBrands();

    renderBrands();

}


// --------------------------------------------
// Mostrar marcas
// --------------------------------------------

function renderBrands() {

    const container =
        document.querySelector(".brand-grid");

    if (!container) {
        return;
    }

    container.innerHTML = "";


    if (brands.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📁
                </div>

                <div class="empty-title">
                    No hay marcas todavía
                </div>

                <div class="empty-text">
                    Creá tu primera carpeta para empezar.
                </div>

            </div>

        `;

        return;

    }


    brands.forEach(function(brand) {

        const card =
            document.createElement("article");


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
                    ${brand.perfumes.length}
                    perfumes
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

                openBrand(brand.id);

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

                editBrand(brand.id);

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

                deleteBrand(brand.id);

            }
        );


        container.appendChild(card);

    });

}


// --------------------------------------------
// Botón agregar marca
// --------------------------------------------

function setupAddButton() {

    const button =
        document.querySelector(".add-button");

    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        function() {

            const name =
                prompt(
                    "Nombre de la marca:"
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
                color || "#b8ff3d"
            );

        }
    );

}


// --------------------------------------------
// Botón volver
// --------------------------------------------

function setupBackButton() {

    const button =
        document.querySelector("#back-button");

    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        function() {

            closeBrand();

        }
    );

}


// --------------------------------------------
// Iniciar noteDRASI
// --------------------------------------------

document.addEventListener(
    "DOMContentLoaded",
    function() {

        renderBrands();

        setupAddButton();

        setupBackButton();

    }
);
