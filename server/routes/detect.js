const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Mock disease detection endpoint
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { image } = req.body;

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock response
        const mockDiseases = [
            {
                name: 'Powdery Mildew',
                confidence: 95.2,
                remedies: {
                    home: 'Mix 1 part milk with 9 parts water and spray on leaves daily.',
                    chemical: 'Use a fungicide containing Mancozeb or Copper. Follow label instructions.'
                }
            },
            {
                name: 'Leaf Spot',
                confidence: 88.5,
                remedies: {
                    home: 'Remove affected leaves and improve air circulation. Spray with neem oil solution.',
                    chemical: 'Apply Chlorothalonil-based fungicide every 7-10 days.'
                }
            },
            {
                name: 'Root Rot',
                confidence: 92.1,
                remedies: {
                    home: 'Reduce watering frequency and ensure proper drainage. Repot in fresh soil.',
                    chemical: 'Apply fungicide containing Thiophanate-methyl to soil.'
                }
            }
        ];

        // Randomly select a disease
        const disease = mockDiseases[Math.floor(Math.random() * mockDiseases.length)];

        res.json({
            ...disease,
            chemicalImage: 'https://placehold.co/100x100/F0F0F0/A0A0A0?text=Fungicide'
        });
    } catch (error) {
        console.error('Error in disease detection:', error);
        res.status(500).json({ error: 'Failed to detect disease' });
    }
});

module.exports = router;
