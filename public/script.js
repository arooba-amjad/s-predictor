// DOM elements
const sizeForm = document.getElementById('sizeForm');
const resultContainer = document.getElementById('resultContainer');
const formContainer = document.querySelector('.form-container');
const loadingOverlay = document.getElementById('loadingOverlay');
const resetBtn = document.getElementById('resetBtn');

// Garment type elements
const garmentTypeSelect = document.getElementById('garmentType');
const garmentInfo = document.getElementById('garmentInfo');
const garmentName = document.getElementById('garmentName');
const garmentReference = document.getElementById('garmentReference');

// Measurement sections
const shirtMeasurements = document.getElementById('shirtMeasurements');
const pantsMeasurements = document.getElementById('pantsMeasurements');

// Result display elements
const predictedSizeEl = document.getElementById('predictedSize');
const confidencePercentEl = document.getElementById('confidencePercent');
const confidenceFillEl = document.getElementById('confidenceFill');
const displayHeightEl = document.getElementById('displayHeight');
const displayWeightEl = document.getElementById('displayWeight');
const displayChestHalfEl = document.getElementById('displayChestHalf');
const displayWaistHalfEl = document.getElementById('displayWaistHalf');
const displayBottomHalfEl = document.getElementById('displayBottomHalf');
const displayShoulderLengthEl = document.getElementById('displayShoulderLength');
const displayTotalLengthEl = document.getElementById('displayTotalLength');
const recommendationsListEl = document.getElementById('recommendationsList');

// Garment result elements
const garmentIcon = document.getElementById('garmentIcon');
const resultGarmentName = document.getElementById('resultGarmentName');
const resultGarmentReference = document.getElementById('resultGarmentReference');

// Garment type data
const garmentTypes = {
    'jagvi-shirt': {
        name: 'Jagvi Shirt (Long Sleeve)',
        reference: 'For a man of 75 kgs and 1.83 cms height',
        icon: 'fas fa-tshirt'
    },
    'short-sleeves': {
        name: 'Short Sleeve Shirt',
        reference: 'For a man of 75 kgs and 1.83 cms height',
        icon: 'fas fa-tshirt'
    },
    'pants': {
        name: 'Pants',
        reference: 'JAGVI.Rive Gauche SS2025',
        icon: 'fas fa-socks'
    },
    'hooded-jacket': {
        name: 'Hooded Jacket',
        reference: 'SUMMER 2025 Collection',
        icon: 'fas fa-user-tie'
    },
    'polar-overshirt': {
        name: 'Polar Overshirt Jacket',
        reference: 'SUMMER 2025 Collection',
        icon: 'fas fa-user-tie'
    }
};

// Size chart data for short sleeve shirts
const shortSleeveSizeChart = {
    // Half-chest and Shoulder Width measurements (in cm)
    chestShoulder: {
        'XS': { chestHalf: 52, shoulderWidth: 12.5 },
        'S': { chestHalf: 54, shoulderWidth: 13.25 },
        'M': { chestHalf: 56, shoulderWidth: 14 },
        'L': { chestHalf: 58, shoulderWidth: 14.75 },
        'XL': { chestHalf: 60, shoulderWidth: 15.5 },
        'XXL': { chestHalf: 62, shoulderWidth: 16.25 }
    },
    // Sleeve Length, Neck Circumference, and Shirt Length measurements (in cm)
    sleeveNeckLength: {
        'XS': { sleeveLength: 23, neckCircumference: 37, shirtLength: 70 }, // Neck width * 2 for circumference
        'S': { sleeveLength: 24, neckCircumference: 38, shirtLength: 71 },
        'M': { sleeveLength: 25, neckCircumference: 39, shirtLength: 72 },
        'L': { sleeveLength: 26, neckCircumference: 40, shirtLength: 73 },
        'XL': { sleeveLength: 27, neckCircumference: 41, shirtLength: 74 },
        'XXL': { sleeveLength: 28, neckCircumference: 42, shirtLength: 75 }
    }
};

// Size chart data for long sleeve shirts
const longSleeveSizeChart = {
    // Half-chest and Shoulder Width measurements (in cm)
    chestShoulder: {
        'XS': { chestHalf: 51, shoulderWidth: 13.5 },
        'S': { chestHalf: 53, shoulderWidth: 14 },
        'M': { chestHalf: 55, shoulderWidth: 14.5 },
        'L': { chestHalf: 57, shoulderWidth: 15 },
        'XL': { chestHalf: 59, shoulderWidth: 15.5 },
        'XXL': { chestHalf: 61, shoulderWidth: 16 }
    },
    // Sleeve Length, Neck Circumference, and Shirt Length measurements (in cm)
    sleeveNeckLength: {
        'XS': { sleeveLength: 65, neckCircumference: 76, shirtLength: 73 }, // Neck width * 2 for circumference
        'S': { sleeveLength: 65.5, neckCircumference: 78, shirtLength: 74 },
        'M': { sleeveLength: 66, neckCircumference: 82, shirtLength: 75 },
        'L': { sleeveLength: 66.5, neckCircumference: 86, shirtLength: 76 },
        'XL': { sleeveLength: 67, neckCircumference: 90, shirtLength: 77 },
        'XXL': { sleeveLength: 67.5, neckCircumference: 94, shirtLength: 78 }
    }
};

// Size chart data for hooded jackets
const hoodedJacketSizeChart = {
    // Half-chest and Shoulder Width measurements (in cm)
    chestShoulder: {
        'S': { chestHalf: 57, shoulderWidth: 14.5 },
        'M': { chestHalf: 59, shoulderWidth: 15 },
        'L': { chestHalf: 61, shoulderWidth: 15.5 },
        'XL': { chestHalf: 63, shoulderWidth: 16 },
        'XXL': { chestHalf: 65, shoulderWidth: 16.5 }
    },
    // Sleeve Length, Neck Circumference, and Shirt Length measurements (in cm)
    sleeveNeckLength: {
        'S': { sleeveLength: 66, neckCircumference: 46, shirtLength: 71 }, // Neck width * 2 for circumference
        'M': { sleeveLength: 67, neckCircumference: 48, shirtLength: 72 },
        'L': { sleeveLength: 68, neckCircumference: 50, shirtLength: 73 },
        'XL': { sleeveLength: 69, neckCircumference: 52, shirtLength: 74 },
        'XXL': { sleeveLength: 70, neckCircumference: 54, shirtLength: 75 }
    }
};

// Size chart data for polar overshirts
const polarOvershirtSizeChart = {
    // Half-chest and Shoulder Width measurements (in cm)
    chestShoulder: {
        'XS': { chestHalf: 54, shoulderWidth: 14 },
        'S': { chestHalf: 56, shoulderWidth: 14.5 },
        'M': { chestHalf: 58, shoulderWidth: 15 },
        'L': { chestHalf: 60, shoulderWidth: 15.5 },
        'XL': { chestHalf: 62, shoulderWidth: 16 },
        'XXL': { chestHalf: 64, shoulderWidth: 16.5 }
    },
    // Sleeve Length, Neck Circumference, and Shirt Length measurements (in cm)
    sleeveNeckLength: {
        'XS': { sleeveLength: 65, neckCircumference: 34, shirtLength: 71 }, // Neck width * 2 for circumference
        'S': { sleeveLength: 65.5, neckCircumference: 36, shirtLength: 72 },
        'M': { sleeveLength: 66, neckCircumference: 38, shirtLength: 73 },
        'L': { sleeveLength: 66.5, neckCircumference: 40, shirtLength: 74 },
        'XL': { sleeveLength: 67, neckCircumference: 42, shirtLength: 75 },
        'XXL': { sleeveLength: 67.5, neckCircumference: 44, shirtLength: 76 }
    }
};

// Garment type change handler
garmentTypeSelect.addEventListener('change', function() {
    const selectedType = this.value;
    
    // Hide all measurement sections first
    shirtMeasurements.classList.add('hidden');
    pantsMeasurements.classList.add('hidden');
    
    if (selectedType && garmentTypes[selectedType]) {
        const garment = garmentTypes[selectedType];
        garmentName.textContent = garment.name;
        garmentReference.textContent = garment.reference;
        garmentInfo.classList.remove('hidden');
        
        // Show appropriate measurement section
        if (selectedType === 'pants') {
            pantsMeasurements.classList.remove('hidden');
        } else {
            shirtMeasurements.classList.remove('hidden');
        }
    } else {
        garmentInfo.classList.add('hidden');
    }
});

// Form submission handler
sizeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Show loading overlay
    loadingOverlay.classList.remove('hidden');
    
    try {
        // Get form data
        const formData = new FormData(sizeForm);
        const garmentType = formData.get('garmentType');
        
        // Prepare measurements based on garment type
        let measurements = {};
        
        if (garmentType === 'pants') {
            // Pants-specific measurements (in cm)
            measurements = {
                waist: parseFloat(formData.get('pantsWaist')) || null,
                bottom: parseFloat(formData.get('pantsBottom')) || null,
                length: parseFloat(formData.get('pantsLength')) || null
            };
        } else {
            // Shirt/Jacket measurements (in cm)
            measurements = {
                chestHalf: parseFloat(formData.get('chestHalf')) || null,
                shoulderWidth: parseFloat(formData.get('shoulderWidth')) || null,
                sleeveLength: parseFloat(formData.get('sleeveLength')) || null,
                neckCircumference: parseFloat(formData.get('neckCircumference')) || null,
                shirtLength: parseFloat(formData.get('shirtLength')) || null
            };
        }
        
        const data = {
            garmentType: garmentType,
            gender: formData.get('gender'),
            age: parseInt(formData.get('age')),
            height: parseInt(formData.get('height')),
            weight: parseFloat(formData.get('weight')),
            bodyType: formData.get('bodyType'),
            measurements: measurements
        };
        
        // Validate required fields
        if (!data.garmentType || !data.gender || !data.age || !data.height || !data.weight || !data.bodyType) {
            throw new Error('Please fill in all required fields');
        }
        
        // Predict size based on garment type
        let result;
        
        if (garmentType === 'short-sleeves') {
            result = predictShortSleeveSize(data);
        } else if (garmentType === 'jagvi-shirt') {
            result = predictLongSleeveSize(data);
        } else if (garmentType === 'hooded-jacket') {
            result = predictHoodedJacketSize(data);
        } else if (garmentType === 'polar-overshirt') {
            result = predictPolarOvershirtSize(data);
        } else if (garmentType === 'pants') {
            result = predictPantsSize(data);
        } else {
            // For other garment types, use API call
            const response = await fetch('/api/predict-size', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error('Failed to predict size. Please try again.');
            }
            
            result = await response.json();
        }
        
        if (result.success) {
            displayResults(result, data);
        } else {
            throw new Error(result.error || 'Prediction failed');
        }
        
    } catch (error) {
        console.error('Error:', error);
        showError(error.message);
    } finally {
        // Hide loading overlay
        loadingOverlay.classList.add('hidden');
    }
});

// Predict short sleeve size based on measurements
function predictShortSleeveSize(data) {
    const { measurements, height, weight, bodyType } = data;
    
    // Initialize result
    let predictedSize = 'M'; // Default size
    let confidence = 70; // Default confidence
    let recommendations = [];
    let estimatedMeasurements = false;
    
    // If measurements are provided, use them for prediction
    if (measurements.chestHalf && measurements.shoulderWidth && measurements.sleeveLength && measurements.neckCircumference && measurements.shirtLength) {
        // Find best matching size based on all 5 measurements
        let bestMatch = null;
        let minDifference = Infinity;
        
        for (const [size, chestShoulderData] of Object.entries(shortSleeveSizeChart.chestShoulder)) {
            const sleeveNeckData = shortSleeveSizeChart.sleeveNeckLength[size];
            
            const chestDiff = Math.abs(measurements.chestHalf - chestShoulderData.chestHalf);
            const shoulderDiff = Math.abs(measurements.shoulderWidth - chestShoulderData.shoulderWidth);
            const sleeveDiff = Math.abs(measurements.sleeveLength - sleeveNeckData.sleeveLength);
            const neckDiff = Math.abs(measurements.neckCircumference - sleeveNeckData.neckCircumference);
            const lengthDiff = Math.abs(measurements.shirtLength - sleeveNeckData.shirtLength);
            
            // Weighted scoring: chest and shoulder are most important
            const totalDiff = chestDiff * 0.3 + shoulderDiff * 0.3 + sleeveDiff * 0.2 + neckDiff * 0.1 + lengthDiff * 0.1;
            
            if (totalDiff < minDifference) {
                minDifference = totalDiff;
                bestMatch = size;
            }
        }
        
        if (bestMatch) {
            predictedSize = bestMatch;
            confidence = Math.max(70, 100 - minDifference * 2); // Higher confidence for closer matches
        }
        
        // Check if sleeve length and shirt length match
        const sleeveNeckData = shortSleeveSizeChart.sleeveNeckLength[predictedSize];
        if (sleeveNeckData) {
            const sleeveMatch = Math.abs(measurements.sleeveLength - sleeveNeckData.sleeveLength) <= 1;
            const lengthMatch = Math.abs(measurements.shirtLength - sleeveNeckData.shirtLength) <= 2;
            const neckMatch = Math.abs(measurements.neckCircumference - sleeveNeckData.neckCircumference) <= 1;
            
            if (sleeveMatch && lengthMatch && neckMatch) {
                confidence += 15; // Bonus confidence for good match
                recommendations.push(`All measurements match well with size ${predictedSize}`);
            } else if (sleeveMatch || lengthMatch) {
                confidence += 5; // Small bonus for partial match
                recommendations.push('Some measurements match well');
            } else {
                recommendations.push('Consider adjustments for better fit');
            }
        }
        
        recommendations.push('Measurements provided - high accuracy prediction');
        
    } else {
        // Estimate measurements based on height, weight, and body type
        estimatedMeasurements = true;
        
        // Simple estimation based on height and weight
        let estimatedChestHalf = 56 + (height - 170) * 0.2 + (weight - 70) * 0.1;
        let estimatedShoulderWidth = 14 + (height - 170) * 0.02 + (weight - 70) * 0.01;
        let estimatedSleeveLength = 25 + (height - 170) * 0.1;
        let estimatedNeckCircumference = 39 + (height - 170) * 0.05 + (weight - 70) * 0.02;
        let estimatedShirtLength = 72 + (height - 170) * 0.1;
        
        // Adjust based on body type
        switch (bodyType) {
            case 'slim':
                estimatedChestHalf -= 2;
                estimatedShoulderWidth -= 0.5;
                estimatedNeckCircumference -= 1;
                estimatedSleeveLength -= 1;
                break;
            case 'athletic':
                estimatedChestHalf += 2;
                estimatedShoulderWidth += 0.5;
                estimatedNeckCircumference += 1;
                estimatedSleeveLength += 1;
                break;
            case 'plus':
                estimatedChestHalf += 4;
                estimatedShoulderWidth += 1;
                estimatedNeckCircumference += 2;
                estimatedSleeveLength += 2;
                break;
        }
        
        // Find best match for estimated measurements
        let minDifference = Infinity;
        for (const [size, chestShoulderData] of Object.entries(shortSleeveSizeChart.chestShoulder)) {
            const sleeveNeckData = shortSleeveSizeChart.sleeveNeckLength[size];
            
            const chestDiff = Math.abs(estimatedChestHalf - chestShoulderData.chestHalf);
            const shoulderDiff = Math.abs(estimatedShoulderWidth - chestShoulderData.shoulderWidth);
            const sleeveDiff = Math.abs(estimatedSleeveLength - sleeveNeckData.sleeveLength);
            const neckDiff = Math.abs(estimatedNeckCircumference - sleeveNeckData.neckCircumference);
            const lengthDiff = Math.abs(estimatedShirtLength - sleeveNeckData.shirtLength);
            
            // Weighted scoring: chest and shoulder are most important
            const totalDiff = chestDiff * 0.3 + shoulderDiff * 0.3 + sleeveDiff * 0.2 + neckDiff * 0.1 + lengthDiff * 0.1;
            
            if (totalDiff < minDifference) {
                minDifference = totalDiff;
                predictedSize = size;
            }
        }
        
        confidence = Math.max(50, 80 - minDifference * 3);
        recommendations.push('Size prediction based on estimated measurements');
        recommendations.push('For more accurate results, please provide your detailed measurements');
    }
    
    // Add general recommendations
    if (confidence < 80) {
        recommendations.push('Consider trying on multiple sizes for the best fit');
    }
    
    recommendations.push('Short sleeve shirts typically fit more relaxed than long sleeve shirts');
    
    return {
        success: true,
        predictedSize: {
            size: predictedSize,
            confidence: Math.round(confidence),
            measurements: measurements,
            estimatedMeasurements: estimatedMeasurements,
            recommendations: recommendations
        }
    };
}

// Predict long sleeve size based on measurements
function predictLongSleeveSize(data) {
    const { measurements, height, weight, bodyType } = data;
    
    // Initialize result
    let predictedSize = 'M'; // Default size
    let confidence = 70; // Default confidence
    let recommendations = [];
    let estimatedMeasurements = false;
    
    // If measurements are provided, use them for prediction
    if (measurements.chestHalf && measurements.shoulderWidth && measurements.sleeveLength && measurements.neckCircumference && measurements.shirtLength) {
        // Find best matching size based on all 5 measurements
        let bestMatch = null;
        let minDifference = Infinity;
        
        for (const [size, chestShoulderData] of Object.entries(longSleeveSizeChart.chestShoulder)) {
            const sleeveNeckData = longSleeveSizeChart.sleeveNeckLength[size];
            
            const chestDiff = Math.abs(measurements.chestHalf - chestShoulderData.chestHalf);
            const shoulderDiff = Math.abs(measurements.shoulderWidth - chestShoulderData.shoulderWidth);
            const sleeveDiff = Math.abs(measurements.sleeveLength - sleeveNeckData.sleeveLength);
            const neckDiff = Math.abs(measurements.neckCircumference - sleeveNeckData.neckCircumference);
            const lengthDiff = Math.abs(measurements.shirtLength - sleeveNeckData.shirtLength);
            
            // Weighted scoring: chest and shoulder are most important
            const totalDiff = chestDiff * 0.3 + shoulderDiff * 0.3 + sleeveDiff * 0.2 + neckDiff * 0.1 + lengthDiff * 0.1;
            
            if (totalDiff < minDifference) {
                minDifference = totalDiff;
                bestMatch = size;
            }
        }
        
        if (bestMatch) {
            predictedSize = bestMatch;
            confidence = Math.max(70, 100 - minDifference * 2); // Higher confidence for closer matches
        }
        
        // Check if sleeve length and shirt length match
        const sleeveNeckData = longSleeveSizeChart.sleeveNeckLength[predictedSize];
        if (sleeveNeckData) {
            const sleeveMatch = Math.abs(measurements.sleeveLength - sleeveNeckData.sleeveLength) <= 1;
            const lengthMatch = Math.abs(measurements.shirtLength - sleeveNeckData.shirtLength) <= 2;
            const neckMatch = Math.abs(measurements.neckCircumference - sleeveNeckData.neckCircumference) <= 2;
            
            if (sleeveMatch && lengthMatch && neckMatch) {
                confidence += 15; // Bonus confidence for good match
                recommendations.push(`All measurements match well with size ${predictedSize}`);
            } else if (sleeveMatch || lengthMatch) {
                confidence += 5; // Small bonus for partial match
                recommendations.push('Some measurements match well');
            } else {
                recommendations.push('Consider adjustments for better fit');
            }
        }
        
        recommendations.push('Measurements provided - high accuracy prediction');
        
    } else {
        // Estimate measurements based on height, weight, and body type
        estimatedMeasurements = true;
        
        // Simple estimation based on height and weight
        let estimatedChestHalf = 55 + (height - 170) * 0.2 + (weight - 70) * 0.1;
        let estimatedShoulderWidth = 14.5 + (height - 170) * 0.02 + (weight - 70) * 0.01;
        let estimatedSleeveLength = 66 + (height - 170) * 0.1;
        let estimatedNeckCircumference = 82 + (height - 170) * 0.05 + (weight - 70) * 0.02;
        let estimatedShirtLength = 75 + (height - 170) * 0.1;
        
        // Adjust based on body type
        switch (bodyType) {
            case 'slim':
                estimatedChestHalf -= 2;
                estimatedShoulderWidth -= 0.5;
                estimatedNeckCircumference -= 2;
                estimatedSleeveLength -= 1;
                break;
            case 'athletic':
                estimatedChestHalf += 2;
                estimatedShoulderWidth += 0.5;
                estimatedNeckCircumference += 2;
                estimatedSleeveLength += 1;
                break;
            case 'plus':
                estimatedChestHalf += 4;
                estimatedShoulderWidth += 1;
                estimatedNeckCircumference += 4;
                estimatedSleeveLength += 2;
                break;
        }
        
        // Find best match for estimated measurements
        let minDifference = Infinity;
        for (const [size, chestShoulderData] of Object.entries(longSleeveSizeChart.chestShoulder)) {
            const sleeveNeckData = longSleeveSizeChart.sleeveNeckLength[size];
            
            const chestDiff = Math.abs(estimatedChestHalf - chestShoulderData.chestHalf);
            const shoulderDiff = Math.abs(estimatedShoulderWidth - chestShoulderData.shoulderWidth);
            const sleeveDiff = Math.abs(estimatedSleeveLength - sleeveNeckData.sleeveLength);
            const neckDiff = Math.abs(estimatedNeckCircumference - sleeveNeckData.neckCircumference);
            const lengthDiff = Math.abs(estimatedShirtLength - sleeveNeckData.shirtLength);
            
            // Weighted scoring: chest and shoulder are most important
            const totalDiff = chestDiff * 0.3 + shoulderDiff * 0.3 + sleeveDiff * 0.2 + neckDiff * 0.1 + lengthDiff * 0.1;
            
            if (totalDiff < minDifference) {
                minDifference = totalDiff;
                predictedSize = size;
            }
        }
        
        confidence = Math.max(50, 80 - minDifference * 3);
        recommendations.push('Size prediction based on estimated measurements');
        recommendations.push('For more accurate results, please provide your detailed measurements');
    }
    
    // Add general recommendations
    if (confidence < 80) {
        recommendations.push('Consider trying on multiple sizes for the best fit');
    }
    
    recommendations.push('Long sleeve shirts should have comfortable arm movement');
    
    return {
        success: true,
        predictedSize: {
            size: predictedSize,
            confidence: Math.round(confidence),
            measurements: measurements,
            estimatedMeasurements: estimatedMeasurements,
            recommendations: recommendations
        }
    };
}

// Predict hooded jacket size based on measurements
function predictHoodedJacketSize(data) {
    const { measurements, height, weight, bodyType } = data;
    
    // Initialize result
    let predictedSize = 'M'; // Default size
    let confidence = 70; // Default confidence
    let recommendations = [];
    let estimatedMeasurements = false;
    
    // If measurements are provided, use them for prediction
    if (measurements.chestHalf && measurements.shoulderWidth && measurements.sleeveLength && measurements.neckCircumference && measurements.shirtLength) {
        // Find best matching size based on all 5 measurements
        let bestMatch = null;
        let minDifference = Infinity;
        
        for (const [size, chestShoulderData] of Object.entries(hoodedJacketSizeChart.chestShoulder)) {
            const sleeveNeckData = hoodedJacketSizeChart.sleeveNeckLength[size];
            
            const chestDiff = Math.abs(measurements.chestHalf - chestShoulderData.chestHalf);
            const shoulderDiff = Math.abs(measurements.shoulderWidth - chestShoulderData.shoulderWidth);
            const sleeveDiff = Math.abs(measurements.sleeveLength - sleeveNeckData.sleeveLength);
            const neckDiff = Math.abs(measurements.neckCircumference - sleeveNeckData.neckCircumference);
            const lengthDiff = Math.abs(measurements.shirtLength - sleeveNeckData.shirtLength);
            
            // Weighted scoring: chest and shoulder are most important
            const totalDiff = chestDiff * 0.3 + shoulderDiff * 0.3 + sleeveDiff * 0.2 + neckDiff * 0.1 + lengthDiff * 0.1;
            
            if (totalDiff < minDifference) {
                minDifference = totalDiff;
                bestMatch = size;
            }
        }
        
        if (bestMatch) {
            predictedSize = bestMatch;
            confidence = Math.max(70, 100 - minDifference * 2); // Higher confidence for closer matches
        }
        
        // Check if shoulder length and total length match
        const lengthMatch = Object.entries(hoodedJacketSizeChart.lengthShoulder).find(([key, data]) => {
            return Math.abs(measurements.totalLength - data.totalLength) <= 2 &&
                   Math.abs(measurements.shoulderLength - data.shoulderLength) <= 1;
        });
        
        if (lengthMatch) {
            confidence += 10; // Bonus confidence for length match
            recommendations.push(`Length measurements match well with size ${predictedSize}`);
        } else {
            recommendations.push('Consider length adjustments for better fit');
        }
        
        recommendations.push('Measurements provided - high accuracy prediction');
        
    } else {
        // Estimate measurements based on height, weight, and body type
        estimatedMeasurements = true;
        
        // Simple estimation based on height and weight
        let estimatedChestHalf = 59 + (height - 170) * 0.1 + (weight - 70) * 0.05;
        let estimatedShoulderWidth = 15 + (height - 170) * 0.02 + (weight - 70) * 0.01;
        let estimatedSleeveLength = 67 + (height - 170) * 0.1;
        let estimatedNeckCircumference = 48 + (height - 170) * 0.05 + (weight - 70) * 0.02;
        let estimatedShirtLength = 72 + (height - 170) * 0.1;
        
        // Adjust based on body type
        switch (bodyType) {
            case 'slim':
                estimatedChestHalf -= 2;
                estimatedShoulderWidth -= 0.5;
                estimatedNeckCircumference -= 2;
                estimatedSleeveLength -= 1;
                break;
            case 'athletic':
                estimatedChestHalf += 2;
                estimatedShoulderWidth += 0.5;
                estimatedNeckCircumference += 2;
                estimatedSleeveLength += 1;
                break;
            case 'plus':
                estimatedChestHalf += 4;
                estimatedShoulderWidth += 1;
                estimatedNeckCircumference += 4;
                estimatedSleeveLength += 2;
                break;
        }
        
        // Find best match for estimated measurements
        let minDifference = Infinity;
        for (const [size, chestShoulderData] of Object.entries(hoodedJacketSizeChart.chestShoulder)) {
            const sleeveNeckData = hoodedJacketSizeChart.sleeveNeckLength[size];
            
            const chestDiff = Math.abs(estimatedChestHalf - chestShoulderData.chestHalf);
            const shoulderDiff = Math.abs(estimatedShoulderWidth - chestShoulderData.shoulderWidth);
            const sleeveDiff = Math.abs(estimatedSleeveLength - sleeveNeckData.sleeveLength);
            const neckDiff = Math.abs(estimatedNeckCircumference - sleeveNeckData.neckCircumference);
            const lengthDiff = Math.abs(estimatedShirtLength - sleeveNeckData.shirtLength);
            
            // Weighted scoring: chest and shoulder are most important
            const totalDiff = chestDiff * 0.3 + shoulderDiff * 0.3 + sleeveDiff * 0.2 + neckDiff * 0.1 + lengthDiff * 0.1;
            
            if (totalDiff < minDifference) {
                minDifference = totalDiff;
                predictedSize = size;
            }
        }
        
        confidence = Math.max(50, 80 - minDifference * 3);
        recommendations.push('Size prediction based on estimated measurements');
        recommendations.push('For more accurate results, please provide your detailed measurements');
    }
    
    // Add general recommendations
    if (confidence < 80) {
        recommendations.push('Consider trying on multiple sizes for the best fit');
    }
    
    recommendations.push('Hooded jackets should have room for layering underneath');
    
    return {
        success: true,
        predictedSize: {
            size: predictedSize,
            confidence: Math.round(confidence),
            measurements: measurements,
            estimatedMeasurements: estimatedMeasurements,
            recommendations: recommendations
        }
    };
}

// Predict polar overshirt size based on measurements
function predictPolarOvershirtSize(data) {
    const { measurements, height, weight, bodyType } = data;
    
    // Initialize result
    let predictedSize = 'M'; // Default size
    let confidence = 70; // Default confidence
    let recommendations = [];
    let estimatedMeasurements = false;
    
    // If measurements are provided, use them for prediction
    if (measurements.chestHalf && measurements.shoulderWidth && measurements.sleeveLength && measurements.neckCircumference && measurements.shirtLength) {
        // Find best matching size based on all 5 measurements
        let bestMatch = null;
        let minDifference = Infinity;
        
        for (const [size, chestShoulderData] of Object.entries(polarOvershirtSizeChart.chestShoulder)) {
            const sleeveNeckData = polarOvershirtSizeChart.sleeveNeckLength[size];
            
            const chestDiff = Math.abs(measurements.chestHalf - chestShoulderData.chestHalf);
            const shoulderDiff = Math.abs(measurements.shoulderWidth - chestShoulderData.shoulderWidth);
            const sleeveDiff = Math.abs(measurements.sleeveLength - sleeveNeckData.sleeveLength);
            const neckDiff = Math.abs(measurements.neckCircumference - sleeveNeckData.neckCircumference);
            const lengthDiff = Math.abs(measurements.shirtLength - sleeveNeckData.shirtLength);
            
            // Weighted scoring: chest and shoulder are most important
            const totalDiff = chestDiff * 0.3 + shoulderDiff * 0.3 + sleeveDiff * 0.2 + neckDiff * 0.1 + lengthDiff * 0.1;
            
            if (totalDiff < minDifference) {
                minDifference = totalDiff;
                bestMatch = size;
            }
        }
        
        if (bestMatch) {
            predictedSize = bestMatch;
            // Calculate confidence based on how well measurements match
            confidence = Math.max(70, Math.min(95, 70 + bestScore * 2));
        }
        
        // Check if measurements are very close to the predicted size
        const predictedChestData = polarOvershirtSizeChart.chestShoulder[predictedSize];
        const predictedSleeveData = polarOvershirtSizeChart.sleeveNeckLength[predictedSize];
        
        if (predictedChestData && predictedSleeveData) {
            const chestMatch = Math.abs(measurements.chestHalf - predictedChestData.chestHalf) <= 1;
            const shoulderMatch = Math.abs(measurements.shoulderWidth - predictedChestData.shoulderWidth) <= 0.5;
            const sleeveMatch = Math.abs(measurements.sleeveLength - predictedSleeveData.sleeveLength) <= 1;
            const neckMatch = Math.abs(measurements.neckCircumference - predictedSleeveData.neckCircumference) <= 2;
            const lengthMatch = Math.abs(measurements.shirtLength - predictedSleeveData.shirtLength) <= 1;
            
            const matchCount = [chestMatch, shoulderMatch, sleeveMatch, neckMatch, lengthMatch].filter(Boolean).length;
            
            if (matchCount >= 4) {
                confidence = 95;
                recommendations.push('Excellent measurement match with predicted size');
            } else if (matchCount >= 3) {
                confidence = 85;
                recommendations.push('Good measurement match with predicted size');
            } else {
                recommendations.push('Consider adjustments for better fit');
            }
        }
        
        recommendations.push('Measurements provided - high accuracy prediction');
        
    } else {
        // Estimate measurements based on height, weight, and body type
        estimatedMeasurements = true;
        
        // Improved estimation based on height and weight
        let estimatedChestHalf = 58 + (height - 170) * 0.1 + (weight - 70) * 0.05;
        let estimatedShoulderWidth = 15 + (height - 170) * 0.02 + (weight - 70) * 0.01;
        let estimatedSleeveLength = 66 + (height - 170) * 0.1;
        let estimatedNeckCircumference = 38 + (height - 170) * 0.05 + (weight - 70) * 0.02;
        let estimatedShirtLength = 73 + (height - 170) * 0.1;
        
        // Adjust based on body type
        switch (bodyType) {
            case 'slim':
                estimatedChestHalf -= 2;
                estimatedShoulderWidth -= 0.5;
                estimatedNeckCircumference -= 2;
                estimatedSleeveLength -= 1;
                break;
            case 'athletic':
                estimatedChestHalf += 2;
                estimatedShoulderWidth += 0.5;
                estimatedNeckCircumference += 2;
                estimatedSleeveLength += 1;
                break;
            case 'plus':
                estimatedChestHalf += 4;
                estimatedShoulderWidth += 1;
                estimatedNeckCircumference += 4;
                estimatedSleeveLength += 2;
                break;
        }
        
        // Find best match for estimated measurements
        let minDifference = Infinity;
        for (const [size, chestShoulderData] of Object.entries(polarOvershirtSizeChart.chestShoulder)) {
            const sleeveNeckData = polarOvershirtSizeChart.sleeveNeckLength[size];
            
            const chestDiff = Math.abs(estimatedChestHalf - chestShoulderData.chestHalf);
            const shoulderDiff = Math.abs(estimatedShoulderWidth - chestShoulderData.shoulderWidth);
            const sleeveDiff = Math.abs(estimatedSleeveLength - sleeveNeckData.sleeveLength);
            const neckDiff = Math.abs(estimatedNeckCircumference - sleeveNeckData.neckCircumference);
            const lengthDiff = Math.abs(estimatedShirtLength - sleeveNeckData.shirtLength);
            
            // Weighted scoring: chest and shoulder are most important
            const totalDiff = chestDiff * 0.3 + shoulderDiff * 0.3 + sleeveDiff * 0.2 + neckDiff * 0.1 + lengthDiff * 0.1;
            
            if (totalDiff < minDifference) {
                minDifference = totalDiff;
                predictedSize = size;
            }
        }
        
        confidence = Math.max(50, Math.min(75, 50 + bestScore * 3));
        recommendations.push('Size prediction based on estimated measurements');
        recommendations.push('For more accurate results, please provide your detailed measurements');
    }
    
    // Add general recommendations
    if (confidence < 80) {
        recommendations.push('Consider trying on multiple sizes for the best fit');
    }
    
    recommendations.push('Polar overshirts work well as layering pieces');
    
    return {
        success: true,
        predictedSize: {
            size: predictedSize,
            confidence: Math.round(confidence),
            measurements: measurements,
            estimatedMeasurements: estimatedMeasurements,
            recommendations: recommendations
        }
    };
}

// Predict pants size based on measurements
function predictPantsSize(data) {
    const { measurements, height, weight, bodyType } = data;
    
    // Initialize result
    let predictedSize = 'M'; // Default size
    let confidence = 70; // Default confidence
    let recommendations = [];
    let estimatedMeasurements = false;
    
    // Pants size chart data
    const pantsSizeChart = {
        'S': { waist: 37, bottom: 15.5, length: 99 }, // Size 36
        'M': { waist: 39, bottom: 16, length: 100.5 }, // Size 38
        'L': { waist: 41, bottom: 16.5, length: 102 }, // Size 40
        'XL': { waist: 43, bottom: 17, length: 103.5 }, // Size 42
        'XXL': { waist: 45, bottom: 17.5, length: 105 } // Size 44
    };
    
    // If measurements are provided, use them for prediction
    if (measurements.waist || measurements.bottom || measurements.length) {
        // Find best matching size based on available measurements
        let bestMatch = null;
        let minDifference = Infinity;
        
        for (const [size, sizeData] of Object.entries(pantsSizeChart)) {
            let totalDiff = 0;
            let measurementCount = 0;
            let weightedDiff = 0;
            
            // Compare measurements with different weights for accuracy
            if (measurements.length && sizeData.length) {
                const lengthDiff = Math.abs(sizeData.length - measurements.length);
                totalDiff += lengthDiff;
                weightedDiff += lengthDiff * 0.3; // Length has 30% weight
                measurementCount++;
            }
            
            if (measurements.waist && sizeData.waist) {
                const waistDiff = Math.abs(sizeData.waist - measurements.waist);
                totalDiff += waistDiff;
                weightedDiff += waistDiff * 0.4; // Waist has 40% weight (most important)
                measurementCount++;
            }
            
            if (measurements.bottom && sizeData.bottom) {
                const bottomDiff = Math.abs(sizeData.bottom - measurements.bottom);
                totalDiff += bottomDiff;
                weightedDiff += bottomDiff * 0.3; // Bottom has 30% weight
                measurementCount++;
            }
            
            // Use weighted average for better accuracy
            if (measurementCount > 0) {
                const avgDiff = weightedDiff / measurementCount;
                if (avgDiff < minDifference) {
                    minDifference = avgDiff;
                    bestMatch = size;
                }
            }
        }
        
        if (bestMatch) {
            predictedSize = bestMatch;
            confidence = Math.max(70, 100 - minDifference * 2); // Higher confidence for closer matches
        }
        
        // Adjust for body type
        if (bodyType === 'slim') {
            if (predictedSize === 'M') predictedSize = 'S';
            else if (predictedSize === 'L') predictedSize = 'M';
            else if (predictedSize === 'XL') predictedSize = 'L';
            else if (predictedSize === 'XXL') predictedSize = 'XL';
        } else if (bodyType === 'athletic') {
            if (predictedSize === 'S') predictedSize = 'M';
            else if (predictedSize === 'M') predictedSize = 'L';
            else if (predictedSize === 'L') predictedSize = 'XL';
            else if (predictedSize === 'XL') predictedSize = 'XXL';
        } else if (bodyType === 'plus') {
            if (predictedSize === 'S') predictedSize = 'M';
            else if (predictedSize === 'M') predictedSize = 'L';
            else if (predictedSize === 'L') predictedSize = 'XL';
            else if (predictedSize === 'XL') predictedSize = 'XXL';
        }
        
        recommendations.push('Measurements provided - high accuracy prediction');
        
    } else {
        // Estimate measurements based on height, weight, and body type
        estimatedMeasurements = true;
        
        // Simple estimation based on height and weight
        let estimatedWaist = 41 + (height - 170) * 0.1 + (weight - 70) * 0.05; // Waist 1/2 in cm
        let estimatedBottom = 16 + (height - 170) * 0.1 + (weight - 70) * 0.05; // Bottom 1/2 in cm
        let estimatedLength = 100.5 + (height - 170) * 0.1;
        
        // Adjust based on body type
        switch (bodyType) {
            case 'slim':
                estimatedWaist -= 2;
                estimatedBottom -= 1;
                break;
            case 'athletic':
                estimatedWaist -= 1;
                estimatedBottom += 0.5;
                break;
            case 'plus':
                estimatedWaist += 4;
                estimatedBottom += 2;
                break;
        }
        
        // Find best match for estimated measurements
        let minDifference = Infinity;
        for (const [size, sizeData] of Object.entries(pantsSizeChart)) {
            const waistDiff = Math.abs(estimatedWaist - sizeData.waist);
            const bottomDiff = Math.abs(estimatedBottom - sizeData.bottom);
            const lengthDiff = Math.abs(estimatedLength - sizeData.length);
            const totalDiff = waistDiff * 0.4 + bottomDiff * 0.3 + lengthDiff * 0.3;
            
            if (totalDiff < minDifference) {
                minDifference = totalDiff;
                predictedSize = size;
            }
        }
        
        confidence = Math.max(50, 80 - minDifference * 3);
        recommendations.push('Size prediction based on estimated measurements');
        recommendations.push('For more accurate results, please provide your detailed measurements');
    }
    
    // Add general recommendations
    if (confidence < 80) {
        recommendations.push('Consider trying on multiple sizes for the best fit');
    }
    
    recommendations.push('Pants should fit comfortably at the waist without being too tight');
    
    return {
        success: true,
        predictedSize: {
            size: predictedSize,
            confidence: Math.round(confidence),
            measurements: measurements,
            estimatedMeasurements: estimatedMeasurements,
            recommendations: recommendations
        }
    };
}

// Display results
function displayResults(result, formData) {
    // Update garment display
    const selectedGarment = garmentTypes[formData.garmentType];
    if (selectedGarment) {
        garmentIcon.className = selectedGarment.icon;
        resultGarmentName.textContent = selectedGarment.name;
        resultGarmentReference.textContent = selectedGarment.reference;
    }
    
    // Update result display
    predictedSizeEl.textContent = result.predictedSize.size;
    confidencePercentEl.textContent = `${result.predictedSize.confidence}%`;
    confidenceFillEl.style.width = `${result.predictedSize.confidence}%`;
    
    // Update measurements display based on garment type
    displayHeightEl.textContent = `${formData.height} cm`;
    displayWeightEl.textContent = `${formData.weight} kg`;
    
    // Update measurement labels based on garment type
    const chestLabel = document.getElementById('chestLabel');
    const waistLabel = document.getElementById('waistLabel');
    const bottomLabel = document.getElementById('bottomLabel');
    const shoulderLabel = document.getElementById('shoulderLabel');
    const lengthLabel = document.getElementById('lengthLabel');
    
    if (formData.garmentType === 'pants') {
        chestLabel.textContent = 'Waist 1/2';
        waistLabel.textContent = 'Bottom 1/2';
        bottomLabel.textContent = 'N/A';
        shoulderLabel.textContent = 'N/A';
        lengthLabel.textContent = 'Length';
    } else {
        chestLabel.textContent = 'Half-chest';
        waistLabel.textContent = 'Shoulder Width';
        bottomLabel.textContent = 'Sleeve Length';
        shoulderLabel.textContent = 'Neck Circumference';
        lengthLabel.textContent = 'Shirt Length';
    }
    
    if (formData.garmentType === 'pants') {
        displayChestHalfEl.textContent = result.predictedSize.measurements.waist ? `${result.predictedSize.measurements.waist} cm` : 'Not provided';
        displayWaistHalfEl.textContent = result.predictedSize.measurements.bottom ? `${result.predictedSize.measurements.bottom} cm` : 'Not provided';
        displayBottomHalfEl.textContent = 'N/A';
        displayShoulderLengthEl.textContent = 'N/A';
        displayTotalLengthEl.textContent = result.predictedSize.measurements.length ? `${result.predictedSize.measurements.length} cm` : 'Not provided';
    } else if (formData.garmentType === 'short-sleeves') {
        displayChestHalfEl.textContent = result.predictedSize.measurements.chestHalf ? `${result.predictedSize.measurements.chestHalf} cm` : 'Not provided';
        displayWaistHalfEl.textContent = result.predictedSize.measurements.shoulderWidth ? `${result.predictedSize.measurements.shoulderWidth} cm` : 'Not provided';
        displayBottomHalfEl.textContent = result.predictedSize.measurements.sleeveLength ? `${result.predictedSize.measurements.sleeveLength} cm` : 'Not provided';
        displayShoulderLengthEl.textContent = result.predictedSize.measurements.neckCircumference ? `${result.predictedSize.measurements.neckCircumference} cm` : 'Not provided';
        displayTotalLengthEl.textContent = result.predictedSize.measurements.shirtLength ? `${result.predictedSize.measurements.shirtLength} cm` : 'Not provided';
    } else if (formData.garmentType === 'jagvi-shirt') {
        displayChestHalfEl.textContent = result.predictedSize.measurements.chestHalf ? `${result.predictedSize.measurements.chestHalf} cm` : 'Not provided';
        displayWaistHalfEl.textContent = result.predictedSize.measurements.shoulderWidth ? `${result.predictedSize.measurements.shoulderWidth} cm` : 'Not provided';
        displayBottomHalfEl.textContent = result.predictedSize.measurements.sleeveLength ? `${result.predictedSize.measurements.sleeveLength} cm` : 'Not provided';
        displayShoulderLengthEl.textContent = result.predictedSize.measurements.neckCircumference ? `${result.predictedSize.measurements.neckCircumference} cm` : 'Not provided';
        displayTotalLengthEl.textContent = result.predictedSize.measurements.shirtLength ? `${result.predictedSize.measurements.shirtLength} cm` : 'Not provided';
    } else if (formData.garmentType === 'hooded-jacket') {
        displayChestHalfEl.textContent = result.predictedSize.measurements.chestHalf ? `${result.predictedSize.measurements.chestHalf} cm` : 'Not provided';
        displayWaistHalfEl.textContent = result.predictedSize.measurements.shoulderWidth ? `${result.predictedSize.measurements.shoulderWidth} cm` : 'Not provided';
        displayBottomHalfEl.textContent = result.predictedSize.measurements.sleeveLength ? `${result.predictedSize.measurements.sleeveLength} cm` : 'Not provided';
        displayShoulderLengthEl.textContent = result.predictedSize.measurements.neckCircumference ? `${result.predictedSize.measurements.neckCircumference} cm` : 'Not provided';
        displayTotalLengthEl.textContent = result.predictedSize.measurements.shirtLength ? `${result.predictedSize.measurements.shirtLength} cm` : 'Not provided';
    } else if (formData.garmentType === 'polar-overshirt') {
        displayChestHalfEl.textContent = result.predictedSize.measurements.chestHalf ? `${result.predictedSize.measurements.chestHalf} cm` : 'Not provided';
        displayWaistHalfEl.textContent = result.predictedSize.measurements.shoulderWidth ? `${result.predictedSize.measurements.shoulderWidth} cm` : 'Not provided';
        displayBottomHalfEl.textContent = result.predictedSize.measurements.sleeveLength ? `${result.predictedSize.measurements.sleeveLength} cm` : 'Not provided';
        displayShoulderLengthEl.textContent = result.predictedSize.measurements.neckCircumference ? `${result.predictedSize.measurements.neckCircumference} cm` : 'Not provided';
        displayTotalLengthEl.textContent = result.predictedSize.measurements.shirtLength ? `${result.predictedSize.measurements.shirtLength} cm` : 'Not provided';
    } else {
        displayChestHalfEl.textContent = result.predictedSize.measurements.chest ? `${result.predictedSize.measurements.chest}"` : 'Not provided';
        displayWaistHalfEl.textContent = result.predictedSize.measurements.waist ? `${result.predictedSize.measurements.waist}"` : 'Not provided';
        displayShoulderLengthEl.textContent = 'N/A';
        displayTotalLengthEl.textContent = 'N/A';
    }
    
    // Update recommendations
    updateRecommendations(result.predictedSize.recommendations, result.predictedSize.estimatedMeasurements);
    
    // Show results and hide form
    formContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    
    // Smooth scroll to results
    resultContainer.scrollIntoView({ behavior: 'smooth' });
    
    // Animate confidence bar
    setTimeout(() => {
        confidenceFillEl.style.transition = 'width 1s ease-out';
    }, 100);
}

// Update recommendations list
function updateRecommendations(recommendations, estimatedMeasurements) {
    recommendationsListEl.innerHTML = '';
    
    // Add estimated measurements notice if applicable
    if (estimatedMeasurements) {
        const estimatedLi = document.createElement('li');
        estimatedLi.innerHTML = '<strong>📏 Estimated Measurements:</strong> Size prediction based on your basic information. For more accurate results, please provide your detailed measurements.';
        estimatedLi.style.background = '#e6f3ff';
        estimatedLi.style.borderLeftColor = '#0066cc';
        estimatedLi.style.color = '#003366';
        recommendationsListEl.appendChild(estimatedLi);
    }
    
    if (recommendations && recommendations.length > 0) {
        recommendations.forEach(recommendation => {
            const li = document.createElement('li');
            li.textContent = recommendation;
            recommendationsListEl.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = 'Consider trying on multiple sizes for the best fit';
        recommendationsListEl.appendChild(li);
    }
}

// Show error message
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

// Reset button handler
resetBtn.addEventListener('click', () => {
    // Reset form
    sizeForm.reset();
    
    // Hide garment info and measurement sections
    garmentInfo.classList.add('hidden');
    shirtMeasurements.classList.add('hidden');
    pantsMeasurements.classList.add('hidden');
    
    // Hide results and show form
    resultContainer.classList.add('hidden');
    formContainer.classList.remove('hidden');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Form validation and real-time feedback
const formInputs = sizeForm.querySelectorAll('input, select');

formInputs.forEach(input => {
    input.addEventListener('blur', validateField);
    input.addEventListener('input', clearFieldError);
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
`;
document.head.appendChild(errorStyles);

// Auto-resize iframe for better integration
function resizeIframe() {
    if (window.parent && window.parent !== window) {
        const height = document.documentElement.scrollHeight;
        window.parent.postMessage({
            type: 'resize',
            height: height
        }, '*');
    }
}

// Call resize on load and after content changes
window.addEventListener('load', resizeIframe);
window.addEventListener('resize', resizeIframe);

// Resize after form submission
const originalDisplayResults = displayResults;
displayResults = function(result, formData) {
    originalDisplayResults(result, formData);
    setTimeout(resizeIframe, 500); // Wait for animations
};

// Add some interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to form sections
    const formSections = document.querySelectorAll('.form-section');
    formSections.forEach(section => {
        section.addEventListener('mouseenter', () => {
            section.style.transform = 'translateY(-2px)';
            section.style.transition = 'transform 0.2s ease';
        });
        
        section.addEventListener('mouseleave', () => {
            section.style.transform = 'translateY(0)';
        });
    });
    
    // Add focus indicators for accessibility
    const focusableElements = document.querySelectorAll('input, select, button');
    focusableElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.style.outline = '2px solid #667eea';
            element.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', () => {
            element.style.outline = '';
            element.style.outlineOffset = '';
        });
    });
});

// Performance optimization: Debounce resize events
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeIframe, 250);
}); 