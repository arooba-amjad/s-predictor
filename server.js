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
            // Chest circumference (full, not half)
            'chestCircumference': { XS: 102, S: 106, M: 110, L: 114, XL: 118, XXL: 122 },
            // Shoulder width (shoulder length from chart)
            'shoulderWidth': { XS: 13.5, S: 14, M: 14.5, L: 15, XL: 15.5, XXL: 16 },
            // Sleeve length (sleeve total length with cuff)
            'sleeveLength': { XS: 65, S: 65.5, M: 66, L: 66.5, XL: 67, XXL: 67.5 },
            // Neck circumference (neck width from chart - needs to be converted to full circumference)
            'neckCircumference': { XS: 76, S: 78, M: 82, L: 86, XL: 90, XXL: 94 },
            // Arm circumference (armhole from chart)
            'armCircumference': { XS: 24, S: 25, M: 26, L: 27, XL: 28, XXL: 29 },
            // Additional measurements for compatibility
            'chestHalf': { XS: 51, S: 53, M: 55, L: 57, XL: 59, XXL: 61 },
            'waistHalf': { XS: 47, S: 49, M: 51, L: 53, XL: 55, XXL: 57 },
            'bottomHalf': { XS: 50, S: 52, M: 54, L: 56, XL: 58, XXL: 60 },
            'totalLength': { XS: 73, S: 74, M: 75, L: 76, XL: 77, XXL: 78 }
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
    'short-sleeves': {
        name: 'Short Sleeve Shirt',
        reference: 'For a man of 75 kgs and 1.83 cms height',
        measurements: {
            // Chest circumference (full, not half) - converted from chestHalf * 2
            'chestCircumference': { XS: 104, S: 108, M: 112, L: 116, XL: 120, XXL: 124 },
            // Shoulder width (shoulder length from chart)
            'shoulderWidth': { XS: 12.5, S: 13.25, M: 14, L: 14.75, XL: 15.5, XXL: 16.25 },
            // Sleeve length (sleeve total length)
            'sleeveLength': { XS: 23, S: 24, M: 25, L: 26, XL: 27, XXL: 28 },
            // Neck circumference (neck width from chart - needs to be converted to full circumference)
            'neckCircumference': { XS: 37, S: 38, M: 39, L: 40, XL: 41, XXL: 42 },
            // Arm circumference (armhole from chart)
            'armCircumference': { XS: 22.5, S: 23, M: 25, L: 24, XL: 24.5, XXL: 25 },
            // Additional measurements for compatibility
            'chestHalf': { XS: 52, S: 54, M: 56, L: 58, XL: 60, XXL: 62 },
            'waistHalf': { XS: 49, S: 51, M: 53, L: 55, XL: 57, XXL: 59 },
            'bottomHalf': { XS: 50, S: 52, M: 54, L: 56, XL: 58, XXL: 60 },
            'totalLength': { XS: 70, S: 71, M: 72, L: 73, XL: 74, XXL: 75 }
        },
        sizeRanges: {
            'XS': {
                chestCircumference: { min: 100, max: 107, tolerance: 3.5 },
                shoulderWidth: { min: 12, max: 13, tolerance: 0.5 },
                sleeveLength: { min: 22, max: 24, tolerance: 1.0 },
                neckCircumference: { min: 36, max: 38, tolerance: 1.0 },
                armCircumference: { min: 22, max: 23, tolerance: 0.5 }
            },
            'S': {
                chestCircumference: { min: 104, max: 111, tolerance: 3.5 },
                shoulderWidth: { min: 12.5, max: 13.5, tolerance: 0.5 },
                sleeveLength: { min: 23, max: 25, tolerance: 1.0 },
                neckCircumference: { min: 37, max: 39, tolerance: 1.0 },
                armCircumference: { min: 22.5, max: 23.5, tolerance: 0.5 }
            },
            'M': {
                chestCircumference: { min: 108, max: 115, tolerance: 3.5 },
                shoulderWidth: { min: 13.5, max: 14.5, tolerance: 0.5 },
                sleeveLength: { min: 24, max: 26, tolerance: 1.0 },
                neckCircumference: { min: 38, max: 40, tolerance: 1.0 },
                armCircumference: { min: 24, max: 26, tolerance: 1.0 }
            },
            'L': {
                chestCircumference: { min: 112, max: 119, tolerance: 3.5 },
                shoulderWidth: { min: 14.5, max: 15.5, tolerance: 0.5 },
                sleeveLength: { min: 25, max: 27, tolerance: 1.0 },
                neckCircumference: { min: 39, max: 41, tolerance: 1.0 },
                armCircumference: { min: 23.5, max: 24.5, tolerance: 0.5 }
            },
            'XL': {
                chestCircumference: { min: 116, max: 123, tolerance: 3.5 },
                shoulderWidth: { min: 15, max: 16, tolerance: 0.5 },
                sleeveLength: { min: 26, max: 28, tolerance: 1.0 },
                neckCircumference: { min: 40, max: 42, tolerance: 1.0 },
                armCircumference: { min: 24, max: 25, tolerance: 0.5 }
            },
            'XXL': {
                chestCircumference: { min: 120, max: 127, tolerance: 3.5 },
                shoulderWidth: { min: 15.5, max: 16.5, tolerance: 0.5 },
                sleeveLength: { min: 27, max: 29, tolerance: 1.0 },
                neckCircumference: { min: 41, max: 43, tolerance: 1.0 },
                armCircumference: { min: 24.5, max: 25.5, tolerance: 0.5 }
            }
        }
    },
    'pants': {
        name: 'Pants',
        reference: 'Accurate Size Chart (cm) - Based on PPsample measurements',
        measurements: {
            'waist': { '36': 37, '38': 39, '40': 41, '42': 43, '44': 45, '46': 47, 'PPsample': 45 },
            'seat': { '36': 47, '38': 49, '40': 51, '42': 53, '44': 55, '46': 57, 'PPsample': 55 },
            'thigh': { '36': 29.1, '38': 30.1, '40': 31.1, '42': 32.3, '44': 33.5, '46': 34.3, 'PPsample': 34 },
            'knee': { '36': 18.7, '38': 19.4, '40': 20.1, '42': 20.8, '44': 21.5, '46': 22.2, 'PPsample': 22.5 },
            'bottom': { '36': 15.5, '38': 16, '40': 16.5, '42': 17, '44': 17.5, '46': 18, 'PPsample': 18.5 },
            'frontcross': { '36': 18.5, '38': 19, '40': 19.5, '42': 20, '44': 20.5, '46': 21, 'PPsample': 20.5 },
            'backcross': { '36': 31.2, '38': 31.9, '40': 32.6, '42': 33.3, '44': 34, '46': 34.7, 'PPsample': 35 },
            'sleevelength': { '36': 104.6, '38': 105.2, '40': 105.8, '42': 106.4, '44': 107, '46': 107.6, 'PPsample': 107 },
            'pocketOpening': { '36': 17, '38': 17.25, '40': 17.5, '42': 17.75, '44': 18, '46': 18.25, 'PPsample': 18 }
        },
        // Size ranges and tolerances for better prediction
        sizeRanges: {
            '36': {
                waist: { min: 35, max: 39, tolerance: 2.0 },
                seat: { min: 45, max: 49, tolerance: 2.0 },
                thigh: { min: 28, max: 30, tolerance: 1.0 },
                knee: { min: 18, max: 19.5, tolerance: 0.8 },
                bottom: { min: 15, max: 16, tolerance: 0.5 }
            },
            '38': {
                waist: { min: 37, max: 41, tolerance: 2.0 },
                seat: { min: 47, max: 51, tolerance: 2.0 },
                thigh: { min: 29.5, max: 30.5, tolerance: 1.0 },
                knee: { min: 19, max: 19.8, tolerance: 0.8 },
                bottom: { min: 15.5, max: 16.5, tolerance: 0.5 }
            },
            '40': {
                waist: { min: 39, max: 43, tolerance: 2.0 },
                seat: { min: 49, max: 53, tolerance: 2.0 },
                thigh: { min: 30.5, max: 31.5, tolerance: 1.0 },
                knee: { min: 19.5, max: 20.5, tolerance: 0.8 },
                bottom: { min: 16, max: 17, tolerance: 0.5 }
            },
            '42': {
                waist: { min: 41, max: 45, tolerance: 2.0 },
                seat: { min: 51, max: 55, tolerance: 2.0 },
                thigh: { min: 31.8, max: 32.8, tolerance: 1.0 },
                knee: { min: 20.3, max: 21.3, tolerance: 0.8 },
                bottom: { min: 16.5, max: 17.5, tolerance: 0.5 }
            },
            '44': {
                waist: { min: 43, max: 47, tolerance: 2.0 },
                seat: { min: 53, max: 57, tolerance: 2.0 },
                thigh: { min: 33, max: 34, tolerance: 1.0 },
                knee: { min: 21, max: 22, tolerance: 0.8 },
                bottom: { min: 17, max: 18, tolerance: 0.5 }
            },
            '46': {
                waist: { min: 45, max: 49, tolerance: 2.0 },
                seat: { min: 55, max: 59, tolerance: 2.0 },
                thigh: { min: 33.8, max: 34.8, tolerance: 1.0 },
                knee: { min: 21.7, max: 22.7, tolerance: 0.8 },
                bottom: { min: 17.5, max: 18.5, tolerance: 0.5 }
            }
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
            // Chest circumference (full, not half) - converted from chestHalf * 2
            'chestCircumference': { XS: 108, S: 112, M: 116, L: 120, XL: 124, XXL: 128 },
            // Shoulder width (shoulder length from chart)
            'shoulderWidth': { XS: 14, S: 14.5, M: 15, L: 15.5, XL: 16, XXL: 16.5 },
            // Sleeve length (sleeve total length from chart)
            'sleeveLength': { XS: 65, S: 65.5, M: 66, L: 66.5, XL: 67, XXL: 67.5 },
            // Neck circumference (neck width from chart - needs to be converted to full circumference)
            'neckCircumference': { XS: 34, S: 36, M: 38, L: 40, XL: 42, XXL: 44 },
            // Arm circumference (armhole from chart)
            'armCircumference': { XS: 27, S: 28, M: 29, L: 30, XL: 31, XXL: 32 },
            // Additional measurements for compatibility (kept for now, but not primary)
            'chestHalf': { XS: 54, S: 56, M: 58, L: 60, XL: 62, XXL: 64 },
            'waistHalf': { XS: 52, S: 54, M: 56, L: 58, XL: 60, XXL: 62 },
            'bottomHalf': { XS: 53, S: 55, M: 57, L: 59, XL: 61, XXL: 63 },
            'totalLength': { XS: 71, S: 72, M: 73, L: 74, XL: 75, XXL: 76 },
            'shoulderLength': { XS: 14, S: 14.5, M: 15, L: 15.5, XL: 16, XXL: 16.5 }
        },
        sizeRanges: {
            'XS': {
                chestCircumference: { min: 104, max: 111, tolerance: 3.5 },
                shoulderWidth: { min: 13.5, max: 14.5, tolerance: 0.5 },
                sleeveLength: { min: 64, max: 66, tolerance: 1.0 },
                neckCircumference: { min: 33, max: 35, tolerance: 1.0 },
                armCircumference: { min: 26.5, max: 27.5, tolerance: 0.5 }
            },
            'S': {
                chestCircumference: { min: 108, max: 115, tolerance: 3.5 },
                shoulderWidth: { min: 14, max: 15, tolerance: 0.5 },
                sleeveLength: { min: 65, max: 66, tolerance: 1.0 },
                neckCircumference: { min: 35, max: 37, tolerance: 1.0 },
                armCircumference: { min: 27.5, max: 28.5, tolerance: 0.5 }
            },
            'M': {
                chestCircumference: { min: 112, max: 119, tolerance: 3.5 },
                shoulderWidth: { min: 14.5, max: 15.5, tolerance: 0.5 },
                sleeveLength: { min: 65.5, max: 66.5, tolerance: 1.0 },
                neckCircumference: { min: 37, max: 39, tolerance: 1.0 },
                armCircumference: { min: 28.5, max: 29.5, tolerance: 0.5 }
            },
            'L': {
                chestCircumference: { min: 116, max: 123, tolerance: 3.5 },
                shoulderWidth: { min: 15, max: 16, tolerance: 0.5 },
                sleeveLength: { min: 66, max: 67, tolerance: 1.0 },
                neckCircumference: { min: 39, max: 41, tolerance: 1.0 },
                armCircumference: { min: 29.5, max: 30.5, tolerance: 0.5 }
            },
            'XL': {
                chestCircumference: { min: 120, max: 127, tolerance: 3.5 },
                shoulderWidth: { min: 15.5, max: 16.5, tolerance: 0.5 },
                sleeveLength: { min: 66.5, max: 67.5, tolerance: 1.0 },
                neckCircumference: { min: 41, max: 43, tolerance: 1.0 },
                armCircumference: { min: 30.5, max: 31.5, tolerance: 0.5 }
            },
            'XXL': {
                chestCircumference: { min: 124, max: 131, tolerance: 3.5 },
                shoulderWidth: { min: 16, max: 17, tolerance: 0.5 },
                sleeveLength: { min: 67, max: 68, tolerance: 1.0 },
                neckCircumference: { min: 43, max: 45, tolerance: 1.0 },
                armCircumference: { min: 31.5, max: 32.5, tolerance: 0.5 }
            }
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
        const waistHalfCm = estimateWaistFromBMI(bmi, height, gender) * 2.54 / 2; // Convert to cm and get 1/2 waist
        const bottomHalfCm = waistHalfCm + 4; // Bottom 1/2 in cm, roughly waist 1/2 + 4cm
        const lengthCm = height * 0.58; // Length is typically 58% of height for pants
        
        estimatedMeasurements = {
            waist: waistHalfCm,
            bottom: bottomHalfCm,
            length: lengthCm
        };
    } else {
        // Estimate shirt/jacket measurements
        const chestInches = estimateChestFromBMI(bmi, height, gender);
        const waistInches = chestInches - 2; // Waist is typically 2 inches smaller than chest
        const hipsInches = chestInches + 1; // Hips are typically 1 inch larger than chest
        
        // Convert to cm for shirt measurements
        const chestCircumferenceCm = chestInches * 2.54; // Full chest circumference in cm
        const chestHalfCm = chestCircumferenceCm / 2; // Half chest for compatibility
        const waistHalfCm = (waistInches * 2.54) / 2; // Convert to cm and divide by 2
        const bottomHalfCm = (chestInches * 2.54) / 2 + 1; // Bottom is typically 1cm larger than chest
        const totalLengthCm = height * 0.42; // Total length is typically 42% of height
        const shoulderWidthCm = 12 + (height - 160) * 0.05; // Shoulder width based on height
        const sleeveLengthCm = height * 0.38; // Sleeve length is typically 38% of height
        const neckCircumferenceCm = chestCircumferenceCm * 0.75; // Neck is typically 75% of chest
        const armCircumferenceCm = chestCircumferenceCm * 0.25; // Arm is typically 25% of chest
        
        estimatedMeasurements = {
            chest: chestInches,
            waist: waistInches,
            hips: hipsInches,
            inseam: height * 0.45, // Inseam is typically 45% of height
            // New measurement names for Jagvi shirt
            chestCircumference: chestCircumferenceCm,
            shoulderWidth: shoulderWidthCm,
            sleeveLength: sleeveLengthCm,
            neckCircumference: neckCircumferenceCm,
            armCircumference: armCircumferenceCm,
            // New measurement names for short sleeve shirt
            chestHalfCm: chestHalfCm,
            waistHalfCm: waistHalfCm,
            shoulderWidthCm: shoulderWidthCm,
            sleeveLengthCm: sleeveLengthCm,
            neckCircumferenceCm: neckCircumferenceCm,
            totalLengthCm: totalLengthCm,
            // Legacy measurements for compatibility
            chestHalf: chestHalfCm,
            waistHalf: waistHalfCm,
            bottomHalf: bottomHalfCm,
            totalLength: totalLengthCm,
            shoulderLength: shoulderWidthCm
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
        ? (measurements.waist && measurements.thigh && measurements.bottom && measurements.length)
        : garmentType === 'short-sleeves'
        ? (measurements.chestCircumference && measurements.shoulderWidth && measurements.sleeveLength && measurements.neckCircumference && measurements.armCircumference && measurements.totalLength)
        : garmentType === 'jagvi-shirt'
        ? (measurements.chestCircumference && measurements.shoulderWidth && measurements.sleeveLength && measurements.neckCircumference && measurements.armCircumference && measurements.totalLength)
        : garmentType === 'hooded-jacket'
        ? (measurements.chestHalf || measurements.waistHalf || measurements.bottomHalf || measurements.shoulderLength || measurements.totalLength)
        : garmentType === 'polar-overshirt'
        ? (measurements.chestCircumference && measurements.shoulderWidth && measurements.sleeveLength && measurements.neckCircumference && measurements.armCircumference && measurements.totalLength)
        : (measurements.chest || measurements.waist);
    
    let finalMeasurements = measurements;
    let confidence = 85; // Base confidence
    
    // For jagvi-shirt, short-sleeves, polar-overshirt, and pants, measurements are compulsory - reject if missing
    if (garmentType === 'jagvi-shirt' && !hasDetailedMeasurements) {
        throw new Error('All measurements are required for Jagvi shirt size prediction. Please provide: chestCircumference, shoulderWidth, sleeveLength, neckCircumference, armCircumference, and totalLength.');
    }
    
    if (garmentType === 'short-sleeves' && !hasDetailedMeasurements) {
        throw new Error('All measurements are required for short sleeve shirt size prediction. Please provide: chestCircumference, shoulderWidth, sleeveLength, neckCircumference, armCircumference, and totalLength.');
    }
    
    if (garmentType === 'polar-overshirt' && !hasDetailedMeasurements) {
        throw new Error('All measurements are required for polar overshirt size prediction. Please provide: chestCircumference, shoulderWidth, sleeveLength, neckCircumference, armCircumference, and totalLength.');
    }
    
    if (garmentType === 'pants' && !hasDetailedMeasurements) {
        throw new Error('All measurements are required for pants size prediction. Please provide: waist, thigh, bottom, and length measurements.');
    }
    
    if (!hasDetailedMeasurements) {
        // Estimate measurements from basic info (for other garment types)
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
        console.log('=== SHORT SLEEVE SHIRT PREDICTION ===');
        console.log('Input measurements:', finalMeasurements);
        console.log('Chart measurements:', chartMeasurements);
        console.log('Gender:', gender, 'Body type:', bodyType);
        predictedSize = predictShortSleeveSize(finalMeasurements, chartMeasurements, gender, bodyType);
        console.log('Predicted size:', predictedSize);
        console.log('=== END SHORT SLEEVE SHIRT PREDICTION ===');
    } else if (garmentType === 'jagvi-shirt') {
        // Long sleeve sizing logic (uses letter sizes)
        console.log('=== JAGVI SHIRT PREDICTION ===');
        console.log('Input measurements:', finalMeasurements);
        console.log('Chart measurements:', chartMeasurements);
        console.log('Gender:', gender, 'Body type:', bodyType);
        predictedSize = predictLongSleeveSize(finalMeasurements, chartMeasurements, gender, bodyType);
        console.log('Predicted size:', predictedSize);
        console.log('=== END JAGVI SHIRT PREDICTION ===');
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
        // For pants, all measurements are required, so we always have maximum confidence
        if (measurements.waist && measurements.thigh && measurements.bottom && measurements.length) {
            confidence += 30; // Maximum confidence for all four measurements
        } else {
            // This should never happen due to validation above, but just in case
            confidence = 0; // No confidence if measurements are missing
        }
    } else if (garmentType === 'short-sleeves') {
        // For short-sleeves, all measurements are required, so we always have maximum confidence
        if (measurements.chestCircumference && measurements.shoulderWidth && measurements.sleeveLength && measurements.neckCircumference && measurements.armCircumference && measurements.totalLength) {
            confidence += 30; // Maximum confidence for all six measurements
        } else {
            // This should never happen due to validation above, but just in case
            confidence = 0; // No confidence if measurements are missing
        }
    } else if (garmentType === 'jagvi-shirt') {
        // For jagvi-shirt, all measurements are required, so we always have maximum confidence
        if (measurements.chestCircumference && measurements.shoulderWidth && measurements.sleeveLength && measurements.neckCircumference && measurements.armCircumference && measurements.totalLength) {
            confidence += 30; // Maximum confidence for all six measurements
        } else {
            // This should never happen due to validation above, but just in case
            confidence = 0; // No confidence if measurements are missing
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
        // For polar-overshirt, all measurements are required, so we always have maximum confidence
        if (measurements.chestCircumference && measurements.shoulderWidth && measurements.sleeveLength && measurements.neckCircumference && measurements.armCircumference && measurements.totalLength) {
            confidence += 30; // Maximum confidence for all six measurements
        } else {
            // This should never happen due to validation above, but just in case
            confidence = 0; // No confidence if measurements are missing
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
        recommendations.push('For pants, all measurements (waist, thigh, bottom, length) are required for accurate size prediction');
        if (finalMeasurements.waist && finalMeasurements.thigh && finalMeasurements.bottom && finalMeasurements.length) {
            recommendations.push('All four measurements ensure the perfect fit for your body proportions');
        }
        recommendations.push('Thigh measurement is crucial for comfortable fit around the legs');
        recommendations.push('Length measurement ensures proper fit for your height');
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
            bottom: finalMeasurements.bottom,
            thigh: finalMeasurements.thigh,
            // Include shirt specific measurements if available
            chestHalf: finalMeasurements.chestHalf,
            waistHalf: finalMeasurements.waistHalf,
            bottomHalf: finalMeasurements.bottomHalf,
            shoulderLength: finalMeasurements.shoulderLength,
            totalLength: finalMeasurements.totalLength
        }
    };
}

// Predict pants size (numeric sizing) - Updated algorithm based on new chart
function predictPantsSize(measurements, chartMeasurements, gender, bodyType) {
    const waist = measurements.waist;
    const thigh = measurements.thigh;
    const bottom = measurements.bottom;
    const length = measurements.length;
    
    // For pants, all measurements are required for accurate prediction
    if (!waist || !thigh || !bottom || !length) {
        throw new Error('All measurements are required for pants size prediction. Please provide: waist, thigh, bottom, and length measurements.');
    }
    
    // Find the best matching size based on all measurements
    const sizes = Object.keys(chartMeasurements.waist).filter(size => size !== 'PPsample'); // Exclude PPsample
    let bestSize = '40'; // Default size
    let smallestDiff = Infinity;
    
    for (const size of sizes) {
        let totalDiff = 0;
        let measurementCount = 0;
        let weightedDiff = 0;
        
        // Compare waist measurement (35% weight - most important)
        if (waist && chartMeasurements.waist[size]) {
            const waistDiff = Math.abs(chartMeasurements.waist[size] - waist);
            totalDiff += waistDiff;
            weightedDiff += waistDiff * 0.35;
            measurementCount++;
        }
        
        // Compare thigh measurement (30% weight - second most important)
        if (thigh && chartMeasurements.thigh[size]) {
            const thighDiff = Math.abs(chartMeasurements.thigh[size] - thigh);
            totalDiff += thighDiff;
            weightedDiff += thighDiff * 0.30;
            measurementCount++;
        }
        
        // Compare bottom measurement (20% weight)
        if (bottom && chartMeasurements.bottom[size]) {
            const bottomDiff = Math.abs(chartMeasurements.bottom[size] - bottom);
            totalDiff += bottomDiff;
            weightedDiff += bottomDiff * 0.20;
            measurementCount++;
        }
        
        // Compare length measurement (15% weight)
        if (length && chartMeasurements.sleevelength[size]) {
            const lengthDiff = Math.abs(chartMeasurements.sleevelength[size] - length);
            totalDiff += lengthDiff;
            weightedDiff += lengthDiff * 0.15;
            measurementCount++;
        }
        
        // Use weighted difference for better accuracy
        if (measurementCount > 0) {
            if (weightedDiff < smallestDiff) {
                smallestDiff = weightedDiff;
                bestSize = size;
            }
        }
    }
    
    // Adjust for body type with more precise logic
    if (bodyType === 'slim') {
        // For slim body type, go down one size
        const sizeOrder = ['36', '38', '40', '42', '44', '46'];
        const currentIndex = sizeOrder.indexOf(bestSize);
        if (currentIndex > 0) {
            bestSize = sizeOrder[currentIndex - 1];
        }
    } else if (bodyType === 'athletic') {
        // For athletic body type, go up one size (especially for thighs)
        const sizeOrder = ['36', '38', '40', '42', '44', '46'];
        const currentIndex = sizeOrder.indexOf(bestSize);
        if (currentIndex < sizeOrder.length - 1) {
            bestSize = sizeOrder[currentIndex + 1];
        }
    } else if (bodyType === 'plus') {
        // For plus body type, go up one size
        const sizeOrder = ['36', '38', '40', '42', '44', '46'];
        const currentIndex = sizeOrder.indexOf(bestSize);
        if (currentIndex < sizeOrder.length - 1) {
            bestSize = sizeOrder[currentIndex + 1];
        }
    }
    
    return bestSize;
}

// Predict short sleeve size based on new measurements
function predictShortSleeveSize(measurements, chartMeasurements, gender, bodyType) {
    const chestCircumference = measurements.chestCircumference;
    const shoulderWidth = measurements.shoulderWidth;
    const sleeveLength = measurements.sleeveLength;
    const neckCircumference = measurements.neckCircumference;
    const armCircumference = measurements.armCircumference;
    const totalLength = measurements.totalLength;
    
    console.log('predictShortSleeveSize called with measurements:', measurements);
    console.log('Chart measurements:', chartMeasurements);
    
    if (!chestCircumference && !shoulderWidth && !sleeveLength && !neckCircumference && !armCircumference && !totalLength) {
        return 'M'; // Default size
    }
    
    // Find the best matching size based on all measurements
    const sizes = Object.keys(chartMeasurements.chestCircumference);
    let bestSize = 'M';
    let smallestDiff = Infinity;
    
    console.log('Available sizes:', sizes);
    console.log('Starting size analysis...');
    
    for (const size of sizes) {
        let totalDiff = 0;
        let measurementCount = 0;
        let weightedDiff = 0;
        
        // Compare chest circumference (primary measurement - 25% weight)
        if (chestCircumference && chartMeasurements.chestCircumference[size]) {
            const chestDiff = Math.abs(chartMeasurements.chestCircumference[size] - chestCircumference);
            totalDiff += chestDiff;
            weightedDiff += chestDiff * 0.25;
            measurementCount++;
            console.log(`  Chest: user=${chestCircumference}, chart=${chartMeasurements.chestCircumference[size]}, diff=${chestDiff.toFixed(2)}`);
        }
        
        // Compare shoulder width (25% weight)
        if (shoulderWidth && chartMeasurements.shoulderWidth[size]) {
            const shoulderDiff = Math.abs(chartMeasurements.shoulderWidth[size] - shoulderWidth);
            totalDiff += shoulderDiff;
            weightedDiff += shoulderDiff * 0.25;
            measurementCount++;
            console.log(`  Shoulder: user=${shoulderWidth}, chart=${chartMeasurements.shoulderWidth[size]}, diff=${shoulderDiff.toFixed(2)}`);
        }
        
        // Compare sleeve length (20% weight)
        if (sleeveLength && chartMeasurements.sleeveLength[size]) {
            const sleeveDiff = Math.abs(chartMeasurements.sleeveLength[size] - sleeveLength);
            totalDiff += sleeveDiff;
            weightedDiff += sleeveDiff * 0.20;
            measurementCount++;
            console.log(`  Sleeve: user=${sleeveLength}, chart=${chartMeasurements.sleeveLength[size]}, diff=${sleeveDiff.toFixed(2)}`);
        }
        
        // Compare neck circumference (15% weight)
        if (neckCircumference && chartMeasurements.neckCircumference[size]) {
            const neckDiff = Math.abs(chartMeasurements.neckCircumference[size] - neckCircumference);
            totalDiff += neckDiff;
            weightedDiff += neckDiff * 0.15;
            measurementCount++;
            console.log(`  Neck: user=${neckCircumference}, chart=${chartMeasurements.neckCircumference[size]}, diff=${neckDiff.toFixed(2)}`);
        }
        
        // Compare arm circumference (10% weight)
        if (armCircumference && chartMeasurements.armCircumference[size]) {
            const armDiff = Math.abs(chartMeasurements.armCircumference[size] - armCircumference);
            totalDiff += armDiff;
            weightedDiff += armDiff * 0.10;
            measurementCount++;
            console.log(`  Arm: user=${armCircumference}, chart=${chartMeasurements.armCircumference[size]}, diff=${armDiff.toFixed(2)}`);
        }
        
        // Compare total length (10% weight)
        if (totalLength && chartMeasurements.totalLength[size]) {
            const lengthDiff = Math.abs(chartMeasurements.totalLength[size] - totalLength);
            totalDiff += lengthDiff;
            weightedDiff += lengthDiff * 0.10;
            measurementCount++;
            console.log(`  Length: user=${totalLength}, chart=${chartMeasurements.totalLength[size]}, diff=${lengthDiff.toFixed(2)}`);
        }
        
        console.log(`  Size ${size}: weightedDiff=${weightedDiff.toFixed(2)}, measurementCount=${measurementCount}`);
        
        // Use weighted difference directly (FIXED: no division by measurementCount)
        if (measurementCount > 0) {
            if (weightedDiff < smallestDiff) {
                smallestDiff = weightedDiff;
                bestSize = size;
                console.log(`  -> New best size: ${size} (weightedDiff: ${weightedDiff.toFixed(2)})`);
            }
        }
    }
    
    console.log(`Final best size: ${bestSize} (smallestDiff: ${smallestDiff.toFixed(2)})`);
    
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
    
    console.log(`Final size after body type adjustment: ${bestSize}`);
    return bestSize;
}

// Predict long sleeve size based on new measurements
function predictLongSleeveSize(measurements, chartMeasurements, gender, bodyType) {
    const chestCircumference = measurements.chestCircumference;
    const shoulderWidth = measurements.shoulderWidth;
    const sleeveLength = measurements.sleeveLength;
    const neckCircumference = measurements.neckCircumference;
    const armCircumference = measurements.armCircumference;
    const totalLength = measurements.totalLength;
    
    console.log('predictLongSleeveSize called with measurements:', measurements);
    console.log('Chart measurements:', chartMeasurements);
    
    if (!chestCircumference && !shoulderWidth && !sleeveLength && !neckCircumference && !armCircumference && !totalLength) {
        return 'M'; // Default size
    }
    
    // Find the best matching size based on all measurements
    const sizes = Object.keys(chartMeasurements.chestCircumference);
    let bestSize = 'M';
    let smallestDiff = Infinity;
    
    console.log('Available sizes:', sizes);
    console.log('Starting size analysis...');
    
    for (const size of sizes) {
        let totalDiff = 0;
        let measurementCount = 0;
        let weightedDiff = 0;
        
        // Compare chest circumference (primary measurement - 25% weight)
        if (chestCircumference && chartMeasurements.chestCircumference[size]) {
            const chestDiff = Math.abs(chartMeasurements.chestCircumference[size] - chestCircumference);
            totalDiff += chestDiff;
            weightedDiff += chestDiff * 0.25;
            measurementCount++;
            console.log(`  Chest: user=${chestCircumference}, chart=${chartMeasurements.chestCircumference[size]}, diff=${chestDiff.toFixed(2)}`);
        }
        
        // Compare shoulder width (25% weight)
        if (shoulderWidth && chartMeasurements.shoulderWidth[size]) {
            const shoulderDiff = Math.abs(chartMeasurements.shoulderWidth[size] - shoulderWidth);
            totalDiff += shoulderDiff;
            weightedDiff += shoulderDiff * 0.25;
            measurementCount++;
            console.log(`  Shoulder: user=${shoulderWidth}, chart=${chartMeasurements.shoulderWidth[size]}, diff=${shoulderDiff.toFixed(2)}`);
        }
        
        // Compare sleeve length (20% weight)
        if (sleeveLength && chartMeasurements.sleeveLength[size]) {
            const sleeveDiff = Math.abs(chartMeasurements.sleeveLength[size] - sleeveLength);
            totalDiff += sleeveDiff;
            weightedDiff += sleeveDiff * 0.20;
            measurementCount++;
            console.log(`  Sleeve: user=${sleeveLength}, chart=${chartMeasurements.sleeveLength[size]}, diff=${sleeveDiff.toFixed(2)}`);
        }
        
        // Compare neck circumference (15% weight)
        if (neckCircumference && chartMeasurements.neckCircumference[size]) {
            const neckDiff = Math.abs(chartMeasurements.neckCircumference[size] - neckCircumference);
            totalDiff += neckDiff;
            weightedDiff += neckDiff * 0.15;
            measurementCount++;
            console.log(`  Neck: user=${neckCircumference}, chart=${chartMeasurements.neckCircumference[size]}, diff=${neckDiff.toFixed(2)}`);
        }
        
        // Compare arm circumference (10% weight)
        if (armCircumference && chartMeasurements.armCircumference[size]) {
            const armDiff = Math.abs(chartMeasurements.armCircumference[size] - armCircumference);
            totalDiff += armDiff;
            weightedDiff += armDiff * 0.10;
            measurementCount++;
            console.log(`  Arm: user=${armCircumference}, chart=${chartMeasurements.armCircumference[size]}, diff=${armDiff.toFixed(2)}`);
        }
        
        // Compare total length (10% weight)
        if (totalLength && chartMeasurements.totalLength[size]) {
            const lengthDiff = Math.abs(chartMeasurements.totalLength[size] - totalLength);
            totalDiff += lengthDiff;
            weightedDiff += lengthDiff * 0.10;
            measurementCount++;
            console.log(`  Length: user=${totalLength}, chart=${chartMeasurements.totalLength[size]}, diff=${lengthDiff.toFixed(2)}`);
        }
        
        // Use weighted average for better accuracy
        if (measurementCount > 0) {
            // Don't divide by measurementCount - use weightedDiff directly
            // This ensures the weights are properly applied
            console.log(`  Size ${size} summary: totalDiff=${totalDiff.toFixed(2)}, weightedDiff=${weightedDiff.toFixed(2)}, measurementCount=${measurementCount}`);
            if (weightedDiff < smallestDiff) {
                console.log(`    -> NEW BEST SIZE: ${size} (previous: ${bestSize}, diff: ${smallestDiff.toFixed(2)} -> ${weightedDiff.toFixed(2)})`);
                smallestDiff = weightedDiff;
                bestSize = size;
            } else {
                console.log(`    -> Keeping current best: ${bestSize} (diff: ${smallestDiff.toFixed(2)})`);
            }
        }
    }
    
    console.log(`\n=== FINAL ANALYSIS ===`);
    console.log(`Best size: ${bestSize}`);
    console.log(`Smallest weighted difference: ${smallestDiff.toFixed(2)}`);
    console.log(`This means the measurements best match size ${bestSize}`);
    console.log(`=== END ANALYSIS ===\n`);
    
    // Adjust for body type
    console.log(`Body type adjustment: ${bodyType}`);
    if (bodyType === 'slim') {
        if (bestSize === 'M') bestSize = 'S';
        else if (bestSize === 'L') bestSize = 'M';
        else if (bestSize === 'XL') bestSize = 'L';
        else if (bestSize === 'XXL') bestSize = 'XL';
        console.log(`  Slim adjustment: ${bestSize}`);
    } else if (bodyType === 'athletic') {
        if (bestSize === 'S') bestSize = 'M';
        else if (bestSize === 'M') bestSize = 'L';
        else if (bestSize === 'L') bestSize = 'XL';
        else if (bestSize === 'XL') bestSize = 'XXL';
        console.log(`  Athletic adjustment: ${bestSize}`);
    } else if (bodyType === 'plus') {
        if (bestSize === 'S') bestSize = 'M';
        else if (bestSize === 'M') bestSize = 'L';
        else if (bestSize === 'L') bestSize = 'XL';
        else if (bestSize === 'XL') bestSize = 'XXL';
        console.log(`  Plus adjustment: ${bestSize}`);
    } else {
        console.log(`  No body type adjustment needed`);
    }
    
    console.log(`Final best size after body type adjustment: ${bestSize}`);
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
    const chestCircumference = measurements.chestCircumference;
    const shoulderWidth = measurements.shoulderWidth;
    const sleeveLength = measurements.sleeveLength;
    const neckCircumference = measurements.neckCircumference;
    const armCircumference = measurements.armCircumference;
    const totalLength = measurements.totalLength;
    
    if (!chestCircumference && !shoulderWidth && !sleeveLength && !neckCircumference && !armCircumference && !totalLength) {
        return 'M'; // Default size
    }
    
    // Find the best matching size based on all measurements
    const sizes = Object.keys(chartMeasurements.chestCircumference);
    let bestSize = 'M';
    let smallestDiff = Infinity;
    
    for (const size of sizes) {
        let totalDiff = 0;
        let measurementCount = 0;
        let weightedDiff = 0;
        
        // Compare chest circumference (primary measurement - 25% weight)
        if (chestCircumference && chartMeasurements.chestCircumference[size]) {
            const chestDiff = Math.abs(chartMeasurements.chestCircumference[size] - chestCircumference);
            totalDiff += chestDiff;
            weightedDiff += chestDiff * 0.25;
            measurementCount++;
            console.log(`  Chest: user=${chestCircumference}, chart=${chartMeasurements.chestCircumference[size]}, diff=${chestDiff.toFixed(2)}`);
        }
        
        // Compare shoulder width (25% weight)
        if (shoulderWidth && chartMeasurements.shoulderWidth[size]) {
            const shoulderDiff = Math.abs(chartMeasurements.shoulderWidth[size] - shoulderWidth);
            totalDiff += shoulderDiff;
            weightedDiff += shoulderDiff * 0.25;
            measurementCount++;
            console.log(`  Shoulder: user=${shoulderWidth}, chart=${chartMeasurements.shoulderWidth[size]}, diff=${shoulderDiff.toFixed(2)}`);
        }
        
        // Compare sleeve length (20% weight)
        if (sleeveLength && chartMeasurements.sleeveLength[size]) {
            const sleeveDiff = Math.abs(chartMeasurements.sleeveLength[size] - sleeveLength);
            totalDiff += sleeveDiff;
            weightedDiff += sleeveDiff * 0.20;
            measurementCount++;
            console.log(`  Sleeve: user=${sleeveLength}, chart=${chartMeasurements.sleeveLength[size]}, diff=${sleeveDiff.toFixed(2)}`);
        }
        
        // Compare neck circumference (15% weight)
        if (neckCircumference && chartMeasurements.neckCircumference[size]) {
            const neckDiff = Math.abs(chartMeasurements.neckCircumference[size] - neckCircumference);
            totalDiff += neckDiff;
            weightedDiff += neckDiff * 0.15;
            measurementCount++;
            console.log(`  Neck: user=${neckCircumference}, chart=${chartMeasurements.neckCircumference[size]}, diff=${neckDiff.toFixed(2)}`);
        }
        
        // Compare arm circumference (10% weight)
        if (armCircumference && chartMeasurements.armCircumference[size]) {
            const armDiff = Math.abs(chartMeasurements.armCircumference[size] - armCircumference);
            totalDiff += armDiff;
            weightedDiff += armDiff * 0.10;
            measurementCount++;
            console.log(`  Arm: user=${armCircumference}, chart=${chartMeasurements.armCircumference[size]}, diff=${armDiff.toFixed(2)}`);
        }
        
        // Compare total length (5% weight)
        if (totalLength && chartMeasurements.totalLength[size]) {
            const lengthDiff = Math.abs(chartMeasurements.totalLength[size] - totalLength);
            totalDiff += lengthDiff;
            weightedDiff += lengthDiff * 0.05;
            measurementCount++;
            console.log(`  Length: user=${totalLength}, chart=${chartMeasurements.totalLength[size]}, diff=${lengthDiff.toFixed(2)}`);
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