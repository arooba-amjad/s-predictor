const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint for size prediction
app.post('/api/predict-size', (req, res) => {
    try {
        const { height, weight, age, gender, bodyType, measurements, garmentType } = req.body;
        
        // Size prediction logic based on garment type
        const predictedSize = predictSize(height, weight, age, gender, bodyType, measurements, garmentType);
        
        res.json({
            success: true,
            predictedSize,
            confidence: predictedSize.confidence,
            recommendations: predictedSize.recommendations
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// Size charts data based on the provided Excel files
const sizeCharts = {
    'jagvi-shirt': {
        name: 'Jagvi Shirt (Long Sleeve)',
        reference: 'For a man of 75 kgs and 1.83 cms height',
        measurements: {
            'chestHalf': { XS: 51, S: 53, M: 55, L: 57, XL: 59, XXL: 61 },
            'waistHalf': { XS: 47, S: 49, M: 51, L: 53, XL: 55, XXL: 57 },
            'bottomHalf': { XS: 50, S: 52, M: 54, L: 56, XL: 58, XXL: 60 },
            'totalLength': { XS: 73, S: 74, M: 75, L: 76, XL: 77, XXL: 78 },
            'shoulderLength': { XS: 13.5, S: 14, M: 14.5, L: 15, XL: 15.5, XXL: 16 }
        }
    },
    'short-sleeves': {
        name: 'Short Sleeve Shirt',
        reference: 'For a man of 75 kgs and 1.83 cms height',
        measurements: {
            'chestHalf': { XS: 52, S: 54, M: 56, L: 58, XL: 60, XXL: 62 },
            'waistHalf': { XS: 49, S: 51, M: 53, L: 55, XL: 57, XXL: 59 },
            'totalLength': { '70': 70, '71': 71, '72': 72, '73': 73, '74': 74, '75': 75 },
            'shoulderLength': { '70': 12.5, '71': 13.25, '72': 14, '73': 14.75, '74': 15.5, '75': 16.25 }
        }
    },
    'pants': {
        name: 'Pants',
        reference: 'Accurate Size Chart (cm)',
        measurements: {
            'length': { S: 97.5, M: 99, L: 100.5, XL: 102, XXL: 103.5 },
            'waist': { S: 68, M: 72, L: 76, XL: 80, XXL: 84 },
            'hip': { S: 118, M: 122, L: 126, XL: 130, XXL: 134 }
        }
    },
    'hooded-jacket': {
        name: 'Hooded Jacket 3',
        reference: 'SUMMER 2025 Collection',
        measurements: {
            'chestHalf': { S: 59, M: 59, L: 59, XL: 59, XXL: 59 },
            'waistHalf': { S: 56, M: 56, L: 56, XL: 56, XXL: 56 },
            'bottomHalf': { S: 55, M: 55, L: 55, XL: 55, XXL: 55 },
            'totalLength': { S: 72, M: 72, L: 72, XL: 72, XXL: 72 },
            'shoulderLength': { S: 15, M: 15, L: 15, XL: 15, XXL: 15 }
        }
    },
    'polar-overshirt': {
        name: 'Polar Overshirt Jacket',
        reference: 'SUMMER 2025 Collection',
        measurements: {
            'chestHalf': { XS: 54, S: 56, M: 58, L: 60, XL: 62, XXL: 64 },
            'waistHalf': { XS: 52, S: 54, M: 56, L: 58, XL: 60, XXL: 62 },
            'bottomHalf': { XS: 53, S: 55, M: 57, L: 59, XL: 61, XXL: 63 },
            'totalLength': { XS: 71, S: 72, M: 73, L: 74, XL: 75, XXL: 76 },
            'shoulderLength': { XS: 14, S: 14.5, M: 15, L: 15.5, XL: 16, XXL: 16.5 }
        }
    }
};

// Estimate measurements from basic information
function estimateMeasurements(height, weight, age, gender, bodyType, garmentType) {
    // BMI calculation
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    // Base measurements based on height and weight
    let estimatedMeasurements = {};
    
    if (garmentType === 'pants') {
        // Estimate pants measurements in centimeters
        const waistCm = estimateWaistFromBMI(bmi, height, gender) * 2.54; // Convert to cm
        const hipCm = waistCm + 10; // Hip is typically 10cm larger than waist for better fit
        const lengthCm = height * 0.58; // Length is typically 58% of height for pants
        
        estimatedMeasurements = {
            waist: waistCm,
            hip: hipCm,
            length: lengthCm
        };
    } else {
        // Estimate shirt/jacket measurements
        const chestInches = estimateChestFromBMI(bmi, height, gender);
        const waistInches = chestInches - 2; // Waist is typically 2 inches smaller than chest
        const hipsInches = chestInches + 1; // Hips are typically 1 inch larger than chest
        
        // Convert to cm for shirt measurements
        const chestHalfCm = (chestInches * 2.54) / 2; // Convert to cm and divide by 2
        const waistHalfCm = (waistInches * 2.54) / 2; // Convert to cm and divide by 2
        const bottomHalfCm = (chestInches * 2.54) / 2 + 1; // Bottom is typically 1cm larger than chest
        const totalLengthCm = height * 0.42; // Total length is typically 42% of height
        const shoulderLengthCm = 12 + (height - 160) * 0.05; // Shoulder length based on height
        
        estimatedMeasurements = {
            chest: chestInches,
            waist: waistInches,
            hips: hipsInches,
            inseam: height * 0.45, // Inseam is typically 45% of height
            // Shirt specific measurements
            chestHalf: chestHalfCm,
            waistHalf: waistHalfCm,
            bottomHalf: bottomHalfCm,
            totalLength: totalLengthCm,
            shoulderLength: shoulderLengthCm
        };
    }
    
    // Adjust for body type
    estimatedMeasurements = adjustForBodyType(estimatedMeasurements, bodyType, garmentType);
    
    return estimatedMeasurements;
}

// Estimate waist from BMI
function estimateWaistFromBMI(bmi, height, gender) {
    let baseWaist;
    
    if (gender === 'male') {
        if (bmi < 18.5) baseWaist = 28; // Underweight
        else if (bmi < 25) baseWaist = 32; // Normal weight
        else if (bmi < 30) baseWaist = 36; // Overweight
        else baseWaist = 40; // Obese
    } else {
        if (bmi < 18.5) baseWaist = 26;
        else if (bmi < 25) baseWaist = 30;
        else if (bmi < 30) baseWaist = 34;
        else baseWaist = 38;
    }
    
    // Adjust for height
    const heightAdjustment = (height - 170) * 0.1; // 0.1 inch per cm difference from 170cm
    return Math.round((baseWaist + heightAdjustment) * 10) / 10;
}

// Estimate chest from BMI
function estimateChestFromBMI(bmi, height, gender) {
    let baseChest;
    
    if (gender === 'male') {
        if (bmi < 18.5) baseChest = 34;
        else if (bmi < 25) baseChest = 38;
        else if (bmi < 30) baseChest = 42;
        else baseChest = 46;
    } else {
        if (bmi < 18.5) baseChest = 32;
        else if (bmi < 25) baseChest = 36;
        else if (bmi < 30) baseChest = 40;
        else baseChest = 44;
    }
    
    // Adjust for height
    const heightAdjustment = (height - 170) * 0.15; // 0.15 inch per cm difference from 170cm
    return Math.round((baseChest + heightAdjustment) * 10) / 10;
}

// Estimate thigh from weight
function estimateThighFromWeight(weight, gender) {
    let baseThigh;
    
    if (gender === 'male') {
        baseThigh = weight * 0.22; // Thigh is typically 22% of weight in kg
    } else {
        baseThigh = weight * 0.24; // Slightly higher for females
    }
    
    return Math.round(baseThigh * 10) / 10;
}

// Adjust measurements for body type
function adjustForBodyType(measurements, bodyType, garmentType) {
    const adjusted = { ...measurements };
    
    if (bodyType === 'slim') {
        Object.keys(adjusted).forEach(key => {
            adjusted[key] = Math.round(adjusted[key] * 0.9 * 10) / 10; // 10% smaller
        });
    } else if (bodyType === 'athletic') {
        if (garmentType === 'pants') {
            adjusted.thigh = Math.round(adjusted.thigh * 1.1 * 10) / 10; // 10% larger thighs
        } else {
            adjusted.chest = Math.round(adjusted.chest * 1.05 * 10) / 10; // 5% larger chest
        }
    } else if (bodyType === 'plus') {
        Object.keys(adjusted).forEach(key => {
            adjusted[key] = Math.round(adjusted[key] * 1.15 * 10) / 10; // 15% larger
        });
    }
    
    return adjusted;
}

// Size prediction algorithm based on garment type
function predictSize(height, weight, age, gender, bodyType, measurements, garmentType) {
    if (!sizeCharts[garmentType]) {
        throw new Error('Invalid garment type selected');
    }

    const sizeChart = sizeCharts[garmentType];
    const chartMeasurements = sizeChart.measurements;
    
    // BMI calculation
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    // Check if we have detailed measurements, if not estimate them
    const hasDetailedMeasurements = garmentType === 'pants' 
        ? (measurements.waist || measurements.hip || measurements.length)
        : garmentType === 'short-sleeves'
        ? (measurements.chestHalf || measurements.waistHalf || measurements.shoulderLength || measurements.totalLength)
        : garmentType === 'jagvi-shirt'
        ? (measurements.chestHalf || measurements.waistHalf || measurements.bottomHalf || measurements.shoulderLength || measurements.totalLength)
        : garmentType === 'hooded-jacket'
        ? (measurements.chestHalf || measurements.waistHalf || measurements.bottomHalf || measurements.shoulderLength || measurements.totalLength)
        : garmentType === 'polar-overshirt'
        ? (measurements.chestHalf || measurements.waistHalf || measurements.bottomHalf || measurements.shoulderLength || measurements.totalLength)
        : (measurements.chest || measurements.waist);
    
    let finalMeasurements = measurements;
    let confidence = 85; // Base confidence
    
    if (!hasDetailedMeasurements) {
        // Estimate measurements from basic info
        finalMeasurements = estimateMeasurements(height, weight, age, gender, bodyType, garmentType);
        confidence = 75; // Lower confidence for estimated measurements
    }
    
    let predictedSize = 'M'; // Default medium
    
    // Different logic for different garment types
    if (garmentType === 'pants') {
        // Pants sizing logic (uses letter sizes)
        predictedSize = predictPantsSize(finalMeasurements, chartMeasurements, gender, bodyType);
    } else if (garmentType === 'short-sleeves') {
        // Short sleeve sizing logic (uses letter sizes)
        predictedSize = predictShortSleeveSize(finalMeasurements, chartMeasurements, gender, bodyType);
    } else if (garmentType === 'jagvi-shirt') {
        // Long sleeve sizing logic (uses letter sizes)
        predictedSize = predictLongSleeveSize(finalMeasurements, chartMeasurements, gender, bodyType);
    } else if (garmentType === 'hooded-jacket') {
        // Hooded jacket sizing logic (uses letter sizes)
        predictedSize = predictHoodedJacketSize(finalMeasurements, chartMeasurements, gender, bodyType);
    } else if (garmentType === 'polar-overshirt') {
        // Polar overshirt sizing logic (uses letter sizes)
        predictedSize = predictPolarOvershirtSize(finalMeasurements, chartMeasurements, gender, bodyType);
    } else {
        // Other shirt/Jacket sizing logic (uses letter sizes)
        predictedSize = predictShirtSize(finalMeasurements, chartMeasurements, gender, bodyType);
    }
    
    // Adjust confidence based on data quality
    if (garmentType === 'pants') {
        if (measurements.waist && measurements.hip && measurements.length) {
            confidence += 25; // Maximum confidence for all three measurements
        } else if (measurements.waist && measurements.hip) {
            confidence += 20;
        } else if (measurements.waist && measurements.length) {
            confidence += 18;
        } else if (measurements.hip && measurements.length) {
            confidence += 18;
        } else if (measurements.waist) {
            confidence += 15;
        } else if (measurements.hip) {
            confidence += 15;
        } else if (measurements.length) {
            confidence += 15;
        } else if (hasDetailedMeasurements) {
            confidence += 5;
        }
    } else if (garmentType === 'short-sleeves') {
        if (measurements.chestHalf && measurements.waistHalf && measurements.shoulderLength && measurements.totalLength) {
            confidence += 25; // Maximum confidence for all four measurements
        } else if (measurements.chestHalf && measurements.waistHalf) {
            confidence += 20;
        } else if (measurements.chestHalf && measurements.shoulderLength) {
            confidence += 18;
        } else if (measurements.chestHalf && measurements.totalLength) {
            confidence += 18;
        } else if (measurements.chestHalf) {
            confidence += 15;
        } else if (measurements.waistHalf) {
            confidence += 15;
        } else if (measurements.shoulderLength) {
            confidence += 10;
        } else if (measurements.totalLength) {
            confidence += 10;
        } else if (hasDetailedMeasurements) {
            confidence += 5;
        }
    } else if (garmentType === 'jagvi-shirt') {
        if (measurements.chestHalf && measurements.waistHalf && measurements.bottomHalf && measurements.shoulderLength && measurements.totalLength) {
            confidence += 30; // Maximum confidence for all five measurements
        } else if (measurements.chestHalf && measurements.waistHalf && measurements.bottomHalf) {
            confidence += 25;
        } else if (measurements.chestHalf && measurements.waistHalf) {
            confidence += 20;
        } else if (measurements.chestHalf && measurements.bottomHalf) {
            confidence += 20;
        } else if (measurements.chestHalf && measurements.shoulderLength) {
            confidence += 18;
        } else if (measurements.chestHalf && measurements.totalLength) {
            confidence += 18;
        } else if (measurements.chestHalf) {
            confidence += 15;
        } else if (measurements.waistHalf) {
            confidence += 15;
        } else if (measurements.bottomHalf) {
            confidence += 15;
        } else if (measurements.shoulderLength) {
            confidence += 10;
        } else if (measurements.totalLength) {
            confidence += 10;
        } else if (hasDetailedMeasurements) {
            confidence += 5;
        }
    } else if (garmentType === 'hooded-jacket') {
        if (measurements.chestHalf && measurements.waistHalf && measurements.bottomHalf && measurements.shoulderLength && measurements.totalLength) {
            confidence += 30; // Maximum confidence for all five measurements
        } else if (measurements.chestHalf && measurements.waistHalf && measurements.bottomHalf) {
            confidence += 25;
        } else if (measurements.chestHalf && measurements.waistHalf) {
            confidence += 20;
        } else if (measurements.chestHalf && measurements.bottomHalf) {
            confidence += 20;
        } else if (measurements.chestHalf && measurements.shoulderLength) {
            confidence += 18;
        } else if (measurements.chestHalf && measurements.totalLength) {
            confidence += 18;
        } else if (measurements.chestHalf) {
            confidence += 15;
        } else if (measurements.waistHalf) {
            confidence += 15;
        } else if (measurements.bottomHalf) {
            confidence += 15;
        } else if (measurements.shoulderLength) {
            confidence += 10;
        } else if (measurements.totalLength) {
            confidence += 10;
        } else if (hasDetailedMeasurements) {
            confidence += 5;
        }
    } else if (garmentType === 'polar-overshirt') {
        if (measurements.chestHalf && measurements.waistHalf && measurements.bottomHalf && measurements.shoulderLength && measurements.totalLength) {
            confidence += 30; // Maximum confidence for all five measurements
        } else if (measurements.chestHalf && measurements.waistHalf && measurements.bottomHalf) {
            confidence += 25;
        } else if (measurements.chestHalf && measurements.waistHalf) {
            confidence += 20;
        } else if (measurements.chestHalf && measurements.bottomHalf) {
            confidence += 20;
        } else if (measurements.chestHalf && measurements.shoulderLength) {
            confidence += 18;
        } else if (measurements.chestHalf && measurements.totalLength) {
            confidence += 18;
        } else if (measurements.chestHalf) {
            confidence += 15;
        } else if (measurements.waistHalf) {
            confidence += 15;
        } else if (measurements.bottomHalf) {
            confidence += 15;
        } else if (measurements.shoulderLength) {
            confidence += 10;
        } else if (measurements.totalLength) {
            confidence += 10;
        } else if (hasDetailedMeasurements) {
            confidence += 5;
        }
    } else {
        if (measurements.chest && measurements.waist) {
            confidence += 15;
        } else if (measurements.chest) {
            confidence += 10;
        } else if (hasDetailedMeasurements) {
            confidence += 5;
        }
    }
    
    if (age >= 18 && age <= 65) {
        confidence += 5;
    }
    
    // Recommendations based on garment type
    const recommendations = [];
    
    if (!hasDetailedMeasurements) {
        recommendations.push('Size prediction based on estimated measurements. For more accurate results, please provide your detailed measurements.');
    }
    
    if (bmi < 18.5) {
        recommendations.push('Consider a size up for a more comfortable fit');
    } else if (bmi > 25) {
        recommendations.push('Consider a size down for a more fitted look');
    }
    
    if (bodyType === 'athletic') {
        recommendations.push('Athletic fit may work better for your body type');
    }
    
    // Garment-specific recommendations
    if (garmentType === 'pants') {
        recommendations.push('For pants, focus on length, waist, and hip measurements for best fit');
        if (finalMeasurements.length) {
            recommendations.push('Length measurement helps ensure proper fit for your height');
        }
        if (finalMeasurements.waist && finalMeasurements.hip) {
            recommendations.push('Waist and hip measurements ensure comfortable fit around the waist and hips');
        }
    } else if (garmentType === 'hooded-jacket') {
        recommendations.push('Hooded jackets should have room for layering underneath');
    } else if (garmentType === 'short-sleeves') {
        recommendations.push('Short sleeve shirts work well with a slightly relaxed fit');
    } else if (garmentType === 'jagvi-shirt') {
        recommendations.push('Long sleeve shirts should have comfortable arm movement');
    }
    
    return {
        size: predictedSize,
        confidence: Math.min(confidence, 95),
        recommendations,
        garmentType: sizeChart.name,
        reference: sizeChart.reference,
        estimatedMeasurements: !hasDetailedMeasurements,
        measurements: {
            chest: finalMeasurements.chest,
            waist: finalMeasurements.waist,
            hips: finalMeasurements.hips,
            inseam: finalMeasurements.inseam,
            // Include pants-specific measurements if available
            length: finalMeasurements.length,
            hip: finalMeasurements.hip,
            // Include shirt specific measurements if available
            chestHalf: finalMeasurements.chestHalf,
            waistHalf: finalMeasurements.waistHalf,
            bottomHalf: finalMeasurements.bottomHalf,
            shoulderLength: finalMeasurements.shoulderLength,
            totalLength: finalMeasurements.totalLength
        }
    };
}

// Predict pants size (letter sizing) - Accurate algorithm
function predictPantsSize(measurements, chartMeasurements, gender, bodyType) {
    const waist = measurements.waist;
    const hip = measurements.hip;
    const length = measurements.length;
    
    if (!waist && !hip && !length) {
        return 'M'; // Default size
    }
    
    // Find the best matching size based on available measurements
    const sizes = Object.keys(chartMeasurements.waist);
    let bestSize = 'M';
    let smallestDiff = Infinity;
    
    for (const size of sizes) {
        let totalDiff = 0;
        let measurementCount = 0;
        let weightedDiff = 0;
        
        // Compare measurements with different weights for accuracy
        if (length && chartMeasurements.length[size]) {
            const lengthDiff = Math.abs(chartMeasurements.length[size] - length);
            totalDiff += lengthDiff;
            weightedDiff += lengthDiff * 0.3; // Length has 30% weight
            measurementCount++;
        }
        
        if (waist && chartMeasurements.waist[size]) {
            const waistDiff = Math.abs(chartMeasurements.waist[size] - waist);
            totalDiff += waistDiff;
            weightedDiff += waistDiff * 0.4; // Waist has 40% weight (most important)
            measurementCount++;
        }
        
        if (hip && chartMeasurements.hip[size]) {
            const hipDiff = Math.abs(chartMeasurements.hip[size] - hip);
            totalDiff += hipDiff;
            weightedDiff += hipDiff * 0.3; // Hip has 30% weight
            measurementCount++;
        }
        
        // Use weighted average for better accuracy
        if (measurementCount > 0) {
            const avgDiff = weightedDiff / measurementCount;
            if (avgDiff < smallestDiff) {
                smallestDiff = avgDiff;
                bestSize = size;
            }
        }
    }
    
    // Adjust for body type with more precise logic
    if (bodyType === 'slim') {
        if (bestSize === 'M') bestSize = 'S';
        else if (bestSize === 'L') bestSize = 'M';
        else if (bestSize === 'XL') bestSize = 'L';
        else if (bestSize === 'XXL') bestSize = 'XL';
    } else if (bodyType === 'athletic') {
        if (bestSize === 'S') bestSize = 'M';
        else if (bestSize === 'M') bestSize = 'L';
        else if (bestSize === 'L') bestSize = 'XL';
        else if (bestSize === 'XL') bestSize = 'XXL';
    } else if (bodyType === 'plus') {
        if (bestSize === 'S') bestSize = 'M';
        else if (bestSize === 'M') bestSize = 'L';
        else if (bestSize === 'L') bestSize = 'XL';
        else if (bestSize === 'XL') bestSize = 'XXL';
    }
    
    return bestSize;
}

// Predict short sleeve size based on new measurements
function predictShortSleeveSize(measurements, chartMeasurements, gender, bodyType) {
    const chestHalf = measurements.chestHalf;
    const waistHalf = measurements.waistHalf;
    const shoulderLength = measurements.shoulderLength;
    const totalLength = measurements.totalLength;
    
    if (!chestHalf && !waistHalf && !shoulderLength && !totalLength) {
        return 'M'; // Default size
    }
    
    // Find the best matching size based on chest and waist measurements
    const sizes = Object.keys(chartMeasurements.chestHalf);
    let bestSize = 'M';
    let smallestDiff = Infinity;
    
    for (const size of sizes) {
        let totalDiff = 0;
        let measurementCount = 0;
        let weightedDiff = 0;
        
        // Compare chest and waist measurements (primary measurements)
        if (chestHalf && chartMeasurements.chestHalf[size]) {
            const chestDiff = Math.abs(chartMeasurements.chestHalf[size] - chestHalf);
            totalDiff += chestDiff;
            weightedDiff += chestDiff * 0.4; // Chest has 40% weight
            measurementCount++;
        }
        
        if (waistHalf && chartMeasurements.waistHalf[size]) {
            const waistDiff = Math.abs(chartMeasurements.waistHalf[size] - waistHalf);
            totalDiff += waistDiff;
            weightedDiff += waistDiff * 0.4; // Waist has 40% weight
            measurementCount++;
        }
        
        // Compare length measurements if available
        if (totalLength && shoulderLength) {
            // Find the best matching length size
            const lengthSizes = Object.keys(chartMeasurements.totalLength);
            let bestLengthMatch = null;
            let smallestLengthDiff = Infinity;
            
            for (const lengthSize of lengthSizes) {
                const lengthDiff = Math.abs(chartMeasurements.totalLength[lengthSize] - totalLength);
                const shoulderDiff = Math.abs(chartMeasurements.shoulderLength[lengthSize] - shoulderLength);
                const combinedDiff = lengthDiff + shoulderDiff;
                
                if (combinedDiff < smallestLengthDiff) {
                    smallestLengthDiff = combinedDiff;
                    bestLengthMatch = lengthSize;
                }
            }
            
            if (bestLengthMatch) {
                weightedDiff += smallestLengthDiff * 0.2; // Length measurements have 20% weight
                measurementCount++;
            }
        }
        
        // Use weighted average for better accuracy
        if (measurementCount > 0) {
            const avgDiff = weightedDiff / measurementCount;
            if (avgDiff < smallestDiff) {
                smallestDiff = avgDiff;
                bestSize = size;
            }
        }
    }
    
    // Adjust for body type
    if (bodyType === 'slim') {
        if (bestSize === 'M') bestSize = 'S';
        else if (bestSize === 'L') bestSize = 'M';
        else if (bestSize === 'XL') bestSize = 'L';
        else if (bestSize === 'XXL') bestSize = 'XL';
    } else if (bodyType === 'athletic') {
        if (bestSize === 'S') bestSize = 'M';
        else if (bestSize === 'M') bestSize = 'L';
        else if (bestSize === 'L') bestSize = 'XL';
        else if (bestSize === 'XL') bestSize = 'XXL';
    } else if (bodyType === 'plus') {
        if (bestSize === 'S') bestSize = 'M';
        else if (bestSize === 'M') bestSize = 'L';
        else if (bestSize === 'L') bestSize = 'XL';
        else if (bestSize === 'XL') bestSize = 'XXL';
    }
    
    return bestSize;
}

// Predict long sleeve size based on new measurements
function predictLongSleeveSize(measurements, chartMeasurements, gender, bodyType) {
    const chestHalf = measurements.chestHalf;
    const waistHalf = measurements.waistHalf;
    const bottomHalf = measurements.bottomHalf;
    const shoulderLength = measurements.shoulderLength;
    const totalLength = measurements.totalLength;
    
    if (!chestHalf && !waistHalf && !bottomHalf && !shoulderLength && !totalLength) {
        return 'M'; // Default size
    }
    
    // Find the best matching size based on chest, waist, and bottom measurements
    const sizes = Object.keys(chartMeasurements.chestHalf);
    let bestSize = 'M';
    let smallestDiff = Infinity;
    
    for (const size of sizes) {
        let totalDiff = 0;
        let measurementCount = 0;
        let weightedDiff = 0;
        
        // Compare chest, waist, and bottom measurements (primary measurements)
        if (chestHalf && chartMeasurements.chestHalf[size]) {
            const chestDiff = Math.abs(chartMeasurements.chestHalf[size] - chestHalf);
            totalDiff += chestDiff;
            weightedDiff += chestDiff * 0.35; // Chest has 35% weight
            measurementCount++;
        }
        
        if (waistHalf && chartMeasurements.waistHalf[size]) {
            const waistDiff = Math.abs(chartMeasurements.waistHalf[size] - waistHalf);
            totalDiff += waistDiff;
            weightedDiff += waistDiff * 0.35; // Waist has 35% weight
            measurementCount++;
        }
        
        if (bottomHalf && chartMeasurements.bottomHalf[size]) {
            const bottomDiff = Math.abs(chartMeasurements.bottomHalf[size] - bottomHalf);
            totalDiff += bottomDiff;
            weightedDiff += bottomDiff * 0.3; // Bottom has 30% weight
            measurementCount++;
        }
        
        // Compare length measurements if available
        if (totalLength && shoulderLength) {
            // Find the best matching length size
            const lengthSizes = Object.keys(chartMeasurements.totalLength);
            let bestLengthMatch = null;
            let smallestLengthDiff = Infinity;
            
            for (const lengthSize of lengthSizes) {
                const lengthDiff = Math.abs(chartMeasurements.totalLength[lengthSize] - totalLength);
                const shoulderDiff = Math.abs(chartMeasurements.shoulderLength[lengthSize] - shoulderLength);
                const combinedDiff = lengthDiff + shoulderDiff;
                
                if (combinedDiff < smallestLengthDiff) {
                    smallestLengthDiff = combinedDiff;
                    bestLengthMatch = lengthSize;
                }
            }
            
            if (bestLengthMatch) {
                weightedDiff += smallestLengthDiff * 0.2; // Length measurements have 20% weight
                measurementCount++;
            }
        }
        
        // Use weighted average for better accuracy
        if (measurementCount > 0) {
            const avgDiff = weightedDiff / measurementCount;
            if (avgDiff < smallestDiff) {
                smallestDiff = avgDiff;
                bestSize = size;
            }
        }
    }
    
    // Adjust for body type
    if (bodyType === 'slim') {
        if (bestSize === 'M') bestSize = 'S';
        else if (bestSize === 'L') bestSize = 'M';
        else if (bestSize === 'XL') bestSize = 'L';
        else if (bestSize === 'XXL') bestSize = 'XL';
    } else if (bodyType === 'athletic') {
        if (bestSize === 'S') bestSize = 'M';
        else if (bestSize === 'M') bestSize = 'L';
        else if (bestSize === 'L') bestSize = 'XL';
        else if (bestSize === 'XL') bestSize = 'XXL';
    } else if (bodyType === 'plus') {
        if (bestSize === 'S') bestSize = 'M';
        else if (bestSize === 'M') bestSize = 'L';
        else if (bestSize === 'L') bestSize = 'XL';
        else if (bestSize === 'XL') bestSize = 'XXL';
    }
    
    return bestSize;
}

// Predict hooded jacket size based on new measurements
function predictHoodedJacketSize(measurements, chartMeasurements, gender, bodyType) {
    const chestHalf = measurements.chestHalf;
    const waistHalf = measurements.waistHalf;
    const bottomHalf = measurements.bottomHalf;
    const shoulderLength = measurements.shoulderLength;
    const totalLength = measurements.totalLength;
    
    if (!chestHalf && !waistHalf && !bottomHalf && !shoulderLength && !totalLength) {
        return 'M'; // Default size
    }
    
    // Find the best matching size based on chest, waist, and bottom measurements
    const sizes = Object.keys(chartMeasurements.chestHalf);
    let bestSize = 'M';
    let smallestDiff = Infinity;
    
    for (const size of sizes) {
        let totalDiff = 0;
        let measurementCount = 0;
        let weightedDiff = 0;
        
        // Compare chest, waist, and bottom measurements (primary measurements)
        if (chestHalf && chartMeasurements.chestHalf[size]) {
            const chestDiff = Math.abs(chartMeasurements.chestHalf[size] - chestHalf);
            totalDiff += chestDiff;
            weightedDiff += chestDiff * 0.35; // Chest has 35% weight
            measurementCount++;
        }
        
        if (waistHalf && chartMeasurements.waistHalf[size]) {
            const waistDiff = Math.abs(chartMeasurements.waistHalf[size] - waistHalf);
            totalDiff += waistDiff;
            weightedDiff += waistDiff * 0.35; // Waist has 35% weight
            measurementCount++;
        }
        
        if (bottomHalf && chartMeasurements.bottomHalf[size]) {
            const bottomDiff = Math.abs(chartMeasurements.bottomHalf[size] - bottomHalf);
            totalDiff += bottomDiff;
            weightedDiff += bottomDiff * 0.3; // Bottom has 30% weight
            measurementCount++;
        }
        
        // Compare length measurements if available
        if (totalLength && shoulderLength) {
            // Find the best matching length size
            const lengthSizes = Object.keys(chartMeasurements.totalLength);
            let bestLengthMatch = null;
            let smallestLengthDiff = Infinity;
            
            for (const lengthSize of lengthSizes) {
                const lengthDiff = Math.abs(chartMeasurements.totalLength[lengthSize] - totalLength);
                const shoulderDiff = Math.abs(chartMeasurements.shoulderLength[lengthSize] - shoulderLength);
                const combinedDiff = lengthDiff + shoulderDiff;
                
                if (combinedDiff < smallestLengthDiff) {
                    smallestLengthDiff = combinedDiff;
                    bestLengthMatch = lengthSize;
                }
            }
            
            if (bestLengthMatch) {
                weightedDiff += smallestLengthDiff * 0.2; // Length measurements have 20% weight
                measurementCount++;
            }
        }
        
        // Use weighted average for better accuracy
        if (measurementCount > 0) {
            const avgDiff = weightedDiff / measurementCount;
            if (avgDiff < smallestDiff) {
                smallestDiff = avgDiff;
                bestSize = size;
            }
        }
    }
    
    // Adjust for body type
    if (bodyType === 'slim') {
        if (bestSize === 'M') bestSize = 'S';
        else if (bestSize === 'L') bestSize = 'M';
        else if (bestSize === 'XL') bestSize = 'L';
        else if (bestSize === 'XXL') bestSize = 'XL';
    } else if (bodyType === 'athletic') {
        if (bestSize === 'S') bestSize = 'M';
        else if (bestSize === 'M') bestSize = 'L';
        else if (bestSize === 'L') bestSize = 'XL';
        else if (bestSize === 'XL') bestSize = 'XXL';
    } else if (bodyType === 'plus') {
        if (bestSize === 'S') bestSize = 'M';
        else if (bestSize === 'M') bestSize = 'L';
        else if (bestSize === 'L') bestSize = 'XL';
        else if (bestSize === 'XL') bestSize = 'XXL';
    }
    
    return bestSize;
}

// Predict polar overshirt size based on new measurements
function predictPolarOvershirtSize(measurements, chartMeasurements, gender, bodyType) {
    const chestHalf = measurements.chestHalf;
    const waistHalf = measurements.waistHalf;
    const bottomHalf = measurements.bottomHalf;
    const shoulderLength = measurements.shoulderLength;
    const totalLength = measurements.totalLength;
    
    if (!chestHalf && !waistHalf && !bottomHalf && !shoulderLength && !totalLength) {
        return 'M'; // Default size
    }
    
    // Find the best matching size based on chest, waist, and bottom measurements
    const sizes = Object.keys(chartMeasurements.chestHalf);
    let bestSize = 'M';
    let smallestDiff = Infinity;
    
    for (const size of sizes) {
        let totalDiff = 0;
        let measurementCount = 0;
        let weightedDiff = 0;
        
        // Compare chest, waist, and bottom measurements (primary measurements)
        if (chestHalf && chartMeasurements.chestHalf[size]) {
            const chestDiff = Math.abs(chartMeasurements.chestHalf[size] - chestHalf);
            totalDiff += chestDiff;
            weightedDiff += chestDiff * 0.35; // Chest has 35% weight
            measurementCount++;
        }
        
        if (waistHalf && chartMeasurements.waistHalf[size]) {
            const waistDiff = Math.abs(chartMeasurements.waistHalf[size] - waistHalf);
            totalDiff += waistDiff;
            weightedDiff += waistDiff * 0.35; // Waist has 35% weight
            measurementCount++;
        }
        
        if (bottomHalf && chartMeasurements.bottomHalf[size]) {
            const bottomDiff = Math.abs(chartMeasurements.bottomHalf[size] - bottomHalf);
            totalDiff += bottomDiff;
            weightedDiff += bottomDiff * 0.3; // Bottom has 30% weight
            measurementCount++;
        }
        
        // Compare length measurements if available
        if (totalLength && shoulderLength) {
            // Find the best matching length size
            const lengthSizes = Object.keys(chartMeasurements.totalLength);
            let bestLengthMatch = null;
            let smallestLengthDiff = Infinity;
            
            for (const lengthSize of lengthSizes) {
                const lengthDiff = Math.abs(chartMeasurements.totalLength[lengthSize] - totalLength);
                const shoulderDiff = Math.abs(chartMeasurements.shoulderLength[lengthSize] - shoulderLength);
                const combinedDiff = lengthDiff + shoulderDiff;
                
                if (combinedDiff < smallestLengthDiff) {
                    smallestLengthDiff = combinedDiff;
                    bestLengthMatch = lengthSize;
                }
            }
            
            if (bestLengthMatch) {
                weightedDiff += smallestLengthDiff * 0.2; // Length measurements have 20% weight
                measurementCount++;
            }
        }
        
        // Use weighted average for better accuracy
        if (measurementCount > 0) {
            const avgDiff = weightedDiff / measurementCount;
            if (avgDiff < smallestDiff) {
                smallestDiff = avgDiff;
                bestSize = size;
            }
        }
    }
    
    // Adjust for body type
    if (bodyType === 'slim') {
        if (bestSize === 'M') bestSize = 'S';
        else if (bestSize === 'L') bestSize = 'M';
        else if (bestSize === 'XL') bestSize = 'L';
        else if (bestSize === 'XXL') bestSize = 'XL';
    } else if (bodyType === 'athletic') {
        if (bestSize === 'S') bestSize = 'M';
        else if (bestSize === 'M') bestSize = 'L';
        else if (bestSize === 'L') bestSize = 'XL';
        else if (bestSize === 'XL') bestSize = 'XXL';
    } else if (bodyType === 'plus') {
        if (bestSize === 'S') bestSize = 'M';
        else if (bestSize === 'M') bestSize = 'L';
        else if (bestSize === 'L') bestSize = 'XL';
        else if (bestSize === 'XL') bestSize = 'XXL';
    }
    
    return bestSize;
}

// Predict shirt/jacket size (letter sizing)
function predictShirtSize(measurements, chartMeasurements, gender, bodyType) {
    const chest = measurements.chest;
    
    if (!chest) {
        return 'M'; // Default size
    }
    
    // Convert chest from inches to cm if needed
    const chestCm = chest * 2.54; // Assuming input is in inches
    
    // Find the best matching size based on chest measurement
    const sizes = Object.keys(chartMeasurements.chest);
    let bestSize = 'M';
    let smallestDiff = Math.abs(chartMeasurements.chest['M'] - chestCm);
    
    for (const size of sizes) {
        const diff = Math.abs(chartMeasurements.chest[size] - chestCm);
        if (diff < smallestDiff) {
            smallestDiff = diff;
            bestSize = size;
        }
    }
    
    // Adjust for body type
    if (bodyType === 'slim') {
        if (bestSize === 'M') bestSize = 'S';
        else if (bestSize === 'L') bestSize = 'M';
    } else if (bodyType === 'athletic') {
        if (bestSize === 'S') bestSize = 'M';
        else if (bestSize === 'M') bestSize = 'L';
    } else if (bodyType === 'plus') {
        if (bestSize === 'M') bestSize = 'L';
        else if (bestSize === 'L') bestSize = 'XL';
    }
    
    return bestSize;
}

// API endpoint to get available garment types
app.get('/api/garment-types', (req, res) => {
    const garmentTypes = Object.keys(sizeCharts).map(key => ({
        id: key,
        name: sizeCharts[key].name,
        reference: sizeCharts[key].reference
    }));
    
    res.json({
        success: true,
        garmentTypes
    });
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Size Predictor server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to use the application`);
}); 