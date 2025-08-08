# Interactive Size Predictor

A modern, interactive web application that provides personalized size recommendations for clothing items using a 3-step process with visual feedback and color-coded fit analysis.

## 🎯 Features

### 3-Step Interactive Process

1. **Step 1: Select Item & Upload Image**
   - Choose from 5 different garment types (Jagvi Shirt, Short Sleeve, Hooded Jacket, Polar Overshirt, Pants)
   - Optional image upload for reference
   - Visual item cards with tags and descriptions

2. **Step 2: Size Chart & Selection**
   - Interactive size chart display
   - Visual size selection with hover effects
   - Detailed measurements for each size

3. **Step 3: Measurements & Fit Analysis**
   - Input basic information (height, weight, age, gender, body type)
   - Optional detailed measurements for higher accuracy
   - Real-time fit analysis with visual feedback

### Visual Fit Feedback

The system provides color-coded fit indicators:

- 🟢 **Green**: Comfortable fit
- 🟡 **Yellow**: Slightly tight
- 🔴 **Red**: Too tight — size up

### Smart Recommendations

- **Athletic Build**: Special considerations for shoulder and chest fit
- **Plus Size**: Optimized recommendations for comfortable fit
- **Body Type Specific**: Tailored advice based on slim, average, athletic, or plus size body types

### Advanced Features

- **Progress Tracking**: Visual step indicator
- **Image Upload**: Drag & drop or click to upload reference images
- **Alternative Sizes**: Suggestions for different fit preferences
- **Results Export**: Save fit analysis results
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd s-predictor
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## 📊 Supported Garment Types

### Shirts & Jackets
- **Jagvi Shirt (Long Sleeve)**: Premium formal shirt
- **Short Sleeve Shirt**: Casual comfortable shirt
- **Hooded Jacket**: Summer 2025 collection
- **Polar Overshirt**: Layering piece

### Pants
- **JAGVI.Rive Gauche Pants**: Premium tailored pants

## 🎨 User Interface

### Modern Design
- Clean, intuitive interface
- Smooth animations and transitions
- Color-coded feedback system
- Mobile-responsive design

### Interactive Elements
- Hover effects on item cards
- Visual size selection
- Real-time form validation
- Progress indicators

## 🔧 Technical Details

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript**: Vanilla JS with ES6+ features
- **Font Awesome**: Icons
- **Google Fonts**: Inter font family

### Backend
- **Node.js**: Server runtime
- **Express.js**: Web framework
- **CORS**: Cross-origin resource sharing

### Size Prediction Algorithm
- Multi-factor analysis based on:
  - Height and weight
  - Body type (slim, average, athletic, plus)
  - Detailed measurements (when provided)
  - Garment-specific size charts

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop computers (1200px+)
- Tablets (768px - 1199px)
- Mobile phones (320px - 767px)

## 🎯 Use Cases

### For Customers
- Get accurate size recommendations before purchasing
- Understand how different sizes will fit
- Save time and reduce returns
- Make informed purchasing decisions

### For Retailers
- Reduce return rates
- Improve customer satisfaction
- Provide better shopping experience
- Increase conversion rates

## 🔄 Workflow

1. **Item Selection**: User selects desired garment type
2. **Size Review**: User reviews size chart and selects preferred size
3. **Measurement Input**: User provides body measurements
4. **Analysis**: System analyzes fit and provides recommendations
5. **Results**: User receives visual feedback and alternative suggestions

## 🎨 Color Coding System

### Fit Indicators
- **Green (🟢)**: Perfect or comfortable fit
- **Yellow (🟡)**: Slightly tight but wearable
- **Red (🔴)**: Too tight, recommend sizing up

### UI Elements
- **Primary**: Purple gradient (#667eea to #764ba2)
- **Success**: Green (#48bb78)
- **Warning**: Orange (#ed8936)
- **Error**: Red (#e53e3e)

## 📈 Future Enhancements

- AI-powered image analysis for automatic measurements
- Integration with e-commerce platforms
- Machine learning for improved accuracy
- Multi-language support
- Advanced body scanning integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Built with ❤️ for better online shopping experiences** 