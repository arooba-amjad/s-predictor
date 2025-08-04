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
    // Chest 1/2 and Waist 1/2 measurements (in cm)
    chestWaist: {
        'XS': { chestHalf: 52, waistHalf: 49 },
        'S': { chestHalf: 54, waistHalf: 51 },
        'M': { chestHalf: 56, waistHalf: 53 },
        'L': { chestHalf: 58, waistHalf: 55 },
        'XL': { chestHalf: 60, waistHalf: 57 },
        'XXL': { chestHalf: 62, waistHalf: 59 }
    },
    // Total Length and Shoulder Length measurements (in cm)
    lengthShoulder: {
        '70': { totalLength: 70, shoulderLength: 12.5 },
        '71': { totalLength: 71, shoulderLength: 13.25 },
        '72': { totalLength: 72, shoulderLength: 14 },
        '73': { totalLength: 73, shoulderLength: 14.75 },
        '74': { totalLength: 74, shoulderLength: 15.5 },
        '75': { totalLength: 75, shoulderLength: 16.25 }
    }
};

// Size chart data for long sleeve shirts
const longSleeveSizeChart = {
    // Chest 1/2, Waist 1/2, and Bottom 1/2 measurements (in cm)
    chestWaistBottom: {
        'XS': { chestHalf: 51, waistHalf: 47, bottomHalf: 50 },
        'S': { chestHalf: 53, waistHalf: 49, bottomHalf: 52 },
        'M': { chestHalf: 55, waistHalf: 51, bottomHalf: 54 },
        'L': { chestHalf: 57, waistHalf: 53, bottomHalf: 56 },
        'XL': { chestHalf: 59, waistHalf: 55, bottomHalf: 58 },
        'XXL': { chestHalf: 61, waistHalf: 57, bottomHalf: 60 }
    },
    // Total Length and Shoulder Length measurements (in cm)
    lengthShoulder: {
        'XS': { totalLength: 73, shoulderLength: 13.5 },
        'S': { totalLength: 74, shoulderLength: 14 },
        'M': { totalLength: 75, shoulderLength: 14.5 },
        'L': { totalLength: 76, shoulderLength: 15 },
        'XL': { totalLength: 77, shoulderLength: 15.5 },
        'XXL': { totalLength: 78, shoulderLength: 16 }
    }
};

// Size chart data for hooded jackets
const hoodedJacketSizeChart = {
    // Chest 1/2, Waist 1/2, and Bottom 1/2 measurements (in cm)
    chestWaistBottom: {
        'S': { chestHalf: 59, waistHalf: 56, bottomHalf: 55 },
        'M': { chestHalf: 59, waistHalf: 56, bottomHalf: 55 },
        'L': { chestHalf: 59, waistHalf: 56, bottomHalf: 55 },
        'XL': { chestHalf: 59, waistHalf: 56, bottomHalf: 55 },
        'XXL': { chestHalf: 59, waistHalf: 56, bottomHalf: 55 }
    },
    // Total Length and Shoulder Length measurements (in cm)
    lengthShoulder: {
        'S': { totalLength: 72, shoulderLength: 15 },
        'M': { totalLength: 72, shoulderLength: 15 },
        'L': { totalLength: 72, shoulderLength: 15 },
        'XL': { totalLength: 72, shoulderLength: 15 },
        'XXL': { totalLength: 72, shoulderLength: 15 }
    }
};

// Size chart data for polar overshirts
const polarOvershirtSizeChart = {
    // Chest 1/2, Waist 1/2, and Bottom 1/2 measurements (in cm)
    chestWaistBottom: {
        'XS': { chestHalf: 54, waistHalf: 52, bottomHalf: 53 },
        'S': { chestHalf: 56, waistHalf: 54, bottomHalf: 55 },
        'M': { chestHalf: 58, waistHalf: 56, bottomHalf: 57 },
        'L': { chestHalf: 60, waistHalf: 58, bottomHalf: 59 },
        'XL': { chestHalf: 62, waistHalf: 60, bottomHalf: 61 },
        'XXL': { chestHalf: 64, waistHalf: 62, bottomHalf: 63 }
    },
    // Total Length and Shoulder Length measurements (in cm)
    lengthShoulder: {
        'XS': { totalLength: 71, shoulderLength: 14 },
        'S': { totalLength: 72, shoulderLength: 14.5 },
        'M': { totalLength: 73, shoulderLength: 15 },
        'L': { totalLength: 74, shoulderLength: 15.5 },
        'XL': { totalLength: 75, shoulderLength: 16 },
        'XXL': { totalLength: 76, shoulderLength: 16.5 }
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
                hip: parseFloat(formData.get('pantsHip')) || null,
                length: parseFloat(formData.get('pantsLength')) || null
            };
        } else {
            // Shirt/Jacket measurements (in cm)
            measurements = {
                chestHalf: parseFloat(formData.get('chestHalf')) || null,
                waistHalf: parseFloat(formData.get('waistHalf')) || null,
                bottomHalf: parseFloat(formData.get('bottomHalf')) || null,
                shoulderLength: parseFloat(formData.get('shoulderLength')) || null,
                totalLength: parseFloat(formData.get('totalLength')) || null
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
    if (measurements.chestHalf && measurements.waistHalf && measurements.shoulderLength && measurements.totalLength) {
        // Find best matching size based on chest and waist measurements
        let bestMatch = null;
        let minDifference = Infinity;
        
        for (const [size, sizeData] of Object.entries(shortSleeveSizeChart.chestWaist)) {
            const chestDiff = Math.abs(measurements.chestHalf - sizeData.chestHalf);
            const waistDiff = Math.abs(measurements.waistHalf - sizeData.waistHalf);
            const totalDiff = chestDiff + waistDiff;
            
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
        const lengthMatch = Object.entries(shortSleeveSizeChart.lengthShoulder).find(([key, data]) => {
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
        let estimatedChestHalf = 52 + (height - 160) * 0.2 + (weight - 60) * 0.1;
        let estimatedWaistHalf = 49 + (height - 160) * 0.15 + (weight - 60) * 0.08;
        
        // Adjust based on body type
        switch (bodyType) {
            case 'slim':
                estimatedChestHalf -= 2;
                estimatedWaistHalf -= 2;
                break;
            case 'athletic':
                estimatedChestHalf += 2;
                estimatedWaistHalf -= 1;
                break;
            case 'plus':
                estimatedChestHalf += 4;
                estimatedWaistHalf += 3;
                break;
        }
        
        // Find best match for estimated measurements
        let minDifference = Infinity;
        for (const [size, sizeData] of Object.entries(shortSleeveSizeChart.chestWaist)) {
            const chestDiff = Math.abs(estimatedChestHalf - sizeData.chestHalf);
            const waistDiff = Math.abs(estimatedWaistHalf - sizeData.waistHalf);
            const totalDiff = chestDiff + waistDiff;
            
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
    if (measurements.chestHalf && measurements.waistHalf && measurements.bottomHalf && measurements.shoulderLength && measurements.totalLength) {
        // Find best matching size based on chest, waist, and bottom measurements
        let bestMatch = null;
        let minDifference = Infinity;
        
        for (const [size, sizeData] of Object.entries(longSleeveSizeChart.chestWaistBottom)) {
            const chestDiff = Math.abs(measurements.chestHalf - sizeData.chestHalf);
            const waistDiff = Math.abs(measurements.waistHalf - sizeData.waistHalf);
            const bottomDiff = Math.abs(measurements.bottomHalf - sizeData.bottomHalf);
            const totalDiff = chestDiff + waistDiff + bottomDiff;
            
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
        const lengthMatch = Object.entries(longSleeveSizeChart.lengthShoulder).find(([key, data]) => {
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
        let estimatedChestHalf = 51 + (height - 160) * 0.2 + (weight - 60) * 0.1;
        let estimatedWaistHalf = 47 + (height - 160) * 0.15 + (weight - 60) * 0.08;
        let estimatedBottomHalf = 50 + (height - 160) * 0.18 + (weight - 60) * 0.09;
        
        // Adjust based on body type
        switch (bodyType) {
            case 'slim':
                estimatedChestHalf -= 2;
                estimatedWaistHalf -= 2;
                estimatedBottomHalf -= 2;
                break;
            case 'athletic':
                estimatedChestHalf += 2;
                estimatedWaistHalf -= 1;
                estimatedBottomHalf += 1;
                break;
            case 'plus':
                estimatedChestHalf += 4;
                estimatedWaistHalf += 3;
                estimatedBottomHalf += 3;
                break;
        }
        
        // Find best match for estimated measurements
        let minDifference = Infinity;
        for (const [size, sizeData] of Object.entries(longSleeveSizeChart.chestWaistBottom)) {
            const chestDiff = Math.abs(estimatedChestHalf - sizeData.chestHalf);
            const waistDiff = Math.abs(estimatedWaistHalf - sizeData.waistHalf);
            const bottomDiff = Math.abs(estimatedBottomHalf - sizeData.bottomHalf);
            const totalDiff = chestDiff + waistDiff + bottomDiff;
            
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
    if (measurements.chestHalf && measurements.waistHalf && measurements.bottomHalf && measurements.shoulderLength && measurements.totalLength) {
        // Find best matching size based on chest, waist, and bottom measurements
        let bestMatch = null;
        let minDifference = Infinity;
        
        for (const [size, sizeData] of Object.entries(hoodedJacketSizeChart.chestWaistBottom)) {
            const chestDiff = Math.abs(measurements.chestHalf - sizeData.chestHalf);
            const waistDiff = Math.abs(measurements.waistHalf - sizeData.waistHalf);
            const bottomDiff = Math.abs(measurements.bottomHalf - sizeData.bottomHalf);
            const totalDiff = chestDiff + waistDiff + bottomDiff;
            
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
        let estimatedWaistHalf = 56 + (height - 170) * 0.08 + (weight - 70) * 0.04;
        let estimatedBottomHalf = 55 + (height - 170) * 0.09 + (weight - 70) * 0.04;
        
        // Adjust based on body type
        switch (bodyType) {
            case 'slim':
                estimatedChestHalf -= 2;
                estimatedWaistHalf -= 2;
                estimatedBottomHalf -= 2;
                break;
            case 'athletic':
                estimatedChestHalf += 2;
                estimatedWaistHalf -= 1;
                estimatedBottomHalf += 1;
                break;
            case 'plus':
                estimatedChestHalf += 4;
                estimatedWaistHalf += 3;
                estimatedBottomHalf += 3;
                break;
        }
        
        // Find best match for estimated measurements
        let minDifference = Infinity;
        for (const [size, sizeData] of Object.entries(hoodedJacketSizeChart.chestWaistBottom)) {
            const chestDiff = Math.abs(estimatedChestHalf - sizeData.chestHalf);
            const waistDiff = Math.abs(estimatedWaistHalf - sizeData.waistHalf);
            const bottomDiff = Math.abs(estimatedBottomHalf - sizeData.bottomHalf);
            const totalDiff = chestDiff + waistDiff + bottomDiff;
            
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
    if (measurements.chestHalf && measurements.waistHalf && measurements.bottomHalf && measurements.shoulderLength && measurements.totalLength) {
        // Find best matching size using weighted scoring system
        let bestMatch = null;
        let bestScore = -Infinity;
        
        for (const [size, sizeData] of Object.entries(polarOvershirtSizeChart.chestWaistBottom)) {
            let score = 0;
            let totalWeight = 0;
            
            // Primary measurements (chest, waist, bottom) - 70% weight
            const chestDiff = Math.abs(measurements.chestHalf - sizeData.chestHalf);
            const waistDiff = Math.abs(measurements.waistHalf - sizeData.waistHalf);
            const bottomDiff = Math.abs(measurements.bottomHalf - sizeData.bottomHalf);
            
            // Score based on how close measurements are (closer = higher score)
            score += (10 - chestDiff) * 0.25;  // Chest weight: 25%
            score += (10 - waistDiff) * 0.25;  // Waist weight: 25%
            score += (10 - bottomDiff) * 0.20; // Bottom weight: 20%
            totalWeight += 0.7;
            
            // Length measurements - 30% weight
            const lengthData = polarOvershirtSizeChart.lengthShoulder[size];
            if (lengthData) {
                const totalLengthDiff = Math.abs(measurements.totalLength - lengthData.totalLength);
                const shoulderLengthDiff = Math.abs(measurements.shoulderLength - lengthData.shoulderLength);
                
                score += (5 - totalLengthDiff) * 0.15;    // Total length weight: 15%
                score += (3 - shoulderLengthDiff) * 0.15; // Shoulder length weight: 15%
                totalWeight += 0.3;
            }
            
            // Normalize score
            const normalizedScore = score / totalWeight;
            
            if (normalizedScore > bestScore) {
                bestScore = normalizedScore;
                bestMatch = size;
            }
        }
        
        if (bestMatch) {
            predictedSize = bestMatch;
            // Calculate confidence based on how well measurements match
            confidence = Math.max(70, Math.min(95, 70 + bestScore * 2));
        }
        
        // Check if measurements are very close to the predicted size
        const predictedChestData = polarOvershirtSizeChart.chestWaistBottom[predictedSize];
        const predictedLengthData = polarOvershirtSizeChart.lengthShoulder[predictedSize];
        
        if (predictedChestData && predictedLengthData) {
            const chestMatch = Math.abs(measurements.chestHalf - predictedChestData.chestHalf) <= 1;
            const waistMatch = Math.abs(measurements.waistHalf - predictedChestData.waistHalf) <= 1;
            const bottomMatch = Math.abs(measurements.bottomHalf - predictedChestData.bottomHalf) <= 1;
            const lengthMatch = Math.abs(measurements.totalLength - predictedLengthData.totalLength) <= 1;
            const shoulderMatch = Math.abs(measurements.shoulderLength - predictedLengthData.shoulderLength) <= 0.5;
            
            const matchCount = [chestMatch, waistMatch, bottomMatch, lengthMatch, shoulderMatch].filter(Boolean).length;
            
            if (matchCount >= 4) {
                confidence = 95;
                recommendations.push('Excellent measurement match with predicted size');
            } else if (matchCount >= 3) {
                confidence = 85;
                recommendations.push('Good measurement match with predicted size');
            } else {
                recommendations.push('Consider length adjustments for better fit');
            }
        }
        
        recommendations.push('Measurements provided - high accuracy prediction');
        
    } else {
        // Estimate measurements based on height, weight, and body type
        estimatedMeasurements = true;
        
        // Improved estimation based on height and weight
        let estimatedChestHalf = 58 + (height - 170) * 0.1 + (weight - 70) * 0.05;
        let estimatedWaistHalf = 56 + (height - 170) * 0.08 + (weight - 70) * 0.04;
        let estimatedBottomHalf = 57 + (height - 170) * 0.09 + (weight - 70) * 0.04;
        let estimatedTotalLength = 73 + (height - 170) * 0.1;
        let estimatedShoulderLength = 15 + (height - 170) * 0.02;
        
        // Adjust based on body type
        switch (bodyType) {
            case 'slim':
                estimatedChestHalf -= 2;
                estimatedWaistHalf -= 2;
                estimatedBottomHalf -= 2;
                estimatedShoulderLength -= 0.5;
                break;
            case 'athletic':
                estimatedChestHalf += 2;
                estimatedWaistHalf -= 1;
                estimatedBottomHalf += 1;
                estimatedShoulderLength += 0.5;
                break;
            case 'plus':
                estimatedChestHalf += 4;
                estimatedWaistHalf += 3;
                estimatedBottomHalf += 3;
                estimatedShoulderLength += 1;
                break;
        }
        
        // Find best match for estimated measurements using the same weighted scoring
        let bestScore = -Infinity;
        for (const [size, sizeData] of Object.entries(polarOvershirtSizeChart.chestWaistBottom)) {
            let score = 0;
            let totalWeight = 0;
            
            const chestDiff = Math.abs(estimatedChestHalf - sizeData.chestHalf);
            const waistDiff = Math.abs(estimatedWaistHalf - sizeData.waistHalf);
            const bottomDiff = Math.abs(estimatedBottomHalf - sizeData.bottomHalf);
            
            score += (10 - chestDiff) * 0.25;
            score += (10 - waistDiff) * 0.25;
            score += (10 - bottomDiff) * 0.20;
            totalWeight += 0.7;
            
            const lengthData = polarOvershirtSizeChart.lengthShoulder[size];
            if (lengthData) {
                const totalLengthDiff = Math.abs(estimatedTotalLength - lengthData.totalLength);
                const shoulderLengthDiff = Math.abs(estimatedShoulderLength - lengthData.shoulderLength);
                
                score += (5 - totalLengthDiff) * 0.15;
                score += (3 - shoulderLengthDiff) * 0.15;
                totalWeight += 0.3;
            }
            
            const normalizedScore = score / totalWeight;
            
            if (normalizedScore > bestScore) {
                bestScore = normalizedScore;
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
    
    if (formData.garmentType === 'pants') {
        displayChestHalfEl.textContent = result.predictedSize.measurements.waist ? `${result.predictedSize.measurements.waist} cm` : 'Not provided';
        displayWaistHalfEl.textContent = result.predictedSize.measurements.seat ? `${result.predictedSize.measurements.seat} cm` : 'Not provided';
        displayShoulderLengthEl.textContent = 'N/A';
        displayTotalLengthEl.textContent = result.predictedSize.measurements.length ? `${result.predictedSize.measurements.length} cm` : 'Not provided';
    } else if (formData.garmentType === 'short-sleeves') {
        displayChestHalfEl.textContent = result.predictedSize.measurements.chestHalf ? `${result.predictedSize.measurements.chestHalf} cm` : 'Not provided';
        displayWaistHalfEl.textContent = result.predictedSize.measurements.waistHalf ? `${result.predictedSize.measurements.waistHalf} cm` : 'Not provided';
        displayBottomHalfEl.textContent = 'N/A';
        displayShoulderLengthEl.textContent = result.predictedSize.measurements.shoulderLength ? `${result.predictedSize.measurements.shoulderLength} cm` : 'Not provided';
        displayTotalLengthEl.textContent = result.predictedSize.measurements.totalLength ? `${result.predictedSize.measurements.totalLength} cm` : 'Not provided';
    } else if (formData.garmentType === 'jagvi-shirt') {
        displayChestHalfEl.textContent = result.predictedSize.measurements.chestHalf ? `${result.predictedSize.measurements.chestHalf} cm` : 'Not provided';
        displayWaistHalfEl.textContent = result.predictedSize.measurements.waistHalf ? `${result.predictedSize.measurements.waistHalf} cm` : 'Not provided';
        displayBottomHalfEl.textContent = result.predictedSize.measurements.bottomHalf ? `${result.predictedSize.measurements.bottomHalf} cm` : 'Not provided';
        displayShoulderLengthEl.textContent = result.predictedSize.measurements.shoulderLength ? `${result.predictedSize.measurements.shoulderLength} cm` : 'Not provided';
        displayTotalLengthEl.textContent = result.predictedSize.measurements.totalLength ? `${result.predictedSize.measurements.totalLength} cm` : 'Not provided';
    } else if (formData.garmentType === 'hooded-jacket') {
        displayChestHalfEl.textContent = result.predictedSize.measurements.chestHalf ? `${result.predictedSize.measurements.chestHalf} cm` : 'Not provided';
        displayWaistHalfEl.textContent = result.predictedSize.measurements.waistHalf ? `${result.predictedSize.measurements.waistHalf} cm` : 'Not provided';
        displayBottomHalfEl.textContent = result.predictedSize.measurements.bottomHalf ? `${result.predictedSize.measurements.bottomHalf} cm` : 'Not provided';
        displayShoulderLengthEl.textContent = result.predictedSize.measurements.shoulderLength ? `${result.predictedSize.measurements.shoulderLength} cm` : 'Not provided';
        displayTotalLengthEl.textContent = result.predictedSize.measurements.totalLength ? `${result.predictedSize.measurements.totalLength} cm` : 'Not provided';
    } else if (formData.garmentType === 'polar-overshirt') {
        displayChestHalfEl.textContent = result.predictedSize.measurements.chestHalf ? `${result.predictedSize.measurements.chestHalf} cm` : 'Not provided';
        displayWaistHalfEl.textContent = result.predictedSize.measurements.waistHalf ? `${result.predictedSize.measurements.waistHalf} cm` : 'Not provided';
        displayBottomHalfEl.textContent = result.predictedSize.measurements.bottomHalf ? `${result.predictedSize.measurements.bottomHalf} cm` : 'Not provided';
        displayShoulderLengthEl.textContent = result.predictedSize.measurements.shoulderLength ? `${result.predictedSize.measurements.shoulderLength} cm` : 'Not provided';
        displayTotalLengthEl.textContent = result.predictedSize.measurements.totalLength ? `${result.predictedSize.measurements.totalLength} cm` : 'Not provided';
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