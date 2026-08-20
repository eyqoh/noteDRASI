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


    alert(
        "Abriste la carpeta: " +
        brand.name +
        "\n\nPróximamente acá estarán tus perfumes."
    );

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


        card.className = "brand-card";


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

        `;


        // Hacer que la carpeta sea tocable

        card.addEventListener(
            "click",
            function() {

                openBrand(brand.id);

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
// Iniciar noteDRASI
// --------------------------------------------

document.addEventListener(
    "DOMContentLoaded",
    function() {

        renderBrands();

        setupAddButton();

    }
);
