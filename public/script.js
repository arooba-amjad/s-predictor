// Global state
let currentStep = 1;
let selectedItem = null;
let selectedSize = null;
let uploadedImage = null;

// DOM elements
const progressSteps = document.querySelectorAll('.step');
const stepContainers = document.querySelectorAll('.step-container');
const resultsSection = document.getElementById('resultsSection');
const loadingOverlay = document.getElementById('loadingOverlay');

// Step 1 elements
const itemCards = document.querySelectorAll('.item-card');
const nextToStep2Btn = document.getElementById('nextToStep2');
const uploadArea = document.getElementById('uploadArea');
const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');
const removeImageBtn = document.getElementById('removeImage');

// Step 2 elements
const selectedItemIcon = document.getElementById('selectedItemIcon');
const selectedItemName = document.getElementById('selectedItemName');
const selectedItemDesc = document.getElementById('selectedItemDesc');
const sizeChart = document.getElementById('sizeChart');
const sizeOptions = document.getElementById('sizeOptions');
const backToStep1Btn = document.getElementById('backToStep1');
const nextToStep3Btn = document.getElementById('nextToStep3');

// Step 3 elements
const selectedSizeText = document.getElementById('selectedSizeText');
const displaySelectedSize = document.getElementById('displaySelectedSize');
const measurementFields = document.getElementById('measurementFields');
const analyzeFitBtn = document.getElementById('analyzeFit');
const backToStep2Btn = document.getElementById('backToStep2');

// Results elements
const resultItemIcon = document.getElementById('resultItemIcon');
const resultItemName = document.getElementById('resultItemName');
const resultItemDesc = document.getElementById('resultItemDesc');
const resultSelectedSize = document.getElementById('resultSelectedSize');
const recommendationsGrid = document.getElementById('recommendationsGrid');
const sizeAlternatives = document.getElementById('sizeAlternatives');
const startOverBtn = document.getElementById('startOver');
const saveResultsBtn = document.getElementById('saveResults');

// Item data
const itemData = {
    'jagvi-shirt': {
        name: 'Jagvi Shirt',
        description: 'Long Sleeve Premium Shirt',
        icon: 'fas fa-tshirt',
        reference: 'For a man of 75 kgs and 1.83 cms height',
        type: 'shirt',
        sizeChart: {
            'XS': { 
                chestCircumference: 102, 
                shoulderWidth: 13.5, 
                sleeveLength: 65, 
                neckCircumference: 76, 
                armCircumference: 24,
                totalLength: 73 
            },
            'S': { 
                chestCircumference: 106, 
                shoulderWidth: 14, 
                sleeveLength: 65.5, 
                neckCircumference: 78, 
                armCircumference: 25,
                totalLength: 74 
            },
            'M': { 
                chestCircumference: 110, 
                shoulderWidth: 14.5, 
                sleeveLength: 66, 
                neckCircumference: 82, 
                armCircumference: 26,
                totalLength: 75 
            },
            'L': { 
                chestCircumference: 114, 
                shoulderWidth: 15, 
                sleeveLength: 66.5, 
                neckCircumference: 86, 
                armCircumference: 27,
                totalLength: 76 
            },
            'XL': { 
                chestCircumference: 118, 
                shoulderWidth: 15.5, 
                sleeveLength: 67, 
                neckCircumference: 90, 
                armCircumference: 28,
                totalLength: 77 
            },
            'XXL': { 
                chestCircumference: 122, 
                shoulderWidth: 16, 
                sleeveLength: 67.5, 
                neckCircumference: 94, 
                armCircumference: 29,
                totalLength: 78 
            }
        },
        // Size ranges and tolerances for better prediction
        sizeRanges: {
            'XS': {
                chestCircumference: { min: 98, max: 105, tolerance: 3.5 },
                shoulderWidth: { min: 13, max: 14, tolerance: 0.5 },
                sleeveLength: { min: 64, max: 66, tolerance: 1.0 },
                neckCircumference: { min: 73, max: 79, tolerance: 3.0 },
                armCircumference: { min: 23, max: 25, tolerance: 1.0 }
            },
            'S': {
                chestCircumference: { min: 102, max: 109, tolerance: 3.5 },
                shoulderWidth: { min: 13.5, max: 14.5, tolerance: 0.5 },
                sleeveLength: { min: 65, max: 66.5, tolerance: 1.0 },
                neckCircumference: { min: 75, max: 81, tolerance: 3.0 },
                armCircumference: { min: 24, max: 26, tolerance: 1.0 }
            },
            'M': {
                chestCircumference: { min: 106, max: 113, tolerance: 3.5 },
                shoulderWidth: { min: 14, max: 15, tolerance: 0.5 },
                sleeveLength: { min: 65.5, max: 66.5, tolerance: 1.0 },
                neckCircumference: { min: 79, max: 85, tolerance: 3.0 },
                armCircumference: { min: 25, max: 27, tolerance: 1.0 }
            },
            'L': {
                chestCircumference: { min: 110, max: 117, tolerance: 3.5 },
                shoulderWidth: { min: 14.5, max: 15.5, tolerance: 0.5 },
                sleeveLength: { min: 66, max: 67, tolerance: 1.0 },
                neckCircumference: { min: 83, max: 89, tolerance: 3.0 },
                armCircumference: { min: 26, max: 28, tolerance: 1.0 }
            },
            'XL': {
                chestCircumference: { min: 114, max: 121, tolerance: 3.5 },
                shoulderWidth: { min: 15, max: 16, tolerance: 0.5 },
                sleeveLength: { min: 66.5, max: 67.5, tolerance: 1.0 },
                neckCircumference: { min: 87, max: 93, tolerance: 3.0 },
                armCircumference: { min: 27, max: 29, tolerance: 1.0 }
            },
            'XXL': {
                chestCircumference: { min: 118, max: 125, tolerance: 3.5 },
                shoulderWidth: { min: 15.5, max: 16.5, tolerance: 0.5 },
                sleeveLength: { min: 67, max: 68, tolerance: 1.0 },
                neckCircumference: { min: 91, max: 97, tolerance: 3.0 },
                armCircumference: { min: 28, max: 30, tolerance: 1.0 }
            }
        }
    },
    'long-sleeve': {
        name: 'Long Sleeve Shirt',
        description: 'Premium Long Sleeve Shirt',
        icon: 'fas fa-tshirt',
        reference: 'Size Chart (cm)',
        type: 'shirt',
        sizeChart: {
            'XS': { 
                length: 69, 
                chestCircumference: 100, 
                shoulderWidth: 44, 
                neckWidth: 14, 
                sleeveLength: 22, 
                sleeveOpeningCircumference: 32, 
                armHoleCircumference: 47, 
                varianceDeltoidVsBicept: 14 
            },
            'S': { 
                length: 71, 
                chestCircumference: 102, 
                shoulderWidth: 45, 
                neckWidth: 15, 
                sleeveLength: 23, 
                sleeveOpeningCircumference: 33, 
                armHoleCircumference: 48, 
                varianceDeltoidVsBicept: 15 
            },
            'M': { 
                length: 73, 
                chestCircumference: 106, 
                shoulderWidth: 46, 
                neckWidth: 16, 
                sleeveLength: 23, 
                sleeveOpeningCircumference: 35, 
                armHoleCircumference: 50, 
                varianceDeltoidVsBicept: 15 
            },
            'L': { 
                length: 75, 
                chestCircumference: 110, 
                shoulderWidth: 49, 
                neckWidth: 17, 
                sleeveLength: 24, 
                sleeveOpeningCircumference: 36, 
                armHoleCircumference: 52, 
                varianceDeltoidVsBicept: 16 
            },
            'XL': { 
                length: 77, 
                chestCircumference: 116, 
                shoulderWidth: 51, 
                neckWidth: 18, 
                sleeveLength: 25, 
                sleeveOpeningCircumference: 37, 
                armHoleCircumference: 54, 
                varianceDeltoidVsBicept: 17 
            },
            'XXL': { 
                length: 79, 
                chestCircumference: 118, 
                shoulderWidth: 52, 
                neckWidth: 18, 
                sleeveLength: 26, 
                sleeveOpeningCircumference: 40, 
                armHoleCircumference: 56, 
                varianceDeltoidVsBicept: 16 
            }
        }
    },
    'short-sleeves': {
        name: 'Short Sleeve Shirt',
        description: 'Casual Comfortable Shirt',
        icon: 'fas fa-tshirt',
        reference: 'For a man of 75 kgs and 1.83 cms height',
        type: 'shirt',
        sizeChart: {
            'XS': { 
                length: 69, 
                chestCircumference: 100, 
                shoulderWidth: 44, 
                neckWidth: 14, 
                sleeveLength: 22, 
                sleeveOpeningCircumference: 32, 
                armHoleCircumference: 47, 
                varianceDeltoidVsBicept: 14 
            },
            'S': { 
                length: 71, 
                chestCircumference: 102, 
                shoulderWidth: 45, 
                neckWidth: 15, 
                sleeveLength: 23, 
                sleeveOpeningCircumference: 33, 
                armHoleCircumference: 48, 
                varianceDeltoidVsBicept: 15 
            },
            'M': { 
                length: 73, 
                chestCircumference: 106, 
                shoulderWidth: 46, 
                neckWidth: 16, 
                sleeveLength: 23, 
                sleeveOpeningCircumference: 35, 
                armHoleCircumference: 50, 
                varianceDeltoidVsBicept: 15 
            },
            'L': { 
                length: 75, 
                chestCircumference: 110, 
                shoulderWidth: 49, 
                neckWidth: 17, 
                sleeveLength: 24, 
                sleeveOpeningCircumference: 36, 
                armHoleCircumference: 52, 
                varianceDeltoidVsBicept: 16 
            },
            'XL': { 
                length: 77, 
                chestCircumference: 116, 
                shoulderWidth: 51, 
                neckWidth: 18, 
                sleeveLength: 25, 
                sleeveOpeningCircumference: 37, 
                armHoleCircumference: 54, 
                varianceDeltoidVsBicept: 17 
            },
            'XXL': { 
                length: 79, 
                chestCircumference: 118, 
                shoulderWidth: 52, 
                neckWidth: 18, 
                sleeveLength: 26, 
                sleeveOpeningCircumference: 40, 
                armHoleCircumference: 56, 
                varianceDeltoidVsBicept: 16 
            }
        }
    },
    't-shirt': {
        name: 'T-Shirt',
        description: 'Premium Cotton T-Shirt',
        icon: 'fas fa-tshirt',
        reference: 'Size Chart (cm)',
        type: 'shirt',
        sizeChart: {
            'XS': { 
                length: 69, 
                chestCircumference: 100, 
                shoulderWidth: 44, 
                neckWidth: 14, 
                sleeveLength: 22, 
                sleeveOpeningCircumference: 32, 
                armHoleCircumference: 47, 
                varianceDeltoidVsBicept: 14 
            },
            'S': { 
                length: 71, 
                chestCircumference: 102, 
                shoulderWidth: 45, 
                neckWidth: 15, 
                sleeveLength: 23, 
                sleeveOpeningCircumference: 33, 
                armHoleCircumference: 48, 
                varianceDeltoidVsBicept: 15 
            },
            'M': { 
                length: 73, 
                chestCircumference: 106, 
                shoulderWidth: 46, 
                neckWidth: 16, 
                sleeveLength: 23, 
                sleeveOpeningCircumference: 35, 
                armHoleCircumference: 50, 
                varianceDeltoidVsBicept: 15 
            },
            'L': { 
                length: 75, 
                chestCircumference: 110, 
                shoulderWidth: 49, 
                neckWidth: 17, 
                sleeveLength: 24, 
                sleeveOpeningCircumference: 36, 
                armHoleCircumference: 52, 
                varianceDeltoidVsBicept: 16 
            },
            'XL': { 
                length: 77, 
                chestCircumference: 116, 
                shoulderWidth: 51, 
                neckWidth: 18, 
                sleeveLength: 25, 
                sleeveOpeningCircumference: 37, 
                armHoleCircumference: 54, 
                varianceDeltoidVsBicept: 17 
            },
            'XXL': { 
                length: 79, 
                chestCircumference: 118, 
                shoulderWidth: 52, 
                neckWidth: 18, 
                sleeveLength: 26, 
                sleeveOpeningCircumference: 40, 
                armHoleCircumference: 56, 
                varianceDeltoidVsBicept: 16 
            }
        }
    },
    'hooded-jacket': {
        name: 'Hooded Jacket',
        description: 'Premium Hooded Jacket',
        icon: 'fas fa-user-tie',
        reference: 'Size Chart (cm)',
        type: 'jacket',
        sizeChart: {
            'XS': { 
                length: 70, 
                chestCircumference: 104, 
                shoulderWidth: 42, 
                neckWidth: 16, 
                sleeveLength: 24, 
                sleeveOpeningCircumference: 34, 
                armHoleCircumference: 49, 
                varianceDeltoidVsBicept: 15 
            },
            'S': { 
                length: 72, 
                chestCircumference: 108, 
                shoulderWidth: 44, 
                neckWidth: 17, 
                sleeveLength: 25, 
                sleeveOpeningCircumference: 36, 
                armHoleCircumference: 51, 
                varianceDeltoidVsBicept: 16 
            },
            'M': { 
                length: 74, 
                chestCircumference: 112, 
                shoulderWidth: 46, 
                neckWidth: 18, 
                sleeveLength: 26, 
                sleeveOpeningCircumference: 38, 
                armHoleCircumference: 53, 
                varianceDeltoidVsBicept: 17 
            },
            'L': { 
                length: 76, 
                chestCircumference: 116, 
                shoulderWidth: 48, 
                neckWidth: 19, 
                sleeveLength: 27, 
                sleeveOpeningCircumference: 40, 
                armHoleCircumference: 55, 
                varianceDeltoidVsBicept: 18 
            },
            'XL': { 
                length: 78, 
                chestCircumference: 120, 
                shoulderWidth: 50, 
                neckWidth: 20, 
                sleeveLength: 28, 
                sleeveOpeningCircumference: 42, 
                armHoleCircumference: 57, 
                varianceDeltoidVsBicept: 19 
            },
            'XXL': { 
                length: 80, 
                chestCircumference: 124, 
                shoulderWidth: 52, 
                neckWidth: 21, 
                sleeveLength: 29, 
                sleeveOpeningCircumference: 44, 
                armHoleCircumference: 59, 
                varianceDeltoidVsBicept: 20 
            }
        }
    },
    'sweat-shirt': {
        name: 'Sweat Shirt',
        description: 'Premium Sweat Shirt',
        icon: 'fas fa-tshirt',
        reference: 'Size Chart (cm)',
        type: 'shirt',
        sizeChart: {
            'XS': { 
                length: 68, 
                chestCircumference: 98, 
                shoulderWidth: 43, 
                neckWidth: 13, 
                sleeveLength: 21, 
                sleeveOpeningCircumference: 31, 
                armHoleCircumference: 46, 
                varianceDeltoidVsBicept: 13 
            },
            'S': { 
                length: 70, 
                chestCircumference: 100, 
                shoulderWidth: 44, 
                neckWidth: 14, 
                sleeveLength: 22, 
                sleeveOpeningCircumference: 32, 
                armHoleCircumference: 47, 
                varianceDeltoidVsBicept: 14 
            },
            'M': { 
                length: 72, 
                chestCircumference: 104, 
                shoulderWidth: 45, 
                neckWidth: 15, 
                sleeveLength: 22, 
                sleeveOpeningCircumference: 34, 
                armHoleCircumference: 49, 
                varianceDeltoidVsBicept: 14 
            },
            'L': { 
                length: 74, 
                chestCircumference: 108, 
                shoulderWidth: 48, 
                neckWidth: 16, 
                sleeveLength: 23, 
                sleeveOpeningCircumference: 35, 
                armHoleCircumference: 51, 
                varianceDeltoidVsBicept: 15 
            },
            'XL': { 
                length: 76, 
                chestCircumference: 114, 
                shoulderWidth: 50, 
                neckWidth: 17, 
                sleeveLength: 24, 
                sleeveOpeningCircumference: 36, 
                armHoleCircumference: 53, 
                varianceDeltoidVsBicept: 16 
            },
            'XXL': { 
                length: 78, 
                chestCircumference: 116, 
                shoulderWidth: 51, 
                neckWidth: 17, 
                sleeveLength: 25, 
                sleeveOpeningCircumference: 39, 
                armHoleCircumference: 55, 
                varianceDeltoidVsBicept: 15 
            }
        }
    },
    'polar-overshirt': {
        name: 'Polar Overshirt',
        description: 'Layering Piece',
        icon: 'fas fa-user-tie',
        reference: 'SUMMER 2025 Collection',
        type: 'jacket',
        sizeChart: {
            'XS': { 
                chestCircumference: 108, 
                shoulderWidth: 14, 
                sleeveLength: 65, 
                neckCircumference: 34, 
                armCircumference: 27,
                totalLength: 71 
            },
            'S': { 
                chestCircumference: 112, 
                shoulderWidth: 14.5, 
                sleeveLength: 65.5, 
                neckCircumference: 36, 
                armCircumference: 28,
                totalLength: 72 
            },
            'M': { 
                chestCircumference: 116, 
                shoulderWidth: 15, 
                sleeveLength: 66, 
                neckCircumference: 38, 
                armCircumference: 29,
                totalLength: 73 
            },
            'L': { 
                chestCircumference: 120, 
                shoulderWidth: 15.5, 
                sleeveLength: 66.5, 
                neckCircumference: 40, 
                armCircumference: 30,
                totalLength: 74 
            },
            'XL': { 
                chestCircumference: 124, 
                shoulderWidth: 16, 
                sleeveLength: 67, 
                neckCircumference: 42, 
                armCircumference: 31,
                totalLength: 75 
            },
            'XXL': { 
                chestCircumference: 128, 
                shoulderWidth: 16.5, 
                sleeveLength: 67.5, 
                neckCircumference: 44, 
                armCircumference: 32,
                totalLength: 76 
            }
        }
    },
    'pants': {
        name: 'Pants',
        description: 'JAGVI.Rive Gauche SS2025',
        icon: 'fas fa-socks',
        reference: 'Accurate Size Chart (cm)',
        type: 'pants',
        sizeChart: {
            'XS': { waist: 74, thigh: 58, bottom: 31, hip: 100 },
            'S': { waist: 78, thigh: 60, bottom: 32, hip: 102 },
            'M': { waist: 82, thigh: 62, bottom: 33, hip: 104 },
            'L': { waist: 86, thigh: 64, bottom: 34, hip: 108 },
            'XL': { waist: 90, thigh: 66, bottom: 35, hip: 116 },
            'XXL': { waist: 94, thigh: 68, bottom: 36, hip: 118 }
        }
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateProgressSteps();
});

// Event listeners
function initializeEventListeners() {
    // Step 1: Item selection
    itemCards.forEach(card => {
        card.addEventListener('click', () => selectItem(card));
    });

    // Image upload
    uploadArea.addEventListener('click', () => imageUpload.click());
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('drop', handleDrop);
    imageUpload.addEventListener('change', handleImageUpload);
    removeImageBtn.addEventListener('click', removeImage);

    // Navigation buttons
    nextToStep2Btn.addEventListener('click', goToStep2);
    backToStep1Btn.addEventListener('click', goToStep1);
    nextToStep3Btn.addEventListener('click', goToStep3);
    backToStep2Btn.addEventListener('click', goToStep2);
    analyzeFitBtn.addEventListener('click', analyzeFit);
    startOverBtn.addEventListener('click', startOver);
    saveResultsBtn.addEventListener('click', saveResults);
}

// Step 1: Item Selection
function selectItem(card) {
    // Remove previous selection
    itemCards.forEach(c => c.classList.remove('selected'));
    
    // Add selection to clicked card
    card.classList.add('selected');
    
    // Store selected item
    selectedItem = card.dataset.item;
    
    // Enable next button
    nextToStep2Btn.disabled = false;
    
    // Initialize analyze button state
    updateAnalyzeButtonState();
}

// Image upload handling
function handleDragOver(e) {
    e.preventDefault();
    uploadArea.style.borderColor = '#667eea';
    uploadArea.style.background = '#f7fafc';
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.style.borderColor = '#cbd5e0';
    uploadArea.style.background = 'white';
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        showError('Please select an image file');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        uploadedImage = e.target.result;
        previewImg.src = uploadedImage;
        imagePreview.classList.remove('hidden');
        uploadArea.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

function removeImage() {
    uploadedImage = null;
    imagePreview.classList.add('hidden');
    uploadArea.style.display = 'block';
    imageUpload.value = '';
}

// Navigation functions
function goToStep2() {
    if (!selectedItem) return;
    
    currentStep = 2;
    updateProgressSteps();
    showStep(2);
    populateSizeChart();
}

function goToStep1() {
    currentStep = 1;
    updateProgressSteps();
    showStep(1);
}

function goToStep3() {
    if (!selectedSize) return;
    
    currentStep = 3;
    updateProgressSteps();
    showStep(3);
    populateMeasurementFields();
    updateSelectedSizeDisplay();
    
    // Initialize analyze button state after populating measurement fields
    setTimeout(() => updateAnalyzeButtonState(), 100);
}

// Progress steps
function updateProgressSteps() {
    progressSteps.forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNumber === currentStep) {
            step.classList.add('active');
        } else if (stepNumber < currentStep) {
            step.classList.add('completed');
        }
    });
}

function showStep(stepNumber) {
    stepContainers.forEach(container => {
        container.classList.remove('active');
    });
    
    const targetStep = document.getElementById(`step${stepNumber}`);
    if (targetStep) {
        targetStep.classList.add('active');
    }
    
    // Hide results section
    resultsSection.classList.add('hidden');
}

// Step 2: Size Chart
function populateSizeChart() {
    if (!selectedItem || !itemData[selectedItem]) return;
    
    const item = itemData[selectedItem];
    
    // Update selected item display
    selectedItemIcon.className = item.icon;
    selectedItemName.textContent = item.name;
    selectedItemDesc.textContent = item.description;
    
    // Create size chart table
    const chart = item.sizeChart;
    const sizes = Object.keys(chart);
    
    let tableHTML = '<table><thead><tr><th>Size</th>';
    
    // Add headers based on item type
    if (item.type === 'pants') {
        tableHTML += '<th>Waist (cm)</th><th>Thigh (cm)</th><th>Bottom (cm)</th><th>Hip (cm)</th>';
    } else if (selectedItem === 't-shirt' || selectedItem === 'long-sleeve' || selectedItem === 'hooded-jacket' || selectedItem === 'sweat-shirt') {
            tableHTML += '<th>Length (cm)</th><th>Chest (Cir) (cm)</th><th>Shoulder (cm)</th><th>Neck Width (cm)</th><th>Sleeve Length (cm)</th><th>Sleeve Opening (Cir) (cm)</th><th>Arm Hole (Cir) (cm)</th><th>Variance Deltoid Vs Bicept (cm)</th>';
                } else {
                    tableHTML += '<th>Chest Circumference (cm)</th><th>Shoulder Width (cm)</th><th>Sleeve Length (cm)</th><th>Neck Circumference (cm)</th><th>Arm Circumference (cm)</th><th>Total Length (cm)</th>';
                }
    
    tableHTML += '</tr></thead><tbody>';
    
    sizes.forEach(size => {
        const measurements = chart[size];
        tableHTML += `<tr><td><strong>${size}</strong></td>`;
        
        if (item.type === 'pants') {
            tableHTML += `<td>${measurements.waist}</td><td>${measurements.thigh}</td><td>${measurements.bottom}</td><td>${measurements.hip}</td>`;
        } else if (selectedItem === 't-shirt' || selectedItem === 'long-sleeve' || selectedItem === 'hooded-jacket' || selectedItem === 'sweat-shirt') {
            tableHTML += `<td>${measurements.length}</td><td>${measurements.chestCircumference}</td><td>${measurements.shoulderWidth}</td><td>${measurements.neckWidth}</td><td>${measurements.sleeveLength}</td><td>${measurements.sleeveOpeningCircumference}</td><td>${measurements.armHoleCircumference}</td><td>${measurements.varianceDeltoidVsBicept}</td>`;
                } else {
                    tableHTML += `<td>${measurements.chestCircumference}</td><td>${measurements.shoulderWidth}</td><td>${measurements.sleeveLength}</td><td>${measurements.neckCircumference}</td><td>${measurements.armCircumference}</td><td>${measurements.totalLength}</td>`;
                }
        
        tableHTML += '</tr>';
    });
    
    tableHTML += '</tbody></table>';
    sizeChart.innerHTML = tableHTML;
    
    // Create size options
    let optionsHTML = '';
    sizes.forEach(size => {
        optionsHTML += `<div class="size-option" data-size="${size}">${size}</div>`;
    });
    sizeOptions.innerHTML = optionsHTML;
    
    // Add click listeners to size options
    const sizeOptionElements = document.querySelectorAll('.size-option');
    sizeOptionElements.forEach(option => {
        option.addEventListener('click', () => selectSize(option));
    });
}

function selectSize(option) {
    // Remove previous selection
    document.querySelectorAll('.size-option').forEach(o => o.classList.remove('selected'));
    
    // Add selection to clicked option
    option.classList.add('selected');
    
    // Store selected size
    selectedSize = option.dataset.size;
    
    // Enable next button
    nextToStep3Btn.disabled = false;
}

// Step 3: Measurements
function populateMeasurementFields() {
    if (!selectedItem || !itemData[selectedItem]) return;
    
    const item = itemData[selectedItem];
    let fieldsHTML = '';
    
    // Update the measurement note based on item type
    const measurementNote = document.getElementById('measurementNote');
    if (measurementNote) {
        if (selectedItem === 'jagvi-shirt' || selectedItem === 'short-sleeves' || selectedItem === 't-shirt' || selectedItem === 'long-sleeve' || selectedItem === 'hooded-jacket' || selectedItem === 'sweat-shirt' || selectedItem === 'polar-overshirt' || selectedItem === 'pants') {
            measurementNote.textContent = 'All measurements are required for accurate size prediction';
        } else {
            measurementNote.textContent = 'Provide measurements for more accurate fit analysis (optional but recommended)';
        }
    }
    
    if (item.type === 'pants') {
        fieldsHTML = `
            <div class="form-row">
                <div class="form-group full-width">
                    <p class="required-note">* All measurements are required for accurate pants size prediction</p>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="pantsWaist">Waist (cm) *</label>
                    <input type="number" id="pantsWaist" name="pantsWaist" min="60" max="120" step="0.1" placeholder="e.g., 82" required>
                </div>
                <div class="form-group">
                    <label for="pantsThigh">Thigh (cm) *</label>
                    <input type="number" id="pantsThigh" name="pantsThigh" min="50" max="80" step="0.1" placeholder="e.g., 62.2" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="pantsBottom">Bottom (cm) *</label>
                    <input type="number" id="pantsBottom" name="pantsBottom" min="20" max="50" step="0.1" placeholder="e.g., 33" required>
                </div>
                <div class="form-group">
                    <label for="pantsHip">Hip (cm) *</label>
                    <input type="number" id="pantsHip" name="pantsHip" min="90" max="130" step="0.1" placeholder="e.g., 104" required>
                </div>
            </div>
        `;
    } else {
        // Different measurement fields for jagvi-shirt vs short-sleeves
        if (selectedItem === 'jagvi-shirt') {
        fieldsHTML = `
                <div class="form-row">
                    <div class="form-group full-width">
                        <p class="required-note">* All measurements are required for accurate size prediction</p>
                    </div>
                </div>
            <div class="form-row">
                <div class="form-group">
                        <label for="chestCircumference">Chest Circumference (cm) *</label>
                        <input type="number" id="chestCircumference" name="chestCircumference" min="80" max="140" step="0.5" placeholder="e.g., 110" required>
                </div>
                <div class="form-group">
                        <label for="shoulderWidth">Shoulder Width (cm) *</label>
                        <input type="number" id="shoulderWidth" name="shoulderWidth" min="10" max="25" step="0.25" placeholder="e.g., 14.5" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                        <label for="sleeveLength">Sleeve Length (cm) *</label>
                        <input type="number" id="sleeveLength" name="sleeveLength" min="60" max="75" step="0.5" placeholder="e.g., 66" required>
                </div>
                <div class="form-group">
                        <label for="neckCircumference">Neck Circumference (cm) *</label>
                        <input type="number" id="neckCircumference" name="neckCircumference" min="70" max="100" step="0.5" placeholder="e.g., 82" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                        <label for="armCircumference">Arm Circumference (cm) *</label>
                        <input type="number" id="armCircumference" name="armCircumference" min="20" max="35" step="0.5" placeholder="e.g., 26" required>
                    </div>
                    <div class="form-group">
                        <label for="totalLength">Total Length (cm) *</label>
                        <input type="number" id="totalLength" name="totalLength" min="60" max="90" step="0.5" placeholder="e.g., 75" required>
                    </div>
                </div>
            `;
        } else if (selectedItem === 't-shirt' || selectedItem === 'long-sleeve' || selectedItem === 'hooded-jacket' || selectedItem === 'sweat-shirt') {
            fieldsHTML = `
                <div class="form-row">
                    <div class="form-group full-width">
                        <p class="required-note">* All measurements are required for accurate size prediction</p>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="length">Length (cm) *</label>
                        <input type="number" id="length" name="length" min="65" max="85" step="0.5" placeholder="e.g., 73" required>
                    </div>
                    <div class="form-group">
                        <label for="chestCircumference">Chest (Cir) (cm) *</label>
                        <input type="number" id="chestCircumference" name="chestCircumference" min="95" max="125" step="0.5" placeholder="e.g., 106" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="shoulderWidth">Shoulder (cm) *</label>
                        <input type="number" id="shoulderWidth" name="shoulderWidth" min="40" max="60" step="0.5" placeholder="e.g., 46" required>
                    </div>
                    <div class="form-group">
                        <label for="neckWidth">Neck Width (cm) *</label>
                        <input type="number" id="neckWidth" name="neckWidth" min="12" max="22" step="0.5" placeholder="e.g., 16" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="sleeveLength">Sleeve Length (cm) *</label>
                        <input type="number" id="sleeveLength" name="sleeveLength" min="20" max="30" step="0.5" placeholder="e.g., 23" required>
                    </div>
                    <div class="form-group">
                        <label for="sleeveOpeningCircumference">Sleeve Opening (Cir) (cm) *</label>
                        <input type="number" id="sleeveOpeningCircumference" name="sleeveOpeningCircumference" min="30" max="45" step="0.5" placeholder="e.g., 35" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="armHoleCircumference">Arm Hole (Cir) (cm) *</label>
                        <input type="number" id="armHoleCircumference" name="armHoleCircumference" min="45" max="60" step="0.5" placeholder="e.g., 50" required>
                    </div>
                    <div class="form-group">
                        <label for="varianceDeltoidVsBicept">Variance Deltoid Vs Bicept (cm) *</label>
                        <input type="number" id="varianceDeltoidVsBicept" name="varianceDeltoidVsBicept" min="10" max="25" step="0.5" placeholder="e.g., 15" required>
                    </div>
                </div>
            `;
        } else if (selectedItem === 'short-sleeves') {
            fieldsHTML = `
                <div class="form-row">
                    <div class="form-group full-width">
                        <p class="required-note">* All measurements are required for accurate size prediction</p>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="chestCircumference">Chest Circumference (cm) *</label>
                        <input type="number" id="chestCircumference" name="chestCircumference" min="80" max="140" step="0.5" placeholder="e.g., 110" required>
                    </div>
                    <div class="form-group">
                        <label for="shoulderWidth">Shoulder Width (cm) *</label>
                        <input type="number" id="shoulderWidth" name="shoulderWidth" min="10" max="25" step="0.25" placeholder="e.g., 14.5" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="sleeveLength">Sleeve Length (cm) *</label>
                        <input type="number" id="sleeveLength" name="sleeveLength" min="20" max="30" step="0.5" placeholder="e.g., 25" required>
                    </div>
                    <div class="form-group">
                        <label for="neckCircumference">Neck Circumference (cm) *</label>
                        <input type="number" id="neckCircumference" name="neckCircumference" min="35" max="45" step="0.5" placeholder="e.g., 39" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="armCircumference">Arm Circumference (cm) *</label>
                        <input type="number" id="armCircumference" name="armCircumference" min="20" max="35" step="0.5" placeholder="e.g., 26" required>
                    </div>
                    <div class="form-group">
                        <label for="totalLength">Total Length (cm) *</label>
                        <input type="number" id="totalLength" name="totalLength" min="60" max="90" step="0.5" placeholder="e.g., 75" required>
                    </div>
                </div>
            `;
        } else if (selectedItem === 'polar-overshirt') {
            fieldsHTML = `
                <div class="form-row">
                    <div class="form-group full-width">
                        <p class="required-note">* All measurements are required for accurate size prediction</p>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="chestCircumference">Chest Circumference (cm) *</label>
                        <input type="number" id="chestCircumference" name="chestCircumference" min="100" max="135" step="0.5" placeholder="e.g., 116" required>
                    </div>
                    <div class="form-group">
                        <label for="shoulderWidth">Shoulder Width (cm) *</label>
                        <input type="number" id="shoulderWidth" name="shoulderWidth" min="13" max="18" step="0.25" placeholder="e.g., 15" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="sleeveLength">Sleeve Length (cm) *</label>
                        <input type="number" id="sleeveLength" name="sleeveLength" min="64" max="68" step="0.5" placeholder="e.g., 66" required>
                    </div>
                    <div class="form-group">
                        <label for="neckCircumference">Neck Circumference (cm) *</label>
                        <input type="number" id="neckCircumference" name="neckCircumference" min="33" max="45" step="0.5" placeholder="e.g., 38" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="armCircumference">Arm Circumference (cm) *</label>
                        <input type="number" id="armCircumference" name="armCircumference" min="26" max="33" step="0.5" placeholder="e.g., 29" required>
                    </div>
                    <div class="form-group">
                        <label for="totalLength">Total Length (cm) *</label>
                        <input type="number" id="totalLength" name="totalLength" min="70" max="77" step="0.5" placeholder="e.g., 73" required>
                    </div>
                </div>
            `;
        } else {
            // Default shirt measurements for other shirt types
            fieldsHTML = `
                <div class="form-row">
                    <div class="form-group full-width">
                        <p class="required-note">* All measurements are required for accurate size prediction</p>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="chestCircumference">Chest Circumference (cm) *</label>
                        <input type="number" id="chestCircumference" name="chestCircumference" min="80" max="140" step="0.5" placeholder="e.g., 110" required>
                    </div>
                    <div class="form-group">
                        <label for="shoulderWidth">Shoulder Width (cm) *</label>
                        <input type="number" id="shoulderWidth" name="shoulderWidth" min="10" max="25" step="0.25" placeholder="e.g., 14.5" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="sleeveLength">Sleeve Length (cm) *</label>
                        <input type="number" id="sleeveLength" name="sleeveLength" min="60" max="75" step="0.5" placeholder="e.g., 66" required>
                    </div>
                    <div class="form-group">
                        <label for="neckCircumference">Neck Circumference (cm) *</label>
                        <input type="number" id="neckCircumference" name="neckCircumference" min="70" max="100" step="0.5" placeholder="e.g., 82" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="armCircumference">Arm Circumference (cm) *</label>
                        <input type="number" id="armCircumference" name="armCircumference" min="20" max="35" step="0.5" placeholder="e.g., 26" required>
                    </div>
                    <div class="form-group">
                        <label for="totalLength">Total Length (cm) *</label>
                        <input type="number" id="totalLength" name="totalLength" min="60" max="90" step="0.5" placeholder="e.g., 75" required>
                </div>
            </div>
        `;
        }
    }
    
    measurementFields.innerHTML = fieldsHTML;
    
    // Add validation event listeners for required measurements
    if (selectedItem === 'jagvi-shirt') {
        const requiredFields = ['chestCircumference', 'shoulderWidth', 'sleeveLength', 'neckCircumference', 'armCircumference', 'totalLength'];
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', validateMeasurementField);
                field.addEventListener('blur', validateMeasurementField);
            }
        });
            } else if (selectedItem === 't-shirt' || selectedItem === 'long-sleeve' || selectedItem === 'hooded-jacket' || selectedItem === 'sweat-shirt') {
            const requiredFields = ['length', 'chestCircumference', 'shoulderWidth', 'neckWidth', 'sleeveLength', 'sleeveOpeningCircumference', 'armHoleCircumference', 'varianceDeltoidVsBicept'];
            requiredFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.addEventListener('input', validateMeasurementField);
                    field.addEventListener('blur', validateMeasurementField);
                }
            });
        } else if (selectedItem === 'short-sleeves') {
        const requiredFields = ['chestCircumference', 'shoulderWidth', 'sleeveLength', 'neckCircumference', 'armCircumference', 'totalLength'];
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', validateMeasurementField);
                field.addEventListener('blur', validateMeasurementField);
            }
        });
    } else if (selectedItem === 'polar-overshirt') {
        const requiredFields = ['chestCircumference', 'shoulderWidth', 'sleeveLength', 'neckCircumference', 'armCircumference', 'totalLength'];
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', validateMeasurementField);
                field.addEventListener('blur', validateMeasurementField);
            }
        });
    } else if (selectedItem === 'pants') {
        const requiredFields = ['pantsWaist', 'pantsThigh', 'pantsBottom', 'pantsHip'];
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', validateMeasurementField);
                field.addEventListener('blur', validateMeasurementField);
            }
        });
    }
}

function updateSelectedSizeDisplay() {
    selectedSizeText.textContent = selectedSize;
    displaySelectedSize.textContent = selectedSize;
}

// Fit Analysis
function analyzeFit() {
    try {
        // Validate form data first
        const formData = collectFormData();
        
    // Show loading
    loadingOverlay.classList.remove('hidden');
    
        if (selectedItem === 'jagvi-shirt' || selectedItem === 'short-sleeves' || selectedItem === 't-shirt' || selectedItem === 'long-sleeve' || selectedItem === 'hooded-jacket' || selectedItem === 'sweat-shirt' || selectedItem === 'polar-overshirt' || selectedItem === 'pants') {
            // For Jagvi shirts, short sleeve shirts, T-shirts, long sleeve shirts, hooded jackets, sweat shirts, polar overshirt, and pants, call the backend API to get optimal size prediction
            fetch('/api/predict-size', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    garmentType: selectedItem
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Backend response:', data); // Debug log
                if (data.error) {
                    throw new Error(data.error);
                }
                
                // Store the predicted optimal size for use in alternative size recommendations
                window.predictedOptimalSize = data.predictedSize.size;
                console.log('Predicted optimal size:', window.predictedOptimalSize); // Debug log
                
                // Perform frontend analysis with the predicted size
                const analysis = performFitAnalysis(formData);
                displayResults(analysis);
                loadingOverlay.classList.add('hidden');
            })
            .catch(error => {
                loadingOverlay.classList.add('hidden');
                showError(error.message || 'Failed to analyze fit. Please try again.');
            });
        } else {
            // For other items, use frontend analysis only
    setTimeout(() => {
        const analysis = performFitAnalysis(formData);
        displayResults(analysis);
        loadingOverlay.classList.add('hidden');
    }, 2000);
        }
    } catch (error) {
        // Hide loading if there's an error
        loadingOverlay.classList.add('hidden');
        // Show error message
        showError(error.message);
    }
}

function isFormValid() {
    if (selectedItem === 'jagvi-shirt') {
        const requiredFields = ['chestCircumference', 'shoulderWidth', 'sleeveLength', 'neckCircumference', 'armCircumference', 'totalLength'];
        return requiredFields.every(field => {
            const value = document.getElementById(field)?.value;
            return value && value.trim() !== '' && !isNaN(parseFloat(value));
        });
            } else if (selectedItem === 't-shirt' || selectedItem === 'long-sleeve' || selectedItem === 'hooded-jacket' || selectedItem === 'sweat-shirt') {
            const requiredFields = ['length', 'chestCircumference', 'shoulderWidth', 'neckWidth', 'sleeveLength', 'sleeveOpeningCircumference', 'armHoleCircumference', 'varianceDeltoidVsBicept'];
            return requiredFields.every(field => {
                const value = document.getElementById(field)?.value;
                return value && value.trim() !== '' && !isNaN(parseFloat(value));
            });
        } else if (selectedItem === 'short-sleeves') {
        const requiredFields = ['chestCircumference', 'shoulderWidth', 'sleeveLength', 'neckCircumference', 'armCircumference', 'totalLength'];
        return requiredFields.every(field => {
            const value = document.getElementById(field)?.value;
            return value && value.trim() !== '' && !isNaN(parseFloat(value));
        });
    } else if (selectedItem === 'polar-overshirt') {
        const requiredFields = ['chestCircumference', 'shoulderWidth', 'sleeveLength', 'neckCircumference', 'armCircumference', 'totalLength'];
        return requiredFields.every(field => {
            const value = document.getElementById(field)?.value;
            return value && value.trim() !== '' && !isNaN(parseFloat(value));
        });
    } else if (selectedItem === 'pants') {
        const requiredFields = ['pantsWaist', 'pantsThigh', 'pantsBottom', 'pantsHip'];
        return requiredFields.every(field => {
            const value = document.getElementById(field)?.value;
            return value && value.trim() !== '' && !isNaN(parseFloat(value));
        });
    }
    return true; // For other items, assume valid
}

function validateMeasurementField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing validation styling
    field.classList.remove('error', 'valid');
    
    if (!value) {
        field.classList.add('error');
        showFieldError(field, 'This field is required');
    } else if (isNaN(parseFloat(value))) {
        field.classList.add('error');
        showFieldError(field, 'Please enter a valid number');
    } else {
        const numValue = parseFloat(value);
        const min = parseFloat(field.min);
        const max = parseFloat(field.max);
        
        if (numValue < min || numValue > max) {
            field.classList.add('error');
            showFieldError(field, `Value must be between ${min} and ${max}`);
        } else {
            field.classList.add('valid');
            hideFieldError(field);
        }
    }
    
    // Update analyze button state
    updateAnalyzeButtonState();
}

function showFieldError(field, message) {
    // Remove existing error message
    hideFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.id = `${field.id}-error`;
    
    field.parentNode.appendChild(errorDiv);
}

function hideFieldError(field) {
    const existingError = document.getElementById(`${field.id}-error`);
    if (existingError) {
        existingError.remove();
    }
}

function updateAnalyzeButtonState() {
    const analyzeBtn = document.querySelector('.analyze-btn');
    if (analyzeBtn) {
        if (isFormValid()) {
            analyzeBtn.disabled = false;
            analyzeBtn.classList.remove('disabled');
        } else {
            analyzeBtn.disabled = true;
            analyzeBtn.classList.add('disabled');
        }
    }
}

function collectFormData() {
    const formData = {
        // Basic info removed; provide neutral defaults for backend
        gender: 'male',
        age: 30,
        height: 175,
        weight: 70,
        bodyType: 'average',
        measurements: {}
    };
    
    // Collect measurements based on item type
    const item = itemData[selectedItem];
    if (item.type === 'pants') {
        formData.measurements.waist = parseFloat(document.getElementById('pantsWaist')?.value) || null;
        formData.measurements.thigh = parseFloat(document.getElementById('pantsThigh')?.value) || null;
        formData.measurements.bottom = parseFloat(document.getElementById('pantsBottom')?.value) || null;
        formData.measurements.hip = parseFloat(document.getElementById('pantsHip')?.value) || null;
        
        const requiredMeasurements = ['waist', 'thigh', 'bottom', 'hip'];
        const missingMeasurements = requiredMeasurements.filter(measurement => 
            !formData.measurements[measurement] || isNaN(formData.measurements[measurement])
        );
        if (missingMeasurements.length > 0) {
            throw new Error(`Please fill in all required pants measurements: ${missingMeasurements.join(', ')}`);
        }
    } else {
        // shirt/jacket measurement collection remains unchanged below
        // ... existing code ...
    }
    
    return formData;
}

function adjustMeasurementForBodyType(measurement, bodyType, measurementType) {
    // Adjust measurements based on body type
    let adjustment = 1;
    
    switch (bodyType) {
        case 'athletic':
            if (measurementType === 'chest' || measurementType === 'shoulder') {
                adjustment = 1.1; // Allow 10% more room for athletic builds in chest/shoulders
            }
            break;
        case 'plus':
            adjustment = 1.15; // Allow 15% more room overall for plus size
            break;
        case 'slim':
            adjustment = 0.95; // Reduce tolerance by 5% for slim builds
            break;
    }
    
    return measurement * adjustment;
}

function performFitAnalysis(formData) {
    const item = itemData[selectedItem];
    const selectedSizeData = item.sizeChart[selectedSize];
    const measurements = formData.measurements;
    
    // Calculate fit scores for each measurement
    const fitScores = {};
    const weights = {
        chest: 0.25,
        shoulder: 0.25,
        sleeve: 0.2,
        neck: 0.15,
        arm: 0.1,
        length: 0.05,
        waist: 0.35,
        thigh: 0.30,
        bottom: 0.20,
        pantsLength: 0.15
    };
    
    let weightedScore = 0;
    let totalWeight = 0;
    
    if (item.type === 'pants') {

        // Pants measurements - all are required
        if (measurements.waist) {
            const adjustedWaist = adjustMeasurementForBodyType(measurements.waist, formData.bodyType, 'waist');
            const waistDiff = Math.abs(adjustedWaist - selectedSizeData.waist);
            fitScores.waist = calculateFitScore(waistDiff, 1.5);
            weightedScore += fitScores.waist * weights.waist;
            totalWeight += weights.waist;
        }
        
        if (measurements.thigh) {
            const adjustedThigh = adjustMeasurementForBodyType(measurements.thigh, formData.bodyType, 'thigh');
            const thighDiff = Math.abs(adjustedThigh - selectedSizeData.thigh);
            fitScores.thigh = calculateFitScore(thighDiff, 1.0);
            weightedScore += fitScores.thigh * weights.thigh;
            totalWeight += weights.thigh;
        }
        
        if (measurements.bottom) {
            const adjustedBottom = adjustMeasurementForBodyType(measurements.bottom, formData.bodyType, 'bottom');
            const bottomDiff = Math.abs(adjustedBottom - selectedSizeData.bottom);
            fitScores.bottom = calculateFitScore(bottomDiff, 0.75);
            weightedScore += fitScores.bottom * weights.bottom;
            totalWeight += weights.bottom;
        }
        
        if (measurements.length) {
            const hipDiff = Math.abs(measurements.hip - selectedSizeData.hip);
            fitScores.length = calculateFitScore(hipDiff, 2);
            weightedScore += fitScores.length * weights.pantsLength;
            totalWeight += weights.pantsLength;
        }
        
        // For pants, all measurements are required, so we should always have scores
        if (Object.keys(fitScores).length === 0) {
            throw new Error('All pants measurements are required for accurate fit analysis');
        }
    } else {
        // Shirt/Jacket measurements
                if (selectedItem === 't-shirt' || selectedItem === 'long-sleeve' || selectedItem === 'hooded-jacket' || selectedItem === 'sweat-shirt') {
            // T-shirt, Long Sleeve, Hooded Jacket, and Sweat Shirt measurements
            if (measurements.length) {
                const lengthDiff = Math.abs(measurements.length - selectedSizeData.length);
                fitScores.length = calculateFitScore(lengthDiff, 1.5);
                weightedScore += fitScores.length * weights.length;
                totalWeight += weights.length;
            }

            if (measurements.chestCircumference) {
                const adjustedChest = adjustMeasurementForBodyType(measurements.chestCircumference, formData.bodyType, 'chest');
                const chestDiff = Math.abs(adjustedChest - selectedSizeData.chestCircumference);
                fitScores.chest = calculateFitScore(chestDiff, 1.5);
                weightedScore += fitScores.chest * weights.chest;
                totalWeight += weights.chest;
            }

            if (measurements.shoulderWidth) {
                const adjustedShoulder = adjustMeasurementForBodyType(measurements.shoulderWidth, formData.bodyType, 'shoulder');
                const shoulderDiff = Math.abs(adjustedShoulder - selectedSizeData.shoulderWidth);
                fitScores.shoulder = calculateFitScore(shoulderDiff, 0.75);
                weightedScore += fitScores.shoulder * weights.shoulder;
                totalWeight += weights.shoulder;
            }

            if (measurements.neckWidth) {
                const neckDiff = Math.abs(measurements.neckWidth - selectedSizeData.neckWidth);
                fitScores.neck = calculateFitScore(neckDiff, 2);
                weightedScore += fitScores.neck * weights.neck;
                totalWeight += weights.neck;
            }

            if (measurements.sleeveLength) {
                const sleeveDiff = Math.abs(measurements.sleeveLength - selectedSizeData.sleeveLength);
                fitScores.sleeve = calculateFitScore(sleeveDiff, 1);
                weightedScore += fitScores.sleeve * weights.sleeve;
                totalWeight += weights.sleeve;
            }

            if (measurements.sleeveOpeningCircumference) {
                const sleeveOpeningDiff = Math.abs(measurements.sleeveOpeningCircumference - selectedSizeData.sleeveOpeningCircumference);
                fitScores.sleeveOpening = calculateFitScore(sleeveOpeningDiff, 1.5);
                weightedScore += fitScores.sleeveOpening * weights.arm;
                totalWeight += weights.arm;
            }

            if (measurements.armHoleCircumference) {
                const armHoleDiff = Math.abs(measurements.armHoleCircumference - selectedSizeData.armHoleCircumference);
                fitScores.armHole = calculateFitScore(armHoleDiff, 1.5);
                weightedScore += fitScores.armHole * weights.arm;
                totalWeight += weights.arm;
            }

            if (measurements.varianceDeltoidVsBicept) {
                const varianceDiff = Math.abs(measurements.varianceDeltoidVsBicept - selectedSizeData.varianceDeltoidVsBicept);
                fitScores.variance = calculateFitScore(varianceDiff, 1.0);
                weightedScore += fitScores.variance * weights.arm;
                totalWeight += weights.arm;
            }
        } else if (selectedItem === 'short-sleeves') {
            // Short sleeve shirt measurements
            if (measurements.chestCircumference) {
                const adjustedChest = adjustMeasurementForBodyType(measurements.chestCircumference, formData.bodyType, 'chest');
                const chestDiff = Math.abs(adjustedChest - selectedSizeData.chestCircumference);
            fitScores.chest = calculateFitScore(chestDiff, 1.5);
            weightedScore += fitScores.chest * weights.chest;
            totalWeight += weights.chest;
        }
        
        if (measurements.shoulderWidth) {
            const adjustedShoulder = adjustMeasurementForBodyType(measurements.shoulderWidth, formData.bodyType, 'shoulder');
            const shoulderDiff = Math.abs(adjustedShoulder - selectedSizeData.shoulderWidth);
            fitScores.shoulder = calculateFitScore(shoulderDiff, 0.75);
            weightedScore += fitScores.shoulder * weights.shoulder;
            totalWeight += weights.shoulder;
        }
        
        if (measurements.sleeveLength) {
            const sleeveDiff = Math.abs(measurements.sleeveLength - selectedSizeData.sleeveLength);
            fitScores.sleeve = calculateFitScore(sleeveDiff, 1);
            weightedScore += fitScores.sleeve * weights.sleeve;
            totalWeight += weights.sleeve;
        }
        
        if (measurements.neckCircumference) {
            const neckDiff = Math.abs(measurements.neckCircumference - selectedSizeData.neckCircumference);
            fitScores.neck = calculateFitScore(neckDiff, 2);
            weightedScore += fitScores.neck * weights.neck;
            totalWeight += weights.neck;
        }
        
            if (measurements.armCircumference) {
                const armDiff = Math.abs(measurements.armCircumference - selectedSizeData.armCircumference);
                fitScores.arm = calculateFitScore(armDiff, 1.5);
                weightedScore += fitScores.arm * weights.arm;
                totalWeight += weights.arm;
            }

            if (measurements.totalLength) {
                const lengthDiff = Math.abs(measurements.totalLength - selectedSizeData.totalLength);
            fitScores.length = calculateFitScore(lengthDiff, 1.5);
            weightedScore += fitScores.length * weights.length;
            totalWeight += weights.length;
            }
        } else if (selectedItem === 'polar-overshirt') {
            // Polar overshirt measurements with specific weights
            if (measurements.chestCircumference) {
                const adjustedChest = adjustMeasurementForBodyType(measurements.chestCircumference, formData.bodyType, 'chest');
                const chestDiff = Math.abs(adjustedChest - selectedSizeData.chestCircumference);
                fitScores.chest = calculateFitScore(chestDiff, 3.5);
                weightedScore += fitScores.chest * weights.chest;
                totalWeight += weights.chest;
            }
            
            if (measurements.shoulderWidth) {
                const adjustedShoulder = adjustMeasurementForBodyType(measurements.shoulderWidth, formData.bodyType, 'shoulder');
                const shoulderDiff = Math.abs(adjustedShoulder - selectedSizeData.shoulderWidth);
                fitScores.shoulder = calculateFitScore(shoulderDiff, 0.5);
                weightedScore += fitScores.shoulder * weights.shoulder;
                totalWeight += weights.shoulder;
            }
            
            if (measurements.sleeveLength) {
                const sleeveDiff = Math.abs(measurements.sleeveLength - selectedSizeData.sleeveLength);
                fitScores.sleeve = calculateFitScore(sleeveDiff, 1.0);
                weightedScore += fitScores.sleeve * weights.sleeve;
                totalWeight += weights.sleeve;
            }
            
            if (measurements.neckCircumference) {
                const neckDiff = Math.abs(measurements.neckCircumference - selectedSizeData.neckCircumference);
                fitScores.neck = calculateFitScore(neckDiff, 1.0);
                weightedScore += fitScores.neck * weights.neck;
                totalWeight += weights.neck;
            }
            
            if (measurements.armCircumference) {
                const armDiff = Math.abs(measurements.armCircumference - selectedSizeData.armCircumference);
                fitScores.arm = calculateFitScore(armDiff, 0.5);
                weightedScore += fitScores.arm * weights.arm;
                totalWeight += weights.arm;
            }
            
            if (measurements.totalLength) {
                const lengthDiff = Math.abs(measurements.totalLength - selectedSizeData.totalLength);
                fitScores.length = calculateFitScore(lengthDiff, 1.0);
                weightedScore += fitScores.length * weights.length;
                totalWeight += weights.length;
            }
        } else {
            // Default shirt measurements (jagvi-shirt and others)
            if (measurements.chestCircumference) {
                const adjustedChest = adjustMeasurementForBodyType(measurements.chestCircumference, formData.bodyType, 'chest');
                const chestDiff = Math.abs(adjustedChest - selectedSizeData.chestCircumference);
                fitScores.chest = calculateFitScore(chestDiff, 1.5);
                weightedScore += fitScores.chest * weights.chest;
                totalWeight += weights.chest;
            }
            
            if (measurements.shoulderWidth) {
                const adjustedShoulder = adjustMeasurementForBodyType(measurements.shoulderWidth, formData.bodyType, 'shoulder');
                const shoulderDiff = Math.abs(adjustedShoulder - selectedSizeData.shoulderWidth);
                fitScores.shoulder = calculateFitScore(shoulderDiff, 0.75);
                weightedScore += fitScores.shoulder * weights.shoulder;
                totalWeight += weights.shoulder;
            }
            
            if (measurements.sleeveLength) {
                const sleeveDiff = Math.abs(measurements.sleeveLength - selectedSizeData.sleeveLength);
                fitScores.sleeve = calculateFitScore(sleeveDiff, 1);
                weightedScore += fitScores.sleeve * weights.sleeve;
                totalWeight += weights.sleeve;
            }
            
            if (measurements.neckCircumference) {
                const neckDiff = Math.abs(measurements.neckCircumference - selectedSizeData.neckCircumference);
                fitScores.neck = calculateFitScore(neckDiff, 2);
                weightedScore += fitScores.neck * weights.neck;
                totalWeight += weights.neck;
            }
            
            if (measurements.armCircumference) {
                const armDiff = Math.abs(measurements.armCircumference - selectedSizeData.armCircumference);
                fitScores.arm = calculateFitScore(armDiff, 1.5);
                weightedScore += fitScores.arm * weights.arm;
                totalWeight += weights.arm;
            }

            if (measurements.totalLength) {
                const lengthDiff = Math.abs(measurements.totalLength - selectedSizeData.totalLength);
                fitScores.length = calculateFitScore(lengthDiff, 1.5);
                weightedScore += fitScores.length * weights.length;
                totalWeight += weights.length;
            }
        }
        
        // If no measurements provided, set default good scores
        if (Object.keys(fitScores).length === 0) {
            fitScores.chest = 0.8;
            fitScores.shoulder = 0.8;
            fitScores.sleeve = 0.8;
            fitScores.neck = 0.8;
            fitScores.arm = 0.8;
            fitScores.length = 0.8;
            weightedScore = 0.8;
            totalWeight = 1.0;
        }
    }
    
    // Calculate weighted average score
    const averageScore = totalWeight > 0 ? weightedScore / totalWeight : 0;
    
    // Adjust overall score based on body type
    let adjustedScore = averageScore;
    if (formData.bodyType === 'athletic' || formData.bodyType === 'plus') {
        // Be more lenient with athletic and plus sizes
        adjustedScore = Math.min(1, averageScore * 1.1);
    }
    
    // Ensure we have a valid score
    if (isNaN(adjustedScore) || adjustedScore === 0) {
        adjustedScore = 0.8; // Default to good fit if no measurements provided
    }
    

    
    const overallFit = getFitStatus(adjustedScore);
    
    // Generate recommendations
    const recommendations = generateRecommendations(fitScores, formData, item);
    
    // Find alternative sizes
    const alternatives = findAlternativeSizes(formData, item, fitScores);
    
    return {
        item: item,
        selectedSize: selectedSize,
        fitScores: fitScores,
        overallFit: overallFit,
        recommendations: recommendations,
        alternatives: alternatives,
        formData: formData
    };
}

function calculateFitScore(difference, tolerance) {
    // More granular fit scoring based on the difference relative to tolerance
    if (difference <= tolerance * 0.5) return 1;      // Perfect fit (within half tolerance)
    if (difference <= tolerance) return 0.9;          // Very good fit
    if (difference <= tolerance * 1.5) return 0.8;    // Good fit
    if (difference <= tolerance * 2) return 0.7;      // Slightly tight/loose
    if (difference <= tolerance * 2.5) return 0.6;    // Noticeably tight/loose
    if (difference <= tolerance * 3) return 0.4;      // Very tight/loose
    return 0.2;                                      // Too tight/loose
}

function getFitStatus(score) {
    // More granular fit status with clearer messages
    if (score >= 0.9) return { status: 'comfortable', icon: '🟢', text: 'Perfect Fit' };
    if (score >= 0.8) return { status: 'comfortable', icon: '🟢', text: 'Comfortable Fit' };
    if (score >= 0.7) return { status: 'comfortable', icon: '🟢', text: 'Good Fit' };
    if (score >= 0.6) return { status: 'slightly-tight', icon: '🟡', text: 'Slightly Tight' };
    if (score >= 0.4) return { status: 'slightly-tight', icon: '🟡', text: 'Consider Sizing Up' };
    return { status: 'too-tight', icon: '🔴', text: 'Size Up Recommended' };
}

function generateRecommendations(fitScores, formData, item) {
    const recommendations = [];
    
    // Analyze each measurement
    Object.entries(fitScores).forEach(([measurement, score]) => {
        if (score < 0.7) {
            const status = getFitStatus(score);
            let message = `${measurement.charAt(0).toUpperCase() + measurement.slice(1)}: ${status.text}`;
            
            // Add specific advice based on measurement and body type
            if (measurement === 'chest' && formData.bodyType === 'athletic') {
                message += ' (common for athletic builds)';
            } else if (measurement === 'waist' && formData.bodyType === 'plus') {
                message += ' (consider comfort stretch options)';
            }
            
            recommendations.push({
                measurement: measurement,
                status: status.status,
                message: message,
                icon: status.icon
            });
        }
    });
    
    // Add body type specific recommendations
    if (formData.bodyType === 'athletic') {
        if (!recommendations.find(r => r.measurement === 'chest')) {
            recommendations.push({
                measurement: 'body-type',
                status: 'comfortable',
                message: 'Athletic build: This size should accommodate your muscular frame',
                icon: '🟢'
            });
        }
    } else if (formData.bodyType === 'plus') {
        if (Object.values(fitScores).some(score => score < 0.7)) {
            recommendations.push({
                measurement: 'body-type',
                status: 'slightly-tight',
                message: 'Plus size: Consider trying our comfort fit options for more room',
                icon: '🟡'
            });
        } else {
            recommendations.push({
                measurement: 'body-type',
                status: 'comfortable',
                message: 'Plus size: This size provides good comfort and movement',
                icon: '🟢'
            });
        }
    }
    
    // Add general recommendations
    if (recommendations.length === 0) {
        recommendations.push({
            measurement: 'overall',
            status: 'comfortable',
            message: 'Perfect fit! All measurements are within ideal range',
            icon: '🟢'
        });
    }
    
    return recommendations;
}

function findAlternativeSizes(formData, item, fitScores) {
    const alternatives = [];
    const sizes = Object.keys(item.sizeChart);
    const currentIndex = sizes.indexOf(selectedSize);
    
    // Calculate average fit score (only for measurements that were provided)
    const validScores = Object.values(fitScores).filter(score => score !== undefined && score !== null);
    const avgScore = validScores.length > 0 ? validScores.reduce((sum, score) => sum + score, 0) / validScores.length : 0.8;
    
    // For Jagvi shirts, short sleeve shirts, T-shirts, long sleeve shirts, hooded jackets, and sweat shirts, use the predicted optimal size from backend if available
    if ((selectedItem === 'jagvi-shirt' || selectedItem === 'short-sleeves' || selectedItem === 't-shirt' || selectedItem === 'long-sleeve' || selectedItem === 'hooded-jacket' || selectedItem === 'sweat-shirt') && window.predictedOptimalSize) {
        const predictedSize = window.predictedOptimalSize;
        const predictedIndex = sizes.indexOf(predictedSize);
        
        console.log('Using predicted size for alternatives:', predictedSize); // Debug log
        console.log('Predicted size index:', predictedIndex); // Debug log
        console.log('Available sizes:', sizes); // Debug log
        
        if (predictedIndex !== -1) {
            // If predicted size is different from selected size, make it the primary recommendation
            if (predictedSize !== selectedSize) {
                alternatives.push({
                    size: predictedSize,
                    reason: 'Recommended: Best fit based on your measurements',
                    recommended: true
                });
            }
            
            // Add sizes around the predicted optimal size
            if (predictedIndex > 0) {
                alternatives.push({
                    size: sizes[predictedIndex - 1],
                    reason: 'Alternative: For a closer fit',
                    recommended: false
                });
            }
            if (predictedIndex < sizes.length - 1) {
                alternatives.push({
                    size: sizes[predictedIndex + 1],
                    reason: 'Alternative: For a looser fit',
                    recommended: false
                });
            }
            
            // If predicted size is very different from selected size, add more context
            if (Math.abs(predictedIndex - currentIndex) > 1) {
                alternatives.push({
                    size: selectedSize,
                    reason: 'Your selected size (may not fit well)',
                    recommended: false
                });
            }
            
            return alternatives;
        }
    }
    
    // For Jagvi shirts, short sleeve shirts, T-shirts, long sleeve shirts, hooded jackets, and sweat shirts, also try local analysis if backend prediction is not available
    if ((selectedItem === 'jagvi-shirt' || selectedItem === 'short-sleeves' || selectedItem === 't-shirt' || selectedItem === 'long-sleeve' || selectedItem === 'hooded-jacket' || selectedItem === 'sweat-shirt') && !window.predictedOptimalSize) {
        const localBestSize = findBestMatchingSize(formData.measurements, item);
        console.log('Local analysis best size:', localBestSize); // Debug log
        if (localBestSize && localBestSize !== selectedSize) {
            alternatives.push({
                size: localBestSize,
                reason: 'Recommended: Best fit based on local analysis',
                recommended: true
            });
            
            const localIndex = sizes.indexOf(localBestSize);
            if (localIndex > 0) {
                alternatives.push({
                    size: sizes[localIndex - 1],
                    reason: 'Alternative: For a closer fit',
                    recommended: false
                });
            }
            if (localIndex < sizes.length - 1) {
                alternatives.push({
                    size: sizes[localIndex + 1],
                    reason: 'Alternative: For a looser fit',
                    recommended: false
                });
            }
            
            return alternatives;
        }
    }
    
    // Fallback to original logic for other items or when prediction is not available
    if (avgScore < 0.7) {
        // If current size is too tight, recommend sizing up
        if (currentIndex < sizes.length - 1) {
            alternatives.push({
                size: sizes[currentIndex + 1],
                reason: 'Recommended: Better overall fit',
                recommended: true
            });
        }
        if (currentIndex < sizes.length - 2) {
            alternatives.push({
                size: sizes[currentIndex + 2],
                reason: 'Alternative: Most relaxed fit',
                recommended: false
            });
        }
    } else if (avgScore > 0.9 && formData.bodyType !== 'plus') {
        // If current size is very loose, suggest sizing down (except for plus size)
        if (currentIndex > 0) {
            alternatives.push({
                size: sizes[currentIndex - 1],
                reason: 'Alternative: For a closer fit',
                recommended: false
            });
        }
    } else {
        // Current size is good, offer alternatives
        if (currentIndex > 0) {
            alternatives.push({
                size: sizes[currentIndex - 1],
                reason: 'For a closer fit',
                recommended: false
            });
        }
        if (currentIndex < sizes.length - 1) {
            alternatives.push({
                size: sizes[currentIndex + 1],
                reason: 'For a looser fit',
                recommended: false
            });
        }
    }
    
    return alternatives;
}

// Function to find the best matching size based on measurements
function findBestMatchingSize(measurements, item) {
    if (!item || !item.sizeChart) return null;
    
    const sizes = Object.keys(item.sizeChart);
    let bestSize = null;
    let smallestDiff = Infinity;
    
    for (const size of sizes) {
        let totalDiff = 0;
        let measurementCount = 0;
        
        // Handle different measurement types for different shirt types
                if (selectedItem === 't-shirt' || selectedItem === 'long-sleeve' || selectedItem === 'hooded-jacket' || selectedItem === 'sweat-shirt') {
            // T-shirt, Long Sleeve, Hooded Jacket, and Sweat Shirt measurements
            if (measurements.length && item.sizeChart[size].length) {
                const diff = Math.abs(item.sizeChart[size].length - measurements.length);
                totalDiff += diff * 0.15; // Length has 15% weight
                measurementCount++;
            }

            if (measurements.chestCircumference && item.sizeChart[size].chestCircumference) {
                const diff = Math.abs(item.sizeChart[size].chestCircumference - measurements.chestCircumference);
                totalDiff += diff * 0.25; // Chest has 25% weight
                measurementCount++;
            }

            if (measurements.shoulderWidth && item.sizeChart[size].shoulderWidth) {
                const diff = Math.abs(item.sizeChart[size].shoulderWidth - measurements.shoulderWidth);
                totalDiff += diff * 0.20; // Shoulder has 20% weight
                measurementCount++;
            }

            if (measurements.neckWidth && item.sizeChart[size].neckWidth) {
                const diff = Math.abs(item.sizeChart[size].neckWidth - measurements.neckWidth);
                totalDiff += diff * 0.10; // Neck width has 10% weight
                measurementCount++;
            }

            if (measurements.sleeveLength && item.sizeChart[size].sleeveLength) {
                const diff = Math.abs(item.sizeChart[size].sleeveLength - measurements.sleeveLength);
                totalDiff += diff * 0.15; // Sleeve has 15% weight
                measurementCount++;
            }

            if (measurements.sleeveOpeningCircumference && item.sizeChart[size].sleeveOpeningCircumference) {
                const diff = Math.abs(item.sizeChart[size].sleeveOpeningCircumference - measurements.sleeveOpeningCircumference);
                totalDiff += diff * 0.10; // Sleeve opening has 10% weight
                measurementCount++;
            }

            if (measurements.armHoleCircumference && item.sizeChart[size].armHoleCircumference) {
                const diff = Math.abs(item.sizeChart[size].armHoleCircumference - measurements.armHoleCircumference);
                totalDiff += diff * 0.10; // Arm hole has 10% weight
                measurementCount++;
            }

            if (measurements.varianceDeltoidVsBicept && item.sizeChart[size].varianceDeltoidVsBicept) {
                const diff = Math.abs(item.sizeChart[size].varianceDeltoidVsBicept - measurements.varianceDeltoidVsBicept);
                totalDiff += diff * 0.05; // Variance has 5% weight
                measurementCount++;
            }
        } else if (selectedItem === 'short-sleeves') {
            // Short sleeve shirt measurements
            if (measurements.chestCircumference && item.sizeChart[size].chestCircumference) {
                const diff = Math.abs(item.sizeChart[size].chestCircumference - measurements.chestCircumference);
                totalDiff += diff * 0.25; // Chest has 25% weight
                measurementCount++;
            }
            
            if (measurements.shoulderWidth && item.sizeChart[size].shoulderWidth) {
                const diff = Math.abs(item.sizeChart[size].shoulderWidth - measurements.shoulderWidth);
                totalDiff += diff * 0.25; // Shoulder has 25% weight
                measurementCount++;
            }
            
            if (measurements.sleeveLength && item.sizeChart[size].sleeveLength) {
                const diff = Math.abs(item.sizeChart[size].sleeveLength - measurements.sleeveLength);
                totalDiff += diff * 0.20; // Sleeve has 20% weight
                measurementCount++;
            }
            
            if (measurements.neckCircumference && item.sizeChart[size].neckCircumference) {
                const diff = Math.abs(item.sizeChart[size].neckCircumference - measurements.neckCircumference);
                totalDiff += diff * 0.15; // Neck has 15% weight
                measurementCount++;
            }
            
            if (measurements.armCircumference && item.sizeChart[size].armCircumference) {
                const diff = Math.abs(item.sizeChart[size].armCircumference - measurements.armCircumference);
                totalDiff += diff * 0.10; // Arm has 10% weight
                measurementCount++;
            }
            
            if (measurements.totalLength && item.sizeChart[size].totalLength) {
                const diff = Math.abs(item.sizeChart[size].totalLength - measurements.totalLength);
                totalDiff += diff * 0.05; // Length has 5% weight
                measurementCount++;
            }
        } else if (selectedItem === 'polar-overshirt') {
            // Polar overshirt measurements with specific weights
            if (measurements.chestCircumference && item.sizeChart[size].chestCircumference) {
                const diff = Math.abs(item.sizeChart[size].chestCircumference - measurements.chestCircumference);
                totalDiff += diff * 0.25; // Chest has 25% weight
                measurementCount++;
            }
            
            if (measurements.shoulderWidth && item.sizeChart[size].shoulderWidth) {
                const diff = Math.abs(item.sizeChart[size].shoulderWidth - measurements.shoulderWidth);
                totalDiff += diff * 0.25; // Shoulder has 25% weight
                measurementCount++;
            }
            
            if (measurements.sleeveLength && item.sizeChart[size].sleeveLength) {
                const diff = Math.abs(item.sizeChart[size].sleeveLength - measurements.sleeveLength);
                totalDiff += diff * 0.20; // Sleeve has 20% weight
                measurementCount++;
            }
            
            if (measurements.neckCircumference && item.sizeChart[size].neckCircumference) {
                const diff = Math.abs(item.sizeChart[size].neckCircumference - measurements.neckCircumference);
                totalDiff += diff * 0.15; // Neck has 15% weight
                measurementCount++;
            }
            
            if (measurements.armCircumference && item.sizeChart[size].armCircumference) {
                const diff = Math.abs(item.sizeChart[size].armCircumference - measurements.armCircumference);
                totalDiff += diff * 0.10; // Arm has 10% weight
                measurementCount++;
            }
            
            if (measurements.totalLength && item.sizeChart[size].totalLength) {
                const diff = Math.abs(item.sizeChart[size].totalLength - measurements.totalLength);
                totalDiff += diff * 0.05; // Length has 5% weight
                measurementCount++;
            }
        } else {
            // Default shirt measurements (jagvi-shirt and others)
            if (measurements.chestCircumference && item.sizeChart[size].chestCircumference) {
                const diff = Math.abs(item.sizeChart[size].chestCircumference - measurements.chestCircumference);
                totalDiff += diff * 0.25; // Chest has 25% weight
                measurementCount++;
            }
            
            if (measurements.shoulderWidth && item.sizeChart[size].shoulderWidth) {
                const diff = Math.abs(item.sizeChart[size].shoulderWidth - measurements.shoulderWidth);
                totalDiff += diff * 0.25; // Shoulder has 25% weight
                measurementCount++;
            }
            
            if (measurements.sleeveLength && item.sizeChart[size].sleeveLength) {
                const diff = Math.abs(item.sizeChart[size].sleeveLength - measurements.sleeveLength);
                totalDiff += diff * 0.20; // Sleeve has 20% weight
                measurementCount++;
            }
            
            if (measurements.neckCircumference && item.sizeChart[size].neckCircumference) {
                const diff = Math.abs(item.sizeChart[size].neckCircumference - measurements.neckCircumference);
                totalDiff += diff * 0.15; // Neck has 15% weight
                measurementCount++;
            }
            
            if (measurements.armCircumference && item.sizeChart[size].armCircumference) {
                const diff = Math.abs(item.sizeChart[size].armCircumference - measurements.armCircumference);
                totalDiff += diff * 0.10; // Arm has 10% weight
                measurementCount++;
            }
            
            if (measurements.totalLength && item.sizeChart[size].totalLength) {
                const diff = Math.abs(item.sizeChart[size].totalLength - measurements.totalLength);
                totalDiff += diff * 0.05; // Length has 5% weight
                measurementCount++;
            }
        }
        
        // Calculate average difference
        if (measurementCount > 0) {
            const avgDiff = totalDiff / measurementCount;
            if (avgDiff < smallestDiff) {
                smallestDiff = avgDiff;
                bestSize = size;
            }
        }
    }
    
    return bestSize;
}

// Display Results
function displayResults(analysis) {
    // Update item information
    resultItemIcon.className = analysis.item.icon;
    resultItemName.textContent = analysis.item.name;
    resultItemDesc.textContent = analysis.item.description;
    resultSelectedSize.textContent = analysis.selectedSize;
    
    // Update fit indicators
    updateFitIndicators(analysis);
    
    // Update recommendations
    updateRecommendations(analysis.recommendations);
    
    // Update alternative sizes
    updateAlternativeSizes(analysis.alternatives);
    
    // Show results
    stepContainers.forEach(container => container.classList.remove('active'));
    resultsSection.classList.remove('hidden');
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function updateFitIndicators(analysis) {
    const indicators = ['chestFit', 'shoulderFit', 'lengthFit', 'overallFit'];
    
    indicators.forEach(indicatorId => {
        const indicator = document.getElementById(indicatorId);
        if (indicator) {
            const fitData = getFitIndicatorData(indicatorId, analysis);
            indicator.className = `fit-indicator ${fitData.status}`;
            indicator.querySelector('.indicator-icon').textContent = fitData.icon;
            indicator.querySelector('.indicator-status').textContent = fitData.text;
            
            // Update labels based on item type
            const labelElement = indicator.querySelector('.indicator-label');
            if (labelElement) {
                if (analysis.item.type === 'pants') {
                    switch (indicatorId) {
                        case 'chestFit':
                            labelElement.textContent = 'Waist';
                            break;
                        case 'shoulderFit':
                            labelElement.textContent = 'Bottom';
                            break;
                        case 'lengthFit':
                            labelElement.textContent = 'Length';
                            break;
                        case 'overallFit':
                            labelElement.textContent = 'Overall';
                            break;
                    }
                } else {
                    // Reset to default labels for shirts/jackets
                    switch (indicatorId) {
                        case 'chestFit':
                            labelElement.textContent = 'Chest';
                            break;
                        case 'shoulderFit':
                            labelElement.textContent = 'Shoulder';
                            break;
                        case 'lengthFit':
                            labelElement.textContent = 'Length';
                            break;
                        case 'overallFit':
                            labelElement.textContent = 'Overall';
                            break;
                    }
                }
            }
        }
    });
}

function getFitIndicatorData(indicatorId, analysis) {
    switch (indicatorId) {
        case 'chestFit':
            // For pants, use waist score; for shirts/jackets, use chest score
            const chestScore = analysis.item.type === 'pants' 
                ? (analysis.fitScores.waist || 0.8)
                : (analysis.fitScores.chest || 0.8);
            return getFitStatus(chestScore);
        case 'shoulderFit':
            // For pants, use bottom score; for shirts/jackets, use shoulder score
            const shoulderScore = analysis.item.type === 'pants'
                ? (analysis.fitScores.bottom || 0.8)
                : (analysis.fitScores.shoulder || 0.8);
            return getFitStatus(shoulderScore);
        case 'lengthFit':
            const lengthScore = analysis.fitScores.length || 0.8;
            return getFitStatus(lengthScore);
        case 'overallFit':
            return analysis.overallFit;
        default:
            return { status: 'comfortable', icon: '🟢', text: 'Good Fit' };
    }
}

function updateRecommendations(recommendations) {
    let html = '';
    recommendations.forEach(rec => {
        html += `
            <div class="recommendation-item ${rec.status}">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 1.2rem;">${rec.icon}</span>
                    <span>${rec.message}</span>
                </div>
            </div>
        `;
    });
    recommendationsGrid.innerHTML = html;
}

function updateAlternativeSizes(alternatives) {
    let html = '';
    alternatives.forEach(alt => {
        html += `
            <div class="alternative-size ${alt.recommended ? 'recommended' : ''}">
                <div style="font-size: 1.5rem; font-weight: 600; margin-bottom: 5px;">${alt.size}</div>
                <div style="font-size: 0.9rem; color: #718096;">${alt.reason}</div>
            </div>
        `;
    });
    sizeAlternatives.innerHTML = html;
}

// Utility functions
function startOver() {
    // Reset state
    currentStep = 1;
    selectedItem = null;
    selectedSize = null;
    uploadedImage = null;
    
    // Reset UI
    itemCards.forEach(card => card.classList.remove('selected'));
    document.querySelectorAll('.size-option').forEach(option => option.classList.remove('selected'));
    removeImage();
    
    // Reset form
    document.getElementById('gender').value = '';
    document.getElementById('age').value = '';
    document.getElementById('height').value = '';
    document.getElementById('weight').value = '';
    document.getElementById('bodyType').value = '';
    
    // Show step 1
    updateProgressSteps();
    showStep(1);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function saveResults() {
    // Create a summary of the results
    const results = {
        item: selectedItem,
        size: selectedSize,
        timestamp: new Date().toISOString(),
        recommendations: document.querySelectorAll('.recommendation-item').length
    };
    
    // Create downloadable content
    const content = `Size Predictor Results\n\nItem: ${itemData[selectedItem].name}\nSelected Size: ${selectedSize}\nDate: ${new Date().toLocaleDateString()}\n\nRecommendations:\n${Array.from(document.querySelectorAll('.recommendation-item')).map(item => item.textContent.trim()).join('\n')}`;
    
    // Create and download file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `size-prediction-${selectedItem}-${selectedSize}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function showError(message) {
    // Create error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
            <button class="error-close">&times;</button>
        </div>
    `;
    
    // Add error styles
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fed7d7;
        color: #c53030;
        padding: 15px 20px;
        border-radius: 8px;
        border-left: 4px solid #e53e3e;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1001;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        .error-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .error-close {
            background: none;
            border: none;
            color: #c53030;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: auto;
        }
        .error-close:hover {
            color: #9b2c2c;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(errorDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
    
    // Close button functionality
    const closeBtn = errorDiv.querySelector('.error-close');
    closeBtn.addEventListener('click', () => {
        errorDiv.remove();
    });
}

// Form validation
document.addEventListener('DOMContentLoaded', function() {
    const formInputs = document.querySelectorAll('input, select');

formInputs.forEach(input => {
    input.addEventListener('blur', validateField);
    input.addEventListener('input', clearFieldError);
    });
});

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing error styling
    field.classList.remove('error');
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        field.classList.add('error');
        return false;
    }
    
    // Validate number ranges
    if (field.type === 'number') {
        const numValue = parseFloat(value);
        const min = parseFloat(field.min);
        const max = parseFloat(field.max);
        
        if (value && (numValue < min || numValue > max)) {
            field.classList.add('error');
            return false;
        }
    }
    
    return true;
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
}

// Add error styles to CSS
const errorStyles = document.createElement('style');
errorStyles.textContent = `
    .form-group input.error,
    .form-group select.error {
        border-color: #e53e3e;
        background: #fed7d7;
    }
    
    .form-group input.error:focus,
    .form-group select.error:focus {
        border-color: #e53e3e;
        box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
    }
    
    .form-group.full-width {
        width: 100%;
    }
    
    .required-note {
        color: #e53e3e;
        font-size: 0.9rem;
        font-weight: 500;
        margin: 0 0 15px 0;
        text-align: center;
        background: #fed7d7;
        padding: 8px 12px;
        border-radius: 6px;
        border: 1px solid #feb2b2;
    }
    
    .field-error {
        color: #e53e3e;
        font-size: 0.8rem;
        margin-top: 5px;
        padding: 4px 8px;
        background: #fed7d7;
        border-radius: 4px;
        border: 1px solid #feb2b2;
    }
    
    .form-group input.valid {
        border-color: #38a169;
        background: #f0fff4;
    }
    
    .form-group input.valid:focus {
        border-color: #38a169;
        box-shadow: 0 0 0 3px rgba(56, 161, 105, 0.1);
    }
    
    .analyze-btn.disabled {
        opacity: 0.6;
        cursor: not-allowed;
        background: #a0aec0;
    }
`;
document.head.appendChild(errorStyles);


