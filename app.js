// ============================================
// noteDRASI
// Sistema inicial de marcas
// ============================================

const STORAGE_KEY = "notedrasi_brands";


// --------------------------------------------
// Cargar marcas guardadas
// --------------------------------------------

function loadBrands() {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
        return [];
    }

    try {
        return JSON.parse(saved);
    } catch (error) {
        console.error("No se pudieron cargar las marcas:", error);
        return [];
    }
}


// --------------------------------------------
// Guardar marcas
// --------------------------------------------

function saveBrands(brands) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(brands)
    );

}


// --------------------------------------------
// Obtener las marcas actuales
// --------------------------------------------

let brands = loadBrands();


// --------------------------------------------
// Crear una nueva marca
// --------------------------------------------

function createBrand(name, color = "#b8ff3d") {

    const brand = {

        id: Date.now(),

        name: name,

        color: color,

        perfumes: []

    };


    brands.push(brand);

    saveBrands(brands);

    renderBrands();

}


// --------------------------------------------
// Eliminar una marca
// --------------------------------------------

function deleteBrand(id) {

    brands = brands.filter(
        brand => brand.id !== id
    );

    saveBrands(brands);

    renderBrands();

}


// --------------------------------------------
// Mostrar las marcas
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


    brands.forEach(brand => {

        const card =
            document.createElement("article");


        card.className = "brand-card";


        card.style.borderColor =
            brand.color;
card.addEventListener("click", () => {
    openBrand(brand.id);
});

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


        container.appendChild(card);

    });

}

// --------------------------------------------
// Abrir una marca
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
// Botón para agregar marca
// --------------------------------------------

function setupAddButton() {

    const button =
        document.querySelector(".add-button");


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            const name =
                prompt("Nombre de la marca:");

            
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
// Inicializar noteDRASI
// --------------------------------------------

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderBrands();

        setupAddButton();

    }
);
