// Service category selector for pricing section
document.addEventListener('DOMContentLoaded', function () {
    initServiceSelector();
    // Render Daňová evidence cards on initial load
    renderPricingFor('osvc');
});

// Pricing data for each service category with card definitions
const pricingData = {
    'osvc': {
        plans: [
            {
                title: 'Start',
                price: 'od 1 500 Kč/měsíc',
                featured: false,
                features: ['Do 60 dokladů/měsíc']
            },
            {
                title: 'Business',
                price: '2 200 Kč/měsíc',
                featured: true,
                features: ['Do 120 dokladů/měsíc']
            },
            {
                title: 'Enterprise',
                price: '2 800 Kč/měsíc',
                featured: false,
                features: ['Nad 120 dokladů/měsíc']
            }
        ]
    },
    'podvojne': {
        plans: [
            {
                title: 'Start',
                price: 'od 2 500 Kč/měsíc',
                featured: false,
                features: ['Do 80 dokladů/měsíc']
            },
            {
                title: 'Business',
                price: 'od 3 800 Kč/měsíc',
                featured: true,
                features: ['Do 150 dokladů/měsíc']
            },
            {
                title: 'Enterprise',
                price: 'od 4 800 Kč/měsíc',
                featured: false,
                features: ['Nad 150 dokladů/měsíc']
            }
        ]
    },
    'mzdy': {
        plans: [
            {
                title: 'Mzda 1 zaměstnance',
                price: 'od 250 Kč/měsíc',
                featured: false,
                features: ['Do 5 zaměstnanců']
            },
            {
                title: 'Roční zúčtování',
                price: '150 Kč/zaměstnance',
                featured: true,
                features: ['Do 25 zaměstnanců']
            }
        ]
    },
    'danovepriznani': {
        plans: [
            {
                title: 'OSVČ (DPPO)',
                price: 'od 1 200 Kč',
                featured: false,
                features: ['FO — daňové přiznání']
            },
            {
                title: 's.r.o. (DPPO)',
                price: 'od 2 000 Kč',
                featured: true,
                features: ['PO — daňové přiznání']
            },
            {
                title: 'DPH/kontrolní hlášení',
                price: 'od 400 Kč/období',
                featured: false,
                features: ['Komplexní daňové přiznání']
            },
            {
                title: 'Přehledy OSSZ, ZP',
                price: 'od 300 Kč/kus',
                featured: false,
                features: ['Přehledy pro OSSZ']
            },
            {
                title: 'Silniční daň',
                price: 'od 300 Kč',
                featured: false,
                features: ['Silniční daň']
            }
        ]
    },
    'poradenstvi': {
        plans: [
            {
                title: 'Účetní/daňové poradenství',
                price: 'od 600 Kč/hod',
                featured: true,
                features: ['Individuální konzultace']
            }
        ]
    }
};

function initServiceSelector() {
    const serviceButtons = document.querySelectorAll('.period-btn[data-service]');

    if (serviceButtons.length === 0) {
        console.debug('No service category buttons found');
        return;
    }

    serviceButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from all buttons
            serviceButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            const service = this.getAttribute('data-service');
            console.debug('Selected service category:', service);

            // Update service features and prices display
            updateServiceDisplay(service);
        });
    });

    console.debug('Service selector initialized with', serviceButtons.length, 'buttons');
}

function updateServiceDisplay(service) {
    // Render pricing cards for the selected service
    renderPricingFor(service);

    console.debug('Updated service display for:', service);
}

function renderPricingFor(service) {
    const pricingGrid = document.querySelector('.pricing-grid');
    if (!pricingGrid || !pricingData[service]) {
        console.error('Pricing grid or service data not found');
        return;
    }

    // Clear existing cards
    pricingGrid.innerHTML = '';

    const plans = pricingData[service].plans;

    // Set grid data-card-count for CSS layout
    pricingGrid.setAttribute('data-card-count', plans.length);

    // Generate cards dynamically
    plans.forEach((plan, index) => {
        const planDiv = document.createElement('div');
        planDiv.className = `price-plan-${index + 1}`;
        planDiv.id = `plan-${index + 1}`;

        if (plan.featured) {
            planDiv.classList.add('featured');
        }

        // Build card HTML
        let cardHTML = '';

        if (plan.featured) {
            cardHTML += '<div class="plan-badge">Nejoblíbenější</div>';
        }

        cardHTML += `
            <div class="plan-top">
                <h3>${plan.title}</h3>
            </div>
            <div class="plan-cost">${plan.price}</div>
            <div class="plan-info-${index + 1}">`;

        // Build feature list from JS data (single source of truth)
        if (plan.features && plan.features.length > 0) {
            cardHTML += '<ul>';
            plan.features.forEach(f => { cardHTML += `<li>${f}</li>`; });
            cardHTML += '</ul>';
        }

        cardHTML += `
                <a href="#order" class="btn primary">Objednat službu</a>
            </div>
        `;

        planDiv.innerHTML = cardHTML;
        pricingGrid.appendChild(planDiv);
    });
}
