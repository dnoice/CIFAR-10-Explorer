/**
 * CIFAR-10 Explorer - Main Application Script
 * A professional interface for working with the CIFAR-10 dataset
 * Version: 1.0.0
 */

document.addEventListener('DOMContentLoaded', function() {
    /**
     * Configuration and Constants
     * ===========================
     */
    const config = {
        categories: [
            { name: 'airplane', icon: 'fas fa-plane', trainCount: 5000, testCount: 1000, color: '#3b82f6' },
            { name: 'automobile', icon: 'fas fa-car', trainCount: 5000, testCount: 1000, color: '#ef4444' },
            { name: 'bird', icon: 'fas fa-dove', trainCount: 5000, testCount: 1000, color: '#10b981' },
            { name: 'cat', icon: 'fas fa-cat', trainCount: 5000, testCount: 1000, color: '#f59e0b' },
            { name: 'deer', icon: 'fas fa-deer', trainCount: 5000, testCount: 1000, color: '#8b5cf6' },
            { name: 'dog', icon: 'fas fa-dog', trainCount: 5000, testCount: 1000, color: '#ec4899' },
            { name: 'frog', icon: 'fas fa-frog', trainCount: 5000, testCount: 1000, color: '#14b8a6' },
            { name: 'horse', icon: 'fas fa-horse', trainCount: 5000, testCount: 1000, color: '#a16207' },
            { name: 'ship', icon: 'fas fa-ship', trainCount: 5000, testCount: 1000, color: '#0ea5e9' },
            { name: 'truck', icon: 'fas fa-truck', trainCount: 5000, testCount: 1000, color: '#64748b' }
        ],
        baseUrl: 'datasets/cifar-10/images/',
        defaultSet: 'train',
        storagePrefixKey: 'cifar10explorer_',
        networkArchitectures: {
            cnn: {
                description: 'A basic Convolutional Neural Network with 3 convolutional layers followed by fully connected layers. Good for beginners and quick experiments.',
                parameters: 1200000,
                layers: [
                    { type: 'Input', shape: [32, 32, 3], parameters: 0 },
                    { type: 'Conv2D', filters: 32, kernelSize: '3x3', activation: 'ReLU', parameters: 896 },
                    { type: 'MaxPooling2D', size: '2x2', parameters: 0 },
                    { type: 'Conv2D', filters: 64, kernelSize: '3x3', activation: 'ReLU', parameters: 18496 },
                    { type: 'MaxPooling2D', size: '2x2', parameters: 0 },
                    { type: 'Conv2D', filters: 64, kernelSize: '3x3', activation: 'ReLU', parameters: 36928 },
                    { type: 'Flatten', parameters: 0 },
                    { type: 'Dense', units: 64, activation: 'ReLU', parameters: 262208 },
                    { type: 'Dense', units: 10, activation: 'Softmax', parameters: 650 }
                ]
            },
            resnet: {
                description: 'A ResNet-based architecture with residual connections for better gradient flow. Good for deeper networks and higher accuracy.',
                parameters: 11000000,
                layers: [
                    { type: 'Input', shape: [32, 32, 3], parameters: 0 },
                    { type: 'Conv2D', filters: 64, kernelSize: '7x7', activation: 'ReLU', parameters: 9472 },
                    { type: 'MaxPooling2D', size: '3x3', parameters: 0 },
                    { type: 'ResBlock', filters: 64, parameters: 74240 },
                    { type: 'ResBlock', filters: 64, parameters: 74240 },
                    { type: 'ResBlock', filters: 128, parameters: 230144 },
                    { type: 'ResBlock', filters: 128, parameters: 295424 },
                    { type: 'ResBlock', filters: 256, parameters: 919552 },
                    { type: 'ResBlock', filters: 256, parameters: 1180160 },
                    { type: 'GlobalAvgPool', parameters: 0 },
                    { type: 'Dense', units: 10, activation: 'Softmax', parameters: 2570 }
                ]
            },
            mobilenet: {
                description: 'A MobileNetV2 architecture optimized for mobile and edge devices. Balances efficiency and accuracy.',
                parameters: 2300000,
                layers: [
                    { type: 'Input', shape: [32, 32, 3], parameters: 0 },
                    { type: 'Conv2D', filters: 32, kernelSize: '3x3', activation: 'ReLU6', parameters: 864 },
                    { type: 'InvResBlock', filters: 16, parameters: 5120 },
                    { type: 'InvResBlock', filters: 24, parameters: 19968 },
                    { type: 'InvResBlock', filters: 24, parameters: 25920 },
                    { type: 'InvResBlock', filters: 32, parameters: 24832 },
                    { type: 'InvResBlock', filters: 32, parameters: 33280 },
                    { type: 'InvResBlock', filters: 64, parameters: 67584 },
                    { type: 'GlobalAvgPool', parameters: 0 },
                    { type: 'Dense', units: 10, activation: 'Softmax', parameters: 650 }
                ]
            }
        }
    };

    /**
     * DOM Element References
     * =====================
     */
    const elements = {
        // Navigation and core UI
        tabs: document.querySelectorAll('.tab'),
        categoryContainer: document.getElementById('category-container'),
        
        // Training form and controls
        trainingForm: document.getElementById('training-form'),
        resetFormBtn: document.getElementById('reset-form-btn'),
        startTrainingBtn: document.getElementById('start-training-btn'),
        trainingLog: document.getElementById('training-log'),
        progressBar: document.getElementById('training-progress'),
        progressText: document.getElementById('progress-text'),
        
        // Model selection and details
        modelTypeSelect: document.getElementById('model-type'),
        modelDetailsContainer: document.createElement('div'),
        
        // Drawer and modal components
        imageDrawer: document.getElementById('image-drawer'),
        drawerContent: document.getElementById('drawer-content'),
        drawerClose: document.getElementById('drawer-close'),
        drawerBackdrop: document.createElement('div'),
        
        // Data controls
        refreshDataBtn: document.getElementById('refresh-data-btn'),
        
        // Models display
        modelsContainer: document.getElementById('models-container'),
        emptyModels: document.getElementById('empty-models'),
        
        // Header and scroll effects
        header: document.querySelector('.header'),
        
        // Dark mode toggle
        darkModeToggle: document.createElement('button')
    };

    // Add drawer backdrop to DOM
    if (elements.imageDrawer) {
        elements.drawerBackdrop.className = 'drawer-backdrop';
        document.body.appendChild(elements.drawerBackdrop);
        
        // Set up model details container
        if (elements.modelTypeSelect) {
            elements.modelDetailsContainer.className = 'model-details mt-4 p-4 border rounded bg-gray-50';
            elements.modelTypeSelect.parentNode.appendChild(elements.modelDetailsContainer);
        }
    }

    /**
     * Application State
     * ================
     */
    let state = {
        currentSet: config.defaultSet,
        training: {
            inProgress: false,
            progress: 0,
            currentEpoch: 0,
            totalEpochs: 10,
            model: null,
            startTime: null,
            endTime: null,
            logs: [],
            metrics: {
                trainAccuracy: [],
                valAccuracy: [],
                trainLoss: [],
                valLoss: []
            }
        },
        models: loadFromStorage('models') || [],
        dataRefreshing: false,
        darkMode: loadFromStorage('darkMode') || false,
        viewedCategories: loadFromStorage('viewedCategories') || []
    };

    /**
     * Initialization
     * =============
     */
    function initializeApp() {
        // Apply dark mode if enabled
        if (state.darkMode) {
            document.body.classList.add('dark-mode');
        }
        
        // Add dark mode toggle to header if not present
        addDarkModeToggle();
        
        // Render categories
        renderCategories();
        
        // Load saved models
        checkForSavedModels();
        
        // Initialize model details display
        updateModelDetails();
        
        // Add scroll event listener for header effects
        setupScrollEffects();
    }

    /**
     * Event Listeners and Handlers
     * ===========================
     */
    function setupEventListeners() {
        // Tab switching
        elements.tabs.forEach(tab => {
            tab.addEventListener('click', handleTabClick);
        });

        // Training form
        if (elements.resetFormBtn) {
            elements.resetFormBtn.addEventListener('click', resetTrainingForm);
        }

        if (elements.startTrainingBtn) {
            elements.startTrainingBtn.addEventListener('click', startTraining);
        }
        
        // Model type selection
        if (elements.modelTypeSelect) {
            elements.modelTypeSelect.addEventListener('change', updateModelDetails);
        }

        // Drawer close
        if (elements.drawerClose) {
            elements.drawerClose.addEventListener('click', closeDrawer);
        }
        
        // Drawer backdrop
        elements.drawerBackdrop.addEventListener('click', closeDrawer);

        // Refresh data
        if (elements.refreshDataBtn) {
            elements.refreshDataBtn.addEventListener('click', refreshData);
        }
        
        // Dark mode toggle
        elements.darkModeToggle.addEventListener('click', toggleDarkMode);
        
        // Window resize handler
        window.addEventListener('resize', handleWindowResize);
        
        // Keyboard shortcuts
        document.addEventListener('keydown', handleKeyboardShortcuts);
    }

    /**
     * Category Rendering and Handling
     * ==============================
     */
    function renderCategories() {
        if (!elements.categoryContainer) return;
        
        // Clear existing categories
        elements.categoryContainer.innerHTML = '';
        
        // Loop through each category and create a card
        config.categories.forEach(category => {
            const count = state.currentSet === 'train' ? category.trainCount : category.testCount;
            const viewedClass = state.viewedCategories.includes(category.name) ? 'category-viewed' : '';
            
            const card = document.createElement('div');
            card.className = `card category-card ${viewedClass}`;
            card.style.setProperty('--category-color', category.color);
            card.innerHTML = `
                <div class="category-icon" style="background-color: ${category.color}20; color: ${category.color}">
                    <i class="${category.icon}"></i>
                </div>
                <h3 class="card-title">${category.name.charAt(0).toUpperCase() + category.name.slice(1)}</h3>
                <div class="image-count">${count.toLocaleString()} images</div>
                <button class="btn btn-primary" data-category="${category.name}">
                    <i class="fas fa-images btn-icon"></i>
                    View Images
                </button>
            `;
            
            elements.categoryContainer.appendChild(card);
            
            // Add event listener to the button
            const button = card.querySelector('button');
            button.addEventListener('click', () => viewCategoryImages(category.name));
        });
        
        // Add animation effect to cards
        animateCategoryCards();
    }

    function animateCategoryCards() {
        const cards = elements.categoryContainer.querySelectorAll('.card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50 * index);
        });
    }

    function handleTabClick() {
        // Update active tab UI
        elements.tabs.forEach(tab => tab.classList.remove('active'));
        this.classList.add('active');
        
        // Update current set in state
        state.currentSet = this.dataset.tab;
        
        // Re-render categories with updated counts
        renderCategories();
    }

    function viewCategoryImages(category) {
        // Add to viewed categories list
        if (!state.viewedCategories.includes(category)) {
            state.viewedCategories.push(category);
            saveToStorage('viewedCategories', state.viewedCategories);
        }
        
        // In a production app, we would fetch images from the server
        // For now, navigate to the directory
        const url = `${config.baseUrl}${state.currentSet}/${category}/`;
        
        // Show notification tooltip
        showNotification(`Opening ${category} images...`, 'info');
        
        // Open in new tab
        window.open(url, '_blank');
    }

    /**
     * Model Training and Simulation
     * ============================
     */
    function updateModelDetails() {
        if (!elements.modelTypeSelect || !elements.modelDetailsContainer) return;
        
        // Get selected model type
        const modelType = elements.modelTypeSelect.value;
        const modelInfo = config.networkArchitectures[modelType];
        
        if (!modelInfo) return;
        
        // Generate HTML for model details
        let html = `
            <div class="model-info-card">
                <p class="text-sm mb-2">${modelInfo.description}</p>
                <div class="text-sm mb-2">Total Parameters: <span class="font-semibold">${numberWithCommas(modelInfo.parameters)}</span></div>
                <div class="model-architecture">
                    <div class="text-sm font-semibold mb-2">Architecture:</div>
                    <div class="layers-diagram">
        `;
        
        // Generate diagram for model layers
        modelInfo.layers.forEach(layer => {
            html += `
                <div class="layer-item" title="${layer.type}: ${layer.parameters} parameters">
                    <div class="layer-icon ${getLayerIconClass(layer.type)}"></div>
                    <div class="layer-details">
                        <div class="layer-name">${layer.type}</div>
                        <div class="layer-params text-xs">${numberWithCommas(layer.parameters)} params</div>
                    </div>
                </div>
            `;
        });
        
        html += `
                    </div>
                </div>
            </div>
        `;
        
        // Apply to container with animation
        elements.modelDetailsContainer.style.opacity = '0';
        setTimeout(() => {
            elements.modelDetailsContainer.innerHTML = html;
            elements.modelDetailsContainer.style.transition = 'opacity 0.3s ease';
            elements.modelDetailsContainer.style.opacity = '1';
            
            // Add custom styles for model diagram
            const style = document.createElement('style');
            style.textContent = `
                .model-info-card {
                    border: 1px solid var(--gray-200);
                    border-radius: var(--radius);
                    padding: 1rem;
                    background-color: white;
                }
                .layers-diagram {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    max-height: 200px;
                    overflow-y: auto;
                }
                .layer-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.5rem;
                    border: 1px solid var(--gray-200);
                    border-radius: var(--radius);
                    background-color: var(--gray-50);
                }
                .layer-icon {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 12px;
                }
                .layer-icon.conv {
                    background-color: #3b82f6;
                }
                .layer-icon.pool {
                    background-color: #10b981;
                }
                .layer-icon.dense {
                    background-color: #f59e0b;
                }
                .layer-icon.input {
                    background-color: #8b5cf6;
                }
                .layer-icon.flatten {
                    background-color: #64748b;
                }
                .layer-icon.resblock {
                    background-color: #ec4899;
                }
                .layer-icon.invresblock {
                    background-color: #0ea5e9;
                }
                .layer-icon.globalpool {
                    background-color: #14b8a6;
                }
                .layer-name {
                    font-weight: 500;
                    font-size: 0.875rem;
                }
                .layer-params {
                    color: var(--gray-500);
                }
            `;
            document.head.appendChild(style);
        }, 150);
    }

    function getLayerIconClass(layerType) {
        switch(layerType.toLowerCase()) {
            case 'conv2d': return 'conv';
            case 'maxpooling2d': return 'pool';
            case 'dense': return 'dense';
            case 'input': return 'input';
            case 'flatten': return 'flatten';
            case 'resblock': return 'resblock';
            case 'invresblock': return 'invresblock';
            case 'globalavgpool': return 'globalpool';
            default: return '';
        }
    }

    function resetTrainingForm() {
        if (!elements.trainingForm) return;
        
        // Reset the form
        elements.trainingForm.reset();
        
        // Reset the training log
        clearTrainingLog();
        logTrainingMessage('Training form reset. Ready to configure new training run.');
        
        // Reset the progress bar
        updateTrainingProgress(0, 'Training not started');
        
        // Update model details
        updateModelDetails();
    }

    function startTraining() {
        if (state.training.inProgress) {
            logTrainingMessage('Training already in progress. Please wait until it completes.', 'warning');
            return;
        }
        
        // Get form values
        const modelType = elements.modelTypeSelect.value;
        const batchSize = document.getElementById('batch-size').value;
        const epochs = document.getElementById('epochs').value;
        const learningRate = document.getElementById('learning-rate').value;
        const useFlip = document.getElementById('aug-flip').checked;
        const useRotation = document.getElementById('aug-rotation').checked;
        const useShift = document.getElementById('aug-shift').checked;
        
        // Update state
        state.training.inProgress = true;
        state.training.progress = 0;
        state.training.currentEpoch = 0;
        state.training.totalEpochs = parseInt(epochs);
        state.training.startTime = new Date();
        state.training.logs = [];
        state.training.metrics = {
            trainAccuracy: [],
            valAccuracy: [],
            trainLoss: [],
            valLoss: []
        };
        
        // Update UI
        elements.startTrainingBtn.disabled = true;
        elements.resetFormBtn.disabled = true;
        updateTrainingProgress(0, 'Training starting...');
        
        // Clear log and show initial messages
        clearTrainingLog();
        logTrainingMessage(`$ python train_model.py --model ${modelType} --batch-size ${batchSize} --epochs ${epochs} --learning-rate ${learningRate} ${useFlip ? '--use-flip' : ''} ${useRotation ? '--use-rotation' : ''} ${useShift ? '--use-shift' : ''}`, 'command');
        logTrainingMessage('Loading CIFAR-10 dataset...');
        
        // Simulate dataset loading
        setTimeout(() => {
            logTrainingMessage('Loaded 50000 training and 10000 test images.');
            logTrainingMessage(`Building ${modelType.toUpperCase()} model...`);
            
            // Show model architecture based on selection
            const architecture = config.networkArchitectures[modelType];
            if (architecture) {
                logTrainingMessage('Model architecture:');
                architecture.layers.forEach(layer => {
                    let layerStr = `- ${layer.type}`;
                    
                    if (layer.filters) layerStr += `: ${layer.filters} filters`;
                    if (layer.kernelSize) layerStr += `, ${layer.kernelSize} kernel`;
                    if (layer.size) layerStr += `: ${layer.size}`;
                    if (layer.units) layerStr += `: ${layer.units} units`;
                    if (layer.activation) layerStr += `, ${layer.activation} activation`;
                    if (layer.shape) layerStr += `: (${layer.shape.join(', ')})`;
                    
                    logTrainingMessage(layerStr);
                });
                
                logTrainingMessage(`Total parameters: ${numberWithCommas(architecture.parameters)}`);
            }
            
            logTrainingMessage(`Compiling model with adam optimizer and sparse_categorical_crossentropy loss`);
            logTrainingMessage('Training started. This may take several minutes...', 'success');
            
            // Simulate training epochs
            simulateTrainingEpochs();
        }, 1500);
    }

    function simulateTrainingEpochs() {
        const totalEpochs = state.training.totalEpochs;
        let currentEpoch = 0;
        
        // Function to simulate one epoch
        function runEpoch() {
            currentEpoch++;
            state.training.currentEpoch = currentEpoch;
            
            // Calculate progress
            const progress = Math.round((currentEpoch / totalEpochs) * 100);
            state.training.progress = progress;
            
            // Update UI
            updateTrainingProgress(progress, `Training progress: ${progress}% (Epoch ${currentEpoch}/${totalEpochs})`);
            
            // Generate realistic-looking metrics that improve over time
            // Start with lower accuracy that improves, with some natural variability
            const baseTrainAcc = 0.5;
            const baseValAcc = 0.45;
            const maxTrainAcc = 0.95;
            const maxValAcc = 0.9;
            const learningCurve = 1 - Math.exp(-currentEpoch / (totalEpochs * 0.4)); // Learning curve function
            
            const trainAcc = Math.min(baseTrainAcc + (maxTrainAcc - baseTrainAcc) * learningCurve + (Math.random() * 0.02 - 0.01), maxTrainAcc);
            const valAcc = Math.min(baseValAcc + (maxValAcc - baseValAcc) * learningCurve + (Math.random() * 0.03 - 0.015), maxValAcc);
            
            // Loss values decrease over time (start high, go low)
            const trainLoss = Math.max(1.5 - (1.3 * learningCurve) + (Math.random() * 0.05 - 0.025), 0.1);
            const valLoss = Math.max(1.7 - (1.4 * learningCurve) + (Math.random() * 0.08 - 0.04), 0.2);
            
            // Save metrics to state
            state.training.metrics.trainAccuracy.push(trainAcc);
            state.training.metrics.valAccuracy.push(valAcc);
            state.training.metrics.trainLoss.push(trainLoss);
            state.training.metrics.valLoss.push(valLoss);
            
            // Log epoch result
            logTrainingMessage(`Epoch ${currentEpoch}/${totalEpochs}: loss: ${trainLoss.toFixed(4)} - accuracy: ${trainAcc.toFixed(4)} - val_loss: ${valLoss.toFixed(4)} - val_accuracy: ${valAcc.toFixed(4)}`);
            
            // Continue if we have more epochs
            if (currentEpoch < totalEpochs) {
                const timePerEpoch = getRandomTimePerEpoch();
                setTimeout(runEpoch, timePerEpoch);
            } else {
                finishTraining(valAcc.toFixed(4));
            }
        }
        
        // Start the first epoch
        setTimeout(runEpoch, 1000);
    }

    function getRandomTimePerEpoch() {
        // Return a random time between 800ms and 1500ms to simulate variable epoch times
        return Math.floor(Math.random() * 700) + 800;
    }

    function finishTraining(finalAccuracy) {
        // Record end time
        state.training.endTime = new Date();
        const trainingTime = (state.training.endTime - state.training.startTime) / 1000; // in seconds
        
        // Log completion
        logTrainingMessage(`Training completed in ${formatTime(trainingTime)}.`, 'success');
        logTrainingMessage(`Final validation accuracy: ${finalAccuracy}`, 'success');
        
        // Generate a model name
        const modelType = elements.modelTypeSelect.value;
        const modelName = `CIFAR10_${modelType.toUpperCase()}_${formatDate(new Date())}`;
        
        // Generate model size based on architecture
        const modelSize = getModelSize(modelType);
        
        // Add to saved models
        const newModel = {
            id: Date.now(),
            name: modelName,
            type: modelType,
            accuracy: finalAccuracy,
            date: formatDate(new Date()),
            size: modelSize,
            description: getModelDescription(modelType),
            metrics: state.training.metrics
        };
        
        state.models.push(newModel);
        saveToStorage('models', state.models);
        
        // Update the models list
        renderModels();
        
        // Reset training state
        state.training.inProgress = false;
        state.training.model = newModel;
        
        // Update UI
        elements.startTrainingBtn.disabled = false;
        elements.resetFormBtn.disabled = false;
        updateTrainingProgress(100, `Training complete! Accuracy: ${finalAccuracy}`);
        
        logTrainingMessage(`Model saved as '${modelName}'`);
        
        // Show success notification
        showNotification(`Training complete! Model saved as ${modelName}`, 'success');
        
        // Show training visualization modal
        showTrainingVisualization(newModel);
    }

    function updateTrainingProgress(percent, text) {
        if (!elements.progressBar || !elements.progressText) return;
        
        elements.progressBar.style.width = `${percent}%`;
        elements.progressText.textContent = text;
    }

    function clearTrainingLog() {
        if (!elements.trainingLog) return;
        elements.trainingLog.innerHTML = '';
    }

    function logTrainingMessage(message, type = '') {
        if (!elements.trainingLog) return;
        
        // Add to training logs in state
        state.training.logs.push({
            message,
            type,
            timestamp: new Date()
        });
        
        // Create paragraph element
        const p = document.createElement('p');
        p.textContent = message;
        
        if (type) {
            p.classList.add(type);
        }
        
        // Add to DOM
        elements.trainingLog.appendChild(p);
        
        // Auto-scroll to the bottom
        elements.trainingLog.scrollTop = elements.trainingLog.scrollHeight;
    }

    /**
     * Models and Visualization
     * =======================
     */
    function showTrainingVisualization(model) {
        // Create modal element
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        // Create modal content
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">Training Results - ${model.name}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="model-summary mb-4">
                        <div class="text-center mb-4">
                            <div class="stat-value">${model.accuracy}</div>
                            <div class="text-sm">Final Validation Accuracy</div>
                        </div>
                        <div class="flex justify-between text-sm">
                            <div>Model Type: <span class="font-semibold">${model.type.toUpperCase()}</span></div>
                            <div>Size: <span class="font-semibold">${model.size}</span></div>
                        </div>
                    </div>
                    
                    <div class="training-charts">
                        <div class="chart-container">
                            <canvas id="accuracyChart"></canvas>
                        </div>
                        <div class="chart-container">
                            <canvas id="lossChart"></canvas>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline modal-close-btn">Close</button>
                    <button class="btn btn-primary download-btn">Download Model</button>
                </div>
            </div>
        `;
        
        // Add to DOM
        document.body.appendChild(modal);
        
        // Show modal with animation
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // Add event listeners
        const closeButtons = modal.querySelectorAll('.modal-close, .modal-close-btn');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.remove();
                }, 300);
            });
        });
        
        const downloadBtn = modal.querySelector('.download-btn');
        downloadBtn.addEventListener('click', () => {
            alert('In a full implementation, this would download the model file. This is a demo interface.');
        });
        
        // Create charts
        createTrainingCharts(model);
    }

    function createTrainingCharts(model) {
        // Check if Chart.js is available
        if (typeof Chart === 'undefined') {
            // Create a simplified version of charts using canvas
            createSimpleCharts(model);
            return;
        }
        
        // Accuracy chart
        const accuracyCtx = document.getElementById('accuracyChart').getContext('2d');
        new Chart(accuracyCtx, {
            type: 'line',
            data: {
                labels: Array.from({length: model.metrics.trainAccuracy.length}, (_, i) => i + 1),
                datasets: [
                    {
                        label: 'Training Accuracy',
                        data: model.metrics.trainAccuracy.map(val => val * 100),
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Validation Accuracy',
                        data: model.metrics.valAccuracy.map(val => val * 100),
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.2)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Accuracy Over Epochs'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        min: 0,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Accuracy (%)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Epoch'
                        }
                    }
                }
            }
        });
        
        // Loss chart
        // Loss chart
        const lossCtx = document.getElementById('lossChart').getContext('2d');
        new Chart(lossCtx, {
            type: 'line',
            data: {
                labels: Array.from({length: model.metrics.trainLoss.length}, (_, i) => i + 1),
                datasets: [
                    {
                        label: 'Training Loss',
                        data: model.metrics.trainLoss,
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.2)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Validation Loss',
                        data: model.metrics.valLoss,
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.2)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Loss Over Epochs'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Loss'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Epoch'
                        }
                    }
                }
            }
        });
    }

    function createSimpleCharts(model) {
        // Fallback for environments without Chart.js
        const accuracyCanvas = document.getElementById('accuracyChart');
        const lossCanvas = document.getElementById('lossChart');
        
        if (!accuracyCanvas || !lossCanvas) return;
        
        // Set canvas dimensions
        accuracyCanvas.width = accuracyCanvas.parentNode.clientWidth;
        accuracyCanvas.height = 300;
        lossCanvas.width = lossCanvas.parentNode.clientWidth;
        lossCanvas.height = 300;
        
        // Draw accuracy chart
        drawSimpleLineChart(
            accuracyCanvas,
            'Accuracy Over Epochs',
            Array.from({length: model.metrics.trainAccuracy.length}, (_, i) => i + 1),
            [
                {
                    data: model.metrics.trainAccuracy.map(val => val * 100),
                    color: '#3b82f6',
                    label: 'Training Accuracy'
                },
                {
                    data: model.metrics.valAccuracy.map(val => val * 100),
                    color: '#10b981',
                    label: 'Validation Accuracy'
                }
            ],
            '%'
        );
        
        // Draw loss chart
        drawSimpleLineChart(
            lossCanvas,
            'Loss Over Epochs',
            Array.from({length: model.metrics.trainLoss.length}, (_, i) => i + 1),
            [
                {
                    data: model.metrics.trainLoss,
                    color: '#ef4444',
                    label: 'Training Loss'
                },
                {
                    data: model.metrics.valLoss,
                    color: '#f59e0b',
                    label: 'Validation Loss'
                }
            ]
        );
    }

    function drawSimpleLineChart(canvas, title, labels, datasets, unit = '') {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const padding = { top: 40, right: 20, bottom: 40, left: 50 };
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw title
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(title, width / 2, 20);
        
        // Calculate chart area
        const chartArea = {
            x: padding.left,
            y: padding.top,
            width: width - padding.left - padding.right,
            height: height - padding.top - padding.bottom
        };
        
        // Find min/max values
        let minValue = Math.min(...datasets.flatMap(d => d.data));
        let maxValue = Math.max(...datasets.flatMap(d => d.data));
        
        // Add some padding to min/max
        minValue = Math.max(0, minValue - (maxValue - minValue) * 0.1);
        maxValue = maxValue + (maxValue - minValue) * 0.1;
        
        // Draw axes
        ctx.strokeStyle = '#d1d5db';
        ctx.lineWidth = 1;
        
        // Y-axis
        ctx.beginPath();
        ctx.moveTo(chartArea.x, chartArea.y);
        ctx.lineTo(chartArea.x, chartArea.y + chartArea.height);
        ctx.stroke();
        
        // X-axis
        ctx.beginPath();
        ctx.moveTo(chartArea.x, chartArea.y + chartArea.height);
        ctx.lineTo(chartArea.x + chartArea.width, chartArea.y + chartArea.height);
        ctx.stroke();
        
        // Draw grid lines and labels
        const ySteps = 5;
        ctx.fillStyle = '#6b7280';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'right';
        
        for (let i = 0; i <= ySteps; i++) {
            const yPos = chartArea.y + chartArea.height - (i / ySteps) * chartArea.height;
            const value = minValue + (i / ySteps) * (maxValue - minValue);
            
            // Grid line
            ctx.strokeStyle = '#e5e7eb';
            ctx.beginPath();
            ctx.moveTo(chartArea.x, yPos);
            ctx.lineTo(chartArea.x + chartArea.width, yPos);
            ctx.stroke();
            
            // Label
            ctx.fillText(`${value.toFixed(1)}${unit}`, chartArea.x - 5, yPos + 4);
        }
        
        // X-axis labels
        ctx.textAlign = 'center';
        const xStep = Math.ceil(labels.length / 10); // Show ~10 labels max
        
        for (let i = 0; i < labels.length; i += xStep) {
            const xPos = chartArea.x + (i / (labels.length - 1)) * chartArea.width;
            
            // Label
            ctx.fillText(labels[i].toString(), xPos, chartArea.y + chartArea.height + 15);
        }
        
        // Draw dataset lines
        datasets.forEach((dataset, datasetIndex) => {
            const { data, color } = dataset;
            
            // Draw line
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            for (let i = 0; i < data.length; i++) {
                const xPos = chartArea.x + (i / (data.length - 1)) * chartArea.width;
                const yPos = chartArea.y + chartArea.height - 
                    ((data[i] - minValue) / (maxValue - minValue)) * chartArea.height;
                
                if (i === 0) {
                    ctx.moveTo(xPos, yPos);
                } else {
                    ctx.lineTo(xPos, yPos);
                }
            }
            
            ctx.stroke();
            
            // Draw legend
            const legendY = chartArea.y + 15 + datasetIndex * 20;
            ctx.fillStyle = color;
            ctx.fillRect(width - padding.right - 60, legendY, 12, 12);
            
            ctx.fillStyle = '#1f2937';
            ctx.textAlign = 'left';
            ctx.fillText(dataset.label, width - padding.right - 45, legendY + 10);
        });
    }

    function checkForSavedModels() {
        // Load models from storage if available
        const savedModels = loadFromStorage('models');
        if (savedModels && savedModels.length > 0) {
            state.models = savedModels;
        } else if (state.models.length === 0) {
            // Add a sample model if no models exist
            state.models.push({
                id: 1,
                name: 'CIFAR10_CNN_Demo_Model',
                type: 'cnn',
                accuracy: '0.7825',
                date: '2025-05-18',
                size: '2.4 MB',
                description: 'A basic CNN model trained on CIFAR-10 with data augmentation. Used for image classification with 10 categories.',
                metrics: {
                    trainAccuracy: [0.52, 0.61, 0.67, 0.72, 0.76, 0.79, 0.82, 0.84, 0.85, 0.87],
                    valAccuracy: [0.48, 0.56, 0.63, 0.68, 0.71, 0.73, 0.75, 0.76, 0.77, 0.78],
                    trainLoss: [1.45, 1.20, 1.02, 0.85, 0.73, 0.60, 0.52, 0.45, 0.40, 0.35],
                    valLoss: [1.62, 1.35, 1.15, 0.98, 0.85, 0.77, 0.70, 0.66, 0.63, 0.60]
                }
            });
        }
        
        renderModels();
    }

    function renderModels() {
        if (!elements.modelsContainer) return;
        
        if (state.models.length === 0) {
            // Show empty state
            if (elements.emptyModels) {
                elements.emptyModels.style.display = 'block';
            }
            return;
        }
        
        // Hide empty state
        if (elements.emptyModels) {
            elements.emptyModels.style.display = 'none';
        }
        
        // Clear current models
        elements.modelsContainer.innerHTML = '';
        
        // Add each model
        state.models.forEach((model, index) => {
            const modelCard = document.createElement('div');
            modelCard.className = 'model-card';
            modelCard.dataset.id = model.id;
            modelCard.style.animationDelay = `${index * 100}ms`;
            
            modelCard.innerHTML = `
                <div class="model-info">
                    <div class="model-name">${model.name}</div>
                    <div class="model-meta">
                        <div class="model-meta-item">
                            <i class="fas fa-calendar-alt"></i>
                            <span>${model.date}</span>
                        </div>
                        <div class="model-meta-item">
                            <i class="fas fa-chart-line"></i>
                            <span>Accuracy: ${model.accuracy}</span>
                        </div>
                        <div class="model-meta-item">
                            <i class="fas fa-file"></i>
                            <span>${model.size}</span>
                        </div>
                    </div>
                    <div class="model-description">
                        ${model.description}
                    </div>
                </div>
                <div class="model-actions">
                    <button class="btn btn-sm btn-primary download-model" data-id="${model.id}">
                        <i class="fas fa-download btn-icon"></i>
                        Download
                    </button>
                    <button class="btn btn-sm btn-outline details-model" data-id="${model.id}">
                        <i class="fas fa-chart-bar btn-icon"></i>
                        Performance
                    </button>
                    <button class="btn btn-sm btn-danger delete-model" data-id="${model.id}">
                        <i class="fas fa-trash btn-icon"></i>
                    </button>
                </div>
            `;
            
            elements.modelsContainer.appendChild(modelCard);
            
            // Add event listeners to buttons
            modelCard.querySelector('.download-model').addEventListener('click', () => downloadModel(model.id));
            modelCard.querySelector('.details-model').addEventListener('click', () => showModelDetails(model.id));
            modelCard.querySelector('.delete-model').addEventListener('click', () => deleteModel(model.id));
            
            // Apply fade-in animation
            setTimeout(() => {
                modelCard.style.opacity = '1';
                modelCard.style.transform = 'translateY(0)';
            }, 50);
        });
    }

    function downloadModel(modelId) {
        // Find the model
        const model = state.models.find(m => m.id === modelId);
        
        if (!model) return;
        
        // In a real app, this would trigger a download
        // For our demo, we'll show a notification
        showNotification(`Downloading ${model.name}... (demo only)`, 'info');
        
        // Simulate download delay
        setTimeout(() => {
            showNotification(`Downloaded ${model.name} successfully!`, 'success');
        }, 2000);
    }

    function showModelDetails(modelId) {
        // Find the model
        const model = state.models.find(m => m.id === modelId);
        
        if (!model) return;
        
        // Create and show a visualization modal for this model
        showTrainingVisualization(model);
    }

    function deleteModel(modelId) {
        // Find the model
        const modelIndex = state.models.findIndex(m => m.id === modelId);
        
        if (modelIndex === -1) return;
        
        // Ask for confirmation
        const model = state.models[modelIndex];
        
        if (confirm(`Are you sure you want to delete the model "${model.name}"? This action cannot be undone.`)) {
            // Remove from array
            state.models.splice(modelIndex, 1);
            
            // Save to storage
            saveToStorage('models', state.models);
            
            // Update UI
            renderModels();
            
            // Show notification
            showNotification(`Model ${model.name} deleted.`, 'info');
        }
    }

    /**
     * UI Effects and Utilities
     * ======================
     */
    function refreshData() {
        if (state.dataRefreshing) return;
        
        state.dataRefreshing = true;
        elements.refreshDataBtn.disabled = true;
        elements.refreshDataBtn.innerHTML = '<i class="fas fa-sync-alt fa-spin btn-icon"></i> Refreshing...';
        
        // Show a notification
        showNotification('Refreshing dataset information...', 'info');
        
        // Simulate data refresh
        setTimeout(() => {
            state.dataRefreshing = false;
            elements.refreshDataBtn.disabled = false;
            elements.refreshDataBtn.innerHTML = '<i class="fas fa-sync-alt btn-icon"></i> Refresh Data';
            
            // Show a temporary alert
            const alert = document.createElement('div');
            alert.className = 'alert alert-success alert-dismissible';
            alert.innerHTML = `
                <i class="fas fa-check-circle alert-icon"></i>
                <div>
                    <strong>Data Refreshed!</strong> Dataset information is now up-to-date.
                </div>
                <button class="alert-dismiss">&times;</button>
            `;
            
            const section = elements.refreshDataBtn.closest('.section');
            section.insertBefore(alert, section.firstChild);
            
            // Add event listener to dismiss button
            alert.querySelector('.alert-dismiss').addEventListener('click', () => {
                alert.remove();
            });
            
            // Remove alert after a few seconds
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.classList.add('fade-out');
                    setTimeout(() => {
                        if (alert.parentNode) {
                            alert.remove();
                        }
                    }, 300);
                }
            }, 5000);
            
            // Show notification
            showNotification('Dataset information updated successfully!', 'success');
        }, 2000);
    }

    function showNotification(message, type = 'info') {
        // Create notification element if it doesn't exist
        let notificationContainer = document.getElementById('notification-container');
        
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'notification-container';
            notificationContainer.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 300px;
            `;
            document.body.appendChild(notificationContainer);
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background-color: white;
            color: var(--gray-800);
            padding: 12px 16px;
            border-radius: 6px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
            display: flex;
            align-items: center;
            gap: 12px;
            transform: translateX(120%);
            transition: transform 0.3s ease;
            border-left: 4px solid var(--${type});
            max-width: 100%;
        `;
        
        // Add icon based on type
        let iconClass = 'info-circle';
        if (type === 'success') iconClass = 'check-circle';
        if (type === 'warning') iconClass = 'exclamation-triangle';
        if (type === 'error') iconClass = 'exclamation-circle';
        
        notification.innerHTML = `
            <i class="fas fa-${iconClass}" style="color: var(--${type})"></i>
            <div>${message}</div>
            <button class="notification-close" style="
                background: none;
                border: none;
                font-size: 16px;
                cursor: pointer;
                color: var(--gray-500);
                margin-left: auto;
            ">&times;</button>
        `;
        
        // Add to container
        notificationContainer.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Add event listener to close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Auto-remove after delay
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(120%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }

    function setupScrollEffects() {
        if (!elements.header) return;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                elements.header.classList.add('scrolled');
            } else {
                elements.header.classList.remove('scrolled');
            }
        });
    }

    function addDarkModeToggle() {
        // Check if it's already added
        if (document.getElementById('dark-mode-toggle')) return;
        
        // Create toggle button
        elements.darkModeToggle.id = 'dark-mode-toggle';
        elements.darkModeToggle.className = 'btn btn-icon-only';
        elements.darkModeToggle.title = state.darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
        elements.darkModeToggle.innerHTML = state.darkMode ? 
            '<i class="fas fa-sun"></i>' : 
            '<i class="fas fa-moon"></i>';
        
        // Add custom styles
        elements.darkModeToggle.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 999;
            background-color: var(--primary);
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: var(--transition);
        `;
        
        // Add to DOM
        document.body.appendChild(elements.darkModeToggle);
    }

    function toggleDarkMode() {
        // Toggle dark mode state
        state.darkMode = !state.darkMode;
        
        // Update body class
        if (state.darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        // Update button icon
        elements.darkModeToggle.innerHTML = state.darkMode ? 
            '<i class="fas fa-sun"></i>' : 
            '<i class="fas fa-moon"></i>';
        
        elements.darkModeToggle.title = state.darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
        
        // Save preference
        saveToStorage('darkMode', state.darkMode);
        
        // Show notification
        showNotification(state.darkMode ? 'Dark mode enabled' : 'Light mode enabled', 'info');
    }

    function handleWindowResize() {
        // Adjust chart sizes if present
        const charts = document.querySelectorAll('.chart-container canvas');
        if (charts.length > 0) {
            charts.forEach(canvas => {
                const ctx = canvas.getContext('2d');
                const chart = Chart.getChart(canvas);
                if (chart) {
                    chart.resize();
                }
            });
        }
    }

    function handleKeyboardShortcuts(e) {
        // Keyboard shortcuts (with modifier keys to avoid interference)
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'd': // Ctrl+D or Cmd+D for dark mode toggle
                    e.preventDefault();
                    toggleDarkMode();
                    break;
                case 'r': // Ctrl+R or Cmd+R for refresh data
                    if (elements.refreshDataBtn && !elements.refreshDataBtn.disabled) {
                        e.preventDefault();
                        refreshData();
                    }
                    break;
            }
        }
        
        // Handle Escape key to close drawers/modals
        if (e.key === 'Escape') {
            const openDrawer = document.querySelector('.drawer.open');
            if (openDrawer) {
                closeDrawer();
                e.preventDefault();
                return;
            }
            
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                openModal.classList.remove('show');
                setTimeout(() => {
                    openModal.remove();
                }, 300);
                e.preventDefault();
            }
        }
    }

    /**
     * Helper Functions
     * ===============
     */
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.round(seconds % 60);
        return `${mins}m ${secs}s`;
    }

    function getModelSize(modelType) {
        // Return a realistic model size based on architecture
        const architecture = config.networkArchitectures[modelType];
        if (!architecture) return '5.0 MB';
        
        // Calculate size based on number of parameters (very rough approximation)
        const sizeInMB = (architecture.parameters * 4 / (1024 * 1024)).toFixed(1);
        return `${sizeInMB} MB`;
    }

    function getModelDescription(modelType) {
        const architecture = config.networkArchitectures[modelType];
        if (!architecture) {
            return 'A machine learning model trained on the CIFAR-10 dataset for image classification.';
        }
        
        return architecture.description;
    }

    function closeDrawer() {
        if (!elements.imageDrawer) return;
        
        elements.imageDrawer.classList.remove('open');
        elements.drawerBackdrop.classList.remove('show');
    }

    function saveToStorage(key, value) {
        try {
            const prefixedKey = config.storagePrefixKey + key;
            localStorage.setItem(prefixedKey, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    function loadFromStorage(key) {
        try {
            const prefixedKey = config.storagePrefixKey + key;
            const value = localStorage.getItem(prefixedKey);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    }

    /**
     * Initialize Application
     * =====================
     */
    initializeApp();
    setupEventListeners();
});
