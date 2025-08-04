# Size Predictor

A modern, AI-powered size prediction application that can be embedded as an iframe on any website. Built with Node.js, Express, and a beautiful grey and white theme.

## Features

- 🎯 **Accurate Size Prediction**: Advanced algorithm based on height, weight, age, gender, and body measurements
- 🎨 **Beautiful UI**: Modern grey and white theme with smooth animations
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- 🔄 **Iframe Ready**: Designed to be embedded seamlessly in any website
- ⚡ **Fast Performance**: Optimized for quick loading and smooth interactions
- 🛡️ **Input Validation**: Comprehensive form validation with real-time feedback
- 📊 **Confidence Scoring**: Shows prediction confidence with visual indicators
- 💡 **Smart Recommendations**: Personalized fitting recommendations

## Live Demo

Once deployed, your application will be available at: `https://your-app-name.onrender.com`

## Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone or download this repository
2. Navigate to the project directory:
   ```bash
   cd size-predictor
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:3000`

## Deployment on Render

### Option 1: Automatic Deployment (Recommended)

1. Fork or clone this repository to your GitHub account
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New +" and select "Web Service"
4. Connect your GitHub repository
5. Configure the service:
   - **Name**: `size-predictor` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose a paid plan for better performance)

6. Click "Create Web Service"
7. Render will automatically deploy your application

### Option 2: Manual Deployment

1. Create a new Web Service on Render
2. Upload your code or connect your repository
3. Use the same configuration as above

## Iframe Integration

Once deployed, you can embed the size predictor on any website using an iframe:

### Basic Integration

```html
<iframe 
    src="https://your-app-name.onrender.com" 
    width="100%" 
    height="800px" 
    frameborder="0"
    scrolling="no">
</iframe>
```

### Responsive Integration

```html
<div style="position: relative; padding-bottom: 100%; height: 0; overflow: hidden;">
    <iframe 
        src="https://your-app-name.onrender.com" 
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
        scrolling="no">
    </iframe>
</div>
```

### Dynamic Height Integration

```html
<iframe 
    id="sizePredictor"
    src="https://your-app-name.onrender.com" 
    width="100%" 
    height="600px" 
    frameborder="0"
    scrolling="no">
</iframe>

<script>
// Listen for resize messages from the iframe
window.addEventListener('message', function(event) {
    if (event.data.type === 'resize') {
        document.getElementById('sizePredictor').style.height = event.data.height + 'px';
    }
});
</script>
```

## API Endpoints

### POST /api/predict-size

Predicts clothing size based on user measurements.

**Request Body:**
```json
{
    "gender": "male|female",
    "age": 25,
    "height": 175,
    "weight": 70,
    "bodyType": "slim|average|athletic|plus",
    "measurements": {
        "chest": 38,
        "waist": 32,
        "hips": 40,
        "inseam": 32
    }
}
```

**Response:**
```json
{
    "success": true,
    "predictedSize": {
        "size": "M",
        "confidence": 90,
        "recommendations": [
            "Consider trying on multiple sizes for the best fit"
        ],
        "measurements": {
            "chest": 38,
            "waist": 32,
            "hips": 40,
            "inseam": 32
        }
    }
}
```

### GET /health

Health check endpoint for monitoring.

**Response:**
```json
{
    "status": "OK",
    "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Size Prediction Algorithm

The application uses a sophisticated algorithm that considers:

1. **Basic Measurements**: Height, weight, age, and gender
2. **Body Type**: Slim, average, athletic, or plus size
3. **Detailed Measurements**: Chest/bust, waist, hips, and inseam
4. **BMI Calculation**: Body Mass Index for additional context
5. **Confidence Scoring**: Based on data completeness and quality

### Size Ranges

**Male Sizes:**
- XS: Chest < 36"
- S: Chest 36-38"
- M: Chest 38-42"
- L: Chest 42-46"
- XL: Chest 46-50"
- XXL: Chest > 50"

**Female Sizes:**
- XS: Bust < 32"
- S: Bust 32-34"
- M: Bust 34-38"
- L: Bust 38-42"
- XL: Bust 42-46"
- XXL: Bust > 46"

## Customization

### Styling

The application uses CSS custom properties for easy theming. Main colors:

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --background-color: #f5f7fa;
    --text-color: #2d3748;
    --border-color: #e2e8f0;
}
```

### Configuration

You can modify the size prediction algorithm in `server.js` by adjusting the `predictSize` function.

## Performance Optimization

- **Lazy Loading**: Images and non-critical resources are loaded on demand
- **Minification**: CSS and JavaScript are optimized for production
- **Caching**: Static assets are cached for better performance
- **Compression**: Gzip compression for faster loading

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

## Changelog

### Version 1.0.0
- Initial release
- Size prediction algorithm
- Responsive design
- Iframe integration
- API endpoints
- Health monitoring 