// script.js
// IMPORTANT: Replace MODEL_URL with the folder path where your Teachable Machine model's model.json lives.
// If you exported the model and placed it in a folder "model", set it to: './model/'
const MODEL_URL = '/model/';

let model, maxPredictions;
const webcamElement = document.getElementById('webcam');
const captureCanvas = document.getElementById('capture');
const previewImg = document.getElementById('preview');
const predictionText = document.getElementById('predictionText');
const remedyBox = document.getElementById('remedy');
const generatePdfBtn = document.getElementById('generatePdf');
const downloadPdfLink = document.getElementById('downloadPdf');
const phoneInput = document.getElementById('phoneNumber');

// NEW init() function - much simpler!
async function init() {
    const modelURL = MODEL_URL + "model.json";
    const metadataURL = MODEL_URL + "metadata.json";
    try {
        model = await tmImage.load(modelURL, metadataURL);
        console.log("Model loaded successfully!");
    } catch (e) {
        console.error("Failed to load model.", e);
        alert("Failed to load model. Check console.");
    }
}
init();

// --- Webcam handling ---
// script.js (UPDATED a small part of it)

// --- Webcam handling ---
let stream;
document.getElementById('startWebcam').addEventListener('click', async () => {
  if (navigator.mediaDevices?.getUserMedia) {
    // Show the camera view container
    document.querySelector('.camera-view').classList.add('active');
    
    // Start the video stream
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const webcamElement = document.getElementById('webcam');
    webcamElement.srcObject = stream;
  } else {
    alert('Webcam not supported in this browser.');
  }
});

// The rest of your script.js file stays the same...

document.getElementById('captureBtn').addEventListener('click', () => {
  captureCanvas.getContext('2d').drawImage(webcamElement, 0, 0, captureCanvas.width, captureCanvas.height);
  const dataUrl = captureCanvas.toDataURL('image/jpeg');
  previewImg.src = dataUrl;
  predictImageDataUrl(dataUrl);
});

document.getElementById('imageUpload').addEventListener('change', (ev) => {
  const f = ev.target.files[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onload = () => {
    previewImg.src = reader.result;
    predictImageDataUrl(reader.result);
  };
  reader.readAsDataURL(f);
});

// --- Prediction logic ---
// NEW predictImageDataUrl() function
async function predictImageDataUrl(dataUrl) {
    predictionText.innerText = 'Predicting...';
    remedyBox.innerHTML = '';

    // Create img element to feed the model
    const img = new Image();
    img.src = dataUrl;
    await new Promise(resolve => img.onload = resolve); // Wait for image to load

    // Predict
    const prediction = await model.predict(img);

    // Sort predictions by probability
    prediction.sort((a, b) => b.probability - a.probability);
    
    const top = prediction[0];
    const topLabel = top.className;
    const topProb = (top.probability * 100).toFixed(2);
    
    predictionText.innerText = `${topLabel} — ${topProb}%`;
    showRemedyForLabel(topLabel);

    // Save last prediction for PDF
    window.lastReport = {
        imageDataUrl: dataUrl,
        label: topLabel,
        confidence: topProb,
        results: prediction
    };
}

// --- Remedies DB (small sample). Replace or extend with your disease info ---
// script.js

// --- Expanded Remedies DB ---
// script.js (Corrected Version)

const DISEASE_DB = {
    'Healthy': {
        desc: 'The leaf appears to be in good health, with no visible signs of disease or pest infestation. The color is uniform and the structure is intact.',
        causes: 'Consistent care, proper watering, adequate sunlight, and nutrient-rich soil.',
        remedies_organic: 'Continue regular monitoring. Use compost and organic mulch to maintain soil health. Encourage beneficial insects.',
        remedies_chemical: 'No chemical treatment is necessary. Preventative, low-impact fungicides can be used if the plant is susceptible to future diseases.'
    },
    'Powdery Mildew': { // <-- Corrected Capitalization
        desc: 'A fungal disease characterized by white, powdery spots or patches on the leaves and stems. It can hinder photosynthesis and weaken the plant.',
        causes: 'High humidity at night and low humidity during the day. Poor air circulation and crowded planting are common contributing factors.',
        remedies_organic: 'Spray with a solution of baking soda (1 tbsp), horticultural oil (1 tsp), and water (1 gallon). Increase air circulation by pruning.',
        remedies_chemical: 'Apply fungicides containing sulfur, potassium bicarbonate, or myclobutanil. Follow label instructions carefully for application rates.'
    },
    'Leaf Blight': { // <-- Corrected Capitalization
        desc: 'A plant disease characterized by the rapid browning, death, and withering of leaves, stems, and flowers. Often appears as dark spots that grow quickly.',
        causes: 'Typically caused by fungal or bacterial pathogens, which thrive during periods of wet, humid weather. Spores can spread via wind and water splash.',
        remedies_organic: 'Remove and destroy infected plant parts immediately. Avoid overhead watering. Apply a copper-based fungicide as a preventative measure.',
        remedies_chemical: 'Use broad-spectrum fungicides containing chlorothalonil or mancozeb. Ensure thorough coverage of the plant, especially new growth.'
    },
    'Rust Disease': { // <-- Corrected Capitalization
        desc: 'Identified by small, reddish-orange to brown pustules that form on the undersides of leaves. These pustules contain powdery spores that can spread easily.',
        causes: 'Caused by various species of fungi. It is favored by moderate temperatures and moist conditions. Spores are easily spread by wind.',
        remedies_organic: 'Remove and discard infected leaves at the first sign. Dust with sulfur powder. Ensure good air circulation and water at the base of the plant.',
        remedies_chemical: 'Apply fungicides containing myclobutanil or propiconazole. A preventative spray program may be needed for susceptible plants.'
    },
    'Nutrient Deficiency': { // <-- Corrected Capitalization
        desc: 'Symptoms vary based on the missing nutrient. Common signs include yellowing leaves (chlorosis), stunted growth, and poor flowering or fruiting.',
        causes: 'Lack of essential nutrients in the soil, such as Nitrogen (N), Phosphorus (P), or Potassium (K). Incorrect soil pH can also prevent nutrient uptake.',
        remedies_organic: 'Conduct a soil test to identify the specific deficiency. Amend soil with compost, aged manure, or specific organic fertilizers like bone meal (for phosphorus) or kelp meal (for potassium).',
        remedies_chemical: 'Apply a balanced, water-soluble fertilizer (e.g., 10-10-10) for general deficiencies. For specific issues, use targeted fertilizers like ammonium sulfate (for nitrogen).'
    }
};

function showRemedyForLabel(label) {
  const info = DISEASE_DB[label] || {
    desc: 'No info found for this disease label. Add details to DISEASE_DB in script.js',
    remedy: 'N/A'
  };
  remedyBox.innerHTML = `<strong>Description:</strong> <div>${info.desc}</div><strong>Suggested Action:</strong><div>${info.remedy}</div>`;
}

// --- PDF generation ---
// script.js (UPDATED PDF GENERATION)

generatePdfBtn.addEventListener('click', async () => {
    if (!window.lastReport) { alert('No prediction available yet.'); return; }
    generatePdfBtn.disabled = true;
    generatePdfBtn.innerText = 'Generating...';

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });

    // --- PDF Theme and Settings ---
    const primaryColor = '#166534'; // Dark Green
    const secondaryColor = '#22c55e'; // Bright Green
    const textColor = '#333333';
    const margin = 30;
    const pageWidth = doc.internal.pageSize.getWidth();
    let currentY = 0;

    // --- Helper function to draw section titles ---
    function drawSectionTitle(title) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(primaryColor);
        doc.text(title, margin, currentY);
        currentY += 20;
    }

    // --- 1. PDF Header ---
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, pageWidth, 60, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor("#FFFFFF");
    doc.text("🌿 LeafSense AI Health Report", margin, 38);
    currentY = 85;

    // --- 2. Report Metadata ---
    doc.setFontSize(10);
    doc.setTextColor(textColor);
    doc.text(`Report ID: ${Date.now()}`, margin, currentY);
    doc.text(`Date: ${new Date().toLocaleString()}`, pageWidth - margin, currentY, { align: 'right' });
    currentY += 25;

    // --- 3. Analysis Summary (Two-Column Layout) ---
    drawSectionTitle("Analysis Summary");
    const summaryStartY = currentY;

    // Left Column: Image
    const imgData = window.lastReport.imageDataUrl;
    doc.addImage(imgData, 'JPEG', margin, currentY, 150, 150);
    
    // Right Column: Details
    // This is the corrected code with better alignment

// Right Column: Details
const textX = margin + 170;
const valueX = textX + 80; // We define a new, larger offset for all values

doc.setFont("helvetica", "bold");
doc.text("Prediction:", textX, currentY + 15);
doc.setFont("helvetica", "normal");
doc.text(window.lastReport.label, valueX, currentY + 15);

doc.setFont("helvetica", "bold");
doc.text("Confidence:", textX, currentY + 35);
doc.setFont("helvetica", "normal");
doc.text(`${window.lastReport.confidence}%`, valueX, currentY + 35);

doc.setFont("helvetica", "bold");
doc.text("Assessment:", textX, currentY + 55);
doc.setFont("helvetica", "normal");
const assessmentText = window.lastReport.label === 'Healthy' ? 'No action required.' : 'Action recommended.';
doc.text(assessmentText, valueX, currentY + 55);
    
    currentY = summaryStartY + 170; // Move Y position below the summary section

    // --- 4. Detailed Information ---
    const info = DISEASE_DB[window.lastReport.label] || {};
    function drawDetailSection(title, content) {
        if (!content) return;
        currentY += 10;
        drawSectionTitle(title);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(textColor);
        const textLines = doc.splitTextToSize(content, pageWidth - (margin * 2));
        doc.text(textLines, margin, currentY);
        currentY += (textLines.length * 12) + 10; // Adjust Y based on text lines
    }

    drawDetailSection("Description", info.desc);
    drawDetailSection("Common Causes", info.causes);
    drawDetailSection("Organic Remedies & Actions", info.remedies_organic);
    drawDetailSection("Chemical Treatments", info.remedies_chemical);
    
    // --- 5. Footer ---
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setLineWidth(1);
    doc.setDrawColor(primaryColor);
    doc.line(margin, pageHeight - 40, pageWidth - margin, pageHeight - 40);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor("#888888");
    doc.text("This report was generated by LeafSense AI. For critical issues, consult a professional.", margin, pageHeight - 25);
    doc.text("Page 1 of 1", pageWidth - margin, pageHeight - 25, { align: 'right' });


    // --- Finalize and alert user ---
    const pdfBlob = doc.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);

    downloadPdfLink.href = blobUrl;
    downloadPdfLink.style.display = 'inline-block';
    downloadPdfLink.innerText = 'Download PDF';
    window.lastPdfBlob = pdfBlob;

    generatePdfBtn.disabled = false;
    generatePdfBtn.innerText = 'Generate PDF Report';
    alert('Your professional PDF report is ready!');
});

// --- Send via Twilio (automatic) ---
// This will POST the PDF blob to your server for hosting and then ask the server to send via Twilio.
// The server endpoint must be implemented (see server code in README below).
document.getElementById('sendViaTwilio').addEventListener('click', async () => {
  if (!window.lastPdfBlob) { alert('No PDF generated. Click "Generate PDF" first.'); return; }
  const phone = phoneInput.value.trim();
  if (!phone) { alert('Enter recipient phone number with country code.'); return; }

  // upload PDF to server
  try {
    const form = new FormData();
    form.append('file', window.lastPdfBlob, 'plant_report.pdf');
    form.append('phone', phone);

    // CHANGE this URL to your running server
    const SERVER_URL = 'http://localhost:3000/send-report';

    const resp = await fetch(SERVER_URL, {
      method: 'POST',
      body: form
    });

    const data = await resp.json();
    if (!resp.ok) throw new Error(data?.error || 'Server error');

    alert('Report sent via WhatsApp. Server response: ' + (data.message || 'OK'));
  } catch (err) {
    console.error(err);
    alert('Failed to send via Twilio. See console. Make sure your server is running and configured.');
  }
});
